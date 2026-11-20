
# Authentication System — Technical Specification

## 1. Overview

The Book Bazar authentication system will provide secure, MongoDB-backed user registration, login, session management, email verification, password recovery, and authorization.

The implementation will use a modular architecture with React on the frontend and Node.js with Express.js on the backend.

JavaScript (ES6+) will be used throughout the application. TypeScript is not part of the selected technology stack.

## 2. Technology Stack

### Frontend

- React
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- React Router DOM
- Axios
- TanStack Query
- React Hook Form
- Zod
- Lucide React

### Backend

- Node.js
- Express.js
- JavaScript (ES6+)
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- Zod
- Nodemailer
- Helmet
- Multer

### Testing

- Vitest
- Supertest
- React Testing Library
- Playwright

## 3. Authentication Architecture

The authentication system will follow a client-server architecture.

### Frontend Responsibilities

- Display registration and login interfaces.
- Validate form inputs.
- Submit authentication requests to the backend.
- Maintain authentication state.
- Handle access-token expiration.
- Request session renewal.
- Support logout and logout-all operations.
- Protect authenticated frontend routes.
- Display verification and password-reset interfaces.

### Backend Responsibilities

- Validate incoming requests.
- Register users and securely hash passwords.
- Authenticate login credentials.
- Generate and validate JWT access tokens.
- Generate and rotate refresh tokens.
- Manage user sessions.
- Verify email ownership.
- Process password-reset requests.
- Enforce authorization on protected endpoints.
- Apply authentication rate limits.
- Interact with MongoDB.

The backend is the final authority for authentication and authorization decisions.

## 4. Registration Implementation

### Required Fields

| Field            | Validation                         |
| ---------------- | ---------------------------------- |
| Full Name        | Required, trimmed, valid length    |
| Email            | Required, valid format, normalized |
| Address Line 1   | Required                           |
| Address Line 2   | Optional                           |
| City             | Required                           |
| State            | Required                           |
| Postal Code      | Required                           |
| Country          | Required                           |
| Password         | Required, minimum 12 characters    |
| Confirm Password | Must match password                |

### Registration Process

1. User opens the registration page.
2. User enters personal, postal address, and password details.
3. Frontend validates the submitted information.
4. Registration request is sent to the backend.
5. Backend validates the request using Zod.
6. Backend checks whether the normalized email already exists.
7. Password is hashed using bcryptjs.
8. A new user document is created in MongoDB.
9. User is assigned the default non-admin account capabilities.
10. An email-verification token is generated and stored securely.
11. Verification email is dispatched through the configured email service.
12. Registration response is returned to the frontend.

Duplicate email registration must be rejected.

Passwords must never be stored in plaintext.

## 5. Login Implementation

### Required Fields

- Email
- Password

### Login Process

1. User enters email and password.
2. Frontend performs input validation.
3. Backend receives the login request.
4. Backend finds the account using normalized email.
5. bcryptjs verifies the supplied password against the stored hash.
6. Backend checks account status and applicable authentication restrictions.
7. A new session is created in MongoDB.
8. A short-lived JWT access token is generated.
9. A refresh token is generated and stored as a secure hash in the session document.
10. Refresh token is delivered using an HTTP-only cookie.
11. Access token is returned to the frontend.
12. Authenticated user information is returned without sensitive fields.

Invalid credentials must produce a generic authentication error.

Unverified users may authenticate into a restricted state to access email-verification and account-support functionality. Marketplace operations requiring a verified account must remain blocked until verification succeeds.

## 6. Password Security

- Passwords must be hashed using bcryptjs.
- Use an appropriately configured bcrypt work factor.
- Passwords must never be returned through API responses.
- Passwords must never be logged.
- Password changes must invalidate existing sessions according to the session-revocation policy.
- Password reset must require a valid, unexpired, single-use token.
- Password reset tokens must be stored as hashes.

## 7. JWT and Session Management

### Access Token

- Short-lived JWT.
- Suggested lifetime: 15 minutes.
- Contains the user identifier and necessary authentication claims.
- Must not contain passwords or sensitive personal information.
- Signed using a strong secret stored in environment variables.

### Refresh Token

