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
import { ReportActivity } from "src/app/core/models/dashboard.model";

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
  solId: string;
  staffId: string;
  staffName: string;
  branchName: string;
  totalTransactions: number;
  excellent: number;
  veryGood: number;
  good: number;
  average: number;
  poor: number;
  totalRatedTransaction: number;
}

@Component({
  selector: "app-supervisor-listing",
  templateUrl: "./report-listing.component.html",
  styleUrls: ["./report-listing.component.scss"],
})
export class ReportListingComponent implements OnInit, OnDestroy {
  reports: FeedbackModel[] = [];
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


  staffReportColumns: string[] = [
    "solId",
    "staffId",
    "staffName",
    "branchName",
    "totalTransaction",
    "excellent",
    "veryGood",
    "good",
    "average",
    "poor",
    "averageRating",
    "totalRatedTransaction",
  ];

  branchReportColumns: string[] = [
    "solId",
    "branchName",
    "totalTransaction",
    "excellent",
    "veryGood",
    "good",
    "average",
    "poor",
    "averageRating",
    "totalRatedTransaction",
  ];

  transactionReportColumns: string[] = [
    "serviceName",
    "totalTransaction",
    "excellent",
    "veryGood",
    "good",
    "average",
    "poor",
    "averageRating",
    "totalRatedTransaction",
  ];

  obs$: Observable<any>;
  dataSource: MatTableDataSource<FeedbackModel>;
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

  reportStatus: ReportActivity[] = [];
  exportData: ExportDataModel[] = [];
  selectedFilter: FormControl;
  filter = [
    { value: true, name: "Active" },
    { value: false, name: "Inactive" },
  ];

  ngOnInit(): void {
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
    this.dataSource = new MatTableDataSource([]);
    this.getFeedback(
      this.categoryFilteringControl.value,
      this.range.value.start,
      this.range.value.end
    );
    this.getBranches();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  onFilterMatSelectFieldChange(e: MatSelectChange) {
    this.filterReportsStatus = e.value;

    this.getFeedback(
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
    this.getFeedback(
      this.categoryFilteringControl.value,
      this.range.value.start,
      this.range.value.end
    );
  }

  getFeedback(filterValue, startDate, EndDate) {
    this.isLoadingResults = true;
    this.dashboardService
      .getFeedback(filterValue, this.filterReport, startDate, EndDate)
      .subscribe(
        (response: ApiModel<FeedbackModel[]>) => {
          this.isLoadingResults = false;
          this.totalFilterLength = response.total;
          this.reports = response.data;
          console.log(this.reports);
          this.dataSource = new MatTableDataSource(this.reports);
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

  onCategoryFilteringChange() {
    this.getFeedback(
      this.categoryFilteringControl.value,
      this.range.value.start?.toISOString(),
      this.range.value.end?.toISOString()
    );
  }

  onChange() {
    if (this.range.value.start !== null && this.range.value.end !== null) {
      this.getFeedback(
        this.categoryFilteringControl.value,
        this.range.value.start.toISOString(),
        this.range.value.end.toISOString()
      );
    }
  }

  doFilter = (value: string) => {
    this.filterReport = value;
    this.getFeedback(
      this.categoryFilteringControl.value,
      this.range.value.start.toISOString(),
      this.range.value.end.toISOString()
    );
  };

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  onExport() {
    this.exportData = [];
    this.reports.forEach((element) => {
      this.exportData.push({
        solId: element.staff.branchCode,
        staffId: element.staff.staffId,
        staffName: element.staff.staffName,
        branchName: element.branchName,
        totalTransactions: element.totalTransactions,
        excellent: element.excellent,
        veryGood: element.veryGood,
        good: element.good,
        average: element.average,
        poor: element.poor,
        totalRatedTransaction: element.percentage,
      });
    });
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.exportData);
  }   
}
      



