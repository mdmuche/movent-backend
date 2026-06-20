# 🎟️ Movent API (Backend)

Movent is a modern, high-performance event ticketing and reservation platform. This repository contains the **Express.js backend API** that drives the application, handling everything from user authentication and event coordination to ticket purchases, payment processing via Paystack, background notification jobs, and robust administrator management.

---

## 🚀 Features

### 🔐 1. Authentication & Security
- **Secure Auth Flow:** User signup, email verification, login, password reset (via token), and token refresh operations.
- **JWT Middleware:** Access and refresh token storage in HTTP-only cookies for enhanced client-side protection.
- **Route Authorization:** Middleware configurations defining roles (`attendee`, `organizer`, `admin`) to restrict resource access.
- **Security Policies:** Powered by `helmet` headers, strictly parameterized CORS constraints, and request rate-limiters (`express-rate-limit`) to prevent abuse.

### 📅 2. Event Reservation & Management
- **Detailed Inventories:** Organizers can create, edit, delete, and view events with precise start/end schedules, capacities, pricing tiers (`regular`, `vip`, `vvip`), tag mappings, and entry guidelines.
- **Asset Processing:** Seamless media handling using `multer` for direct file parsing, uploaded and hosted on `cloudinary`.
- **Engagement Analytics:** Custom recommendation queries, category sorting, upcoming events tracking, and trending listings.

### 🎫 3. Ticket Booking & Check-in Engine
- **Free Tickets:** Instant claim endpoints with concurrency checks and duplicate purchase prevention.
- **Paid Tickets:** Multiplexed booking engine utilizing Paystack checkout integration.
- **Check-in Processing:** Real-time QR/manual validation at the door (`checkedInAt`, `status: used`, `attended: true`).
- **Resending/Cancelling:** Standard operations to cancel unutilized tickets or re-trigger verification/receipt emails.

### 💳 4. Checkout & Promo Codes
- **Paystack Integration:** Payment initialization, callback verifications, and webhooks processing.
- **Discounts Engine:** Dynamic creation of admin-defined promo codes with specific expiration dates, usage limits, and automatic transaction recalculations.
- **Refund Processing:** Handles cancelled events and processes refunds through audit tracks.

### 🔔 5. Communications & Notification Logs
- **Internal Log Engine:** Real-time activity updates when tickets are purchased, claimed, or cancelled.
- **User Preferences:** Opt-in preferences for newsletter subscriptions, app languages, and notification types.

### ⚙️ 6. Admin Control Panel
- **Telemetry Overview:** Aggregated metric calculations for ticket sales, total users, pending event lists, and revenue tracks.
- **moderation actions:** Elevate attendees to organizers, flag accounts, or suspend users temporarily.
- **File Exports:** Generates transaction spreadsheets (Excel/CSV) and detailed PDFs for physical audit logs.
- **Dynamic Configuration:** Adjust system-wide variables like `maxTicketPerPurchase` without server restarts.

### ⏰ 7. Cron Jobs & Tasks
- **Inactive Accounts Cleanup:** Prunes unverified/expired temp tokens automatically.
- **Event Reminders:** Dispatches automated email digests alerting users to upcoming gatherings.

---

