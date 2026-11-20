# Book Bazar

### A Multi-Vendor Marketplace for Physical Books

Book Bazar is a multi-vendor online marketplace designed to connect book buyers, independent sellers, and authors through one unified platform.

Users can purchase books, sell their existing books, and publish their own physical books using a single account. Multiple capabilities can coexist without requiring separate accounts.

**Core Principle: One Account → Buyer + Seller + Author (Any Combination).**

---

## 1. Project Overview

### 1.1 Vision

To build a unified book marketplace where readers can discover and purchase books, sellers can reach buyers, and authors can make their publications available through a centralized platform.

### 1.2 Initial Product Scope

The initial release focuses on physical books:

- New books.
- Used books.
- Rare and collectible books.
- Academic, notes, and reference books.

Digital book publishing and distribution are planned for a future release.

Unauthorized photocopies, counterfeit books, and copyright-infringing content are prohibited.

### 1.3 User Capabilities

| Capability  | Responsibilities                                                            |
| ----------- | --------------------------------------------------------------------------- |
| Buyer       | Discover books, purchase, track orders, submit eligible reviews             |
| Seller      | Complete verification, publish listings, manage inventory and fulfil orders |
| Author      | Submit publications, provide ownership evidence and manage author profile   |
| Super Admin | Manage platform governance, moderation, verification and oversight          |

An ordinary account can have Buyer, Seller, and Author capabilities simultaneously. Super Admin access is separate.

Seller and Author capabilities are activated through their respective workflows. Public selling requires seller verification and public publishing requires author approval.

---

## 2. Core Marketplace Features

### Buyer

- Browse and search physical books.
- Filter and sort marketplace offers.
- View book details and multiple seller offers.
- Manage cart and wishlist.
- Manage delivery addresses.
- Purchase from multiple sellers in one checkout.
- Make online payments.
- Track orders and shipments.
- Access purchase history and receipts.
- Submit eligible verified-purchase reviews.
- Raise support requests and eligible disputes.

### Seller

- Activate seller capability.
- Complete individual or business verification.
- Create draft listings before verification.
- Publish listings after approval.
- Manage book information, condition, images, prices and inventory.
- Receive seller-specific orders.
- Select courier and manage dispatch.
- Enter tracking information and dispatch evidence.
- View commission, earnings and settlement history.
- Manage payout destination verification.

### Author

- Activate author capability.
- Maintain author profile.
- Submit physical book publications.
- Provide authorship and ownership declarations.
- Upload supporting evidence.
- Complete copyright, plagiarism and compliance review.
- Manage approved publication information.

### Super Admin

- Review seller verification applications.
- Review author publishing submissions.
- Moderate catalogue listings and reviews.
- Manage user restrictions and appeals.
- Oversee orders, disputes and refunds.
- Access financial reporting and reconciliation information.
- Configure platform policies.
- Review administrative audit logs.

---

## 3. Approved Business Rules

| Area                 | Approved Rule                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Marketplace          | Multi-vendor physical-book marketplace                                                    |
| Account              | One account with multiple capabilities                                                    |
| Pricing              | Fixed prices; negotiation excluded                                                        |
| Seller Commission    | Standard 10% of eligible net book selling price                                           |
| Commission Base      | Excludes delivery and separately collected taxes; seller-funded discounts reduce the base |
| First Transaction    | One shared successful purchase-or-sale entitlement per account                            |
| Checkout             | Unified multi-vendor checkout                                                             |
| Order Structure      | Parent order and independent seller orders                                                |
| Inventory            | No stock reservation in cart                                                              |
| Checkout Reservation | Atomic 15-minute inventory reservation                                                    |
| Delivery             | Seller-managed courier and tracking                                                       |
| Dispatch Target      | Within three business days after confirmed payment                                        |
| Return Window        | Three calendar days after delivery, subject to eligibility                                |
| Seller Settlements   | Weekly, with no minimum payout threshold                                                  |
| Reviews              | Verified purchasers after confirmed delivery                                              |
| Notifications        | In-app and email initially                                                                |
| Digital Books        | Future expansion                                                                          |

