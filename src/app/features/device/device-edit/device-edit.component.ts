import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../core/utils/error-state-matcher";
import {ApplicationPaths} from "../../../core/utils/constants";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../../../core/services/confirm-dialog.service";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {ApiModel} from "../../../core/models/api.model";
import {DeviceService} from "../../../core/services/device.service";
import {DeviceEditModel, DeviceModel} from "../../../core/models/device.model";

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.css']
})
export class DeviceEditComponent implements OnInit {

  deviceForm: FormGroup;
  loading = false;
  submitted = false;
  matcher = new MyErrorStateMatcher();
  applicationPaths = ApplicationPaths;

  deviceId: string | null;
  @ViewChild('form') form: NgForm;
  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly dialogService: ConfirmDialogService,
    private readonly notificationService: NotificationService,
    private readonly deviceService: DeviceService,
    private readonly route: ActivatedRoute,
  ) {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId');
  }

  ngOnInit(): void {
    this.buildDeviceForm();
    this.getDeviceById();
  }

  buildDeviceForm() {
    this.deviceForm = this.formBuilder.group({
      deviceId: ['', Validators.required],
      imeiNumber: ['', Validators.required],
    });
  }

  get formControls() {
    return this.deviceForm.controls;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.deviceForm.controls[controlName].hasError(errorName);
  };

  goBackToList() {
    this.router.navigate(this.applicationPaths.DevicePathComponents);
  }

  isFormInValid(): boolean {
    return this.deviceForm.invalid;
  }

  getDeviceById() {
    this.loading = true;
    this.deviceService.getDevice(this.deviceId).subscribe(
      (res: ApiModel<DeviceModel>) => {
        this.loading = false;
        this.updateForm(res.data);
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.error);
        this.loading = false;
      }
    );
  }

  updateForm(device: DeviceModel) {
    this.deviceForm.patchValue({
      deviceId: device.nibbsId,
      imeiNumber: device.identifier,
    });
  }

  editDevice() {
    this.submitted = true;
    if (this.isFormInValid()) {
      return;
    }

    this.loading = true;

    const device: DeviceEditModel = {
      identifier: this.deviceForm.value['imeiNumber'],
      nibbsId: this.deviceForm.value['deviceId']
    }

    console.log('edit device');
    console.log(device);

    this.deviceService.editDevice(this.deviceId, device).subscribe((result: ApiModel<any>) => {
      this.loading = false;
      this.goBackToList();
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.loading = false;
    });
  }

}
