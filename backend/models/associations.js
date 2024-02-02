const User = require("./userModel");
const Company = require("./companyModel");
const Resource = require("./resourceModel");
const PartnerCompany = require("./partnerCompanyModel");
const PartnerPerson = require("./partnerPersonModel");
const PaymentType = require("./paymentTypeModel");
const InputPayment = require("./inputPaymentModel");
const OutputPayment = require("./outputPaymentModel");
const Enroll = require("./enrollModel");

module.exports = () => {
  // Create association for User and Company
  Company.hasMany(User, {
    as: "users",
    foreignKey: "company_id",
  });
  User.belongsTo(Company, {
    as: "company",
    foreignKey: "company_id",
  });

  Company.hasMany(Resource, {
    as: "resources",
    foreignKey: "company_id",
  });
  Resource.belongsTo(Company, {
    as: "company",
    foreignKey: "company_id",
  });

  // Partners
  Company.hasMany(PartnerCompany, {
    as: "partner_company",
    foreignKey: "company_id",
  });
  PartnerCompany.belongsTo(Company, {
    as: "company",
    foreignKey: "company_id",
  });
  Company.hasMany(PartnerPerson, {
    as: "partner_person",
    foreignKey: "company_id",
  });
  PartnerPerson.belongsTo(Company, {
    as: "company",
    foreignKey: "company_id",
  });

  // Input Payments
  PaymentType.hasMany(InputPayment, {
    as: "input_payment",
    foreignKey: "payment_type_id",
  });
  InputPayment.belongsTo(PaymentType, {
    as: "payment_type",
    foreignKey: "payment_type_id",
  });
  InputPayment.belongsTo(Company, {
    as: "company",
    foreignKey: "company_id",
  });
  Company.hasMany(InputPayment, {
    as: "input_payment",
    foreignKey: "company_id",
  });
  InputPayment.belongsTo(PartnerCompany, {
    as: "partner_company",
    foreignKey: "partner_company_id",
  });
  PartnerCompany.hasMany(InputPayment, {
    as: "input_payment",
    foreignKey: "partner_company_id",
  });
  InputPayment.belongsTo(PartnerPerson, {
    as: "partner_person",
    foreignKey: "partner_person_id",
  });
  PartnerPerson.hasMany(InputPayment, {
    as: "input_payment",
    foreignKey: "partner_person_id",
  });
  InputPayment.belongsTo(Resource, {
    as: "delegate",
    foreignKey: "delegate_id",
  });
  Resource.hasMany(InputPayment, {
    as: "input_payment",
    foreignKey: "delegate_id",
  });
  InputPayment.belongsTo(Resource, {
    as: "emission_resource",
    foreignKey: "emission_resource_id",
  });

  // Output Payments
  OutputPayment.belongsTo(Company, {
    as: "company",
    foreignKey: "company_id",
  });
  Company.hasMany(OutputPayment, {
    as: "output_payment",
    foreignKey: "company_id",
  });
	
	// Enrolls
  User.hasMany(Enroll, {
    as: "enroll",
    foreignKey: "user_id",
  });
  Enroll.belongsTo(User, {
    as: "user",
    foreignKey: "user_id",
  });
  Company.hasMany(Enroll, {
    as: "enroll",
    foreignKey: "company_id",
  });
  Enroll.belongsTo(Company, {
    as: "company",
    foreignKey: "company_id",
  });
};
