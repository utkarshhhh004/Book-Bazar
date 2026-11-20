# BOOK BAZAR — FEATURE SPECIFICATION DOCUMENT

**Document Version:** 2.0
**Project:** Book Bazar
**Document Type:** Feature Specification
**Status:** Approved Feature Baseline
**Last Updated:** 20 November 2026

---

# 1. Introduction

## 1.1 Purpose

This document defines the functional modules, features, subfeatures, permissions, expected behaviour and dependencies of Book Bazar.

It translates the approved project requirements into an implementation-oriented feature specification for frontend, backend, database, integration and testing activities.

## 1.2 Application Modules

Book Bazar will contain the following modules:

1. Authentication and Authorization
2. User and Profile Management
3. Address Management
4. Home and Discovery
5. Book Catalogue
6. Book Categories
7. Seller Marketplace
8. Seller Verification
9. Inventory Management
10. Search and Filtering
11. Shopping Cart
12. Wishlist
13. Checkout and Order Creation
14. Payment Management
15. Commission and Entitlement Management
16. Seller Fulfillment and Delivery
17. Returns, Refunds and Disputes
18. Seller Earnings and Payouts
19. Payment Receipts
20. Author Management and Publishing
21. Reviews and Ratings
22. Notification Management
23. Support and Grievance Management
24. Administration Dashboard
25. Analytics and Reporting
26. Audit and Compliance
27. File and Media Management
28. Privacy and Account Management
29. Digital Publishing — Future Module

## 1.3 User Capabilities

| User Type   | Primary Capabilities                                        |
| ----------- | ----------------------------------------------------------- |
| Guest       | Browse, search and view public marketplace content          |
| Buyer       | Cart, checkout, payments, orders, returns and reviews       |
| Seller      | Verification, listings, inventory, fulfillment and earnings |
| Author      | Publication submissions and author profile management       |
| Super Admin | Platform governance, moderation and financial oversight     |

Buyer, Seller and Author capabilities may coexist on one account. Super Admin access is separately provisioned and protected.

## 1.4 Documentation Relationship

Authentication-specific implementation details are maintained separately under `docs/authentication/`.

The supporting documents cover:

- Authentication feature specification.
- Authentication user flow.
- Authentication technical specification.
- Authentication database design.
- Authentication API documentation.
- Authentication testing.

These documents supplement this feature specification and must be kept consistent with the approved project requirements.

---

# 2. Authentication and Authorization Module

## 2.1 Registration

**Features:**

- User registration.
- Full name collection.
- Email address collection.
- Mobile number collection where required.
- Password creation and confirmation.
- Terms and conditions acceptance.
- Registration validation.
- Duplicate account detection.
- Default Buyer capability assignment.

**Expected Behaviour:**

The system validates registration information, securely hashes passwords and creates a new account. Every new account receives Buyer capability by default.

## 2.2 Email Verification

**Features:**

- Verification token generation.
- Email delivery.
- Token verification.
- Token expiration.
- Resend verification.
- Verification status management.

**Expected Behaviour:**

The system verifies the user's email address before allowing operations that require verified contact information.

## 2.3 Login and Logout

**Features:**

- Email-based login.
- Password authentication.
- JWT-based authentication.
- Login validation.
- Authentication persistence.
- Secure logout.
- Session management.
- Session expiration and invalidation.

## 2.4 Password Management

**Features:**

- Forgot password.
- Password reset token generation.
- Password reset verification.
- Token expiration.
- New password creation.
- Password change.
- Password validation.

## 2.5 Capability Management

**Features:**

- Buyer capability.
- Seller capability activation.
- Author capability activation.
- Multiple capabilities on one account.
- Capability-specific authorization.
- Capability-specific restrictions.
- Full account suspension where necessary.
- Separate Super Admin authorization.

**Expected Behaviour:**

The frontend displays functionality according to active capabilities. The backend independently validates every protected operation.

---

# 3. User and Profile Management Module

## 3.1 User Profile

**Features:**

- View profile.
- Edit personal information.
- Upload profile image.
- Update permitted contact information.
- View account status.
- View active capabilities.

## 3.2 Account Settings

**Features:**

- Change password.
- Manage account preferences.
- Manage notification preferences.
- Manage verification information.
- View account security information.
- Request account deletion.
- Logout.

