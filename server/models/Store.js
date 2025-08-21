const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Store = sequelize.define("Store", {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  address: { type: DataTypes.STRING, allowNull: false },
  ownerId: { type: DataTypes.INTEGER },
  email: { type: DataTypes.STRING, allowNull: true, unique: true }
});

module.exports = Store;
