import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import { GeneralDistributionComponent } from './general-distribution.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralDistributionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralDistributionRoutingModule { }
