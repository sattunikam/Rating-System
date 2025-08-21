// routes/ratingRoutes.js
const express = require("express");
const router = express.Router();
const { Rating } = require("../models");
const verifyUser = require("../middleware/auth");

// Submit rating (USER only)
router.post("/:storeId/rate", verifyUser, async (req, res, next) => {
  try {
    if (req.user.role !== "USER") return res.status(403).json({ message: "Only USERS can rate" });

    const { value } = req.body;
    const storeId = req.params.storeId;

    if (value < 1 || value > 5) return res.status(400).json({ message: "Rating must be 1-5" });

    const exist = await Rating.findOne({ where: { UserId: req.user.id, StoreId: storeId } });
    if (exist) return res.status(400).json({ message: "Already rated; use update" });

    const rating = await Rating.create({ value, UserId: req.user.id, StoreId: storeId });
    res.status(201).json({ message: "Rating submitted", rating });
  } catch (err) { next(err); }
});

// Update rating (USER only)
router.put("/:storeId/rate", verifyUser, async (req, res, next) => {
  try {
    if (req.user.role !== "USER") return res.status(403).json({ message: "Only USERS can rate" });

    const { value } = req.body;
    const storeId = req.params.storeId;
    if (value < 1 || value > 5) return res.status(400).json({ message: "Rating must be 1-5" });

    const rating = await Rating.findOne({ where: { UserId: req.user.id, StoreId: storeId } });
    if (!rating) return res.status(404).json({ message: "Rating not found" });

    rating.value = value;
    await rating.save();
    res.json({ message: "Rating updated", rating });
  } catch (err) { next(err); }
});

module.exports = router;
