# FocusNest Authentication System – Requirements

## Overview

The FocusNest authentication system is a **frontend-only** authentication experience for a college project demonstrating Modern Frontend Framework concepts. It provides a polished, realistic login/registration flow using React, React Router, and LocalStorage. There is no real backend, OAuth server, or database.

---

## Functional Requirements

### REQ-01: Welcome / Landing Page

- WHEN a user visits the application root (`/`) for the first time (no active session)
- THEN they SHALL be shown a full-screen welcome/landing page
- The welcome page SHALL display the FocusNest brand name and tagline
- The welcome page SHALL offer two primary actions: "Continue with Google" and "Continue with Email"
- The welcome page SHALL include a link to create a new account
- WHEN a user already has an active session in LocalStorage
- THEN they SHALL be automatically redirected to `/dashboard`

### REQ-02: Google Authentication (Demo Flow)

- WHEN a user clicks "Continue with Google"
- THEN a modal or overlay SHALL appear simulating the Google account selector
- The modal SHALL display one or more demo Google accounts (name, email, avatar)
- WHEN the user selects a demo account and confirms
- THEN a loading state SHALL be shown for 1.5 seconds to simulate an OAuth redirect
- THEN the user SHALL be logged in with the selected demo profile and redirected to `/dashboard`
- The Google demo modal SHALL clearly indicate this is a demonstration (e.g. "Demo Mode" badge)
- No real Google OAuth credentials, client IDs, or API calls SHALL be used

### REQ-03: Email / Password Login

- WHEN a user clicks "Continue with Email"
- THEN they SHALL be navigated to `/login`
- The login page SHALL provide an email input and a password input
- WHEN the user submits the form
- THEN the system SHALL validate: email is not empty, email is a valid format, password is not empty
- WHEN validation fails, inline error messages SHALL appear under the relevant field
- WHEN validation passes, the system SHALL look up the email in `focusnest_users` LocalStorage
- WHEN credentials match a stored account, the user SHALL be logged in and redirected to `/dashboard`
- WHEN credentials do not match, a toast error SHALL be shown: "Invalid email or password"
- The login page SHALL include a "Forgot password?" link navigating to `/forgot-password`
- The login page SHALL include a "Create an account" link navigating to `/register`
- The login page SHALL include a "Back" link returning to the welcome page (`/`)

### REQ-04: Create Account (Registration)

- The registration page SHALL be available at `/register`
- The registration form SHALL collect: full name, email address, password, confirm password
- WHEN the user submits the form, the system SHALL validate:
  - Full name: required, minimum 2 characters
  - Email: required, valid email format
  - Email: not already registered in `focusnest_users` LocalStorage
  - Password: required, minimum 8 characters
  - Confirm password: must match the password field
- WHEN any validation fails, inline error messages SHALL appear under the relevant field
- WHEN all validation passes, the system SHALL:
  - Save the new user profile to `focusnest_users` in LocalStorage (WITHOUT the password — store only name, email, avatar initials, id, createdAt)
  - Save a separate credential record to `focusnest_credentials` in LocalStorage (email + hashed or encoded password indicator — NOT plaintext)
  - Log the user in immediately
  - Redirect to `/dashboard`
  - Show a welcome toast notification: "Welcome to FocusNest, [Name]!"
- The registration page SHALL include a link back to `/login`

### REQ-05: Forgot Password

- The forgot password page SHALL be available at `/forgot-password`
- The page SHALL contain a single email input field
- WHEN the user submits, the system SHALL validate: email is not empty, email is a valid format
- WHEN validation passes, a success message SHALL be shown: "If an account exists for [email], a reset link has been sent."
- This is a UI-only flow — no actual email is sent
- The page SHALL include a "Back to login" link

### REQ-06: Logout

- A logout action SHALL be available from the main application layout (sidebar or navbar)
- WHEN the user clicks logout, a confirmation SHALL be requested: "Are you sure you want to sign out?"
- WHEN confirmed, the current session SHALL be cleared from LocalStorage
- The user SHALL be redirected to `/` (welcome page)
- A toast notification SHALL confirm: "You have been signed out"

### REQ-07: Authentication State

- The application SHALL maintain authentication state via React Context (`AuthContext`)
- On application load, `AuthContext` SHALL read the current session from `focusnest_session` in LocalStorage
- The `AuthContext` SHALL expose: `currentUser` object, `isAuthenticated` boolean, `login()` function, `logout()` function, `register()` function
- Authentication state SHALL persist across browser refreshes
- The `currentUser` object SHALL contain: `id`, `name`, `email`, `avatar`, `authMethod` (google/email), `createdAt`

### REQ-08: Protected Routes

- All application pages EXCEPT `/`, `/login`, `/register`, `/forgot-password` SHALL be protected
- WHEN an unauthenticated user navigates to a protected route
- THEN they SHALL be redirected to `/` (welcome page)
- WHEN an authenticated user navigates to `/`, `/login`, or `/register`
- THEN they SHALL be redirected to `/dashboard`
- A `ProtectedRoute` component SHALL handle this logic in the router

---

## Non-Functional Requirements

### NFR-01: Security (Frontend Context)
- Passwords SHALL NOT be stored in plaintext in LocalStorage
- Passwords SHALL NOT be echoed back anywhere in the UI
- The Google demo modal SHALL clearly label itself as a demonstration to avoid user confusion

### NFR-02: Validation
- All form validation SHALL run on submit AND on field blur (when user leaves a field)
- Validation error messages SHALL be specific and helpful (not just "Invalid input")
- The submit button SHALL be disabled while a loading/submitting state is active

### NFR-03: Accessibility
- All form inputs SHALL have associated `<label>` elements
- Error messages SHALL be associated with their input via `aria-describedby`
- Interactive elements SHALL be keyboard navigable
- Color contrast SHALL meet WCAG AA standards in both light and dark mode

### NFR-04: Responsiveness
- All auth pages SHALL be fully responsive across mobile (320px+), tablet (768px+), and desktop (1024px+)
- The layout SHALL center the auth card on larger screens and fill the screen on mobile

### NFR-05: Performance
- Auth pages SHALL load instantly (no heavy assets on the critical path)
- The Google demo loading state SHALL not exceed 2 seconds

---

## Out of Scope

- Real Google OAuth / Firebase Authentication
- Real password hashing (bcrypt, etc.) — this is a frontend demo
- Email delivery (SMTP, SendGrid, etc.)
- JWT tokens or session cookies
- Backend API calls of any kind
- Multi-factor authentication