## 3.3 Account Status

**Features:**

- Active account.
- Restricted account.
- Suspended account.
- Deletion requested.
- Deactivated or anonymized account where applicable.

**Expected Behaviour:**

Restrictions shall be enforced according to the affected capability. Financial and order records must remain available where legally or operationally required.

---

# 4. Address Management Module

**Features:**

- Add address.
- Edit address.
- Delete address where permitted.
- View saved addresses.
- Select default address.
- Select delivery address during checkout.
- Validate address information.

**Address Fields:**

- Recipient name.
- Mobile number.
- House/building information.
- Street/locality.
- Landmark.
- City.
- State.
- Postal code.
- Country.

**Expected Behaviour:**

Buyers can maintain multiple delivery addresses. Order records preserve an address snapshot so later profile changes do not modify historical order information.

---

# 5. Home and Discovery Module

## 5.1 Homepage

**Features:**

- Main navigation.
- Search bar.
- Featured books.
- Popular categories.
- Recently added books.
- Recommended books.
- Promotional banners.
- Seller discovery.
- Author discovery.
- Footer navigation.

**Expected Behaviour:**

Homepage content must be database-backed. Promotional or featured content may be configured by the Super Admin.

## 5.2 Navigation

**Features:**

- Home.
- Explore Books.
- Categories.
- Wishlist.
- Cart.
- My Orders.
- Seller Dashboard.
- Author Dashboard.
- Profile.
- Account Settings.
- Super Admin Dashboard for authorized administrators.

**Expected Behaviour:**

Navigation options depend on active capabilities and permissions. Hiding a navigation option is not a substitute for backend authorization.

---

# 6. Book Catalogue Module

## 6.1 Book Information

Each catalogue book may contain:

- Book title.
- Author names.
- ISBN.
- Publisher.
- Edition.
- Language.
- Description.
- Category.
- Subcategory.
- Publication year.
- Page count.
- Cover image.
- Additional book metadata.

**Mandatory Catalogue Information:**

- Title.
- Author names.
- Publisher.
- Edition where applicable.
- Language.
- Category.
- Cover image for a new catalogue entry.

ISBN and publication year are recommended where available.

## 6.2 Catalogue Management

**Features:**

- Create catalogue entry.
- View catalogue entry.
- Edit permitted catalogue information.
- Associate multiple seller offers with one catalogue book.
- Detect potential duplicate entries.
- Review catalogue submissions.
- Deactivate or moderate catalogue entries.

**Expected Behaviour:**

The catalogue represents the identity and general information of a book. It must not contain seller-specific prices or inventory as shared catalogue attributes.

## 6.3 Book Detail Page

**Features:**

- Book cover.
- Title and author.
- Publisher and edition.
- Language and publication information.
- Description and metadata.
- Book rating.
- Available seller offers.
- Seller identity.
- Book condition.
- Offer price.
- Stock availability.
- Shipping information.
- Add to wishlist.
- Add selected seller offer to cart.
- Related books.

## 6.4 Seller Offer Comparison

**Features:**

- Display multiple seller offers.
- Show condition and price for each offer.
- Show seller information.
- Show shipping charges.
- Show stock availability.
- Identify the lowest currently available offer.

**Expected Behaviour:**

The marketplace book card displays the lowest currently available offer and the number of available seller offers. The detail page displays all eligible offers.

---

# 7. Book Categories Module

**Features:**

- Category listing.
- Subcategory listing.
- Category details.
- Category-based discovery.
- Category filtering.
- Category management by Super Admin.
- Category activation and deactivation.

**Expected Behaviour:**

Categories shall be maintained in the database. Inactive categories shall not be available for new public listings unless explicitly permitted by policy.

---

# 8. Seller Marketplace Module

## 8.1 Seller Capability Activation

**Features:**

- Activate Seller capability.
- Submit seller information.
- Select individual or business seller type.
- View verification status.
- Access seller dashboard.
- Create draft listings before verification approval.

## 8.2 Seller Dashboard

**Features:**

- Seller profile summary.
- Verification status.
- Active listings.
- Draft listings.
- Inventory summary.
- New orders.
- Pending dispatches.
- Completed orders.
- Sales summary.
- Commission summary.
- Eligible earnings.
- Payout history.
- Support and dispute notifications.

