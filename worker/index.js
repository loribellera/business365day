const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIAGNOSTIC_VARIABLE_NAMES = [
  "TURNSTILE_SECRET_KEY",
  "RESEND_API_KEY",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
  "SEND_CONFIRMATION",
  "DEBUG_CONTACT"
];
const CONFIRMATIONS = {
  en: {
    subject: "We received your inquiry",
    greeting: (name) => `Hello ${name},`,
    body: "We received your request and will reply soon. Here is a copy of your message:",
    closing: "Thank you, Business365Days"
  },
  fr: {
    subject: "Nous avons reçu votre demande",
    greeting: (name) => `Bonjour ${name},`,
    body: "Nous avons bien reçu votre demande et vous répondrons bientôt. Voici une copie de votre message :",
    closing: "Merci, Business365Days"
  },
  es: {
    subject: "Hemos recibido tu solicitud",
    greeting: (name) => `Hola ${name},`,
    body: "Hemos recibido tu solicitud y te responderemos pronto. Aquí tienes una copia de tu mensaje:",
    closing: "Gracias, Business365Days"
  }
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function logConfigurationPresence(env) {
  const presence = Object.fromEntries(DIAGNOSTIC_VARIABLE_NAMES.map((name) => [name, Boolean(env[name])]));
  console.info(`[contact] config ${JSON.stringify(presence)}`);
}

function originIsAllowed(request) {
  const originHeader = request.headers.get("Origin");
  if (!originHeader) return false;

  try {
    const origin = new URL(originHeader);
    const requestOrigin = new URL(request.url).origin;
    if (origin.origin === requestOrigin) return true;
    if (origin.protocol === "https:" && ["business365day.com", "www.business365day.com"].includes(origin.hostname)) return true;
    if (origin.protocol === "https:" && /^business365day\.[a-z0-9-]+\.workers\.dev$/i.test(origin.hostname)) return true;
    return origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname);
  } catch {
    return false;
  }
}

function validateSubmission(body) {
  const data = {
    name: readText(body.name),
    email: readText(body.email),
    service: readText(body.service),
    budget: readText(body.budget),
    details: readText(body.details),
    preferredDate: readText(body.preferredDate),
    preferredTime: readText(body.preferredTime),
    timezone: readText(body.timezone),
    lang: ["en", "fr", "es"].includes(body.lang) ? body.lang : "en",
    turnstileToken: readText(body.turnstileToken)
  };

  if (data.name.length < 1 || data.name.length > 100) return null;
  if (data.email.length < 1 || data.email.length > 150 || !EMAIL_PATTERN.test(data.email)) return null;
  if (data.service.length < 1 || data.service.length > 100) return null;
  if (data.budget.length < 1 || data.budget.length > 100) return null;
  if (data.details.length < 1 || data.details.length > 2000) return null;
  if (data.preferredDate.length > 32 || data.preferredTime.length > 32 || data.timezone.length > 100) return null;
  if (data.turnstileToken.length < 1 || data.turnstileToken.length > 4096) return null;
  return data;
}

async function runTimedStep(step, operation, timeoutMs, timeoutResult = (errorType) => ({ ok: false, status: errorType })) {
  const controller = new AbortController();
  const startedAt = Date.now();
  let timer;
  let timedOut = false;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
      reject(new Error("step_timeout"));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([operation(controller.signal), timeout]);
    console.info(`[contact] step=${step} duration_ms=${Date.now() - startedAt} http_status=${result.httpStatus ?? "none"} result=${result.ok ? "ok" : "failed"}`);
    return result;
  } catch {
    const errorType = timedOut || controller.signal.aborted ? "timeout" : "network_error";
    console.warn(`[contact] step=${step} duration_ms=${Date.now() - startedAt} error_type=${errorType}`);
    return timeoutResult(errorType);
  } finally {
    clearTimeout(timer);
  }
}

