const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Op, Sequelize } = require("sequelize");
const { User, Store, Rating } = require("../models");
const verifyUser = require("../middleware/auth");

//Admin guard
const mustBeAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });
  next();
};

// Dashboard stats 
router.get("/stats", verifyUser, mustBeAdmin, async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count()
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// List users 
router.get("/users", verifyUser, mustBeAdmin, async (req, res) => {
  try {
    const { search = "" } = req.query;
    const where = search ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
        { role: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "address", "role"]
    });

   
    // Fetch ratings given by users
    const usersWithRating = await Promise.all(users.map(async (u) => {
      if (u.role === "OWNER") {
      
        const stores = await Store.findAll({ where: { ownerId: u.id }, include: [Rating] });
        const ratings = stores.flatMap(s => s.Ratings.map(r => r.value));
        const avgRating = ratings.length ? ratings.reduce((a,b)=>a+b,0)/ratings.length : 0;
        return { ...u.toJSON(), rating: avgRating };
      } else {
        // USER: average rating they gave
        const ratings = await Rating.findAll({ where: { userId: u.id } });
        const avgRating = ratings.length ? ratings.reduce((a,b)=>a+b.value,0)/ratings.length : 0;
        return { ...u.toJSON(), rating: avgRating };
      }
    }));

    res.json(usersWithRating);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

//List stores
router.get("/stores", verifyUser, mustBeAdmin, async (req, res) => {
  try {
    const { search = "" } = req.query;
    const where = search ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const stores = await Store.findAll({
      attributes: [
        "id", "name", "email", "address", "ownerId",
        [Sequelize.fn("AVG", Sequelize.col("Ratings.value")), "avgRating"]
      ],
      include: [{ model: Rating, attributes: [] }, { model: User, as: "Owner", attributes: ["email"] }],
      where,
      group: ["Store.id", "Owner.id"]
    });

    const result = stores.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      ownerEmail: s.Owner ? s.Owner.email : null,
      avgRating: parseFloat(s.get("avgRating")) || 0
    }));

    res.json(result);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

//Create user
router.post("/users", verifyUser, mustBeAdmin, async (req, res) => {
  try {
    const { name, email, password, address, role = "USER" } = req.body;
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, address, role });

    res.status(201).json({ message: "User created", user: { id: user.id, name, email, address, role } });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

//Create store
router.post("/stores", verifyUser, mustBeAdmin, async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const exist = await Store.findOne({ where: { email } });
    if (exist) return res.status(400).json({ message: "Store already exists" });

    const store = await Store.create({ name, email, address });
    res.status(201).json({ message: "Store created", store });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
