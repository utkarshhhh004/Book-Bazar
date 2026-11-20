# Book Bazar — Development Roadmap

**Version:** 2.0
**Project:** Book Bazar
**Status:** Development Planning
**Architecture:** Modular Monolith
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Frontend:** React, Vite, Tailwind CSS 4

---

## 1. Roadmap Objectives

This roadmap defines the phased implementation strategy for Book Bazar. Development will proceed incrementally, ensuring that each module is documented, implemented, integrated, tested, and validated before dependent modules begin.

The primary objectives are:

- Preserve the existing repository and authentication functionality.
- Establish a stable application foundation.
- Build a database-backed multi-vendor physical-book marketplace.
- Implement secure payments, order management, seller settlements, and dispute handling.
- Introduce author publishing capabilities.
- Deliver a secure Super Admin environment.
- Prepare the platform for production deployment and future expansion.

## 2. Development Principles

1. **Incremental development:** Implement one module at a time.
2. **Documentation-first:** Update relevant specifications before major implementation changes.
3. **Backward compatibility:** Preserve existing working authentication and application functionality.
4. **Database-backed functionality:** Do not use fabricated marketplace inventory or transaction data.
5. **Security-first:** Enforce authentication, authorization, validation, and auditability.
6. **API consistency:** Maintain versioned REST APIs and standardized error responses.
7. **Test-driven verification:** Validate individual modules and their integration.
8. **Controlled deployment:** Do not deploy unverified changes to production.

## 3. Development Phases

### Phase 0 — Project Audit and Baseline

**Objective:** Establish the current repository state before implementation.

Tasks:

- Review existing repository structure and Git history.
- Verify root npm workspaces.
- Review frontend and backend entry points.
- Audit existing authentication implementation.
- Identify obsolete, duplicate, or incomplete configurations.
- Verify environment-variable handling without exposing secrets.
- Establish the baseline build and test status.
- Identify existing functionality that must remain operational.

Deliverables:

- Verified repository baseline.
- Existing functionality inventory.
- Identified technical debt and migration requirements.

Completion criteria:

- Existing application structure is understood.
- No existing functionality is removed without an approved reason.
- Baseline issues are documented.

### Phase 1 — Foundation and Infrastructure

**Objective:** Establish a reliable development foundation.

Tasks:

- Finalize frontend and backend workspace configuration.
- Configure centralized environment handling.
- Establish backend application structure.
- Configure MongoDB connection and Mongoose initialization.
- Implement centralized error handling.
- Implement request validation and response conventions.
- Configure Helmet, CORS, request logging, and security middleware.
- Configure frontend API client and routing.
- Configure TanStack Query.
- Establish shared UI components and application layouts.
- Configure automated code quality and CI checks.

Deliverables:

- Stable frontend and backend foundation.
- Database connectivity.
- Shared API and error-handling infrastructure.
- Working development environment.

### Phase 2 — Authentication and Account Management

**Objective:** Provide secure registration, login, and account management.

Tasks:

- Audit and preserve existing authentication functionality.
- Registration and email verification.
- Login and logout.
- Password hashing and secure password verification.
- Password reset.
- Session management and token lifecycle.
- Profile management.
- Account status and security controls.
- Address management.
- Capability-aware authorization.
- Authentication rate limiting and security testing.

Deliverables:

- Complete authentication module.
- User profile and address management.
- Secure capability-based authorization.

Completion criteria:

- Authentication workflows pass integration tests.
- Unauthorized access is rejected.
- Existing authentication data remains compatible.

### Phase 3 — Catalogue and Marketplace Discovery

**Objective:** Build the central book catalogue and discovery experience.

Tasks:

- Book catalogue schema and APIs.
- Category and language management.
- Author and publisher metadata.
- ISBN support where available.
- Book condition and edition information.
- Search, filtering, sorting, and pagination.
- Book details page.
- Multiple seller offers for one catalogue book.
- Visibility based on active seller listings.
- Empty, loading, and error states.

Deliverables:

- Database-backed catalogue.
- Marketplace browsing and search.
- Book details and seller offer presentation.

Completion criteria:

- Catalogue data is retrieved from MongoDB.
- Inactive or unavailable offers are handled correctly.
- Search and filters return consistent results.

