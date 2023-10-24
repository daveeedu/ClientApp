import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DeviceModel } from 'src/app/core/models/device.model';
import { DeviceService } from 'src/app/core/services/device.service';
import { ApplicationPaths } from 'src/app/core/utils/constants';
import { NotificationService } from 'src/app/core/utils/services/notification.service';

@Component({
  selector: 'app-device-create-multiple',
  templateUrl: './device-create-multiple.component.html',
  styleUrls: ['./device-create-multiple.component.scss']
})
export class DeviceCreateMultipleComponent implements OnInit {

  loading = false;
  applicationPaths = ApplicationPaths;
  uploadedCSVFile: any;

  fileToUpload: File | null = null;
  devicesArray: DeviceModel[] = [];

  numberOfRows: number;
  isCSVFileTooLarge = false;
  uploadedCSVJSON: any;
  allowedBatchCount = 100;

  formData: FormData;
  
  isLoading = new BehaviorSubject(false);
  isLoading$ = this.isLoading.asObservable();


  csvUploadFormGroup = new FormGroup({
    file: new FormControl(undefined, Validators.required),
  });

  constructor(
    private readonly router: Router,
    private readonly deviceService: DeviceService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  isValidCSVFile(file: File): boolean {
    return (
      (file && file.name.endsWith('.csv')) ||
      (file && file.name.endsWith('.xls'))
    );
  }

  uploadCSVFile(event: any){
    this.fileToUpload = (event.target as HTMLInputElement).files[0];

    if(this.isValidCSVFile(this.fileToUpload)) {
      const reader = new FileReader();
      reader.readAsText(this.fileToUpload);
      let csvRecordsArray: any[] = [];
      let headersRow: string[];

      reader.onload = async () => {
        const csvData = reader.result;
        csvRecordsArray = (csvData as string).split(/\r\n|\n/);
        this.numberOfRows = csvRecordsArray.length;
        this.isCSVFileTooLarge = this.numberOfRows - 1 > this.allowedBatchCount; // minus header line

        this.csvUploadFormGroup.controls.file.patchValue(this.fileToUpload);
        headersRow = this.getFileHeader(csvRecordsArray);
        const csvRecords = this.getDataRecordsFromCSVFile(
          csvRecordsArray,
          headersRow,
          headersRow.length
        );
        this.uploadedCSVJSON = csvRecords;
      };
    }
  }

  getDataRecordsFromCSVFile(
    csvRecordsArray: any,
    headersRow: string[],
    headerLength: any
  ) {
    const csvData = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const currentRecord = (csvRecordsArray[i] as string).split(',');
      if (currentRecord.length === headerLength) {
        const csvRecord: any = {};
        for (let j = 0; j < headersRow.length; j++) {
          csvRecord[headersRow[j]] = currentRecord[j].trim();
        }
        csvData.push(csvRecord);
      }
      if (csvData.length === this.allowedBatchCount) {
        break;
      }
    }
    return csvData;
  }

  getFileHeader(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray: string[] = [];

    for (const a of headers) {
      headerArray.push(a);
    }
    return headerArray;
  }

  sendDevicesCSV(){
    this.loading = true;
    this.deviceService.uploadBulkDevices(this.fileToUpload).subscribe(
      (_) => {
        this.loading = false;
        this.notificationService.showSuccess('Success');
        this.fileToUpload = null;
        this.router.navigate([ApplicationPaths.Devices]);
      }, (error) => {
        this.loading = false;
        this.notificationService.showError(error?.error?.message || error?.error);
        this.fileToUpload = null;
      }
    )
  }

}
