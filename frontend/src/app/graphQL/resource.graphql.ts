import gql from 'graphql-tag';

export const createResourceQuery = gql`
  mutation createResource($record: JSONObject!, $company_id: String) {
    createResource(record: $record, company_id: $company_id) {
      id
      cnp
      name
      address
      phone
      id_series
      id_number
      employment_date
      contract_number
      isDriver
    }
  }
`;

export const getAllResourcesByCompanyIdQuery = gql`
  query getAllResourcesByCompanyId($company_id: ID!) {
    getAllResourcesByCompanyId(company_id: $company_id) {
      id
      cnp
      name
      address
      phone
      id_series
      id_number
      employment_date
      contract_number
      isDriver
    }
  }
`;

export const getAllResourcesByCompanyIdPaginationQuery = gql`
  query getAllResourcesByCompanyIdPagination(
    $offset: Int!
    $limit: Int!
    $company_id: ID!
  ) {
    getAllResourcesByCompanyIdPagination(
      offset: $offset
      limit: $limit
      company_id: $company_id
    ) {
      count
      rows {
        id
        cnp
        name
        address
        phone
        id_series
        id_number
        employment_date
        contract_number
        isDriver
        removed
      }
    }
  }
`;

export const getAllDelegatesByCompanyIdQuery = gql`
  query getAllDelegatesByCompanyId($company_id: ID!) {
    getAllDelegatesByCompanyId(company_id: $company_id) {
      id
      name
    }
  }
`;

export const getAllEmitorsByCompanyIdQuery = gql`
  query getAllEmitorsByCompanyId($company_id: ID!) {
    getAllEmitorsByCompanyId(company_id: $company_id) {
      id
      name
    }
  }
`;

export const updateResourceMutation = gql`
  mutation updateResource($record: JSONObject!, $company_id: String) {
    updateResource(record: $record, company_id: $company_id)
  }
`;
