# BOOK BAZAR — API DOCUMENTATION

**Document Version:** 2.0
**Project:** Book Bazar
**Document Type:** REST API Specification
**Backend:** Node.js + Express.js
**Language:** JavaScript (ES6+)
**Database:** MongoDB
**ODM:** Mongoose
**API Version:** v1
**Development Base URL:** `http://localhost:4000/api/v1`
**Production Base URL:** Configured through deployment environment
**Status:** Approved API Contract — Implementation Pending

---

# 1. Introduction

## 1.1 Purpose

This document defines the REST API architecture of Book Bazar.

It specifies:

- API endpoints and HTTP methods.
- Request parameters and body structures.
- Response formats.
- Authentication and authorization.
- Capability-based access control.
- Validation and error handling.
- Payment and order processing.
- Seller and author workflows.
- Super Admin operations.
- Security and idempotency requirements.

## 1.2 API Architecture

The backend exposes versioned REST APIs using Express.js.

The frontend communicates with the backend using Axios.

The backend follows a modular monolith architecture. Each business domain has separate routes, controllers, services, models and validation responsibilities.

Business rules must remain inside backend services rather than being implemented exclusively in route handlers or frontend code.

## 1.3 Base URL

Development:

`http://localhost:4000/api/v1`

Production:

`https://your-domain.com/api/v1`

The production URL must be supplied through deployment configuration.

---

# 2. API Conventions

## 2.1 HTTP Methods

| Method | Purpose                                 |
| ------ | --------------------------------------- |
| GET    | Retrieve resources                      |
| POST   | Create resources or initiate operations |
| PUT    | Replace a resource                      |
| PATCH  | Partially update a resource             |
| DELETE | Delete eligible resources               |

## 2.2 Request Headers

Standard headers:

```http
Content-Type: application/json
Accept: application/json
```

Authenticated requests:

```http
Authorization: Bearer <access_token>
```

Refresh-token operations use secure HttpOnly cookies.

Payment webhook endpoints use the provider's required signature and verification headers.

## 2.3 Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## 2.4 Error Response

```json
{
  "success": false,
  "message": "Request could not be processed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

## 2.5 Paginated Response

```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalItems": 100,
      "totalPages": 9,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## 2.6 Pagination Parameters

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| page      | Number | Current page          |
| limit     | Number | Records per page      |
| sortBy    | String | Allowed sorting field |
| order     | String | asc or desc           |

Defaults:

- Page: 1
- Limit: 12
- Maximum limit: 100

The backend must validate pagination parameters and restrict sorting to permitted fields.

## 2.7 Monetary Values

All monetary request and response values use integer paise.

Example:

- ₹100.00 = `10000`
- ₹350.00 = `35000`
- ₹1,250.50 = `125050`

Currency is INR unless explicitly configured otherwise.

The API must never rely on floating-point arithmetic for financial calculations.

## 2.8 Resource Identifiers

MongoDB ObjectIds are used internally.

Public order numbers and ticket numbers may use separate human-readable identifiers.

The backend must validate identifier formats before database queries.

---

# 3. Authentication and Authorization

## 3.1 Account Capabilities

One account can possess multiple capabilities:

- Buyer
- Seller
- Author

Default capability: `buyer`.

Seller and Author capabilities can be activated later.

There is no role-selection requirement during registration.

Super Admin is separate from ordinary user capabilities.

## 3.2 Access Types

| Access Type     | Description                                     |
| --------------- | ----------------------------------------------- |
| Public          | No authentication required                      |
| Authenticated   | Valid user authentication required              |
| Buyer           | Buyer capability required                       |
| Seller          | Seller capability required                      |
| Verified Seller | Seller capability and required verification     |
| Author          | Author capability required                      |
| Super Admin     | Dedicated administrative authorization required |

## 3.3 Authorization Requirements

- Every protected endpoint must verify authentication.
- Capability-specific endpoints must verify the required capability.
- Seller operations must verify resource ownership.
- Buyer operations must verify order and resource ownership.
- Author operations must verify publication ownership.
- Super Admin operations require separate administrative authentication and authorization.
- Ordinary users cannot assign themselves administrative permissions.
- Account restrictions must be checked before sensitive operations.
- Capability-specific restrictions must not automatically disable unrelated capabilities.

## 3.4 Authentication Middleware

Expected middleware responsibilities:

- `authenticate`
- `requireVerifiedEmail`
- `requireCapability`
- `requireSellerVerification`
- `requireSuperAdmin`
- `validateRequest`
- `authRateLimiter`
- `verifyResourceOwnership`

Exact middleware names may change during implementation without changing the API contract.

---

# 4. Authentication APIs

**Base Path:** `/auth`

| Method | Endpoint                 | Access         | Description               |
| ------ | ------------------------ | -------------- | ------------------------- |
| POST   | `/register`            | Public         | Register an account       |
| POST   | `/login`               | Public         | Authenticate user         |
| POST   | `/refresh`             | Refresh Cookie | Renew access token        |
| POST   | `/logout`              | Authenticated  | Revoke current session    |
| POST   | `/logout-all`          | Authenticated  | Revoke all sessions       |
| GET    | `/me`                  | Authenticated  | Retrieve current user     |
| POST   | `/verify-email`        | Public token   | Verify email              |
| POST   | `/resend-verification` | Authenticated  | Resend verification email |
| POST   | `/forgot-password`     | Public         | Request password reset    |
| POST   | `/reset-password`      | Public token   | Reset password            |
| PATCH  | `/change-password`     | Authenticated  | Change password           |

## 4.1 Registration

`POST /auth/register`

Request:

```json
{
  "fullName": "User Name",
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "USER_ID",
    "verificationRequired": true
  }
}
```

Rules:

- Email must be unique.
- Password must meet security requirements.
- Default capability is Buyer.
- Seller or Author selection is not required.
- Password must be securely hashed.
- Email verification token must be stored as a hash.
- The response must not expose credentials or token hashes.

## 4.2 Login

`POST /auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "fullName": "User Name",
      "capabilities": ["buyer"],
      "accountStatus": "active"
    },
    "accessToken": "ACCESS_TOKEN"
  }
}
```

Refresh token is issued through a secure HttpOnly cookie.

## 4.3 Current User

`GET /auth/me`

Returns safe account information, including:

- User identity.
- Email verification status.
- Capabilities.
- Account status.
- Relevant capability verification states.

Sensitive authentication fields must never be returned.

## 4.4 Refresh Session

`POST /auth/refresh`

The backend must:

1. Read the refresh token from the secure cookie.
2. Validate its hash against the session record.
3. Verify session expiration and revocation status.
4. Rotate the refresh token according to session policy.
5. Issue a new access token.
6. Update session activity.

## 4.5 Logout

`POST /auth/logout`

Revokes the current session and clears the refresh-token cookie.

## 4.6 Logout All

`POST /auth/logout-all`

Revokes all active sessions belonging to the authenticated user.

## 4.7 Email Verification

`POST /auth/verify-email`

Request:

```json
{
  "token": "EMAIL_VERIFICATION_TOKEN"
}
```

The backend must validate the hashed token, expiration and single-use status before updating the user's verification state.

## 4.8 Resend Verification

