import gql from 'graphql-tag';

export const getAllPaymentTypesQuery = gql`
  query getAllPaymentTypes {
    getAllPaymentTypes {
      id
      name
    }
  }
`;

export const createInputPaymentQuery = gql`
  mutation createInputPayment($record: JSONObject!) {
    createInputPayment(record: $record) {
      id
      receipt_date
      payment_date
      payment_type {
        id
        name
      }
      partner_company {
        id
        name
      }
      partner_person {
        id
        name
      }
      isPartnerCompany
      delegate {
        id
        name
      }
      emission_resource {
        id
        name
      }
      amount
      price_unit
      price_for_amount
      isVat
      vat_value
      vat_percent
      total
      paid
      car_plate
      comment
      removed
    }
  }
`;

export const getAllInputPaymentsByCompanyId = gql`
  query getAllInputPaymentsByCompanyId($company_id: ID!) {
    getAllInputPaymentsByCompanyId(company_id: $company_id) {
      id
      receipt_date
      payment_date
      payment_type {
        id
        name
      }
      partner_company {
        id
        name
      }
      partner_person {
        id
        name
      }
      isPartnerCompany
      emission_resource {
        id
        name
      }
      delegate {
        id
        name
      }
      amount
      price_unit
      price_for_amount
      isVat
      vat_value
      vat_percent
      total
      paid
      comment
      removed
    }
  }
`;

export const getMonthIntervalInputPaymentsQuery = gql`
  query getMonthIntervalInputPayments($company_id: ID!, $months_nr: Int!) {
    getMonthIntervalInputPayments(
      company_id: $company_id
      months_nr: $months_nr
    ) {
      id
      receipt_date
      payment_date
      payment_type {
        id
        name
      }
      partner_company {
        id
        name
      }
      partner_person {
        id
        name
      }
      isPartnerCompany
      emission_resource {
        id
        name
      }
      delegate {
        id
        name
      }
      amount
      price_unit
      price_for_amount
      isVat
      vat_value
      vat_percent
      total
      paid
      comment
      removed
    }
  }
`;
export const getMonthIntervalInputPaymentsPaginationQuery = gql`
  query getMonthIntervalInputPaymentsPagination(
    $offset: Int!
    $limit: Int!
    $company_id: ID!
    $months_nr: Int!
  ) {
    getMonthIntervalInputPaymentsPagination(
      offset: $offset
      limit: $limit
      company_id: $company_id
      months_nr: $months_nr
    ) {
      count
      rows {
        id
        receipt_date
        payment_date
        payment_type {
          id
          name
        }
        partner_company {
          id
          name
          cui
          rc
          address
          address_secondary
          email
          phone
          iban
          bank_name
        }
        partner_person {
          id
          name
          cnp
          address
          phone
          id_series
          id_number
          iban
          bank_name
        }
        isPartnerCompany
        emission_resource {
          id
          name
          id_series
          id_number
        }
        delegate {
          id
          name
          id_series
          id_number
        }
        amount
        price_unit
        price_for_amount
        isVat
        vat_value
        vat_percent
        total
        paid
        series
        number
        comment
        car_plate
        removed
      }
    }
  }
`;

export const markInputPaymentAsPaidMutation = gql`
  mutation markPaidByInputPaymentId($input_payment_id: ID!) {
    markPaidByInputPaymentId(input_payment_id: $input_payment_id)
  }
`;

export const updateInputPaymentMutation = gql`
  mutation updateInputPayment($record: JSONObject!) {
    updateInputPayment(record: $record)
  }
`;

export const getInputPaymentGraphDataQuery = gql`
  query getInputPaymentGraphData(
    $company_id: ID!
    $graph_type: String!
    $options: JSONObject!
  ) {
    getInputPaymentGraphData(
      company_id: $company_id
      graph_type: $graph_type
      options: $options
    )
  }
`;

export const getTop10ClientsQuery = gql`
  query getTop10Clients($company_id: ID!, $year: Int!) {
    getTop10Clients(company_id: $company_id, year: $year)
  }
`;

// Output Payments

export const createOutputPaymentQuery = gql`
  mutation createOutputPayment($record: JSONObject!) {
    createOutputPayment(record: $record) {
      id
      payment_date
      name
      company_id
      series_number
      total
      vat_value
      removed
    }
  }
`;

export const getAllOutputPaymentsByCompanyId = gql`
  query getAllOutputPaymentsByCompanyId($company_id: ID!) {
    getAllOutputPaymentsByCompanyId(company_id: $company_id) {
      id
      payment_date
      name
      company_id
      series_number
      total
      vat_value
      removed
    }
  }
`;

export const getMonthIntervalOutputPaymentsQuery = gql`
  query getMonthIntervalOutputPayments($company_id: ID!, $months_nr: Int!) {
    getMonthIntervalOutputPayments(
      company_id: $company_id
      months_nr: $months_nr
    ) {
      id
      payment_date
      name
      company_id
      series_number
      total
      vat_value
      removed
    }
  }
`;
export const getMonthIntervalOutputPaymentsPaginationQuery = gql`
  query getMonthIntervalOutputPaymentsPagination(
    $offset: Int!
    $limit: Int!
    $company_id: ID!
    $months_nr: Int!
  ) {
    getMonthIntervalOutputPaymentsPagination(
      offset: $offset
      limit: $limit
      company_id: $company_id
      months_nr: $months_nr
    ) {
      count
      rows {
        id
        payment_date
        name
        company_id
        series_number
        total
        vat_value
        removed
      }
    }
  }
`;

export const markOutputPaymentAsPaidMutation = gql`
  mutation markPaidByOutputPaymentId($output_payment_id: ID!) {
    markPaidByOutputPaymentId(output_payment_id: $output_payment_id)
  }
`;

export const updateOutputPaymentMutation = gql`
  mutation updateOutputPayment($record: JSONObject!) {
    updateOutputPayment(record: $record)
  }
`;

// VAT Section

export const getVatStatisticsDataQuery = gql`
  query getVatStatisticsData($company_id: ID!, $options: JSONObject!) {
    getVatStatisticsData(company_id: $company_id, options: $options)
  }
`;
