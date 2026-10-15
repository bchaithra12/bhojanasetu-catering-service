# BhojanaSetu — Full-Stack Catering Service Management System

###### BhojanaSetu is a full-stack catering application built with React, Node.js, Express, and MongoDB. Customers can browse dishes, manage a cart, and place orders, while administrators manage dishes, orders, and user accounts.

## AI-Assisted Development

AI tools were used to assist with developing and documenting this project. BhojanaSetu itself does not use AI features at runtime; it is a React, Express, and MongoDB application.

## Project Overview

BhojanaSetu brings customer ordering and catering administration together in one web application. The frontend is built with React and communicates with a REST API built with Express. The backend uses MongoDB and Mongoose to store users, dishes, categories, and orders.

Customers can register, sign in, browse dishes by category, add items to a cart, place catering orders, and manage their profile. Administrators can maintain the dish menu, review customer orders, update order statuses, and manage user accounts.

## Key Features

### Customer Features

- Register and sign in
- Browse available dishes by category
- View dish descriptions, prices, serving details, and dietary information
- Add dishes to a cart and change quantities
- Submit catering orders with event and customer details
- View order status and order information
- View and update profile details and password

### Administrator Features

- Create, edit, and delete dishes
- Set dish category, price, availability, serving details, and dietary information
- Review active orders and completed order history
- Update order statuses
- View, edit, and delete user accounts
- Protect administrator pages and API operations with role-based authorization

### Order Workflow

Orders have a status that administrators can update as they are processed:

```text
Pending → Confirmed → Preparing → Ready → Delivered
                              ↘ Cancelled
```

The checkout payment flow is currently a demo. It does not charge a card or complete a real UPI payment.

## System Architecture

```text
React + Vite frontend
        │
        │ HTTP / JSON requests
        ▼
Node.js + Express REST API
        │
        │ Mongoose
        ▼
MongoDB database
```

The frontend uses React Router for page navigation and Axios for API requests. The backend separates routes, controllers, models, middleware, and configuration.

## Technology Stack

### Frontend

- React
- React Router
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- CORS

### Development and Deployment

- npm
- Git and GitHub
- Render
- MongoDB Atlas

## Data Storage

Application data is persisted in MongoDB. Mongoose models define users, dishes, categories, and orders. For local development, use a local MongoDB server or provide a MongoDB Atlas connection URI. The browser stores the signed-in session token for API authentication.

## Security

- Passwords are hashed before being stored.
- JWT authentication is used for signed-in API requests.
- Administrator-only operations are protected by role-based authorization.

## Project Structure

```text
catering-service/
├── backend/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── seed.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── render.yaml
├── package.json
└── README.md
```

`backend/` handles authentication, menu data, users, and orders. `frontend/` contains the customer and administrator user interfaces.

## Installation Guide

### Requirements

- Node.js `20.19+` or `22.12+`
- npm (installed with Node.js)
- Git for Windows
- A MongoDB database: either MongoDB Community Server installed locally or MongoDB Atlas in the cloud
- Visual Studio Code

### Step 1 — Clone the repository

```powershell
git clone https://github.com/bchaithra12/bhojanasetu-catering-service.git
```

### Step 2 — Install dependencies

Open the repository folder in Visual Studio Code, then select **Terminal → New Terminal**. Make sure the terminal is at the project root (the folder containing the top-level `package.json`). Install the dependencies for the root scripts, backend, and frontend:

```powershell
npm install
Set-Location backend
npm ci
Set-Location ..\frontend
npm ci
Set-Location ..
```

Run these commands again only if dependencies change or if you clone the project on another computer.

### Step 3 — Create a MongoDB database

**MongoDB Community Server (local computer only)**

1. Install MongoDB Community Server for Windows from the official link above. In the installer, keep the option to install/run MongoDB as a Windows service enabled.
2. Start the MongoDB service if it is not already running. MongoDB Compass can optionally connect to `mongodb://127.0.0.1:27017`.
3. Use the local URI shown in the environment file below. A local database is not reachable by Render; production still needs Atlas or another hosted MongoDB service.

MongoDB Compass is only a management interface. Installing Compass alone does not install or start the MongoDB server.

### Step 4 — Configure the backend

Create `backend/.env`:

The file should contain these settings (use your own secret and database URI):

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/catering-service
NODE_ENV=development
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

