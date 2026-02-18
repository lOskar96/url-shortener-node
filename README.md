# 🔗 Shurty – URL Shortener API

Shurty API is the backend service powering the Shurty URL shortener application.

It provides authentication, URL management, redirection logic, and click tracking through a RESTful API built with Node.js and TypeScript.

The project follows a modular, production-oriented structure with clear separation of concerns.

---

## 🚀 Features

- 🔐 JWT-based authentication
- 🔗 Create shortened URLs
- ✏️ Edit URLs
- 🗑 Delete URLs
- 📊 Click tracking
- 🔁 Public redirection endpoint
- 🧠 Centralized error handling
- 📦 Modular architecture

---

## 🏗 Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **JWT Authentication**
- **MongoDB**
- **Railway (Deployment)**

---

## 📂 Project Structure

```
src/
 ├── controllers/
 ├── services/
 ├── routes/
 ├── middleware/
 ├── config/
 ├── utils/
 └── app.ts
```

Architecture layers:

- **Routes** → HTTP layer
- **Controllers** → Request handling
- **Services** → Business logic
- **Middleware** → Authentication & request validation
- **Config** → Environment & app configuration

---

## ⚙️ Environment Variables

Create a `.env` file:

```
PORT=3000
DATABASE_URL=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🛠 Installation

```bash
# Clone repository
git clone https://github.com/lOskar96/shurty-api.git

# Enter project
cd shurty
```
