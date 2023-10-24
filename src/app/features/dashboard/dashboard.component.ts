import { Component, OnInit } from "@angular/core";
import { ApiModel } from "src/app/core/models/api.model";
import {
  DashboardModel,
  DashboardParams,
  ReportModel,
} from "src/app/core/models/dashboard.model";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { FormGroup, FormControl } from "@angular/forms";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  filterStatus = "default";
  range: FormGroup;
  dashboardData: DashboardModel[] = [];
  defaultReport: ReportModel;
  displayedColumns: string[] = [
    "date",
    "branch",
    "3pSuccess",
    "3pFail",
    "cashSuccess",
    "cashFail",
    "selfSuccess",
    "selfFail",
    "ubaSuccess",
    "ubaFail",
    "nipSuccess",
    "nipFail",
    "volume",
  ];

  StartTime: string | null = null;
  EndTime: string | null = null;
  isLoadingResults: boolean = false;

  generalRatingType = "bar";
  generalRatingData = null;

  horizontalBarChart = "horizontalBar";
  topFiveBranchesData = null;
  topFiveServicesData = null;
  topTenBranchesData = null;
  bottomTenBranchesData = null;
  topTenServicesData = null;
  bottomTenServicesData = null;

  options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRation: 3,
    cutoutPercentage: 50,
    indexAxis: "y",
    legend: {
      display: false,
      position: "right",
    },
  };

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit() {
    this.getDashboardData();
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });

    this.getDefaultReport(this.range.value.start, this.range.value.end);
  }

  getDashboardData() {
    this.isLoadingResults = true;
    const params: DashboardParams = {
      startTime: this.StartTime,
      endTime: this.EndTime,
    };

    this.dashboardService.getTransactions(params).subscribe(
      (response: ApiModel<DashboardModel[]>) => {
        this.isLoadingResults = false;
        this.dashboardData = response.data;
      },
      (error) => {
        this.isLoadingResults = false;
      }
    );
  }

  toggleFilter(status: string) {
    this.filterStatus = status;
    var currentDate = new Date();

    switch (status) {
      case "current month":
        this.StartTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        ).toISOString();
        this.EndTime = currentDate.toISOString();
        break;

      case "current week":
        var first = currentDate.getDate() - currentDate.getDay();
        this.StartTime = new Date(currentDate.setDate(first)).toISOString();
        this.EndTime = currentDate.toISOString();
        break;

      case "default":
        this.StartTime = null;
        this.EndTime = null;
        break;
    }
    this.getDashboardData();
  }

  getDefaultReport(startTime, endTime, tabIndex = 0) {
    this.isLoadingResults = true;
    this.dashboardService.getReport(startTime, endTime, tabIndex).subscribe(
      (response: ApiModel<ReportModel>) => {
        this.isLoadingResults = false;
        if (response !== null) {
          console.log(response.data);
          this.defaultReport = response.data;
          if (this.defaultReport.generalRatings) {
            this.generalRatingData = {
              labels: ["Poor", "Bad", "Good", "V. Good", "Excellent"],
              datasets: [
                {
                  data: [
                    response.data.generalRatings.poorCount,
                    response.data.generalRatings.badCount,
                    response.data.generalRatings.goodCount,
                    response.data.generalRatings.veryGoodCount,
                    response.data.generalRatings.excellentCount,
                  ],
                  fill: true,
                  barPercentage: 0.5,
                  backgroundColor: "rgb(33, 150, 83)",
                },
              ],
            };

            this.topFiveBranchesData = {
              labels: this.defaultReport.topBranches.map((branch) => {
                return branch.name;
              }),
              datasets: [
                {
                  data: this.defaultReport.topBranches.map((branch) => {
                    return branch.rateAverage;
                  }),
                  fill: true,
                  barPercentage: 0.8,
                  backgroundColor: "rgb(45, 216, 147)",
                },
              ],
            };

            this.topFiveServicesData = {
              labels: this.defaultReport.topServices.map((services) => {
                return services.name;
              }),
              datasets: [
                {
                  data: this.defaultReport.topServices.map((services) => {
                    return services.rateAverage;
                  }),
                  fill: true,
                  barPercentage: 0.8,
                  backgroundColor: "rgb(47, 128, 237)",
                },
              ],
            };
          }

          if (this.defaultReport.buttonBranches) {
            this.topTenBranchesData = {
              labels: this.defaultReport.topBranches.map((branch) => {
                return branch.name;
              }),
              datasets: [
                {
                  data: this.defaultReport.topBranches.map((branch) => {
                    return branch.rateAverage;
                  }),
                  fill: true,
                  barPercentage: 0.9,
                  backgroundColor: "#2DD893",
                },
              ],
            };

            this.bottomTenBranchesData = {
              labels: this.defaultReport.buttonBranches.map((branch) => {
                return branch.name;
              }),
              datasets: [
                {
                  data: this.defaultReport.buttonBranches.map((branch) => {
                    return branch.rateAverage;
                  }),
                  fill: true,
                  barPercentage: 0.9,
                  backgroundColor: "#EA1401",
                },
              ],
            };
          }

          if (this.defaultReport.buttonServices) {
            this.topTenServicesData = {
              labels: this.defaultReport.topServices.map((services) => {
                return services.name;
              }),
              datasets: [
                {
                  data: this.defaultReport.topServices.map((services) => {
                    return services.rateAverage;
                  }),
                  fill: true,
                  barPercentage: 0.8,
                  backgroundColor: "rgb(47, 128, 237)",
                },
              ],
            };

            this.bottomTenServicesData = {
              labels: this.defaultReport.buttonServices.map((services) => {
                return services.name;
              }),
              datasets: [
                {
                  data: this.defaultReport.buttonServices.map((services) => {
                    return services.rateAverage;
                  }),
                  fill: true,
                  barPercentage: 0.9,
                  backgroundColor: "#EA1401",
                },
              ],
            };
          }
        }
      },
      (error) => {
        this.isLoadingResults = false;
        console.log(error);
      }
    );
  }

  onTabChange(event: MatTabChangeEvent) {
    this.range.setValue({
      start: null,
      end: null,
    });
    this.getDefaultReport(
      this.range.value.start,
      this.range.value.end,
      event.index
    );
  }

  onChange(tabIndex: number) {
    console.log(this.range.value);
    if (this.range.value.start !== null && this.range.value.end !== null) {
      this.getDefaultReport(
        this.range.value.start.toISOString(),
        this.range.value.end.toISOString(),
        tabIndex
      );
    }
  }
}