### Financial and Payment Rules

- All monetary values are stored as integer paise.
- Payment success must be verified server-side.
- Webhook signatures and idempotency must be enforced.
- Duplicate financial operations must be prevented.
- Refunds must be recorded separately from original receipts.
- Seller payouts require verified payout destinations and provider confirmation.
- Disputes, refunds, chargebacks and applicable holds affect payout eligibility.

**Payment provider status:** Cashfree Easy Split is a preferred candidate, not a finalized integration. Marketplace eligibility, UPI support, vendor onboarding, fees, refunds and settlement capabilities require confirmation before provider selection.

---

## 4. Technology Stack

The initial implementation uses JavaScript and a modular monolithic architecture.

### Frontend

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| React 19         | User interface                |
| JavaScript ES6+  | Frontend programming          |
| Vite             | Development and build tooling |
| Tailwind CSS 4   | Styling                       |
| React Router DOM | Client-side routing           |
| Axios            | HTTP communication            |
| TanStack Query   | Server-state management       |
| React Hook Form  | Form management               |
| Zod              | Schema validation             |
| Lucide React     | Icons                         |

### Backend

| Technology      | Purpose               |
| --------------- | --------------------- |
| Node.js         | JavaScript runtime    |
| Express.js 5    | REST API              |
| JavaScript ES6+ | Backend programming   |
| MongoDB         | Primary database      |
| Mongoose        | Object data modeling  |
| JWT             | Authentication        |
| bcryptjs        | Password hashing      |
| Zod             | Request validation    |
| Multer          | File upload handling  |
| Helmet          | HTTP security headers |
| Nodemailer      | Email communication   |

### Testing

| Technology            | Purpose             |
| --------------------- | ------------------- |
| Vitest                | Unit testing        |
| Supertest             | Backend API testing |
| React Testing Library | Component testing   |
| Playwright            | End-to-end testing  |
| Postman               | Manual API testing  |

### Infrastructure

| Technology     | Purpose                            |
| -------------- | ---------------------------------- |
| Git and GitHub | Version control and source hosting |
| Docker         | Containerization                   |
| Docker Compose | Local service orchestration        |
| Nginx          | Reverse proxy and web serving      |
| MongoDB Atlas  | Managed database hosting           |

**Technology policy:** The selected initial stack uses JavaScript, MongoDB and Mongoose. TypeScript, PostgreSQL, Prisma and Redis are not part of the approved initial implementation.

---

## 5. System Architecture

Book Bazar follows a **Modular Monolith** architecture.

The frontend and backend are independently organized applications within one npm workspace repository.

### Architecture Principles

- Separation of frontend and backend responsibilities.
- Feature-oriented frontend organization.
- Domain-separated backend modules.
- Centralized validation and error handling.
- Backend-enforced authentication and authorization.
- Database-backed marketplace functionality.
- Dedicated integration adapters for external services.
- Auditable financial operations.
- Versioned REST API contracts.

### High-Level Architecture

```text
                    BOOK BAZAR
                         |
             +-----------+-----------+
             |                       |
         React Web              Express API
             |                       |
      React Router          Middleware / Validation
      TanStack Query                 |
      Axios                  Domain Modules
                                     |
                           Application Services
                                     |
                              Mongoose Models
                                     |
                                  MongoDB
                                     |
                      +--------------+--------------+
                      |              |              |
                   Payments       Email         File Storage
                   Provider      Provider         Provider
```

External providers are integration dependencies. Their final selection and capabilities must be verified before implementation.

---

## 6. Repository Structure

The repository uses npm workspaces:

