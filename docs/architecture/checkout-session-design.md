
# Checkout Session Design

**Project:** Book Bazar
**Status:** Approved
**Architecture:** Modular Monolith
**Database:** MongoDB with Mongoose
**Decision:** Introduce a dedicated Checkout collection.

## 1. Purpose

The Checkout collection represents a buyer's checkout operation independently of the shopping cart and the resulting parent order.

A checkout provides a stable ObjectId that connects inventory reservations, order creation and checkout lifecycle management.

## 2. Core Responsibilities

- Identify the buyer initiating checkout.
- Track checkout lifecycle.
- Enforce a 15-minute reservation window.
- Link the checkout to its resulting parent order.
- Prevent duplicate parent-order creation for the same checkout.
- Support safe expiry and cancellation.

## 3. Checkout Collection

**Collection:** `checkouts`
**Mongoose Model:** `Checkout`

| Field       | Data Type | Description                     |
| ----------- | --------- | ------------------------------- |
| _id         | ObjectId  | Checkout identifier             |
| buyerId     | ObjectId  | Reference to User               |
| status      | String    | Checkout lifecycle state        |
| expiresAt   | Date      | Reservation expiration          |
| orderId     | ObjectId  | Optional reference to Order     |
| completedAt | Date      | Successful completion timestamp |
| cancelledAt | Date      | Cancellation timestamp          |
| createdAt   | Date      | Creation timestamp              |
| updatedAt   | Date      | Modification timestamp          |

### Checkout States

- `active`: Checkout is being processed.
- `awaiting_payment`: Parent order exists and payment is pending.
- `completed`: Payment is verified and reservations are consumed.
- `expired`: Reservation window expired and inventory was released.
- `cancelled`: Buyer or authorized system operation cancelled checkout.

## 4. Relationships

- Checkout belongs to one User.
- Checkout may reference one parent Order.
- Checkout may have multiple InventoryReservation records.
- One checkout creates at most one parent Order.
- A parent Order may contain multiple SellerOrders.

## 5. Inventory Reservation Integration

The `InventoryReservation.checkoutId` field must be an ObjectId referencing `Checkout`.

Every reservation must identify:

- Buyer
- Checkout
- Listing
- Reserved quantity
- Expiration timestamp
- Current reservation status

## 6. Reservation Lifecycle

1. Buyer initiates checkout.
2. Create a Checkout record.
3. Reserve requested inventory using atomic database updates.
4. Set reservation expiration to 15 minutes.
5. Create one parent Order and its SellerOrders.
6. Initiate payment against the parent Order.
7. On verified payment success, consume active reservations and complete checkout.
8. On expiry or cancellation, explicitly release active reservations and restore inventory.

## 7. Financial and Inventory Integrity

- Cart operations never reserve inventory.
- Inventory reservation must be atomic.
- Available stock must never become negative.
- Reservations must not be consumed or released twice.
- Checkout must not create multiple parent orders.
- Payment confirmation must be idempotent.
- MongoDB transactions must protect related database operations.
- Payment-provider operations must remain outside MongoDB transactions.
- External payment results require durable states and reconciliation.

## 8. Expiration and Cleanup

- Reservation duration is 15 minutes.
- Expiry must be processed through business logic.
- Inventory restoration must happen explicitly.
- TTL deletion must never be responsible for restoring inventory.
- Expiration processing must be safe to retry.

## 9. Indexes

- Index on `buyerId`.
- Compound index on `status` and `expiresAt`.
- Unique sparse index on `orderId` to prevent multiple checkouts from claiming the same parent order.

## 10. Implementation Boundaries

- `Checkout.js`: checkout identity and lifecycle.
- `InventoryReservation.js`: reservation records.
- `Listing.js`: inventory quantities.
- `Order.js`: parent order.
- `SellerOrder.js`: seller-specific fulfillment.
- `PaymentAttempt.js`: payment initiation and retries.
- `Payment.js`: verified payment records.

## 11. Acceptance Criteria

- One checkout can reference multiple reservations.
- Every reservation references a valid checkout.
- Checkout expires after the reservation window.
- Stock is restored exactly once after release.
- Successful payment consumes reservations exactly once.
- One checkout cannot create multiple parent orders.
- Expired or cancelled checkout cannot accept new reservations.
- Payment retries do not duplicate orders or financial success.
