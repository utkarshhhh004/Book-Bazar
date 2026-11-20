# BOOK BAZAR — SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

**Document Version:** 2.0
**Project:** Book Bazar
**Document Type:** Software Requirements Specification
**Architecture:** Modular Full-Stack Web Application
**Status:** Approved Requirements Baseline
**Last Updated:** 20 November 2026

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements of Book Bazar. It establishes the expected system behaviour, business rules, user capabilities, security requirements, technical constraints and acceptance conditions.

This document serves as a reference for frontend development, backend implementation, database design, integration, testing and deployment.

## 1.2 Project Scope

Book Bazar is a multi-vendor online marketplace connecting buyers, independent book sellers and authors through a unified platform.

The initial release will support:

- Buying and selling physical books.
- New, used, rare, collectible, academic, notes and reference books.
- Seller-managed inventory and listings.
- Unified multi-seller shopping cart and checkout.
- Online payment processing.
- Parent orders and individual seller orders.
- Seller-managed dispatch and delivery tracking.
- Returns, refunds and dispute management.
- Author profiles and physical book publishing submissions.
- Reviews, ratings and notifications.
- Super Admin management and platform governance.

Digital books, e-books, PDFs and digital distribution are outside the initial release and may be introduced in a future phase.

## 1.3 Intended Audience

- Project Developers
- Frontend Developers
- Backend Developers
- Database Designers
- UI/UX Designers
- Software Testers and QA Engineers
- Project Supervisors
- System Administrators

## 1.4 Document Conventions

- **FR:** Functional Requirement.
- **NFR:** Non-Functional Requirement.
- **BR:** Business Rule.
- **P0:** Critical requirement for initial release.
- **P1:** Important requirement for initial release.
- **P2:** Planned enhancement or later-phase requirement.
- **TBD:** Requires further confirmation.

---

# 2. System Overview

## 2.1 System Components

Book Bazar will consist of:

1. Public marketplace frontend.
2. Buyer account interface.
3. Seller management interface.
4. Author management interface.
5. Super Admin dashboard.
6. RESTful backend API.
7. MongoDB database.
8. Payment gateway integration.
9. Email notification service.
10. Private file and image storage.
11. Containerized deployment infrastructure.

## 2.2 User Types and Account Capabilities

The system shall support the following capabilities:

| Capability  | Description                                             |
| ----------- | ------------------------------------------------------- |
| Guest       | Browse publicly available marketplace content.          |
| Buyer       | Purchase books and manage buyer activities.             |
| Seller      | Create listings, manage inventory and fulfill orders.   |
| Author      | Manage author profile and submit physical publications. |
| Super Admin | Govern and manage the entire platform.                  |

Buyer, Seller and Author are capabilities associated with one user account. A user may possess multiple capabilities simultaneously.

Every newly registered account receives Buyer capability by default. Seller and Author capabilities can be activated later.

The Super Admin is a separate privileged account and is not assigned through ordinary registration.

---

# 3. User Requirements

## 3.1 Guest User

A guest user shall be able to:

- Access the marketplace homepage.
- Browse publicly available books.
- Search for books.
- Filter and sort marketplace results.
- View book details and available seller offers.
- View public author profiles.
- Register a new account.
- Log in to an existing account.

A guest shall not be able to place orders, submit reviews or access private account information.

## 3.2 Registered Buyer

A buyer shall be able to:

- Manage personal profile information.
- Manage multiple delivery addresses.
- Browse and search the book catalogue.
- View available seller offers.
- Add books to a wishlist.
- Add and remove items from a unified cart.
- Select quantities and review availability.
- Complete multi-seller checkout.
- Make payments through supported payment methods.
- View payment receipts.
- View order history.
- Track individual seller shipments.
- Request eligible cancellations and returns.
- Raise disputes and support tickets.
- Submit eligible book and seller reviews.
- Manage notification preferences.
- Request account deletion subject to legal and financial retention requirements.

## 3.3 Seller

A seller shall be able to:

