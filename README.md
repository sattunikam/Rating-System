# Rating System 🌟
A **full-stack web application** for rating stores. It supports **role-based access** with `ADMIN`, `OWNER`, and `USER`.  
Admins can manage users and stores, owners can see ratings for their stores, and users can submit ratings.

## 🔧 Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL (Sequelize ORM)  
- **Authentication:** JWT  
- **Password Security:** bcrypt  

---

## 🚀 Features

- Role-based authentication (`ADMIN`, `OWNER`, `USER`)  
- Admin dashboard: view stats, users, stores, ratings  
- Owner dashboard: manage own stores and view ratings  
- Users can rate stores (1 to 5 stars)  
- Password update for owners  
- Responsive UI using Tailwind CSS  

---

## 📂 Project Structure
rating-system/
├─ backend/
│ ├─ models/
│ ├─ routes/
│ ├─ config/
│ ├─ server.js
│ └─ package.json
├─ frontend/
│ ├─ src/
│ ├─ public/
│ └─ package.json
├─ .gitignore
└─ README.md

---

## ⚡ Screenshots

### Admin Dashboard
![Admin Dashboard](./screenshots/admin_dashboard.png)

### Owner Dashboard
![Owner Dashboard](./screenshots/owner_dashboard.png)

### User Rating Page
![User Rating](./screenshots/user_rating.png)


---

## 🏃‍♂️ Setup & Run
### 1️⃣ Clone Repository
```bash

git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>

Backend Setup
cd backend
npm install

Create a .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=rating_system
JWT_SECRET=your_jwt_secret
PORT=3000

Start backend:
npm start

Frontend Setup
cd ../frontend
npm install
npm run dev

Access frontend at http://localhost:5173
📡 API Endpoints
Auth
POST /auth/login → Login user and get JWT

Admin
GET /admin/stats → Total users, stores, ratings

GET /admin/users → List users with avg rating
POST /admin/users → Create new user
GET /admin/stores → List stores with avg rating
POST /admin/stores → Create new store

Owner
GET /owner/dashboard → Owner stores with ratings
PUT /owner/update-password → Update owner password

User
POST /store/:storeId/rate → Rate a store

🔑 Packages Used

React → Frontend SPA
Tailwind CSS → Styling
Express.js → Backend API
Sequelize → MySQL ORM
bcrypt → Password hashing
jsonwebtoken (JWT) → Authentication
