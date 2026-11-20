
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
