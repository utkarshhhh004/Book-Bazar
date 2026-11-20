# BOOK BAZAR — PROJECT BRIEF

**Project Name:** Book Bazar
**Project Type:** Multi-Vendor Physical Book Marketplace
**Project Architecture:** Full-Stack Web Application
**Document Version:** 2.0
**Document Status:** Approved Business Foundation
**Initial Market:** India
**Currency:** INR (Indian Rupee)

---

## 1. Project Overview

Book Bazar is a multi-vendor online marketplace designed to connect readers, independent book sellers, bookstores, publishers and authors through one integrated platform.

The platform enables users to discover, purchase and sell physical books. Aspiring and established authors can submit their manuscripts for review and, after approval, offer physical copies through the marketplace.

Book Bazar follows a unified account model. A single user account can operate as a Buyer, Seller and Author without requiring separate accounts or applications.

The platform facilitates marketplace transactions, manages order workflows, maintains seller inventory, calculates commissions, coordinates seller-managed deliveries and provides administrative oversight.

Book Bazar operates as an independent marketplace. Sellers own their inventory and are responsible for selling and fulfilling their products. Book Bazar facilitates the marketplace and earns commission according to the approved commercial rules.

---

## 2. Project Vision

To establish a secure, transparent and accessible book marketplace that makes discovering, buying and selling physical books easier while providing independent sellers and authors with an integrated platform to reach readers.

The long-term vision is to develop a reliable book-commerce ecosystem supported by secure transactions, transparent seller operations, responsible publishing practices and data-driven administration.

---

## 3. Project Objectives

1. Build a unified marketplace for new, used, academic and collectible physical books.
2. Allow individuals and eligible businesses to sell books.
3. Enable authors to submit manuscripts for ownership and content verification.
4. Provide a single account supporting Buyer, Seller and Author capabilities.
5. Implement secure payment collection and provider-verified transaction processing.
6. Maintain accurate inventory and prevent overselling.
7. Support multi-seller carts and independently fulfilled seller orders.
8. Implement transparent commission calculations and seller settlements.
9. Provide structured returns, refunds and dispute management.
10. Establish a secure Super Admin dashboard with configurable policies and analytics.
11. Ensure that all marketplace information is backed by real backend services and MongoDB records.

---

## 4. User Types and Account Capabilities

### 4.1 Buyer

Every registered user receives Buyer capability by default.

Buyers can:

- Browse and search the marketplace.
- View catalogue information and seller offers.
- Filter and sort available books.
- Manage shopping carts and wishlists.
- Place orders containing books from multiple sellers.
- Make payments.
- Access payment receipts and order history.
- View seller-provided shipping and tracking information.
- Request eligible cancellations, returns and refunds.
- Submit product and seller reviews after qualifying purchases.
- Manage profile, addresses and notification preferences.
- Raise support tickets and disputes.

### 4.2 Seller

Users may activate Seller capability on their existing account.

Sellers can:

- Submit individual or business verification information.
- Create and manage draft listings.
- List books after completing required verification.
- Manage selling prices and available inventory.
- Upload actual book photographs where required.
- Manage orders and fulfillment.
- Select couriers and arrange delivery.
- Provide tracking details and dispatch evidence.
- View earnings, commissions and settlement history.
- Manage payout destination details subject to provider verification.
- Respond to relevant customer disputes.

### 4.3 Author

Users may activate Author capability on their existing account.

Authors can:

- Submit manuscripts and publishing applications.
- Provide authorship declarations and supporting evidence.
- Track manuscript review status.
- Respond to additional-document requests.
- Manage their public author profile after publication approval.
- View approved publications.

Author approval and Seller verification are independent processes.

Approved authors can sell their physical book copies through the same Seller system.

### 4.4 Super Admin

The initial platform uses a single Super Admin model.

The Super Admin can:

- Manage users and capability restrictions.
- Review individual and business seller verification.
- Review author publishing applications.
- Moderate listings and catalogue records.
- Monitor orders, payments and seller settlements.
- Initiate eligible refunds.
- Place payout holds with documented reasons.
- Resolve disputes and appeals.
- Configure platform policies.
- Manage categories and publishing guidelines.
- Manage announcements and notification templates.
- Access marketplace, financial and operational analytics.
- Review audit logs and sensitive administrative actions.

Admin access is separate from public registration and requires mandatory multi-factor authentication.

---

## 5. Marketplace Product Scope

### 5.1 Supported Products

The initial marketplace supports:

1. New physical books.
2. Used and second-hand books.
3. Rare and collectible books.
4. Academic books, notes and reference books.

