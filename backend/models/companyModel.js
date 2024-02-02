const db = require("../db/db");
const Sequelize = require("sequelize");

const Company = db.define(
  "company",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cui: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    rc: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING, allowNull: false },
    iban: { type: Sequelize.STRING, allowNull: false },
    bank_name: { type: Sequelize.STRING, allowNull: false },
    serie_factura: { type: Sequelize.STRING, allowNull: false },
    nr_factura: { type: Sequelize.INTEGER, allowNull: false },
    serie_chitanta: { type: Sequelize.STRING, allowNull: false },
    nr_chitanta: { type: Sequelize.INTEGER, allowNull: false },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    timestamps: true,
    doNotSync: true,
  }
);

module.exports = Company;
