# Master Prompt Engineering Guide for Next.js 15 Digital Banking Frontend

This document provides standardized, production-grade prompt templates designed to build a scalable, highly maintainable, portfolio-ready Digital Banking Frontend using **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **TanStack Query v5**, and **Zod**.

---

## 🛠️ Prompt 1: Initializing Next.js 15 Project & Design System

Use this prompt when setting up the initial Next.js 15 project structure and design system tokens.

```text
Act as a Senior Frontend Architect with 15+ years of experience building Fintech and Banking web applications.

Task: Initialize a clean, highly maintainable Next.js 15 (App Router) project structure for an enterprise Digital Banking Platform.

Tech Stack & Constraints:
- Next.js 15 (App Router with TypeScript)
- Tailwind CSS & shadcn/ui component library
- TanStack Query v5 & Axios API client
- Lucide React icons
- Atomic Feature-Based Folder Structure (src/app, src/features, src/components, src/lib, src/services, src/types)

Requirements:
1. Configure `src/lib/axios.ts` with base URL, `withCredentials: true`, and automatic 401 JWT refresh token interceptor logic.
2. Configure `src/components/providers/QueryClientProvider.tsx` with TanStack Query default stale time (5 minutes) and retry policies.
3. Establish CSS custom properties in `src/app/globals.css` for a sleek, dark-mode friendly banking color palette (Navy Blue #0A192F, Emerald Green #10B981 for success, Crimson #EF4444 for debit/alert).
4. Ensure strict TypeScript types for API envelopes matching `ApiResponse<T>` and `ProblemDetail`.

Output format: Return clean, production-ready code files with zero placeholders and complete JSDoc comments.
```

---

## 🎨 Prompt 2: Generating Banking UI Components (Form + Validation + Modal)

Use this prompt to generate individual feature components (e.g., Transfer Form with OTP Modal).

```text
Act as a Senior React & UI/UX Architect specializing in Design Systems and Accessibility (WCAG 2.1 AA).

Task: Build a production-grade Internal Money Transfer Component (`TransferForm.tsx`) with an integrated Step-up OTP Verification Modal for a Digital Banking Platform.

Specification & Business Rules:
- Refer to REST API Spec: POST /api/v1/transfers (Idempotency-Key header, sourceAccountNumber, targetAccountNumber, amount, currency, description).
- Validation (Zod + React Hook Form):
  * sourceAccountNumber: required string (10 digits)
  * targetAccountNumber: required string (10 digits), must NOT equal sourceAccountNumber
  * amount: positive number (> 0), max 2 decimals, max daily limit check
  * description: optional string, max 100 characters
- UX & State Logic:
  * Show source account selection dropdown displaying real-time available balance.
  * If requested amount > $1,000, trigger an interactive shadcn Dialog Modal for OTP entry (6-digit PIN input with 5-minute countdown timer).
  * Show clear loading states during submission (disabled buttons, spinner).
  * Format money inputs with proper currency symbol ($ / USD).

Design & Aesthetic Requirements:
- Premium, high-trust banking visual design (glassmorphism accents, smooth hover transitions, clear typography).
- Responsive on mobile, tablet, and desktop viewports.

Output format: Provide complete TypeScript code for `TransferForm.tsx`, `OtpModal.tsx`, and the corresponding Zod schema file `transferSchema.ts`.
```

---

## ⚡ Prompt 3: Generating TanStack Query Hooks & Service Layer

Use this prompt to build typed API services and custom React Query hooks.

```text
Act as a Senior Frontend State Management Expert.

Task: Build the TanStack Query v5 custom hooks and Axios API service module for Account & Transfer management (`useAccounts.ts`, `useTransfer.ts`).

Requirements:
1. `useAccounts()`: Custom hook fetching list of user accounts via GET /api/v1/accounts.
   - Support automatic caching (staleTime: 2 mins).
   - Provide helper methods to compute `totalBalance` across accounts.
2. `useExecuteTransfer()`: Custom mutation hook executing POST /api/v1/transfers.
   - Automatically generate UUID v4 `Idempotency-Key` header for every request.
   - On success: Invalidate `['accounts']` and `['transactions']` queries to trigger real-time balance UI update without full page refresh.
   - On error: Parse RFC 7807 `ProblemDetail` error response and display user-friendly toast notification using shadcn `useToast()`.

Output format: Fully typed TypeScript code for `src/features/transfers/hooks/useTransfer.ts` and `src/features/transfers/api/transferApi.ts`.
```

---

## 🔒 Prompt 4: Generating Page Layouts & Route Protection Middleware

Use this prompt to generate the Dashboard Layout and Next.js Auth Middleware.

```text
Act as a Next.js 15 Core Specialist.

Task: Build the Dashboard Layout (`src/app/(dashboard)/layout.tsx`) and Next.js Auth Guard Middleware (`src/middleware.ts`).

Requirements:
1. `middleware.ts`:
   - Intercept requests to `/dashboard/**`, `/accounts/**`, `/transfers/**`, `/admin/**`.
   - Read JWT access token / session cookie. If unauthenticated, redirect to `/login?callbackUrl=...`.
   - Protect `/admin/**` routes by checking `ROLE_ADMIN` role in decoded JWT payload.
2. `DashboardLayout.tsx`:
   - Persistent Sidebar navigation featuring icons for: Dashboard, Accounts, Transfers, Savings, Beneficiaries, Settings.
   - Top Header with Search input, Real-time WebSocket Notification Bell indicator, and User Avatar Dropdown (Logout, Profile).
   - Mobile-responsive drawer navigation (Sheet component on small screens).
   - Smooth layout transitions for child pages.

Output format: Fully typed Next.js 15 App Router code files.
```
