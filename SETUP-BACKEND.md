# Contact Form Backend Setup

The contact form is handled by the `business365day` Cloudflare Worker. It does not use PHP, a database, or Pages Functions. Secrets stay in Worker environment bindings and are never committed to the repository.

## 1. Set Up Resend

1. Create an account at [Resend](https://resend.com/).
2. Add `business365day.com` in Resend and complete the domain verification.
3. In Cloudflare DNS, add the exact records Resend provides. Resend commonly publishes DKIM and SPF records under a sending subdomain. Add those records as shown; do not replace or remove existing Zoho MX, SPF, DKIM, or mail-routing records. If a DNS name conflicts with a Zoho record, resolve it with the mail administrator before changing anything.
4. Create a Resend API key with permission to send mail from the verified domain. Treat it as a secret.

The Worker uses `customercare@business365day.com` for both the destination and sender by default. The visitor's address is used as `reply_to`.

## 2. Configure Turnstile

1. In the Cloudflare dashboard, open Turnstile and create a widget for the production site hostname.
2. Set the production site key in `src/config.js`, replacing `PASTE_YOUR_SITE_KEY_HERE`. The site key is public and may be included in client code.
3. Store the matching Turnstile secret key as a Worker secret; never put it in `src/config.js`, `wrangler.jsonc`, or another committed file.

For local development, Cloudflare documents the always-pass test pair:

- Test site key: `1x00000000000000000000AA` (already selected when Vite runs in development mode)
- Test secret key: `1x0000000000000000000000000000000AA`

These test keys accept Cloudflare's dummy token `XXXX.DUMMY.TOKEN.XXXX`, work on localhost and `127.0.0.1`, and are for testing only. Source: [Cloudflare Turnstile test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

## 3. Optional Telegram Notifications

1. In Telegram, message `@BotFather`, create a bot with `/newbot`, and save its token as a secret.
2. Send a message to the new bot. To obtain the chat ID, call the Bot API `getUpdates` endpoint using the token locally, or use a trusted Telegram client. Do not commit the token or include it in screenshots/logs.
3. Add the bot token and chat ID as Worker secrets. Telegram is optional; the form succeeds if either configured delivery channel succeeds.

## 4. Local Development

Install dependencies once:

```sh
npm install
```

Create the local-only secrets file from the example:

```powershell
Copy-Item .dev.vars.example .dev.vars
```

Edit `.dev.vars` and set at least:

```dotenv
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
RESEND_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

To run both servers together:

```sh
npm run dev:all
```

This runs Vite at `http://127.0.0.1:5500` and Wrangler at `http://127.0.0.1:8787`. The `dev:worker` command builds `dist/` first, starts Wrangler on port 8787, and the Vite `/api` proxy forwards API calls to it. Use a valid Resend API key or configure Telegram locally to test successful message delivery. Without a configured delivery channel, a validated request returns the expected `send_failed` response.

To run only the Worker locally:

```sh
npm run dev:worker
```

## 5. Configure Cloudflare Worker Secrets

In Cloudflare Dashboard, open **Workers & Pages → business365day → Settings → Variables and secrets**. Add these as **Secrets** (not plain-text variables):

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `TELEGRAM_BOT_TOKEN` (optional)
- `TELEGRAM_CHAT_ID` (optional; protect it as a secret as well)

The non-secret mail settings are configured in `wrangler.jsonc`: `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, and `SEND_CONFIRMATION`. Keep them as ordinary variables, not secrets.

## 6. Test After Deploying

1. Deploy the Worker and static assets using the configured Cloudflare Workers Builds workflow.
2. Ensure the production Turnstile site key in `src/config.js` matches the secret configured on the Worker.
3. Submit the Contact form with a valid Turnstile challenge and verify the inquiry arrives at `customercare@business365day.com`.
4. Confirm the visitor receives a confirmation email when `SEND_CONFIRMATION` is `true`.
5. If Telegram is configured, confirm its chat receives the summary. Test a failed delivery path as well; the Worker returns a generic error and does not log message contents, tokens, or IP addresses.
