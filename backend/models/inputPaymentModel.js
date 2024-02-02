const db = require("../db/db");
const Sequelize = require("sequelize");
const Company = require("./companyModel");
const PartnerCompany = require("./partnerCompanyModel");
const PartnerPerson = require("./partnerPersonModel");
const Resource = require("./resourceModel");
const PaymentType = require("./paymentTypeModel");

const InputPayment = db.define(
  "input_payment",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    series: { type: Sequelize.STRING, allowNull: false },
    number: { type: Sequelize.STRING, allowNull: false },
    receipt_date: { type: Sequelize.DATE, allowNull: false },
    payment_date: { type: Sequelize.DATE, allowNull: true },
    payment_type_id: {
      type: Sequelize.INTEGER,
      references: {
        model: PaymentType,
        key: "id",
      },
    },
    company_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Company,
        key: "id",
      },
    },
    partner_company_id: {
      type: Sequelize.INTEGER,
      references: {
        model: PartnerCompany,
        key: "id",
      },
    },
    partner_person_id: {
      type: Sequelize.INTEGER,
      references: {
        model: PartnerPerson,
        key: "id",
      },
    },
    isPartnerCompany: { type: Sequelize.BOOLEAN, allowNull: false },
    delegate_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Resource,
        key: "id",
      },
    },
    emission_resource_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Resource,
        key: "id",
      },
    },
    amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    price_unit: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    price_for_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
    isVat: { type: Sequelize.BOOLEAN, allowNull: false },
    vat_value: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
    vat_percent: { type: Sequelize.INTEGER, allowNull: true },
    total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    paid: { type: Sequelize.BOOLEAN, allowNull: false },
    comment: { type: Sequelize.STRING, allowNull: true },
    car_plate: { type: Sequelize.STRING, allowNull: false },
    removed: { type: Sequelize.BOOLEAN, allowNull: false },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    timestamps: true,
    doNotSync: true,
  }
);

module.exports = InputPayment;
