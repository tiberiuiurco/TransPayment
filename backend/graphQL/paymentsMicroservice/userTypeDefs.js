const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    getUserById(user_id: ID!): User
  }
  extend type Mutation {
    register(
      last_name: String!
      first_name: String!
      cnp: String!
      email: String!
      username: String!
      password: String!
    ): RegisterUser
    login(email: String!, password: String!): LoginUser
  }

  type User @key(fields: "id") {
    id: ID!
    first_name: String!
    last_name: String!
    cnp: String!
    email: String!
    username: String!
    password: String!
    company_id: ID
    company: Company
  }

  extend type Company @key(fields: "id") {
    id: ID! @external
  }

  type RegisterUser {
    response: RegisterUserResponse
    actual_password: String
    email: String
    message: String!
  }

  type RegisterUserResponse {
    id: ID
    email: String
    password: String
    first_name: String
  }

  type LoginUser {
    id: ID
    first_name: String
    last_name: String
    email: String
    token: String
    message: String
  }
`;

module.exports = typeDefs;
