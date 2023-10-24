import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DistributionModel } from 'src/app/core/models/general-distribution.model';
import { DistributionService } from 'src/app/core/services/distribution.service';
import { ApplicationPaths } from 'src/app/core/utils/constants';
import { NotificationService } from 'src/app/core/utils/services/notification.service';

@Component({
  selector: 'app-general-distribution',
  templateUrl: './general-distribution.component.html',
  styleUrls: ['./general-distribution.component.scss']
})
export class GeneralDistributionComponent implements OnInit {
  applicationPaths = ApplicationPaths;
  distributionArray: DistributionModel[] = [];
  loading = false;
  uploadedCSVFile: any;
  uploadedCSVJSON: any;
  fileToUpload: File | null = null;
  numberOfRows: number;
  isCSVFileTooLarge = false;
  allowedBatchCount = 100;

  csvUploadFormGroup = new FormGroup({
    file: new FormControl(undefined, Validators.required),
  });

  constructor(
    private readonly distributionService: DistributionService,
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

  getFileHeader(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray: string[] = [];

    for (const a of headers) {
      headerArray.push(a);
    }
    return headerArray;
  }

  uploadCSVFile(event: any){
    this.fileToUpload = (event.target as HTMLInputElement).files[0];

    if(this.isValidCSVFile(this.fileToUpload)) {
      const reader = new FileReader();
      reader.readAsBinaryString(this.fileToUpload);
      let csvRecordsArray: any[] = [];
      let headersRow: string[];

      reader.onload = (event: any) => {
        const csvData = event.target.result;
        const csvRecordsArray = csvData.split(/\r\n|\n/);
        if(csvRecordsArray[csvRecordsArray.length-1] ===''){
          csvRecordsArray.pop()
        }
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

        for (let index = 1; index < csvRecordsArray.length; index++) {
          const csvData = csvRecordsArray[index].split(',');
          this.distributionArray.push(
            new DistributionModel(csvData[0].trim(), csvData[1].trim(), csvData[1].trim(), csvData[2].trim(), csvData[3].trim(), csvData[7].trim(), csvData[8].trim(), csvData[9].trim(), csvData[10].trim(), csvData[11].trim(), csvData[12].trim(), csvData[13].trim(), csvData[14].trim(), csvData[15].trim())
          )
        }
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

  sendDevicesCSV(){
    console.log(this.distributionArray);
    this.loading = true;
    this.distributionService.createDistribution(this.distributionArray).subscribe(
      (_) => {
        this.loading = false;
        this.notificationService.showSuccess('Success');
        this.fileToUpload = null;
        this.distributionArray = [];
        window.location.reload(true);
      },
      (error) => {
        this.loading = false;
        this.notificationService.showError(error?.error?.message || error?.error);
      }
    )
  }

}
