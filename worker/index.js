const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

function originIsAllowed(request) {
  const originHeader = request.headers.get("Origin");
  if (!originHeader) return false;

  try {
    const origin = new URL(originHeader);
    const requestOrigin = new URL(request.url).origin;
    if (origin.origin === requestOrigin) return true;
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

async function verifyTurnstile(token, secret) {
  if (!secret) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token })
    });
    if (!response.ok) return false;
    const result = await response.json();
    return result.success === true;
  } catch {
    return false;
  }
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

async function sendResend(env, message) {
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [message.to || env.CONTACT_TO_EMAIL],
        reply_to: message.replyTo,
        subject: message.subject,
        html: message.html,
        text: message.text
      })
    });
    if (!response.ok) console.error("Contact email delivery failed");
    return response.ok;
  } catch {
    console.error("Contact email delivery failed");
    return false;
  }
}

async function sendTelegram(env, data, country, timestamp) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;
  const rows = emailFields(data, country, timestamp)
    .map(([label, value]) => `<b>${escapeHtml(label)}:</b> ${escapeHtml(value || "Not provided")}`);
  try {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        parse_mode: "HTML",
        text: `<b>New contact inquiry</b>\n${rows.join("\n")}`
      })
    });
    if (!response.ok) console.error("Contact Telegram delivery failed");
    return response.ok;
  } catch {
    console.error("Contact Telegram delivery failed");
    return false;
  }
}

async function handleContact(request, env) {
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
  if (!(await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY))) {
    return jsonResponse({ ok: false, error: "turnstile_failed" }, 403);
  }

  const country = readText(request.headers.get("CF-IPCountry") || "Unknown", 80);
  const timestamp = new Date().toISOString();
  const inquiry = createInquiryEmail(data, country, timestamp);
  const emailConfigured = Boolean(env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && env.CONTACT_TO_EMAIL);
  const telegramConfigured = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
  const deliveryResults = await Promise.all([
    emailConfigured ? sendResend(env, { ...inquiry, replyTo: data.email }) : Promise.resolve(false),
    telegramConfigured ? sendTelegram(env, data, country, timestamp) : Promise.resolve(false)
  ]);

  if (deliveryResults[0] && env.SEND_CONFIRMATION?.toLowerCase() === "true") {
    await sendResend(env, { ...createConfirmationEmail(data), to: data.email });
  }

  if (!deliveryResults.some(Boolean)) return jsonResponse({ ok: false, error: "send_failed" }, 502);
  return jsonResponse({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") return handleContact(request, env);
    return env.ASSETS.fetch(request);
  }
};
