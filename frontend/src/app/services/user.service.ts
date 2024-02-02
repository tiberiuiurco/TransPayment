import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { getUserByIdQuery, getAllEnrollsQuery, acceptEnrollMutation, setEnrollMutation } from '../graphQL/user.graphql';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apollo: Apollo) {}

  getUserById(user_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getUserByIdQuery,
          variables: {
            user_id: user_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.getUserById));
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getAllEnrolls(company_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .query({
          query: getAllEnrollsQuery,
          variables: {
            company_id: company_id,
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.getAllEnrolls));
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  acceptEnroll(enroll_id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: acceptEnrollMutation,
          variables: {
            enroll_id: enroll_id
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.acceptEnroll));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }

  setEnroll(user_id, email, description): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate({
          mutation: setEnrollMutation,
          variables: {
            user_id,
            email,
            description
          },
        })
        .subscribe(
          (result: any) => {
            resolve(_.cloneDeep(result.data && result.data.setEnroll));
          },
          (err) => {
            reject(err);
            console.log(err);
          }
        );
    });
  }
}
