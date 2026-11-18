# BOOK BAZAR

A multi-vendor book marketplace where users can buy and sell physical books, and authors can publish physical and digital books.

## Product principles

- One account can act as a buyer, seller and author.
- Listings have fixed prices; buyer-seller negotiation is not part of the initial product.
- The standard seller commission is 10% of the eligible selling price.
- Each account receives one first-transaction entitlement. A successful purchase or sale consumes it. The initial implementation waives the seller commission on the first eligible sale; a purchase consumes the entitlement but has no buyer platform fee to waive.
- Physical orders use platform-managed courier integration.
- Digital publishing is planned as a later release, while the architecture reserves a dedicated module for it.
- Launch cities are configurable and must not be hardcoded into application logic.

## Technology

| Area | Technology |
|---|---|
| Frontend | React, Vite, TypeScript |
| UI | Tailwind CSS, Lucide React |
| Frontend data | TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache and jobs | Redis, BullMQ (introduced when needed) |
| Testing | Vitest, Supertest, Playwright |
| Infrastructure | Docker Compose for local services; AWS for production |

## Repository structure

```text
book-bazar/
├── apps/
│   ├── web/                 # React application
│   └── api/                 # Express API and Prisma schema
├── packages/
│   └── shared/              # Shared types, schemas and constants
├── infrastructure/
│   └── docker/              # Container-related configuration
├── docs/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   └── business-rules/
├── .github/workflows/       # CI workflows
├── docker-compose.yml
├── package.json
└── README.md
```

## Prerequisites

- Node.js 22 LTS
- npm 10 or newer
- Docker Desktop with Docker Compose
- Git

Check your versions:

```bash
node --version
npm --version
docker --version
docker compose version
```

## 1. Install dependencies

From the repository root:

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

The default local configuration is intended only for development. Replace secrets before using any shared or production environment.

## 3. Start PostgreSQL and Redis

```bash
docker compose up -d postgres redis
```

Check service status:

```bash
docker compose ps
```

## 4. Initialize the database

```bash
npm run db:generate
npm run db:migrate -- --name init
```

## 5. Start the applications

Run frontend and backend together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:web
npm run dev:api
```

Default local URLs:

- Frontend: http://localhost:5173
- API: http://localhost:4000
- Health check: http://localhost:4000/api/v1/health
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Useful commands

```bash
npm run build
npm run typecheck
npm run db:studio
npm run db:generate
npm run db:migrate -- --name migration_name
```

## Development conventions

- Keep business logic inside backend module services, not route handlers.
- Validate all external input at API boundaries.
- Enforce authorization and resource ownership on the backend.
- Store money as integer paise, never floating-point values.
- Verify payment status through trusted server-side provider webhooks.
- Never store card numbers, CVVs or UPI PINs.
- Keep private uploads in private object storage and issue short-lived access URLs.
- Do not commit `.env`, credentials, payment secrets or production data.
- Add migrations for database changes; do not edit production schemas manually.

## Current implementation status

### Milestone 1 – Foundation

- [x] Repository and workspace structure
- [x] README and environment template
- [x] Frontend starter
- [x] Backend starter and health endpoint
- [x] Local PostgreSQL and Redis services
- [x] Initial Prisma database model

### Upcoming milestones

1. Authentication, OTP verification and session management
2. User profiles, addresses and role-based authorization
3. Book catalogue, listings and inventory
4. Search, wishlist and cart
5. Checkout, orders, payments and commission ledger
6. Courier integration and delivery tracking
7. Admin operations, moderation and disputes
8. Digital publishing and author library
9. Automated testing, security review and deployment

## Security notice

This repository is a development starter, not a production-ready commerce system. Real payments, identity verification, courier settlement, refunds, privacy compliance and production security controls must be implemented and tested before accepting real users or money.
