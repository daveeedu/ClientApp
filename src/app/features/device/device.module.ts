import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgModule } from "@angular/core";
import { DeviceListingComponent } from "./device-listing/device-listing.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SharedModule } from "../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { DeviceRoutingModule } from "./device-routing.module";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { DeviceCreateComponent } from "./device-create/device-create.component";
import { DeviceEditComponent } from "./device-edit/device-edit.component";
import { DeviceCreateMultipleComponent } from "./device-create-multiple/device-create-multiple.component";
import { MoveDeviceComponent } from "./move-device/move-device.component";

@NgModule({
  declarations: [
    DeviceListingComponent,
    DeviceCreateComponent,
    DeviceEditComponent,
    DeviceCreateMultipleComponent,
    MoveDeviceComponent,
  ],
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
    DeviceRoutingModule,
    MatStepperModule,
    MatAutocompleteModule,
  ],
})
export class DeviceModule {}
