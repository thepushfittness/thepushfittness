# PushFitness — Elite Personal Training Client Management & Progress Tracking OS

A modern, responsive, production-ready SaaS application designed for personal trainers and boutique coaching businesses to manage athletes, workout programming, nutrition journals, session packages, subscription billing, progress measurements, and client communication.

---

## 🌟 Key Architecture & Highlights

### 1. Two Separate User Roles with Strict Data Isolation
* **TRAINER / ADMIN (`alex.trainer@pushfitness.io` / `password123`)**:
  * Unified command center with live business intelligence.
  * Search, filter, archive, restore, and delete clients.
  * Program builder with exercise libraries, target weights, tempo, rest timer intervals, and video demos.
  * Schedule management with automatic session credit decrementing.
  * Subscription & payment tracking with overdue radar alerts.
  * "Needs Attention" heuristic radar that automatically detects inactive athletes, missed workouts, and overdue invoices.
  * Printable / PDF Client Progress Report generator and CSV export.
* **CLIENT / ATHLETE (`sarah.chen@gmail.com`, `marcus.vance@gmail.com`, etc. / `password123`)**:
  * Mobile-first responsive workout interface.
  * Interactive set-by-set logger with checkmarks, RPE slider, and live countdown rest timer with alerts.
  * Daily nutrition & macronutrient journal with water tracker and quick increments.
  * Progress dashboard: weight tracking charts, compound lift 1RM PR progression, and body measurements.
  * Private before & after photo gallery with side-by-side date comparison slider.
  * Direct 1-on-1 coaching chat channel and weekly accountability check-in submission form.

### 2. Database-Level Security & Role Enforcement
* **JWT Authentication & Bearer Tokens**: Session tokens expire in 7 days and are securely stored.
* **Granular Route Authorization**: Middleware verifies `req.user.role` on all privileged routes.
* **Client Isolation Enforcement**: Clients can **never** view or alter another client's profiles, workouts, meals, photos, notes, or messages. Direct API manipulation attempts return `403 Forbidden`.

---

## 🚀 Quick Start Guide

### Prerequisites
Node.js (v18+) is required. If running on this machine, Node.js portable is installed at `C:\Users\pushk\node-portable\node-v20.18.0-win-x64`.

### Starting the Server
From the project root (`c:\the pushfittness`):
```powershell
# Start unified production server (serves API on port 5000 and the built frontend)
npm run server
```
Or start Vite dev server:
```powershell
npm run dev
```

Open your browser at:
👉 **`http://localhost:5000`** (or `http://localhost:3000` in dev mode)

---

## 👥 Demo Accounts & Testing

The app comes preloaded with realistic demo data and includes an **instant Role Switcher dropdown** in the navigation bar to test all user perspectives:

| Role | Name | Email | Password | Notable Features |
|---|---|---|---|---|
| **Trainer** | Coach Alex Rivera | `alex.trainer@pushfitness.io` | `password123` | Full Admin Dashboard, Revenue, Needs Attention Radar |
| **Client** | Sarah Chen | `sarah.chen@gmail.com` | `password123` | Active client, 92% adherence, 10/12 sessions used, Paid |
| **Client** | Marcus Vance | `marcus.vance@gmail.com` | `password123` | Strength athlete, 5x5 lifting, 96% adherence, PRs |
| **Client** | David Miller | `david.miller@gmail.com` | `password123` | ⚠️ Needs Attention: Payment overdue ($350), 5 days inactive |
| **Client** | Elena Rostova | `elena.rostova@gmail.com` | `password123` | Onboarding stage, runner's knee rehab |
| **Client** | Jordan Taylor | `jordan.taylor@gmail.com` | `password123` | Paused status, shoulder impingement clinical notes |

---

## 🧪 Automated Acceptance & Security Test Suite

Run the full end-to-end acceptance and security isolation test suite:
```powershell
powershell -ExecutionPolicy Bypass -File .\test_acceptance.ps1
```

All 22 test cases pass, verifying:
1. Trainer client creation, editing, scheduling, program assignment, payments, and reporting.
2. Client authentication and personal dashboard access.
3. Strict 403 Forbidden isolation blocking Client A from accessing Client B's profile, workouts, nutrition, photos, notes, messages, or measurements.
