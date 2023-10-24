import { BranchService } from './../../../core/services/branch.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../core/utils/error-state-matcher";
import {ApplicationPaths, PersonaTypes} from "../../../core/utils/constants";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../../../core/services/confirm-dialog.service";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {PersonaService} from "../../../core/services/persona.service";
import {PersonaEditModel, PersonaModel} from "../../../core/models/persona.model";
import {ApiModel} from "../../../core/models/api.model";
import { BranchModel } from 'src/app/core/models/branch.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-cso-edit',
  templateUrl: './cso-edit.component.html',
  styleUrls: ['./cso-edit.component.scss']
})
export class CsoEditComponent implements OnInit {

  csoForm: FormGroup;
  loading = false;
  submitted = false;
  matcher = new MyErrorStateMatcher();
  applicationPaths = ApplicationPaths;

  branches: BranchModel[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<BranchModel[]>;

  csoId: string | null;
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
    this.csoId = this.route.snapshot.paramMap.get('csoId');
  }

  ngOnInit(): void {
    this.buildCsoForm();
    this.getCsoById();
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

  buildCsoForm() {
    this.csoForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      bvn: '',
      branchId: ['', Validators.required],
      branchName: ['', Validators.required]
    });
  }

  get formControls() {
    return this.csoForm.controls;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.csoForm.controls[controlName].hasError(errorName);
  };

  goBackToList() {
    this.router.navigate(this.applicationPaths.CsoPathComponents);
  }

  isFormInValid(): boolean {
    return this.csoForm.invalid;
  }

  getCsoById() {
    this.loading = true;
    this.personaService.getPersona(this.csoId).subscribe(
      (res: ApiModel<PersonaModel>) => {
        this.loading = false;
        console.log(res.data)
        this.updateForm(res.data);
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.error);
        this.loading = false;
      }
    );
  }

  updateForm(persona: PersonaModel) {
    this.csoForm.patchValue({
      fullName: persona.fullName,
      bvn: persona.bvn,
      branchName: persona.branchName,
      branchId: persona.branchId
    });
  }

  editCso() {
    this.submitted = true;
    if (this.isFormInValid()) {
      return;
    }

    this.loading = true;

    const persona: PersonaEditModel = {
      accountType: PersonaTypes.Cso,
      bvn: this.csoForm.value['bvn'],
      fullName: this.csoForm.value['fullName'],
      branchId: this.csoForm.value['branchId']
    }

    this.personaService.editPersona(this.csoId, persona).subscribe((result: ApiModel<any>) => {
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
    this.csoForm.patchValue({
      branchId: branch.id,
      branchName: branch.name
    });
  }

}