### 5.2 Excluded Initial Products

- E-books.
- Digital book downloads.
- PDF book sales.
- Digital publishing and distribution.

Digital publishing may be evaluated as a separate future release.

Unauthorized photocopies, pirated books and copyright-infringing reproductions are prohibited.

### 5.3 Book Catalogue and Seller Listings

The platform separates shared catalogue information from seller-specific listings.

A catalogue record describes a book, while individual sellers create offers for their available copies.

Multiple sellers may offer the same catalogue book at different prices and conditions.

Catalogue metadata includes title, authors, publisher, edition, ISBN, language, category, description and cover information.

Seller listings contain condition, selling price, stock, actual photographs where required, seller description, dispatch information and shipping terms.

---

## 6. Core Business Model

### 6.1 Marketplace Model

Book Bazar operates as an independent multi-vendor marketplace.

- Sellers own and maintain their inventory.
- Sellers determine their selling prices.
- Sellers fulfil their orders.
- Book Bazar facilitates transactions and marketplace operations.
- Book Bazar earns platform commission according to approved rules.

Book Bazar does not purchase or own seller inventory.

### 6.2 Pricing and Commission

- Listings use fixed prices.
- Buyer-seller price negotiation is excluded initially.
- Standard seller commission is 10%.
- Commission is calculated on the net book selling price after seller-funded discounts.
- Delivery charges and separately collected taxes are excluded from the commission base.
- All monetary amounts are stored as integer paise.

### 6.3 First Successful Transaction Entitlement

Each account receives one shared first-transaction entitlement.

- A successful purchase consumes the entitlement.
- An eligible first successful sale consumes the entitlement and receives a seller commission waiver.
- A purchase does not receive a buyer fee waiver.
- If the entitlement is consumed through a purchase, subsequent sales pay the standard commission.

The entitlement is maintained through a central transaction ledger.

### 6.4 Payment Gateway Fees

The buyer may bear a gateway processing fee only when it is transparently disclosed before payment and permitted by applicable law and the selected provider's commercial terms.

### 6.5 Seller Settlement

- Weekly automatic settlement is the approved target.
- Seller earnings become eligible after confirmed delivery and expiry of the three-calendar-day return window, subject to disputes, refunds, chargebacks and holds.
- UPI VPA is the preferred payout destination, conditional on provider support.
- No minimum payout threshold is intended.
- Seller payout details require verification and access controls.

The payment provider and final settlement arrangements remain subject to verification.

---

## 7. Cart, Orders and Fulfillment

### 7.1 Unified Cart

One shopping cart may contain books from multiple sellers.

The buyer completes one checkout and payment process.

### 7.2 Order Structure

The system maintains:

- One parent order for the overall purchase.
- Separate seller orders for each participating seller.

Each seller order has independent fulfillment, shipping charges, courier details, tracking and delivery status.

### 7.3 Inventory Management

- Adding a book to cart does not reserve inventory.
- Inventory is reserved atomically during checkout.
- Initial reservation duration is 15 minutes.
- Expired reservations must explicitly release inventory.
- Inventory operations must prevent overselling.
- TTL cleanup alone cannot be relied upon to release stock.

### 7.4 Delivery Model

The initial platform uses seller-managed delivery.

- Sellers arrange their own courier.
- Sellers are responsible for packing and dispatch.
- Dispatch must occur within three business days after confirmed payment.
- Sellers must provide tracking details after dispatch.
- Dispatch evidence is required.
- Buyers can access available tracking information.
- Book Bazar manages shipment statuses, complaints and disputes.

Mandatory platform courier booking and platform-generated shipping labels are excluded initially.

---

## 8. Returns, Cancellations and Refunds

The approved standard return window is three calendar days after delivery.

Eligible return reasons include:

- Wrong book received.
- Undisclosed damage or defects.
- Missing pages.
- Materially inaccurate listing.
- Counterfeit or unauthorized reproductions.
- Qualifying delivery issues after investigation.

Change-of-mind returns are not allowed under the proposed platform policy, subject to mandatory legal rights.

Additional rules:

- Buyers submit supporting evidence.
- Sellers receive an opportunity to respond.
- Book Bazar manages disputes.
- Refunds go to the original payment method wherever supported.
- Buyers may request cancellation before dispatch.
- After dispatch, the return process generally applies.
- Seller non-dispatch may trigger cancellation and refund review.

Applicable consumer protection requirements take precedence over platform policy.

---

## 9. Author Publishing

Book Bazar supports physical publishing applications from aspiring and established authors.

Authors arrange and finance their own printing.

Each application requires:

- Authorship and ownership declaration.
- Relevant supporting documents.
- Manuscript and publishing information.

Acceptable evidence may include manuscript drafts, version history, ownership agreements, copyright registration where available, co-author consent, licences and publisher agreements.

Admin reviews:

- Copyright and plagiarism concerns.
- Ownership and authorization.
- Missing permissions and attribution.
- Legal compliance.
- Misleading or fraudulent content.
- Platform publishing policies.

Applications support the following statuses:

- Pending review.
- Under review.
- Additional documents required.
- Approved.
- Rejected.
- Suspended.
- Removed.

Approved authors can list physical copies using the common Seller system after completing seller verification.

---

## 10. Reviews and Ratings

Only verified purchasers who have completed a qualifying purchase and received the order may review.

Two independent rating systems are maintained:

**Book Rating**

- Content.
- Usefulness.
- Physical and print quality.

**Seller Rating**

- Packaging.
- Dispatch speed.
- Communication.
- Listing accuracy.

Both use a five-star rating scale.

Written reviews and photographs are optional.

Buyers can edit reviews within three calendar days after submission and can delete their own reviews.

Sellers cannot publicly respond to reviews.

Reviews can be reported and moderated by Super Admin with documented reasons. Legitimate negative reviews must not be removed merely because they are negative.

---

## 11. Notifications

The notification architecture supports:

1. In-app notifications.
2. Email notifications.
3. Push notifications.

Initial implementation prioritizes in-app and email notifications. Browser/mobile push notifications are planned for a later implementation stage.

Users can manage optional notification categories such as recommendations, new arrivals, offers, wishlist price updates and newsletters.

Essential transactional and security notifications remain enabled where required.

---

## 12. Administration and Governance

The platform has one Super Admin for the initial release.

The Super Admin receives full configurable control over operational policies, including:

- Seller commission.
- Dispatch deadlines.
- Return windows, subject to applicable law.
- Categories and listing rules.
- Minimum book price.
- Announcements.
- Notification templates.
- Publishing guidelines.
- Seller eligibility rules.

Policy changes must be authorized, audited and effective-dated where appropriate.

Existing transactions must retain their original agreed terms.

### 12.1 User Enforcement

Buyer, Seller and Author capabilities can be restricted independently where appropriate.

Serious violations may require full-account suspension.

Enforcement actions require documented reasons, user notification and audit history.

### 12.2 Appeals

Users can submit structured appeals with explanations and supporting evidence.

Appeals are linked to their original enforcement actions.

The Super Admin records the decision and reason and notifies the affected user.

Rejected appeals can be resubmitted only when new evidence is provided.

### 12.3 Financial Administration

Financial records must be auditable and immutable.

Administrative corrections use adjustment entries rather than rewriting financial history.

Super Admin cannot fabricate payment or settlement success.

### 12.4 Analytics

The initial Admin Dashboard includes:

- Marketplace analytics.
- Financial analytics.
- Operational analytics.
- Publishing analytics.
- Seller performance rankings.
- Category trends.
- Conversion rates.
- Customer retention.

Reports support daily, weekly, monthly and yearly filters, charts, drill-down views and CSV/PDF exports.

All metrics must be derived from actual database records.

---

## 13. Security, Privacy and Compliance

The platform follows security-by-design and privacy-by-design principles.

Requirements include:

- Secure authentication and authorization.
- Backend enforcement of every protected operation.
- Password hashing.
- Rotating refresh-token sessions.
- Email verification and secure account recovery.
- Mandatory Super Admin MFA.
- Input validation at API boundaries.
- Payment webhook signature verification.
- Idempotent payment processing.
- Private storage for sensitive uploads.
- Encryption and access controls for sensitive information.
- Audit logging for sensitive operations.
- Secure handling of seller KYC and payout details.
- No storage of card numbers, CVVs or UPI PINs.
- Controlled account deletion and lawful data retention.
- Protection against unauthorized access and marketplace abuse.

Before public launch, the platform must undergo professional review for applicable Indian consumer, e-commerce, payment, taxation, intellectual-property, privacy and cybersecurity requirements.

---

## 14. Technology Stack

### Frontend

- React.
- Vite.
- JavaScript ES6+.
- Tailwind CSS.
- Lucide React.
- React Router.
- Axios.
- TanStack Query.
- React Hook Form.
- Zod.

### Backend

- Node.js.
- Express.js.
- JavaScript ES6+.
- MongoDB.
- Mongoose.
- JWT.
- bcryptjs.
- Zod.
- Multer.
- Helmet.
- Nodemailer.

### Database and Storage

- MongoDB Atlas for managed database hosting.
- Mongoose ODM.
- Private object storage for sensitive uploads.

### Testing

- Vitest.
- Supertest.
- React Testing Library.
- Playwright.
- Postman for API verification.

### Infrastructure

- Docker.
- Docker Compose.
- Nginx.
- AWS or compatible cloud hosting.

TypeScript, PostgreSQL, Prisma and Redis are not part of the approved initial technology stack.

The architecture is a modular monolith, not a microservices system.

---

## 15. Major Application Modules

1. Authentication and Session Management.
2. User Profile and Address Management.
3. Capability and Authorization Management.
4. Seller Verification.
5. Author Verification and Publishing.
6. Book Catalogue.
7. Categories and Subjects.
8. Seller Listings.
9. Inventory Management.
10. Search, Filtering and Sorting.
11. Wishlist and Recently Viewed Books.
12. Shopping Cart.
13. Checkout and Payment Attempts.
14. Parent Orders and Seller Orders.
15. Seller Fulfillment and Delivery.
16. Returns and Refunds.
17. Commission and Financial Ledger.
18. Seller Settlements.
19. Reviews and Ratings.
20. Notifications.
21. Customer Support and Disputes.
22. Appeals and Enforcement.
23. Super Admin Dashboard.
24. Analytics and Reporting.
25. Platform Policy Configuration.
26. Privacy and Compliance Management.

---

## 16. Project Scope

### Initial Release

The initial release includes:

- Existing authentication foundation and account management.
- Unified Buyer, Seller and Author capabilities.
- Seller and business verification.
- Physical book catalogue and listings.
- Inventory management.
- Search and discovery.
- Wishlist and cart.
- Multi-seller checkout.
- Payment integration subject to provider verification.
- Parent and seller order management.
- Seller-managed delivery.
- Returns, refunds and disputes.
- Commission and seller settlement workflows.
- Author manuscript submission and review.
- Reviews and ratings.
- In-app and email notifications.
- Super Admin operations and analytics.
- Support and appeal workflows.
- Security, testing and deployment.

### Future Scope

Potential future releases include:

- Digital book publishing and distribution.
- Digital book access management.
- Mobile applications.
- Browser/mobile push notifications.
- Additional marketplace integrations.
- Advanced automation and analytics.

Future functionality must be separately specified and approved.

---

## 17. Engineering and Data Principles

1. All marketplace data must be retrieved from backend APIs and MongoDB.
2. No fabricated sample data may be displayed as real marketplace inventory.
3. Empty states must reflect actual database contents.
4. Business logic belongs in backend services, not frontend components.
5. Every protected operation must be independently authorized by the backend.
6. All monetary values must use integer paise.
7. Financial operations must be idempotent and auditable.
8. Payment success must be verified server-side.
9. Database operations must protect inventory and transaction consistency.
10. Private files must not be exposed through public storage URLs.
11. Existing authentication functionality must be preserved.
12. Database and API changes must be documented and tested.
13. Existing functionality must not be broken by new development.
14. No production credentials or secrets may be committed to version control.

---

## 18. Project Development Lifecycle

Book Bazar will follow this development lifecycle:

1. Requirement Analysis.
2. Business Rule Finalization.
3. Project Documentation.
4. Technical Architecture.
5. Database Design.
6. API Contract Design.
7. UI/UX Design.
8. Backend Development.
9. Frontend Development.
10. Integration.
11. Unit and Integration Testing.
12. End-to-End Testing.
13. Security and Compliance Validation.
14. Deployment.
15. Monitoring and Maintenance.
16. Iterative Improvement.

Each development milestone must be reviewed and validated before moving to the next.

---

## 19. Expected Outcome

The expected outcome is a fully functional, responsive, secure and database-driven multi-vendor physical book marketplace.

The final platform will provide:

- One integrated Buyer, Seller and Author account experience.
- Independent seller inventory and fulfillment.
- Secure and verified payment processing.
- Transparent commission and settlement records.
- Structured publishing and moderation workflows.
- Reliable support, disputes and appeals.
- Comprehensive Super Admin management.
- Accurate analytics based on real platform data.

The application must be tested and legally reviewed before accepting real marketplace transactions.

---

## 20. Document Governance

This document represents the approved high-level project brief.

Detailed functional requirements, workflows, technical architecture, database schemas, API contracts, test cases and development milestones are maintained in their respective project documents.

Changes to approved business rules must be explicitly reviewed and recorded in the consolidated decision register.

**End of Project Brief**
