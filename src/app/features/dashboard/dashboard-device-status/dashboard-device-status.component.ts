import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import { DeviceActivity } from 'src/app/core/models/dashboard.model';
import {ApiModel} from "../../../core/models/api.model";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {Router} from "@angular/router";
import { DashboardService } from '../../../core/services/dashboard.service';
import { FormControl } from '@angular/forms';
import { ExportToCsv } from 'export-to-csv';

const options = { 
  fieldSeparator: ',',
  filename: `Device_Activity-Active ${new Date().toLocaleDateString('en-US')}`,
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true, 
  showTitle: true,
  title: `Device_Activity-Active ${new Date().toLocaleDateString('en-US')}`,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
};

interface ExportDataModel {
  identifier: string; 
  branchName: string;
  branchCode: string;
  lastRecordedActivity: string
}

@Component({
  selector: 'app-dashboard-device-status',
  templateUrl: './dashboard-device-status.component.html',
  styleUrls: ['./dashboard-device-status.component.scss']
})
export class DashboardDeviceStatusComponent implements OnInit {

  deviceStatus: DeviceActivity[] = [];
  exportData: ExportDataModel[] = []
  selectedFilter: FormControl
  filter = [
    { value: true, name: 'Active' },
    { value: false, name: 'Inactive' }
  ]
  isLoadingResults = true;

  deviceStatusColumn: string[] = ['id', 'branchName', 'branchCode', 'lastActiveDate', 'email'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  obs$: Observable<any>;
  dataSource: MatTableDataSource<DeviceActivity>;
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
    ) { 
      this.selectedFilter = new FormControl(this.filter[0].value)
    }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.fetchDeviceActivity();
  }

  fetchDeviceActivity(){
    this.isLoadingResults = true;

    this.dashboardService.getDeviceActivity(this.selectedFilter.value).subscribe((result: ApiModel<DeviceActivity[]>) => {
        this.deviceStatus = result.data;
        this.dataSource = new MatTableDataSource(this.deviceStatus);
        this.isLoadingResults = false;
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.isLoadingResults = false;
    })
  }

  onExport() {
    this.deviceStatus.forEach(element => {
      let { identifier, branchName, branchCode, lastRecordedActivity } = element
      this.exportData.push(
        {identifier, branchName, branchCode, lastRecordedActivity}
      )
    });
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.exportData);
  }

  onChangeEvent() {
    this.fetchDeviceActivity()
  }

}


