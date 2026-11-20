
# Authentication System — API Documentation

## 1. Overview

Book Bazar authentication APIs will use REST architecture and JSON-based communication.

**Base URL:**

`/api/v1/auth`

**Content-Type:**

`application/json`

**Authentication:** JWT access token with refresh-token rotation through an HTTP-only cookie.

All endpoints must use centralized request validation, error handling, and consistent response structures.

## 2. Standard Response Structure

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "An error occurred",
  "errors": []
}
```

### HTTP Status Codes

| Status | Meaning                                        |
| ------ | ---------------------------------------------- |
| 200    | Request successful                             |
| 201    | Resource created                               |
| 400    | Invalid request                                |
| 401    | Authentication required or invalid credentials |
| 403    | Authenticated but not authorized               |
| 404    | Resource not found                             |
| 409    | Resource conflict                              |
| 422    | Validation failure                             |
| 429    | Too many requests                              |
| 500    | Internal server error                          |
| 503    | Required service temporarily unavailable       |

## 3. Registration

### Endpoint

`POST /api/v1/auth/register`

**Access:** Public

### Request Body

```json
{
  "fullName": "Utsav Shrivastav",
  "email": "utsav@example.com",
  "address": {
    "line1": "House number and street",
    "line2": "Optional locality",
    "city": "Jaipur",
    "state": "Rajasthan",
    "postalCode": "302001",
    "country": "India"
  },
  "password": "ExampleSecurePassword123!",
  "confirmPassword": "ExampleSecurePassword123!"
}
```

### Backend Operations

1. Validate request fields.
2. Normalize email address.
3. Check email uniqueness.
4. Hash password.
5. Create user document.
6. Assign default `buyer` capability.
7. Generate email-verification token.
8. Store token hash.
9. Send verification email through the configured email service.

### Success Response

**HTTP 201**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "id": "USER_OBJECT_ID",
      "fullName": "Utsav Shrivastav",
      "email": "utsav@example.com",
      "emailVerified": false,
      "capabilities": ["buyer"]
    }
  }
}
```

The response must not contain password hashes, raw tokens, or administrative fields.

## 4. Login

### Endpoint

`POST /api/v1/auth/login`

**Access:** Public

### Request Body

```json
{
  "email": "utsav@example.com",
  "password": "ExampleSecurePassword123!"
}
```

### Backend Operations

1. Validate email and password.
2. Find user by normalized email.
3. Verify password using bcryptjs.
4. Check account status.
5. Create a new session.
6. Generate access and refresh tokens.
7. Store refresh-token hash.
8. Set refresh-token HTTP-only cookie.
9. Return safe user information and access token.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "ACCESS_TOKEN",
    "user": {
      "id": "USER_OBJECT_ID",
      "fullName": "Utsav Shrivastav",
      "email": "utsav@example.com",
      "emailVerified": true,
      "capabilities": ["buyer"],
      "isAdmin": false
    }
  }
}
```

**Cookie:** Refresh token is delivered through a secure HTTP-only cookie.

Invalid credentials must return a generic error without revealing whether an email address exists.

An unverified account may receive a restricted authentication state for verification-related operations. It must not gain access to verified-account marketplace operations.

## 5. Refresh Access Token

### Endpoint

`POST /api/v1/auth/refresh`

**Access:** Valid refresh-token cookie required.

### Request

No JSON body required.

The browser sends the refresh-token cookie automatically when cookie credentials are enabled.

### Backend Operations

1. Read refresh token from the cookie.
2. Validate token signature and expiration.
3. Identify the corresponding session.
4. Verify the stored token hash.
5. Check session revocation and expiration.
6. Generate a new access token.
7. Rotate the refresh token.
8. Update the stored refresh-token hash.
9. Set the replacement refresh-token cookie.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Session refreshed successfully",
  "data": {
    "accessToken": "NEW_ACCESS_TOKEN"
  }
}
```

Invalid, expired, revoked, or reused refresh tokens must not create an authenticated session.

## 6. Get Current User

### Endpoint

`GET /api/v1/auth/me`

**Access:** Authenticated user.

### Headers

`Authorization: Bearer ACCESS_TOKEN`

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "USER_OBJECT_ID",
      "fullName": "Utsav Shrivastav",
      "email": "utsav@example.com",
      "emailVerified": true,
      "address": {
        "line1": "House number and street",
        "line2": "Optional locality",
        "city": "Jaipur",
        "state": "Rajasthan",
        "postalCode": "302001",
        "country": "India"
      },
      "capabilities": ["buyer"],
      "isAdmin": false,
      "accountStatus": "active"
    }
  }
}
```

Sensitive authentication fields must never be returned.

## 7. Logout

### Endpoint

`POST /api/v1/auth/logout`

**Access:** Authenticated session.

### Backend Operations

1. Identify current session.
2. Revoke the session.
3. Clear the refresh-token cookie.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

The browser must also clear its in-memory access token and authentication state.

## 8. Logout From All Devices

### Endpoint

`POST /api/v1/auth/logout-all`

**Access:** Authenticated user.

### Backend Operations

1. Identify authenticated user.
2. Revoke all active sessions belonging to that user.
3. Clear the current refresh-token cookie.
4. Clear frontend authentication state.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "All sessions have been logged out",
  "data": null
}
```

## 9. Email Verification

### Endpoint

`POST /api/v1/auth/verify-email`

**Access:** Public token-based operation.

### Request Body

```json
{
  "token": "EMAIL_VERIFICATION_TOKEN"
}
```

### Backend Operations

