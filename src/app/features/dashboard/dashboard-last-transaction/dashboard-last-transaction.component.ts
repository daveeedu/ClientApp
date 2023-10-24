import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {
  StatusTypes,
  STATUS_ACTIVE,
  STATUS_DEACTIVATED,
  STATUS_SUSPENDED,
  TransactionTypes,
  ApplicationPaths, PersonaTypes, ApprovedItem, ApprovedItemName,
} from "../../../core/utils/constants";
import { DashboardModel, DashboardParams, LastTransactionModel } from 'src/app/core/models/dashboard.model';
import {ApiModel} from "../../../core/models/api.model";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {Router} from "@angular/router";
import { DashboardService } from '../../../core/services/dashboard.service';
import { ExportToCsv } from 'export-to-csv';

const options = { 
  fieldSeparator: ',',
  filename: `Last Transaction ${new Date().toLocaleDateString('en-US')}`,
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true, 
  showTitle: true,
  title: `Last Transaction ${new Date().toLocaleDateString('en-US')}`,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true
};

export interface ExportDataModel {
  branchName: string;
  branchCode: string;
  csmEmail: string;
  date: string;
  daysElapsed: number;
}

@Component({
  selector: 'app-dashboard-failed-transaction',
  templateUrl: './dashboard-last-transaction.component.html',
  styleUrls: ['./dashboard-last-transaction.component.scss'],
})
export class DashboardLastTransactionComponent implements OnInit, OnDestroy, AfterViewInit {
 current_datetime = new Date() 
  date = new FormControl(this.current_datetime);
  selectedLastTransactionType: FormControl;
  lastTransaction: LastTransactionModel[] = [];
  exportData: ExportDataModel[] = []
  STATUS_DEACTIVATED = STATUS_DEACTIVATED;
  STATUS_ACTIVE = STATUS_ACTIVE;
  STATUS_SUSPENDED = STATUS_SUSPENDED;
  transactionTypes = TransactionTypes

  isLoadingResults = true;
  StartTime: string | null = null;
  EndTime: string | null = null;

  lastTransactionColumn: string[] = ['branchName', 'branchCode', 'csmEmail', 'transactionDate', 'daysElapsed'];
  
  @ViewChild(MatSort) sort: MatSort;
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
    this.dataSource.sort = this.sort;
    this.fetchLastTransaction(this.date.value.getFullYear() + "-" + (this.date.value.getMonth() + 1) + "-" + this.date.value.getDate() + " " +this.date.value.getHours() + ":" + this.date.value.getMinutes() + ":" + this.date.value.getSeconds())
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
 
  fetchLastTransaction(date){
    this.isLoadingResults = true
    this.dashboardService.getLastTransaction(date).subscribe((result: ApiModel<DashboardModel[]>) => {
      let tmpLastTransaction = result.data;
      let objectArray=[]
        tmpLastTransaction.forEach(element => {
          let objectGet={
            branchCode:element.branchCode,
            branchName:element.branchName,
            csmEmail: element.csmEmail,
            value:this.selectedLastTransactionType.value,
            content:element[this.selectedLastTransactionType.value]
          }
          if (objectGet.content !== null && objectGet.content.daysElapsed !== 0) {
            objectArray.push(objectGet)
          }
      })
      this.lastTransaction = objectArray.sort(this.compare)
      this.dataSource = new MatTableDataSource(objectArray.sort(this.compare));
      this.isLoadingResults = false;
      
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.isLoadingResults = false;
    })
  }

  onExport() {
    this.lastTransaction.forEach(element=> {
      let {
        branchName,
        branchCode,
        csmEmail,
        content: {
            date,
            daysElapsed
          }
       } = element;

       this.exportData.push({branchName, branchCode, csmEmail, daysElapsed, date})
    })
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.exportData);
  }

  compare(a, b) {
    const bandA = a.content?.daysElapsed
    const bandB = b.content?.daysElapsed
  
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison * -1;
  }
  

  onChangeEvent() {
    this.fetchLastTransaction(this.date.value.getFullYear() + "-" + (this.date.value.getMonth() + 1) + "-" + this.date.value.getDate() + " " +this.date.value.getHours() + ":" + this.date.value.getMinutes() + ":" + this.date.value.getSeconds())
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
