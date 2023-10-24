import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardDeviceStatusComponent } from './dashboard-device-status/dashboard-device-status.component';
import { DashboardFailedTransactionComponent } from './dashboard-failed-transaction/dashboard-failed-transaction.component';
import { DashboardTransactionStatusComponent } from './dashboard-transaction-status/dashboard-transaction-status.component';
import { DashboardLastTransactionComponent } from './dashboard-last-transaction/dashboard-last-transaction.component';
import { DashboardTellerActivityComponent } from './dashboard-teller-activity/dashboard-teller-activity.component';

const routes: Routes = [

    { path: '', component: DashboardComponent },
    { path: 'deviceStatus', component: DashboardDeviceStatusComponent },
    { path: 'transactionStatus',component: DashboardTransactionStatusComponent },
    { path: 'tellerActivity', component: DashboardTellerActivityComponent },
    { path: 'lastTransaction',component: DashboardLastTransactionComponent },
    { path: 'failedTransaction', component: DashboardFailedTransactionComponent }
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashbardRoutingModule {
  static component = [ DashboardDeviceStatusComponent, DashboardTellerActivityComponent, DashboardFailedTransactionComponent, DashboardTransactionStatusComponent, DashboardLastTransactionComponent, DashboardComponent ]
}
