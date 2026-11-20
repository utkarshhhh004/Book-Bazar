
# Authentication System — Database Design

## 1. Overview

Book Bazar will use MongoDB with Mongoose to store authentication and account information.

The authentication database will use four primary collections:

1. `users`
2. `sessions`
3. `emailverificationtokens`
4. `passwordresettokens`

Each collection will have a clearly defined responsibility. Sensitive authentication data must be stored securely, and relationships between collections will use MongoDB ObjectId references.

## 2. Database Naming

**Database name:** `bookbazar`

**Database engine:** MongoDB

**ODM:** Mongoose

**Primary identifier:** MongoDB ObjectId

**Money representation:** Integer paise wherever financial fields are introduced in other modules.

## 3. Collection: users

### Purpose

Stores registered user accounts, personal information, postal addresses, account capabilities, and account status.

### Schema

| Field                  | Type     | Required | Description                        |
| ---------------------- | -------- | -------- | ---------------------------------- |
| `_id`                | ObjectId | Yes      | Unique user identifier             |
| `fullName`           | String   | Yes      | User's full name                   |
| `email`              | String   | Yes      | Normalized email address           |
| `passwordHash`       | String   | Yes      | bcrypt password hash               |
| `address.line1`      | String   | Yes      | Primary postal address             |
| `address.line2`      | String   | No       | Additional address details         |
| `address.city`       | String   | Yes      | City                               |
| `address.state`      | String   | Yes      | State or region                    |
| `address.postalCode` | String   | Yes      | Postal code                        |
| `address.country`    | String   | Yes      | Country                            |
| `emailVerified`      | Boolean  | Yes      | Email verification status          |
| `capabilities`       | Array    | Yes      | Buyer, Seller, Author capabilities |
| `isAdmin`            | Boolean  | Yes      | Administrative permission          |
| `accountStatus`      | String   | Yes      | Account status                     |
| `passwordChangedAt`  | Date     | No       | Last password-change timestamp     |
| `createdAt`          | Date     | Yes      | Account creation timestamp         |
| `updatedAt`          | Date     | Yes      | Last update timestamp              |

### Default Values

- `emailVerified`: `false`
- `capabilities`: `["buyer"]`
- `isAdmin`: `false`
- `accountStatus`: `"active"`

Registration must not allow clients to submit administrative privileges or arbitrary capabilities.

### Account Status Values

- `active`
- `suspended`
- `disabled`

### Capability Values

- `buyer`
- `seller`
- `author`

Capabilities may coexist in one account.

### Indexes

- Unique index on normalized `email`.
- Index on `accountStatus`.
- Index on `emailVerified`.

## 4. Collection: sessions

### Purpose

Stores active and revoked authentication sessions for individual devices or browser instances.

### Schema

| Field                | Type     | Required | Description                   |
| -------------------- | -------- | -------- | ----------------------------- |
| `_id`              | ObjectId | Yes      | Session identifier            |
| `userId`           | ObjectId | Yes      | Reference to users            |
| `refreshTokenHash` | String   | Yes      | Hash of current refresh token |
| `expiresAt`        | Date     | Yes      | Session expiration            |
| `lastUsedAt`       | Date     | Yes      | Last successful refresh       |
| `revokedAt`        | Date     | No       | Session revocation timestamp  |
| `userAgent`        | String   | No       | Browser/device information    |
| `createdAt`        | Date     | Yes      | Session creation timestamp    |
| `updatedAt`        | Date     | Yes      | Last update timestamp         |

### Indexes

- Index on `userId`.
- Unique index on `refreshTokenHash`.
- TTL index on `expiresAt`.
- Index on `revokedAt`.

### Session Rules

1. A successful login creates a new session.
2. Each session has an independent refresh token.
3. Refresh-token rotation updates the stored token hash.
4. Logout revokes the current session.
5. Logout-all revokes all active sessions belonging to the user.
6. Expired sessions must not be accepted.
7. Session expiration must be checked by application logic.

A TTL index is only a background cleanup mechanism. It must not be treated as an authorization mechanism or immediate session-revocation mechanism.

## 5. Collection: emailverificationtokens

### Purpose

Stores email-verification token records.

### Schema

| Field         | Type     | Required | Description                 |
| ------------- | -------- | -------- | --------------------------- |
| `_id`       | ObjectId | Yes      | Token record identifier     |
| `userId`    | ObjectId | Yes      | Reference to users          |
| `tokenHash` | String   | Yes      | Hash of verification token  |
| `expiresAt` | Date     | Yes      | Token expiration            |
| `usedAt`    | Date     | No       | Token consumption timestamp |
| `createdAt` | Date     | Yes      | Token creation timestamp    |

### Indexes

- Index on `userId`.
- Unique index on `tokenHash`.
- TTL index on `expiresAt`.

### Rules

- Raw verification tokens must never be stored.
- Tokens must be cryptographically random.
- Tokens must be single-use.
- Expired tokens must be rejected.
- Successful verification updates `users.emailVerified`.
- Resending verification may invalidate previous unused tokens.

## 6. Collection: passwordresettokens

### Purpose

Stores password-reset token records.

### Schema

