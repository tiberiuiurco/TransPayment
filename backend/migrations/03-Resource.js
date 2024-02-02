"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable("resources", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      cnp: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "companies",
          },
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_series: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      employment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      contract_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isDriver: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      removed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
