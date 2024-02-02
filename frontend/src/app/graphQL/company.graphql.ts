import gql from 'graphql-tag';

export const getCompanyByIdQuery = gql`
  query getCompanyById($company_id: ID!) {
    getCompanyById(company_id: $company_id) {
      id
      cui
      name
      rc
      address
      email
      phone
      iban
      bank_name
      serie_factura
      nr_factura
      serie_chitanta
      nr_chitanta
      removed
    }
  }
`;

export const getAllCompaniesQuery = gql`
  query getAllCompanies {
    getAllCompanies {
      id
      cui
      name
      removed
    }
  }
`;

export const createCompanyQuery = gql`
  mutation createCompany($record: JSONObject!, $user_id: String) {
    createCompany(record: $record, user_id: $user_id) {
      id
      cui
      name
      rc
      address
      email
      phone
      iban
    }
  }
`;

export const updateCompanyMutation = gql`
  mutation updateCompany($record: JSONObject!) {
    updateCompany(record: $record)
  }
`;

export const getAllCompanyPartnersByCompanyIdQuery = gql`
  query getAllCompanyPartnersByCompanyId($company_id: ID!) {
    getAllCompanyPartnersByCompanyId(company_id: $company_id) {
      id
      name
      cui
    }
  }
`;

export const getAllPersonPartnersByCompanyIdQuery = gql`
  query getAllPersonPartnersByCompanyId($company_id: ID!) {
    getAllPersonPartnersByCompanyId(company_id: $company_id) {
      id
      name
      cnp
    }
  }
`;

export const getAllPersonPartnersByCompanyIdPaginationQuery = gql`
  query getAllPersonPartnersByCompanyIdPagination(
    $offset: Int!
    $limit: Int!
    $company_id: ID!
  ) {
    getAllPersonPartnersByCompanyIdPagination(
      offset: $offset
      limit: $limit
      company_id: $company_id
    ) {
      count
      rows {
        id
        name
        cnp
        address
        phone
        id_series
        id_number
        iban
      }
    }
  }
`;

export const getAllCompanyPartnersByCompanyIdPaginationQuery = gql`
  query getAllCompanyPartnersByCompanyIdPagination(
    $offset: Int!
    $limit: Int!
    $company_id: ID!
  ) {
    getAllCompanyPartnersByCompanyIdPagination(
      offset: $offset
      limit: $limit
      company_id: $company_id
    ) {
      count
      rows {
        id
        name
        cui
        rc
        address
        address_secondary
        email
        phone
        iban
      }
    }
  }
`;

export const createPartnerCompanyQuery = gql`
  mutation createPartnerCompany($record: JSONObject!, $company_id: ID!) {
    createPartnerCompany(record: $record, company_id: $company_id) {
      id
      name
      cui
      rc
      address
      address_secondary
      email
      phone
      iban
    }
  }
`;

export const updatePartnerCompanyQuery = gql`
  mutation updatePartnerCompany($record: JSONObject!, $company_id: ID!) {
    updatePartnerCompany(record: $record, company_id: $company_id)
  }
`;

export const createPartnerPersonQuery = gql`
  mutation createPartnerPerson($record: JSONObject!, $company_id: ID!) {
    createPartnerPerson(record: $record, company_id: $company_id) {
      id
      name
      cnp
      address
      phone
      id_series
      id_number
      iban
    }
  }
`;

export const updatePartnerPersonQuery = gql`
  mutation updatePartnerPerson($record: JSONObject!, $company_id: ID!) {
    updatePartnerPerson(record: $record, company_id: $company_id)
  }
`;