| Field         | Type     | Required | Description                 |
| ------------- | -------- | -------- | --------------------------- |
| `_id`       | ObjectId | Yes      | Token record identifier     |
| `userId`    | ObjectId | Yes      | Reference to users          |
| `tokenHash` | String   | Yes      | Hash of reset token         |
| `expiresAt` | Date     | Yes      | Token expiration            |
| `usedAt`    | Date     | No       | Token consumption timestamp |
| `createdAt` | Date     | Yes      | Token creation timestamp    |

### Indexes

- Index on `userId`.
- Unique index on `tokenHash`.
- TTL index on `expiresAt`.

### Rules

- Raw reset tokens must never be stored.
- Tokens must be cryptographically random.
- Tokens must be single-use.
- Expired tokens must be rejected.
- Successful reset invalidates the token.
- Password reset revokes existing sessions.

## 7. Entity Relationships

The authentication database uses the following relationships:

- One user can have multiple sessions.
- One user can have multiple email-verification token records over time.
- One user can have multiple password-reset token records over time.
- Every session belongs to exactly one user.
- Every verification token belongs to exactly one user.
- Every password-reset token belongs to exactly one user.

### Relationship Diagram

```text
                USERS
                  |
        +---------+---------+
        |         |         |
        |         |         |
     SESSIONS  EMAIL      PASSWORD
              VERIFICATION  RESET
               TOKENS       TOKENS

One User -> Many Sessions
One User -> Many Verification Tokens
One User -> Many Password Reset Tokens
```

## 8. Data Security Rules

1. Passwords must be stored only as bcrypt hashes.
2. Refresh tokens must be stored only as hashes.
3. Verification tokens must be stored only as hashes.
4. Password-reset tokens must be stored only as hashes.
5. Password hashes must be excluded from ordinary API responses.
6. Authentication secrets must never be stored in frontend local storage.
7. Sensitive fields must not be exposed through general user queries.
8. Database access must use validated application-level operations.
9. User-provided fields must not be allowed to overwrite protected fields.
10. Database credentials must remain in environment variables.

## 9. Data Validation

Mongoose schemas and Zod request validators will work together.

### Zod Responsibilities

- Validate incoming request data.
- Validate email format.
- Validate password length.
- Validate postal address fields.
- Reject unexpected or protected fields.
- Validate allowed capability values in authorized administrative operations.

### Mongoose Responsibilities

- Enforce schema structure.
- Enforce required fields.
- Apply field constraints.
- Maintain timestamps.
- Enforce database indexes.
- Maintain references between documents.

Validation must happen before sensitive database operations.

## 10. Transaction Requirements

MongoDB transactions should be used when multiple database changes must succeed or fail together.

Examples:

### Email Verification

- Mark the verification token as used.
- Update the user's email verification status.

### Password Reset

- Mark the reset token as used.
- Update the password hash.
- Revoke existing sessions.

### Logout All

- Revoke all active sessions belonging to the authenticated user.

These operations must use the configured MongoDB replica-set deployment.

## 11. Account Creation Rules

When a user registers:

1. Normalize the email address.
2. Check email uniqueness.
3. Validate personal and postal information.
4. Hash the password.
5. Create the user document.
6. Assign default capability `buyer`.
7. Set `isAdmin` to `false`.
8. Set `emailVerified` to `false`.
9. Set `accountStatus` to `active`.
10. Create an email-verification token record.

The registration endpoint must not accept client-controlled values for `isAdmin`, `emailVerified`, or privileged capabilities.

## 12. Account Capability Management

A user can possess multiple capabilities.

Example:

```json
{
  "capabilities": [
    "buyer",
    "seller",
    "author"
  ],
  "isAdmin": false
}
```

Capabilities must be added or removed through authorized backend operations.

Administrative privileges must remain separate from ordinary account capabilities.

## 13. Database Integrity Rules

- Email addresses must remain unique after normalization.
- Every session must reference an existing user.
- Every verification token must reference an existing user.
- Every reset token must reference an existing user.
- Expired and revoked sessions must not authorize requests.
- Used tokens must never become valid again.
- User deletion must follow an explicit account-retention and cleanup policy.
- Database operations involving related records must handle partial failure safely.

## 14. Future Database Extensions

The following collections are outside the initial authentication implementation but may be introduced as marketplace features are developed:

- `orders`
- `sellerorders`
- `books`
- `listings`
- `payments`
- `addresses`
- `wishlists`
- `reviews`
- `notifications`
- `authorprofiles`

These collections must be designed in their respective feature specifications and database-design documents.

## 15. Acceptance Criteria

The database design will be considered correctly implemented when:

1. All four authentication collections are created through Mongoose models.
2. User email uniqueness is enforced.
3. Passwords are securely hashed.
4. Refresh tokens are stored as hashes.
5. Verification and reset tokens are stored as hashes.
6. Sessions support expiration and revocation.
7. Token records support expiration and single-use validation.
8. User capabilities support multiple simultaneous values.
9. Administrative access is separate from user capabilities.
10. Relationships are validated.
11. Required indexes are created.
12. Transaction-dependent operations work on the configured replica set.
13. Sensitive fields are excluded from ordinary responses.
14. Automated tests validate database constraints and security rules.

---

**Implementation status:** This document defines the intended database design. Actual schema behavior, indexes, transactions, and data integrity must be verified through implementation and testing.
