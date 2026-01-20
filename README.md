# Travel Loan Manager - Frontend

## Project Overview
A modern, responsive loan management interface designed for high-trust financial operations. This dashboard-driven application serves two primary actors:
- **Administrators**: Manage borrower lifecycles, record payments, and handle sensitive credential resets.
- **Borrowers**: View loan progress, repayment schedules, and manage personal security settings.

The interface is built to transform complex financial data into actionable, intuitive workflows, prioritizing data integrity and user confidence.

## Key UX Capabilities
- **Stateless Authentication**: Robust JWT-based session management with automatic redirection and route protection.
- **Admin Tooling**: Sophisticated dashboards for mass borrower oversight, featuring real-time search, filtering, and PDF repayment schedule generation.
- **Hybrid Security Flows**: A specialized password recovery system that handles both email-enabled users and offline borrowers via admin-assisted resets with forced rotation.
- **Managed Form State**: Type-safe form handling using React Hook Form and Zod, providing immediate inline validation and clear error feedback.
- **Context-Preserving Async Flows**: Implementation of localized loaders (button-level) and optimistic UI principles to avoid "flash of blank screen" behaviors.

## Architecture & State Management
- **Tech Stack**: Built with **React 18**, **TypeScript**, and **Vite** for a performant, type-safe development experience.
- **Component System**: Leverages **Tailwind CSS** and **Radix UI** (via Shadcn) for a high-fidelity, accessible design system that scales.
- **Server State**: Utilizes **TanStack Query** (React Query) for declarative data fetching. This abstracts away the complexity of caching, retry logic, and synchronization of loading/error states.
- **API Communication**: Centralized **Axios** client with interceptors for seamless JWT injection and standardized error extraction.

## UX & Accessibility Decisions
- **Transition Continuity**: Removed full-page loaders during authentication transitions in favor of button-level state changes. This maintains visual context and reduces perceived latency.
- **Failure Resilience**: Implemented a global `errorHandler` utility that translates complex backend exceptions into human-readable toast notifications.
- **Intentional Friction**: Destructive actions, such as administrative password resets, are gated by multi-step confirmation dialogs to prevent accidental data modification.
- **No-Email UX**: Specifically addressed the "missing email" edge case by providing explicit paths for borrowers to contact admins, rather than failing silently.

## Integration with Backend
- **Role Enforcement**: The UI dynamically adapts based on JWT claims, hiding or showing entire modules (Admin vs. Borrower) to enforce the principle of least privilege.
- **Error Surface Area**: API errors are caught at the service layer and surfaced through a unified notification system, ensuring users are never left in an unknown state.

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root:
```env
VITE_API_URL=https://your-backend-api.com
```

### 3. Start Development Server
```bash
npm run dev
```

## What This Demonstrates
- **UX Maturity**: A focus on "failure paths" and "loading states" just as much as "happy paths."
- **System Thinking**: An architecture designed for scalability, maintaining clear boundaries between UI components and infrastructure logic.
- **Admin-Grade Tooling**: Experience building complex, multi-role interfaces that demand both security and efficiency.
