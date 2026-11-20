
# Book Bazar — Authentication User Flow

## 1. Registration Flow

1. User opens the Register page.
2. User enters:
   - Full name
   - Email address
   - Password
   - Confirm password
   - Postal address
3. Frontend validates the submitted information.
4. Registration request is sent to the backend.
5. Backend validates and normalizes the data.
6. Backend checks whether the email already exists.
7. Password is hashed using bcryptjs.
8. User account is created in MongoDB.
9. Email verification is initiated.
10. User receives a registration success response.
11. User verifies their email.
12. User can log in.

## 2. Login Flow

1. User opens the Login page.
2. User enters email and password.
3. Frontend validates the form.
4. Login request is sent to the backend.
5. Backend searches for the account.
6. Backend verifies the password hash.
7. Backend checks account status.
8. Backend creates an authenticated session.
9. Access token is issued.
10. Refresh token is issued through a secure HTTP-only cookie.
11. User receives their account information.
12. User is redirected to the appropriate authenticated page.

## 3. Refresh Session Flow

1. Access token expires.
2. Frontend requests a new access token.
3. Browser sends the refresh cookie automatically.
4. Backend validates the refresh token.
5. Backend checks the corresponding session in MongoDB.
6. Backend rotates the refresh token.
7. Previous refresh token becomes invalid.
8. New access token and refresh cookie are issued.

If refresh validation fails, the session is rejected and the user
must authenticate again.

## 4. Logout Flow

1. User selects Logout.
2. Frontend sends a logout request.
3. Backend revokes the current session.
4. Refresh cookie is cleared.
5. Frontend clears authenticated user state.
6. User is redirected to the Login or Homepage.

## 5. Logout All Sessions Flow

1. Authenticated user requests logout from all devices.
2. Backend identifies the user's active sessions.
3. All applicable sessions are revoked.
4. Refresh cookies are cleared on the current browser.
5. User must log in again on other devices.

## 6. Forgot Password Flow

1. User opens Forgot Password.
2. User enters their registered email address.
3. Frontend sends a password recovery request.
4. Backend generates a cryptographically secure,
   single-use reset token.
5. Backend stores only its hash in MongoDB.
6. Password reset email is sent.
7. User opens the reset link.
8. User enters a new password and confirmation.
9. Backend validates the token and expiry.
10. New password is hashed and saved.
11. Reset token is invalidated.
12. Existing sessions are revoked.
13. User can log in using the new password.

## 7. Email Verification Flow

1. User receives a verification email.
2. User opens the verification link.
3. Frontend submits the verification token.
4. Backend hashes and validates the token.
5. Backend checks token expiry and usage status.
6. Email address is marked as verified.
7. Verification token is invalidated.
8. User receives a success response.

## 8. Authorization Flow

1. User requests a protected resource.
2. Frontend sends the access token.
3. Backend authentication middleware validates it.
4. Backend identifies the authenticated user.
5. Authorization middleware checks required permissions.
6. Backend checks resource ownership where applicable.
7. Request is permitted or rejected.
8. Frontend handles the API response.

## 9. Important Rules

- Registration never asks users to select Buyer, Seller or Author.
- One account supports multiple marketplace capabilities.
- Admin permissions cannot be assigned through public registration.
- Unverified users must follow the configured email-verification policy.
- Refresh tokens must rotate and must not be reusable.
- Password recovery must invalidate existing sessions.
- Backend authorization is mandatory for protected operations.
