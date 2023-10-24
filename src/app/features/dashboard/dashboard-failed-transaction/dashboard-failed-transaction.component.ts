import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatSelectChange} from "@angular/material/select";
import {
  StatusTypes,
  STATUS_ACTIVE,
  STATUS_DEACTIVATED,
  STATUS_SUSPENDED,
  TransactionTypes
} from "../../../core/utils/constants";
import {FormControl} from '@angular/forms';
import { DashboardModel, DashboardParams } from 'src/app/core/models/dashboard.model';
import {ApiModel} from "../../../core/models/api.model";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {Router} from "@angular/router";
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-failed-transaction',
  templateUrl: './dashboard-failed-transaction.component.html',
  styleUrls: ['./dashboard-failed-transaction.component.scss']
})
export class DashboardFailedTransactionComponent implements OnInit, OnDestroy {

  failedTransaction: any = [];
  STATUS_DEACTIVATED = STATUS_DEACTIVATED;
  STATUS_ACTIVE = STATUS_ACTIVE;
  STATUS_SUSPENDED = STATUS_SUSPENDED;
  selectedLastTransactionType: FormControl;

  isLoadingResults = true;
  StartTime: string | null = null;
  EndTime: string | null = null;

  failedTransactionColumn: string[] = ['branchName', 'branchCode', 'count', 'percentageFailure'];
  transactionTypes = TransactionTypes

  @ViewChild(MatPaginator) paginator: MatPaginator;

  obs$: Observable<any>;
  dataSource: MatTableDataSource<DashboardModel>;
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
    ) {
      this.selectedLastTransactionType = new FormControl(this.transactionTypes[0].value)
     }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.fetchFailedTransaction();
  }
  fetchFailedTransaction(){
    this.isLoadingResults = true;
    const params: DashboardParams = {
      startTime: this.StartTime,
      endTime: this.EndTime
    }
    this.dashboardService.getTransactions(params).subscribe((result: ApiModel<DashboardModel[]>) => {
      let tmpFailedTransaction = result.data;  
      let objectArray=[]   
      tmpFailedTransaction.forEach(element => {
        let objectGet={
          branchCode:element.branchCode,
          branchName:element.branchName,
          value:this.selectedLastTransactionType.value,
          content:element[this.selectedLastTransactionType.value]
        }
        if (objectGet.content !== null && objectGet.content.failure !== 0) {
          objectArray.push(objectGet)
        }
      })
      this.dataSource = new MatTableDataSource(objectArray);
      this.isLoadingResults = false;

    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.isLoadingResults = false;
    })
  }

  onChangeEvent() {
    this.fetchFailedTransaction()
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}

