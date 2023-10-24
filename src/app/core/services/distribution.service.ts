import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiModel} from "../models/api.model";
import {environment} from "../../../environments/environment";
import {EndPoints, httpOptions} from "../utils/constants";

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  constructor(private readonly httpClient: HttpClient) { }

  createDistribution(model): Observable<ApiModel<any>> {
    return this.httpClient
      .post<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.branches}/setup`,
        model,
        httpOptions
      )
      .pipe();
  }
}
