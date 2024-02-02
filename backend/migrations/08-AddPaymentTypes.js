let data = [
  {
    id: 1,
    name: "Ordin de Plata",
    removed: false,
  },
  {
    id: 2,
    name: "Cash",
    removed: false,
  },
  {
    id: 3,
    name: "Instrument de plata",
    removed: false,
  },
];
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert("payment_types", data, {});
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete("payment_types", null, {});

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