## 8.3 Seller Profile

**Features:**

- Seller display name.
- Seller type.
- Public seller information.
- Dispatch location.
- Seller rating.
- Active listings.
- Seller status.

Private verification documents and sensitive account information must never be displayed publicly.

---

# 9. Seller Verification Module

## 9.1 Individual Seller Verification

**Features:**

- Progressive identity information submission.
- Required document uploads.
- Verification status.
- Additional information requests.
- Approval or rejection.

## 9.2 Business Seller Verification

**Features:**

- Business identity information.
- Applicable business documentation.
- Authorized representative information.
- Supporting document uploads.
- Verification status and review history.

## 9.3 Verification Review

**Features:**

- Pending review.
- Under review.
- Additional documents required.
- Approved.
- Rejected.
- Suspended.

**Expected Behaviour:**

Sellers may prepare draft listings before approval. Public listing is permitted only after the required seller verification has been approved.

Exact verification documents and legal requirements must be confirmed before production launch.

---

# 10. Seller Listing Management Module

## 10.1 Create Listing

**Features:**

- Select an existing catalogue book.
- Request a new catalogue entry where necessary.
- Select book condition.
- Enter fixed selling price.
- Enter available quantity.
- Upload actual book photographs where required.
- Enter seller-specific description.
- Disclose defects and missing pages.
- Configure shipping charges.
- Enter dispatch location and handling information.

## 10.2 Book Conditions

Supported conditions:

1. New.
2. Like New.
3. Very Good.
4. Good.
5. Acceptable.

## 10.3 Used and Rare Book Details

**Features:**

- Actual photographs.
- Physical condition description.
- Missing pages or defects.
- Markings and annotations.
- Printing information.
- Publication or printing year.
- Signed-copy information.
- Provenance.
- Collectible features.

## 10.4 Listing Management

**Features:**

- Create draft listing.
- Edit listing.
- Publish listing after verification.
- Deactivate listing.
- Update price.
- Update quantity.
- View listing status.
- View listing history.

**Expected Behaviour:**

A listing represents a seller-specific offer for a catalogue book. Price, condition, shipping and inventory belong to the listing, not the shared catalogue.

Negotiation and bidding are excluded from the initial release.

---

# 11. Inventory Management Module

## 11.1 Inventory Operations

**Features:**

- Add inventory.
- Reduce inventory.
- Update available quantity.
- View stock.
- View reserved quantity.
- View inventory history.
- Prevent negative stock.

## 11.2 Inventory Reservation

**Features:**

- Reserve inventory during checkout.
- Apply a 15-minute reservation expiry.
- Release expired reservations.
- Restore inventory after eligible cancellations.
- Prevent concurrent overselling.
- Record reservation events.

**Expected Behaviour:**

Adding an item to the cart does not reserve stock. Inventory is reserved only when checkout begins.

Expired reservations must be released through explicit application-level processing. Database TTL deletion alone is insufficient.

---

# 12. Search and Filtering Module

## 12.1 Search

Search shall support:

- Book title.
- Author.
- ISBN.
- Publisher.
- Keywords.

## 12.2 Filters

Available filters:

- Category.
- Book condition.
- Minimum and maximum price.
- Language.
- Seller type.
- In-stock availability.
- Publisher.
- Edition.
- Publication year.

## 12.3 Sorting

Available sorting options:

- Relevance.
- Price: Low to High.
- Price: High to Low.
- Newest Listings.
- Recently Added.

## 12.4 Search Behaviour

**Expected Behaviour:**

- Results shall be database-backed.
- Search results shall support pagination.
- Books without active seller offers shall be hidden from purchasable marketplace results.
- Out-of-stock offers shall not be purchasable.
- Loading, error and empty states shall be supported.
- Search filters shall work together without producing inconsistent results.

---

# 13. Shopping Cart Module

## 13.1 Cart Operations

**Features:**

- Add offer to cart.
- Remove item.
- Update quantity.
- View cart.
- Validate current price.
- Validate current stock.
- Display seller-wise items.

## 13.2 Multi-Seller Cart

**Features:**

- One unified cart.
- Items from multiple sellers.
- Seller-wise grouping.
- Individual shipping charges.
- Combined estimated total.
- Quantity validation.

## 13.3 Cart Summary

The cart shall display:

