import gql from 'graphql-tag';

export const getAllCompaniesQuery = gql`
  query getAllCompanies {
    getAllCompanies {
      id
      name
    }
  }
`;

export const getUserByIdQuery = gql`
  query getUserById($user_id: ID!) {
    getUserById(user_id: $user_id) {
      id
      first_name
      email
      company {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

export const getAllEnrollsQuery = gql`
  query getAllEnrolls($company_id: ID!) {
    getAllEnrolls(company_id: $company_id) {
      id
      user{
        first_name
        last_name
        email
      }
      company {
        id
        name
      }
      description
    }
  }
`;

export const getAllUserInformationQuery = gql`
  query getUserById($user_id: ID!) {
    getUserById(user_id: $user_id) {
      id
      first_name
      email
      company {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

export const register = gql`
  mutation register(
    $last_name: String!
    $first_name: String!
    $cnp: String!
    $email: String!
    $username: String!
    $password: String!
  ) {
    register(
      last_name: $last_name
      first_name: $first_name
      cnp: $cnp
      email: $email
      username: $username
      password: $password
    ) {
      response {
        id
        email
        password
        first_name
      }
      actual_password
      email
      message
    }
  }
`;

export const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      first_name
      last_name
      email
      token
      message
      role
    }
  }
`;

export const acceptEnrollMutation = gql`
  mutation acceptEnroll($enroll_id: ID!) {
    acceptEnroll(enroll_id: $enroll_id)
  }
`;

export const setEnrollMutation = gql`
  mutation setEnroll($user_id: ID!, $email: String, $description: String) {
    setEnroll(user_id: $user_id, email: $email, description: $description,)
  }
`;
