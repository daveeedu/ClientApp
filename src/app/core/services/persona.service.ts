import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiModel} from "../models/api.model";
import {PersonaCreateModel, PersonaEditModel, PersonaModel} from "../models/persona.model";
import {environment} from "../../../environments/environment";
import {EndPoints, httpOptions} from "../utils/constants";

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private readonly httpClient: HttpClient) { }

  getPersonas(
    skip?: number,
    limit?: number,
    accountType?: number, 
    isActive?:boolean,
    email?: string,
    staffId?: string,
    branchId?: string,
    ): Observable<ApiModel<PersonaModel[]>> {
    let params = new HttpParams();
    if (!!skip) {
      params = params.append('skip', `${skip}`);
    }
    if (!!limit) {
      params = params.append('limit', `${limit}`);
    }
    if (!!accountType) {
      params = params.append('AccountType', `${accountType}`);
    }
    if (!!accountType) {
      params = params.append('AccountType', `${accountType}`);
    }
    if (!!email) {
      params = params.append("email", `${email}`);
    }
    if (!!staffId) {
      params = params.append("staffId", `${staffId}`);
    }
    if (!!isActive) {
      params = params.append('isActive', `${isActive}`);
    }
    if (!!branchId) {
      params = params.append('branchId', `${branchId}`);
    }

    return this.httpClient
      .get<ApiModel<PersonaModel[]>>(
        `${environment.hostUrl + EndPoints.personas}`,
        { params }
      )
      .pipe();
  }

  createPersona(persona: PersonaCreateModel): Observable<ApiModel<any>> {
    return this.httpClient
      .post<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.personas}`,
        persona,
        httpOptions
      )
      .pipe();
  }

  getPersona(personaId: string): Observable<ApiModel<PersonaModel>> {
    return this.httpClient
      .get<ApiModel<PersonaModel>>(
        `${environment.hostUrl + EndPoints.personas}/${personaId}`
      )
      .pipe();
  }

  editPersona(personaId: string, persona: PersonaEditModel): Observable<ApiModel<any>> {
    return this.httpClient
      .put<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.personas}/${personaId}`,
        persona,
        httpOptions
      )
      .pipe();
  }

  suspendPerson(personaId: string): Observable<ApiModel<any>> {
    return this.httpClient
      .put<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.personas}/deactivate/${personaId}`,
        httpOptions
      )
      .pipe();
  }

  activatePerson(personaId: string): Observable<ApiModel<any>> {
    return this.httpClient
      .put<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.personas}/activate/${personaId}`,
        httpOptions
      )
      .pipe();
  }

  deletePersona(personaId: string): Observable<ApiModel<any>> {
    return this.httpClient
      .delete<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.personas}/${personaId}`,
        httpOptions
      )
      .pipe();
  }
}
