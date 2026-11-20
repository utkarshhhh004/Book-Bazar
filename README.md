
# BOOK BAZAR

### A Multi-Vendor Online Marketplace for Books

Book Bazar is a multi-vendor online marketplace where users can discover, purchase, sell and publish books through a single platform.

The platform connects book buyers, independent sellers and authors, allowing individuals to participate in multiple marketplace activities using one account.

Whether someone wants to purchase a single book, sell their existing books, publish their own work, or perform all these activities together, Book Bazar provides a centralized platform to manage everything.

---

# 1. Project Vision

The vision of Book Bazar is to create a unified book marketplace where anyone can participate as a buyer, seller or author without maintaining separate accounts for different activities.

Unlike a traditional online bookstore, Book Bazar allows multiple independent sellers and authors to list their books on the same platform.

The platform manages the complete marketplace lifecycle, including book discovery, listings, inventory, shopping, checkout, payments, commissions, orders and delivery.

# 2. Core Platform Concept

## 2.1 One Account, Multiple Capabilities

**A single user account can perform multiple activities on Book Bazar.**

A user is not restricted to one role. The same account can purchase books, sell books and publish books.

For example:

| User   | Activities                           |
| ------ | ------------------------------------ |
| User A | Purchases books                      |
| User B | Sells books                          |
| User C | Publishes books as an author         |
| User D | Purchases and sells books            |
| User E | Purchases books and publishes books  |
| User F | Sells books and publishes books      |
| User G | Purchases, sells and publishes books |

All these activities are performed through one account.

### Important Principles

- A user registers only once.
- No separate accounts are required for buyers, sellers or authors.
- Every user can purchase books.
- Users can start selling books through the same account.
- Users can use author capabilities through the same account.
- Multiple capabilities can coexist.
- User capabilities and permissions are managed independently.
- Administrative privileges are separate from ordinary marketplace capabilities.

**Core Principle: One User Account → Buyer + Seller + Author (Any Combination).**

# 3. User Capabilities

## 3.1 Buyer

Users can purchase physical books from different sellers.

Features:

- Browse available books.
- Search books by title, author and category.
- Filter books by price and other available attributes.
- View book details and seller information.
- Add books to cart.
- Maintain a wishlist.
- Manage delivery addresses.
- Complete checkout.
- Make online payments.
- Track orders and shipments.
- View purchase history.
- Submit eligible book reviews.

## 3.2 Seller

Users can sell their physical books through the marketplace.

Features:

- Create book listings.
- Add book descriptions and images.
- Specify book condition.
- Set fixed selling prices.
- Manage inventory.
- Update or deactivate listings.
- View received orders.
- Manage seller-specific fulfillment.
- Track shipments.
- View sales history.
- View commission and earnings information.

## 3.3 Author

Authors can maintain their author presence on Book Bazar.

Initial capabilities:

- Create an author profile.
- Manage author information.
- Associate books with their author profiles.
- Make physical books available through the marketplace.

Future capabilities:

- Digital book publishing.
- Digital book distribution.
- Author publishing dashboard.
- Digital book library.

# 4. Business Model and Platform Rules

## 4.1 Marketplace Model

Book Bazar follows a multi-vendor marketplace model.

- Multiple sellers can list books.
- Buyers can purchase books from different sellers.
- One buyer checkout may contain listings from multiple sellers.
- The platform manages parent orders and seller-specific fulfillment.
- The platform coordinates payment and delivery workflows.

## 4.2 Fixed Pricing

All seller listings use fixed prices.

Buyer-seller negotiation is not included in the initial product.

## 4.3 Seller Commission

The standard seller commission is **10% of the eligible selling price**.

The applicable commission is calculated and recorded by the backend.

The treatment of shipping charges, taxes and discounts must follow the finalized commission calculation policy.

## 4.4 First-Transaction Entitlement

Each user account receives one first-transaction entitlement.

A successful purchase OR sale consumes this entitlement.

Rules:

1. The entitlement can be consumed only once per account.
2. A successful purchase consumes the entitlement.
3. A successful eligible sale consumes the entitlement.
4. The first eligible sale receives a seller commission waiver.
5. A purchase does not receive a buyer platform-fee waiver.
6. Failed transactions do not consume the entitlement.
7. Concurrent transactions must not consume the entitlement more than once.

## 4.5 Physical Book Delivery

Physical orders use platform-managed courier integration.

The platform coordinates shipment creation, tracking and delivery status through an external courier integration.

## 4.6 Configurable Launch Cities

Launch cities must be configurable through platform administration.

Cities must not be hardcoded into application logic.

## 4.7 Digital Publishing

Digital book publishing is planned for a future release.

The architecture reserves a dedicated module for this functionality without making it a dependency of the initial physical-book marketplace.

# 5. Major Platform Modules