`POST /auth/resend-verification`

Requires an authenticated, unverified user.

Must be rate-limited.

## 4.9 Forgot Password

`POST /auth/forgot-password`

Request:

```json
{
  "email": "user@example.com"
}
```

The response must not reveal whether an account exists.

## 4.10 Reset Password

`POST /auth/reset-password`

Request:

```json
{
  "token": "PASSWORD_RESET_TOKEN",
  "password": "NewStrongPassword123!",
  "confirmPassword": "NewStrongPassword123!"
}
```

The backend validates the token, updates the password hash, records the password change and revokes existing sessions according to policy.

## 4.11 Change Password

`PATCH /auth/change-password`

Requires current-password verification.

---

# 5. User and Profile APIs

**Base Path:** `/users`

| Method | Endpoint                  | Access        | Description                   |
| ------ | ------------------------- | ------------- | ----------------------------- |
| GET    | `/me`                   | Authenticated | Get current account           |
| PATCH  | `/me`                   | Authenticated | Update permitted user details |
| PATCH  | `/me/capabilities`      | Authenticated | Request capability activation |
| GET    | `/:userId`              | Super Admin   | Get user details              |
| GET    | `/`                     | Super Admin   | List users                    |
| PATCH  | `/:userId/restrictions` | Super Admin   | Apply capability restriction  |
| PATCH  | `/:userId/status`       | Super Admin   | Update account status         |

Capability activation must follow platform policies.

Users cannot assign themselves Super Admin access.

**Base Path:** `/profiles`

| Method | Endpoint       | Access        | Description          |
| ------ | -------------- | ------------- | -------------------- |
| GET    | `/me`        | Authenticated | Get extended profile |
| PATCH  | `/me`        | Authenticated | Update profile       |
| PUT    | `/me/avatar` | Authenticated | Update profile image |

---

# 6. Address Management APIs

**Base Path:** `/addresses`

| Method | Endpoint                | Access        | Description          |
| ------ | ----------------------- | ------------- | -------------------- |
| POST   | `/`                   | Authenticated | Add address          |
| GET    | `/`                   | Authenticated | List saved addresses |
| GET    | `/:addressId`         | Owner         | Get address          |
| PATCH  | `/:addressId`         | Owner         | Update address       |
| DELETE | `/:addressId`         | Owner         | Delete address       |
| PATCH  | `/:addressId/default` | Owner         | Set default address  |

All address operations must verify ownership.

An address used for an order must be copied into an immutable order snapshot.

---

# 7. Book Catalogue APIs

**Base Path:** `/books`

| Method | Endpoint          | Access                       | Description             |
| ------ | ----------------- | ---------------------------- | ----------------------- |
| GET    | `/`             | Public                       | Browse catalogue        |
| GET    | `/featured`     | Public                       | Retrieve featured books |
| GET    | `/new-arrivals` | Public                       | Retrieve new arrivals   |
| GET    | `/search`       | Public                       | Search books            |
| GET    | `/:bookId`      | Public                       | Get book details        |
| POST   | `/`             | Authorized catalogue manager | Create catalogue entry  |
| PATCH  | `/:bookId`      | Authorized catalogue manager | Update catalogue entry  |
| DELETE | `/:bookId`      | Authorized catalogue manager | Archive catalogue entry |

## 7.1 Browse Books

`GET /books`

Supported query parameters:

| Parameter       | Description                                |
| --------------- | ------------------------------------------ |
| page            | Page number                                |
| limit           | Records per page                           |
| search          | Title, author, ISBN, publisher or keywords |
| categoryId      | Category filter                            |
| condition       | Book condition                             |
| minPrice        | Minimum price in paise                     |
| maxPrice        | Maximum price in paise                     |
| language        | Language filter                            |
| publisher       | Publisher filter                           |
| edition         | Edition filter                             |
| publicationYear | Publication year                           |
| sellerType      | Individual or business                     |
| inStock         | Availability filter                        |
| sortBy          | relevance, price, newest                   |
| order           | asc or desc                                |

Only books with active seller listings should appear in normal marketplace discovery.

Out-of-stock listings must not be purchasable.

## 7.2 Book Details

`GET /books/:bookId`

Returns:

- Catalogue information.
- Author names.
- Publisher and edition.
- Category.
- Available seller offers.
- Listing conditions.
- Seller information.
- Prices and availability.

Multiple seller offers must be represented independently.

---

# 8. Category APIs

**Base Path:** `/categories`

| Method | Endpoint         | Access      | Description         |
| ------ | ---------------- | ----------- | ------------------- |
| GET    | `/`            | Public      | List categories     |
| GET    | `/:categoryId` | Public      | Get category        |
| POST   | `/`            | Super Admin | Create category     |
| PATCH  | `/:categoryId` | Super Admin | Update category     |
| DELETE | `/:categoryId` | Super Admin | Deactivate category |

Category changes must follow effective-date and audit requirements where applicable.

---

# 9. Seller Verification APIs

**Base Path:** `/seller-verifications`

| Method | Endpoint                    | Access      | Description                  |
| ------ | --------------------------- | ----------- | ---------------------------- |
| POST   | `/`                       | Seller      | Submit verification          |
| GET    | `/me`                     | Seller      | View own verification        |
| PATCH  | `/me`                     | Seller      | Update permitted draft       |
| POST   | `/me/documents`           | Seller      | Upload verification evidence |
| GET    | `/`                       | Super Admin | List submissions             |
| GET    | `/:verificationId`        | Super Admin | View submission              |
| PATCH  | `/:verificationId/review` | Super Admin | Review submission            |

### Verification Statuses

- Draft.
- Pending Review.
- Under Review.
- Additional Information Required.
- Approved.
- Rejected.
- Suspended.

### Rules

- Individual and business sellers have different verification requirements.
- Sellers may create draft listings before verification.
- Public selling requires approved verification.
- Private documents must use protected storage.
- Every review decision must record its reason and reviewer.

---

# 10. Seller Listing APIs

**Base Path:** `/listings`

| Method | Endpoint                | Access       | Description             |
| ------ | ----------------------- | ------------ | ----------------------- |
| POST   | `/`                   | Seller       | Create listing          |
| GET    | `/`                   | Public       | Browse active listings  |
| GET    | `/:listingId`         | Public       | Get listing             |
| GET    | `/seller/me`          | Seller       | List own listings       |
| PATCH  | `/:listingId`         | Seller Owner | Update listing          |
| DELETE | `/:listingId`         | Seller Owner | Deactivate listing      |
| PATCH  | `/:listingId/status`  | Seller Owner | Update listing status   |
| POST   | `/catalogue-requests` | Seller       | Request catalogue entry |

## 10.1 Create Listing

`POST /listings`

Request:

```json
{
  "bookId": "BOOK_ID",
  "condition": "VERY_GOOD",
  "pricePaise": 35000,
  "quantity": 2,
  "sellerDescription": "Good condition with minimal markings.",
  "images": ["IMAGE_REFERENCE"],
  "shippingTerms": {
    "shippingChargePaise": 5000,
    "freeShipping": false,
    "handlingTimeDays": 2
  }
}
```

The backend validates:

