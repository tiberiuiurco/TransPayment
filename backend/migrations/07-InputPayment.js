"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable("input_payments", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      series: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receipt_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      payment_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "payment_types",
          },
          key: "id",
        },
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
      partner_company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "partner_companies",
          },
          key: "id",
        },
      },
      partner_person_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "partner_persons",
          },
          key: "id",
        },
      },
      isPartnerCompany: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      delegate_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "resources",
          },
          key: "id",
        },
      },
      emission_resource_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "resources",
          },
          key: "id",
        },
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      price_unit: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      price_for_amount: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      isVat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      vat_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      vat_percent: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      car_plate: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("input_payments");
  },
};
