import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  getAllPaymentTypesQuery,
  createInputPaymentQuery,
  getAllInputPaymentsByCompanyId,
  markInputPaymentAsPaidMutation,
  updateInputPaymentMutation,
  getMonthIntervalInputPaymentsQuery,
  getMonthIntervalInputPaymentsPaginationQuery,
  getInputPaymentGraphDataQuery,
  getTop10ClientsQuery,
  createOutputPaymentQuery,
  getAllOutputPaymentsByCompanyId,
  markOutputPaymentAsPaidMutation,
  updateOutputPaymentMutation,
  getMonthIntervalOutputPaymentsQuery,
  getMonthIntervalOutputPaymentsPaginationQuery,
  getVatStatisticsDataQuery,
} from '../graphQL/payment.graphql';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private apollo: Apollo) {}

  getAllPaymentTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllPaymentTypesQuery,
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.getAllPaymentTypes));
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  addInputPayment(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: createInputPaymentQuery,
          variables: {
            record: body,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.createInputPayment));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
  getAllInputPaymentsByCompanyId(company_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllInputPaymentsByCompanyId,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data && result.data.getAllInputPaymentsByCompanyId
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getMonthIntervalInputPayments(company_id, months_nr): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getMonthIntervalInputPaymentsQuery,
          variables: {
            company_id: company_id,
            months_nr: months_nr,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data && result.data.getMonthIntervalInputPayments
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getMonthIntervalInputPaymentsPagination(
    offset,
    limit,
    company_id,
    months_nr
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getMonthIntervalInputPaymentsPaginationQuery,
          variables: {
            offset: offset,
            limit: limit,
            company_id: company_id,
            months_nr: months_nr,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data &&
                  result.data.getMonthIntervalInputPaymentsPagination
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  markInputPaymentPaid(input_payment_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: markInputPaymentAsPaidMutation,
          variables: {
            input_payment_id: input_payment_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.markInputPaymentPaid)
            );
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
  updateInputPayment(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: updateInputPaymentMutation,
          variables: {
            record: body,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.updateInputPayment));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
  getInputPaymentGraphData(company_id, graph_type, options): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getInputPaymentGraphDataQuery,
          variables: {
            company_id: company_id,
            graph_type: graph_type,
            options: options,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.getInputPaymentGraphData)
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getTop10Clients(company_id, year: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getTop10ClientsQuery,
          variables: {
            company_id: company_id,
            year: year,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.getTop10Clients));
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  // Output Payments

  addOutputPayment(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: createOutputPaymentQuery,
          variables: {
            record: body,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.createOutputPayment)
            );
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
  getAllOutputPaymentsByCompanyId(company_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllOutputPaymentsByCompanyId,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data && result.data.getAllOutputPaymentsByCompanyId
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getMonthIntervalOutputPayments(company_id, months_nr): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getMonthIntervalOutputPaymentsQuery,
          variables: {
            company_id: company_id,
            months_nr: months_nr,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data && result.data.getMonthIntervalOutputPayments
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getMonthIntervalOutputPaymentsPagination(
    offset,
    limit,
    company_id,
    months_nr
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getMonthIntervalOutputPaymentsPaginationQuery,
          variables: {
            offset: offset,
            limit: limit,
            company_id: company_id,
            months_nr: months_nr,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data &&
                  result.data.getMonthIntervalOutputPaymentsPagination
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  markOutputPaymentPaid(output_payment_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: markOutputPaymentAsPaidMutation,
          variables: {
            output_payment_id: output_payment_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.markOutputPaymentPaid)
            );
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
  updateOutputPayment(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: updateOutputPaymentMutation,
          variables: {
            record: body,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.updateOutputPayment)
            );
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }

  // VAT Section
  getVatStatisticsData(company_id, options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getVatStatisticsDataQuery,
          variables: {
            company_id: company_id,
            options: options,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.getVatStatisticsData)
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
}
