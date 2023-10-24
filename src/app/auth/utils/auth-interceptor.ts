import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Store} from "@ngxs/store";
import {Router, RouterState, RouterStateSnapshot} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {AuthState} from "../states/auth-state";
import {ApplicationPaths, QueryParameterNames, StatusCodes} from "../../core/utils/constants";
import {AutoSignOut} from "../actions/auth-action";
import {catchError} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store, private readonly router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> | any {
    const token = this.store.selectSnapshot(AuthState.token);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (error.error === null || (error.error && error.error.code === StatusCodes.unauthenticated)) {
            this.store.dispatch(new AutoSignOut());
            const state: RouterState = this.router.routerState;
            const snapshot: RouterStateSnapshot = state.snapshot;
            return this.router.navigate(ApplicationPaths.AuthPathComponents, {
              queryParams: {
                [QueryParameterNames.ReturnUrl]: snapshot.url,
              },
            });
          } else {
            return this.router.navigate(
              ApplicationPaths.AccessDeniedPathComponents
            );
          }
        } else {
          return throwError(error);
        }
      })
    );
  }
}
