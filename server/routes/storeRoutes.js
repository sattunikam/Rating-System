// routes/storeRoutes.js
const express = require("express");
const router = express.Router();
const { Store, Rating } = require("../models");
const { Sequelize, Op } = require("sequelize");
const verifyUser = require("../middleware/auth");

// Add Store (ADMIN/OWNER)
router.post("/", verifyUser, async (req, res, next) => {
  try {
    // Only ADMIN or OWNER can add
    if (req.user.role === "USER") 
      return res.status(403).json({ message: "Only ADMIN/OWNER can add store" });

    const { name, address } = req.body;

    // Validate request
    if (!name || !address)
      return res.status(400).json({ message: "Name and address are required" });

    // Check if store already exists
    const exist = await Store.findOne({ where: { name } });
    if (exist) return res.status(400).json({ message: "Store already exists" });

    // Assign ownerId if OWNER is creating
    const payload = { name, address };
    if (req.user.role === "OWNER") payload.ownerId = req.user.id;

    const store = await Store.create(payload);

    res.status(201).json({ message: "Store created successfully", store });
  } catch (err) {
    console.error("Error creating store:", err.message);
    next(err);
  }
});

router.get("/", verifyUser, async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 10, sortBy = "name", order = "ASC" } = req.query;
    const offset = (page - 1) * limit;

    // Fetch stores matching search
    const stores = await Store.findAll({
      where: search
        ? { [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { address: { [Op.like]: `%${search}%` } }] }
        : {},
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const storeIds = stores.map(s => s.id);
    if (!storeIds.length) return res.json([]);

    // Fetch avg ratings
    const avgRatings = await Rating.findAll({
      attributes: [
        "StoreId",
        [Sequelize.fn("AVG", Sequelize.col("value")), "avgRating"]
      ],
      where: { StoreId: storeIds },
      group: ["StoreId"]
    });

    // Fetch current user's ratings
    const userRatings = await Rating.findAll({
      where: { StoreId: storeIds, UserId: req.user.id }
    });

    //Merge data
    const result = stores.map(store => {
      const avgRow = avgRatings.find(a => a.StoreId === store.id);
      const userRow = userRatings.find(u => u.StoreId === store.id);
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        avgRating: avgRow ? parseFloat(avgRow.get("avgRating")).toFixed(2) : 0,
        userRating: userRow ? userRow.value : null
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});



// update rating-
router.post("/:storeId/rate", verifyUser, async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { value } = req.body;

    if (!value || value < 1 || value > 5) return res.status(400).json({ message: "Rating must be 1-5" });

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Check if user already rated
    let rating = await Rating.findOne({ where: { StoreId: storeId, UserId: req.user.id } });
    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = await Rating.create({ StoreId: storeId, UserId: req.user.id, value });
    }

    res.json({ message: "Rating submitted", rating });
  } catch (err) {
    next(err);
  }
});

// Update store (Owner only for his own store)
router.put("/:storeId", verifyUser, async (req, res, next) => {
  try {
    if (req.user.role !== "OWNER") return res.status(403).json({ message: "Forbidden" });

    const store = await Store.findOne({ where: { id: req.params.storeId, ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const { name, address } = req.body;
    if (name) store.name = name;
    if (address) store.address = address;

    await store.save();
    res.json({ message: "Store updated", store });
  } catch (err) { next(err); }
});

module.exports = router;
