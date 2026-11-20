
# Authentication System — Testing Strategy

## 1. Overview

The Book Bazar authentication system must be tested at frontend, backend, database, integration, and end-to-end levels.

Testing must verify not only successful authentication but also invalid requests, unauthorized access, session expiration, token misuse, database failures, and security-related scenarios.

The system must not be considered complete until all critical authentication and authorization tests pass.

## 2. Testing Objectives

1. Verify user registration and login.
2. Verify MongoDB persistence.
3. Verify password hashing and credential validation.
4. Verify JWT access-token validation.
5. Verify refresh-token rotation.
6. Verify session creation and revocation.
7. Verify email verification.
8. Verify password recovery.
9. Verify capability-based authorization.
10. Verify administrative access restrictions.
11. Verify frontend authentication state.
12. Verify secure error handling.
13. Verify responsive authentication interfaces.

## 3. Testing Technology

| Tool                  | Purpose                         |
| --------------------- | ------------------------------- |
| Vitest                | Unit and component testing      |
| Supertest             | Backend API integration testing |
| React Testing Library | Frontend component testing      |
| Playwright            | End-to-end browser testing      |
| MongoDB               | Database integration testing    |
| Postman               | Manual API verification         |
| MongoDB Compass       | Database inspection             |

## 4. Unit Testing

Unit tests must verify individual functions and components independently.

### Backend Unit Tests

Test the following:

- Password hashing.
- Password comparison.
- JWT generation.
- JWT verification.
- Refresh-token generation.
- Refresh-token hashing.
- Token expiration.
- Email normalization.
- Request validation.
- Authorization middleware.
- Session validation.
- Error-handling utilities.

### Frontend Unit Tests

Test the following:

- Login form rendering.
- Registration form rendering.
- Input validation.
- Password visibility toggle.
- Password confirmation validation.
- Loading states.
- Error messages.
- Successful form submission.
- Authentication state transitions.
- Protected-route behavior.

## 5. Registration Testing

### Positive Test Cases

| Test ID | Scenario                            | Expected Result          |
| ------- | ----------------------------------- | ------------------------ |
| REG-01  | Register with valid details         | Account created          |
| REG-02  | Register with valid postal address  | Address stored correctly |
| REG-03  | Register with mixed-case email      | Email normalized         |
| REG-04  | Register with valid password        | Password hashed          |
| REG-05  | Register with matching confirmation | Registration accepted    |

### Negative Test Cases

| Test ID | Scenario                                 | Expected Result               |
| ------- | ---------------------------------------- | ----------------------------- |
| REG-06  | Missing full name                        | Validation error              |
| REG-07  | Invalid email                            | Validation error              |
| REG-08  | Duplicate email                          | Conflict response             |
| REG-09  | Missing address line 1                   | Validation error              |
| REG-10  | Missing city                             | Validation error              |
| REG-11  | Missing postal code                      | Validation error              |
| REG-12  | Password shorter than minimum            | Validation error              |
| REG-13  | Password confirmation mismatch           | Validation error              |
| REG-14  | Attempt to submit `isAdmin: true`      | Privilege assignment rejected |
| REG-15  | Attempt to submit arbitrary capabilities | Privilege assignment rejected |

## 6. Login Testing

| Test ID | Scenario                 | Expected Result                 |
| ------- | ------------------------ | ------------------------------- |
| LOG-01  | Valid email and password | Login successful                |
| LOG-02  | Incorrect password       | Authentication rejected         |
| LOG-03  | Unregistered email       | Generic authentication error    |
| LOG-04  | Missing email            | Validation error                |
| LOG-05  | Missing password         | Validation error                |
| LOG-06  | Suspended account        | Login rejected                  |
| LOG-07  | Disabled account         | Login rejected                  |
| LOG-08  | Unverified email         | Restricted authentication state |
| LOG-09  | Valid login              | Session created in MongoDB      |
| LOG-10  | Valid login              | Secure refresh cookie issued    |

## 7. Token Testing

### Access Token

- Valid access token is accepted.
- Invalid signature is rejected.
- Expired token is rejected.
- Missing token is rejected.
- Malformed token is rejected.
- Token for a disabled account cannot authorize protected operations.

### Refresh Token