- Suggested lifetime: 7 days.
- Stored in the browser as an HTTP-only cookie.
- Stored in MongoDB only as a cryptographic hash.
- Rotated after successful refresh.
- Previous refresh tokens must not remain reusable.

### Cookie Configuration

Production cookies must use:

- `httpOnly: true`
- `secure: true`
- `sameSite: "none"` when cross-site deployment requires it, otherwise the strictest compatible setting.
- Appropriate expiration and path settings.

Cookie configuration must be environment-aware.

CSRF protections and strict CORS configuration must be implemented where cookie-based cross-origin requests are used.

### Session Management

Each authenticated device/session must have its own session document.

Session records must support:

- User reference.
- Hashed refresh token.
- Creation timestamp.
- Expiration timestamp.
- Last-used timestamp.
- Revocation timestamp.
- Optional device and user-agent metadata.

Users must be able to:

- Log out from the current session.
- Log out from all sessions.

Refresh-token reuse or invalid rotation attempts must trigger appropriate session revocation and security handling.

## 8. Email Verification

- Generate cryptographically secure random verification tokens.
- Store only token hashes in MongoDB.
- Set an expiration time.
- Send verification links through the configured email service.
- Validate token hashes during verification.
- Mark the user's email as verified after successful validation.
- Reject expired and already-used tokens.
- Provide a controlled resend-verification operation.

Email delivery must be implemented through a configurable adapter using Nodemailer. SMTP credentials must be supplied through environment variables.

The application must not assume a specific email provider.

## 9. Password Reset

### Forgot Password

1. User submits an email address.
2. Backend returns a generic success response regardless of whether the account exists.
3. If the account exists, a secure reset token is generated.
4. Token hash and expiration are stored in MongoDB.
5. Reset link is sent through the configured email service.

### Reset Password

1. User opens the reset link.
2. Frontend collects the new password and confirmation.
3. Backend validates the reset token.
4. Backend verifies expiration and single-use status.
5. New password is hashed.
6. User password is updated.
7. Reset token is invalidated.
8. Existing sessions are revoked.
9. User is asked to log in again.

## 10. Authorization Architecture

Authorization must be enforced by backend middleware and service-level checks.

### Account Capabilities

A normal user account may support multiple capabilities:

- Buyer
- Seller
- Author

These capabilities are not mutually exclusive.

Users must not receive administrative privileges through registration or ordinary profile updates.

### Administrative Authorization

- Admin privileges are managed separately.
- Only authorized administrative operations can grant or revoke administrative access.
- Admin endpoints must verify the authenticated user's administrative permissions.
- Hiding admin interfaces in the frontend is not sufficient authorization.

### Authorization Middleware

The backend should provide reusable middleware for:

- Authentication verification.
- Verified-email requirements.
- Administrative access.
- Resource ownership.
- Capability-based access.

Authorization must also be checked within business services whenever resource ownership or transaction context matters.

## 11. MongoDB Database Integration

The authentication system will use Mongoose models.

### Collections

1. `users`
2. `sessions`
3. `emailverificationtokens`
4. `passwordresettokens`

### Database Requirements

- Normalize email addresses before storage.
- Enforce unique email indexes.
- Store password hashes only.
- Store refresh-token hashes only.
- Store verification-token hashes only.
- Store reset-token hashes only.
- Add expiration indexes where appropriate.
- Maintain creation and update timestamps.
- Exclude sensitive fields from ordinary query responses.

MongoDB transactions must be used for operations that require atomic updates when supported by the configured replica-set deployment.

## 12. API Communication

All authentication endpoints will be grouped under:

`/api/v1/auth`

The backend will return consistent JSON responses.

### Standard Success Response

{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}

### Standard Error Response

{
  "success": false,
  "message": "A descriptive error message",
  "errors": []
}

The API must never expose stack traces, password hashes, refresh-token hashes, or internal secrets to clients.

Detailed internal errors may be logged securely on the server.

## 13. Frontend Authentication State

The frontend will maintain authentication state using a centralized authentication provider or equivalent state-management module.

It must support:

- Loading state.
- Authenticated state.
- Unauthenticated state.
- Email-verification-required state.
- Session-expired state.

