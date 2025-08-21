const { User } = require("./models") 
const bcrypt = require("bcrypt");

(async () => {
  const hash = await bcrypt.hash("admin123", 10);  
  const admin = await User.create({
    name: "admin",
    email: "admin@example.com",
    password: hash,
    address: "Mumbai",
    role: "ADMIN"
  });
  console.log("Admin created:", admin.email);
  process.exit(0);
})();