- Activate Seller capability on an existing account.
- Complete the required identity or business verification.
- Create draft listings before verification approval.
- Publish listings only after the required verification approval.
- Associate listings with existing catalogue books.
- Submit new catalogue entries where necessary.
- Upload required book photographs.
- Set fixed prices and available quantities.
- Define shipping charges and dispatch information.
- Edit, deactivate and manage listings.
- Manage inventory.
- Receive and process seller orders.
- Update packing and dispatch information.
- Enter courier and tracking details.
- Submit dispatch evidence.
- Report dispatch delays.
- View sales history and order information.
- View commission deductions and eligible earnings.
- View payout history and settlement status.
- Respond to relevant support or dispute requests.
- Manage seller-specific notification preferences.

Sellers shall not be able to fabricate payment confirmations or mark platform payouts as successful.

## 3.4 Author

An author shall be able to:

- Activate Author capability on an existing account.
- Submit authorship and ownership declarations.
- Upload supporting evidence.
- Submit physical book publication information for review.
- View submission status.
- Respond to requests for additional documentation.
- View approval or rejection decisions.
- Manage an approved public author profile.
- Associate approved publications with the author profile.

Authors shall arrange and fund their own physical printing. Book Bazar will not act as the printer or financier.

## 3.5 Super Admin

The Super Admin shall be able to:

- Access a dedicated administrative login.
- Complete mandatory multi-factor authentication.
- View marketplace and operational analytics.
- Manage user accounts and capabilities.
- Review seller verification applications.
- Review author publication submissions.
- Moderate listings, reviews and reported content.
- Monitor orders, payments, commissions and settlements.
- Initiate eligible refunds with recorded reasons.
- Place or release payout holds with recorded reasons.
- Manage disputes and appeals.
- Configure marketplace policies.
- Manage categories and listing rules.
- Configure notification templates and announcements.
- Export supported reports.
- Review administrative audit records.

There shall be one Super Admin initially. Additional operational administrator roles are outside the initial release.

---

# 4. Functional Requirements

## FR-01: Registration and Authentication

**Priority:** P0

The system shall:

- Allow users to register using the supported registration fields.
- Validate registration data on the backend.
- Prevent duplicate accounts using the configured unique identifiers.
- Hash passwords using bcryptjs.
- Support JWT-based authentication.
- Support email verification.
- Provide login and logout functionality.
- Maintain and invalidate user sessions.
- Provide secure password recovery.
- Protect authenticated application routes.
- Apply backend authorization to protected operations.
- Prevent ordinary users from accessing administrative endpoints.

**Acceptance Conditions:**

- A valid user can register and authenticate.
- Invalid credentials are rejected.
- Passwords are never stored in plaintext.
- Unverified or restricted accounts cannot perform prohibited actions.
- Expired or invalid sessions cannot access protected resources.

## FR-02: Capability-Based Authorization

**Priority:** P0

The system shall:

- Assign Buyer capability by default.
- Allow Seller and Author capabilities to be activated independently.
- Support multiple capabilities on one account.
- Maintain capability-specific access restrictions.
- Separate Super Admin access from normal user capabilities.
- Enforce authorization on the backend, not only through frontend navigation.
- Support capability-specific suspension or restriction.

**Acceptance Conditions:**

- A user can use all currently active capabilities.
- Restricting one capability does not automatically disable unrelated capabilities unless full account suspension is applied.
- Unauthorized API requests are rejected.

## FR-03: User Profile Management

**Priority:** P0

The system shall:

- Store user profile information.
- Allow users to view and update permitted profile fields.
- Support profile image uploads.
- Maintain account creation and modification timestamps.
- Protect private profile information from unauthorized access.
- Apply validation to profile updates.

## FR-04: Address Management

**Priority:** P0

The system shall:

- Allow buyers to add delivery addresses.
- Allow buyers to edit existing addresses.
- Allow buyers to delete addresses where they are not required by an active transaction.
- Support multiple delivery addresses.
- Allow selection of a default address.
- Validate required address fields.
- Preserve address snapshots associated with completed orders.

## FR-05: Book Catalogue Management

**Priority:** P0

The system shall:

