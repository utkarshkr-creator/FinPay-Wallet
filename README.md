# FinPay Wallet

FinPay Wallet is a monorepo digital wallet platform that lets consumers top up balances, perform peer-to-peer transfers, and lets banking partners confirm incoming deposits. It ships with:
- A customer-facing Next.js dashboard (`apps/user`) secured with credentials-based authentication
- A merchant onboarding portal (`apps/marchant`) that uses Google OAuth to register partner businesses
- A lightweight Express webhook listener (`apps/bank_webhook_handler`) that simulates bank notifications, unlocking funds once a payment clears
- Shared packages for the database client, UI kit, state management, linting, and TypeScript configuration

## Repository Layout
- `apps/user` – Wallet dashboard for end users (Next.js 14 App Router, NextAuth credentials provider, Recoil state)
- `apps/marchant` – Merchant portal (Next.js 14) with Google login that upserts merchants in the shared database
- `apps/bank_webhook_handler` – Express service receiving `/hdfcWebhook` callbacks and marking on-ramp transfers as successful
- `packages/db` – Prisma schema, client singleton, and seed data for PostgreSQL
- `packages/ui` – Shared React component library (buttons, cards, inputs, app bar, etc.)
- `packages/store` – Recoil atoms/hooks shared across apps
- `packages/utils` – Miscellaneous shared utilities and enums
- `packages/eslint-config`, `packages/typescript-config` – Repo-wide linting and TS settings

This project is orchestrated with Turborepo and expects Node.js 18+.

## Tech Stack
- Next.js 14 (App Router) + React 18
- NextAuth for authentication (credentials for users, Google OAuth for merchants)
- Prisma ORM backed by PostgreSQL
- Express 4 for webhook handling
- Tailwind CSS for styling, Recoil for client-side state
- Turborepo for monorepo task orchestration

## Prerequisites
- Node.js ≥ 18 and npm ≥ 10
- PostgreSQL database (local Docker container or hosted provider)
- Google OAuth credentials (for the merchant app) if you plan to test that flow

## Setup
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FinPay-Wallet
   ```
2. **Install dependencies** (root install covers all workspaces)
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy each `.env.example` file to `.env`
     ```bash
     cp packages/db/.env.example packages/db/.env
     cp apps/user/.env.example apps/user/.env
     cp apps/marchant/.env.example apps/marchant/.env
     ```
   - Update values as needed:
     - `packages/db/.env` – set `DATABASE_URL` for your PostgreSQL instance
     - `apps/user/.env` – set `JWT_SECRET`/`NEXTAUTH_URL`
     - `apps/marchant/.env` – provide `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET`
4. **Provision PostgreSQL**
   - Local Docker option:
     ```bash
     docker run -d \
       --name finpay-postgres \
       -e POSTGRES_PASSWORD=mysecretpassword \
       -p 5432:5432 postgres
     ```
   - Update the Prisma `DATABASE_URL` to match your container/hosted database details.
5. **Run Prisma migrations, seed data, and generate the client**
   ```bash
   cd packages/db
   npx prisma migrate dev --name init
   npx prisma db seed
   npx prisma generate
   cd ../..
   ```
   The seed script creates two demo wallet users:
   - Phone `1111111111`, password `alice`
   - Phone `2222222222`, password `bob`

## Running the Services
You can run each app individually or let Turborepo orchestrate them. Separate terminals keep logs clear.

### User wallet (Next.js, port 3000)
```bash
cd apps/user
npm run dev
```
The root route checks authentication: it redirects logged-in users to `/dashboard` and unauthenticated users to the NextAuth sign-in screen.

### Merchant portal (Next.js, port 3001)
```bash
cd apps/marchant
npm run dev
```
Complete the Google OAuth flow; successful logins are upserted into the shared `Merchant` table with the provider saved in `auth_type`.

### Bank webhook handler (Express, port 3003)
```bash
cd apps/bank_webhook_handler
npm run dev
```
This builds the TypeScript entry point with esbuild and starts the server. It listens for POST requests on `/hdfcWebhook` and unlocks balances for matching `OnRampTransaction` tokens.

> Tip: You can also run everything from the repo root with Turborepo filters, e.g. `npm run dev -- --filter web` for the user app, but running inside each workspace avoids filter lookups.

## Core Flows
- **Sign in as a user** – Visit `http://localhost:3000`, use phone `1111111111` / password `alice` (or register a new phone number; credentials provider will create the account).
- **Add money (on-ramp)** – On the `/transfer` page, select a bank and amount. This creates an `OnRampTransaction` with status `Processing` and opens the chosen bank site. Funds remain locked until the webhook confirms them.
- **Approve the on-ramp webhook** – In `packages/db`, run `npx prisma studio` to inspect tokens or copy one from the transaction list. Then trigger the webhook:
  ```bash
  curl -X POST http://localhost:3003/hdfcWebhook \
    -H "Content-Type: application/json" \
    -d '{
      "token": "token__1",
      "user_identifier": 1,
      "amount": "210"
    }'
  ```
  The handler increments the user balance and marks the transaction `Success`.
- **Peer-to-peer transfer** – Navigate to `/p2p` and send funds to another phone number (e.g. transfer from `1111111111` to `2222222222`). The server enforces sufficient balance, prevents self-transfers, and records each transfer via a Prisma transaction.
- **Check balances and history** – `/transfer` shows aggregate balance (unlocked, locked, total) and a history of on-ramp transactions. `/p2p` lists outgoing/incoming transfers.

## Environment Variable Reference
- `packages/db/.env`
  - `DATABASE_URL` – PostgreSQL connection string used by Prisma
- `apps/user/.env`
  - `JWT_SECRET` – NextAuth secret for signing JWTs
  - `NEXTAUTH_URL` – Base URL for the user app (e.g. `http://localhost:3000`)
- `apps/marchant/.env`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` – Google OAuth credentials
  - `NEXTAUTH_URL` – Base URL for the merchant app (e.g. `http://localhost:3001`)
  - `NEXTAUTH_SECRET` – Secret used by NextAuth when encrypting session/callback data

## Useful Commands
- `npm run dev` – Turborepo dev mode (accepts `--filter` to scope to a workspace)
- `npm run build` – Builds all workspaces
- `npm run lint` – Runs ESLint across packages/apps
- `npx prisma studio` (inside `packages/db`) – Inspect and edit data via Prisma Studio

## Troubleshooting
- If the Prisma commands fail, ensure your database is running and `DATABASE_URL` matches.
- The webhook handler requires the token to match an existing `OnRampTransaction` record; check via Prisma Studio if needed.
- For Google OAuth, verify Authorized redirect URIs include `http://localhost:3001/api/auth/callback/google`.


