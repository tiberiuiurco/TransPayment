let data = [
  {
    id: 1,
    name: "Admin",
    removed: false,
  },
  {
    id: 2,
    name: "CEO",
    removed: false,
  },
  {
    id: 3,
    name: "Employee",
    removed: false,
  },
];
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert("roles", data, {});
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete("roles", null, {});

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