- Maintain a shared book catalogue.
- Store book title and author names as mandatory fields.
- Support ISBN as an optional or recommended identifier.
- Require publisher information.
- Require edition information where applicable.
- Support publication year, language, category, description and page count.
- Require a cover image when creating a new catalogue entry.
- Prevent inappropriate duplicate catalogue entries through validation and review.
- Allow multiple sellers to offer the same catalogue book.

The catalogue represents book identity and information. Seller listings represent individual offers and inventory.

## FR-06: Seller Listing Management

**Priority:** P0

The system shall:

- Allow sellers to create and manage listings.
- Associate a listing with a catalogue book.
- Require book condition, fixed price and quantity.
- Support conditions: New, Like New, Very Good, Good and Acceptable.
- Require actual photographs for used and rare books.
- Allow seller-specific descriptions.
- Require disclosure of defects, missing pages, markings and material alterations.
- Capture dispatch location, handling time and shipping terms.
- Support rare-book attributes such as printing, year, signatures, provenance and collectible features.
- Allow draft, active, inactive and other policy-controlled listing states.
- Prevent unverified sellers from publicly listing books.
- Maintain listing history and relevant timestamps.

## FR-07: Seller Verification

**Priority:** P0

The system shall:

- Support individual and business sellers.
- Allow progressive submission of verification information.
- Allow draft listings before verification approval.
- Require verification approval before public listing.
- Apply verification requirements according to seller type.
- Maintain verification status and review history.
- Allow the Super Admin to approve, reject or request additional information.
- Record reasons for rejection or additional-document requests.

Exact verification documents and legal requirements must be confirmed before production launch.

## FR-08: Marketplace Discovery and Search

**Priority:** P0

The system shall:

- Display publicly available catalogue books with active seller offers.
- Search by title, author, ISBN, publisher and keywords.
- Filter by category, condition, price, language, seller type, stock availability, publisher, edition and publication year.
- Sort by relevance, price ascending, price descending, newest listings and recently added.
- Display the lowest currently available seller offer on multi-seller book cards.
- Display the number of available seller offers.
- Show all eligible offers on the book detail page.
- Hide books without active seller listings from purchasable marketplace results.
- Prevent purchases of unavailable or out-of-stock offers.
- Provide loading, error and empty states.

All marketplace listings, prices, availability and seller information must originate from the database. Hardcoded sample inventory shall not be presented as real marketplace inventory.

## FR-09: Wishlist Management

**Priority:** P1

The system shall:

- Allow authenticated buyers to add books to a wishlist.
- Allow buyers to remove books from a wishlist.
- Display saved books.
- Handle inactive or unavailable seller offers without implying that the book is purchasable.

## FR-10: Shopping Cart

**Priority:** P0

The system shall:

- Support one unified cart containing offers from multiple sellers.
- Allow buyers to add, update and remove cart items.
- Validate quantity against current availability.
- Display seller-wise items and charges.
- Display book subtotal, shipping charges, applicable fees and the combined estimated total.
- Revalidate price and availability before checkout.
- Avoid reserving inventory merely because an item is in the cart.

## FR-11: Inventory and Reservation Management

**Priority:** P0

The system shall:

- Maintain seller-specific inventory.
- Prevent negative available inventory.
- Use atomic inventory updates for checkout reservations.
- Reserve inventory only when checkout begins.
- Apply a 15-minute reservation window.
- Release expired reservations through explicit application-level processing.
- Restore inventory when reservations are released or eligible orders are cancelled.
- Prevent concurrent buyers from purchasing the same unavailable stock.
- Maintain inventory transaction records.

A database TTL mechanism alone shall not be treated as sufficient inventory-release logic.

## FR-12: Checkout and Order Creation

**Priority:** P0

The system shall:

- Support one checkout for items from multiple sellers.
- Create one parent order for the overall purchase.
- Create a separate seller order for each participating seller.
- Store seller-specific item, shipping and fulfillment information.
- Capture buyer, delivery and price information as transaction snapshots.
- Validate inventory, price, address and seller eligibility before payment.
- Calculate the combined checkout amount.
- Apply applicable fees and taxes transparently.
- Avoid creating duplicate successful orders during retries.

## FR-13: Payment Processing

**Priority:** P0

The system shall:

- Integrate a payment provider selected after technical and commercial verification.
- Support provider-supported payment methods.
- Create payment attempts on the backend.
- Maintain payment transaction identifiers and provider references.
- Verify payment status through trusted backend mechanisms.
- Validate provider webhooks and signatures.
- Implement idempotency for payment attempts and webhook processing.
- Support payment states including initiated, pending, successful, failed, expired, refund initiated and refunded.
- Handle delayed payment confirmations and late-success events.
- Reconcile local transaction records with provider records.
- Never trust frontend callbacks alone as proof of successful payment.
- Never store card numbers, CVV or UPI PIN.

Cashfree Easy Split is the preferred candidate, not a finalized provider. Selection is conditional on written confirmation of marketplace eligibility, UPI-only vendor onboarding, settlement, pricing, refunds and technical capabilities.

## FR-14: Commission and Transaction Entitlement

**Priority:** P0

The system shall:

- Calculate a default seller commission of 10%.
- Calculate commission on net book selling price after seller-funded discounts.
- Exclude delivery charges and separately collected taxes from the commission base.
- Maintain commission records for each eligible transaction.
- Support the shared first-successful-transaction entitlement.
- Consume the entitlement when the first successful purchase or sale occurs.
- Waive commission on the first eligible sale only when the entitlement remains unused.
- Never provide a buyer fee waiver through this entitlement.
- Maintain an auditable entitlement ledger.
- Support effective-dated commission configuration.

The commission policy shall not be retroactively changed for already completed transactions.

## FR-15: Seller Fulfillment and Delivery

**Priority:** P0

The system shall:

- Support seller-managed delivery.
- Allow sellers to choose their courier or delivery arrangement.
- Allow sellers to define shipping charges, including free shipping.
- Display shipping charges before payment.
- Require dispatch within three business days after confirmed payment.
- Allow sellers to report dispatch delays.
- Require tracking information after dispatch.
- Require dispatch evidence.
- Maintain seller-specific shipment status.
- Allow buyers to view tracking information.
- Notify buyers about relevant dispatch and delivery updates.
- Support late-dispatch reminders, escalation, buyer notification and proportionate enforcement.

Platform-managed courier booking and mandatory platform shipping labels are not required for the initial release.

## FR-16: Order and Fulfillment Status

**Priority:** P0

The system shall:

- Maintain payment status separately from order status.
- Maintain seller fulfillment status separately for each seller order.
- Track relevant states such as pending payment, confirmed, processing, packed, dispatched, in transit, delivered, cancelled and disputed.
- Maintain status timestamps and event history.
- Prevent invalid state transitions.
- Support independent shipment tracking for different sellers within one parent order.

## FR-17: Cancellation Management

**Priority:** P0

The system shall:

- Allow buyers to request cancellation before dispatch.
- Validate cancellation eligibility.
- Allow cancellation where the seller fails to dispatch under applicable policy.
- Prevent ordinary cancellation after dispatch, except through eligible return or dispute procedures.
- Release inventory when cancellation is confirmed and applicable.
- Record cancellation reasons and timestamps.
- Initiate eligible refunds through the payment provider.

## FR-18: Returns and Refunds

**Priority:** P0

The system shall:

- Provide a return request window of three calendar days after delivery.
- Support issue-based eligible returns.
- Exclude ordinary change-of-mind returns under the proposed platform policy.
- Support claims involving wrong books, undisclosed damage, missing pages, materially inaccurate listings, counterfeit or unauthorized copies, and qualifying delivery issues.
- Allow buyers to submit supporting evidence.
- Allow sellers to provide responses.
- Support Super Admin investigation and decisions.
- Initiate eligible refunds to the original payment method where supported.
- Maintain refund status and transaction references.
- Preserve original payment and receipt records.
- Record refunds as separate financial transactions.

Applicable Indian consumer rights and statutory requirements shall override platform policy.

## FR-19: Seller Earnings and Payouts

**Priority:** P0

The system shall:

- Calculate seller earnings after applicable commission, adjustments and deductions.
- Mark proceeds eligible for payout only after delivery and completion of the three-calendar-day return window.
- Exclude or hold amounts affected by disputes, refunds, chargebacks or other valid holds.
- Support weekly automatic seller settlements.
- Apply no platform-defined minimum payout threshold.
- Prefer UPI ID/VPA as the seller payout destination, subject to provider support.
- Require re-verification when payout details are changed.
- Hold payouts until changed payout details are verified.
- Maintain provider references, payout statuses, timestamps and settlement history.
- Protect payout information using appropriate security controls.

Bank-account requirements, UPI-only onboarding and provider settlement capabilities remain subject to provider verification.

## FR-20: Payment Receipts

**Priority:** P0

The system shall:

- Generate a receipt after server-verified successful payment.
- Assign a unique receipt number.
- Include parent order ID, transaction ID and gateway reference.
- Include buyer name and email.
- Include payment timestamp, payment method and status.
- Include book subtotal, shipping, gateway fee, taxes and total where applicable.
- Email the receipt automatically.
- Provide a downloadable PDF in buyer order history.
- Prevent duplicate receipt generation and duplicate email delivery during retries.
- Preserve original receipts as immutable records.
- Record refunds separately.

A payment receipt shall not be treated as a substitute for a legally required tax invoice.

## FR-21: Author Publishing and Verification

**Priority:** P1

The system shall:

- Allow authors to submit physical publication information.
- Require authorship and ownership declarations.
- Support flexible evidence uploads.
- Review copyright, plagiarism, ownership, legality, misrepresentation and required permissions.
- Support submission states: pending review, under review, additional documents required, approved, rejected, suspended and removed.
- Record review decisions and reasons.
- Allow authors to respond to additional-document requests.
- Support complaints and takedown review.
- Generate a public author profile after the first publication is approved.
- Allow authors to manage optional biography, photograph and genres.
- Display approved publications and a verified author indicator.
- Keep private verification documents and account email information inaccessible publicly.

The author is responsible for arranging and funding printing.

## FR-22: Reviews and Ratings

**Priority:** P1

The system shall:

- Allow reviews only from verified purchasers after successful purchase and confirmed delivery.
- Maintain catalogue-level book ratings.
- Maintain seller-specific ratings.
- Support a one-to-five-star rating scale.
- Allow optional written reviews and photographs.
- Allow buyers to edit reviews within three calendar days.
- Allow buyers to delete their own reviews.
- Prevent sellers from publicly responding to reviews in the initial release.
- Allow users to report reviews.
- Allow the Super Admin to moderate reported reviews.
- Maintain moderation reasons and audit records.
- Prohibit fake, manipulated or incentivized reviews that violate platform policy.
- Preserve legitimate negative reviews unless a policy violation is established.

## FR-23: Notifications

**Priority:** P1

The system shall:

- Support in-app and email notifications initially.
- Support push notifications in a later phase where technically available.
- Notify users about relevant account, order, payment, dispatch, delivery, return, refund, dispute and security events.
- Allow users to configure optional notification categories.
- Support recommendations, new arrivals, offers, wishlist price updates and newsletters as individually configurable categories.
- Keep essential transactional and security notifications enabled where legally or operationally required.
- Prevent duplicate notifications for repeated event processing.

## FR-24: Support and Dispute Management

**Priority:** P1

The system shall:

- Provide a support ticket mechanism.
- Allow users to submit issues with relevant order references.
- Support evidence attachments where applicable.
- Maintain ticket status and communication history.
- Support a grievance/contact mechanism.
- Allow the Super Admin to review and resolve disputes.
- Record decisions, reasons, timestamps and relevant evidence.
- Apply operational response targets subject to applicable statutory deadlines.

## FR-25: Super Admin Authentication and Security

**Priority:** P0

The system shall:

- Provide a separate administrative login route.
- Provision the initial Super Admin securely through a controlled backend setup process.
- Store the administrative password using secure hashing.
- Require multi-factor authentication on every administrative login.
- Provide a secure recovery mechanism.
- Protect administrative APIs through backend authorization.
- Record sensitive administrative actions in an audit log.

## FR-26: Super Admin Dashboard and Governance

**Priority:** P0

The system shall:

