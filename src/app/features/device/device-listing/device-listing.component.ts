import {Component, OnInit,} from '@angular/core';
import {
  StatusTypes,
  STATUS_ACTIVE,
  STATUS_DEACTIVATED,
  STATUS_SUSPENDED,
  ApprovedItem,
  DeviceStates, 
  DeviceStateNames, 
  ApprovedItemName, 
  ApplicationPaths,
  PAGINATION_LIMIT,
  PAGINATION_SKIP
} from "../../../core/utils/constants";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatSelectChange} from "@angular/material/select";
import {DeviceModel} from "../../../core/models/device.model";
import {DeviceService} from "../../../core/services/device.service";
import {ApiModel} from "../../../core/models/api.model";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {Router} from "@angular/router";
import {ConfirmDialogService} from "../../../core/services/confirm-dialog.service";

export interface ConfirmationModel {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  comment: string | null;
}

@Component({
  selector: 'app-device-listing',
  templateUrl: './device-listing.component.html',
  styleUrls: ['./device-listing.component.scss']
})
export class DeviceListingComponent implements OnInit {

  devices: DeviceModel[] = [];
  STATUS_DEACTIVATED = STATUS_DEACTIVATED;
  STATUS_ACTIVE = STATUS_ACTIVE;
  STATUS_SUSPENDED = STATUS_SUSPENDED;

  isLoadingResults = false;
  filterDevices: string;
  filterDeviceStatus: string;
  deviceStatuses = StatusTypes;

  applicationPaths = ApplicationPaths;
  skip = PAGINATION_SKIP;
  limit = PAGINATION_LIMIT;
  totalFilterLength = 0

  approvedItem = ApprovedItem;
  approvedItemName = ApprovedItemName;
  deviceStates = DeviceStates;
  deviceStateNames = DeviceStateNames;

  deviceColumns: string[] = ['deviceId', 'imeiNumber', 'ipAddress', 'branchCode', 'dateEnrolled', 'enrolledBy', 'deviceStatus', 'actions'];

  obs$: Observable<any>;
  dataSource: MatTableDataSource<DeviceModel>;
  constructor(
              private readonly deviceService: DeviceService, 
              private readonly notificationService: NotificationService,
              private readonly router: Router,
              private readonly dialogService: ConfirmDialogService
              ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.fetchDevices();
  }

  onFilterMatSelectFieldChange(e: MatSelectChange) {
    this.filterDeviceStatus = e.value;
    this.fetchDevices();
  }

  onPaginationChange(e: PageEvent) {
    this.skip = (e && e.pageIndex * e.pageSize) || 0;
    this.limit = (e && e.pageSize) || 25;
    this.fetchDevices();
  }

  fetchDevices(){
    this.isLoadingResults = true;
    let branchId = '';
    this.deviceService.getDevices(this.skip, this.limit, this.filterDeviceStatus, branchId, this.filterDevices).subscribe((result: ApiModel<DeviceModel[]>) => {
      this.totalFilterLength = result.total
      this.devices = result.data;
      console.log(this.devices)
      this.dataSource = new MatTableDataSource(this.devices);
      this.isLoadingResults = false;
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.isLoadingResults = false;
    })
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
  }

  editDevice(deviceId: string) {
    this.router.navigate([
      this.applicationPaths.Devices,
      this.applicationPaths.DeviceEdit,
      deviceId,
    ]);
  }

  moveDevice(deviceId: string) {
    this.router.navigate([
      this.applicationPaths.Devices,
      this.applicationPaths.DeviceMove,
      deviceId,
    ]);
  }

  onToggle(data) {
    if(data.state === this.deviceStates.inactive) {
      const options: ConfirmationModel = {
        title: 'Confirm Activation',
        message: 'Are you sure you want to Activate device?',
        cancelText: 'NO',
        confirmText: 'YES',
        comment: null,
      };
      this.dialogService.open(options)
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.isLoadingResults = true
          this.deviceService.changeDeviceState(data.id, this.deviceStates.active).subscribe(response=> {
            this.isLoadingResults = false
            this.notificationService.showSuccess(response.message)
            this.fetchDevices()
          },
          error=> {
            this.notificationService.showError(error?.error?.message || error?.error);
            this.isLoadingResults = false;
            this.fetchDevices()
          })
        }
      })
    } else {
      const options: ConfirmationModel = {
        title: 'Confirm Deactivation',
        message: 'Are you sure you want to Deactivate device?',
        cancelText: 'NO',
        confirmText: 'YES',
        comment: null,
      };
      this.dialogService.open(options)
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.isLoadingResults = true
          this.deviceService.changeDeviceState(data.id, this.deviceStates.inactive).subscribe(response=> {
            this.isLoadingResults = false
            this.notificationService.showSuccess(response.message)
            this.fetchDevices()
          },
          error=> {
            this.notificationService.showError(error?.error?.message || error?.error);
            this.isLoadingResults = false;
            this.fetchDevices()
          })
        }
      })
    }
  }

  registerInstiqDevice(data) {
    const payload = []
    payload.push(data.identifier)
    this.deviceService.RegisterInstiqDevice(payload).subscribe(response=> {
      this.isLoadingResults = false
      this.notificationService.showSuccess(response.message)
      this.fetchDevices()
    },
    error=> {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.isLoadingResults = false;
      this.fetchDevices()
    })
  }

  doFilter = (value: string) => {
    this.filterDevices = value
    this.fetchDevices()
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