- Book subtotal.
- Seller-wise shipping charges.
- Applicable gateway fees.
- Applicable taxes.
- Combined estimated amount.

**Expected Behaviour:**

The cart does not guarantee stock availability or reserve inventory. Prices and stock must be revalidated before checkout.

---

# 14. Wishlist Module

**Features:**

- Add book to wishlist.
- Remove book from wishlist.
- View saved books.
- Navigate to book detail.
- Handle unavailable books.
- Display availability changes where supported.

**Expected Behaviour:**

Wishlist records belong to the buyer account. Saving a book does not reserve stock or create a purchase commitment.

---

# 15. Checkout and Order Management Module

## 15.1 Checkout

**Features:**

- Select delivery address.
- Review cart items.
- Review seller-wise shipping.
- Review applicable fees and taxes.
- Validate current prices.
- Validate seller status.
- Validate inventory.
- Reserve eligible inventory.
- Confirm order summary.

## 15.2 Parent Order

**Features:**

- Generate parent order identifier.
- Associate buyer information.
- Store overall purchase summary.
- Store payment reference.
- Maintain overall order status.
- Maintain order creation timestamp.

## 15.3 Seller Orders

**Features:**

- Create one seller order per participating seller.
- Store seller-specific items.
- Store seller-specific shipping information.
- Maintain seller fulfillment status.
- Maintain shipment tracking.
- Maintain seller-specific cancellation and dispute information.

## 15.4 Order History

**Features:**

- View all orders.
- View parent order details.
- View seller order details.
- View payment status.
- View shipment status.
- View cancellation and refund history.
- Access payment receipts.

**Expected Behaviour:**

One multi-seller checkout produces one parent order and separate seller orders. Each seller shipment is tracked independently.

Payment status, parent order status and seller fulfillment status must remain separate.

---

# 16. Payment Management Module

## 16.1 Payment Initiation

**Features:**

- Create payment attempt.
- Generate provider order or payment reference.
- Initiate supported payment method.
- Maintain payment attempt status.
- Handle payment retries.

## 16.2 Payment Verification

**Features:**

- Backend payment verification.
- Provider webhook handling.
- Webhook signature verification.
- Idempotent event processing.
- Late-success handling.
- Payment reconciliation.

## 16.3 Payment Status

Supported states:

- Initiated.
- Pending.
- Successful.
- Failed.
- Expired.
- Refund Initiated.
- Refunded.

## 16.4 Payment Security

**Features:**

- Secure provider integration.
- No storage of card numbers.
- No storage of CVV.
- No storage of UPI PIN.
- Protected payment references.
- Trusted backend verification.

## 16.5 Payment Provider

Cashfree Easy Split is the preferred candidate, not a finalized provider.

Provider selection requires confirmation of:

- Marketplace eligibility.
- UPI-only seller onboarding.
- Settlement capabilities.
- Pricing and transaction charges.
- Refund handling.
- Multi-seller split capabilities.
- Webhook support.
- Reconciliation support.

The frontend must never be able to declare a payment successful without trusted backend verification.

---

# 17. Commission and First-Transaction Entitlement Module

## 17.1 Commission Calculation

**Features:**

- Calculate seller commission.
- Maintain commission records.
- Apply seller-funded discounts.
- Exclude delivery charges from commission base.
- Exclude separately collected taxes from commission base.
- Display commission deductions to sellers.

**Default Commission:** 10%.

## 17.2 First-Transaction Entitlement

**Features:**

- Maintain a shared purchase/sale entitlement.
- Track the first successful transaction.
- Consume entitlement on successful purchase or sale.
- Waive commission on the first eligible sale if entitlement remains unused.
- Apply normal commission to subsequent eligible sales.
- Maintain entitlement history.

**Expected Behaviour:**

A first successful purchase consumes the entitlement without providing a buyer fee waiver. If the first successful transaction is an eligible sale, the seller receives the commission waiver for that sale.

## 17.3 Financial Records

**Features:**

- Immutable completed transaction records.
- Commission ledger.
- Adjustment records.
- Reversal records.
- Audit history.

All monetary values shall use integer paise.

---

# 18. Seller Fulfillment and Delivery Module

## 18.1 Seller Order Processing

**Features:**

- View incoming seller orders.
- Confirm order processing.
- Pack items.
- Update fulfillment status.
- Enter dispatch details.
- Report delays.

