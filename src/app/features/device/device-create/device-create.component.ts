import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../core/utils/error-state-matcher";
import {ApplicationPaths} from "../../../core/utils/constants";
import {Router} from "@angular/router";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {ConfirmDialogService} from "../../../core/services/confirm-dialog.service";
import {ConfirmationModel} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {ApiModel} from "../../../core/models/api.model";
import {DeviceService} from "../../../core/services/device.service";
import {DeviceCreateModel, DeviceModel} from "../../../core/models/device.model";
import {BranchModel} from "../../../core/models/branch.model";
import {BranchService} from "../../../core/services/branch.service";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-device-create',
  templateUrl: './device-create.component.html',
  styleUrls: ['./device-create.component.scss']
})
export class DeviceCreateComponent implements OnInit {
  deviceForm: FormGroup;
  loading = false;
  submitted = false;
  branches: BranchModel[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<BranchModel[]>;

  matcher = new MyErrorStateMatcher();
  applicationPaths = ApplicationPaths;
  selectedSubnet = '';

  @ViewChild('form') form: NgForm;
  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly dialogService: ConfirmDialogService,
    private readonly notificationService: NotificationService,
    private readonly deviceService: DeviceService,
    private readonly branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.buildDeviceForm();
    this.getBranches();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): BranchModel[] {
    const filterValue = value.toLowerCase();

    return this.branches.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(branch: BranchModel): string {
    return branch.name ;
  }

  buildDeviceForm() {
    this.deviceForm = this.formBuilder.group({
      deviceId: ['', Validators.required],
      imeiNumber: ['', Validators.required],
      branchId: ['', Validators.required]
    });
  }

  get formControls() {
    return this.deviceForm.controls;
  }

  private get branchControl(): AbstractControl | null {
    return this.deviceForm.get('branchId');
  }

  hasError = (controlName: string, errorName: string) => {
    return this.deviceForm.controls[controlName].hasError(errorName);
  };

  openDialog(): void {
    const options: ConfirmationModel = {
      title: 'Created Successfully',
      message: 'Would you like to add another?',
      cancelText: 'YES',
      confirmText: 'NO',
      comment: null,
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.goBackToList();
      }
    });
  }

  goBackToList() {
    this.router.navigate(this.applicationPaths.DevicePathComponents);
  }

  isFormInValid(): boolean {
    return this.deviceForm.invalid;
  }

  createDevice() {
    this.submitted = true;
    if (this.isFormInValid()) {
      return;
    }

    this.loading = true;

    const deviceCreateModel: DeviceCreateModel = {
      branchId: this.deviceForm.value['branchId'],
      identifier: this.deviceForm.value['imeiNumber'],
      nibbsId: this.deviceForm.value['deviceId'],
      state: 1,
      ipAddress: this.selectedSubnet,
      type: 0
    };

    this.deviceService.createDevice(deviceCreateModel).subscribe((result: ApiModel<DeviceModel>) => {
      this.loading = false;
      this.goBackToList();
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.loading = false;
    });
  }

  getBranches() {
    this.branchService.getBranches().subscribe(
      (result: ApiModel<BranchModel[]>) => {
        this.branches = result.data;
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
      }
    );
  }

  reset() {
    this.submitted = false;
    this.form.resetForm();
    this.deviceForm.markAsUntouched();
  }

  onBranchSelected(branch: BranchModel) {
    this.selectedSubnet = branch.subnet;

      this.deviceForm.patchValue({
        branchId: branch.id,
      });
    }
}
