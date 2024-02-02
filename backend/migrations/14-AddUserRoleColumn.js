"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn("users", "role", {
        type: Sequelize.INTEGER,
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn("users", "role");
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
