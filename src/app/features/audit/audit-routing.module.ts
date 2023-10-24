import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ApplicationPaths} from "../../core/utils/constants";
import {AuditListingComponent} from './audit-listing/audit-listing.component';

const routes: Routes = [
    {
        path: '',
        component: AuditListingComponent
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AuditRoutingModule { }
