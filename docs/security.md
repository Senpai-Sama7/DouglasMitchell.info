# Security & Secrets Runbook

This repository relies on signed API requests, rate-limited subscription handling, and optional transactional email delivery. Keep the following practices in place whenever updating or deploying the application.

## Secret Inventory
| Secret | Purpose | Required Environments | Rotation Cadence |
| --- | --- | --- | --- |
| `METRICS_API_KEY` / `NEXT_PUBLIC_METRICS_API_KEY` | Authorises reads from `GET /api/metrics`. Public variant lets Playwright/CI inject the key without exposing production secrets. | `.env.local`, Vercel prod/staging | Rotate quarterly or when shared with new consumers. |
| `SUBSCRIBE_API_KEY` / `NEXT_PUBLIC_SUBSCRIBE_API_KEY` | Protects `POST /api/subscribe` against unauthorised use. Public variant exists for test environments only. | `.env.local`, Vercel prod/staging | Rotate monthly or after each incident. |
| `RESEND_API_KEY` | Sends notification emails for new subscriptions. | Optional: Vercel prod/staging | Rotate monthly per provider guidance. |
| `RESEND_FROM_EMAIL` | Custom From address for Resend. | Optional: Vercel prod/staging | Update when changing branding. |
| `SUBSCRIBE_FORWARD_TO` | Destination mailbox for subscription alerts. | Optional: `.env.local`, Vercel prod/staging | Review quarterly to ensure inbox is monitored. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Backing store for rate limiting (`@upstash/ratelimit`). | Optional: `.env.local`, Vercel prod/staging | Rotate quarterly; revoke if credentials leak. |
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Neon connection strings for pooled/unpooled access. | `.env.local`, Vercel prod/staging | Per Neon policy; rotate immediately after credential resets. |

## Storage Guidance
- **Local development**: Store secrets in `.env.local`, which is git-ignored. Never commit secret values to the repository or store them in shell history.
- **Vercel deployments**: Configure all production and preview secrets via Vercel Project → Settings → Environment Variables. Avoid using Vercel CLI `vercel env pull` in shared terminals unless the output file is promptly deleted.
- **CI pipelines**: Use the hosting platform’s secure variable store; do not pass secrets via command arguments or plain text logs.

## Rotation Process
1. Update the secret in the upstream provider (Neon, Upstash, Resend, etc.).
2. Replace the value in Vercel project settings and any staging environments.
3. Update local `.env.local` if you actively run the affected service.
4. Trigger a redeploy (`npm run deploy`) or restart the local dev server so the new value is loaded.
5. Record the change in the security log (e.g., `logs/progress.md`) with timestamp and reason.

## Audit Checklist
- [ ] Secrets documented above are present (or intentionally omitted) for each environment.
- [ ] Unused secrets are removed from Vercel and local configs.
- [ ] `npm run lint` and `npm run build` succeed after secret changes (ensures config parsing still works).
- [ ] Access to Vercel/Upstash/Resend dashboards is scoped to least privilege.

Maintain this runbook as new integrations are added (e.g., analytics providers, feature flags) so rotations and incident response remain straightforward.