- Seller capability.
- Seller verification status for public visibility.
- Book catalogue reference.
- Condition.
- Price and quantity.
- Image requirements.
- Shipping terms.
- Defect disclosures.

Draft listing creation may be permitted before verification. Public visibility remains restricted until approval.

---

# 11. Inventory APIs

**Base Path:** `/inventory`

| Method | Endpoint                 | Access       | Description                |
| ------ | ------------------------ | ------------ | -------------------------- |
| GET    | `/seller/me`           | Seller       | View seller inventory      |
| GET    | `/listings/:listingId` | Seller Owner | View listing inventory     |
| PATCH  | `/listings/:listingId` | Seller Owner | Update permitted inventory |
| GET    | `/movements`           | Seller       | View inventory movements   |

Inventory changes must be processed through backend services.

The frontend cannot directly modify reserved or sold quantities.

---

# 12. Cart APIs

**Base Path:** `/cart`

| Method | Endpoint              | Access | Description     |
| ------ | --------------------- | ------ | --------------- |
| GET    | `/`                 | Buyer  | Retrieve cart   |
| POST   | `/items`            | Buyer  | Add listing     |
| PATCH  | `/items/:listingId` | Buyer  | Update quantity |
| DELETE | `/items/:listingId` | Buyer  | Remove listing  |
| DELETE | `/`                 | Buyer  | Clear cart      |

Add item request:

```json
{
  "listingId": "LISTING_ID",
  "quantity": 1
}
```

The backend validates listing availability, status and quantity.

**Important:** Cart operations do not reserve inventory.

---

# 13. Wishlist APIs

**Base Path:** `/wishlist`

| Method | Endpoint           | Access | Description       |
| ------ | ------------------ | ------ | ----------------- |
| GET    | `/`              | Buyer  | Retrieve wishlist |
| POST   | `/items`         | Buyer  | Add book          |
| DELETE | `/items/:bookId` | Buyer  | Remove book       |
| DELETE | `/`              | Buyer  | Clear wishlist    |

Duplicate wishlist entries must be prevented.

Wishlist records reference catalogue books, not seller-specific listings.

---

# 14. Checkout APIs

**Base Path:** `/checkout`

| Method | Endpoint          | Access | Description                        |
| ------ | ----------------- | ------ | ---------------------------------- |
| POST   | `/preview`      | Buyer  | Validate cart and calculate totals |
| POST   | `/create-order` | Buyer  | Create order and reserve stock     |

## 14.1 Checkout Preview

`POST /checkout/preview`

Request:

```json
{
  "addressId": "ADDRESS_ID"
}
```

Response:

```json
{
  "success": true,
  "message": "Checkout summary generated",
  "data": {
    "bookSubtotalPaise": 70000,
    "shippingTotalPaise": 5000,
    "gatewayFeePaise": 0,
    "taxTotalPaise": 0,
    "totalPaise": 75000,
    "currency": "INR",
    "sellerBreakdown": []
  }
}
```

The preview does not reserve inventory or guarantee the final price.

## 14.2 Create Order

`POST /checkout/create-order`

Request:

```json
{
  "addressId": "ADDRESS_ID",
  "idempotencyKey": "UNIQUE_CHECKOUT_REQUEST_ID"
}
```

Backend operations:

1. Revalidate cart contents.
2. Recalculate all prices and shipping charges.
3. Validate inventory.
4. Atomically reserve available quantities.
5. Create the parent order.
6. Create seller-specific orders.
7. Save immutable item and address snapshots.
8. Create a payment attempt.
9. Return the order and payment initiation details.

Reservation duration: 15 minutes.

If payment is not confirmed within the reservation window, the application must explicitly release the reservation and restore inventory.

---

# 15. Order APIs

**Base Path:** `/orders`

| Method | Endpoint                     | Access      | Description              |
| ------ | ---------------------------- | ----------- | ------------------------ |
| GET    | `/`                        | Buyer       | List own orders          |
| GET    | `/:orderId`                | Buyer Owner | Get order details        |
| GET    | `/:orderId/receipt`        | Buyer Owner | Download payment receipt |
| POST   | `/:orderId/cancel-request` | Buyer Owner | Request cancellation     |

Order records must distinguish payment state from fulfillment state.

Cancellation requests must follow the dispatch and return policy.

---

# 16. Seller Order APIs

**Base Path:** `/seller-orders`

| Method | Endpoint                         | Access       | Description              |
| ------ | -------------------------------- | ------------ | ------------------------ |
| GET    | `/me`                          | Seller       | List own seller orders   |
| GET    | `/:sellerOrderId`              | Seller Owner | Get seller order         |
| PATCH  | `/:sellerOrderId/fulfillment`  | Seller Owner | Update fulfillment state |
| POST   | `/:sellerOrderId/dispatch`     | Seller Owner | Confirm dispatch         |
| POST   | `/:sellerOrderId/delay-notice` | Seller Owner | Report dispatch delay    |

Seller fulfillment operations must not modify payment status.

Dispatch must include required courier and tracking information and dispatch evidence.

Target dispatch deadline: within three business days after confirmed payment, subject to the applicable policy.

---

# 17. Shipment and Tracking APIs

**Base Path:** `/shipments`

| Method | Endpoint                          | Access                 | Description                       |
| ------ | --------------------------------- | ---------------------- | --------------------------------- |
| POST   | `/seller-orders/:sellerOrderId` | Seller Owner           | Create shipment record            |
| GET    | `/seller-orders/:sellerOrderId` | Authorized participant | Get shipment                      |
| PATCH  | `/:shipmentId`                  | Seller Owner           | Update permitted shipment details |
| GET    | `/:shipmentId/tracking`         | Authorized participant | Retrieve tracking information     |

The seller selects and manages the courier.

The platform records courier name, tracking number, tracking URL, dispatch evidence and shipment status.

Platform-managed courier booking is not mandatory in the initial release.

---

# 18. Payment APIs

**Base Path:** `/payments`

| Method | Endpoint                      | Access      | Description              |
| ------ | ----------------------------- | ----------- | ------------------------ |
| POST   | `/orders/:orderId/initiate` | Buyer Owner | Initiate payment         |
| GET    | `/orders/:orderId/status`   | Buyer Owner | Retrieve payment status  |
| GET    | `/orders/:orderId`          | Buyer Owner | Retrieve payment details |

## 18.1 Initiate Payment

`POST /payments/orders/:orderId/initiate`

Request:

```json
{
  "idempotencyKey": "UNIQUE_PAYMENT_ATTEMPT_KEY"
}
```

The backend must:

1. Verify order ownership.
2. Validate order payment state.
3. Validate active inventory reservation.
4. Create or retrieve the idempotent payment attempt.
5. Create the provider order.
6. Persist the provider reference.
7. Return the required provider checkout information.

## 18.2 Payment Verification

Payment success must never be trusted solely from a frontend callback.

The backend must verify provider payment information and validate:

- Provider signature or verification response.
- Expected order reference.
- Expected payment amount.
- Currency.
- Transaction reference.
- Payment status.
- Duplicate event status.

## 18.3 Payment Status

`GET /payments/orders/:orderId/status`

Returns the latest server-confirmed payment state.

A pending provider response must not be presented as confirmed success.

---

# 19. Payment Webhook APIs

