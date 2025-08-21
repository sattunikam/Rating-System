const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Associations
User.hasMany(Rating, { foreignKey: "UserId" });
Rating.belongsTo(User, { foreignKey: "UserId" });

Store.hasMany(Rating, { foreignKey: "StoreId" });
Rating.belongsTo(Store, { foreignKey: "StoreId" });

User.hasMany(Store, { foreignKey: "ownerId" });
Store.belongsTo(User, {foreignKey: "ownerId" });

module.exports = { User, Store, Rating };
