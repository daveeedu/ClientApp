import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../core/utils/error-state-matcher";
import {ApplicationPaths} from "../../../core/utils/constants";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../../../core/services/confirm-dialog.service";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {ApiModel} from "../../../core/models/api.model";
import {DeviceService} from "../../../core/services/device.service";
import {DeviceModel, DeviceMoveModel} from "../../../core/models/device.model";
import {BranchService} from "../../../core/services/branch.service";
import {BranchModel} from "../../../core/models/branch.model";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
    selector: 'app-move-device',
    templateUrl: './move-device.component.html',
    styleUrls: ['./move-device.component.scss']
})

export class MoveDeviceComponent implements OnInit {
    deviceForm: FormGroup;
    loading = false;
    submitted = false;
    matcher = new MyErrorStateMatcher();
    branches: BranchModel[] = [];
    applicationPaths = ApplicationPaths;
    myControl = new FormControl();
  filteredOptions: Observable<BranchModel[]>;

    deviceId: string | null;
    @ViewChild('form') form: NgForm;

    constructor(
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly dialogService: ConfirmDialogService,
        private readonly notificationService: NotificationService,
        private readonly deviceService: DeviceService,
        private readonly route: ActivatedRoute,
        private readonly branchService: BranchService
    ) {
        this.deviceId = this.route.snapshot.paramMap.get('deviceId');
    }

    ngOnInit(): void {
        this.buildDeviceForm();
        this.getDeviceById();
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
          deviceId: [{value: '', disabled: true}],
          deviceName: [{value: '', disabled: true}],
          deviceIpAddress: ['', Validators.required],
          branchId: ['', Validators.required]
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

      getBranches() {
        this.branchService.getBranches().subscribe(
          (result: ApiModel<BranchModel[]>) => {
            this.branches = result.data;
          },
          (error) => {
            this.notificationService.showError(error);
          }
        );
      }
    
      getDeviceById() {
        this.loading = true;
        this.deviceService.getDevice(this.deviceId).subscribe(
          (res: ApiModel<DeviceModel>) => {
            this.loading = false;
            this.updateForm(res.data);
          },
          (error) => {
            this.notificationService.showError(error);
            this.loading = false;
          }
        );
      }
    
      updateForm(device: DeviceModel) {
        this.deviceForm.patchValue({
          deviceId: device.nibbsId,
          deviceName: device.identifier,
        });
      }
    
      moveDevice() {
        this.submitted = true;
        if (this.isFormInValid()) {
          this.notificationService.showError('Please fill all form input');
          return;
        }
        this.loading = true;
        const device: DeviceMoveModel = {
            branchId : this.deviceForm.value['branchId'],
            IpAddress: this.deviceForm.value['deviceIpAddress']
        }
        this.deviceService.assignDevice(this.deviceId, device).subscribe(response => {
            this.loading = false;
            this.notificationService.showSuccess(response.message)
            this.goBackToList();
        }, error=> {
          this.loading = false
          this.notificationService.showError(error);
        })
      }

      onBranchSelected(branch: BranchModel) {

        this.deviceForm.patchValue({
          branchId: branch.id,
        });
      }
}