# FocusNest – Project Steering Instructions

## Project Overview

FocusNest is a beginner-friendly college project demonstrating Modern Frontend Framework concepts.
It is a Personal Productivity and Focus Management Application built entirely on the frontend.

**Tech Stack:**
- React.js (functional components only)
- Vite (build tool and dev server)
- JavaScript (not TypeScript)
- React Router v6 (client-side navigation)
- CSS (plain CSS with CSS variables — no Tailwind, no styled-components)
- Recharts (for analytics charts only)
- Browser LocalStorage (all data persistence)

---

## Code Style and Standards

### React Components
- Always use **functional components** with hooks. Never use class components.
- Keep each component **small and focused** — one component should do one thing well.
- If a component file grows beyond ~150 lines, consider splitting it.
- Use **named exports** for components (not default exports for everything).
- Every reusable component lives in `src/components/`. Before creating a new component, check if a suitable one already exists there.
- **Never duplicate a component.** If `Button.jsx` exists, use it — do not create another button component elsewhere.

### React Hooks
- Use `useState` for local component state.
- Use `useEffect` for side effects (LocalStorage reads, timers, document title updates).
- Use `useContext` to consume shared global state from Context providers.
- Use `useRef` for timer interval IDs and direct DOM references.
- Use `useCallback` when passing functions as props to child components to avoid unnecessary re-renders.
- Use `useMemo` when computing expensive derived data (e.g. analytics calculations).
- Custom hooks live in `src/hooks/` and start with the word `use` (e.g. `useLocalStorage`, `useTimer`).

### Naming Conventions
- Components: `PascalCase` (e.g. `TaskCard`, `TimerCircle`)
- Files: match the component name exactly (e.g. `TaskCard.jsx`)
- Variables and functions: `camelCase` (e.g. `handleSubmit`, `taskList`)
- Constants: `UPPER_SNAKE_CASE` (e.g. `STORAGE_KEYS`, `DEFAULT_TIMER_DURATION`)
- CSS class names: `kebab-case` (e.g. `.task-card`, `.btn-primary`)
- Use **descriptive, self-explanatory names**. Avoid single-letter variables outside of simple loop counters.

### JavaScript
- Use clean, beginner-friendly JavaScript — `const`/`let`, arrow functions, destructuring, spread operator, template literals.
- Avoid overly clever one-liners that sacrifice readability.
- Use `async/await` syntax when writing async functions (even if they are just simulating async behavior).
- Always handle edge cases: check for null/undefined before accessing nested properties.

---

## Project Structure Rules

The folder structure must stay organized as follows:

```
src/
├── assets/          # Static images, icons
├── components/      # Reusable UI components, grouped by feature
│   ├── common/      # Shared across the whole app (Button, Input, Modal, Toast)
│   ├── layout/      # Sidebar, Navbar, PageWrapper, AuthLayout
│   ├── dashboard/   # Dashboard-specific components
│   ├── tasks/       # Task feature components
│   ├── timer/       # Pomodoro timer components
│   ├── goals/       # Goals feature components
│   ├── analytics/   # Charts and analytics components
│   └── streak/      # Streak display components
├── pages/           # Full pages rendered by React Router
│   ├── auth/        # LoginPage, RegisterPage, ForgotPasswordPage
│   └── (other pages at root of pages/)
├── context/         # React Context providers (AuthContext, TaskContext, etc.)
├── hooks/           # Custom React hooks
├── utils/           # Pure helper functions (no JSX)
└── styles/          # Global CSS files
```

- **Do not create files outside this structure** without explaining why first.
- **Do not modify unrelated files** when working on a specific feature.
- Pages go in `src/pages/`. They are thin — they import and compose components, not define business logic themselves.

---

## Routing

- Use **React Router v6** with `<BrowserRouter>`, `<Routes>`, and `<Route>`.
- Protect all app pages behind an auth check — redirect unauthenticated users to `/login`.
- A `ProtectedRoute` component in `src/components/common/` handles this check.
- Auth pages (`/login`, `/register`, `/forgot-password`) redirect to `/dashboard` if the user is already logged in.

**Route map:**
```
/login               → LoginPage
/register            → RegisterPage
/forgot-password     → ForgotPasswordPage
/dashboard           → DashboardPage       (protected)
/tasks               → TasksPage           (protected)
/timer               → TimerPage           (protected)
/goals               → GoalsPage           (protected)
/analytics           → AnalyticsPage       (protected)
/settings            → SettingsPage        (protected)
/                    → redirect to /dashboard
```