### Phase 4 — Seller Onboarding and Verification

**Objective:** Enable individuals and businesses to become verified marketplace sellers.

Tasks:

- Seller capability activation.
- Individual seller onboarding.
- Business seller onboarding.
- Progressive KYC workflow.
- Document and evidence uploads.
- Seller verification status management.
- Verification review and rejection reasons.
- UPI VPA submission and verification workflow.
- Seller dashboard.
- Audit trail for verification decisions.

Deliverables:

- Seller onboarding module.
- Verification workflow.
- Seller dashboard and account status management.

Completion criteria:

- Draft listing creation is available before verification.
- Public selling requires successful verification.
- Unverified sellers cannot publish active listings.

### Phase 5 — Seller Listings and Inventory

**Objective:** Enable sellers to create and manage book offers.

Tasks:

- Seller listing creation and editing.
- New, used, rare, collectible, and academic book conditions.
- Mandatory catalogue and listing fields.
- Cover and actual-condition image uploads.
- Defect and condition disclosure.
- Fixed selling price.
- Inventory quantity management.
- Listing approval and moderation.
- Listing activation, suspension, and removal.
- Stock consistency and validation.

Deliverables:

- Seller listing management.
- Inventory management.
- Public seller offers.

Completion criteria:

- Only approved and eligible listings become publicly available.
- Inventory updates are reflected in marketplace results.
- Listing validation prevents incomplete or invalid offers.

### Phase 6 — Cart and Checkout

**Objective:** Implement unified multi-vendor purchasing.

Tasks:

- Add, update, and remove cart items.
- Validate listing availability and price.
- Recalculate totals on the server.
- Apply shipping charges and applicable taxes.
- Support multiple sellers in one cart.
- Create parent order and seller-specific order records.
- Atomically reserve inventory at checkout.
- Implement 15-minute reservation expiry.
- Release expired reservations explicitly.
- Prevent overselling and concurrent stock conflicts.
- Implement checkout idempotency.

Deliverables:

- Unified shopping cart.
- Multi-vendor checkout.
- Inventory reservation mechanism.
- Parent and seller order creation.

Completion criteria:

- Multiple sellers can be checked out in one transaction.
- Stock is reserved atomically.
- Expired reservations release inventory.
- Cart contents alone do not reserve stock.

### Phase 7 — Payment Integration

**Objective:** Implement secure payment processing and verification.

Tasks:

- Evaluate Cashfree Easy Split against marketplace requirements.
- Obtain written confirmation of vendor onboarding, UPI support, settlement timing, fees, refunds, and eligibility.
- Finalize payment provider only after evaluation.
- Implement payment order creation.
- Implement payment attempts and retries.
- Verify provider responses on the backend.
- Implement webhook signature verification.
- Implement webhook idempotency.
- Handle duplicate, delayed, and failed events.
- Handle late payment success after reservation expiry.
- Implement payment reconciliation.
- Generate server-verified payment receipts.
- Support separate refund records.

Deliverables:

- Payment integration.
- Verified payment state management.
- Payment reconciliation.
- Receipt generation.

Completion criteria:

- Client-side payment success is never trusted independently.
- Duplicate webhooks cannot duplicate financial operations.
- Payment and order states remain consistent.
- Provider-specific integration passes sandbox testing.

**Dependency:** Final provider selection and commercial/technical confirmation.

### Phase 8 — Order and Shipment Management

**Objective:** Manage the complete order lifecycle.

Tasks:

- Parent order management.
- Independent seller order management.
- Seller order dashboard.
- Seller-managed courier selection.
- Dispatch confirmation and evidence.
- Tracking information.
- Three-business-day dispatch target.
- Late dispatch reminders and escalation.
- Buyer shipment notifications.
- Shipment status updates.
- Delivery confirmation.
- Order history and details.
- Cancellation handling according to approved policy.

Deliverables:

- Buyer order management.
- Seller order management.
- Shipment tracking and status management.

Completion criteria:

- Each seller shipment is independently managed.
- Parent order status reflects its seller orders accurately.
- Dispatch and delivery transitions are validated.

### Phase 9 — Returns, Refunds, and Disputes

**Objective:** Implement evidence-based post-purchase issue resolution.

Tasks:

