# FocusNest Authentication System – Implementation Tasks

## Task 1: Project Foundation
Set up Vite + React project files, folder structure, global styles, and utility helpers.
- [ ] Create index.html
- [ ] Create vite.config.js
- [ ] Create package.json
- [ ] Create src/main.jsx
- [ ] Create src/styles/globals.css
- [ ] Create src/styles/animations.css
- [ ] Create src/styles/auth.css
- [ ] Create src/utils/storageKeys.js
- [ ] Create src/utils/validators.js
- [ ] Create src/hooks/useLocalStorage.js

## Task 2: AuthContext and useAuth hook
Global authentication state, login/register/logout logic, LocalStorage session management.
- [ ] Create src/context/AuthContext.jsx

## Task 3: App Router Setup
React Router configuration, ProtectedRoute, PublicRoute, placeholder pages wired up.
- [ ] Create src/components/common/ProtectedRoute.jsx
- [ ] Create src/components/common/PublicRoute.jsx
- [ ] Create src/App.jsx
- [ ] Create placeholder pages (Dashboard, Tasks, Timer, Goals, Analytics, Settings)
- [ ] Create MainLayout placeholder

## Task 4: Shared Auth UI Components
Reusable FormInput, AuthCard, PasswordStrengthBar, GoogleDemoModal.
- [ ] Create src/components/common/FormInput.jsx
- [ ] Create src/components/layout/AuthCard.jsx
- [ ] Create src/components/auth/PasswordStrengthBar.jsx
- [ ] Create src/components/auth/GoogleDemoModal.jsx

## Task 5: Welcome Page
Animated landing/welcome page with Google and Email CTAs.
- [ ] Create src/pages/auth/WelcomePage.jsx

## Task 6: Login Page
Email/password login form with validation.
- [ ] Create src/pages/auth/LoginPage.jsx

## Task 7: Register Page
Create account form with validation and password strength indicator.
- [ ] Create src/pages/auth/RegisterPage.jsx

## Task 8: Forgot Password Page
Email submission UI with two-step success state.
- [ ] Create src/pages/auth/ForgotPasswordPage.jsx

## Task 9: Toast Notification System
Global toast context and container used by auth flows.
- [ ] Create src/context/ToastContext.jsx
- [ ] Create src/components/common/Toast.jsx
- [ ] Create src/components/common/ToastContainer.jsx

## Task 10: MainLayout with Logout
Sidebar, navbar, and logout flow wired to AuthContext.
- [ ] Create src/components/layout/Sidebar.jsx
- [ ] Create src/components/layout/Navbar.jsx
- [ ] Create src/components/layout/MainLayout.jsx