**Base Path:** `/webhooks`

| Method | Endpoint                | Access             | Description            |
| ------ | ----------------------- | ------------------ | ---------------------- |
| POST   | `/payments/:provider` | Provider Signature | Receive payment events |

Webhook processing must:

1. Verify the provider signature.
2. Validate the event payload.
3. Identify the relevant payment attempt.
4. Check event idempotency.
5. Verify amount and currency.
6. Update payment and order state.
7. Consume or release inventory reservations as appropriate.
8. Record financial events.
9. Generate receipt and notification events after verified success.

Webhook processing must support delayed and repeated events.

If a payment succeeds after a reservation has expired and inventory cannot be fulfilled, the system must use an explicit reconciliation and refund workflow. It must never silently create an unfulfillable successful order.

The selected payment provider is not finalized. Provider-specific fields will be documented after technical and commercial verification.

---

# 20. Receipt APIs

**Base Path:** `/receipts`

| Method | Endpoint                      | Access      | Description          |
| ------ | ----------------------------- | ----------- | -------------------- |
| GET    | `/orders/:orderId`          | Buyer Owner | Retrieve receipt     |
| GET    | `/orders/:orderId/download` | Buyer Owner | Download receipt PDF |

Receipt generation occurs only after server-verified payment success.

Receipt information includes:

- Unique receipt number.
- Parent order number.
- Transaction ID.
- Gateway reference.
- Buyer name and email.
- Payment timestamp.
- Book subtotal.
- Shipping.
- Gateway fee, where applicable.
- Taxes, where applicable.
- Total paid.
- Payment method and status.

Receipts must be immutable.

Refunds are represented by separate refund records and documents.

---

# 21. Refund and Return APIs

**Base Path:** `/returns`

| Method | Endpoint                          | Access                 | Description              |
| ------ | --------------------------------- | ---------------------- | ------------------------ |
| POST   | `/seller-orders/:sellerOrderId` | Buyer Owner            | Request return           |
| GET    | `/me`                           | Buyer                  | List own return requests |
| GET    | `/:returnId`                    | Authorized participant | View return              |
| POST   | `/:returnId/evidence`           | Buyer Owner            | Submit evidence          |

**Base Path:** `/refunds`

| Method | Endpoint                     | Access                 | Description            |
| ------ | ---------------------------- | ---------------------- | ---------------------- |
| GET    | `/orders/:orderId`         | Buyer Owner            | View refund records    |
| POST   | `/orders/:orderId/request` | Authorized participant | Request refund         |
| GET    | `/orders/:orderId/status`  | Buyer Owner            | Retrieve refund status |

### Return Policy

- Return request deadline: three calendar days after delivery.
- Change-of-mind returns are not accepted under the proposed policy.
- Eligible reasons include wrong book, undisclosed damage, missing pages, materially inaccurate listing, counterfeit or unauthorized copies, and qualifying delivery issues.
- Buyer evidence and seller response must be recorded.
- Disputes are reviewed through the platform process.
- Applicable Indian consumer rights take precedence over platform policy.

Refund processing must be provider-verified and idempotent.

---

# 22. Seller Earnings and Commission APIs

**Base Path:** `/seller/earnings`

| Method | Endpoint                     | Access       | Description               |
| ------ | ---------------------------- | ------------ | ------------------------- |
| GET    | `/me`                      | Seller       | Retrieve earnings summary |
| GET    | `/transactions`            | Seller       | View earning entries      |
| GET    | `/transactions/:earningId` | Seller Owner | View earning details      |

**Base Path:** `/seller/commission`

| Method | Endpoint          | Access | Description                     |
| ------ | ----------------- | ------ | ------------------------------- |
| GET    | `/me`           | Seller | Retrieve commission information |
| GET    | `/transactions` | Seller | View commission records         |

Commission rules:

- Standard commission is 10%.
- Commission applies to net book selling price after seller-funded discounts.
- Delivery charges and separately collected taxes are excluded.
- First eligible sale commission may be waived when the account's shared entitlement is available.
- Financial entries are immutable; corrections require adjustment records.

---

# 23. Seller Payout APIs

**Base Path:** `/seller/payout-destinations`

| Method | Endpoint                   | Access       | Description            |
| ------ | -------------------------- | ------------ | ---------------------- |
| POST   | `/`                      | Seller       | Add payout destination |
| GET    | `/me`                    | Seller       | List own destinations  |
| PATCH  | `/:destinationId`        | Seller Owner | Update destination     |
| POST   | `/:destinationId/verify` | Seller Owner | Initiate verification  |
| DELETE | `/:destinationId`        | Seller Owner | Deactivate destination |

**Base Path:** `/seller/payouts`

| Method | Endpoint       | Access       | Description        |
| ------ | -------------- | ------------ | ------------------ |
| GET    | `/me`        | Seller       | List payouts       |
| GET    | `/:payoutId` | Seller Owner | Get payout details |

### Payout Rules

- UPI VPA is the preferred destination, subject to provider support.
- Destination changes require re-verification.
- Payouts are held until destination verification is complete.
- Weekly automatic settlement is the target.
- No platform-defined minimum payout.
- Only eligible earnings can be settled.
- Provider confirmation is required before marking a payout successful.

The payment and payout provider is subject to final technical and commercial approval.

---

# 24. First-Transaction Entitlement APIs

The entitlement is managed internally by backend services.

No public endpoint may directly mark an entitlement as consumed or available.

An authenticated user may retrieve their entitlement status through:

`GET /users/me/entitlement`

The response may include:

```json
{
  "success": true,
  "message": "Entitlement retrieved successfully",
  "data": {
    "status": "available",
    "entitlementType": "first_transaction"
  }
}
```

Rules:

- One entitlement per account.
- Successful purchase or eligible sale consumes it.
- Purchase consumption does not waive a buyer fee.
- First eligible sale may receive the commission waiver.
- Consumption must be atomic and idempotent.

---

# 25. Author Publishing APIs

**Base Path:** `/author`

| Method | Endpoint                                  | Access       | Description                |
| ------ | ----------------------------------------- | ------------ | -------------------------- |
| GET    | `/profile`                              | Author       | Retrieve author profile    |
| PATCH  | `/profile`                              | Author       | Update public profile      |
| POST   | `/publications`                         | Author       | Submit publication         |
| GET    | `/publications`                         | Author       | List own publications      |
| GET    | `/publications/:publicationId`          | Author Owner | View publication           |
| PATCH  | `/publications/:publicationId`          | Author Owner | Update eligible submission |
| POST   | `/publications/:publicationId/evidence` | Author Owner | Upload evidence            |

**Base Path:** `/publications`

| Method | Endpoint            | Access | Description                |
| ------ | ------------------- | ------ | -------------------------- |
| GET    | `/`               | Public | List approved publications |
| GET    | `/:publicationId` | Public | View approved publication  |

### Publication Review APIs

| Method | Endpoint                                      | Access      | Description       |
| ------ | --------------------------------------------- | ----------- | ----------------- |
| GET    | `/admin/publications`                       | Super Admin | List submissions  |
| GET    | `/admin/publications/:publicationId`        | Super Admin | View submission   |
| PATCH  | `/admin/publications/:publicationId/review` | Super Admin | Review submission |