- Valid refresh token creates a new access token.
- Successful refresh rotates the refresh token.
- Previous refresh token cannot be reused.
- Expired refresh token is rejected.
- Revoked session cannot be refreshed.
- Invalid token hash is rejected.
- Refresh-token reuse triggers the configured security response.
- Concurrent refresh attempts do not produce multiple valid token generations.

## 8. Session Testing

| Test ID | Scenario                  | Expected Result                    |
| ------- | ------------------------- | ---------------------------------- |
| SES-01  | Successful login          | Session created                    |
| SES-02  | Login from another device | Separate session created           |
| SES-03  | Logout current session    | Current session revoked            |
| SES-04  | Logout-all                | All user sessions revoked          |
| SES-05  | Refresh revoked session   | Request rejected                   |
| SES-06  | Refresh expired session   | Request rejected                   |
| SES-07  | Expired session cleanup   | Eligible record eventually removed |
| SES-08  | User logs in after logout | New session created                |

Session authorization must rely on application-level expiration and revocation checks, not only MongoDB TTL cleanup.

## 9. Email Verification Testing

- Verification email request is generated after registration.
- Raw verification token is not stored in MongoDB.
- Valid token verifies the account.
- Invalid token is rejected.
- Expired token is rejected.
- Used token cannot be reused.
- Resending verification invalidates previous tokens according to policy.
- Already verified accounts cannot be verified again unnecessarily.
- Unverified accounts cannot access verified-account marketplace operations.
- Email delivery failure is handled safely.

Use a test email transport or mocked email service during automated tests. Do not send real emails during ordinary automated test execution.

## 10. Password Reset Testing

| Test ID | Scenario                           | Expected Result               |
| ------- | ---------------------------------- | ----------------------------- |
| PWD-01  | Request reset for existing account | Generic success response      |
| PWD-02  | Request reset for unknown account  | Same generic success response |
| PWD-03  | Submit valid reset token           | Password updated              |
| PWD-04  | Submit invalid reset token         | Request rejected              |
| PWD-05  | Submit expired reset token         | Request rejected              |
| PWD-06  | Reuse reset token                  | Request rejected              |
| PWD-07  | Reset password                     | Existing sessions revoked     |
| PWD-08  | Login using old password           | Authentication rejected       |
| PWD-09  | Login using new password           | Authentication successful     |
| PWD-10  | Password confirmation mismatch     | Validation error              |

## 11. Authorization Testing

Authorization tests must verify backend permissions independently of frontend route visibility.

### Buyer Capability

- Buyer can access permitted buyer operations.
- Buyer cannot access seller-only operations without the seller capability.
- Buyer cannot access author-only operations without the author capability.

### Seller Capability

- Seller can access permitted seller operations.
- Seller cannot access another seller's protected resources.
- Seller cannot access administrative operations.

### Author Capability

- Author can access permitted author operations.
- Author cannot access another user's protected resources without permission.
- Author cannot access administrative operations.

### Multiple Capabilities

Test accounts with:

- Buyer only.
- Seller only.
- Author only.
- Buyer and Seller.
- Buyer and Author.
- Seller and Author.
- Buyer, Seller, and Author.

Verify that one capability does not unintentionally remove or grant another.

### Administrative Authorization

- Normal users cannot access admin endpoints.
- Normal users cannot grant themselves admin privileges.
- Authorized admins can access permitted administrative operations.
- Unauthorized users cannot modify administrative permissions.

## 12. MongoDB Integration Testing

Verify that:

1. User documents are created correctly.
2. Email uniqueness is enforced.
3. Password hashes are stored.
4. Refresh-token hashes are stored.
5. Verification-token hashes are stored.
6. Reset-token hashes are stored.
7. Session references point to valid users.
8. Token records reference valid users.
9. Expiration indexes exist.
10. Revoked sessions cannot authorize requests.
11. Transaction-dependent operations work with the replica set.
12. Database errors are handled without exposing sensitive information.

Tests must use an isolated test database and must not modify development or production data.

## 13. API Integration Testing

Test all authentication endpoints:

- `POST /register`
- `POST /login`
- `POST /refresh`
- `GET /me`
- `POST /logout`
- `POST /logout-all`
- `POST /verify-email`
- `POST /resend-verification`
- `POST /forgot-password`
- `POST /reset-password`
- `PATCH /change-password`

Verify:

- HTTP status codes.
- Request validation.
- Response structure.
- Cookie behavior.
- Database changes.
- Authentication middleware.
- Authorization middleware.
- Error handling.
- Rate-limit behavior.

