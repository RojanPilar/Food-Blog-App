# 🍳 Food Blog API — Session 87 Backend

A RESTful Node.js + Express + MongoDB API for the MEVN Food Blog platform.

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB (local) or a MongoDB Atlas account

---

## Setup Instructions

### 1. Navigate to the server directory

```bash
cd s87-s89/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `server/` root (a template is included):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/foodblog_db
JWT_SECRET=foodblog_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
```

> For MongoDB Atlas, replace `MONGO_URI` with your connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/foodblog_db`

### 4. Start the development server

```bash
npm run dev     # with nodemon (auto-reload)
# or
npm start       # without nodemon
```

Server runs at: **http://localhost:5000**

---

## Mock Credentials

Seed these users manually via the `/api/auth/register` endpoint or a seeder script.

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

---

## API Endpoints

### Authentication

| Method | Endpoint             | Access   | Description           |
|--------|----------------------|----------|-----------------------|
| POST   | `/api/auth/register` | Public   | Register a new user   |
| POST   | `/api/auth/login`    | Public   | Login and get JWT     |
| GET    | `/api/auth/me`       | Private  | Get current user info |
| PUT    | `/api/auth/me`       | Private  | Update user profile   |

### Posts

| Method | Endpoint              | Access          | Description                     |
|--------|-----------------------|-----------------|---------------------------------|
| GET    | `/api/posts`          | Public          | Get all posts (with filters)    |
| GET    | `/api/posts/:id`      | Public          | Get a single post               |
| GET    | `/api/posts/my-posts` | Private         | Get logged-in user's posts      |
| POST   | `/api/posts`          | Private         | Create a new post               |
| PUT    | `/api/posts/:id`      | Private (Owner) | Update a post                   |
| DELETE | `/api/posts/:id`      | Private (Owner / Admin) | Delete a post         |

### Comments

| Method | Endpoint                                   | Access          | Description         |
|--------|--------------------------------------------|-----------------|---------------------|
| POST   | `/api/posts/:postId/comments`              | Private         | Add a comment       |
| DELETE | `/api/posts/:postId/comments/:commentId`   | Private (Owner / Admin) | Delete a comment |

---

## Query Parameters for `GET /api/posts`

| Param        | Type   | Example              | Description                    |
|--------------|--------|----------------------|--------------------------------|
| `tag`        | string | `?tag=Vegan`         | Filter by culinary tag         |
| `difficulty` | string | `?difficulty=Beginner` | Filter by difficulty level   |
| `search`     | string | `?search=pasta`      | Full-text search on title/excerpt |
| `page`       | number | `?page=2`            | Pagination (default: 1)        |
| `limit`      | number | `?limit=5`           | Items per page (default: 10)   |

---

## Request/Response Format

### Register — POST `/api/auth/register`

**Request body:**
```json
{
  "username": "chefmarco",
  "email": "marco@foodblog.dev",
  "password": "Chef@123",
  "bio": "Italian home cook from Naples."
}
```

**Success response:**
```json
{
  "success": true,
  "token": "<jwt_token>",
  "data": {
    "user": {
      "_id": "...",
      "username": "chefmarco",
      "email": "marco@foodblog.dev",
      "role": "user"
    }
  }
}
```

### Create Post — POST `/api/posts`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request body:**
```json
{
  "title": "Classic Neapolitan Pizza Margherita",
  "content": "Step 1: Make the dough...\nStep 2: Prepare the sauce...",
  "coverImage": "https://images.unsplash.com/photo-...",
  "cookingTime": 90,
  "prepTime": 30,
  "servings": 4,
  "difficulty": "Intermediate",
  "tags": ["Italian", "Baking"],
  "cuisine": "Italian",
  "ingredients": ["00 flour", "San Marzano tomatoes", "Fresh mozzarella", "Basil"]
}
```

---

## Error Response Format

All errors follow the same uniform structure:

```json
{
  "success": false,
  "message": "Description of what went wrong."
}
```

---

## Project Structure

```
server/
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── authController.js       # Register, login, profile
│   ├── postController.js       # Full CRUD for posts
│   └── commentController.js    # Add/delete comments
├── middleware/
│   └── authMiddleware.js       # JWT protect, adminOnly, optionalAuth
├── models/
│   ├── User.js                 # User schema with bcrypt
│   └── Post.js                 # Post schema + embedded comments
├── routes/
│   ├── auth.routes.js
│   ├── post.routes.js
│   └── comment.routes.js
├── .env                        # Environment variables (not committed)
├── package.json
├── README.md
└── server.js                   # App entry point
```
