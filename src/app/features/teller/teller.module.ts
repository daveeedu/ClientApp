import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TellerListingComponent } from './teller-listing/teller-listing.component';
import { MatCardModule } from '@angular/material/card';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {TellerRoutingModule} from "./teller-routing.module";
import {MatButtonModule} from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { TellerCreateComponent } from './teller-create/teller-create.component';
import { TellerEditComponent } from './teller-edit/teller-edit.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [TellerListingComponent, TellerCreateComponent, TellerEditComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TellerRoutingModule,
    MatAutocompleteModule
  ]
})
export class TellerModule { }
