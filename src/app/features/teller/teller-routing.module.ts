import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {TellerListingComponent} from "./teller-listing/teller-listing.component";
import {ApplicationPaths} from "../../core/utils/constants";
import {TellerCreateComponent} from "./teller-create/teller-create.component";
import {TellerEditComponent} from "./teller-edit/teller-edit.component";

const routes: Routes = [
  {
    path: '',
    component: TellerListingComponent
  },
  {
    path: `${ApplicationPaths.TellerCreate}`,
    component: TellerCreateComponent
  },
  {
    path: `${ApplicationPaths.TellerEdit}/:tellerId`,
    component: TellerEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TellerRoutingModule { }
