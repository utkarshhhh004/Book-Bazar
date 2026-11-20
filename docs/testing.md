
# BOOK BAZAR – TESTING STRATEGY AND QUALITY ASSURANCE

**Document Version:** 1.0
**Project:** Book Bazar
**Document Type:** Software Testing and Quality Assurance Plan
**Frontend:** React + JavaScript + Vite
**Backend:** Node.js + Express.js
**Database:** MongoDB + Mongoose
**Testing Approach:** Manual, Automated, Integration and End-to-End Testing
**Status:** Planned

---

# 1. Introduction

## 1.1 Purpose

This document defines the software testing strategy for Book Bazar.

It establishes the testing procedures, tools, test scenarios, quality standards and acceptance criteria required to validate the complete application.

## 1.2 Testing Objectives

The primary objectives are:

- Verify functional requirements.
- Validate frontend functionality.
- Validate backend APIs.
- Verify database operations.
- Test authentication and authorization.
- Validate marketplace business rules.
- Prevent financial inconsistencies.
- Identify security vulnerabilities.
- Verify responsive user interfaces.
- Prevent regression defects.
- Ensure production readiness.

# 2. Testing Technology Stack

| Testing Area               | Tool                  |
| -------------------------- | --------------------- |
| API Testing                | Postman               |
| Unit Testing               | Vitest                |
| Backend API Testing        | Supertest             |
| Frontend Component Testing | React Testing Library |
| End-to-End Testing         | Playwright            |
| Schema Validation          | Zod                   |
| Database Testing           | MongoDB Test Database |
| Code Quality               | ESLint                |
| Formatting                 | Prettier              |
| Container Testing          | Docker Compose        |

# 3. Testing Levels

## 3.1 Unit Testing

Unit testing validates individual functions and components independently.

Examples:

- Price calculation.
- Commission calculation.
- Password validation.
- Inventory quantity validation.
- Entitlement eligibility.
- Input validation.
- Reusable frontend components.

## 3.2 Integration Testing

Integration testing verifies communication between application components.

Examples:

- Express API and MongoDB.
- Authentication middleware and protected APIs.
- Cart and inventory services.
- Checkout and order services.
- Payment and order status updates.
- Seller orders and shipment services.

## 3.3 System Testing

System testing validates the complete application as an integrated system.

Examples:

- User registration and login.
- Book discovery.
- Seller listing creation.
- Shopping and checkout.
- Payment processing.
- Order fulfillment.
- Administrative operations.

## 3.4 End-to-End Testing

End-to-end testing validates complete user journeys through the application interface.

Examples:

- Guest browsing and account registration.
- Buyer purchasing a book.
- Seller listing a book.
- Buyer tracking an order.
- Administrator moderating a listing.

## 3.5 Regression Testing

Regression testing verifies that new changes do not break previously working features.

It must be performed after:

- Database schema changes.
- API modifications.
- Authentication changes.
- Frontend routing changes.
- Business-rule modifications.
- Deployment configuration changes.

# 4. Frontend Testing

## 4.1 General UI Testing

Verify:

- All pages render correctly.
- Navigation works.
- Buttons perform their intended actions.
- Forms accept valid input.
- Invalid input displays appropriate errors.
- Loading indicators work.
- Empty states work.
- Error states work.
- Images load correctly.
- Responsive layouts work.

## 4.2 Component Testing

Important components:

- Navigation bar.
- Sidebar.
- Book cards.
- Search bar.
- Filters.
- Forms.
- Modal dialogs.
- Pagination.
- Cart summary.
- Notification components.
- Dashboard widgets.

## 4.3 Responsive Testing

Test the application on:

- Desktop.
- Laptop.
- Tablet.
- Mobile devices.

Verify layout behavior at common viewport widths and ensure there is no unintended horizontal overflow.

# 5. Backend Testing

## 5.1 API Testing

Every API must be tested for:

- Valid requests.
- Invalid requests.
- Missing parameters.
- Incorrect data types.
- Missing authentication.
- Insufficient authorization.
- Non-existent resources.
- Duplicate requests.
- Unexpected server errors.

## 5.2 Middleware Testing

Verify:

- Authentication middleware.
- Authorization middleware.
- Request validation.
- Error handling.
- Rate limiting.
- CORS configuration.
- Security headers.

## 5.3 Database Testing

Verify:

- Document creation.
- Document retrieval.
- Document updates.
- Document deletion or archival.
- Unique indexes.
- Referential integrity at application level.
- Validation constraints.
- Transaction behavior.
- Concurrent update behavior.

# 6. Authentication Testing

| Test ID  | Scenario                                | Expected Result                 |
| -------- | --------------------------------------- | ------------------------------- |
| AUTH-001 | Register with valid details             | Account created                 |
| AUTH-002 | Register with existing email            | Duplicate registration rejected |
| AUTH-003 | Register with invalid email             | Validation error                |
| AUTH-004 | Register with weak password             | Validation error                |
| AUTH-005 | Login with correct credentials          | Authentication successful       |
| AUTH-006 | Login with incorrect password           | Authentication rejected         |
| AUTH-007 | Access protected endpoint without token | Unauthorized response           |
| AUTH-008 | Access with expired token               | Authentication rejected         |
| AUTH-009 | Refresh valid session                   | New access token issued         |
| AUTH-010 | Logout                                  | Session revoked                 |
| AUTH-011 | Reset password with valid token         | Password updated                |
| AUTH-012 | Access another user's profile           | Access denied                   |

# 7. User and Authorization Testing

Verify:

- Users can access their own profiles.
- Users cannot modify another user's profile.
- Buyers cannot access seller-only operations without seller capability.
- Sellers cannot access administrator endpoints.
- Authors cannot access unauthorized administrative resources.
- Administrators can access authorized management operations.
- Users cannot assign themselves administrator permissions.

# 8. Book Catalogue Testing

| Test ID  | Scenario                            | Expected Result           |
| -------- | ----------------------------------- | ------------------------- |
| BOOK-001 | Retrieve catalogue                  | Books displayed           |
| BOOK-002 | Search existing book                | Relevant results returned |
| BOOK-003 | Search unavailable book             | Appropriate empty state   |
| BOOK-004 | Filter by category                  | Matching books returned   |
| BOOK-005 | Apply price filter                  | Correct results returned  |
| BOOK-006 | Sort books                          | Correct ordering          |
| BOOK-007 | Retrieve valid book details         | Book information returned |
| BOOK-008 | Retrieve invalid book ID            | Appropriate error         |
| BOOK-009 | Access admin catalogue creation     | Authorized admin succeeds |
| BOOK-010 | Unauthorized catalogue modification | Request rejected          |

# 9. Seller and Inventory Testing

| Test ID  | Scenario                             | Expected Result             |
| -------- | ------------------------------------ | --------------------------- |
| SELL-001 | Create valid listing                 | Listing created             |
| SELL-002 | Create listing with invalid price    | Validation error            |
| SELL-003 | Create listing with invalid quantity | Validation error            |
| SELL-004 | Update own listing                   | Listing updated             |
| SELL-005 | Update another seller's listing      | Access denied               |
| SELL-006 | Deactivate own listing               | Listing unavailable         |
| SELL-007 | View seller inventory                | Correct inventory displayed |
| SELL-008 | Purchase unavailable inventory       | Request rejected            |
| SELL-009 | Concurrent inventory updates         | No overselling              |
| SELL-010 | Listing moderation                   | Correct status transition   |

# 10. Cart and Wishlist Testing

Verify:

- Adding an available listing.
- Removing an existing listing.
- Updating item quantity.
- Preventing invalid quantities.
- Preventing duplicate wishlist entries.
- Handling unavailable listings.
- Handling insufficient inventory.
- Retrieving correct cart contents.
- Preventing unauthorized cart access.

