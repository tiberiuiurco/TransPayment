const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    getUserById(user_id: ID!): User
		getAllEnrolls(company_id: ID!): [Enroll]
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
		setEnroll(user_id: ID!, email: String, description: String): JSONObject!
		acceptEnroll(enroll_id: ID!): JSONObject
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
		role: Int!
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
		role: Int
  }

	type Enroll @key(fields: "id") {
		id: ID!
		user_id: ID!
		user: User
		company_id: ID!
		company: Company
		description: String
		removed: Boolean
	}
`;

module.exports = typeDefs;
