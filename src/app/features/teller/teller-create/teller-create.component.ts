import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../core/utils/error-state-matcher";
import {AccountTypes, ApplicationPaths, EmailRegex} from "../../../core/utils/constants";
import {Router} from "@angular/router";
import {ConfirmDialogService} from "../../../core/services/confirm-dialog.service";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {ConfirmationModel} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {AccountType, PersonaCreateModel} from "../../../core/models/persona.model";
import {PersonaService} from "../../../core/services/persona.service";
import {ApiModel} from "../../../core/models/api.model";
import {BranchModel} from "../../../core/models/branch.model";
import {BranchService} from "../../../core/services/branch.service";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-teller-create',
  templateUrl: './teller-create.component.html',
  styleUrls: ['./teller-create.component.scss']
})
export class TellerCreateComponent implements OnInit {
  tellerForm: FormGroup;
  loading = false;
  submitted = false;
  branches: BranchModel[] = [];
  accountTypes: AccountType[] = AccountTypes;
  myControl = new FormControl();
  filteredOptions: Observable<BranchModel[]>;

  matcher = new MyErrorStateMatcher();
  applicationPaths = ApplicationPaths;
  @ViewChild('form') form: NgForm;
  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly dialogService: ConfirmDialogService,
    private readonly notificationService: NotificationService,
    private readonly personaService: PersonaService,
    private readonly branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.buildTellerForm();
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

  buildTellerForm() {
    this.tellerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      staffId: ['', Validators.required],
      bvn: [''],
      email: ['', [Validators.required, Validators.pattern(EmailRegex)]],
      branchId: ['', Validators.required],
      accountType: ['', Validators.required]
    });
  }

  get formControls() {
    return this.tellerForm.controls;
  }

  get accountType () {
    return this.tellerForm.controls['accountType'].value;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.tellerForm.controls[controlName].hasError(errorName);
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

  goBackToList() {
    this.router.navigate(this.applicationPaths.TellerPathComponents);
  }

  isFormInValid(): boolean {
    return this.tellerForm.invalid;
  }

  createTeller() {
    console.log('teller works')
    this.submitted = true;
    if (this.isFormInValid()) {
      return;
    }

    this.loading = true;

    const persona: PersonaCreateModel = {
      accountType: this.tellerForm.value['accountType'],
      branchId: this.tellerForm.value['branchId'],
      bvn: this.tellerForm.value['bvn'],
      emailAddress: this.tellerForm.value['email'],
      fullName: `${this.tellerForm.value['firstName']} ${this.tellerForm.value['lastName']}`,
      staffId: this.tellerForm.value['staffId']
    }

    this.personaService.createPersona(persona).subscribe((result: ApiModel<any>) => {
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
    this.tellerForm.markAsUntouched();
  }

  onBranchSelected(branch: BranchModel) {

      this.tellerForm.patchValue({
        branchId: branch.id,
      });
    }
}