## 🛠️ Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (ES Modules configuration)
- **Framework:** [Express.js (v5.0+)](https://expressjs.com/)
- **Database Layer:** [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Payment API:** [Paystack Gateway](https://paystack.com/)
- **File Upload & Hosting:** [Cloudinary SDK](https://cloudinary.com/) + [Multer](https://github.com/expressjs/multer)
- **Validation:** [Joi](https://joi.dev/) schema validator
- **Scheduled Tasks:** [node-cron](https://github.com/node-cron/node-cron)
- **Email Engines:** [Nodemailer](https://nodemailer.com/) / [Resend](https://resend.com/)
- **Testing Suite:** [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)
- **API Spec & Explorer:** [Swagger UI Express](https://swagger.io/) + [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)

---

## 📂 Project Structure

```
movent-be/
├── src/
│   ├── app.js               # Express application instance and middleware setup
│   ├── server.js            # Database connection & server listener starter
│   ├── config/              # Module configurations (Cloudinary, Mongo, SMTP, Multer, Swagger)
│   ├── controllers/         # Endpoint logic grouped by entities (auth, events, tickets, admin, etc.)
│   ├── docs/                # API reference Swagger docs (openapi.yaml)
│   ├── jobs/                # Scheduled background cron tasks (reminders, maintenance)
│   ├── middlewares/         # Authentication, authorization, errors, and validation filters
│   ├── models/              # Mongoose data schemas (User, Event, Ticket, Payment, AuditLog)
│   ├── routes/              # Express routing blueprints mapping routes to controllers
│   ├── services/            # Shared business layer services (e.g., Notification builder)
│   ├── utils/               # Shared logic helpers (winston logger, HTTP response wrappers)
│   └── validators/          # Joi verification rules enforcing request schemas
├── tests/                   # Integrations and route tests
│   ├── controllers/         # Controller unit tests
│   └── routes/              # Express router tests
├── eslint.config.js         # Linting regulations rules
├── jest.config.js           # Testing suite setup configuration
├── package.json             # Dependency library definitions and script run hooks
└── .env.example             # Clean template configuration for environment variables
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) (version `v18.x` or higher recommended) installed.
- Ensure [MongoDB](https://www.mongodb.com/) is running locally or you have an active cloud URL (Atlas).

### 🔧 Installation
1. Clone the project and navigate into the backend root:
   ```bash
   cd movent-be
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```

### ⚙️ Environment Configuration
1. Duplicate the template environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and populate it with your credentials:
   ```env
   # Server configuration
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/movent

   # JWT configuration
   JWT_SECRET=your_super_secure_jwt_secret
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d

   # Paystack Keys
   PAYSTACK_SECRET_KEY=sk_test_...
   PAYSTACK_CALLBACK_URL=http://localhost:5000/v1/checkout/verify

   # Cloudinary Keys
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Configuration (Nodemailer / SMTP / Resend)
   EMAIL_USERNAME=your-email@domain.com
   EMAIL_PASSWORD=your-email-app-password
   RESEND_API_KEY=re_...

   # Frontend Redirection Hooks
   FRONTEND_URL_LOCAL=http://localhost:3000
   FRONTEND_URL_MAIN=https://movent.vercel.app
   ```

### 🛠️ Execution Scripts
- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```
- **Check Lints & Formatting:**
  ```bash
  npm run lint
  npm run format
  ```
- **Run Tests:**
  ```bash
  npm test
  ```

---

## 📌 API Endpoints Overview

All APIs are prefixed with `/v1`. Below is an abstract roadmap of the primary available endpoints:

| Domain | Route | HTTP Method | Access | Action |
| :--- | :--- | :---: | :---: | :--- |
| **Auth** | `/auth/register` | POST | Public | Register a new user account |
| | `/auth/login` | POST | Public | Authenticate user & set secure cookies |
| | `/auth/forgot-password` | POST | Public | Send password reset token to email |
| | `/auth/reset-password/:token`| POST | Public | Reset password using temporary token |
| | `/auth/logout` | POST | Public | Clear HTTP-only session cookies |
| **Events** | `/event` | GET | Public | Fetch all events (filters, sorting, searching) |
| | `/event/trending` | GET | Public | Get popular events based on tickets sold |
| | `/event/:slug` | GET | Public | Get comprehensive details of a single event |
| **Tickets** | `/ticket/my-tickets` | GET | Attendee | Retrieve tickets purchased by current user |
| | `/ticket/:slug/purchase` | POST | Attendee | Reserve a free ticket for an event |
| | `/ticket/cancel/:ticketId`| PATCH | Attendee | Cancel an active ticket booking |
| **Checkout**| `/checkout/initiate/:slug`| POST | Attendee | Begin Paystack payment session for paid event |
| | `/checkout/verify/:ref` | GET | Attendee | Verify transaction validity with Paystack |
| | `/checkout/promo/apply` | POST | Attendee | Attach discount promo code to invoice |
| **Organizer**| `/organizer/events` | POST | Organizer | Create a new event draft (uploads banner image) |
| | `/organizer/my-events` | GET | Organizer | Fetch events created by the logged-in organizer |
| | `/organizer/events/:id` | PUT | Organizer | Edit event configurations (dates, price, capacity) |
| | `/organizer/analytics` | GET | Organizer | Get sales charts & attendee analysis dashboards |
| **Admin** | `/admin/overview` | GET | Admin | Retrieve administrative system stats |
| | `/admin/event-queue` | GET | Admin | View pending events awaiting verification |
| | `/admin/users` | GET | Admin | Retrieve and query all registered users |
| | `/admin/settings` | PATCH | Admin | Update system rules (`maxTicketPerPurchase`) |

### 📖 Interactive Swagger Sandbox
In development mode, you can inspect and try out all routes interactively using the Swagger UI:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## 🔒 License
This project is licensed under the **ISC License**. Created by [mdmuche](https://github.com/mdmuche).