### Review States

- Pending Review.
- Under Review.
- Additional Documents Required.
- Approved.
- Rejected.
- Suspended.
- Removed.

### Rules

- Authorship and ownership declarations are mandatory.
- Supporting evidence must remain private.
- Review decisions require reasons.
- Approved physical publications may be made available through the marketplace.
- Authors arrange and fund printing.
- Digital publishing is outside the initial release.

---

# 26. Reviews and Ratings APIs

**Base Path:** `/reviews`

| Method | Endpoint               | Access         | Description        |
| ------ | ---------------------- | -------------- | ------------------ |
| POST   | `/`                  | Verified Buyer | Submit review      |
| GET    | `/books/:bookId`     | Public         | Get book reviews   |
| GET    | `/sellers/:sellerId` | Public         | Get seller reviews |
| PATCH  | `/:reviewId`         | Review Owner   | Edit review        |
| DELETE | `/:reviewId`         | Review Owner   | Delete review      |
| POST   | `/:reviewId/report`  | Authenticated  | Report review      |

### Review Rules

- Only verified purchasers with confirmed delivery may submit reviews.
- Book and seller ratings are separate.
- Ratings range from 1 to 5.
- Written text and photographs are optional.
- Buyer editing is allowed within three calendar days.
- Buyers may delete their own reviews.
- Sellers cannot publicly respond.
- Fake reviews and manipulation are prohibited.
- Legitimate negative reviews must not be removed solely because they are negative.

---

# 27. Notifications APIs

**Base Path:** `/notifications`

| Method | Endpoint                  | Access        | Description           |
| ------ | ------------------------- | ------------- | --------------------- |
| GET    | `/`                     | Authenticated | List notifications    |
| GET    | `/:notificationId`      | Owner         | Retrieve notification |
| PATCH  | `/:notificationId/read` | Owner         | Mark as read          |
| PATCH  | `/read-all`             | Authenticated | Mark all as read      |
| DELETE | `/:notificationId`      | Owner         | Delete notification   |

**Base Path:** `/notification-preferences`

| Method | Endpoint | Access        | Description                 |
| ------ | -------- | ------------- | --------------------------- |
| GET    | `/me`  | Authenticated | Retrieve preferences        |
| PATCH  | `/me`  | Authenticated | Update optional preferences |

Initial notification channels:

- In-app.
- Email.

Push notifications are planned for a later release where supported.

Essential transactional and security notifications remain enabled where required.

---

# 28. Support and Dispute APIs

**Base Path:** `/support/tickets`

| Method | Endpoint                | Access        | Description           |
| ------ | ----------------------- | ------------- | --------------------- |
| POST   | `/`                   | Authenticated | Create support ticket |
| GET    | `/me`                 | Authenticated | List own tickets      |
| GET    | `/:ticketId`          | Ticket Owner  | Retrieve ticket       |
| POST   | `/:ticketId/messages` | Ticket Owner  | Add message           |
| POST   | `/:ticketId/evidence` | Ticket Owner  | Upload evidence       |

**Base Path:** `/disputes`

| Method | Endpoint                          | Access              | Description       |
| ------ | --------------------------------- | ------------------- | ----------------- |
| POST   | `/seller-orders/:sellerOrderId` | Authorized Buyer    | Open dispute      |
| GET    | `/me`                           | Authenticated       | List own disputes |
| GET    | `/:disputeId`                   | Dispute Participant | View dispute      |
| POST   | `/:disputeId/evidence`          | Dispute Participant | Submit evidence   |
| POST   | `/:disputeId/response`          | Dispute Participant | Submit response   |

Administrative dispute decisions are available only through Super Admin endpoints.

Dispute decisions must record reasons, evidence references and timestamps.

Statutory timelines take precedence over internal service targets.

---

# 29. Super Admin APIs

**Base Path:** `/admin`

Super Admin access is separate from ordinary Buyer, Seller and Author capabilities.

Administrative login requires:

- Dedicated administrative authentication.
- Securely provisioned credentials.
- Hashed password storage.
- Mandatory MFA.
- Secure recovery procedures.
- Audit logging.

## 29.1 Authentication

| Method | Endpoint             | Access                       | Description             |
| ------ | -------------------- | ---------------------------- | ----------------------- |
| POST   | `/auth/login`      | Public                       | Start Super Admin login |
| POST   | `/auth/verify-mfa` | Pending Admin Authentication | Verify MFA              |
| POST   | `/auth/logout`     | Super Admin                  | End admin session       |
| POST   | `/auth/recovery`   | Approved Recovery Flow       | Recover access          |

## 29.2 Dashboard and Analytics

| Method | Endpoint                   | Access      | Description           |
| ------ | -------------------------- | ----------- | --------------------- |
| GET    | `/dashboard`             | Super Admin | Retrieve dashboard    |
| GET    | `/analytics/marketplace` | Super Admin | Marketplace analytics |
| GET    | `/analytics/finance`     | Super Admin | Financial analytics   |
| GET    | `/analytics/sellers`     | Super Admin | Seller analytics      |
| GET    | `/analytics/publishing`  | Super Admin | Publishing analytics  |
| GET    | `/analytics/operations`  | Super Admin | Operational analytics |

Analytics endpoints support approved date filters such as daily, weekly, monthly and yearly.

All figures must originate from actual database records.

## 29.3 Seller and User Management

| Method | Endpoint                             | Access      | Description                   |
| ------ | ------------------------------------ | ----------- | ----------------------------- |
| GET    | `/users`                           | Super Admin | List users                    |
| GET    | `/users/:userId`                   | Super Admin | Retrieve user                 |
| PATCH  | `/users/:userId/status`            | Super Admin | Update account status         |
| PATCH  | `/users/:userId/restrictions`      | Super Admin | Apply capability restriction  |
| GET    | `/seller-verifications`            | Super Admin | List verification submissions |
| PATCH  | `/seller-verifications/:id/review` | Super Admin | Review seller                 |

## 29.4 Financial Management

| Method | Endpoint                       | Access      | Description              |
| ------ | ------------------------------ | ----------- | ------------------------ |
| GET    | `/payments`                  | Super Admin | View payments            |
| GET    | `/refunds`                   | Super Admin | View refunds             |
| POST   | `/refunds/:refundId/process` | Super Admin | Initiate eligible refund |
| GET    | `/commissions`               | Super Admin | View commission records  |
| GET    | `/payouts`                   | Super Admin | View payouts             |
| POST   | `/payouts/:payoutId/hold`    | Super Admin | Place payout hold        |
| POST   | `/payouts/:payoutId/release` | Super Admin | Release eligible payout  |

Every sensitive financial action requires a reason and audit entry.

Super Admin cannot fabricate payment or payout success.

## 29.5 Catalogue and Policy Management

| Method | Endpoint                    | Access      | Description             |
| ------ | --------------------------- | ----------- | ----------------------- |
| POST   | `/books`                  | Super Admin | Create catalogue entry  |
| PATCH  | `/books/:bookId`          | Super Admin | Update catalogue entry  |
| PATCH  | `/categories/:categoryId` | Super Admin | Update category         |
| GET    | `/policies`               | Super Admin | List policies           |
| POST   | `/policies`               | Super Admin | Create policy version   |
| PATCH  | `/policies/:policyId`     | Super Admin | Update permitted policy |
| GET    | `/announcements`          | Super Admin | List announcements      |
| POST   | `/announcements`          | Super Admin | Publish announcement    |

