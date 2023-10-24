import { Component, OnInit} from '@angular/core';
import {ApplicationPaths} from "../../utils/constants";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  personaMenuClicked = false;
  reportMenuClicked = false;
  dashboardMenuClicked = false
  applicationPaths = ApplicationPaths;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {}
 
  get isPersonaMenuActive() {
    return this.router.url.includes('tellers');
  }
  get isReportMenuActive() {
    return this.router.url.includes('report');
  }
  get isDashboardMenuActive() {
    return this.router.url.includes('dashboard');
  }

  expandPersonaMenu() {
    this.personaMenuClicked = !this.personaMenuClicked;
  }

  expandReportMenu() {
    this.reportMenuClicked = !this.reportMenuClicked;
  }

  expandDashboardMenu() {
    this.dashboardMenuClicked = !this.dashboardMenuClicked;
  }
}