## 14. Frontend Testing

### Registration Page

Verify:

- All required fields are displayed.
- Postal address fields are available.
- Password confirmation works.
- Validation messages are understandable.
- Loading state is visible.
- API errors are displayed.
- Successful registration leads to the verification state.

### Login Page

Verify:

- Email and password inputs work.
- Password visibility toggle works.
- Invalid credentials display a safe error.
- Successful login updates authentication state.
- Unverified users receive the restricted verification state.
- Forgot-password navigation works.

### Session Handling

Verify:

- Page reload triggers session restoration.
- Access-token expiration triggers refresh.
- Refresh failure clears authentication state.
- Logout clears frontend authentication state.
- Protected pages handle unauthenticated users correctly.

## 15. End-to-End Testing

Playwright must test complete user journeys.

### Journey 1: Registration

1. Open registration page.
2. Enter valid personal details.
3. Enter postal address.
4. Enter password and confirmation.
5. Submit registration.
6. Verify account creation.
7. Verify verification-pending state.

### Journey 2: Email Verification

1. Register a new test account.
2. Retrieve verification link through the test email transport.
3. Open verification link.
4. Verify successful account verification.
5. Confirm verified status.

### Journey 3: Login

1. Open login page.
2. Enter valid credentials.
3. Submit login.
4. Verify authenticated state.
5. Open protected account page.

### Journey 4: Logout

1. Log in.
2. Open account area.
3. Perform logout.
4. Verify session revocation.
5. Attempt to access a protected page.
6. Verify redirection or access denial.

### Journey 5: Password Recovery

1. Request password reset.
2. Retrieve reset link through the test email transport.
3. Submit a new password.
4. Verify password update.
5. Verify old password fails.
6. Verify new password succeeds.

### Journey 6: Multi-Capability Account

1. Create a normal account.
2. Assign additional capabilities through an authorized operation.
3. Verify the account retains all assigned capabilities.
4. Verify access to permitted operations.
5. Verify unauthorized operations remain blocked.

## 16. Security Testing

Test for:

- Brute-force login attempts.
- Authentication rate limiting.
- Account enumeration.
- JWT signature manipulation.
- Refresh-token reuse.
- Session hijacking scenarios.
- CSRF risks.
- CORS misconfiguration.
- Mass-assignment vulnerabilities.
- Unauthorized privilege escalation.
- Sensitive information leakage.
- Password hash exposure.
- Token exposure in logs.
- Invalid input and injection attempts.

Security testing must be performed only against the authorized development or test environment.

## 17. Responsive UI Testing

Test authentication interfaces at:

- Mobile viewport.
- Tablet viewport.
- Laptop viewport.
- Desktop viewport.

Verify:

- No horizontal overflow.
- Inputs remain usable.
- Buttons are accessible.
- Validation messages remain visible.
- Layout remains consistent.
- Keyboard navigation works.
- Focus indicators are visible.

## 18. Test Environment Requirements

Use separate configurations for:

- Development.
- Automated testing.
- Production.

Automated tests must use:

- Isolated MongoDB test database.
- Test email transport.
- Test JWT secrets.
- Test frontend and backend URLs.
- Deterministic test data.
- Cleanup routines.

Never use production credentials or production user records in automated tests.

## 19. Test Execution Sequence

1. Install dependencies.
2. Verify environment configuration.
3. Start isolated test database.
4. Execute backend unit tests.
5. Execute frontend component tests.
6. Execute API integration tests.
7. Execute database integration tests.
8. Execute end-to-end tests.
9. Execute security-focused tests.
10. Review test reports.
11. Fix failures.
12. Run the complete test suite again.

## 20. Completion Criteria

Authentication testing will be considered complete when:

- All critical registration tests pass.
- All critical login tests pass.
- Password security tests pass.
- JWT and refresh-token tests pass.
- Session revocation tests pass.
- Email verification tests pass.
- Password recovery tests pass.
- MongoDB persistence tests pass.
- Authorization tests pass.
- Frontend integration tests pass.
- Critical end-to-end journeys pass.
- No known critical or high-severity authentication vulnerability remains unresolved.
- Test results are documented.

---

**Implementation status:** This document defines the authentication testing strategy. Actual test coverage and security readiness must be established through executed tests and reviewed results.
