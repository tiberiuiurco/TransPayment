const db = require("../db/db");
const Sequelize = require("sequelize");
const Company = require("./companyModel");

const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: { type: Sequelize.STRING },
    last_name: { type: Sequelize.STRING },
    cnp: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    username: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    company_id: {
      type: Sequelize.STRING,
      references: {
        model: Company,
        key: "id",
      },
    },
		role: {
      type: Sequelize.STRING,
		}
  },
  {
    timestamps: false,
    doNotSync: true,
  }
);

module.exports = User;