| Module          | Responsibility                        |
| --------------- | ------------------------------------- |
| Authentication  | Registration, login and verification  |
| User Management | Accounts, profiles and capabilities   |
| Book Catalogue  | Book information and categories       |
| Marketplace     | Seller listings and inventory         |
| Search          | Book discovery and filtering          |
| Shopping Cart   | Cart management                       |
| Wishlist        | Saved books                           |
| Checkout        | Address and purchase workflow         |
| Orders          | Buyer orders and seller fulfillment   |
| Payments        | Payment initiation and verification   |
| Commission      | Seller commission and earnings        |
| Entitlements    | First-transaction entitlement         |
| Shipping        | Courier integration and tracking      |
| Reviews         | Ratings and feedback                  |
| Author          | Author profiles and book associations |
| Notifications   | Transactional notifications           |
| Administration  | Platform management and moderation    |

# 6. Technology Stack

The following technology stack is selected for the project.

## Frontend

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| React            | Component-based UI development    |
| JavaScript ES6+  | Frontend programming language     |
| Vite             | Development server and build tool |
| Tailwind CSS     | Styling and responsive design     |
| Lucide React     | Icons                             |
| React Router DOM | Client-side routing               |
| Axios            | HTTP communication                |
| TanStack Query   | Server-state management           |
| React Hook Form  | Form management                   |
| Zod              | Schema validation                 |

## Backend

| Technology      | Purpose                      |
| --------------- | ---------------------------- |
| Node.js         | JavaScript runtime           |
| Express.js      | REST API framework           |
| JavaScript ES6+ | Backend programming language |
| Mongoose        | MongoDB object modeling      |
| MongoDB         | NoSQL database               |
| JWT             | Authentication               |
| bcryptjs        | Password hashing             |
| Zod             | Request validation           |
| Multer          | File upload handling         |
| Helmet          | HTTP security headers        |
| Nodemailer      | Email communication          |

## Database and Development Tools

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| MongoDB         | Primary database                      |
| MongoDB Compass | Database visualization and management |
| MongoDB Atlas   | Managed production database           |
| Postman         | API testing                           |
| Git             | Version control                       |
| GitHub          | Source code hosting                   |

## Infrastructure and Deployment

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| Docker         | Application containerization  |
| Docker Compose | Multi-container orchestration |
| Nginx          | Reverse proxy and web serving |
| AWS            | Production hosting option     |

## Testing

| Technology            | Purpose             |
| --------------------- | ------------------- |
| Vitest                | Unit testing        |
| Supertest             | Backend API testing |
| React Testing Library | Component testing   |
| Playwright            | End-to-end testing  |
| Postman               | Manual API testing  |

**Technology Policy:** The active application stack uses JavaScript, MongoDB and Mongoose. TypeScript, PostgreSQL, Prisma and Redis are not part of the selected initial implementation.

# 7. System Architecture

Book Bazar follows a modular monolithic architecture.

The frontend and backend are separate applications maintained within a single repository.

```text
                    BOOK BAZAR
                         |
              +----------+----------+
              |                     |
          FRONTEND               BACKEND
              |                     |
       React + Vite            Node.js
       JavaScript              Express.js
       Tailwind CSS            JavaScript
       React Router            REST APIs
       Axios                   JWT
       TanStack Query          Mongoose
              |                     |
              +----------+----------+
                         |
                      MongoDB
                         |
              +----------+----------+
              |                     |
         MongoDB Compass       MongoDB Atlas
          Development           Production
```

## Architectural Principles

- Modular monolithic backend.
- Separation of frontend and backend.
- Feature-based module organization.
- Centralized API error handling.
- Backend-enforced authorization.
- Reusable frontend components.
- MongoDB data validation through Mongoose and application services.
- Secure handling of financial transactions.
- External service integrations through dedicated adapters.

# 8. Repository Structure

The planned repository structure is:

```text
Book-Bazar/
│
├── apps/
│   │
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
│   ├── database/
│   │   └── database-design.md
│   ├── api/
│   │   └── api-documentation.md
│   ├── business-rules/
│   ├── project-brief.md
│   ├── requirements.md
│   ├── feature-specification.md
│   ├── user-flow.md
│   ├── technical-specification.md
│   ├── development-roadmap.md
│   └── testing.md
│
├── infrastructure/
│   ├── docker/
│   └── nginx/
│
├── scripts/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

# 9. Prerequisites

Install the following software before development:

- Node.js 22 LTS
- npm 10 or newer
- Git
- Visual Studio Code
- Docker Desktop with Docker Compose
- MongoDB Compass

MongoDB Atlas will be used for managed production database hosting.

Verify installations:

```powershell
node --version
npm --version
git --version
docker --version
docker compose version
```

# 10. Local Development Setup

The following setup procedure applies after the application foundation and required scripts have been implemented.

## Step 1: Clone Repository

```powershell
git clone https://github.com/utkarshhhh004/Book-Bazar.git

