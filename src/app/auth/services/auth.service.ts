import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {EndPoints, httpOptions} from "../../core/utils/constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginResponseModel} from "../models/login.model";
import {ApiModel} from "../../core/models/api.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly httpClient: HttpClient) { }

  signIn(emailaddress: string, password: string): Observable<ApiModel<string>> {
    return this.httpClient
      .post<ApiModel<string>>(
        `${environment.hostUrl + EndPoints.operatorAuth}`,
        { emailaddress, password },
        httpOptions
      )
      .pipe();
  }

  activeDirSignIn(username: string, password: string): Observable<ApiModel<boolean>> {
    return this.httpClient
      .post<ApiModel<boolean>>(
        `${environment.hostUrl + EndPoints.activeDirAuth}`,
        { username, password },
        httpOptions
      )
      .pipe();
  }

  twoFactorSignIn(username: string, token: string): Observable<ApiModel<boolean>> {
    return this.httpClient
      .post<ApiModel<boolean>>(
        `${environment.hostUrl + EndPoints.twoFactorAuth}`,
        { username, token },
        httpOptions
      )
      .pipe();
  }

  signOut(): Observable<ApiModel<any>> {
    return this.httpClient.delete<ApiModel<any>>(`${environment.hostUrl + EndPoints.signOut}`, httpOptions);
  }

  changePassword(
    oldPassword: string,
    password: string,
    confirmPassword: string
  ): Observable<ApiModel<LoginResponseModel>> {
    return this.httpClient
      .post<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.changePassword}`,
        {
          oldPassword,
          password,
          confirmPassword,
        },
        httpOptions
      )
      .pipe();
  }

  forgotPassword(email: string): Observable<ApiModel<any>> {
    return this.httpClient
      .post<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.forgotPassword}`,
        {
          email,
        },
        httpOptions
      )
      .pipe();
  }

  resetPassword(
    newPassword: string,
    confirmPassword: string,
    email: string,
    token: string
  ): Observable<ApiModel<any>> {
    return this.httpClient
      .post<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.resetPassword}`,
        {
          email,
          token,
          newPassword,
          confirmPassword,
        },
        httpOptions
      )
      .pipe();
  }
}