Policy changes require an effective date and audit history.

Existing completed transactions must retain their applicable policy snapshots.

## 29.6 Appeals and Moderation

| Method | Endpoint                        | Access      | Description           |
| ------ | ------------------------------- | ----------- | --------------------- |
| GET    | `/appeals`                    | Super Admin | List appeals          |
| GET    | `/appeals/:appealId`          | Super Admin | View appeal           |
| PATCH  | `/appeals/:appealId/decision` | Super Admin | Decide appeal         |
| GET    | `/reports`                    | Super Admin | List reported content |
| PATCH  | `/reports/:reportId/decision` | Super Admin | Moderate report       |

Appeals must be evidence-based.

Decisions must record reasons and notify affected users.

## 29.7 Audit Logs

| Method | Endpoint                 | Access      | Description            |
| ------ | ------------------------ | ----------- | ---------------------- |
| GET    | `/audit-logs`          | Super Admin | Retrieve audit history |
| GET    | `/audit-logs/:auditId` | Super Admin | View audit record      |

Audit records must not be silently modified or deleted.

---

# 30. File Upload APIs

**Base Path:** `/uploads`

| Method | Endpoint                    | Access              | Description                   |
| ------ | --------------------------- | ------------------- | ----------------------------- |
| POST   | `/profile-image`          | Authenticated       | Upload profile image          |
| POST   | `/listing-images`         | Seller              | Upload listing images         |
| POST   | `/verification-documents` | Seller              | Upload verification documents |
| POST   | `/publication-evidence`   | Author              | Upload ownership evidence     |
| POST   | `/review-images`          | Verified Buyer      | Upload review photographs     |
| POST   | `/dispute-evidence`       | Dispute Participant | Upload dispute evidence       |

### Upload Rules

- Validate file type and size.
- Apply appropriate authorization.
- Store private documents in private object storage.
- Use protected access for sensitive files.
- Do not expose private storage credentials.
- Do not trust client-provided file extensions.
- Apply malware and file-content checks where supported.

Exact storage provider and file-size limits are deployment configuration decisions.

---

# 31. System and Health APIs

**Base Path:** `/health`

| Method | Endpoint   | Access               | Description        |
| ------ | ---------- | -------------------- | ------------------ |
| GET    | `/`      | Public or Restricted | Application health |
| GET    | `/ready` | Restricted           | Readiness check    |

Health responses must not expose secrets, connection strings, database credentials or internal infrastructure details.

---

# 32. HTTP Status Codes

| Code | Meaning               | Typical Usage                      |
| ---- | --------------------- | ---------------------------------- |
| 200  | OK                    | Successful retrieval or update     |
| 201  | Created               | Resource created                   |
| 202  | Accepted              | Asynchronous operation accepted    |
| 204  | No Content            | Successful deletion                |
| 400  | Bad Request           | Invalid request                    |
| 401  | Unauthorized          | Missing or invalid authentication  |
| 403  | Forbidden             | Insufficient permissions           |
| 404  | Not Found             | Resource unavailable               |
| 409  | Conflict              | Duplicate or state conflict        |
| 410  | Gone                  | Expired or unavailable resource    |
| 422  | Unprocessable Entity  | Business validation failure        |
| 429  | Too Many Requests     | Rate limit exceeded                |
| 500  | Internal Server Error | Unexpected server error            |
| 502  | Bad Gateway           | Invalid external provider response |
| 503  | Service Unavailable   | Temporary service unavailability   |

---

# 33. Standard Error Codes

| Error Code                   | Description                    |
| ---------------------------- | ------------------------------ |
| VALIDATION_ERROR             | Request validation failed      |
| AUTHENTICATION_REQUIRED      | Authentication required        |
| INVALID_CREDENTIALS          | Credentials invalid            |
| EMAIL_NOT_VERIFIED           | Email verification required    |
| TOKEN_EXPIRED                | Token expired                  |
| TOKEN_INVALID                | Token invalid                  |
| SESSION_REVOKED              | Session revoked                |
| INSUFFICIENT_PERMISSION      | Permission denied              |
| CAPABILITY_REQUIRED          | Required capability missing    |
| SELLER_VERIFICATION_REQUIRED | Seller verification incomplete |
| RESOURCE_NOT_FOUND           | Resource not found             |
| RESOURCE_CONFLICT            | Resource conflict              |
| INSUFFICIENT_STOCK           | Inventory unavailable          |
| RESERVATION_EXPIRED          | Inventory reservation expired  |
| PAYMENT_PENDING              | Payment not confirmed          |
| PAYMENT_FAILED               | Payment failed                 |
| PAYMENT_VERIFICATION_FAILED  | Payment verification failed    |
| IDEMPOTENCY_CONFLICT         | Conflicting repeated request   |
| ORDER_NOT_CANCELLABLE        | Order cannot be cancelled      |
| RETURN_NOT_ELIGIBLE          | Return not eligible            |
| PAYOUT_ON_HOLD               | Payout is on hold              |
| RATE_LIMIT_EXCEEDED          | Rate limit exceeded            |
| INTERNAL_ERROR               | Unexpected internal failure    |

Error responses must not expose internal stack traces or sensitive information.

---

# 34. Security Requirements

The API must implement:

1. Input validation at every external boundary.
2. Secure password hashing.
3. Short-lived access tokens.
4. Secure HttpOnly refresh cookies.
5. Refresh-token rotation and revocation.
6. Strict CORS configuration.
7. HTTPS in production.
8. Rate limiting for sensitive endpoints.
9. Resource ownership verification.
10. Capability-based authorization.
11. Dedicated Super Admin authorization and MFA.
12. Webhook signature verification.
13. Payment idempotency.
14. Protected document storage.
15. Safe error responses.
16. Audit logging for sensitive operations.
17. CSRF protection where required by the cookie-based authentication design.
18. No exposure of credentials or payment secrets.

The frontend must never be treated as the authority for payment success, stock availability, commission calculation or administrative permission.

---

# 35. API Versioning and Compatibility

The initial API version is `v1`.

All application endpoints must use the versioned base path.

Breaking API changes require a controlled compatibility and migration plan.

Deprecated endpoints must not be removed without reviewing frontend dependencies and active clients.

---

# 36. Implementation and Testing Requirements

Each API module must be implemented and tested independently.

Testing must include:

- Valid requests.
- Invalid request bodies.
- Authentication failures.
- Authorization failures.
- Ownership violations.
- Duplicate requests.
- Concurrent operations.
- Database failures.
- External provider failures.
- Expired sessions and reservations.
- Webhook retries.
- Financial consistency.
- Pagination boundaries.

Expected testing tools:

- Vitest.
- Supertest.
- Playwright.
- Postman.

---

# 37. API Acceptance Criteria

The API contract is accepted when:

