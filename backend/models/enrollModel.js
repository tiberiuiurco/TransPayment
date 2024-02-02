const db = require("../db/db");
const Sequelize = require("sequelize");
const Company = require("./companyModel");
const User = require("./userModel");

const Enroll = db.define(
  "enroll",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.STRING,
      references: {
        model: User,
        key: "id",
      },
    },
    company_id: {
      type: Sequelize.STRING,
      references: {
        model: Company,
        key: "id",
      },
    },
    description: { type: Sequelize.STRING, allowNull: true },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
  },
  {
    timestamps: false,
    doNotSync: true,
  }
);

module.exports = Enroll;
