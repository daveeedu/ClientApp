import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatBadgeModule } from '@angular/material/badge';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApprovalsRoutingModule } from './approvals-routing.module';
import { ApprovalsComponent } from './approvals.component';

@NgModule({
  declarations: [
    ApprovalsComponent,
  ],
  imports: [
    SharedModule,
    ApprovalsRoutingModule,
    MatBadgeModule,
    LayoutModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatPaginatorModule
  ],
  providers: [
    
  ]
})
export class ApprovalsModule {}
