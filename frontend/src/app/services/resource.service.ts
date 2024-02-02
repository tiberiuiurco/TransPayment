import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  createResourceQuery,
  getAllResourcesByCompanyIdQuery,
  getAllResourcesByCompanyIdPaginationQuery,
  updateResourceMutation,
  getAllDelegatesByCompanyIdQuery,
  getAllEmitorsByCompanyIdQuery,
} from '../graphQL/resource.graphql';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  constructor(private apollo: Apollo) {}

  addResource(body: any, company_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: createResourceQuery,
          variables: {
            record: body,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.createResource));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }

  getAllResourcesByCompanyId(company_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllResourcesByCompanyIdQuery,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(
              _.cloneDeep(result.data && result.data.getAllResourcesByCompanyId)
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getAllResourcesByCompanyIdPagination(
    offset,
    limit,
    company_id: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllResourcesByCompanyIdPaginationQuery,
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
                result.data && result.data.getAllResourcesByCompanyIdPagination
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

  updateResource(body: any, company_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: updateResourceMutation,
          variables: {
            record: body,
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.updateResource));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
}
