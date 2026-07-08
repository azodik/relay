# Azodik Relay

**Self-hosted transactional email control plane for Laravel teams on Amazon SES.**

Azodik Relay sits between your apps and SES: delivery logs, domain verification, API keys, webhooks, suppressions, and HTML/MIME previews—on infrastructure you control. Keep your existing AWS bill; add the dashboard and sending API SES does not ship with.

> **Thanks to [Larasend](https://github.com/savvyagents/larasend)** — Azodik Relay is based on [savvyagents/larasend](https://github.com/savvyagents/larasend), the open-source self-hosted transactional email platform for Laravel on Amazon SES. We're grateful to the Larasend team for the foundation this project builds on.

- **Dashboard** — activity, sent mail, bounces, complaints, suppressions, identities, templates, webhooks, API keys
- **HTTP API** — send and inspect mail with scoped, hashed API keys
- **Laravel package** — `MAIL_MAILER=relay` or `Relay::emails()->send([...])`
- **Docker** — one Compose file: app, queue worker, MariaDB, Redis

## Quick start (Docker)

```bash
curl -fsSL https://raw.githubusercontent.com/azodik/relay/main/docker-compose.yml -o docker-compose.yml
curl -fsSL https://raw.githubusercontent.com/azodik/relay/main/.env.example -o .env
```

Edit `.env`:

1. Set a strong `DB_PASSWORD` and keep `DB_USERNAME=relay` (do not use `root`—MariaDB already has one).
2. Generate and set `APP_KEY`:

   ```bash
   docker compose run --rm --entrypoint php app artisan key:generate --show
   ```

3. Set `APP_URL` to the public URL of this instance (for example `https://mail.yourcompany.com`).
4. For a private install, set `RELAY_SHOW_LANDING_PAGE=false` so `/` goes to sign-in instead of the marketing page.

Then:

```bash
docker compose up -d
```

If MariaDB was ever started with the wrong `DB_USERNAME` (for example `root`) or a different `DB_PASSWORD`, reset the database volume before trying again:

```bash
docker compose down -v
docker compose up -d
```

Relay listens on port **8080** by default (`RELAY_HTTP_PORT`). Open the URL, create the first owner account (registration is open until the first user exists), then:

1. Attach SES credentials (IAM user keys or instance/task role).
2. Verify a sending domain (DKIM / SPF / DMARC).
3. Create an API key and wire it into your Laravel apps.

Image: [`ghcr.io/azodik/relay`](https://ghcr.io/azodik/relay).

## Requirements

| Deploy path | Needs |
| --- | --- |
| Docker Compose | Docker Engine with Compose v2 |
| From source | PHP 8.4+, Composer, Node.js 22+, MariaDB/MySQL (or compatible), Redis recommended |

AWS: an SES-enabled account and IAM permissions to send mail, manage identities, read quotas, and receive SNS/event notifications for bounces and complaints.

## Send mail from Laravel

Install the client package in the app that sends mail (not required on the Relay server itself—it already vendors the package):

```bash
composer require azodik/relay
```

`.env`:

```env
MAIL_MAILER=relay
RELAY_API_KEY=lsk_live_...
RELAY_ENDPOINT=https://mail.yourcompany.com
RELAY_TIMEOUT=15
```

Use familiar Laravel mail:

```php
Mail::to($user)->send(new ReceiptMail($order));
```

Or the HTTP client:

```php
use Azodik\Relay\Facades\Relay;

Relay::emails()->send([
    'from' => 'receipts@yourcompany.com',
    'to' => [$user->email],
    'subject' => 'Your receipt',
    'html' => view('mail.receipt', compact('order'))->render(),
]);
```

Publish package config if you want a local copy:

```bash
php artisan vendor:publish --tag=relay-config
```

## HTTP API

Authenticate with `Authorization: Bearer <api-key>`.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/emails` | Send an email |
| `GET` | `/api/emails` | List emails for the key’s project |
| `GET` | `/api/emails/{id}` | Fetch one email (includes body/events when detailed) |

Example:

```bash
curl -X POST "$RELAY_ENDPOINT/api/emails" \
  -H "Authorization: Bearer $RELAY_API_KEY" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@yourcompany.com",
    "to": ["user@example.com"],
    "subject": "Hello",
    "html": "<p>Hi</p>"
  }'
```

SES event webhooks are posted to `/api/webhooks/ses/{token}` (token is per SES source—treat the URL as a secret).

## Configuration

Key environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `APP_KEY` | Laravel encryption key (**required**) |
| `APP_URL` | Public base URL of this Relay instance |
| `DB_*` | MariaDB/MySQL connection |
| `QUEUE_CONNECTION` | Use `database` or Redis-backed queue in production |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_DEFAULT_REGION` | SES credentials (prefer IAM roles in production) |
| `RELAY_SHOW_LANDING_PAGE` | `true` for marketing `/`; `false` for private installs |
| `RELAY_OPEN_REGISTRATION` | Keep public signup open after the first user (default invite-only) |
| `RELAY_API_KEY` / `RELAY_ENDPOINT` | Client → Relay (apps that send through Relay) |
| `RELAY_HTTP_PORT` | Host port mapped to the container (Compose, default `8080`) |
| `RELAY_IMAGE` | Override Compose image (default `ghcr.io/azodik/relay:latest`) |
| `RELAY_RUN_MIGRATIONS` | Entrypoint runs `migrate` when `true` (app service only) |

## Local development

```bash
git clone https://github.com/azodik/relay.git
cd relay
composer setup
```

`composer setup` installs PHP/JS deps, copies `.env` if missing, generates `APP_KEY`, migrates, and builds frontend assets.

Then either:

```bash
composer run dev
```

(server, queue, logs, and Vite), or point Herd/Valet at the project and run `npm run dev` + `php artisan queue:listen` separately.

Useful commands:

```bash
php artisan test --compact   # Pest
composer lint                # Pint
npm run lint / format / types:check
```

The Laravel mail transport package lives in `packages/relay-laravel` and is path-linked as `azodik/relay`.

## Stack

- Laravel 13, Fortify, Inertia.js 3 + React 19, Tailwind CSS 4
- Amazon SES (send + identity/DNS + events)
- MariaDB, Redis, queue workers
- Pest, Pint, ESLint, Prettier

## Security

Relay stores email content, delivery metadata, and (optionally) AWS credentials on your hosts. Report vulnerabilities privately—see [SECURITY.md](SECURITY.md).

Compliance note: self-hosting does not by itself make a deployment HIPAA- or otherwise certified; you remain responsible for BAAs, hardening, and access controls.

## Acknowledgments

Azodik Relay is derived from [Larasend](https://github.com/savvyagents/larasend) by [Savvy Agents](https://github.com/savvyagents). Larasend is MIT-licensed open source; see the [Larasend repository](https://github.com/savvyagents/larasend) for the original project.

## License

[MIT](LICENSE) © Azodik