- Return eligibility validation.
- Three-calendar-day return request window.
- Return reason selection.
- Evidence and image submission.
- Buyer and seller dispute communication.
- Admin review and decision workflow.
- Refund initiation through the payment provider.
- Refund status tracking.
- Chargeback and payment dispute handling.
- Financial and operational audit logs.
- Escalation and statutory compliance.

Deliverables:

- Return management.
- Refund management.
- Dispute resolution module.

Completion criteria:

- Return requests follow approved eligibility rules.
- Refund completion is provider-verified.
- Dispute decisions and financial changes are auditable.
- Applicable Indian consumer rights are respected.

### Phase 10 — Commission, Earnings, and Settlements

**Objective:** Implement seller earnings and payout management.

Tasks:

- Calculate platform commission.
- Implement the 10% commission rule.
- Exclude delivery and separately collected taxes from commission calculation.
- Apply seller-funded discounts before commission calculation.
- Implement first-transaction entitlement.
- Calculate eligible seller earnings.
- Apply delivery, return-window, dispute, and chargeback holds.
- Generate weekly settlement batches.
- Verify seller payout destinations.
- Process payouts through the selected provider.
- Reconcile settlement results.
- Provide seller earnings and transaction history.
- Maintain immutable financial audit records.

Deliverables:

- Commission calculation engine.
- Seller earnings ledger.
- Weekly payout workflow.
- Settlement reconciliation.

Completion criteria:

- Financial calculations use integer paise.
- No payout is marked successful without provider confirmation.
- Duplicate payout processing is prevented.
- Settlement records are auditable.

**Dependency:** Payment provider capabilities and settlement approval.

### Phase 11 — Author Publishing

**Objective:** Enable approved authors to publish physical books.

Tasks:

- Author capability activation.
- Author profile management.
- Manuscript and publication submission.
- Authorship and ownership declarations.
- Evidence uploads.
- Copyright and plagiarism review.
- Legal and content compliance review.
- Author approval workflow.
- Printing and fulfilment responsibility declarations.
- Publication approval.
- Catalogue integration.
- Author dashboard and publication history.

Deliverables:

- Author onboarding.
- Publication submission and review.
- Public author profiles.
- Approved publication catalogue entries.

Completion criteria:

- Author approval is independent of seller verification.
- Unauthorized or infringing submissions are rejected.
- Public author profiles become available after the first approved publication.

### Phase 12 — Reviews and Ratings

**Objective:** Establish a verified-purchase review system.

Tasks:

- Review eligibility validation.
- Book ratings.
- Seller ratings.
- Optional written feedback.
- Optional photo uploads.
- Review editing within the approved three-day window.
- Review deletion by the review author.
- Review reporting.
- Moderation and removal.
- Verified-purchase indicators.

Deliverables:

- Book review system.
- Seller rating system.
- Moderation workflow.

Completion criteria:

- Only eligible verified purchasers can submit reviews.
- Book and seller ratings remain separate.
- Review operations are validated and auditable.

### Phase 13 — Notifications and Support

**Objective:** Provide transactional communication and customer assistance.

Tasks:

- In-app notification infrastructure.
- Email notification infrastructure.
- Notification preferences.
- Order and payment notifications.
- Shipment and delivery notifications.
- Return and refund notifications.
- Security notifications.
- Seller verification notifications.
- Support ticket creation.
- Ticket assignment and status management.
- Contact and grievance mechanism.

Deliverables:

- In-app notifications.
- Email notifications.
- Support and grievance module.

Completion criteria:

- Essential transactional and security notifications cannot be improperly disabled.
- Notification delivery failures are handled.
- Support requests are traceable.

### Phase 14 — Super Admin and Governance

**Objective:** Provide secure platform-wide administration.

Tasks:

- Dedicated Super Admin login.
- Controlled Super Admin provisioning.
- Mandatory multi-factor authentication.
- Secure account recovery.
- Role and capability restrictions.
- Seller verification management.
- Author approval management.
- Listing moderation.
- User restriction and appeal management.
- Order and dispute oversight.
- Financial reporting and reconciliation visibility.
- Policy configuration and effective dates.
- Audit logs for sensitive operations.
- Administrative dashboard and analytics.

Deliverables:

- Super Admin application area.
- Administrative workflows.
- Audit and governance controls.