async function verifyTurnstile(token, secret, signal) {
  if (!secret) return { ok: false, status: "not_configured", httpStatus: null, errorCodes: ["missing-input-secret"], hostname: "" };
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
    signal
  });
  let result;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  const errorCodes = Array.isArray(result?.["error-codes"])
    ? result["error-codes"].filter((code) => typeof code === "string" && /^[a-z0-9-]{1,64}$/i.test(code))
    : [];
  const reportedHostname = typeof result?.hostname === "string" ? result.hostname : "";
  const hostname = /^[a-z0-9.-]{1,253}$/i.test(reportedHostname) ? reportedHostname.toLowerCase() : "";
  console.info(`[contact] turnstile_response http_status=${response.status} error_codes=${JSON.stringify(errorCodes)} hostname=${hostname || "none"}`);
  if (!response.ok) {
    return { ok: false, status: `http_${response.status}`, httpStatus: response.status, errorCodes, hostname };
  }
  return {
    ok: result?.success === true,
    status: result?.success === true ? "ok" : "turnstile_failed",
    httpStatus: response.status,
    errorCodes,
    hostname
  };
}

function emailFields(data, country, timestamp) {
  return [
    ["Name", data.name],
    ["Email", data.email],
    ["Service", data.service],
    ["Budget", data.budget],
    ["Preferred date", data.preferredDate],
    ["Preferred time", data.preferredTime],
    ["Timezone", data.timezone],
    ["Details", data.details],
    ["Language", data.lang],
    ["Visitor country", country],
    ["Received at (UTC)", timestamp]
  ];
}

