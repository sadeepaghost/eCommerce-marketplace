# E-Commerce Marketplace Demo

A full-stack marketplace demo built with React, Express, and MongoDB. It includes user authentication, products, carts, checkout, orders, profiles, addresses, reviews, wishlists, categories, image uploads, payments, coupons, and basic admin reporting.

> This project is intended as a learning project and functional demo. It is not production-ready. Review the [Known limitations](#known-limitations) section before deploying it or processing real customer data.

## Features

### Customer-facing demo

- User registration and login
- JWT-based authentication
- Product catalogue and product details
- Stock-aware cart management
- Delivery address form
- Cash-on-delivery demo checkout
- Order history
- Editable user profile
- Responsive layout and toast notifications

### Backend modules

- Product search, filtering, sorting, and pagination
- Categories
- Reviews
- Wishlists
- Coupons
- Cloudinary image uploads
- Stripe PaymentIntent creation
- Admin user, product, order, and statistics endpoints
- Password reset token generation

## Technology stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit and React Redux
- Axios
- React Hook Form
- React Hot Toast
- Tailwind CSS

### Backend

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Tokens
- bcryptjs
- Helmet, CORS, and Morgan
- Cloudinary and Multer
- Stripe
- Nodemailer
- Redis configuration through ioredis

## Project structure

```text
ecommerce-marketpalce/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB, Cloudinary, Redis, and Stripe
│   │   ├── middlewares/     # Authentication, admin, and uploads
│   │   ├── modules/         # Feature-based routes, controllers, and models
│   │   ├── utils/           # JWT and email utilities
│   │   ├── app.js           # Express application and route registration
│   │   └── server.js        # Environment, database, and server startup
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/             # Public API client
│   │   ├── app/             # Redux store
│   │   ├── components/      # Shared UI components
│   │   ├── features/        # Authentication state and route protection
│   │   ├── layouts/         # Shared page layout
│   │   ├── pages/           # Routed pages
│   │   ├── routes/          # React Router configuration
│   │   └── services/        # API service functions
│   └── package.json
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 20 or newer
- npm
- MongoDB locally or a MongoDB Atlas database
- Optional Cloudinary, Stripe, Redis, and Gmail credentials for their related modules

## Environment variables

Never commit real credentials. The repository ignores `.env` files.

### Backend

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_marketplace
JWT_SECRET=replace_with_a_long_random_secret

# Optional integrations
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
EMAIL_USER=
EMAIL_PASS=
```

Port `5001` is used here because Windows may reserve port `5000`. You can use another free port, but the frontend URL must match it.

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

Restart Vite whenever this file changes.

## Installation and startup

### 1. Install backend dependencies

```powershell
cd D:\ecommerce-marketpalce\backend
npm install
```

### 2. Start the backend

Development mode with automatic restart:

```powershell
npm run dev
```

Normal mode:

```powershell
npm start
```

The terminal should show a MongoDB connection followed by:

```text
Server running on port 5001
```

Check the API:

```http
GET http://localhost:5001/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

### 3. Install frontend dependencies

Open a second terminal:

```powershell
cd D:\ecommerce-marketpalce\frontend
npm install
```

### 4. Start the frontend

```powershell
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Available scripts

### Backend

| Command | Purpose |
|---|---|
| `npm run dev` | Run the API with Nodemon |
| `npm start` | Run the API with Node.js |
| `npm run check` | Check the main backend files for syntax errors |

### Frontend

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Authentication

Protected routes require a JWT bearer token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

In Postman, choose **Authorization → Bearer Token** and paste only the token value.

### Register

```http
POST http://localhost:5001/api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "password123"
}
```

### Login

```http
POST http://localhost:5001/api/auth/login
Content-Type: application/json
```

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

Registration and login do not require an Authorization header. Successful responses contain the user and JWT token.

## API overview

| Module | Base URL | Main operations | Access |
|---|---|---|---|
| Authentication | `/api/auth` | Register, login, reset password | Public |
| Products | `/api/products` | List, create, update, delete, stock | Mixed |
| Cart | `/api/carts` | Add, list, update, remove | Authenticated |
| Orders | `/api/orders` | Create, list personal orders, update status | Authenticated |
| Addresses | `/api/address` | Create, list, update, delete | Authenticated |
| Users | `/api/users` | Profile and password operations | Authenticated |
| Categories | `/api/categories` | Category CRUD | Mixed |
| Reviews | `/api/reviews` | Review CRUD and product reviews | Mixed |
| Wishlist | `/api/wishlist` | Add, list, remove | Authenticated |
| Coupons | `/api/coupons` | Apply coupon | Authenticated |
| Uploads | `/api/upload` | Upload an image to Cloudinary | Authenticated |
| Payments | `/api/payments` | Create Stripe PaymentIntent | Authenticated |
| Admin | `/api/admin` | Users, products, orders, statistics | Admin |

### Product queries

The product-list endpoint supports pagination, search, filtering, and sorting:

```http
GET /api/products?page=1&limit=10&keyword=phone&category=Electronics&sort=-price
```

Supported sort values:

- `price` — lowest price first
- `-price` — highest price first
- `latest` — newest products first

## Main application flow

1. A user registers or logs in.
2. The frontend stores the returned token and user in local storage and Redux.
3. Axios attaches the token to protected API requests.
4. The user browses products and adds products to the cart.
5. The cart validates requested quantities against product stock.
6. Checkout creates a delivery address and then creates an order from the cart.
7. The backend calculates the order total, reduces stock, and clears the cart.
8. The order appears on the user's order-history page.

## Admin access

Normal registrations receive the `user` role. Admin endpoints require:

```json
{
  "role": "admin"
}
```

For local testing, update the user document through MongoDB Compass and log in again. Do not create a public endpoint that allows users to assign themselves the admin role.

## Verification

Run these commands before sharing changes:

```powershell
cd D:\ecommerce-marketpalce\frontend
npm run lint
npm run build
```

```powershell
cd D:\ecommerce-marketpalce\backend
npm run check
```

## Known limitations

This is a demo and currently has important limitations:

- No admin or vendor frontend
- No wishlist, review, category, coupon, or product-management frontend
- Stripe PaymentIntent exists, but there is no frontend payment form or webhook
- Checkout is currently a cash-on-delivery demonstration
- Orders do not store a permanent delivery-address or product-price snapshot
- Product and category mutation routes need stronger admin/vendor authorization
- Order status, payment, review, wishlist, and payment routes need ownership checks
- Order creation does not use a MongoDB transaction
- Password-reset email sending and frontend reset pages are incomplete
- Coupons are not connected to checkout and have no creation endpoint
- Review totals do not update product rating fields
- Uploaded files have no type or size validation
- JWT tokens are stored in local storage
- CORS is open and rate limiting is not configured
- There are no automated tests
- The code contains a duplicate user model, duplicate product stock definition, and redundant frontend API clients

Do not use the application for real payments or customer information until these issues are fixed and independently reviewed.

## License

The backend package currently declares the ISC license. Add a root `LICENSE` file if the project will be distributed publicly.
