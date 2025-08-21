// server.js
const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
const cors = require("cors")

const app = express();
const port = 3000;

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                 
}))
app.use(express.json());
app.use(cookieParser());

// ---- Routes ----
// auth
app.use("/api", require("./routes/authRoutes"));      // so /api/login, /api/signup, /api/me, etc.
// stores 
app.use("/api/stores", require("./routes/storeRoutes"));
// ratings
app.use("/api", require("./routes/ratingRoutes"));    // /api/:storeId/rate (POST/PUT)
// admin
app.use("/api/admin", require("./routes/adminRoutes"));

// error middleware 
app.use(errorHandler);

// owner dashboard 
app.use("/api/owner", require("./routes/ownerRoutes"));

// DB & start
sequelize.sync().then(() => {
  console.log("DB synced");
  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => console.error("DB connection failed", err));
