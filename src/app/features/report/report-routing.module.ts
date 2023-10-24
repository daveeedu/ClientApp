import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ReportListingComponent} from "./report-listing/report-listing.component";
import {ApplicationPaths} from "../../core/utils/constants";

const routes: Routes = [
  {
    path: '',
    component: ReportListingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }
