const { gql } = require("apollo-server");

const typeDefs = gql`
  type Resource @key(fields: "id") {
    id: ID!
    cnp: String!
    name: String!
    address: String!
    phone: String!
    id_series: String!
    id_number: String!
    employment_date: Date!
    contract_number: String!
    isDriver: Boolean!
    company_id: ID
    company: Company
    removed: Boolean!
  }

  extend type Query {
    getAllResourcesByCompanyId(company_id: ID!): [Resource]
    getAllResourcesByCompanyIdPagination(
      offset: Int!
      limit: Int!
      company_id: ID!
    ): ResourceCountResponse
    getAllDelegatesByCompanyId(company_id: ID!): [Resource]
    getAllEmitorsByCompanyId(company_id: ID!): [Resource]
  }

  type ResourceCountResponse {
    count: Int!
    rows: [Resource!]
  }

  extend type Mutation {
    createResource(record: JSONObject, company_id: String): Resource
    updateResource(record: JSONObject, company_id: String): JSONObject!
  }

  type OperationResponse {
    message: String!
    status: Boolean!
  }
`;

module.exports = typeDefs;
