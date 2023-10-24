import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiModel } from "../models/api.model";
import {
  DashboardModel,
  DashboardParams,
  DeviceActivity,
  TellerActivityModel,
  ReportModel,
} from "../models/dashboard.model";
import { FeedbackModel } from "../models/report.model";
import { EndPoints } from '../utils/constants';
import { AuditModel } from 'src/app/core/models/audit.model';


@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private readonly httpClient: HttpClient) {}

  getTransactions(
    model: DashboardParams
  ): Observable<ApiModel<DashboardModel[]>> {
    let params = new HttpParams();
    if (!!model.startTime) {
      params = params.append("StartTime", `${model.startTime}`);
    }
    if (!!model.endTime) {
      params = params.append("EndTime", `${model.endTime}`);
    }

    return this.httpClient
      .get<ApiModel<DashboardModel[]>>(
        `${environment.hostUrl + EndPoints.dashboardReport}`,
        { params }
      )
      .pipe();
  }

  getTransactionsOverView(): Observable<ApiModel<DashboardModel>> {
    return this.httpClient
      .get<ApiModel<DashboardModel>>(
        `${environment.hostUrl + EndPoints.dashboardReportOverview}`
      )
      .pipe();
  }

  getDeviceActivity(isActive): Observable<ApiModel<DeviceActivity[]>> {
    return this.httpClient
      .get<ApiModel<DeviceActivity[]>>(
        `${
          environment.hostUrl + EndPoints.dashboardDeviceActivity
        }?IsActive=${isActive}`
      )
      .pipe();
  }

  getTellerActivity(
    isActive: boolean
  ): Observable<ApiModel<TellerActivityModel[]>> {
    return this.httpClient
      .get<ApiModel<TellerActivityModel[]>>(
        `${
          environment.hostUrl + EndPoints.dashboardTellerActivity
        }?IsActive=${isActive}`
      )
      .pipe();
  }

  getLastTransaction(param): Observable<ApiModel<DashboardModel[]>> {
    return this.httpClient
      .get<ApiModel<DashboardModel[]>>(
        `${
          environment.hostUrl + EndPoints.dashboardReportLastTransaction
        }?date=${param}`
      )
      .pipe();
  }

  getFeedback(filter, searchValue, startDate, endDate): Observable<ApiModel<FeedbackModel[]>> {
    let params = new HttpParams();
    params = params.append("Filter", `${filter}`);
    if (!!searchValue) {
      params = params.append("FilterValue", `${searchValue}`);
    }
    if (!!startDate) {
      params = params.append("StartDate", `${startDate}`);
    }

    if (!!endDate) {
      params = params.append("EndDate", `${endDate}`);
    }

    return this.httpClient
      .get<ApiModel<FeedbackModel[]>>(
        `${environment.hostUrl}${EndPoints.feedback}`,
        { params }
      )
      .pipe();
  }

  getAudit(filter, searchValue, startDate, endDate): Observable<ApiModel<AuditModel[]>> {
    let params = new HttpParams();
    let headers = new HttpHeaders();
    params = params.append("Filter", `${filter}`);
    if (!!searchValue) {
      params = params.append("FilterValue", `${searchValue}`);
    }
    if (!!startDate) {
      params = params.append("StartDate", `${startDate}`);
    }

    if (!!endDate) {
      params = params.append("EndDate", `${endDate}`);
    }

    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    return this.httpClient
      .get<ApiModel<AuditModel[]>>(
        `${environment.hostUrl}${EndPoints.auditLog}`,
        { params, headers},
      )
      .pipe();
  }

  getReport(startTime, endTime, tabIndex): Observable<ApiModel<ReportModel>> {
    let params = new HttpParams();
    if (!!startTime) {
      params = params.append("From", `${startTime}`);
    }
    if (!!endTime) {
      params = params.append("To", `${endTime}`);
    }
    params = params.append("ReportType", `${tabIndex}`);
    return this.httpClient
      .get<ApiModel<ReportModel>>(
        `${environment.hostUrl}${EndPoints.defaultReport}`,
        { params }
      )
      .pipe();
  }
}


