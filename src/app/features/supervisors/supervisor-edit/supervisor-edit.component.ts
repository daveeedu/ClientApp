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
  selector: 'app-supervisor-edit',
  templateUrl: './supervisor-edit.component.html',
  styleUrls: ['./supervisor-edit.component.scss']
})
export class SupervisorEditComponent implements OnInit {

  supervisorForm: FormGroup;
  loading = false;
  submitted = false;
  matcher = new MyErrorStateMatcher();
  applicationPaths = ApplicationPaths;

  branches: BranchModel[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<BranchModel[]>;

  supervisorId: string | null;
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
    this.supervisorId = this.route.snapshot.paramMap.get('supervisorId');
  }

  ngOnInit(): void {
    this.buildSupervisorForm();
    this.getSupervisorById();
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

  buildSupervisorForm() {
    this.supervisorForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      bvn: '',
      branchId: ['', Validators.required],
      branchName: ['', Validators.required]
    });
  }

  get formControls() {
    return this.supervisorForm.controls;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.supervisorForm.controls[controlName].hasError(errorName);
  };

  goBackToList() {
    this.router.navigate(this.applicationPaths.SupervisorPathComponents);
  }

  isFormInValid(): boolean {
    return this.supervisorForm.invalid;
  }

  getSupervisorById() {
    this.loading = true;
    this.personaService.getPersona(this.supervisorId).subscribe(
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
    this.supervisorForm.patchValue({
      fullName: persona.fullName,
      bvn: persona.bvn,
      branchName: persona.branchName,
      branchId: persona.branchId
    });
  }

  editSupervisor() {
    this.submitted = true;
    if (this.isFormInValid()) {
      return;
    }

    this.loading = true;

    const persona: PersonaEditModel = {
      accountType: PersonaTypes.supervisor,
      bvn: this.supervisorForm.value['bvn'],
      fullName: this.supervisorForm.value['fullName'],
      branchId: this.supervisorForm.value['branchId']
    }

    this.personaService.editPersona(this.supervisorId, persona).subscribe((result: ApiModel<any>) => {
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
    this.supervisorForm.patchValue({
      branchId: branch.id,
      branchName: branch.name
    });
  }

}
