const db = require("../db/db");
const Sequelize = require("sequelize");
const Company = require("./companyModel");

const Flota = db.define(
  "flota",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    car_plate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tip: { type: Sequelize.STRING, allowNull: false },
    company_id: {
      type: Sequelize.STRING,
      references: {
        model: Company,
        key: "id",
      },
    },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    timestamps: true,
    doNotSync: true,
  }
);

module.exports = Flota;
