import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ApplicationPaths} from "../../core/utils/constants";
import { BranchCreateComponent } from './branch-create/branch-create.component';
import { BranchListingComponent } from './branch-listing/branch-listing.component';
import {BranchEditComponent} from "./branch-edit/branch-edit.component";

const routes: Routes = [
  {
    path: '',
    component: BranchListingComponent
  },
  {
    path: `${ApplicationPaths.BranchCreate}`,
    component: BranchCreateComponent
  },
  {
    path: `${ApplicationPaths.BranchEdit}/:branchId`,
    component: BranchEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class BranchRoutingModule { }
