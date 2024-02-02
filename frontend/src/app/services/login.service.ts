import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from "apollo-angular";
import {
  register,
  login,
} from "../graphQL/user.graphql"
import * as _ from "lodash-es";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user = null;

  constructor(private apollo: Apollo) { }

  register(body: any) {
    return (
      new Promise((resolve, reject) => {
        body = JSON.parse(body);

        this.apollo
          .mutate({
            mutation: register,
            variables: {
              last_name: body.last_name,
              first_name: body.first_name,
              cnp: body.cnp,
              email: body.email,
              username: body.username,
              password: body.password,
            },
          })
          .subscribe(
            (result: any) => {
              resolve(_.cloneDeep(result.data && result.data.register));
            },

            (err) => {
              reject(err);
            }
          );
      })
    );
  }

  login(body: any) {
    return (
      new Promise((resolve, reject) => {
        body = JSON.parse(body);

        this.apollo
          .mutate({
            mutation: login,
            variables: {
              email: body.email,
              password: body.password,
            },
          })
          .subscribe(
            (result: any) => {
              resolve(_.cloneDeep(result.data && result.data.login));
            },

            (err) => {
              reject(err);
            }
          );
      })
        .then((user: any) => {
          if (!user.message) {
            this.user = user;
            localStorage.setItem("id", user.id);
            localStorage.setItem("email", user.email);
            localStorage.setItem("token", user.token);
            localStorage.setItem("first_name", user.first_name);
            localStorage.setItem("last_name", user.last_name);
            localStorage.setItem("role", user.role);
          }
          return user;
        })
    );
  }
}
