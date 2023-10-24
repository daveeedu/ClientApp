import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ApiModel } from "../models/api.model";
import { environment } from "../../../environments/environment";
import { EndPoints, httpCSVOptions, httpOptions, DeviceStates } from "../utils/constants";
import {
  DeviceCreateModel,
  DeviceEditModel,
  DeviceModel,
  DeviceMoveModel
} from "../models/device.model";

@Injectable({
  providedIn: "root",
})
export class DeviceService {
  constructor(private readonly httpClient: HttpClient) {}

  getDevices(
    skip?: number,
    limit?: number,
    isActive?: string,
    branchId?: string,
    reference?: string,
  ): Observable<ApiModel<DeviceModel[]>> {
    console.log(skip)
    let params = new HttpParams();
    if (!!skip) {
      params = params.append("skip", `${skip}`);
    }
    if (!!limit) {
      params = params.append("limit", `${limit}`);
    }
    if (!!branchId) {
      params = params.append("BranchId", `${branchId}`);
    }
    if (!!reference) {
      params = params.append("Reference", `${reference}`);
    }
    if (!!isActive) {
      params = params.append("isActive", `${isActive}`);
    }

    return this.httpClient
      .get<ApiModel<DeviceModel[]>>(
        `${environment.hostUrl + EndPoints.devices}`,
        { params }
      )
      .pipe();
  }

  getDevice(deviceId: string): Observable<ApiModel<DeviceModel>> {
    return this.httpClient
      .get<ApiModel<DeviceModel>>(
        `${environment.hostUrl + EndPoints.devices}/${deviceId}`
      )
      .pipe();
  }

  createDevice(persona: DeviceCreateModel): Observable<ApiModel<DeviceModel>> {
    return this.httpClient
      .post<ApiModel<DeviceModel>>(
        `${environment.hostUrl + EndPoints.devices}`,
        persona,
        httpOptions
      )
      .pipe();
  }

  editDevice(
    deviceId: string,
    device: DeviceEditModel
  ): Observable<ApiModel<any>> {
    return this.httpClient
      .put<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.devices}/${deviceId}/details`,
        device,
        httpOptions
      )
      .pipe();
  }

  assignDevice(deviceId: string, device: DeviceMoveModel): Observable<ApiModel<any>> {
      return this.httpClient.put<ApiModel<any>>(
        `${environment.hostUrl + EndPoints.devices}/${deviceId}/assign`,
        device,
        httpOptions
      ).pipe(
        catchError(this.handleError)
      )
  }

  changeDeviceState(deviceId: string, state: number): Observable<ApiModel<any>> {
    const payload = {
      state: state
    }
    return this.httpClient.put<ApiModel<any>>(
      `${environment.hostUrl + EndPoints.devices}/${deviceId}/state`, 
      payload, 
      httpOptions 
    )
      .pipe()
  }

  RegisterInstiqDevice(payload): Observable<ApiModel<any>> {
    return this.httpClient.patch<ApiModel<any>>(
      `${environment.hostUrl + EndPoints.devices}/register`, 
      payload, 
      httpOptions 
    )
      .pipe()
  }

  uploadBulkDevices(payload: any): Observable<ApiModel<any>> {
    const formData: FormData = new FormData();
    formData.append('file', payload, payload.name);
    return this.httpClient.post<ApiModel<any>>(
      `${environment.hostUrl + EndPoints.devices}/multiple`,
      formData,
      
    )
    .pipe();
  }
 

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    let errorList = [];

    switch (errorRes.status) {
      case 401:
        errorMessage = 'Un Authorized';
        break;
      case 400:
        errorList = errorRes.error.errors;
        errorMessage = errorRes.error.message;
        break;
      case 404:
          errorList = errorRes.error.errors;
          errorMessage = errorRes.error.message;
        break;
      case 500:
        errorMessage = 'Server Error';
    }
    if (errorList === undefined){
      return throwError(errorMessage);
    } else {
      return throwError(errorList);
    }
  }
}
