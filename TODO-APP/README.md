# ToDo App (Node.js + Express + MongoDB + jQuery)

A simple full-stack ToDo application with:

- Node.js + Express
- MongoDB Atlas + Mongoose
- User registration and login with **bcrypt-hashed passwords**
- Session-based authentication using **express-session** and **connect-mongo**
- Todos linked to the logged-in user
- jQuery frontend with AJAX calls to the backend API

---

## Features

- Register with email + password
- Login / Logout
- Session stored in MongoDB (via `connect-mongo`)
- Add / view / toggle / delete todos
- Each user sees **only their own** todos

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas, Mongoose
- **Auth:** express-session, connect-mongo, bcrypt
- **Frontend:** HTML, CSS, jQuery (AJAX)

---

## Setup

### 1. Clone the project

```bash
git clone <your-repo-url>
cd TODO-APP
