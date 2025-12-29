# Talent Tracker

A professional talent tracking system for athletes, coaches, and federations.

## 🚀 Getting Started

### 1. Requirements
- **Node.js**: (v14 or higher)
- **MySQL**: A running MySQL database.

### 2. Local Setup
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd talenttrackeupdate
   ```

2. **Install dependencies**:
   Run this in the root folder:
   ```bash
   npm run install-all
   ```

3. **Configure the project**:
   - Create a `.env` file in the root folder (or copy `.env.example`).
   - Fill in your database credentials:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=talent_tracker
     JWT_SECRET=any_random_string
     ```

4. **Initialize the Database**:
   - Create a database named `talent_tracker` in your MySQL server.
   - Run the schema provided in `backend/schema.sql` or use the initialization script:
     ```bash
     cd backend
     node init-db.js
     ```

5. **Start the application**:
   From the root folder:
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deployment Instructions

### 1. GitHub
- Push this code to a new GitHub repository.
- Ensure `.env` is NOT uploaded (it's already in `.gitignore`).

### 2. Database (Production)
- Use a hosted MySQL provider (like Aiven, Railway, or PlanetScale).
- Set up the tables using `backend/schema.sql`.

### 3. Deploying to Render/Railway/Heroku
- Connect your GitHub repository to the hosting service.
- **Root Directory**: Leave as root or set to `./`.
- **Build Command**: `npm run install-all`
- **Start Command**: `npm start`
- **Environment Variables**: Add all variables from your `.env` file (DB_HOST, DB_USER, etc.) in the hosting service's dashboard.

## 🛠 Features
- **Role-based Auth**: Athlete, Coach, and Federation dashboards.
- **Event Management**: Create, view, and register for sporting events.
- **Squad Management**: Coaches can organize athletes into squads.
- **Document Uploads**: Secure file uploads for athlete/coach verification.

---
*Created with ❤️ by the Talent Tracker Team*
