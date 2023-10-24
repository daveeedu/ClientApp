import {NgModule} from "@angular/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from "@angular/material/select";
import { MatSortModule } from '@angular/material/sort';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { DashbardRoutingModule } from "./dashboard-routing.module";
import { ChartModule } from 'angular2-chartjs';
@NgModule({
  declarations: [DashbardRoutingModule.component],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    DashbardRoutingModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule
  ]
})

export class DashboardModule {

}
