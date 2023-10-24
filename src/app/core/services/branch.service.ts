import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiModel} from "../models/api.model";
import {environment} from "../../../environments/environment";
import {EndPoints, httpOptions} from "../utils/constants";
import {BranchCreateModel, BranchEditModel, BranchModel} from "../models/branch.model";

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private readonly httpClient: HttpClient) { }

  getBranches(country?: string, code?: string): Observable<ApiModel<BranchModel[]>> {
    let params = new HttpParams();
    if (!!country) {
      params = params.append('Country', `${country}`);
    }
    if (!!code) {
      params = params.append('Code', `${code}`);
    }

    return this.httpClient
      .get<ApiModel<BranchModel[]>>(
        `${environment.hostUrl + EndPoints.branches}`,
        { params }
      )
      .pipe();
  }

  getBranch(branchId: string): Observable<ApiModel<BranchModel>> {
    return this.httpClient
      .get<ApiModel<BranchModel>>(
        `${environment.hostUrl + EndPoints.branches}/${branchId}`
      )
      .pipe();
  }

  createBranch(branch: BranchCreateModel): Observable<ApiModel<BranchModel>> {
    return this.httpClient
      .post<ApiModel<BranchModel>>(
        `${environment.hostUrl + EndPoints.branches}`,
        branch,
        httpOptions
      )
      .pipe();
  }

  editBranch(branchId: string, branch: BranchEditModel): Observable<ApiModel<any>> {
    return this.httpClient
      .put<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.branches}/${branchId}`,
        branch,
        httpOptions
      )
      .pipe();
  }
}
