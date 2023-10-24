import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ApplicationPaths } from 'src/app/core/utils/constants';
import { MyErrorStateMatcher } from 'src/app/core/utils/error-state-matcher';
import { NotificationService } from 'src/app/core/utils/services/notification.service';
import { ConfirmationModel } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import {BranchService} from "../../../core/services/branch.service";
import {ApiModel} from "../../../core/models/api.model";
import {BranchCreateModel, BranchModel} from "../../../core/models/branch.model";

@Component({
  selector: 'app-branch-create',
  templateUrl: './branch-create.component.html',
  styleUrls: ['./branch-create.component.scss']
})
export class BranchCreateComponent implements OnInit {
  branchForm: FormGroup;
  loading = false;
  submitted = false;
  matcher = new MyErrorStateMatcher();
  applicationPaths = ApplicationPaths;
  @ViewChild('form') form: NgForm;
  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly dialogService: ConfirmDialogService,
    private readonly notificationService: NotificationService,
    private readonly branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.buildBranchForm();
  }

  buildBranchForm() {
    this.branchForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', Validators.required],
      contactPhoneNumber: ['', Validators.required],
      country: ['', Validators.required],
      subnet: ['', Validators.required],
    });
  }

  get formControls() {
    return this.branchForm.controls;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.branchForm.controls[controlName].hasError(errorName);
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
    this.router.navigate(this.applicationPaths.BranchPathComponents);
  }

  isFormInValid(): boolean {
    return this.branchForm.invalid;
  }

  createBranch() {
    this.submitted = true;
    if (this.isFormInValid()) {
      return;
    }

    this.loading = true;

    const branchCreateModel: BranchCreateModel = {
      address: this.branchForm.value['address'],
      code: this.branchForm.value['code'],
      contact: {
        name: this.branchForm.value['contactName'],
        email: this.branchForm.value['contactEmail'],
        phoneNumber: this.branchForm.value['contactPhoneNumber']
      },
      country: this.branchForm.value['country'],
      name: this.branchForm.value['name'],
      subnet: this.branchForm.value['subnet']
    };

    this.branchService.createBranch(branchCreateModel).subscribe((result: ApiModel<BranchModel>) => {
      this.loading = false;
      this.goBackToList();
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.loading = false;
    });
  }

  reset() {
    this.submitted = false;
    this.form.resetForm();
    this.branchForm.markAsUntouched();
  }

}