- Provide marketplace, financial, operational and publishing analytics.
- Support daily, weekly, monthly and yearly reporting filters.
- Display seller rankings, category trends, conversion and retention metrics.
- Support charts, drill-down views and CSV/PDF exports.
- Display real database-backed metrics.
- Manage users, capabilities and account restrictions.
- Manage seller verification and author publication reviews.
- Manage categories and listing policies.
- Configure commission, dispatch deadline and return-window settings subject to law.
- Configure minimum listing price, announcements and notification templates.
- Configure publishing guidelines and seller eligibility.
- Apply effective dates to policy changes.
- Prevent retroactive changes to completed transactions.
- Maintain audit records for sensitive actions.

## FR-27: Account Restrictions and Appeals

**Priority:** P1

The system shall:

- Support capability-specific restrictions.
- Support full account suspension for serious cases.
- Require a recorded reason and relevant policy reference.
- Notify affected users of applicable restrictions.
- Preserve financial and order records.
- Allow eligible users to submit structured appeals.
- Allow evidence to be attached to appeals.
- Allow the Super Admin to review and decide appeals.
- Require a decision reason.
- Notify users of appeal outcomes.
- Permit resubmission of rejected appeals only when new evidence is provided.
- Maintain a complete enforcement and appeal history.

## FR-28: Account Deletion and Privacy Requests

**Priority:** P1

The system shall:

- Provide a process for users to request account deletion.
- Verify the identity of the requesting user.
- Check outstanding orders, payments, disputes, payouts and legal retention obligations.
- Restrict or anonymize personal information where deletion is legally permissible.
- Retain records where required by law or legitimate financial and operational obligations.
- Record the deletion request and its processing status.
- Prevent unauthorized access to retained personal information.

## FR-29: File and Image Management

**Priority:** P0

The system shall:

- Support secure profile, book, listing and evidence uploads.
- Validate file type and size.
- Restrict access to private verification and dispute documents.
- Store private documents in private object storage.
- Avoid exposing private file paths or unrestricted public URLs.
- Support authorized retrieval and deletion according to retention policy.

## FR-30: Audit and Financial Records

**Priority:** P0

The system shall:

- Maintain audit records for sensitive administrative and financial actions.
- Record relevant actor, action, timestamp, reason and reference.
- Preserve completed financial transactions as immutable records.
- Record adjustments and reversals separately.
- Maintain traceability for payments, commissions, refunds and payouts.
- Prevent unauthorized modification or deletion of financial history.

---

# 5. Business Rules

## BR-01: Account Capabilities

Buyer, Seller and Author capabilities may coexist on one account. Super Admin access is separate.

## BR-02: Seller Verification

Sellers may prepare draft listings before approval, but public listing requires the applicable verification approval.

## BR-03: Listing Conditions

Every seller offer must declare its condition. Used and rare books require actual photographs and material defect disclosure.

## BR-04: Fixed Pricing

Negotiation and bidding are excluded from the initial marketplace release.

## BR-05: Commission

The default seller commission is 10% of net book selling price after seller-funded discounts, excluding delivery and separately collected taxes.

## BR-06: First Transaction Entitlement

The first successful purchase or sale consumes the shared entitlement. If the first successful transaction is an eligible sale, that sale receives a commission waiver. A purchase does not receive a buyer fee waiver.

## BR-07: Multi-Seller Orders

One parent order may contain multiple seller orders. Each seller order has independent fulfillment and tracking information.

## BR-08: Inventory Reservation

No inventory is reserved in the cart. Checkout reservations last 15 minutes and must be explicitly released after expiry.

## BR-09: Dispatch Deadline

Sellers must dispatch within three business days after confirmed payment.

## BR-10: Return Window

The platform's proposed return window is three calendar days after delivery, subject to applicable consumer law.

## BR-11: Payout Eligibility

Seller proceeds become eligible after delivery and completion of the return window, subject to disputes, refunds, chargebacks and valid holds.

## BR-12: Payout Frequency

Eligible seller proceeds are settled weekly, subject to payment-provider capability.

## BR-13: Payout Minimum

The platform will not impose a minimum payout threshold. Provider-imposed restrictions may still apply.

## BR-14: Author Responsibility

Authors arrange and fund physical printing. Book Bazar reviews publication eligibility and provides marketplace facilities.

## BR-15: Review Eligibility

