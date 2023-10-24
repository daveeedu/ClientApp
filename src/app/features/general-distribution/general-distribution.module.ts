import {NgModule} from "@angular/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { MatStepperModule } from '@angular/material/stepper';
import { GeneralDistributionRoutingModule } from "./general-distribution-routing.module";
import { GeneralDistributionComponent } from "./general-distribution.component";

@NgModule({
  declarations: [GeneralDistributionComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    GeneralDistributionRoutingModule,
    MatStepperModule
  ]
})

export class GeneralDistributionModule {

}
