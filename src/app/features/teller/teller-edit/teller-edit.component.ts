  import { BranchService } from './../../../core/services/branch.service';
  import {Component, OnInit, ViewChild} from '@angular/core';
  import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
  import {MyErrorStateMatcher} from "../../../core/utils/error-state-matcher";
  import {ApplicationPaths, PersonaTypes,AccountTypes} from "../../../core/utils/constants";
  import {ActivatedRoute, Router} from "@angular/router";
  import {ConfirmDialogService} from "../../../core/services/confirm-dialog.service";
  import {NotificationService} from "../../../core/utils/services/notification.service";
  import {PersonaService} from "../../../core/services/persona.service";
  import {PersonaEditModel, PersonaModel,AccountType} from "../../../core/models/persona.model";
  import {ApiModel} from "../../../core/models/api.model";
  import { BranchModel } from 'src/app/core/models/branch.model';
  import { Observable } from 'rxjs';
  import { map, startWith } from 'rxjs/operators';


  @Component({
    selector: 'app-teller-edit',
    templateUrl: './teller-edit.component.html',
    styleUrls: ['./teller-edit.component.css']
  })
  export class TellerEditComponent implements OnInit {

    tellerForm: FormGroup;
    loading = false;
    submitted = false;
    matcher = new MyErrorStateMatcher();
    applicationPaths = ApplicationPaths;
    accountTypes: AccountType[] = AccountTypes;
    branches: BranchModel[] = [];
    myControl = new FormControl();
    filteredOptions: Observable<BranchModel[]>;

    tellerId: string | null;
    @ViewChild('form') form: NgForm;
    constructor(
      private readonly router: Router,
      private readonly formBuilder: FormBuilder,
      private readonly dialogService: ConfirmDialogService,
      private readonly notificationService: NotificationService,
      private readonly personaService: PersonaService,
      private readonly route: ActivatedRoute,
      private readonly branchService: BranchService
    ) {
      this.tellerId = this.route.snapshot.paramMap.get('tellerId');
    }

    ngOnInit(): void {
      this.buildTellerForm();
      this.getTellerById();
      this.getBranches();

      this.filteredOptions = this.tellerForm.get('branchName').valueChanges.pipe(
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
        fullName: ['', Validators.required],
        bvn: ['', Validators.required],
        branchId: ['', Validators.required],
        branchName: ['', Validators.required],
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

    goBackToList() {
      this.router.navigate(this.applicationPaths.TellerPathComponents);
    }

    isFormInValid(): boolean {
      return this.tellerForm.invalid;
    }

    getTellerById() {
      this.loading = true;
      this.personaService.getPersona(this.tellerId).subscribe(
        (res: ApiModel<PersonaModel>) => {
          this.loading = false;
          this.updateForm(res.data);
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || error?.error);
          this.loading = false;
        }
      );
    }

    updateForm(persona: PersonaModel) {
      this.tellerForm.patchValue({
        fullName: persona.fullName,
        bvn: persona.bvn,
        branchName: persona.branchName,
        branchId: persona.branchId
      });
    }

    editTeller() {
      this.submitted = true;
      if (this.isFormInValid()) {
        return;
      }

      this.loading = true;

      const persona: PersonaEditModel = {
        bvn: this.tellerForm.value['bvn'],
        fullName: this.tellerForm.value['fullName'],
        branchId: this.tellerForm.value['branchId'],
        accountType: this.tellerForm.value['accountType']
      }

      this.personaService.editPersona(this.tellerId, persona).subscribe((result: ApiModel<any>) => {
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

    onBranchSelected(branch: BranchModel) {
      this.tellerForm.patchValue({
        branchId: branch.id,
        branchName: branch.name
      });
    }

  }

