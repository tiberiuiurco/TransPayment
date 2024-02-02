const db = require("../db/db");
const Sequelize = require("sequelize");

const Role = db.define(
  "roles",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
  },
  {
    timestamps: false,
    doNotSync: true,
  }
);

module.exports = Role;
