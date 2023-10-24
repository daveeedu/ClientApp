import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { BranchModel } from 'src/app/core/models/branch.model';
import {
  STATUS_DEACTIVATED,
  STATUS_ACTIVE,
  STATUS_SUSPENDED,
  StatusTypes,
  ApplicationPaths, ApprovedItem, ApprovedItemName
} from 'src/app/core/utils/constants';
import {ApiModel} from "../../../core/models/api.model";
import {BranchService} from "../../../core/services/branch.service";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-branch-listing',
  templateUrl: './branch-listing.component.html',
  styleUrls: ['./branch-listing.component.scss']
})
export class BranchListingComponent implements OnInit {

  branches: BranchModel[] = [];
  STATUS_DEACTIVATED = STATUS_DEACTIVATED;
  STATUS_ACTIVE = STATUS_ACTIVE;
  STATUS_SUSPENDED = STATUS_SUSPENDED;

  isLoadingResults = true;
  filterBranches: string;
  filterBranchStatus = null;
  branchStatuses = StatusTypes;

  applicationPaths = ApplicationPaths;

  approvedItem = ApprovedItem;
  approvedItemName = ApprovedItemName;

  branchColumns: string[] = ['branchCode', 'branchName', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  obs$: Observable<any>;
  dataSource: MatTableDataSource<BranchModel>;

  constructor(private readonly branchService: BranchService, private readonly notificationService: NotificationService,
              private readonly router: Router) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.fetchBranches();
  }

  onFilterMatSelectFieldChange(e: MatSelectChange) {
    this.filterBranchStatus = e.value;

  }

  fetchBranches(){
    this.isLoadingResults = true;
    this.branchService.getBranches().subscribe((result: ApiModel<BranchModel[]>) => {
      this.branches = result.data;
      console.log(this.branches)
      this.dataSource = new MatTableDataSource(this.branches);
      this.isLoadingResults = false;
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.error);
      this.isLoadingResults = false;
    })
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
  }

  editBranch(branchId: string) {
    this.router.navigate([
      this.applicationPaths.Branches,
      this.applicationPaths.BranchEdit,
      branchId,
    ]);
  }

  doFilter = (value: string) => {
    this.dataSource.filter = value;
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

}
