# Haveli Cafe Management System Backend

Production-ready backend for a cafe management system built with Node.js, Express.js, MongoDB, JWT authentication, OTP verification, and Razorpay payments.

## Features

- JWT authentication with role-based access for customer, staff, and admin
- OTP delivery over Gmail SMTP and Twilio SMS
- Registration verification and forgot-password flow
- Customer APIs for menu, orders, booking, and order history
- Staff APIs for table handling, order flow, and daily transactions
- Admin APIs for menu management, staff management, orders, tables, and reports
- Razorpay order creation and signature verification

## Project Structure

```text
config/
controllers/
middleware/
models/
routes/
utils/
app.js
server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file and update values:

```bash
cp .env.example .env
```

3. Start MongoDB and update `MONGODB_URI` if required.

4. Run the server:

```bash
npm run dev
```

## Authentication Flow

### Register

1. Call `POST /api/auth/send-otp` with `purpose=registration` and `channel=email`.
2. Call `POST /api/auth/verify-otp`.
3. Call `POST /api/auth/register`.

### Forgot Password

1. Call `POST /api/auth/send-otp` with `purpose=forgot_password`.
2. Call `POST /api/auth/verify-otp`.
3. Call `POST /api/auth/reset-password`.

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile`

### Customer

- `GET /api/customer/menu`
- `POST /api/customer/orders`
- `GET /api/customer/orders/history`
- `POST /api/customer/bookings`

### Staff

- `GET /api/staff/tables`
- `PATCH /api/staff/tables/:id/status`
- `PATCH /api/staff/orders/:id/status`
- `GET /api/staff/transactions/daily`

### Admin

- `POST /api/admin/menu`
- `GET /api/admin/menu`
- `PUT /api/admin/menu/:id`
- `DELETE /api/admin/menu/:id`
- `POST /api/admin/staff`
- `GET /api/admin/staff`
- `PUT /api/admin/staff/:id`
- `DELETE /api/admin/staff/:id`
- `GET /api/admin/orders`
- `GET /api/admin/reports`
- `POST /api/admin/tables`
- `GET /api/admin/tables`

### Payments

- `POST /api/payments/order`
- `POST /api/payments/verify`

## Example Request Bodies

### Send OTP

```json
{
  "purpose": "registration",
  "channel": "email",
  "email": "customer@example.com"
}
```

### Register

```json
{
  "name": "Aarav",
  "email": "customer@example.com",
  "phone": "+919999999999",
  "password": "StrongPassword123"
}
```

### Place Order

```json
{
  "orderType": "dine-in",
  "tableId": "TABLE_OBJECT_ID",
  "notes": "Less spicy",
  "items": [
    {
      "menuItemId": "MENU_ITEM_OBJECT_ID",
      "quantity": 2
    }
  ]
}
```

### Book Table

```json
{
  "tableId": "TABLE_OBJECT_ID",
  "bookingDate": "2026-04-06T19:30:00.000Z",
  "guests": 4,
  "notes": "Birthday dinner"
}
```

### Create Razorpay Order

```json
{
  "orderId": "ORDER_OBJECT_ID"
}
```

## Notes

- OTP records expire automatically using MongoDB TTL indexes.
- Passwords are hashed with bcrypt before save.
- Add reverse proxy, rate limiting, and request validation middleware before public deployment.
