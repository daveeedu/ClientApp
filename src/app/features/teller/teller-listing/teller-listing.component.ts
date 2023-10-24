import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatSelectChange } from "@angular/material/select";
import {FormControl} from "@angular/forms";
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
import {BranchService} from "../../../core/services/branch.service";
import {BranchModel} from "../../../core/models/branch.model";
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: "app-teller-listing",
  templateUrl: "./teller-listing.component.html",
  styleUrls: ["./teller-listing.component.scss"],
})
export class TellerListingComponent implements OnInit, OnDestroy {
  tellers: PersonaModel[] = [];
  STATUS_DEACTIVATED = STATUS_DEACTIVATED;
  STATUS_ACTIVE = STATUS_ACTIVE;
  STATUS_SUSPENDED = STATUS_SUSPENDED;
  branches: BranchModel[] = [];
  isLoadingResults = true;
  filterTellers: string;
  filterTellerStatus: boolean;
  branchId: string;
  tellerStatuses = StatusTypes;
  skip = PAGINATION_SKIP;
  limit = PAGINATION_LIMIT;
  totalFilterLength = 0;
  applicationPaths = ApplicationPaths;
  approvedItem = ApprovedItem;
  approvedItemName = ApprovedItemName;
  filteredOptions: Observable<BranchModel[]>;
  myControl = new FormControl();

  filterTellersByStaffId: string;

  inactiveItem = InActiveItem;
  activeItem = ActiveItem;

  tellerColumns: string[] = [
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
    this.fetchTellers();
    this.getBranches();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  onFilterMatSelectFieldChange(e: MatSelectChange) {
    this.filterTellerStatus = e.value;

    this.fetchTellers();
  }

  private _filter(value: string): BranchModel[] {
    const filterValue = value.toLowerCase();

    return this.branches.filter(option => option.code.toLowerCase().indexOf(filterValue) === 0);
  }

  onPaginationChange(e: PageEvent) {
    this.skip = (e && e.pageIndex * e.pageSize) || 0;
    this.limit = (e && e.pageSize) || 25;
    this.fetchTellers();
  }

  fetchTellers() {
    this.isLoadingResults = true;
    this.personaService
      .getPersonas(
        this.skip,
        this.limit,
        PersonaTypes.teller,
        this.filterTellerStatus,
        this.filterTellers,
        this.filterTellersByStaffId,
        this.branchId
      )
      .subscribe(
        (result: ApiModel<PersonaModel[]>) => {
          console.log(result);
          this.totalFilterLength = result.total;
          this.tellers = result.data;
          this.dataSource = new MatTableDataSource(this.tellers);
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
        this.notificationService.showError(error?.error?.message || error?.message);
      }
    );
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
  }

  editTeller(tellerId: string) {
    this.router.navigate([
      this.applicationPaths.Tellers,
      this.applicationPaths.TellerEdit,
      tellerId,
    ]);
  }

  doFilter = (value: string) => {
    this.filterTellers = value;
    this.fetchTellers();
  };

  doFilterByStaffId = (value: string) => {
    this.filterTellersByStaffId = value;
    this.fetchTellers();
  };
  onToggle(row) {
    if(row.authState === "Inactive") {
      const options: ConfirmationModel = {
        title: "Confirm Activation",
        message: "Are you sure you want to Activate teller?",
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
              this.fetchTellers();
            },
            (error) => {
              this.notificationService.showError(
                error?.error?.message || error?.error
              );
              this.isLoadingResults = false;
              this.fetchTellers();
            }
          );
        }
      });
    } else {
      const options: ConfirmationModel = {
        title: "Confirm Deactivation",
        message: "Are you sure you want to deactivate teller?",
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
              this.fetchTellers();
            },
            (error) => {
              this.notificationService.showError(
                error?.error?.message || error?.error
              );
              this.isLoadingResults = false;
              this.fetchTellers();
            }
          );
        }
      });
    }
  }

  deleteTeller(tellerId: string) {
    const options: ConfirmationModel = {
      title: "Confirm Delete",
      message: "Are you sure you want to delete teller?",
      cancelText: "NO",
      confirmText: "YES",
      comment: null,
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.isLoadingResults = true;
        this.personaService.deletePersona(tellerId).subscribe(
          (response) => {
            this.isLoadingResults = false;
            this.notificationService.showSuccess(response.message);
            this.fetchTellers();
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
    this.branchId = branch.id
    this.fetchTellers()
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
}