Only verified purchasers with successful purchases and confirmed delivery may submit reviews.

## BR-16: Data Integrity

Marketplace inventory, prices, orders, transactions and analytics must be backed by persistent database records.

## BR-17: Legal Supremacy

Applicable laws, regulations and statutory consumer rights take precedence over internal platform policies.

---

# 6. Non-Functional Requirements

## NFR-01: Performance

- Public marketplace pages should load efficiently under normal operating conditions.
- APIs should avoid unnecessary database queries and excessive payloads.
- Search and filtering should support pagination.
- Checkout and payment processing should minimize unnecessary latency.
- Payment confirmation should use near-real-time provider updates where supported.
- No fixed payment-confirmation time shall be guaranteed without provider support.

## NFR-02: Security

- Passwords must be securely hashed.
- Authentication tokens must be handled securely.
- Protected APIs must enforce backend authorization.
- Inputs must be validated and sanitized appropriately.
- Security headers must be configured.
- Sensitive documents must use private storage.
- Payment webhooks must be authenticated and verified.
- Secrets must not be committed to source control.
- Administrative access must require MFA.
- Sensitive operations must be auditable.

## NFR-03: Reliability and Data Integrity

- Financial operations must be idempotent where applicable.
- Inventory updates must be concurrency-safe.
- Payment and order state transitions must be validated.
- Database transactions or appropriate consistency mechanisms must protect critical operations.
- Failed operations must not silently create inconsistent financial or inventory records.
- Reconciliation mechanisms must identify discrepancies with payment providers.

## NFR-04: Scalability

- The application shall use a modular monolithic architecture.
- Business domains shall have clear separation.
- Database access shall be designed to support growing catalogue, order and transaction volumes.
- API endpoints shall support pagination and appropriate query limits.
- The architecture shall allow future module expansion without requiring an initial microservices deployment.

## NFR-05: Maintainability

- Frontend and backend responsibilities shall remain separated.
- Modules shall follow consistent naming and folder conventions.
- Shared validation and business rules shall be implemented consistently.
- API contracts shall be documented.
- Configuration shall be environment-driven.
- Changes shall be covered by relevant automated tests.

## NFR-06: Usability and Accessibility

- Interfaces shall be responsive across desktop, tablet and mobile.
- Forms shall provide understandable validation messages.
- Important actions shall provide feedback.
- Loading, success, error and empty states shall be present.
- Navigation shall be consistent across account capabilities.
- Essential workflows shall not depend solely on colour or visual indicators.

## NFR-07: Privacy and Compliance

- Personal data shall be collected only where necessary.
- Private information shall be accessible only to authorized parties.
- Data retention and deletion shall follow applicable legal requirements.
- Financial and tax records shall be retained where legally required.
- Privacy and consumer-protection requirements shall be reviewed before launch.

## NFR-08: Compatibility

- The web application shall support current major desktop and mobile browsers.
- The interface shall adapt to common screen sizes.
- API responses shall use consistent JSON structures.
- The application shall use the agreed JavaScript-based technology stack.

## NFR-09: Observability

- The backend shall maintain useful application logs.
- Errors shall be recorded without exposing secrets or sensitive personal data.
- Critical payment and order events shall be traceable.
- Operational failures shall be identifiable through logs and monitoring.

## NFR-10: Backup and Recovery

- Database backup procedures shall be established before production launch.
- Recovery procedures shall be documented and tested.
- Backup access shall be restricted.
- Recovery procedures shall protect financial and order consistency.

---

# 7. Technical Constraints

## 7.1 Frontend

- React
- Vite
- JavaScript ES6+
- Tailwind CSS
- Lucide React
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod

## 7.2 Backend

- Node.js
- Express.js
- JavaScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod
- Multer
- Helmet
- Nodemailer

## 7.3 Testing

- Vitest
- Supertest
- React Testing Library
- Playwright
- Postman

## 7.4 Deployment

- Docker
- Docker Compose
- Nginx
- AWS or compatible container hosting

## 7.5 Technology Exclusions for Initial Release

The initial implementation shall not introduce the following as core stack replacements:

- TypeScript
- PostgreSQL
- Prisma
- Redis
- Microservices architecture

Any future change to these constraints requires an explicit architecture decision.

---

# 8. External Dependencies

The following services or decisions may affect production implementation:

| Dependency           | Current Position                        | Required Verification                                                            |
| -------------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| Payment provider     | Cashfree Easy Split preferred candidate | Marketplace eligibility, fees, UPI-only onboarding, settlement, refunds and APIs |
| Seller payout        | UPI ID/VPA preferred                    | Provider support and verification requirements                                   |
| Email service        | Gmail SMTP for development              | Production email service and sending limits                                      |
| File storage         | Private object storage                  | Provider, access controls and retention                                          |
| Hosting              | AWS or compatible hosting               | Cost, deployment and operational requirements                                    |
| Legal and tax review | Required before launch                  | Indian marketplace, consumer, privacy, tax and invoicing obligations             |

No external provider shall be treated as finalized until its technical, commercial and compliance requirements have been verified.

---

# 9. Assumptions and Open Decisions

The following items require further verification or detailed implementation design:

1. Final payment provider selection and written commercial confirmation.
2. Exact seller KYC documents and verification rules.
3. Business seller documentation requirements.
4. Applicable seller and platform tax responsibilities.
5. Invoice and tax-document formats.
6. Provider-supported payout frequency and UPI-only settlement.
7. Payment gateway fee treatment and legal permissibility.
8. Exact dispute response and resolution service targets.
9. Final production file-storage and hosting providers.
10. Final launch cities and operational coverage.
11. Detailed retention periods for financial and personal records.
12. Production support and grievance operating procedures.

These open items must not be silently assumed during implementation.

---

# 10. Acceptance Criteria

The initial release shall be considered functionally acceptable when:

1. Users can register, verify their email and authenticate securely.
2. Buyer, Seller and Author capabilities operate independently on one account.
3. Seller verification is enforced before public listings.
4. Buyers can browse real database-backed catalogue books and seller offers.
5. Sellers can create and manage valid listings and inventory.
6. Buyers can create a unified cart containing offers from multiple sellers.
7. Checkout creates one parent order and the correct seller orders.
8. Inventory reservation and expiry handling prevent overselling.
9. Payment success is confirmed through trusted backend verification.
10. Payment retries and webhook reprocessing do not create duplicate financial transactions.
11. Commission and first-transaction entitlement calculations follow the approved rules.
12. Sellers can manage dispatch and tracking independently.
13. Buyers can view order, shipment and payment status.
14. Eligible cancellation, return and refund workflows operate correctly.
15. Seller earnings and payout eligibility are calculated correctly.
16. Payment receipts are generated only after verified successful payment.
17. Author publication submissions follow the review workflow.
18. Review eligibility and moderation rules are enforced.
19. Super Admin authentication requires MFA.
20. Administrative actions and financial adjustments are auditable.
21. Critical workflows have automated tests.
22. No production workflow relies on hardcoded marketplace inventory or fabricated transaction data.
23. Security, privacy, legal and provider-dependent launch requirements have been reviewed.

---

# 11. Requirement Traceability

Each functional requirement shall be linked to:

- Its relevant feature specification.
- Its user flow.
- Its technical implementation module.
- Its database entities where applicable.
- Its API endpoints.
- Its corresponding test cases.

Requirement identifiers shall remain stable when implementation details change. If a requirement is removed or materially modified, the change must be documented.

---

# 12. Change Management

Changes to this SRS shall be reviewed against:

- Approved business decisions.
- Existing project documentation.
- Database and API compatibility.
- Security and privacy implications.
- Financial and inventory consistency.
- Existing functionality and regression risk.
- Testing and deployment impact.

Any change affecting an approved business rule must be discussed and approved before implementation.

---

# 13. Document Governance

| Field        | Value                                  |
| ------------ | -------------------------------------- |
| Document     | Software Requirements Specification    |
| Project      | Book Bazar                             |
| Version      | 2.0                                    |
| Status       | Approved Requirements Baseline         |
| Owner        | Book Bazar Project Team                |
| Last Updated | 20 November 2026                       |
| Next Review  | Before detailed feature implementation |

**End of Document**