1. Hash the submitted token.
2. Find the matching token record.
3. Validate expiration and single-use status.
4. Mark token as used.
5. Set `emailVerified` to `true`.
6. Complete the operation atomically.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "emailVerified": true
  }
}
```

## 10. Resend Verification Email

### Endpoint

`POST /api/v1/auth/resend-verification`

**Access:** Authenticated, unverified user.

### Request Body

```json
{}
```

### Backend Operations

1. Identify the authenticated user.
2. Check whether email is already verified.
3. Invalidate previous unused verification tokens as required.
4. Generate a new verification token.
5. Store its hash and expiration.
6. Dispatch verification email.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Verification email request processed",
  "data": null
}
```

Apply rate limiting to this endpoint.

## 11. Forgot Password

### Endpoint

`POST /api/v1/auth/forgot-password`

**Access:** Public.

### Request Body

```json
{
  "email": "utsav@example.com"
}
```

### Backend Operations

1. Validate and normalize email.
2. Find the account if it exists.
3. Generate a secure reset token.
4. Store its hash and expiration.
5. Send the password-reset link.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "If an account exists for this email, password reset instructions will be sent.",
  "data": null
}
```

The response must not reveal whether the email is registered.

## 12. Reset Password

### Endpoint

`POST /api/v1/auth/reset-password`

**Access:** Public token-based operation.

### Request Body

```json
{
  "token": "PASSWORD_RESET_TOKEN",
  "password": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

### Backend Operations

1. Validate request.
2. Hash the supplied token.
3. Find matching reset-token record.
4. Verify expiration and single-use status.
5. Hash the new password.
6. Update the user password.
7. Mark the reset token as used.
8. Revoke existing sessions.
9. Complete the operation atomically.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Password reset successfully. Please log in again.",
  "data": null
}
```

## 13. Update Password

### Endpoint

`PATCH /api/v1/auth/change-password`

**Access:** Authenticated user.

### Request Body

```json
{
  "currentPassword": "CurrentSecurePassword123!",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

### Backend Operations

1. Identify authenticated user.
2. Verify current password.
3. Validate new password.
4. Hash new password.
5. Update password hash and change timestamp.
6. Revoke other active sessions according to the session policy.
7. Return success response.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

The session policy must be implemented consistently so the user is required to authenticate again where necessary.

## 14. Authorization Rules

| Operation                    | Access Requirement                                          |
| ---------------------------- | ----------------------------------------------------------- |
| Register                     | Public                                                      |
| Login                        | Public                                                      |
| Refresh                      | Valid refresh cookie                                        |
| Get current user             | Authenticated                                               |
| Logout                       | Authenticated session                                       |
| Logout all                   | Authenticated user                                          |
| Verify email                 | Valid verification token                                    |
| Resend verification          | Authenticated, unverified user                              |
| Forgot password              | Public                                                      |
| Reset password               | Valid reset token                                           |
| Change password              | Authenticated user                                          |
| Buyer marketplace operations | Authenticated buyer capability and applicable verification  |
| Seller operations            | Authenticated seller capability and applicable verification |
| Author operations            | Authenticated author capability and applicable verification |
| Admin operations             | Authenticated admin permission                              |

The backend must independently enforce these requirements on every protected endpoint.

## 15. Authentication Middleware

The backend should provide reusable middleware:

- `authenticate`
- `requireVerifiedEmail`
- `requireCapability`
- `requireAdmin`
- `validateRequest`
- `authRateLimiter`

Middleware must reject invalid, expired, revoked, or unauthorized requests.

Resource ownership must also be checked in the relevant service layer.

## 16. Frontend API Integration

The frontend will use Axios for API communication.

### Axios Requirements

- Configure the API base URL through environment variables.
- Enable credentials for refresh-cookie requests.
- Attach access tokens to protected API requests.
- Handle access-token expiration.
- Coordinate refresh requests to prevent concurrent refresh races.
- Retry eligible requests only once after successful refresh.
- Clear authentication state when refresh fails.
- Never store refresh tokens in local storage or session storage.

### Authentication API Module

The frontend API layer should expose functions for:

- `register`
- `login`
- `refreshSession`
- `getCurrentUser`
- `logout`
- `logoutAll`
- `verifyEmail`
- `resendVerification`
- `forgotPassword`
- `resetPassword`
- `changePassword`

## 17. Rate Limiting

Rate limits must be applied to sensitive endpoints, particularly:

- Registration
- Login
- Refresh
- Resend verification
- Forgot password
- Reset password

Limits should be configurable through backend configuration.

Use generic responses and avoid account enumeration.

## 18. API Security Requirements

- Validate all request bodies.
- Reject unexpected protected fields.
- Use HTTPS in production.
- Configure strict CORS.
- Apply CSRF protection where required.
- Use HTTP-only secure refresh cookies.
- Never expose secrets or raw stored token hashes.
- Avoid sensitive information in API errors.
- Apply rate limits.
- Verify authorization on the backend.
- Use atomic database operations for token consumption and rotation.

## 19. API Acceptance Criteria

1. Registration creates a MongoDB user document.
2. Duplicate emails are rejected.
3. Login validates credentials.
4. Refresh-token rotation works.
5. Current-user endpoint returns safe profile information.
6. Logout revokes the current session.
7. Logout-all revokes all user sessions.
8. Email verification works with single-use tokens.
9. Verification resend is rate-limited.
10. Forgot-password responses prevent account enumeration.
11. Password reset works with expiring tokens.
12. Password changes enforce current-password verification.
13. Protected endpoints reject unauthenticated requests.
14. Capability-based access is enforced.
15. Admin access is independently enforced.
16. Frontend API integration handles session expiration.
17. Automated API tests cover success and failure cases.

---

**Implementation status:** These API contracts define the intended behavior. Endpoint implementation and testing will follow after the remaining authentication documentation is completed.
