const db = require("../db/db");
const Sequelize = require("sequelize");
const Company = require("./companyModel");

const Resource = db.define(
  "resource",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cnp: {
      type: Sequelize.STRING,
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
    address: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING, allowNull: false },
    id_series: { type: Sequelize.STRING, allowNull: false },
    id_number: { type: Sequelize.STRING, allowNull: false },
    employment_date: { type: Sequelize.DATE, allowNull: false },
    contract_number: { type: Sequelize.STRING, allowNull: false },
    isDriver: { type: Sequelize.BOOLEAN, allowNull: false },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    timestamps: true,
    doNotSync: true,
  }
);

module.exports = Resource;
