import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import {MatButtonModule} from "@angular/material/button";
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent,
    LayoutComponent],
  exports: [LayoutComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        MatSnackBarModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatMenuModule,
        RouterModule,
        SharedModule,
        MatButtonModule,
    ]
})
export class CoreModule { }
