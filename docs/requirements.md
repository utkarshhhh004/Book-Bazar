
# BOOK BAZAR – SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

**Document Version:** 1.0
**Project:** Book Bazar
**Document Type:** Software Requirements Specification
**Architecture:** Full-Stack Web Application
**Status:** Initial Requirements Baseline

---

# 1. Introduction

## 1.1 Purpose

This document defines the functional and non-functional requirements of Book Bazar.

It establishes the expected system behaviour, features, user permissions, business rules, technical constraints and acceptance criteria.

It will serve as the primary reference during application design, development, integration and testing.

## 1.2 Project Scope

Book Bazar is a multi-vendor online marketplace that connects buyers, independent book sellers and authors through a unified platform.

The system will support physical book purchasing and selling, inventory management, online payments, order processing, delivery tracking and administrative operations.

Digital publishing will be supported as a dedicated future module.

## 1.3 Intended Audience

- Project Developers
- Frontend Developers
- Backend Developers
- Database Designers
- UI/UX Designers
- Project Administrators
- Testers and Quality Assurance Engineers

# 2. System Overview

Book Bazar will consist of the following major components:

1. Customer-facing frontend application.
2. Seller management interface.
3. Author management interface.
4. Administrative dashboard.
5. RESTful backend API.
6. MongoDB database.
7. External payment integration.
8. Courier and delivery integration.
9. Docker-based application infrastructure.

# 3. User Requirements

## 3.1 Guest User

A guest user must be able to:

- Access the homepage.
- Browse publicly available books.
- Search for books.
- Filter books by available categories and attributes.
- View book details and seller information.
- Register an account.
- Log in to an existing account.

## 3.2 Registered Buyer

A buyer must be able to:

- Manage personal profile information.
- Manage multiple delivery addresses.
- Browse and search the book catalogue.
- View book descriptions, images, conditions and prices.
- Add books to a shopping cart.
- Remove books from the cart.
- Add books to a wishlist.
- Remove books from the wishlist.
- Place orders.
- Complete payments using supported payment methods.
- View order history.
- Track order status.
- Cancel eligible orders according to order policies.
- Submit reviews and ratings for eligible purchases.

## 3.3 Seller

A seller must be able to:

- Access seller functionality using the same account.
- Create book listings.
- Upload book images.
- Provide book descriptions and conditions.
- Set fixed selling prices.
- Specify available inventory.
- Edit existing listings.
- Activate or deactivate listings.
- Manage inventory availability.
- View incoming orders.
- Process eligible orders.
- View sales history.
- View earnings and commission deductions.
- Monitor order and delivery statuses.

## 3.4 Author

An author must be able to:

- Create and manage an author profile.
- Add author information.
- Manage published book information.
- Associate books with their author profile.
- Access future publishing functionality.

Digital book publishing and distribution will be implemented in a later development phase.

## 3.5 Administrator

An administrator must be able to:

- Access the administrative dashboard.
- View platform statistics.
- Manage registered users.
- Manage sellers and authors.
- Manage book categories.
- Moderate book listings.
- Monitor orders.
- Monitor payment transactions.
- Review commission records.
- Manage disputes and moderation.
- Configure launch cities.
- Manage marketplace settings.

# 4. Functional Requirements

## FR-01: Authentication and Authorization

The system shall:

- Allow users to register.
- Allow registered users to log in.
- Securely hash user passwords.
- Support JWT-based authentication.
- Validate authentication credentials.
- Protect private application routes.
- Support logout and session invalidation.
- Provide password recovery functionality.
- Support email or phone OTP verification.
- Implement backend authorization.
- Support multiple capabilities for one account.
- Restrict administrative operations to authorized administrators.

## FR-02: User Profile Management

The system shall:

- Store user account information.
- Allow users to view their profiles.
- Allow users to update profile details.
- Support profile image uploads.
- Maintain account creation and modification timestamps.
- Allow users to manage their contact information.

## FR-03: Address Management

The system shall:

- Allow users to add delivery addresses.
- Allow users to edit addresses.
- Allow users to delete addresses.
- Support
