const { gql } = require("apollo-server");

const typeDefs = gql`
  type Flota @key(fields: "id") {
    id: ID!
    car_plate: String!
		tip: String!
    company_id: ID
    company: Company
    removed: Boolean!
  }

  extend type Query {
    getAllFlotaByCompanyId(company_id: ID!): [JSONObject]
    getAllFlotaByCompanyIdPagination(
      offset: Int!
      limit: Int!
      company_id: ID!
    ): FlotaCountResponse
  }

  type FlotaCountResponse {
    count: Int!
    rows: [Flota!]
  }

  extend type Mutation {
    createFlota(record: JSONObject, company_id: String): Flota
    updateFlota(record: JSONObject, company_id: String): JSONObject!
  }

`;

module.exports = typeDefs;
