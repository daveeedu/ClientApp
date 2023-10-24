import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatSelectChange } from "@angular/material/select";
import { FormControl, FormGroup } from "@angular/forms";
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
import { DashboardService } from "../../../core/services/dashboard.service";
import { FeedbackModel } from "src/app/core/models/report.model";
import { ExportToCsv } from "export-to-csv";
import { AuditActivity } from "src/app/core/models/dashboard.model";
import { AuditModel } from 'src/app/core/models/audit.model';


const options = {
    fieldSeparator: ",",
    filename: `Report_Activity-Active ${new Date().toLocaleDateString("en-US")}`,
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: true,
    title: `Report_Activity-Active ${new Date().toLocaleDateString("en-US")}`,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

  interface ExportDataModel {
    transactionType: string;
    transactionDate: Date | string;
    transactingAccountName: string;
    transactingAccountNumber: string;
    transactionAmount: number;
    transactingBVN: string;
    beneficiaryAccountNumber: string;
    authorizer: string;
    branchCode: string;
    status: boolean;
  }

@Component({
  selector: 'app-audit-listing',
  templateUrl: './audit-listing.component.html',
  styleUrls: ['./audit-listing.component.scss']
})
export class AuditListingComponent implements OnInit, OnDestroy {
  audits: AuditModel[] = [];
  STATUS_DEACTIVATED = STATUS_DEACTIVATED;
  STATUS_ACTIVE = STATUS_ACTIVE;
  STATUS_SUSPENDED = STATUS_SUSPENDED;
  branches: BranchModel[] = [];
  isLoadingResults = true;
  filterReport: string;
  filterReportsStatus: boolean;
  branchId: string;
  staffId: string;
  supervisorStatuses = StatusTypes;
  skip = PAGINATION_SKIP;
  limit = PAGINATION_LIMIT;
  totalFilterLength = 0;
  applicationPaths = ApplicationPaths;
  approvedItem = ApprovedItem;
  approvedItemName = ApprovedItemName;
  filteredOptions: Observable<BranchModel[]>;
  myControl = new FormControl();
  categoryFilteringControl: FormControl = new FormControl(0);
  range: FormGroup;
  inactiveItem = InActiveItem;
  activeItem = ActiveItem;


  auditColumns: string[] = [
    'transactionType',
    'transactionDate',
    'transactingAccountNumber',
    'transactionAmount',
    'transactingBVN',
    'beneficiaryAccountNumber',
    'authorizer',
    'branchCode',
    'status'
  ];


  obs$: Observable<any>;
  dataSource: MatTableDataSource<AuditModel>;
  constructor(
    private readonly personaService: PersonaService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly dialogService: ConfirmDialogService,
    private readonly branchService: BranchService,
    private readonly dashboardService: DashboardService
  ) {
    this.selectedFilter = new FormControl(this.filter[0].value);
  }

  auditStatus: AuditActivity[] = [];
  exportData: ExportDataModel[] = [];
  selectedFilter: FormControl;
  filter = [
    { value: true, name: "Successful" },
    { value: false, name: "Failed" },
  ];

  ngOnInit(): void {
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
    this.dataSource = new MatTableDataSource([]);
    this.getAudit(
      this.categoryFilteringControl.value,
      this.range.value.start,
      this.range.value.end
    );
    // this.getBranches();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  onFilterMatSelectFieldChange(e: MatSelectChange) {
    this.filterReportsStatus = e.value;

    this.getAudit(
      this.categoryFilteringControl.value,
      this.range.value.start.toISOString(),
      this.range.value.end.toISOString()
    );
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
    this.getAudit(
      this.categoryFilteringControl.value,
      this.range.value.start,
      this.range.value.end
    );
  }

getAudit(filterValue, startDate, EndDate) {
    this.isLoadingResults = true;
    this.dashboardService
      .getAudit(filterValue, this.filterReport, startDate, EndDate)
      .subscribe(
        (response: ApiModel<AuditModel[]>) => {
          this.isLoadingResults = false;
          this.totalFilterLength = response.total;
          this.audits = response.data;
          console.log(this.audits);
          this.dataSource = new MatTableDataSource(this.audits);
          console.log(this.dataSource);
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

//   getBranches() {
//     this.branchService.getBranches().subscribe(
//       (result: ApiModel<BranchModel[]>) => {
//         this.branches = result.data;
//       },
//       (error) => {
//         this.notificationService.showError(
//           error?.error?.message || error?.message
//         );
//       }
//     );
//   }

  // onCategoryFilteringChange() {
  //   this.getAudit(
  //     this.categoryFilteringControl.value,
  //     this.range.value.start?.toISOString(),
  //     this.range.value.end?.toISOString()
  //   );
  // }

  onChange() {
    if (this.range.value.start !== null && this.range.value.end !== null) {
      this.getAudit(
        this.categoryFilteringControl.value,
        this.range.value.start.toISOString(),
        this.range.value.end.toISOString()
      );
    }
  }

  doFilter = (value: string) => {
    this.filterReport = value;
    if (this.range.value.start && this.range.value.end) {
    this.getAudit(
      this.categoryFilteringControl.value,
      this.range.value.start.toISOString(),
      this.range.value.end.toISOString()
    );
    }
  };

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  onExport() {
    this.exportData = [];
    this.audits.forEach((element) => {
      this.exportData.push({
        transactionType: element.transactionType,
        transactionDate: element.transactionDate,
        transactingAccountName: element.transactingAccountName,
        transactingAccountNumber: element.transactingAccountNumber,
        transactionAmount: element.transactionAmount,
        transactingBVN: element.transactingBVN,
        beneficiaryAccountNumber: element.beneficiaryAccountNumber,
        authorizer: element.authorizer,
        branchCode: element.branchCode,
        status: element.status
      });
    });
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.exportData);
  }
}