## 18.2 Seller-Managed Delivery

**Features:**

- Seller selects courier or delivery arrangement.
- Seller manages packaging.
- Seller arranges dispatch.
- Seller enters courier name where applicable.
- Seller enters tracking information.
- Seller uploads dispatch evidence.
- Seller reports delivery issues.

## 18.3 Dispatch Rules

**Features:**

- Dispatch within three business days after confirmed payment.
- Dispatch deadline tracking.
- Late-dispatch reminders.
- Escalation.
- Buyer notification.
- Proportionate enforcement.

## 18.4 Buyer Tracking

**Features:**

- View seller-wise shipment status.
- View courier and tracking information.
- View dispatch information.
- Receive shipment notifications.
- Report delivery problems.

**Expected Behaviour:**

The initial release uses seller-managed delivery. Platform-managed courier booking and mandatory platform shipping labels are not required.

---

# 19. Returns, Refunds and Disputes Module

## 19.1 Cancellation

**Features:**

- Buyer cancellation request before dispatch.
- Cancellation eligibility validation.
- Seller non-dispatch cancellation handling.
- Cancellation reason.
- Inventory release where applicable.
- Refund initiation where applicable.

## 19.2 Return Requests

**Features:**

- Return request creation.
- Three-calendar-day return window after delivery.
- Issue selection.
- Description of issue.
- Evidence upload.
- Request status tracking.

## 19.3 Eligible Return Reasons

- Wrong book delivered.
- Undisclosed damage or defects.
- Missing pages.
- Materially inaccurate listing.
- Counterfeit or unauthorized copy.
- Qualifying delivery issues after investigation.

Ordinary change-of-mind returns are excluded under the proposed platform policy, subject to applicable consumer law.

## 19.4 Dispute Management

**Features:**

- Buyer evidence submission.
- Seller response.
- Super Admin investigation.
- Dispute decision.
- Reason recording.
- Refund or other resolution.
- Dispute history.

## 19.5 Refund Management

**Features:**

- Refund eligibility validation.
- Original payment method refund where supported.
- Provider refund reference.
- Refund status.
- Refund history.
- Separate refund transaction records.

**Expected Behaviour:**

Applicable Indian consumer rights and statutory requirements override platform return and refund policies.

---

# 20. Seller Earnings and Payout Module

## 20.1 Earnings Dashboard

**Features:**

- Gross sales.
- Seller-funded discounts.
- Platform commission.
- Refunds and adjustments.
- Net seller earnings.
- Pending earnings.
- Eligible earnings.
- Held amounts.
- Settled amounts.

## 20.2 Payout Eligibility

**Features:**

- Delivery confirmation.
- Three-calendar-day return window completion.
- Dispute and refund checks.
- Chargeback checks.
- Payout hold management.

## 20.3 Payout Configuration

**Features:**

- UPI ID/VPA submission.
- Payout destination verification.
- Re-verification after payout detail changes.
- Secure payout destination management.

## 20.4 Payout Processing

**Features:**

- Weekly automatic settlement.
- No platform-defined minimum payout.
- Provider payout reference.
- Payout status.
- Settlement timestamps.
- Payout history.
- Failure handling.

**Expected Behaviour:**

UPI-only seller payouts and provider-imposed settlement restrictions must be verified before launch. Payout success must be confirmed by trusted provider information.

---

# 21. Payment Receipt Module

## 21.1 Receipt Generation

**Features:**

- Unique receipt number.
- Parent order reference.
- Payment transaction reference.
- Gateway reference.
- Buyer name and email.
- Payment timestamp.
- Payment method and status.
- Book subtotal.
- Shipping charges.
- Gateway fee where applicable.
- Taxes where applicable.
- Total payment amount.

## 21.2 Receipt Delivery

**Features:**

- Automatic email delivery.
- Downloadable PDF.
- Buyer order history access.
- Duplicate generation prevention.
- Duplicate email prevention.

**Expected Behaviour:**

A receipt is generated only after server-verified successful payment. Refunds are recorded separately. A payment receipt is not a substitute for a legally required tax invoice.

---

# 22. Author Management and Publishing Module

## 22.1 Author Capability

**Features:**

- Activate Author capability.
- Access author dashboard.
- Manage author profile.
- Submit publication.
- View publication status.

