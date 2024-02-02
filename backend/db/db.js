const Sequelize = require("sequelize");

const seq = new Sequelize(
  "management",
  "root",
  "licenta",
  {
    host: "192.168.1.225",
    port: "3306",
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      // socketPath: "/var/run/mysqld/mysqld.sock",
      multipleStatements: true,
    },
    pool: {
      max: 10,
      min: 0,
      idle: 20000,
      acquire: 20000,
    },
  }
);

module.exports = seq;