`backend/.env` is read by the backend.  The `JWT_SECRET` must be a long, random value; the included example value is only a placeholder.

### Step 5 — Start the application locally

Start MongoDB first if using a local server. From the project root, run:

```powershell
npm start
```

This starts both services. Open the frontend at `http://localhost:5173`. The API normally runs at `http://localhost:5000`; check it at `http://localhost:5000/api/health`. Keep the terminal open while using the app; press `Ctrl+C` to stop both services.

Alternatively, start the backend and frontend in separate terminals from the project root:

```powershell
npm run server
```

```powershell
npm run client
```

If the backend does not start, check its terminal output first. It must connect to MongoDB before it begins listening. Confirm that the MongoDB service is running (for a local database), or that the Atlas URI, database user, and Network Access settings are correct. If the frontend says it cannot reach the server, first confirm the API health URL responds, then verify that the frontend is using `http://localhost:5000/api` and that `FRONTEND_URL` is `http://localhost:5173`.

### First local admin account and menu data

1. Start the app and register an account through the local website.
2. Open the active database using Atlas **Browse Collections** or MongoDB Compass. Find the `users` collection and your account by email.
3. Change that account's `role` from `"user"` to `"admin"`.
4. Sign out and sign in again; the admin role is included in the new login token.
5. Use the Admin pages to create categories and dishes.

The database and collections are created automatically when the application writes its first records. The optional `backend/seed.js` script deletes every existing dish before inserting sample dishes. Only run it against a disposable development database; never run it against production.

### Step 6 — Lint and build

Run these commands from the project root:

```powershell
npm run lint
npm run build
```

## API Endpoints Overview

All routes below are prefixed with `/api`. Endpoints marked **Admin** require an authenticated administrator.

### Authentication and Profile — `/api/auth`

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/register` | Register an account |
| `POST` | `/login` | Sign in |
| `GET` | `/profile` | Get the signed-in user's profile |
| `PUT` | `/profile` | Update profile details |
| `PUT` | `/password` | Change password |

### Dishes — `/api/dishes`

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | List dishes |
| `GET` | `/available` | List available dishes |
| `GET` | `/category/:category` | List dishes in a category |
| `GET` | `/:id` | Get a dish |
| `POST` | `/` | Create a dish (**Admin**) |
| `PUT` | `/:id` | Update a dish (**Admin**) |
| `DELETE` | `/:id` | Delete a dish (**Admin**) |

### Categories — `/api/categories`

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | List categories |
| `GET` | `/active` | List active categories |
| `GET` | `/:id` | Get a category |
| `POST` | `/` | Create a category (**Admin**) |
| `PUT` | `/:id` | Update a category (**Admin**) |
| `DELETE` | `/:id` | Delete a category (**Admin**) |

### Orders — `/api/orders`

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/` | Place an order |
| `GET` | `/email/:email` | Get orders by email |
| `GET` | `/:id` | Get an order |
| `PATCH` | `/:id/cancel` | Cancel an order |
| `GET` | `/` | List all orders (**Admin**) |
| `PATCH` | `/:id/status` | Update order status (**Admin**) |

### Users — `/api/users` (**Admin**)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | List users |
| `GET` | `/:id` | Get a user |
| `PUT` | `/:id` | Update a user |
| `DELETE` | `/:id` | Delete a user |


## Current Limitations

- Checkout is a demo payment flow; it does not charge a card or complete a real UPI payment.
- Orders are stored in MongoDB, but the app does not send SMS or email notifications.
- Production use requires an operational and security review, reliable backups, and a real payment provider if payments are needed.

## Future Improvements

Potential next steps for the project include:

- Integrate a real payment provider
- Add customer-facing order history and tracking
- Add email or SMS order notifications
- Add automated tests and operational monitoring
- Configure production database backups and recovery procedures

## Project Category

- Full-stack web application
- Catering and food-order management
- Portfolio and learning project

## License

This project is developed for learning and portfolio demonstration purposes.

## Live Demo

Try BhojanaSetu: https://bhojanasetu-web-y8yv.onrender.com/

### Availability

The application is hosted on Render’s free plan, so it may not be available instantly at all times. The free backend can spin down after inactivity and take about a minute to wake when someone visits. Free-plan usage limits and availability can also change. This portfolio demo does not guarantee uninterrupted uptime.