## 22.2 Publication Submission

**Features:**

- Book title and publication details.
- Author information.
- Authorship declaration.
- Ownership declaration.
- Supporting evidence uploads.
- Copyright and permission information where applicable.
- Submission history.

## 22.3 Publication Review

**Features:**

- Pending review.
- Under review.
- Additional documents required.
- Approved.
- Rejected.
- Suspended.
- Removed.

## 22.4 Review Criteria

The review process shall consider:

- Authorship and ownership.
- Copyright concerns.
- Plagiarism.
- Legal compliance.
- Misrepresentation.
- Missing permissions.
- Policy violations.

Legitimate creative work shall not be rejected solely because of its genre or subject.

## 22.5 Public Author Profile

**Features:**

- Automatic public profile after first publication approval.
- Author display name.
- Optional biography.
- Optional photograph.
- Genres.
- Approved publications.
- Verified author indicator.

Private verification documents and private account information shall not be publicly exposed.

## 22.6 Printing Responsibility

Authors shall arrange and fund their own physical printing. Book Bazar will not provide printing or financing services in the initial release.

Digital publishing and digital book distribution are future-phase capabilities.

---

# 23. Reviews and Ratings Module

## 23.1 Review Eligibility

**Features:**

- Verified purchaser validation.
- Successful purchase validation.
- Confirmed delivery validation.
- Review submission.

## 23.2 Book Review

**Features:**

- One-to-five-star rating.
- Written review.
- Optional photographs.
- Edit within three calendar days.
- Delete own review.

## 23.3 Seller Review

**Features:**

- One-to-five-star seller rating.
- Packaging feedback.
- Dispatch-speed feedback.
- Communication feedback.
- Listing-accuracy feedback.

## 23.4 Review Moderation

**Features:**

- Report review.
- Admin review queue.
- Moderation decision.
- Removal with reason.
- Audit history.

**Expected Behaviour:**

Book ratings belong to catalogue books. Seller ratings belong to individual sellers. Sellers cannot publicly respond to reviews in the initial release. Legitimate negative reviews shall not be removed without a policy-based reason.

---

# 24. Notification Management Module

## 24.1 Notification Channels

Initial release:

- In-app notifications.
- Email notifications.

Future phase:

- Push notifications where supported.

## 24.2 Transactional Notifications

**Events:**

- Registration and email verification.
- Security events.
- Order confirmation.
- Payment status changes.
- Seller dispatch.
- Shipment updates.
- Delivery confirmation.
- Cancellation.
- Return and dispute updates.
- Refund updates.
- Payout updates.
- Verification decisions.
- Publication review decisions.

## 24.3 Optional Notifications

Users may individually configure:

- Recommendations.
- New arrivals.
- Offers and discounts.
- Wishlist price updates.
- Newsletters.
- Announcements.

## 24.4 Notification Reliability

**Features:**

- Event-based notification generation.
- Duplicate notification prevention.
- Delivery status tracking where supported.
- Notification history.
- User preferences.

Essential transactional and security notifications remain enabled where required.

---

# 25. Support and Grievance Management Module

## 25.1 Support Tickets

**Features:**

- Create support ticket.
- Select issue category.
- Enter issue description.
- Attach supporting evidence.
- Link relevant order.
- View ticket status.
- View communication history.

## 25.2 Dispute Support

**Features:**

- Order-related issue reporting.
- Buyer and seller evidence.
- Admin investigation.
- Resolution history.

## 25.3 Grievance Mechanism

**Features:**

- Contact and grievance information.
- Complaint submission.
- Complaint tracking.
- Resolution communication.
- Audit history.

Operational response targets shall be defined subject to statutory deadlines and legal review.

---

# 26. Administration Dashboard Module

## 26.1 Super Admin Authentication

**Features:**

- Separate administrative login.
- Securely provisioned Super Admin account.
- Password hashing.
- Mandatory MFA for every login.
- Secure recovery.
- Administrative session management.

## 26.2 Dashboard Overview

**Features:**

- Total users.
- Active buyers.
- Active sellers.
- Active authors.
- Total catalogue books.
- Active listings.
- Total orders.
- Successful payments.
- Platform commission.
- Seller earnings.
- Pending payouts.
- Open disputes.
- Pending verification applications.
- Pending publication reviews.