cd Book-Bazar
```

## Step 2: Install Dependencies

```powershell
npm install
```

## Step 3: Configure Environment Variables

Create a local environment file using the provided template:

```powershell
Copy-Item .env.example .env
```

Configure the required environment variables.

Never commit `.env` or production credentials.

## Step 4: Start MongoDB

Start the local MongoDB development service using Docker Compose:

```powershell
docker compose up -d mongodb
```

The local MongoDB configuration must support a replica set for operations requiring MongoDB transactions.

## Step 5: Start the Application

Start the frontend and backend using the configured development scripts:

```powershell
npm run dev
```

Alternatively, use the individual application scripts once configured:

```powershell
npm run dev:web
npm run dev:api
```

## Step 6: Verify Services

Default development URLs:

| Service          | URL                                 |
| ---------------- | ----------------------------------- |
| Frontend         | http://localhost:5173               |
| Backend API      | http://localhost:4000               |
| API Health Check | http://localhost:4000/api/v1/health |
| MongoDB          | mongodb://localhost:27017           |

Actual ports and connection strings will be controlled through environment configuration.

# 11. Environment Configuration

The `.env.example` file will document the required configuration variables.

Expected configuration categories include:

```env
NODE_ENV=development
PORT=4000

WEB_URL=http://localhost:5173

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

UPLOAD_STORAGE_PROVIDER=
```

This is an illustrative configuration template. Exact variable names and required values will be finalized during backend implementation.

Never store real credentials in this example file.

# 12. Development Guidelines

All development must follow these principles:

1. Use JavaScript ES6+ throughout frontend and backend.
2. Keep frontend and backend responsibilities separate.
3. Follow modular architecture.
4. Keep business logic outside Express route handlers.
5. Validate incoming API requests using Zod.
6. Use Mongoose models for database operations.
7. Enforce authorization on the backend.
8. Verify resource ownership before modifications.
9. Store monetary values as integer paise, not floating-point values.
10. Verify payment status through trusted server-side verification.
11. Prevent duplicate financial operations through idempotency.
12. Never store card numbers, CVVs or UPI PINs.
13. Keep private uploads in protected storage.
14. Never commit credentials or production data.
15. Maintain existing functionality when implementing new features.
16. Test changes before committing.

# 13. Development Roadmap

Development will follow these major milestones:

| Milestone | Scope                                   |
| --------- | --------------------------------------- |
| 1         | Documentation and repository foundation |
| 2         | Backend and database foundation         |
| 3         | Frontend foundation                     |
| 4         | Authentication and user management      |
| 5         | Book catalogue and search               |
| 6         | Seller listings and inventory           |
| 7         | Cart and wishlist                       |
| 8         | Checkout and order management           |
| 9         | Payments, commissions and entitlements  |
| 10        | Courier and shipment integration        |
| 11        | Reviews, authors and notifications      |
| 12        | Administrator dashboard                 |
| 13        | Testing and quality assurance           |
| 14        | Dockerization and deployment            |
| 15        | Post-launch maintenance                 |

Refer to `docs/development-roadmap.md` for the detailed implementation plan.

# 14. Testing Strategy

Testing will cover:

- Unit testing.
- Frontend component testing.
- Backend API testing.
- Database integration testing.
- Authentication and authorization testing.
- Marketplace workflow testing.
- Payment and commission validation.
- Inventory concurrency testing.
- Entitlement validation.
- Security testing.
- Responsive UI testing.
- End-to-end testing.
- Regression testing.

Refer to `docs/testing.md` for the complete testing strategy.

# 15. Project Documentation

The `docs/` directory contains the detailed project specifications.

| Document                      | Purpose                                    |
| ----------------------------- | ------------------------------------------ |
| project-brief.md              | Project vision and overview                |
| requirements.md               | Functional and non-functional requirements |
| feature-specification.md      | Detailed module specifications             |
| user-flow.md                  | User journeys and workflows                |
| technical-specification.md    | Selected technology stack                  |
| system-design-architecture.md | System architecture                        |
| database-design.md            | MongoDB collection design                  |
| api-documentation.md          | REST API contracts                         |
| development-roadmap.md        | Development phases and milestones          |
| testing.md                    | Testing and quality assurance              |

This README provides the main project overview. Detailed implementation decisions are maintained in their respective documents.

# 16. Future Enhancements

Potential future capabilities include:

- Digital book publishing.
- Digital book distribution.
- Author libraries.
- Advanced book recommendations.
- Personalized book discovery.
- Loyalty and rewards.
- Promotional campaigns.
- Advanced seller analytics.
- Expanded marketplace integrations.

Future enhancements will be prioritized independently of the initial physical-book marketplace release.

# 17. Security and Production Readiness

Book Bazar is an actively developed software project.

Before accepting real users or payments, the application must undergo:

- Authentication and authorization verification.
- Security review.
- Payment integration testing.
- Courier integration testing.
- Financial reconciliation testing.
- Privacy and data-protection review.
- Database backup and recovery verification.
- Production deployment validation.

Production credentials, customer information and payment secrets must never be committed to the repository.

---

# BOOK BAZAR

**One Platform. One Account. Multiple Possibilities.**

A marketplace where everyone can discover, buy, sell and publish books.
