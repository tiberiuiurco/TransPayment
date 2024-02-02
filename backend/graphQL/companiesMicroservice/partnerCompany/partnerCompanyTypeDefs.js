const { gql } = require("apollo-server");

const typeDefs = gql`
  type PartnerCompany @key(fields: "id") {
    id: ID!
    company_id: ID
    company: Company
    name: String!
    cui: String!
    rc: String!
    address: String!
    address_secondary: String
    email: String
    phone: String
    iban: String
    bank_name: String
    removed: Boolean!
    createdAt: Date
    updatedAt: Date
  }

  extend type Query {
    getAllCompanyPartnersByCompanyId(company_id: ID!): [PartnerCompany]
    getAllCompanyPartnersByCompanyIdPagination(
      offset: Int!
      limit: Int!
      company_id: ID!
    ): PartnerCompanyCountResponse
  }

  extend type Mutation {
    createPartnerCompany(record: JSONObject, company_id: ID!): PartnerCompany
    updatePartnerCompany(record: JSONObject, company_id: ID!): JSONObject!
  }

  type PartnerCompanyCountResponse {
    count: Int!
    rows: [PartnerCompany!]
  }
`;

module.exports = typeDefs;