```text
Book-Bazar/
│
├── apps/
│   ├── web/
│   │   ├── public/
│   │   └── src/
│   │       ├── assets/
│   │       ├── components/
│   │       ├── features/
│   │       ├── hooks/
│   │       ├── layouts/
│   │       ├── pages/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── utils/
│   │       ├── App.jsx
│   │       └── main.jsx
│   │
│   └── api/
│       └── src/
│           ├── config/
│           ├── middleware/
│           ├── modules/
│           ├── services/
│           ├── integrations/
│           ├── utils/
│           ├── app.js
│           └── server.js
│
├── docs/
│   ├── architecture/
│   │   └── system-design-architecture.md
│   ├── api/
│   │   └── api-documentation.md
│   ├── authentication/
│   │   ├── feature-specification.md
│   │   ├── user-flow.md
│   │   ├── technical-specification.md
│   │   ├── database-design.md
│   │   ├── api-documentation.md
│   │   └── testing.md
│   ├── database/
│   │   └── database-design.md
│   ├── project-brief.md
│   ├── requirements.md
│   ├── feature-specification.md
│   ├── user-flow.md
│   ├── technical-specification.md
│   ├── development-roadmap.md
│   └── testing.md
│
├── infrastructure/
├── scripts/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

This is the intended architectural organization. The actual repository may contain additional files and folders as implementation progresses.

---

## 7. Prerequisites

Install:

- Node.js with a compatible LTS version.
- npm.
- Git.
- Visual Studio Code or another suitable IDE.
- Docker Desktop with Docker Compose.
- MongoDB Compass (optional).

Verify the installations:

```powershell
node --version
npm --version
git --version
docker --version
docker compose version
```

---

## 8. Local Development Setup

### Step 1 — Clone the Repository

```powershell
git clone https://github.com/utkarshhhh004/Book-Bazar.git

cd Book-Bazar
```

If the repository is already cloned, open its existing directory instead of cloning another copy.

### Step 2 — Install Dependencies

```powershell
npm install
```

### Step 3 — Configure Environment Variables

Create the root environment file from the template:

```powershell
Copy-Item .env.example .env
```

Populate the required values in `.env`.

Never commit `.env` or expose production credentials.

### Step 4 — Start MongoDB

The repository includes a Docker Compose MongoDB service configured with a replica set.

```powershell
docker compose up -d mongodb
```

Initialize the replica set using the configured setup service:

```powershell
docker compose run --rm mongodb-setup
```

Verify the MongoDB service:

```powershell
docker compose ps
```

The application must use a MongoDB connection string compatible with the configured local replica set.

### Step 5 — Start the Applications

Start frontend and backend together:

```powershell
npm run dev
```

Or start them separately:

```powershell
npm run dev:web
```

```powershell
npm run dev:api
```

### Step 6 — Build and Test

Build all configured workspaces:

```powershell
npm run build
```

Run configured workspace tests:

```powershell
npm test
```

These commands execute the scripts currently defined in the repository. Module-specific test coverage will expand as implementation progresses.

### Local Service Configuration

| Service          | Default                       |
| ---------------- | ----------------------------- |
| Frontend         | `http://localhost:5173`     |
| Backend          | Controlled by `PORT`        |
| MongoDB          | `mongodb://127.0.0.1:27017` |
| MongoDB Database | `bookbazar`                 |
| Replica Set      | `rs0`                       |

Actual application ports and API routes are controlled by the active configuration.

---

## 9. Environment Configuration

The root `.env.example` documents the initial environment variable names:

```env
NODE_ENV=
PORT=
WEB_URL=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CLIENT_URL=
```

Additional configuration may be introduced when integrations and production infrastructure are implemented.

Rules:

1. Never commit `.env`.
2. Never place real credentials in `.env.example`.
3. Never expose database credentials or JWT secrets.
4. Use separate development, test and production configuration.
5. Rotate credentials if they are accidentally exposed.
6. Validate required environment variables during application startup.

---

## 10. Development Guidelines

All development must follow these principles:

1. Use JavaScript ES6+ throughout the initial frontend and backend.
2. Maintain clear frontend/backend separation.
3. Follow the approved modular architecture.
4. Keep business logic outside Express route handlers.
5. Validate incoming requests.
6. Enforce authorization on the backend.
7. Verify resource ownership before modifications.
8. Store money as integer paise.
9. Verify payments through trusted server-side mechanisms.
10. Implement idempotency for financial operations.
11. Never store card numbers, CVVs or UPI PINs.
12. Protect private uploads.
13. Preserve existing authentication functionality.
14. Avoid fabricated marketplace inventory or transaction data.
15. Test changes before committing.
16. Update relevant documentation when business rules or technical contracts change.

---

## 11. Project Documentation

The `docs/` directory contains the approved project documentation.

| Document                                       | Purpose                                      |
| ---------------------------------------------- | -------------------------------------------- |
| `project-brief.md`                           | Project vision and overview                  |
| `requirements.md`                            | Functional and non-functional requirements   |
| `feature-specification.md`                   | Feature and module specifications            |
| `user-flow.md`                               | User journeys and workflows                  |
| `technical-specification.md`                 | Technology and implementation specifications |
| `architecture/system-design-architecture.md` | System architecture                          |
| `database/database-design.md`                | Database collections and relationships       |
| `api/api-documentation.md`                   | Versioned REST API contracts                 |
| `development-roadmap.md`                     | Development phases and milestones            |
| `testing.md`                                 | Testing and quality assurance                |

Authentication-specific documentation is maintained separately under `docs/authentication/` to preserve the existing authentication design and implementation context.

---

## 12. Development Roadmap

Development follows the approved phased roadmap:

1. Repository audit and baseline.
2. Foundation and infrastructure.
3. Authentication and account management.
4. Catalogue and marketplace discovery.
5. Seller onboarding and verification.
6. Listings and inventory.
7. Cart and checkout.
8. Payment integration.
9. Order and shipment management.
10. Returns, refunds and disputes.
11. Commission, earnings and settlements.
12. Author publishing.
13. Reviews and ratings.
14. Notifications and support.
15. Super Admin and governance.
16. Testing, security and compliance.
17. Production deployment.

Refer to `docs/development-roadmap.md` for dependencies, deliverables and completion criteria.

---

## 13. Quality Assurance

The project follows a layered testing strategy:

- Unit testing.
- Backend integration testing.
- Frontend component testing.
- API testing.
- Database consistency testing.
- End-to-end testing.
- Regression testing.
- Security and authorization testing.
- Performance and reliability testing.
- Deployment validation.

A feature is not considered complete merely because its code has been written. It must satisfy its acceptance criteria and pass relevant verification.

Refer to `docs/testing.md` for the complete testing strategy.

---

## 14. Security and Compliance

Before production launch, Book Bazar requires:

- Authentication and authorization verification.
- Secure session and token management.
- Payment provider verification.
- Webhook signature validation.
- Financial reconciliation.
- Inventory concurrency validation.
- Secure document and image uploads.
- Privacy and data-retention review.
- Indian consumer protection and marketplace compliance review.
- Tax and invoicing review by qualified professionals.
- Backup and disaster recovery validation.
- Production security testing.

Legal, tax and payment-provider requirements must be confirmed with qualified professionals and the selected providers before launch.

---

## 15. Future Enhancements

Potential future capabilities include:

- Digital book publishing and distribution.
- Secure digital book access.
- Author royalty management.
- Personalized book recommendations.
- Advanced seller analytics.
- Promotional campaigns.
- Loyalty and rewards.
- Expanded marketplace integrations.

Each future capability will require its own approved requirements and technical design before implementation.

---

## 16. Project Status

Book Bazar is under active development.

The architecture, business rules and project documentation establish the approved implementation direction. Individual modules must be implemented and verified according to the development roadmap.

The presence of a feature in this README or API documentation does not imply that the feature is already implemented or production-ready.

---

## Book Bazar

**One Platform. One Account. Multiple Possibilities.**

A marketplace where everyone can discover, buy, sell and publish books.

**Repository:** https://github.com/utkarshhhh004/Book-Bazar