Axios will handle API communication.

TanStack Query may be used for user-profile and session-related server state.

The application must not treat local storage as a trusted source of authentication or authorization.

Access tokens should be kept in memory where practical. Refresh tokens must not be exposed to JavaScript.

## 14. Route Protection

### Public Routes

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`

### Protected Routes

- `/account`
- `/profile`
- `/orders`
- `/wishlist`
- `/cart`
- `/seller`
- `/author`

### Administrative Routes

- `/admin`

Frontend route guards improve navigation and user experience only. Every protected backend endpoint must independently validate authentication and authorization.

## 15. Security Requirements

The implementation must include:

1. bcrypt password hashing.
2. Secure JWT signing and validation.
3. Refresh-token rotation.
4. HTTP-only refresh-token cookies.
5. Input validation using Zod.
6. Authentication rate limiting.
7. Helmet security headers.
8. Strict CORS configuration.
9. Secure cookie configuration.
10. Generic login and password-reset responses where appropriate.
11. Single-use email verification and password-reset tokens.
12. Session revocation.
13. Protection against refresh-token reuse.
14. Safe error handling.
15. Protection against mass assignment.
16. No sensitive information in logs.
17. HTTPS in production.
18. Appropriate CSRF protection for cookie-authenticated requests.

## 16. Environment Configuration

The following environment variables must be configurable:

### Backend

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `COOKIE_DOMAIN`
- `FRONTEND_URL`
- `CORS_ORIGIN`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`

All secrets must remain in environment variables and must never be committed to Git.

An updated `.env.example` must document the required variable names without containing real credentials.

## 17. Error Handling

The system must handle:

- Missing required fields.
- Invalid email format.
- Duplicate email.
- Invalid login credentials.
- Unverified email.
- Expired access token.
- Expired refresh token.
- Revoked session.
- Invalid verification token.
- Expired verification token.
- Invalid password-reset token.
- Expired password-reset token.
- Unauthorized access.
- Forbidden operations.
- Database connectivity errors.
- Email delivery failures.
- Rate-limit violations.

Errors must be handled centrally using the backend error-handling middleware.

## 18. Logging and Monitoring

The system should record security-relevant events, including:

- Successful and failed login attempts.
- Account registration.
- Email verification.
- Password reset.
- Password changes.
- Session creation.
- Session revocation.
- Suspicious refresh-token reuse.

Logs must not contain passwords, raw tokens, or other authentication secrets.

## 19. Implementation Modules

The backend authentication feature should be separated into modules:

- `models/` — Mongoose models.
- `controllers/` — HTTP request and response handling.
- `services/` — Authentication business logic.
- `routes/` — Authentication endpoints.
- `middlewares/` — Authentication, authorization, and validation.
- `validators/` — Zod schemas.
- `utils/` — JWT, hashing, and token utilities.
- `config/` — Database, environment, cookie, and email configuration.

The frontend should separate:

- Authentication pages.
- Reusable authentication components.
- Authentication API functions.
- Authentication state management.
- Form validation schemas.
- Protected route components.

## 20. Acceptance Criteria

The authentication implementation will be considered complete when:

1. Users can register using full name, email, postal address, and password.
2. Duplicate email registrations are rejected.
3. Passwords are securely hashed and stored in MongoDB.
4. Users can log in with valid credentials.
5. Invalid credentials are rejected.
6. Email verification works with expiring, single-use tokens.
7. Unverified accounts cannot perform verified-account operations.
8. Access tokens expire as configured.
9. Refresh tokens rotate securely.
10. Logout revokes the current session.
11. Logout-all revokes all active sessions.
12. Forgot-password and reset-password flows work.
13. Protected backend routes reject unauthenticated requests.
14. Authorization checks prevent unauthorized resource access.
15. Buyer, Seller, and Author capabilities can coexist.
16. Administrative permissions remain separate.
17. Authentication data persists correctly in MongoDB.
18. Frontend authentication state survives page reload through secure session renewal.
19. Authentication errors are handled safely.
20. Automated tests cover critical authentication and authorization flows.

---

**Implementation status:** This document specifies the intended design. Production readiness will be established only after implementation, automated testing, security validation, and deployment verification.
