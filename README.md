# Rojan Cuisines — Full-Stack Food Community & Recipe CMS Pipeline

A high-performance, full-stack recipe directory and community application engineered natively on a decoupled ecosystem to handle complex data entry, user kitchens, and query indexing.

## 🛠️ Tech Stack
* **Frontend Core:** Vue.js & Vite Tooling
* **Styling Architecture:** Tailwind CSS Utility Classes
* **Backend Stack:** Node.js & Express.js REST API
* **Database Infrastructure:** MongoDB Document Model (Dynamic Array Schemas)
* **Session Security:** JWT Authentication & Custom Authorization Routers
* **Deployment Platform:** Vercel

## Key Features Built
* **Advanced Full-Stack Grid:** Built on an asynchronous decoupled pipeline utilizing Axios for seamless frontend visual state updates.
* **Dynamic Filtering & UI Contexts:** Features a complete global light/dark theme toggler, instant navigation category filters, and query search indexing.
* **Comprehensive Content Creation Engine:** Structured complex recipe data submission forms supporting multi-select tags, cooking/prep time inputs, difficulty scales, and live state resets.
* **Secure API Routing Panels:** Secured REST API endpoint layers equipped with token authentication guards to manage private user kitchens, custom recipe creation, and editing blocks safely.

## Secured Demo Testing Credentials
Reviewers can access the live recipe creation and community dashboard tools using the following sandbox profile data:
### Admin Account
| Field    | Value                  |
|----------|------------------------|
| Username | `admin`                |
| Email    | `admin@foodblog.dev`   |
| Password | `Admin@123`            |
| Role     | `admin`                |

> ⚠️ After registering, manually set `role: "admin"` in MongoDB Compass or Atlas:
> ```
> db.users.updateOne({ email: "admin@foodblog.dev" }, { $set: { role: "admin" } })
> ```

### Regular User Accounts
| Username     | Email                      | Password    |
|--------------|----------------------------|-------------|
| `chefmarco`  | `marco@foodblog.dev`       | `Chef@123`  |
| `bakerlisa`  | `lisa@foodblog.dev`        | `Baker@123` |
| `foodieken`  | `ken@foodblog.dev`         | `Foodie@123`|

## Installation & Local Setup
1. **Clone the repository layout:**
   ```bash
   git clone https://github.com
   cd Food-Blog-App
   ```
2. **Install all system assets:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. **Configure environment keys:**
   Set up your server-side `.env` configuration file:
   ```env
   PORT=8080
   MONGODB_URI="your_mongodb_connection_string"
   JWT_SECRET="your_secure_authentication_secret"
   ```
4. **Boot up the server and client concurrently:**
   ```bash
   # From the server workspace:
   npm start
   # From the client workspace:
   npm run dev
   ```
