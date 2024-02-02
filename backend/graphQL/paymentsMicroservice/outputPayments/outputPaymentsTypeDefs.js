const { gql } = require("apollo-server");

const typeDefs = gql`
  type OutputPayment @key(fields: "id") {
    id: ID!
    payment_date: Date
    name: String!
    company_id: ID!
    company: Company
    series_number: String!
    vat_value: Float!
    total: Float!
    removed: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Query {
    getAllOutputPaymentsByCompanyId(company_id: ID!): [OutputPayment]
    getMonthIntervalOutputPayments(
      company_id: ID!
      months_nr: Int!
    ): [OutputPayment]
    getMonthIntervalOutputPaymentsPagination(
      offset: Int!
      limit: Int!
      company_id: ID!
      months_nr: Int!
    ): OutputPaymentCountResponse
    getVatStatisticsData(company_id: ID!, options: JSONObject!): JSONObject
  }

  extend type Mutation {
    createOutputPayment(record: JSONObject): OutputPayment
    updateOutputPayment(record: JSONObject): JSONObject!
  }

  type OutputPaymentCountResponse {
    count: Int!
    rows: [OutputPayment!]
  }
`;

module.exports = typeDefs;
