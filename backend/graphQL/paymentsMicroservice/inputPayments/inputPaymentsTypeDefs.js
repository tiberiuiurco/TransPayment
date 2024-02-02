const { gql } = require("apollo-server");

const typeDefs = gql`
  type InputPayment @key(fields: "id") {
    id: ID!
    series: String!
    number: String!
    receipt_date: Date!
    payment_date: Date
    payment_type_id: ID
    payment_type: PaymentType
    company_id: ID
    company: Company
    partner_company_id: ID
    partner_company: PartnerCompany
    partner_person_id: ID
    partner_person: PartnerPerson
    isPartnerCompany: Boolean!
    delegate_id: ID
    delegate: Resource
    emission_resource_id: ID
    emission_resource: Resource
    amount: Float!
    price_unit: Float!
    price_for_amount: Float
    isVat: Boolean!
    vat_value: Float
    vat_percent: Int
    total: Float!
    paid: Boolean!
    comment: String
    car_plate: String!
    removed: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type PaymentType @key(fields: "id") {
    id: ID!
    name: String!
    removed: Boolean!
  }

  extend type Query {
    getAllPaymentTypes: [PaymentType]
    getAllInputPaymentsByCompanyId(company_id: ID!): [InputPayment]
    getMonthIntervalInputPayments(
      company_id: ID!
      months_nr: Int!
    ): [InputPayment]
    getMonthIntervalInputPaymentsPagination(
      offset: Int!
      limit: Int!
      company_id: ID!
      months_nr: Int!
    ): InputPaymentCountResponse
    getInputPaymentGraphData(
      company_id: ID!
      graph_type: String!
      options: JSONObject!
    ): JSONObject
    getTop10Clients(company_id: ID!, year: Int!): JSONObject!
  }

  extend type Mutation {
    createInputPayment(record: JSONObject): InputPayment
    updateInputPayment(record: JSONObject): JSONObject!
    markPaidByInputPaymentId(input_payment_id: ID!): Boolean!
  }

  type InputPaymentCountResponse {
    count: Int!
    rows: [InputPayment!]
  }

  extend type Company @key(fields: "id") {
    id: ID! @external
  }

  extend type PartnerCompany @key(fields: "id") {
    id: ID! @external
  }

  extend type PartnerPerson @key(fields: "id") {
    id: ID! @external
  }

  extend type Resource @key(fields: "id") {
    id: ID! @external
  }
`;

module.exports = typeDefs;