function createInquiryEmail(data, country, timestamp) {
  const fields = emailFields(data, country, timestamp);
  const safeName = data.name.replace(/[\r\n]+/g, " ").slice(0, 100);
  const appointment = Boolean(data.preferredDate || data.preferredTime);
  const subject = `${appointment ? "New appointment request" : "New inquiry"} from ${safeName}`;
  const html = `<h2>${escapeHtml(subject)}</h2><table>${fields.map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value || "Not provided").replaceAll("\n", "<br>")}</td></tr>`).join("")}</table>`;
  const text = `${subject}\n\n${fields.map(([label, value]) => `${label}: ${value || "Not provided"}`).join("\n")}`;
  return { subject, html, text };
}

function createConfirmationEmail(data) {
  const copy = CONFIRMATIONS[data.lang];
  const greeting = copy.greeting(data.name);
  const details = data.details;
  return {
    subject: copy.subject,
    html: `<p>${escapeHtml(greeting)}</p><p>${escapeHtml(copy.body)}</p><blockquote>${escapeHtml(details).replaceAll("\n", "<br>")}</blockquote><p>${escapeHtml(copy.closing)}</p>`,
    text: `${greeting}\n\n${copy.body}\n\n${details}\n\n${copy.closing}`
  };
}

async function sendResend(env, message, data, signal, primaryState) {
  const startedAt = Date.now();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    signal,
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [message.to || env.CONTACT_TO_EMAIL],
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      subject: message.subject,
      html: message.html,
      text: message.text
    })
  });
  primaryState.httpStatus = response.status;
  primaryState.ok = response.ok;
  if (!response.ok) return { ok: false, status: `http_${response.status}`, httpStatus: response.status };

  if (env.SEND_CONFIRMATION?.toLowerCase() === "true") {
    const confirmationStartedAt = Date.now();
    const confirmation = createConfirmationEmail(data);
    try {
      const confirmationResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          "content-type": "application/json"
        },
        signal,
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: [data.email],
          subject: confirmation.subject,
          html: confirmation.html,
          text: confirmation.text
        })
      });
      console.info(`[contact] step=resend_confirmation duration_ms=${Date.now() - confirmationStartedAt} http_status=${confirmationResponse.status} result=${confirmationResponse.ok ? "ok" : "failed"}`);
    } catch {
      console.warn(`[contact] step=resend_confirmation duration_ms=${Date.now() - confirmationStartedAt} error_type=${signal.aborted ? "timeout" : "network_error"}`);
    }
  }
  return { ok: true, status: "ok", httpStatus: response.status };
}

async function sendTelegram(env, data, country, timestamp, signal) {
  const rows = emailFields(data, country, timestamp)
    .map(([label, value]) => `<b>${escapeHtml(label)}:</b> ${escapeHtml(value || "Not provided")}`);
  const startedAt = Date.now();
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal,
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      parse_mode: "HTML",
      text: `<b>New contact inquiry</b>\n${rows.join("\n")}`
    })
  });
  let result;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  const ok = response.ok && result?.ok === true;
  return {
    ok,
    status: !response.ok ? `http_${response.status}` : ok ? "ok" : "provider_error",
    httpStatus: response.status
  };
}

async function handleContact(request, env) {
  logConfigurationPresence(env);
  if (request.method !== "POST") return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);
  if (!originIsAllowed(request)) return jsonResponse({ ok: false, error: "invalid_origin" }, 403);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_request" }, 400);
  }

  if (readText(body?.website)) return jsonResponse({ ok: true });
  const data = validateSubmission(body || {});
  if (!data) return jsonResponse({ ok: false, error: "invalid_fields" }, 400);
  const turnstile = await runTimedStep(
    "turnstile",
    (signal) => verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY, signal),
    3500,
    (status) => ({ ok: false, status })
  );
  if (!turnstile.ok) {
    const debug = env.DEBUG_CONTACT?.toLowerCase() === "true";
    const reason = turnstile.errorCodes?.length
      ? turnstile.errorCodes.join(",").slice(0, 160)
      : turnstile.status || "verification_failed";
    return jsonResponse({
      ok: false,
      error: "turnstile_failed",
      ...(debug ? { reason } : {}),
      ...(debug ? { channels: { resend: "not_attempted", telegram: "not_attempted" } } : {})
    }, 403);
  }

  const country = readText(request.headers.get("CF-IPCountry") || "Unknown", 80);
  const timestamp = new Date().toISOString();
  const inquiry = createInquiryEmail(data, country, timestamp);
  const emailConfigured = Boolean(env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && env.CONTACT_TO_EMAIL);
  const telegramConfigured = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
  if (!emailConfigured) console.info("[contact] email channel skipped: not configured");
  if (!telegramConfigured) console.info("[contact] telegram channel skipped: not configured");

  const resendState = { ok: false, httpStatus: null };
  const resendPromise = emailConfigured
    ? runTimedStep(
      "resend",
      (signal) => sendResend(env, { ...inquiry, replyTo: data.email }, data, signal, resendState),
      8000,
      (errorType) => ({ ok: resendState.ok, status: resendState.ok ? "ok" : errorType, httpStatus: resendState.httpStatus })
    )
    : Promise.resolve({ ok: false, status: "not_configured", httpStatus: null });
  const telegramPromise = telegramConfigured
    ? runTimedStep("telegram", (signal) => sendTelegram(env, data, country, timestamp, signal), 8000)
    : Promise.resolve({ ok: false, status: "not_configured", httpStatus: null });
  const settled = await Promise.allSettled([resendPromise, telegramPromise]);
  const resend = settled[0].status === "fulfilled" ? settled[0].value : { ok: false, status: "network_error" };
  const telegram = settled[1].status === "fulfilled" ? settled[1].value : { ok: false, status: "network_error" };
  const channels = { resend: resend.status, telegram: telegram.status };
  const debug = env.DEBUG_CONTACT?.toLowerCase() === "true";
  if (!resend.ok && !telegram.ok) {
    return jsonResponse({ ok: false, error: "send_failed", ...(debug ? { channels } : {}) }, 502);
  }
  return jsonResponse({ ok: true, ...(debug ? { channels } : {}) });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") return handleContact(request, env);
    return env.ASSETS.fetch(request);
  }
};
