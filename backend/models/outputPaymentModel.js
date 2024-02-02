const db = require("../db/db");
const Sequelize = require("sequelize");
const Company = require("./companyModel");

const OutputPayment = db.define(
  "output_payment",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_date: { type: Sequelize.DATE, allowNull: false },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    company_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Company,
        key: "id",
      },
    },
    series_number: { type: Sequelize.STRING, allowNull: false },
    total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    vat_value: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    timestamps: true,
    doNotSync: true,
  }
);

module.exports = OutputPayment;