All figures must be derived from real database records.

## 26.3 User Management

**Features:**

- Search users.
- View user information.
- View active capabilities.
- View account status.
- Apply capability-specific restrictions.
- Suspend accounts for serious cases.
- Record enforcement reasons.
- Review enforcement history.

## 26.4 Seller Verification Management

**Features:**

- View applications.
- Review submitted documents.
- Approve applications.
- Reject applications.
- Request additional information.
- Record decisions and reasons.

## 26.5 Author Publishing Management

**Features:**

- View publication submissions.
- Review supporting evidence.
- Request additional documentation.
- Approve or reject submissions.
- Suspend or remove approved publications where justified.
- Record review decisions.

## 26.6 Marketplace Management

**Features:**

- Manage categories.
- Manage catalogue entries.
- Review listings.
- Moderate reported content.
- Manage listing policies.
- Configure minimum listing price.
- Publish announcements.

## 26.7 Financial Management

**Features:**

- View payment records.
- View commission records.
- View seller earnings.
- View payout records.
- Initiate eligible refunds.
- Place payout holds.
- Release valid payout holds.
- Record adjustment reasons.
- Review financial audit history.

The Super Admin cannot fabricate payment or payout success. Completed financial records must remain immutable; corrections use separate adjustment records.

## 26.8 Policy Configuration

The Super Admin shall be able to configure:

- Commission rate.
- Dispatch deadline.
- Return window, subject to applicable law.
- Marketplace categories.
- Listing rules.
- Minimum listing price.
- Seller eligibility rules.
- Publishing guidelines.
- Notification templates.
- Announcements.

Policy changes shall have effective dates, audit history and no retroactive effect on completed transactions.

---

# 27. Analytics and Reporting Module

## 27.1 Marketplace Analytics

**Features:**

- Total sales.
- Order volume.
- Catalogue growth.
- Listing growth.
- Category trends.
- Seller rankings.
- Buyer activity.
- Conversion metrics.
- Retention metrics.

## 27.2 Financial Analytics

**Features:**

- Gross transaction value.
- Platform commission.
- Seller earnings.
- Refund totals.
- Payout totals.
- Pending settlements.
- Financial adjustments.

## 27.3 Operational Analytics

**Features:**

- Dispatch performance.
- Delivery performance.
- Cancellation rates.
- Return rates.
- Dispute volume.
- Seller verification status.
- Publication review workload.

## 27.4 Reporting

**Features:**

- Daily filters.
- Weekly filters.
- Monthly filters.
- Yearly filters.
- Charts.
- Drill-down views.
- CSV export.
- PDF export.

**Expected Behaviour:**

Analytics must be calculated from actual database records. Static or fabricated figures must not be presented as live business metrics.

---

# 28. Audit and Compliance Module

## 28.1 Audit Records

**Features:**

- Actor identification.
- Action type.
- Affected entity.
- Timestamp.
- Reason.
- Relevant reference identifiers.
- Administrative action history.

## 28.2 Financial Audit

**Features:**

- Payment event history.
- Commission ledger.
- Refund history.
- Payout history.
- Adjustment records.
- Reconciliation records.

## 28.3 Compliance Controls

**Features:**

- Privacy controls.
- Data retention controls.
- Access restrictions.
- Verification record protection.
- Legal record preservation.
- Account deletion review.

Sensitive administrative and financial actions must be auditable. Completed financial records must not be silently overwritten or deleted.

---

# 29. File and Media Management Module

## 29.1 Upload Categories

- Profile photographs.
- Catalogue cover images.
- Seller listing photographs.
- Seller verification documents.
- Author evidence documents.
- Return and dispute evidence.

## 29.2 Upload Validation

**Features:**

- File type validation.
- File size validation.
- Upload authorization.
- Secure storage.
- Controlled file retrieval.
- Deletion according to retention policy.

## 29.3 Storage Rules

**Expected Behaviour:**

Private verification and dispute documents must use private object storage. Public catalogue and listing images may use controlled public delivery. Private documents must never be exposed through unrestricted public URLs.

---

# 30. Privacy and Account Management Module

## 30.1 Privacy

**Features:**

- Controlled access to personal information.
- Restricted access to verification documents.
- Secure handling of payout information.
- Data minimization.
- Retention management.