# 11. Checkout and Order Testing

| Test ID | Scenario                          | Expected Result               |
| ------- | --------------------------------- | ----------------------------- |
| ORD-001 | Checkout with valid cart          | Preview generated             |
| ORD-002 | Checkout with empty cart          | Request rejected              |
| ORD-003 | Checkout with invalid address     | Validation error              |
| ORD-004 | Checkout with unavailable listing | Request rejected              |
| ORD-005 | Checkout with insufficient stock  | Request rejected              |
| ORD-006 | Checkout with valid inventory     | Order created                 |
| ORD-007 | Multi-seller checkout             | Correct seller orders created |
| ORD-008 | Duplicate checkout request        | No duplicate order            |
| ORD-009 | Cancel eligible order             | Cancellation processed        |
| ORD-010 | Access another user's order       | Access denied                 |

# 12. Payment Testing

Payment testing must be conducted using the selected provider's test or sandbox environment.

| Test ID | Scenario                    | Expected Result                              |
| ------- | --------------------------- | -------------------------------------------- |
| PAY-001 | Initiate valid payment      | Payment initiated                            |
| PAY-002 | Payment succeeds            | Payment marked successful after verification |
| PAY-003 | Payment fails               | Payment marked failed                        |
| PAY-004 | Payment remains pending     | Pending status maintained                    |
| PAY-005 | Invalid webhook signature   | Webhook rejected                             |
| PAY-006 | Duplicate webhook event     | No duplicate processing                      |
| PAY-007 | Incorrect payment amount    | Verification rejected                        |
| PAY-008 | Duplicate payment request   | Idempotency enforced                         |
| PAY-009 | Eligible refund             | Refund workflow initiated                    |
| PAY-010 | Unauthorized payment access | Access denied                                |

Never use real payment credentials or real customer financial information in testing.

# 13. Commission and Entitlement Testing

## 13.1 Commission Testing

Verify:

- Standard commission rate is 10%.
- Commission uses the approved eligible selling-price calculation base.
- First eligible sale receives the applicable commission waiver.
- Subsequent eligible sales use the standard commission rule.
- Commission ledger records are correct.
- Commission is not duplicated.
- Refund and cancellation adjustments are handled correctly.

The treatment of shipping, taxes and discounts must follow the finalized business rules.

## 13.2 First-Transaction Entitlement Testing

Verify:

1. A newly registered account has one available entitlement.
2. A successful purchase consumes the entitlement.
3. A successful eligible sale consumes the entitlement.
4. A failed payment does not consume the entitlement.
5. A cancelled or unsuccessful transaction does not incorrectly consume it.
6. A purchase does not create a buyer platform-fee waiver.
7. An eligible first sale receives the specified seller commission waiver.
8. Concurrent purchase and sale attempts cannot consume the same entitlement twice.

# 14. Courier and Shipment Testing

Verify:

- Shipment creation for eligible seller orders.
- Valid tracking information.
- Courier webhook authenticity.
- Duplicate tracking event handling.
- Shipment status synchronization.
- Delivery status updates.
- Shipment cancellation rules.
- Unauthorized shipment access.

Use provider test environments wherever available.

# 15. Review and Notification Testing

## 15.1 Reviews

Verify:

- Eligible buyers can submit reviews.
- Ineligible buyers cannot submit purchase-based reviews.
- Duplicate review rules are enforced.
- Review ownership is validated.
- Review moderation works.
- Rating calculations are accurate.

## 15.2 Notifications

Verify:

- Notifications are generated for applicable events.
- Correct recipients receive notifications.
- Users can mark notifications as read.
- Users cannot access another user's notifications.
- Duplicate notifications are prevented where required.

# 16. Administrator Testing

Verify:

- Administrator authentication.
- Administrator authorization.
