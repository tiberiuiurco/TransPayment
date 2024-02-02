import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  getCompanyByIdQuery,
  getAllCompaniesQuery,
  createCompanyQuery,
  getAllCompanyPartnersByCompanyIdQuery,
  getAllCompanyPartnersByCompanyIdPaginationQuery,
  getAllPersonPartnersByCompanyIdQuery,
  getAllPersonPartnersByCompanyIdPaginationQuery,
  updateCompanyMutation,
  createPartnerCompanyQuery,
  updatePartnerCompanyQuery,
  createPartnerPersonQuery,
  updatePartnerPersonQuery,
} from '../graphQL/company.graphql';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private apollo: Apollo) {}

  getCompanyById(company_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getCompanyByIdQuery,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.getCompanyById));
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getAllCompanies(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllCompaniesQuery,
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.getAllCompanies));
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  addCompany(body: any, user_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: createCompanyQuery,
          variables: {
            record: body,
            user_id: user_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.createCompany));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }

  updateCompany(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: updateCompanyMutation,
          variables: {
            record: body,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.updateCompany));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }

  // Partners Section
  getAllCompanyPartnersByCompanyId(company_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllCompanyPartnersByCompanyIdQuery,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data && result.data.getAllCompanyPartnersByCompanyId
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getAllPersonPartnersByCompanyId(company_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllPersonPartnersByCompanyIdQuery,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data && result.data.getAllPersonPartnersByCompanyId
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getAllPersonPartnersByCompanyIdPagination(
    offset,
    limit,
    company_id
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllPersonPartnersByCompanyIdPaginationQuery,
          variables: {
            offset: offset,
            limit: limit,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data &&
                  result.data.getAllPersonPartnersByCompanyIdPagination
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getAllCompanyPartnersByCompanyIdPagination(
    offset,
    limit,
    company_id
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllCompanyPartnersByCompanyIdPaginationQuery,
          variables: {
            offset: offset,
            limit: limit,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(
                result.data &&
                  result.data.getAllCompanyPartnersByCompanyIdPagination
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  createPartnerCompany(body: any, company_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: createPartnerCompanyQuery,
          variables: {
            record: body,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.createPartnerCompany)
            );
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
  updatePartnerCompany(body: any, company_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: updatePartnerCompanyQuery,
          variables: {
            record: body,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.updatePartnerCompany)
            );
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
  createPartnerPerson(body: any, company_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: createPartnerPersonQuery,
          variables: {
            record: body,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.createPartnerPerson)
            );
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
  updatePartnerPerson(body: any, company_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: updatePartnerPersonQuery,
          variables: {
            record: body,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.updatePartnerPerson)
            );
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
}