---

## LocalStorage Data Rules

- All LocalStorage keys are defined in `src/utils/storageKeys.js` as constants. Never hardcode key strings in components.
- The `useLocalStorage` custom hook (`src/hooks/useLocalStorage.js`) is the standard way to read/write LocalStorage.
- **Never store passwords in LocalStorage**, even hashed. This is a frontend-only project — treat login as a UI simulation. Store only the user profile object (name, email, avatar).
- Never log sensitive data to the console.
- Always provide a safe default value when reading from LocalStorage (e.g. empty array `[]` for lists, `{}` for objects).

**Storage keys used:**
```
focusnest_user          → logged-in user profile object
focusnest_tasks         → array of task objects
focusnest_goals         → array of goal objects
focusnest_sessions      → array of completed Pomodoro sessions
focusnest_streak        → streak tracking object
focusnest_settings      → user preferences (theme, timer durations)
focusnest_analytics     → daily stats object
```

---

## Styling Rules

- Use **plain CSS** only. No Tailwind, no CSS-in-JS, no styled-components.
- Global CSS variables are defined in `src/styles/globals.css` for colors, spacing, border-radius, shadows, and font sizes.
- Light and dark mode are implemented via a `data-theme` attribute on the `<body>` element, toggled by `ThemeContext`.
- Each component may have its own `.css` file co-located next to the `.jsx` file (e.g. `TaskCard.jsx` + `TaskCard.css`), or use CSS classes from the global stylesheet for simple styling.
- Keep CSS organized: group related rules, use comments to label sections.
- All pages must be **fully responsive**: design for mobile (320px+), tablet (768px+), and desktop (1024px+).
- Use CSS Flexbox and Grid for layouts — no float-based layouts.
- Animations and transitions should be subtle and purposeful — defined in `src/styles/animations.css`.

---

## UI and Design Standards

- The app has a **professional, modern productivity-SaaS aesthetic** — clean, minimal, consistent.
- Use the design system colors, spacing, and typography defined in `src/styles/globals.css`. Do not introduce one-off colors inline.
- Every list or data view must handle three states:
  - **Loading state** — show a `LoadingSpinner` component
  - **Empty state** — show an `EmptyState` component with a helpful message and icon
  - **Error state** — show a clear error message
- Use the `Toast` / `ToastContext` system for all user feedback (success, error, warning). Do not use `alert()`.
- Confirm destructive actions (deleting a task, clearing data) with the `ConfirmDialog` component.
- Icons should be simple SVG icons or Unicode emoji — do not add an icon library unless absolutely necessary.

---

## Architecture and Decision Rules

- **Before making a large architectural change** (e.g. restructuring context, changing routing, refactoring a shared component), explain the proposed change and the reason for it first. Do not just rewrite.
- **Before creating a new component**, check `src/components/` for an existing reusable component that fits. Prefer composition over duplication.
- **Before adding a new npm dependency**, justify why it is needed and confirm it cannot be implemented with ~20 lines of plain JS/CSS.
- Keep `App.jsx` clean — it should only contain the router setup and context providers, not business logic.
- Context files follow a consistent pattern: define the context, create a provider component, export a custom hook to consume it (e.g. `useTasks`, `useAuth`).

---

## Beginner-Friendly Communication Rules

- When implementing a non-obvious pattern (e.g. Context + Provider, custom hook, protected routes), include a short comment in the code explaining **why** it is done this way, in plain English.
- When making an implementation decision that has trade-offs, briefly explain the choice.
- Code comments should explain **intent**, not just repeat what the code says.
  - Bad comment: `// sets count to 0`
  - Good comment: `// reset the timer when the user switches modes`
- Function and variable names should be clear enough that most code is self-documenting.

---

## What This Project Must Demonstrate

This project is submitted for a **Modern Frontend Frameworks** course. It must clearly show:

1. React functional components and JSX
2. React hooks (`useState`, `useEffect`, `useContext`, `useRef`, custom hooks)
3. React Router for multi-page navigation with protected routes
4. React Context API for global state management
5. Component composition and reusability
6. Controlled form components
7. Conditional rendering (loading, empty, error states)
8. List rendering with `.map()` and proper `key` props
9. LocalStorage as a persistence layer
10. Responsive CSS layout with light/dark mode
