import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ApplicationPaths} from "../core/utils/constants";
import {LoginComponent} from "./components/login/login.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ApplicationPaths.SignIn,
  },
  { path: ApplicationPaths.SignIn, component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
