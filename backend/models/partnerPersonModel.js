const db = require("../db/db");
const Sequelize = require("sequelize");
const Company = require("./companyModel");

const PartnerPerson = db.define(
  "partner_persons",
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
    cnp: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING, allowNull: true },
    id_series: { type: Sequelize.STRING, allowNull: true },
    id_number: { type: Sequelize.STRING, allowNull: true },
    iban: { type: Sequelize.STRING, allowNull: true },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    timestamps: true,
    doNotSync: true,
  }
);

module.exports = PartnerPerson;