Completion criteria:

- Admin access is isolated from normal user login.
- Financial actions cannot be fabricated through administrative controls.
- Sensitive operations require appropriate authorization and audit records.

### Phase 15 — Testing, Security, and Compliance

**Objective:** Validate platform reliability and production readiness.

Tasks:

- Unit testing.
- API integration testing.
- Frontend component testing.
- End-to-end testing.
- Database consistency testing.
- Payment and webhook testing.
- Inventory concurrency testing.
- Authorization and access-control testing.
- File-upload security testing.
- Performance and load testing.
- Accessibility testing.
- Backup and recovery testing.
- Security review.
- Privacy review.
- Indian legal, tax, and consumer compliance review.

Deliverables:

- Automated test suite.
- Security and compliance review records.
- Release-readiness report.

Completion criteria:

- Critical business workflows pass.
- No unresolved critical security issues.
- Payment and inventory consistency are verified.
- Legal and tax requirements are reviewed by qualified professionals.

### Phase 16 — Production Deployment

**Objective:** Release the validated application.

Tasks:

- Finalize hosting infrastructure.
- Configure production environment variables.
- Configure production MongoDB.
- Configure domain and HTTPS.
- Configure frontend and backend deployment.
- Configure secure file storage.
- Configure CI/CD pipelines.
- Configure monitoring and error reporting.
- Configure database backups.
- Configure logging and alerting.
- Execute production smoke tests.
- Establish rollback procedures.

Deliverables:

- Production-ready Book Bazar deployment.
- CI/CD pipeline.
- Monitoring and backup strategy.
- Deployment and rollback documentation.

Completion criteria:

- Production build and smoke tests pass.
- Secrets are securely managed.
- Backups and recovery procedures are verified.
- Critical user workflows work in production.

## 4. Future Expansion — Digital Publishing

Digital books are outside the initial marketplace release.

Potential future capabilities:

- Digital book formats and secure storage.
- Digital product licensing.
- Secure download access.
- Purchase-linked digital entitlements.
- Reading experience.
- DRM and content protection evaluation.
- Digital royalties and settlement.
- Expanded author publishing tools.

This phase will require separate product, technical, security, and legal specifications before implementation.

## 5. Dependency Overview

| Module              | Depends On                            |
| ------------------- | ------------------------------------- |
| Authentication      | Foundation                            |
| Catalogue           | Foundation, Database                  |
| Seller Verification | Authentication, File Uploads          |
| Listings            | Catalogue, Seller Verification        |
| Cart                | Catalogue, Listings, Inventory        |
| Checkout            | Cart, Inventory, Order Models         |
| Payments            | Checkout, Provider Selection          |
| Shipments           | Orders, Seller Accounts               |
| Returns             | Orders, Shipments, Payments           |
| Settlements         | Payments, Orders, Returns             |
| Author Publishing   | Authentication, Catalogue, Moderation |
| Reviews             | Orders, Delivery Status               |
| Notifications       | Authentication, Orders, Payments      |
| Super Admin         | Authentication, Audit Infrastructure  |
| Production          | Testing, Security, Compliance         |

## 6. Milestone Strategy

| Milestone | Expected Outcome                                         |
| --------- | -------------------------------------------------------- |
| M0        | Repository baseline verified                             |
| M1        | Application foundation operational                       |
| M2        | Authentication and account management complete           |
| M3        | Catalogue and marketplace discovery operational          |
| M4        | Seller verification and listings operational             |
| M5        | Cart and checkout operational                            |
| M6        | Payment integration validated                            |
| M7        | Orders and shipment management operational               |
| M8        | Returns, refunds, and settlements operational            |
| M9        | Author publishing and reviews operational                |
| M10       | Notifications, support, and administration operational   |
| M11       | Security, compliance, and production validation complete |
| M12       | Initial production release                               |

Milestone completion depends on verification, not merely code completion.

## 7. Change and Risk Management

The following risks require continuous monitoring:

| Risk                                | Mitigation                                    |
| ----------------------------------- | --------------------------------------------- |
| Payment provider limitations        | Validate capabilities before integration      |
| Concurrent inventory purchases      | Atomic reservation and database transactions  |
| Duplicate payment events            | Signature verification and idempotency        |
| Seller verification delays          | Progressive verification and status tracking  |
| Copyright infringement              | Evidence-based review and moderation          |
| Refund and settlement inconsistency | Immutable financial ledger and reconciliation |
| Data loss                           | Automated backups and recovery testing        |
| Unauthorized administrative actions | MFA, least privilege, and audit logs          |
| Legal and tax uncertainty           | Qualified Indian legal and CA review          |

Any change to approved business rules must be documented and reviewed before implementation.

## 8. Definition of Done

A feature is considered complete only when:

1. Its requirements and acceptance criteria are documented.
2. Its backend logic and API contracts are implemented where applicable.
3. Its frontend integration is functional.
4. Database changes and indexes are validated.
5. Authorization and input validation are implemented.
6. Unit and integration tests pass.
7. Relevant end-to-end workflows are verified.
8. Existing functionality remains operational.
9. Errors, loading states, and empty states are handled.
10. Documentation is updated.
11. The user confirms the feature's expected behavior.

## 9. Implementation Order

Development will follow the approved phase dependencies. The team will not jump directly into payment integration, deployment, or advanced administration before the foundational modules are validated.

The immediate implementation sequence after documentation completion is:

1. Repository baseline audit.
2. Foundation verification and stabilization.
3. Authentication preservation and validation.
4. Catalogue and marketplace discovery.
5. Seller verification.
6. Listings and inventory.
7. Cart and checkout.
8. Payment integration.
9. Order and shipment management.
10. Returns, refunds, and settlements.
11. Author publishing and reviews.
12. Notifications, support, and administration.
13. Security, compliance, testing, and deployment.

---

**Document End — Book Bazar Development Roadmap v2.**

# BOOK BAZAR – DEVELOPMENT ROADMAP

**Document Version:** 1.0
**Project:** Book Bazar
**Document Type:** Software Development Roadmap
**Development Approach:** Agile and Incremental
**Architecture:** Modular Monolith
**Frontend:** React + JavaScript + Vite
**Backend:** Node.js + Express.js
**Database:** MongoDB + Mongoose
**Status:** Planned

---

# 1. Introduction

## 1.1 Purpose

This document defines the complete development roadmap for Book Bazar.

It establishes:

- Development phases.
- Implementation sequence.
- Technical dependencies.
- Development milestones.
- Testing checkpoints.
- Integration strategy.
- Deployment preparation.
- Completion criteria.

## 1.2 Development Philosophy

Book Bazar will be developed incrementally using a structured engineering workflow:

1. Requirement Analysis
2. System Design
3. Architecture
4. Implementation
5. Integration
6. Testing
7. Validation
8. Deployment
9. Maintenance

Each development phase must be verified before proceeding to dependent modules.

# 2. Technology Stack

| Layer             | Technology                    |
| ----------------- | ----------------------------- |
| Frontend          | React                         |
| Language          | JavaScript ES6+               |
| Build Tool        | Vite                          |
| Styling           | Tailwind CSS                  |
| Routing           | React Router DOM              |
| HTTP Client       | Axios                         |
| Server State      | TanStack Query                |
| Forms             | React Hook Form               |
| Validation        | Zod                           |
| Icons             | Lucide React                  |
| Backend           | Node.js                       |
| Framework         | Express.js                    |
| Database          | MongoDB                       |
| ODM               | Mongoose                      |
| Authentication    | JWT                           |
| Password Hashing  | bcryptjs                      |
| File Upload       | Multer                        |
| Security          | Helmet                        |
| Email             | Nodemailer                    |
| Containerization  | Docker                        |
| Orchestration     | Docker Compose                |
| Reverse Proxy     | Nginx                         |
| API Testing       | Postman                       |
| Automated Testing | Vitest, Supertest, Playwright |
| Version Control   | Git and GitHub                |

# 3. Development Phases

## Phase 0 – Project Documentation and Planning

**Objective:** Establish a complete and consistent project specification before application development.

### Tasks

- Finalize project brief.
- Finalize functional and non-functional requirements.
- Define feature specifications.
- Document user journeys.
- Finalize technical specifications.
- Define system architecture.
- Design MongoDB collections.
- Define REST API contracts.
- Establish development roadmap.
- Prepare testing strategy.
- Prepare project README.

### Deliverables

