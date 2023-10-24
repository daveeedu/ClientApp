import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ApplicationPaths} from "../../core/utils/constants";
import { CsoListingComponent } from './cso-listing/cso-listing.component';
import { CsoEditComponent } from './cso-edit/cso-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CsoListingComponent
  },
  {
    path: `${ApplicationPaths.CsoEdit}/:csoId`,
    component: CsoEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CsoRoutingModule { }
