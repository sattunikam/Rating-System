const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 20] }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 150] }
  },
  role: { type: DataTypes.ENUM("USER","ADMIN","OWNER"), defaultValue: "USER" }
});

module.exports = User;
