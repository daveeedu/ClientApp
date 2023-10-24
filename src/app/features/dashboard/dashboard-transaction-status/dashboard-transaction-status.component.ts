import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatSelectChange} from "@angular/material/select";
import {
Transactions
} from "../../../core/utils/constants";
import { DashboardModel, DashboardParams, TransactionStatusModel } from 'src/app/core/models/dashboard.model';
import {ApiModel} from "../../../core/models/api.model";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {Router} from "@angular/router";
import { DashboardService } from '../../../core/services/dashboard.service';
import { ExportToCsv } from 'export-to-csv';

const options = { 
  fieldSeparator: ',',
  filename: `Transaction_Status ${new Date().toLocaleDateString('en-US')}`,
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true, 
  showTitle: true,
  title: `Transaction_Status ${new Date().toLocaleDateString('en-US')}`,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true
};

@Component({
  selector: 'app-dashboard-failed-transaction',
  templateUrl: './dashboard-transaction-status.component.html',
  styleUrls: ['./dashboard-transaction-status.component.scss']

})
export class DashboardTransactionStatusComponent  implements OnInit {

  transactionStatus
  isLoadingResults = true;
  StartTime: string | null = null;
  EndTime: string | null = null;
  transactions = Transactions
  exportData: TransactionStatusModel[] = []
  transactionStatusColumn: string[] = ['transactionType', 'total', 'success', 'failure', 'percentageSuccess'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  obs$: Observable<any>;
  dataSource: MatTableDataSource<DashboardModel[]>;
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
    ) { }

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

    this.dashboardService.getTransactionsOverView().subscribe((result: ApiModel<DashboardModel>) => {

      this.transactionStatus = result['data'];
      const tmpResult: any = [] 
      for (const key in this.transactionStatus) {
        const element = this.transactionStatus[key];
        if( key !== 'date' && key !== 'volume' ) {
          tmpResult.push({
            transactionType: key,
            success: element.success,
            failure: element.failure,
            successRate: element.successRate,
            failureRate: element.failureRate
          })
        }
      }
      tmpResult.forEach(element => {
          if(element.transactionType === 'thirdPartyDeposit') {
            element.transactionType = this.transactions.thirdPartyDeposit
          } else if (element.transactionType === 'cashWithdrawal') {
            element.transactionType = this.transactions.cashWithdrawal
          } else if (element.transactionType === 'selfDeposit') {
            element.transactionType = this.transactions.selfDeposit
          } else if (element.transactionType === 'intraBankTransfer') {
            element.transactionType = this.transactions.intraBankTransfer
          } else if (element.transactionType = 'nipTransfer') {
            element.transactionType = this.transactions.nipTransfer
          }
      });
      this.exportData = tmpResult;
      this.dataSource = tmpResult
      this.isLoadingResults = false;
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.isLoadingResults = false;
    })
  }

  onExport() {
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.exportData);
  }
}