1. Authentication endpoints preserve existing authentication behavior.
2. Registration creates Buyer capability by default.
3. Multiple capabilities are supported.
4. Super Admin authorization is separate.
5. User and address ownership are enforced.
6. Catalogue and listing endpoints are separate.
7. Seller verification controls public listing eligibility.
8. Cart operations do not reserve inventory.
9. Checkout reserves inventory atomically.
10. Expired reservations explicitly restore stock.
11. Parent and seller-specific orders are supported.
12. Payment attempts and webhooks are idempotent.
13. Payment success is verified by the backend.
14. Commission and entitlement operations are auditable.
15. Seller-managed delivery is supported.
16. Returns and refunds are traceable.
17. Payout destinations and settlements are protected.
18. Author publication review is supported.
19. Reviews require verified purchases.
20. Notifications and support workflows are supported.
21. Super Admin operations require MFA and audit logging.
22. All financial values use integer paise.
23. API errors follow a consistent response structure.
24. Automated tests cover security and business rules.

---

# 38. Implementation Status and Governance

This document defines the approved API contract.

It does not claim that every listed endpoint is already implemented.

The current authentication implementation and six authentication-specific documents remain part of the project baseline.

New marketplace endpoints will be implemented incrementally according to the development roadmap.

Endpoint names, request fields and response structures must be reconciled with actual Mongoose models and service implementations during development.

Provider-specific payment, payout and webhook contracts will be finalized only after the payment provider is selected and its technical documentation is verified.

| Field        | Value                   |
| ------------ | ----------------------- |
| Document     | API Documentation       |
| Version      | 2.0                     |
| API Version  | v1                      |
| Backend      | Node.js and Express.js  |
| Database     | MongoDB                 |
| ODM          | Mongoose                |
| Status       | Approved API Contract   |
| Owner        | Book Bazar Project Team |
| Last Updated | 20 November 2026        |

**End of Documen**

# BOOK BAZAR – API DOCUMENTATION

**Document Version:** 1.0
**Project:** Book Bazar
**Document Type:** REST API Specification
**Backend:** Node.js + Express.js
**Language:** JavaScript (ES6+)
**Database:** MongoDB
**ODM:** Mongoose
**API Version:** v1
**Base URL:** `http://localhost:4000/api/v1`
**Status:** Initial API Contract

---

# 1. Introduction

## 1.1 Purpose

This document defines the RESTful API architecture of Book Bazar.

It specifies:

- API endpoints.
- HTTP methods.
- Request parameters.
- Request body structures.
- Response structures.
- Authentication requirements.
- Authorization requirements.
- HTTP status codes.
- Validation rules.
- API error handling.

## 1.2 API Architecture

The backend will expose versioned REST APIs using Express.js.

The frontend will communicate with the backend using Axios.

API responses will follow a consistent JSON structure.

## 1.3 Base URLs

**Development:**

`http://localhost:4000/api/v1`

**Production:**

`https://your-domain.com/api/v1`

The production domain will be configured during deployment.

# 2. API Conventions

## 2.1 HTTP Methods

| Method | Purpose                                 |
| ------ | --------------------------------------- |
| GET    | Retrieve resources                      |
| POST   | Create resources or initiate operations |
| PUT    | Replace a resource                      |
| PATCH  | Partially update a resource             |
| DELETE | Delete eligible resources               |

## 2.2 Request Headers

Standard request headers:

```http
Content-Type: application/json
Accept: application/json
```

Authenticated requests may include:

```http
Authorization: Bearer <access_token>
```

Refresh-token operations will use secure HttpOnly cookies.

## 2.3 Success Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## 2.4 Error Response Format

```json
{
  "success": false,
  "message": "Request could not be processed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

## 2.5 Paginated Response Format

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalItems": 100,
      "totalPages": 9,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## 2.6 Pagination Query Parameters

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| page      | Number | Current page     |
| limit     | Number | Records per page |
| sortBy    | String | Sorting field    |
| order     | String | asc or desc      |

Default values:

- page = 1
- limit = 12
- Maximum limit = 100

# 3. Authentication and Authorization

## 3.1 Authentication Types

The API will support:

- Public endpoints.
- Authenticated endpoints.
- Capability-protected endpoints.
- Administrator-protected endpoints.

## 3.2 Access Control

| Access Type   | Description                       |
| ------------- | --------------------------------- |
| Public        | No authentication required        |
| Authenticated | Valid user session required       |
| Buyer         | Buyer capability required         |
| Seller        | Seller capability required        |
| Author        | Author capability required        |
| Admin         | Authorized administrator required |

A user may possess multiple capabilities simultaneously.

Backend authorization must verify actual permissions and resource ownership.

# 4. Authentication APIs

**Base Path:** `/auth`

| Method | Endpoint             | Access         | Description             |
| ------ | -------------------- | -------------- | ----------------------- |
| POST   | `/register`        | Public         | Register account        |
| POST   | `/verify-email`    | Public         | Verify email OTP        |
| POST   | `/verify-phone`    | Public         | Verify phone OTP        |
| POST   | `/resend-otp`      | Public         | Resend verification OTP |
| POST   | `/login`           | Public         | Authenticate user       |
| POST   | `/refresh`         | Refresh Cookie | Renew access token      |
| POST   | `/logout`          | Authenticated  | Logout                  |
| POST   | `/logout-all`      | Authenticated  | Revoke all sessions     |
| POST   | `/forgot-password` | Public         | Request password reset  |
| POST   | `/reset-password`  | Public         | Reset password          |
| PATCH  | `/change-password` | Authenticated  | Change password         |
| GET    | `/me`              | Authenticated  | Retrieve current user   |

## 4.1 Registration

**Endpoint:**

`POST /auth/register`

**Request:**

```json
{
  "fullName": "Utsav Shrivastav",
  "email": "user@example.com",
  "phone": "9876543210",
  "password": "StrongPassword@123",
  "acceptTerms": true
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your account.",
  "data": {
    "userId": "USER_ID",
    "verificationRequired": true
  }
}
```

## 4.2 Login

**Endpoint:**

`POST /auth/login`

**Request:**

```json
{
  "identifier": "user@example.com",
  "password": "StrongPassword@123"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "fullName": "Utsav Shrivastav",
      "capabilities": [
        "BUYER",
        "SELLER"
      ]
    },
    "accessToken": "ACCESS_TOKEN"
  }
}
```

The refresh token will be issued through a secure HttpOnly cookie.

## 4.3 Current User

**Endpoint:**

`GET /auth/me`

**Access:** Authenticated

**Expected Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "USER_ID",
    "fullName": "User Name",
    "email": "user@example.com",
    "capabilities": [
      "BUYER"
    ],
    "accountStatus": "ACTIVE"
  }
}
```

# 5. User and Profile APIs

**Base Path:** `/users`

| Method | Endpoint             | Access        | Description                   |
| ------ | -------------------- | ------------- | ----------------------------- |
| GET    | `/me`              | Authenticated | Get current profile           |
| PATCH  | `/me`              | Authenticated | Update user information       |
| GET    | `/:userId`         | Admin         | Get user details              |
| GET    | `/`                | Admin         | List users                    |
| PATCH  | `/:userId/status`  | Admin         | Update account status         |
| PATCH  | `/me/capabilities` | Authenticated | Request capability activation |

Capability activation must be validated against platform policies. Administrative permissions cannot be assigned through the ordinary user endpoint.

