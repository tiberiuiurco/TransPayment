const { gql } = require("apollo-server");

const typeDefs = gql`
  type Company @key(fields: "id") {
    id: ID!
    cui: String!
    name: String!
    rc: String!
    address: String!
    email: String!
    phone: String!
    iban: String!
    bank_name: String!
    serie_factura: String!
    nr_factura: Int!
    serie_chitanta: String!
    nr_chitanta: Int!
    removed: Boolean!
    createdAt: Date
    updatedAt: Date
  }

  extend type Query {
    getCompanyById(company_id: ID!): Company
    getAllCompanies: [Company!]
  }

  extend type Mutation {
    createCompany(record: JSONObject, user_id: String): Company
    updateCompany(record: JSONObject): JSONObject!
  }
`;

module.exports = typeDefs;
