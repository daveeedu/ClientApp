import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../core/utils/error-state-matcher";
import {ApplicationPaths} from "../../../core/utils/constants";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../../../core/services/confirm-dialog.service";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {BranchService} from "../../../core/services/branch.service";
import {BranchEditModel, BranchModel} from "../../../core/models/branch.model";
import {ApiModel} from "../../../core/models/api.model";

@Component({
  selector: 'app-branch-edit',
  templateUrl: './branch-edit.component.html',
  styleUrls: ['./branch-edit.component.css']
})
export class BranchEditComponent implements OnInit {

  branchForm: FormGroup;
  loading = false;
  submitted = false;
  matcher = new MyErrorStateMatcher();
  applicationPaths = ApplicationPaths;

  branchId: string | null;
  @ViewChild('form') form: NgForm;
  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly dialogService: ConfirmDialogService,
    private readonly notificationService: NotificationService,
    private readonly branchService: BranchService,
    private readonly route: ActivatedRoute,
  ) {
    this.branchId = this.route.snapshot.paramMap.get('branchId');
  }

  ngOnInit(): void {
    this.buildBranchForm();
    this.getBranchById();
  }

  buildBranchForm() {
    this.branchForm = this.formBuilder.group({
      address: ['', Validators.required],
      branchCode: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', Validators.required],
      contactPhoneNumber: ['', Validators.required],
      subnet: ['', Validators.required],
    });
  }

  get formControls() {
    return this.branchForm.controls;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.branchForm.controls[controlName].hasError(errorName);
  };

  goBackToList() {
    this.router.navigate(this.applicationPaths.BranchPathComponents);
  }

  isFormInValid(): boolean {
    return this.branchForm.invalid;
  }

  getBranchById() {
    this.loading = true;
    this.branchService.getBranch(this.branchId).subscribe(
      (res: ApiModel<BranchModel>) => {
        this.loading = false;
        this.updateForm(res.data);
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.error);
        this.loading = false;
      }
    );
  }

  updateForm(branch: BranchModel) {
    this.branchForm.patchValue({
      address: branch.address,
      branchCode: branch.code,
      contactName: branch.contact.name,
      contactEmail: branch.contact.email,
      contactPhoneNumber: branch.contact.phoneNumber,
      subnet: branch.subnet,
    });
  }

  editBranch() {
    this.submitted = true;
    if (this.isFormInValid()) {
      return;
    }

    this.loading = true;

    const branch: BranchEditModel = {
      address: this.branchForm.value['address'],
      branchCode: this.branchForm.value['branchCode'],
      contact: {
        name: this.branchForm.value['contactName'],
        email: this.branchForm.value['contactEmail'],
        phoneNumber: this.branchForm.value['contactPhoneNumber']
      },
      subnet: this.branchForm.value['subnet']
    };

    console.log(branch)

    this.branchService.editBranch(this.branchId, branch).subscribe((result: ApiModel<any>) => {
      this.loading = false;
      this.goBackToList();
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.loading = false;
    });
  }
}
