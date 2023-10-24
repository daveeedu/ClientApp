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
  selector: "app-cso-listing",
  templateUrl: "./cso-listing.component.html",
  styleUrls: ["./cso-listing.component.scss"],
})
export class CsoListingComponent implements OnInit, OnDestroy {
  cso: PersonaModel[] = [];
  STATUS_DEACTIVATED = STATUS_DEACTIVATED;
  STATUS_ACTIVE = STATUS_ACTIVE;
  STATUS_SUSPENDED = STATUS_SUSPENDED;
  branches: BranchModel[] = [];
  isLoadingResults = true;
  filterCso: string;
  filterCsoStatus: boolean;
  branchId: string;
  csoStatuses = StatusTypes;
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

  csoColumns: string[] = [
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
    this.fetchCso();
    this.getBranches();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  onFilterMatSelectFieldChange(e: MatSelectChange) {
    this.filterCsoStatus = e.value;

    this.fetchCso();
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
    this.fetchCso();
  }

  fetchCso() {
    this.isLoadingResults = true;
    this.personaService
      .getPersonas(
        this.skip,
        this.limit,
        PersonaTypes.Cso,
        this.filterCsoStatus,
        this.filterCso,
        this.branchId
      )
      .subscribe(
        (result: ApiModel<PersonaModel[]>) => {
          console.log(result);
          this.totalFilterLength = result.total;
          this.cso = result.data;
          this.dataSource = new MatTableDataSource(this.cso);
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

  editCso(csoId: string) {
    this.router.navigate([
      this.applicationPaths.Cso,
      this.applicationPaths.CsoEdit,
      csoId,
    ]);
  }

  doFilter = (value: string) => {
    this.filterCso = value;
    this.fetchCso();
  };

  onToggle(row) {
    if (row.authState === "Inactive") {
      const options: ConfirmationModel = {
        title: "Confirm Activation",
        message: "Are you sure you want to Activate cso?",
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
              this.fetchCso();
            },
            (error) => {
              this.notificationService.showError(
                error?.error?.message || error?.error
              );
              this.isLoadingResults = false;
              this.fetchCso();
            }
          );
        }
      });
    } else {
      const options: ConfirmationModel = {
        title: "Confirm Deactivation",
        message: "Are you sure you want to deactivate cso?",
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
              this.fetchCso();
            },
            (error) => {
              this.notificationService.showError(
                error?.error?.message || error?.error
              );
              this.isLoadingResults = false;
              this.fetchCso();
            }
          );
        }
      });
    }
  }

  deleteCso(csoId: string) {
    const options: ConfirmationModel = {
      title: "Confirm Delete",
      message: "Are you sure you want to delete Cso?",
      cancelText: "NO",
      confirmText: "YES",
      comment: null,
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.isLoadingResults = true;
        this.personaService.deletePersona(csoId).subscribe(
          (response) => {
            this.isLoadingResults = false;
            this.notificationService.showSuccess(response.message);
            this.fetchCso();
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
    this.fetchCso();
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
