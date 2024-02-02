import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  createFlotaQuery,
  getAllFlotaByCompanyIdQuery,
  getAllFlotaByCompanyIdPaginationQuery,
  updateFlotaMutation,
  getAllDelegatesByCompanyIdQuery,
  getAllEmitorsByCompanyIdQuery,
} from '../graphQL/flota.graphql';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class FlotaService {
  constructor(private apollo: Apollo) {}

  addFlota(body: any, company_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: createFlotaQuery,
          variables: {
            record: body,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.createFlota));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }

  getAllFlotaByCompanyId(company_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllFlotaByCompanyIdQuery,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.getAllFlotaByCompanyId)
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getAllFlotaByCompanyIdPagination(
    offset,
    limit,
    company_id: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllFlotaByCompanyIdPaginationQuery,
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
                result.data && result.data.getAllFlotaByCompanyIdPagination
              )
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getAllDelegatesByCompanyId(company_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllDelegatesByCompanyIdQuery,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.getAllDelegatesByCompanyId)
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  getAllEmitorsByCompanyId(company_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllEmitorsByCompanyIdQuery,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.getAllEmitorsByCompanyId)
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  updateFlota(body: any, company_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: updateFlotaMutation,
          variables: {
            record: body,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.updateFlota));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
}
