const db = require("../db/db");
const Sequelize = require("sequelize");
const Company = require("./companyModel");

const PartnerCompany = db.define(
  "partner_companies",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    company_id: {
      type: Sequelize.STRING,
      references: {
        model: Company,
        key: "id",
      },
    },
    name: { type: Sequelize.STRING, allowNull: false },
    cui: { type: Sequelize.STRING, allowNull: false },
    rc: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
    address_secondary: { type: Sequelize.STRING, allowNull: true },
    email: { type: Sequelize.STRING, allowNull: true },
    phone: { type: Sequelize.STRING, allowNull: true },
    iban: { type: Sequelize.STRING, allowNull: true },
    bank_name: { type: Sequelize.STRING, allowNull: true },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    timestamps: true,
    doNotSync: true,
  }
);

module.exports = PartnerCompany;