**Base Path:** `/profiles`

| Method | Endpoint       | Access        | Description             |
| ------ | -------------- | ------------- | ----------------------- |
| GET    | `/me`        | Authenticated | Get extended profile    |
| PATCH  | `/me`        | Authenticated | Update extended profile |
| PUT    | `/me/avatar` | Authenticated | Update profile image    |

# 6. Address Management APIs

**Base Path:** `/addresses`

| Method | Endpoint                | Access        | Description         |
| ------ | ----------------------- | ------------- | ------------------- |
| POST   | `/`                   | Authenticated | Add address         |
| GET    | `/`                   | Authenticated | Get saved addresses |
| GET    | `/:addressId`         | Authenticated | Get address details |
| PATCH  | `/:addressId`         | Authenticated | Update address      |
| DELETE | `/:addressId`         | Authenticated | Delete address      |
| PATCH  | `/:addressId/default` | Authenticated | Set default address |

All address operations must verify ownership.

# 7. Book Catalogue APIs

**Base Path:** `/books`

| Method | Endpoint          | Access | Description              |
| ------ | ----------------- | ------ | ------------------------ |
| GET    | `/`             | Public | Browse books             |
| GET    | `/featured`     | Public | Get featured books       |
| GET    | `/new-arrivals` | Public | Get recently added books |
| GET    | `/search`       | Public | Search books             |
| GET    | `/:bookId`      | Public | Get book details         |
| POST   | `/`             | Admin  | Create catalogue entry   |
| PATCH  | `/:bookId`      | Admin  | Update catalogue entry   |
| DELETE | `/:bookId`      | Admin  | Archive catalogue entry  |

## 7.1 Browse Books

**Endpoint:**

`GET /books`

**Query Parameters:**

```text
?page=1
&limit=12
&categoryId=CATEGORY_ID
&minPrice=10000
&maxPrice=50000
&condition=GOOD
&sortBy=createdAt
&order=desc
```

Price parameters are expressed in integer paise.

The catalogue response may include available seller listings, subject to pagination and response-size limits.

## 7.2 Book Details

**Endpoint:**

`GET /books/:bookId`

The response will include:

- Book information.
- Author information.
- Category information.
- Available seller listings.
- Listing conditions.
- Seller information.
- Prices.
- Availability.

# 8. Category APIs

**Base Path:** `/categories`

| Method | Endpoint         | Access | Description          |
| ------ | ---------------- | ------ | -------------------- |
| GET    | `/`            | Public | Get categories       |
| GET    | `/:categoryId` | Public | Get category details |
| POST   | `/`            | Admin  | Create category      |
| PATCH  | `/:categoryId` | Admin  | Update category      |
| DELETE | `/:categoryId` | Admin  | Deactivate category  |

# 9. Seller Listing APIs

**Base Path:** `/listings`

| Method | Endpoint                | Access       | Description             |
| ------ | ----------------------- | ------------ | ----------------------- |
| POST   | `/`                   | Seller       | Create listing          |
| GET    | `/`                   | Public       | Browse active listings  |
| GET    | `/:listingId`         | Public       | Get listing details     |
| GET    | `/seller/me`          | Seller       | Get seller listings     |
| PATCH  | `/:listingId`         | Seller Owner | Update listing          |
| DELETE | `/:listingId`         | Seller Owner | Deactivate listing      |
| PATCH  | `/:listingId/status`  | Seller Owner | Change listing status   |
| POST   | `/catalogue-requests` | Seller       | Request catalogue entry |

## 9.1 Create Listing

**Endpoint:**

`POST /listings`

**Request:**

```json
{
  "bookId": "BOOK_ID",
  "description": "Good condition, minimal markings.",
  "condition": "VERY_GOOD",
  "sellingPrice": 35000,
  "inventoryQuantity": 2,
  "images": [
    "IMAGE_REFERENCE"
  ]
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "listingId": "LISTING_ID",
    "listingStatus": "PENDING"
  }
}
```

Listing publication will follow the moderation policy.

# 10. Inventory APIs

**Base Path:** `/inventory`

| Method | Endpoint                 | Access       | Description                |
| ------ | ------------------------ | ------------ | -------------------------- |
| GET    | `/seller/me`           | Seller       | View inventory             |
| GET    | `/listings/:listingId` | Seller Owner | View listing inventory     |
| PATCH  | `/listings/:listingId` | Seller Owner | Update permitted inventory |
| GET    | `/movements`           | Seller       | View inventory movements   |

Inventory updates must be validated through backend services.

The frontend cannot directly manipulate reserved or sold quantities.

# 11. Cart APIs

**Base Path:** `/cart`

| Method | Endpoint              | Access | Description     |
| ------ | --------------------- | ------ | --------------- |
| GET    | `/`                 | Buyer  | Retrieve cart   |
| POST   | `/items`            | Buyer  | Add listing     |
| PATCH  | `/items/:listingId` | Buyer  | Update quantity |
| DELETE | `/items/:listingId` | Buyer  | Remove listing  |
| DELETE | `/`                 | Buyer  | Clear cart      |

## 11.1 Add Cart Item

**Endpoint:**

`POST /cart/items`

**Request:**

```json
{
  "listingId": "LISTING_ID",
  "quantity": 1
}
```

The backend must validate:

- Listing availability.
- Listing status.
- Requested quantity.
- Inventory availability.

# 12. Wishlist APIs

**Base Path:** `/wishlist`

| Method | Endpoint              | Access | Description       |
| ------ | --------------------- | ------ | ----------------- |
| GET    | `/`                 | Buyer  | Retrieve wishlist |
| POST   | `/items`            | Buyer  | Add listing       |
| DELETE | `/items/:listingId` | Buyer  | Remove listing    |
| DELETE | `/`                 | Buyer  | Clear wishlist    |

**Add Wishlist Request:**

```json
{
  "listingId": "LISTING_ID"
}
```

Duplicate entries must be prevented.

# 13. Checkout APIs

**Base Path:** `/checkout`

| Method | Endpoint          | Access | Description                        |
| ------ | ----------------- | ------ | ---------------------------------- |
| POST   | `/preview`      | Buyer  | Validate cart and calculate totals |
| POST   | `/create-order` | Buyer  | Create order and reserve inventory |

## 13.1 Checkout Preview

**Endpoint:**

`POST /checkout/preview`

**Request:**

```json
{
  "addressId": "ADDRESS_ID"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Checkout summary generated",
  "data": {
    "subtotal": 70000,
    "shippingAmount": 5000,
    "discountAmount": 0,
    "totalAmount": 75000,
    "currency": "INR"
  }
}
```

All monetary values are in integer paise.

The preview does not reserve inventory or guarantee a price until order creation.

## 13.2 Create Order

**Endpoint:**

`POST /checkout/create-order`

**Request:**

```json
{
  "addressId": "ADDRESS_ID",
  "idempotencyKey": "UNIQUE_CHECKOUT_REQUEST_ID"
}
```

The backend must:

1. Revalidate cart contents.
2. Recalculate prices.
3. Validate inventory.
4. Create the parent order.
5. Create seller-specific orders.
6. Reserve inventory.
7. Create the payment
