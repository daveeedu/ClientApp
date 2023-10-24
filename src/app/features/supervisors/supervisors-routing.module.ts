import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ApplicationPaths} from "../../core/utils/constants";
import { SupervisorsListingComponent } from './supervisors-listing/supervisors-listing.component';
import { SupervisorEditComponent } from './supervisor-edit/supervisor-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SupervisorsListingComponent
  },
  {
    path: `${ApplicationPaths.SupervisorEdit}/:supervisorId`,
    component: SupervisorEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorsRoutingModule { }
