import gql from 'graphql-tag';

export const createFlotaQuery = gql`
  mutation createFlota($record: JSONObject!, $company_id: String) {
    createFlota(record: $record, company_id: $company_id) {
      id
      car_plate
      tip
    }
  }
`;

export const getAllFlotaByCompanyIdQuery = gql`
  query getAllFlotaByCompanyId($company_id: ID!) {
    getAllFlotaByCompanyId(company_id: $company_id)
  }
`;

export const getAllFlotaByCompanyIdPaginationQuery = gql`
  query getAllFlotaByCompanyIdPagination(
    $offset: Int!
    $limit: Int!
    $company_id: ID!
  ) {
    getAllFlotaByCompanyIdPagination(
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

export const updateFlotaMutation = gql`
  mutation updateFlota($record: JSONObject!, $company_id: String) {
    updateFlota(record: $record, company_id: $company_id)
  }
`;
