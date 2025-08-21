// routes/owner.js
const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const verifyUser = require("../middleware/auth");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

//  Owner stores & ratings
router.get("/dashboard", verifyUser, async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Fetch stores owned by this owner
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      attributes: [
        "id",
        "name",
        "email",
        "address",
        [Sequelize.fn("AVG", Sequelize.col("Ratings.value")), "avgRating"]
      ],
      include: [
        { model: Rating, attributes: ["value", "userId"] },
        { model: User, as: "Raters", attributes: ["id", "name", "email"], through: { attributes: [] } }
      ],
      group: ["Store.id", "Raters.id"]
    });

    const result = stores.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      avgRating: s.get("avgRating") ? parseFloat(s.get("avgRating")) : 0,
      raters: s.Ratings.map(r => ({ userId: r.userId, value: r.value }))
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/update-password", verifyUser, async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const user = await User.findByPk(req.user.id);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
