import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./auth/components/login/login.component";
import {LayoutComponent} from "./core/layout/layout.component";
import {ApplicationPaths} from "./core/utils/constants";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: ApplicationPaths.Tellers,
        loadChildren: async () =>
          (await import('./features/teller/teller.module'))
            .TellerModule,
      },
      {
        path: ApplicationPaths.Supervisors,
        loadChildren: async () =>
          (await import('./features/supervisors/supervisors.module'))
            .SupervisorsModule,
      },
      {
        path: ApplicationPaths.Cso,
        loadChildren: async () =>
          (await import('./features/cso/cso.module'))
            .CsoModule,
      },
      {
        path: ApplicationPaths.Report,
        loadChildren: async () =>
          (await import('./features/report/report.module'))
            .ReportModule,
      },
      {
        path: ApplicationPaths.Devices,
        loadChildren: async () =>
          (await import('./features/device/device.module'))
            .DeviceModule,
      },
      {
        path: ApplicationPaths.Branches,
        loadChildren: async () =>
          (await import('./features/branch/branch.module'))
            .BranchModule,
      },
      {
        path: ApplicationPaths.Audit,
        loadChildren: async () =>
          (await import('./features/audit/audit.module'))
            .AuditModule,
      },
      {
        path: ApplicationPaths.Approvals,
        loadChildren: async () =>
          (await import('./features/approvals/approvals.module'))
            .ApprovalsModule,
      },
      {
        path: ApplicationPaths.Dashboard,
        loadChildren: async () =>
          (await import('./features/dashboard/dashboard.module'))
            .DashboardModule,
      },
      {
        path: ApplicationPaths.GeneralDistribution,
        loadChildren: async () =>
          (await import('./features/general-distribution/general-distribution.module'))
            .GeneralDistributionModule,
      },
    ],
   },
  {
    path: ApplicationPaths.Auth,
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
