import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  SignIn,
  SignOut, AutoSignOut, ActiveDirSignIn, TwoFactorSignIn, CancelSignIn,
} from '../actions/auth-action';
import { JwtHelper } from '../utils/jwt.helper';
import { TokenModel } from '../models/token.model';
import { AuthStateModel } from '../models/auth-state.model';
import { StatusCodes } from '../../core/utils/constants';
import {Observable} from "rxjs";

@State<AuthStateModel>({
  name: 'auth', // the name of auth state
  defaults: {
    tokenRequested: false,
    token: null,
    message: null,
    authState: false
  },
})
@Injectable()
export class AuthState {
  constructor(private readonly authService: AuthService) {}

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    const userDetail: TokenModel | null = JwtHelper.getokenData(state.token);
    if (!userDetail) {
      return false;
    }
    return !!state.token && !userDetail.IsExp;
  }

  @Selector()
  static tokenDetail(state: AuthStateModel): TokenModel | null {
    return JwtHelper.getokenData(state.token);
  }

  @Action(SignIn)
  signIn({ patchState }: StateContext<AuthStateModel>, { payload }: SignIn) {
    return this.authService.signIn(payload.email, payload.password).pipe(
      tap((result) => {
        if (result.code === StatusCodes.success) {
          patchState({
            token: result.data,
            tokenRequested: false,
            message: result.message,
            authState: true
          });
        } else {
          patchState({
            message: result.message,
          });
        }
      })
    );
  }

  @Action(ActiveDirSignIn)
  activeDirSignIn({ patchState }: StateContext<AuthStateModel>, { payload }: ActiveDirSignIn) {
    return this.authService.activeDirSignIn(payload.email, payload.password).pipe(
      tap((result) => {
        if (result.code === StatusCodes.success) {
          patchState({
            tokenRequested: true,
            message: result.message,
            authState: result.data
          });
        } else {
          patchState({
            message: result.message,
          });
        }
      })
    );
  }

  @Action(TwoFactorSignIn)
  twoFactorSignIn({ patchState }: StateContext<AuthStateModel>, { payload }: TwoFactorSignIn) {
    return this.authService.twoFactorSignIn(payload.email, payload.token).pipe(
      tap((result) => {
        if (result.code === StatusCodes.success) {
          patchState({
            tokenRequested: false,
            message: result.message,
            authState: result.data
          });
        } else {
          patchState({
            message: result.message,
          });
        }
      })
    );
  }

  @Action(CancelSignIn)
  cancelSignIn({ patchState }: StateContext<AuthStateModel>) {
    patchState({
      tokenRequested: false,
    });
  }

  @Action(SignOut)
  signOut({ setState }: StateContext<AuthStateModel>) {
    // return this.authService.signOut().pipe(
    //   tap((_) => {
    //     setState({ token: null, tokenRequested: false, message: null, authState: false });
    //   })
    // );
    return new Observable(observer => {
      observer.next(setState({ token: null, tokenRequested: false, message: null, authState: false }));
      observer.complete();
    })
  }

  @Action(AutoSignOut)
  autoSignOut({ setState }: StateContext<AuthStateModel>) {
    setState({ token: null, tokenRequested: false, message: 'auto sign out', authState: false });
  }
}