- Complete project documentation.
- Approved architecture.
- Database design.
- API specifications.
- Development plan.

### Completion Criteria

All project documents must be reviewed and internally consistent.

## Phase 1 – Repository Cleanup and Foundation

**Objective:** Replace the existing application implementation with the selected technology stack while preserving the GitHub repository and its history.

### Tasks

- Verify the documentation baseline is committed.
- Inspect existing tracked files.
- Identify obsolete application code and configurations.
- Remove obsolete TypeScript, PostgreSQL, Prisma and Redis implementation files where applicable.
- Preserve Git history and repository identity.
- Establish the new monorepo structure.
- Configure root-level scripts.
- Configure `.gitignore`.
- Create `.env.example`.
- Configure ESLint and Prettier.
- Establish environment-specific configuration.

### Target Structure

```text
Book-Bazar/
│
├── apps/
│   ├── web/
│   └── api/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── business-rules/
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

### Completion Criteria

- New folder structure is established.
- Frontend and backend are independently runnable.
- No obsolete stack dependency remains in active application configuration.
- GitHub repository and existing history remain intact.

## Phase 2 – Backend Foundation

**Objective:** Establish a reliable Express.js backend.

### Tasks

- Initialize Node.js application.
- Configure ES modules.
- Configure Express server.
- Configure environment variables.
- Establish MongoDB connection.
- Configure Mongoose.
- Implement centralized error handling.
- Implement API response utilities.
- Configure Helmet and CORS.
- Configure request logging.
- Configure API rate limiting.
- Implement health-check endpoint.
- Establish modular backend architecture.

### Deliverables

- Running Express API.
- Working MongoDB connection.
- Centralized error handling.
- Health-check endpoint.
- Backend configuration.

### Completion Criteria

The API must start successfully, connect to MongoDB and respond to health-check requests.

## Phase 3 – Frontend Foundation

**Objective:** Establish the React application and its shared UI architecture.

### Tasks

- Initialize React using Vite.
- Configure Tailwind CSS.
- Configure React Router DOM.
- Configure Axios instance.
- Configure TanStack Query.
- Configure React Hook Form and Zod.
- Integrate Lucide React.
- Establish global layout.
- Implement reusable UI components.
- Implement responsive navigation.
- Establish loading, error and empty states.
- Configure authentication-aware routing.

### Deliverables

- Running React application.
- Shared layout.
- Reusable component system.
- API communication layer.
- Routing architecture.

### Completion Criteria

The frontend must communicate with the backend health endpoint and render the base application successfully.

## Phase 4 – Authentication and User Management

**Objective:** Implement secure account creation and user access.

### Backend Tasks

- User model.
- Registration.
- Password hashing.
- Email/phone verification workflow.
- Login.
- JWT access tokens.
- Refresh-token management.
- Logout and session revocation.
- Password reset.
- Authentication middleware.
- Authorization middleware.
- User profile APIs.

### Frontend Tasks

- Registration page.
- Login page.
- Verification interface.
- Forgot-password interface.
- Reset-password interface.
- Profile page.
- Protected routes.
- Authentication state management.

### Completion Criteria

Users must be able to register, authenticate, maintain sessions and access authorized resources.

## Phase 5 – Core Marketplace and Catalogue

**Objective:** Build the book discovery and catalogue system.

### Backend Tasks

- Book model.
- Category model.
- Book CRUD operations.
- Category APIs.
- Book search.
- Filtering and sorting.
- Pagination.
- Featured books.
- New arrivals.

### Frontend Tasks

- Homepage.
- Book catalogue.
- Search interface.
- Category navigation.
- Book details page.
- Book listing cards.
- Filtering and sorting controls.

### Completion Criteria

Users must be able to browse, search and view available books.

## Phase 6 – Seller and Inventory Management

**Objective:** Implement the seller marketplace workflow.

### Backend Tasks

- Seller capability.
- Listing model.
- Listing creation.
- Listing moderation.
- Listing updates.
- Listing deactivation.
- Inventory management.
- Inventory movement records.
- Seller dashboard APIs.

### Frontend Tasks

- Seller dashboard.
- Create listing interface.
- Edit listing interface.
- Book image upload.
- Inventory management.
- Listing management.
- Seller profile.

### Completion Criteria
