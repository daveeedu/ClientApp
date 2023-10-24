import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiModel } from '../models/api.model';
import { ApprovalModel, ApprovalUpdateModel } from '../models/approval.model';
import { EndPoints } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class ApprovalsService {

constructor(private readonly httpClient: HttpClient) { }

getApprovals(): Observable<ApiModel<ApprovalModel[]>> {
  return this.httpClient
    .get<ApiModel<ApprovalModel[]>>(
      `${environment.hostUrl + EndPoints.approvals}`
    )
    .pipe();
}

updateApprovals(payload: ApprovalUpdateModel): Observable<ApiModel<any>> {
  return this.httpClient
    .post<ApiModel<any>>(
      `${environment.hostUrl + EndPoints.approvalreview}/${payload.state}`,
      payload
    )
    .pipe();
}

}