## 30.2 Account Deletion

**Features:**

- Deletion request.
- Identity verification.
- Outstanding transaction checks.
- Legal retention checks.
- Data deletion or anonymization where permitted.
- Request status.
- Audit history.

**Expected Behaviour:**

Account deletion must not destroy records required for financial, legal, tax, dispute or operational obligations.

---

# 31. Digital Publishing — Future Module

Digital publishing is outside the initial release.

Potential future capabilities may include:

- E-book catalogue entries.
- Digital file uploads.
- Digital rights and ownership checks.
- Secure digital distribution.
- Digital purchase workflows.
- Download restrictions.
- Digital content protection.

No digital book or PDF sale workflow shall be assumed during initial marketplace implementation.

---

# 32. Feature Dependencies

| Feature               | Dependencies                                     |
| --------------------- | ------------------------------------------------ |
| Registration          | Database, email verification, authentication     |
| Capability activation | Authentication, authorization                    |
| Seller verification   | File storage, admin review                       |
| Book catalogue        | Database, category management                    |
| Seller listings       | Catalogue, seller verification                   |
| Search and discovery  | Catalogue, listings, indexing/query strategy     |
| Cart                  | Listings, inventory                              |
| Checkout              | Cart, addresses, inventory reservation           |
| Orders                | Checkout, payment                                |
| Payment               | Payment provider, webhook verification           |
| Commission            | Orders, payment confirmation, entitlement ledger |
| Fulfillment           | Seller orders, tracking information              |
| Returns and refunds   | Orders, delivery status, payment provider        |
| Seller payouts        | Earnings ledger, provider settlement             |
| Payment receipts      | Verified payment, PDF generation, email          |
| Author publishing     | Author capability, file storage, admin review    |
| Reviews               | Completed orders, delivery confirmation          |
| Notifications         | Application events, email service                |
| Analytics             | Marketplace and financial records                |
| Administration        | Authentication, MFA, authorization, audit        |

---

# 33. Feature Prioritization

## P0 — Initial Release Critical Features

- Authentication and authorization.
- Buyer, Seller and Author capabilities.
- Profile and address management.
- Catalogue and category management.
- Seller verification.
- Seller listings.
- Marketplace discovery and search.
- Inventory management.
- Cart and checkout.
- Parent and seller orders.
- Payment verification.
- Commission and first-transaction entitlement.
- Seller fulfillment and tracking.
- Cancellation and return workflows.
- Seller earnings and payouts.
- Payment receipts.
- Super Admin authentication and governance.
- Audit and financial record integrity.

## P1 — Initial Release Important Features

- Wishlist.
- Author publishing and public profiles.
- Reviews and ratings.
- Notification preferences.
- Support tickets and grievance management.
- Structured appeals.
- Advanced analytics.
- Account deletion and privacy workflows.

## P2 — Future Enhancements

- Digital publishing and digital book distribution.
- Push notifications.
- Additional marketplace automation.
- Expanded reporting and analytics.
- Additional operational administrator capabilities, if approved.
- Additional payment and logistics integrations.

---

# 34. Feature Acceptance Principles

A feature is considered complete only when:

1. Its user-facing behaviour is implemented.
2. Its backend business rules are enforced.
3. Its database operations preserve data integrity.
4. Its permissions are validated server-side.
5. Its loading, success, error and empty states are handled.
6. Its relevant validation and edge cases are covered.
7. Its automated tests pass.
8. Its API and technical documentation are updated.
9. Existing functionality remains operational.
10. Its implementation follows approved project decisions.

---

# 35. Change Management

Any proposed feature change must be reviewed against:

- Project Brief.
- Software Requirements Specification.
- Approved business decisions.
- User flows.
- Technical specification.
- Database design.
- API documentation.
- Security and privacy requirements.
- Testing and regression impact.

A feature that changes an approved business rule must not be implemented without explicit review and approval.

---

# 36. Document Governance

| Field        | Value                                  |
| ------------ | -------------------------------------- |
| Document     | Feature Specification                  |
| Project      | Book Bazar                             |
| Version      | 2.0                                    |
| Status       | Approved Feature Baseline              |
| Owner        | Book Bazar Project Team                |
| Last Updated | 20 November 2026                       |
| Next Review  | Before detailed feature implementation |

**End of Document**
