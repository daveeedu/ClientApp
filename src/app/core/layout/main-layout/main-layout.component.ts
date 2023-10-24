import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SignOut } from 'src/app/auth/actions/auth-action';
import { AuthState } from 'src/app/auth/states/auth-state';
import { ApplicationPaths } from '../../utils/constants';
import {TokenModel} from "../../../auth/models/token.model";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  sidenavWidth = 200;
  hovered = false;
  notifications = false;
  userDetail: TokenModel | null;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.userDetail = this.store.selectSnapshot(AuthState.tokenDetail);
  }

  increase() {
    this.sidenavWidth = 200;
  }
  decrease() {
    this.sidenavWidth = 200;
  }
  setHoverState() {
    this.hovered = !this.hovered;
  }

  goToApprovals() {
    this.router.navigate(['/dashboard/approvals']);
  }
  async signOut() {
    this.store.dispatch(new SignOut()).subscribe((_) => {
      this.router.navigate(ApplicationPaths.AuthPathComponents);
    });
  }

  changePassword() {
    this.router.navigate(['/auth/changepassword']);
  }

}
