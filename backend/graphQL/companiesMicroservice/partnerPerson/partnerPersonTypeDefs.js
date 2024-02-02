const { gql } = require("apollo-server");

const typeDefs = gql`
  type PartnerPerson @key(fields: "id") {
    id: ID!
    company_id: ID
    company: Company
    cnp: String!
    name: String!
    address: String!
    phone: String!
    id_series: String!
    id_number: String!
    iban: String
    bank_name: String
    removed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    getAllPersonPartnersByCompanyId(company_id: ID!): [PartnerPerson]
    getAllPersonPartnersByCompanyIdPagination(
      offset: Int!
      limit: Int!
      company_id: ID!
    ): PartnerPersonCountResponse
  }

  extend type Mutation {
    createPartnerPerson(record: JSONObject, company_id: ID!): PartnerPerson
    updatePartnerPerson(record: JSONObject, company_id: ID!): JSONObject!
  }

  type PartnerPersonCountResponse {
    count: Int!
    rows: [PartnerPerson!]
  }
`;

module.exports = typeDefs;
