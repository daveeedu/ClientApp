import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatSelectChange } from "@angular/material/select";
import { FormControl } from "@angular/forms";
import {
  StatusTypes,
  STATUS_ACTIVE,
  STATUS_DEACTIVATED,
  STATUS_SUSPENDED,
  ApplicationPaths,
  PersonaTypes,
  ApprovedItem,
  ApprovedItemName,
  PAGINATION_SKIP,
  PAGINATION_LIMIT,
  InActiveItem,
  ActiveItem,
} from "../../../core/utils/constants";
import { PersonaService } from "../../../core/services/persona.service";
import { PersonaModel } from "../../../core/models/persona.model";
import { ApiModel } from "../../../core/models/api.model";
import { NotificationService } from "../../../core/utils/services/notification.service";
import { Router } from "@angular/router";
import { ConfirmationModel } from "src/app/shared/confirmation-dialog/confirmation-dialog.component";
import { ConfirmDialogService } from "src/app/core/services/confirm-dialog.service";
import { BranchService } from "../../../core/services/branch.service";
import { BranchModel } from "../../../core/models/branch.model";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-supervisor-listing",
  templateUrl: "./supervisors-listing.component.html",
  styleUrls: ["./supervisors-listing.component.scss"],
})
export class SupervisorsListingComponent implements OnInit, OnDestroy {
  supervisors: PersonaModel[] = [];
  STATUS_DEACTIVATED = STATUS_DEACTIVATED;
  STATUS_ACTIVE = STATUS_ACTIVE;
  STATUS_SUSPENDED = STATUS_SUSPENDED;
  branches: BranchModel[] = [];
  isLoadingResults = true;
  filterSupervisors: string;
  filterSupervisorsStatus: boolean;
  branchId: string;
  supervisorStatuses = StatusTypes;
  skip = PAGINATION_SKIP;
  limit = PAGINATION_LIMIT;
  totalFilterLength = 0;
  applicationPaths = ApplicationPaths;
  approvedItem = ApprovedItem;
  approvedItemName = ApprovedItemName;
  filteredOptions: Observable<BranchModel[]>;
  myControl = new FormControl();

  inactiveItem = InActiveItem;
  activeItem = ActiveItem;

  supervisorsColumns: string[] = [
    "name",
    "id",
    "email",
    "branchName",
    "approvalStatus",
    "actions",
  ];

  obs$: Observable<any>;
  dataSource: MatTableDataSource<PersonaModel>;
  constructor(
    private readonly personaService: PersonaService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly dialogService: ConfirmDialogService,
    private readonly branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.fetchSupervisors();
    this.getBranches();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  onFilterMatSelectFieldChange(e: MatSelectChange) {
    this.filterSupervisorsStatus = e.value;

    this.fetchSupervisors();
  }

  private _filter(value: string): BranchModel[] {
    const filterValue = value.toLowerCase();

    return this.branches.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onPaginationChange(e: PageEvent) {
    this.skip = (e && e.pageIndex * e.pageSize) || 0;
    this.limit = (e && e.pageSize) || 25;
    this.fetchSupervisors();
  }

  fetchSupervisors() {
    this.isLoadingResults = true;
    this.personaService
      .getPersonas(
        this.skip,
        this.limit,
        PersonaTypes.supervisor,
        this.filterSupervisorsStatus,
        this.filterSupervisors,
        this.branchId
      )
      .subscribe(
        (result: ApiModel<PersonaModel[]>) => {
          console.log(result);
          this.totalFilterLength = result.total;
          this.supervisors = result.data;
          this.dataSource = new MatTableDataSource(this.supervisors);
          this.isLoadingResults = false;
        },
        (error) => {
          this.notificationService.showError(
            error?.error?.message || error?.error
          );
          this.isLoadingResults = false;
        }
      );
  }

  getBranches() {
    this.branchService.getBranches().subscribe(
      (result: ApiModel<BranchModel[]>) => {
        this.branches = result.data;
      },
      (error) => {
        this.notificationService.showError(
          error?.error?.message || error?.message
        );
      }
    );
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
  }

  editSupervisor(supervisorId: string) {
    this.router.navigate([
      this.applicationPaths.Supervisors,
      this.applicationPaths.SupervisorEdit,
      supervisorId,
    ]);
  }

  doFilter = (value: string) => {
    this.filterSupervisors = value;
    this.fetchSupervisors();
  };

  onToggle(row) {
    if (row.authState === "Inactive") {
      const options: ConfirmationModel = {
        title: "Confirm Activation",
        message: "Are you sure you want to Activate supervisor?",
        cancelText: "NO",
        confirmText: "YES",
        comment: null,
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe((confirmed) => {
        if (confirmed) {
          this.isLoadingResults = true;
          this.personaService.activatePerson(row.id).subscribe(
            (response) => {
              this.isLoadingResults = false;
              this.notificationService.showSuccess(response.message);
              this.fetchSupervisors();
            },
            (error) => {
              this.notificationService.showError(
                error?.error?.message || error?.error
              );
              this.isLoadingResults = false;
              this.fetchSupervisors();
            }
          );
        }
      });
    } else {
      const options: ConfirmationModel = {
        title: "Confirm Deactivation",
        message: "Are you sure you want to deactivate supervisor?",
        cancelText: "NO",
        confirmText: "YES",
        comment: null,
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe((confirmed) => {
        if (confirmed) {
          this.isLoadingResults = true;
          this.personaService.suspendPerson(row.id).subscribe(
            (response) => {
              this.isLoadingResults = false;
              this.notificationService.showSuccess(response.message);
              this.fetchSupervisors();
            },
            (error) => {
              this.notificationService.showError(
                error?.error?.message || error?.error
              );
              this.isLoadingResults = false;
              this.fetchSupervisors();
            }
          );
        }
      });
    }
  }

  deleteSupervisor(supervisorId: string) {
    const options: ConfirmationModel = {
      title: "Confirm Delete",
      message: "Are you sure you want to delete Supervisor?",
      cancelText: "NO",
      confirmText: "YES",
      comment: null,
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.isLoadingResults = true;
        this.personaService.deletePersona(supervisorId).subscribe(
          (response) => {
            this.isLoadingResults = false;
            this.notificationService.showSuccess(response.message);
            this.fetchSupervisors();
          },
          (error) => {
            this.notificationService.showError(
              error?.error?.message || error?.error
            );
            this.isLoadingResults = false;
          }
        );
      }
    });
  }

  onBranchSelected(branch: BranchModel) {
    this.branchId = branch.id;
    this.fetchSupervisors();
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
