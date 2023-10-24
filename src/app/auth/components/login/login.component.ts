import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthState} from "../../states/auth-state";
import {Store} from "@ngxs/store";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveDirSignIn, CancelSignIn, SignIn, TwoFactorSignIn} from "../../actions/auth-action";
import {MyErrorStateMatcher} from "../../../core/utils/error-state-matcher";
import {NotificationService} from "../../../core/utils/services/notification.service";
import {ApplicationPaths, AuthEmailRegex, ReturnUrlType} from "../../../core/utils/constants";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  hide = true;
  matcher = new MyErrorStateMatcher();
  isAuth: boolean;
  tokenControl = new FormControl('', Validators.required);
  year = new Date().getFullYear();

  constructor(
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly notificationService: NotificationService
  ) {
    this.isAuth = store.selectSnapshot(AuthState.isAuthenticated);
  }

  get formControls() {
    return this.loginForm.controls;
  }

  hasRequestedForToken: boolean;

  ngOnInit(): void {
    if (this.isAuth) {
      this.navigateToReturnUrl(this.getReturnUrl()).then(() => {});
    }
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(
          AuthEmailRegex
        ),
      ]
      ],
      password: ['', Validators.required],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
    // tslint:disable-next-line: semicolon
  };

  get tokenFormControl(){
    return this.tokenControl;
  }

  isLoginFormInValid(): boolean {
    return this.loginForm.invalid;
  }

  get emailFormControl(){
    return this.loginForm.get('email');
  }

  get passwordFormControl(){
    return this.loginForm.get('password');
  }

  tokenControlHasError(errorName: string) {
    return this.tokenControl.hasError(errorName);
  }

  signIn() {
    if (this.isLoginFormInValid()) {
      this.notificationService.showError('Enter Valid Email and Password');
      return;
    }

    this.loading = true;
    const password = this.passwordFormControl?.value;
    const email = this.emailFormControl?.value;

    this.store.dispatch(new SignIn({ email, password })).subscribe(
      (result) => {
        if (result.auth.token) {
          this.reset();
          this.router.navigate([ApplicationPaths.Dashboard]);
          return;
        }
        this.loading = false;
        this.activeDirSignIn();
      },
      (err) => {
        this.notificationService.showError(err?.error?.message || err?.message);
        this.loading = false;
      }
    );


    // using mock for now
    // if (email === 'dev@innovantics.com' && password === 'Password123#'){
    //   this.router.navigate(['admin', 'devices']);
    // }
    // else{
    //   this.notificationService.showError('Invalid Credentials');
    //   this.loading = false;
    // }
  }

  private activeDirSignIn(): void {
    this.tokenFormControl.patchValue('');
    this.submitted = true;

    const email = this.emailFormControl?.value;
    const password = this.passwordFormControl?.value;

    this.loading = true;
    this.store.dispatch(new ActiveDirSignIn({ email, password })).subscribe(
      (result) => {
        if (result.auth.authState) {
          this.loading = false;
          this.notificationService.showSuccess('Enter Token To Complete Sign In Process');
        }
      },
      (err) => {
        this.notificationService.showError(err?.error?.message || err?.message);
        this.loading = false;
      }
    );
  }

  twoFactorSignIn(){
    this.loading = true;
    const token = this.tokenFormControl?.value;
    const email = this.emailFormControl?.value;

    this.store.dispatch(new TwoFactorSignIn({ email, token })).subscribe(
      (result) => {
        if (result.auth.authState) {
          this.reset();
          this.router.navigate(ApplicationPaths.DevicePathComponents);
        }
        this.loading = false;
      },
      (err) => {
        this.notificationService.showError(err?.error?.message || err?.message);
        this.loading = false;
      }
    );
  }

  cancelSignin() {
    this.store.dispatch(new CancelSignIn());
  }

  reset(): void {
    this.loading = false;
  }

  private getReturnUrl(state?: INavigationState): string {
    const fromQuery = (this.activatedRoute.snapshot
      .queryParams as INavigationState).returnUrl;
    // If the url is comming from the query string, check that is either
    // a relative url or an absolute url
    if (
      fromQuery &&
      !(
        fromQuery.startsWith(`${window.location.origin}/`) ||
        /\/[^\/].*/.test(fromQuery) ||
        fromQuery === '/'
      )
    ) {
      // This is an extra check to prevent open redirects.
      throw new Error(
        'Invalid return url. The return url needs to have the same origin as the current page.'
      );
    }
    return (
      (state && state.returnUrl) ||
      fromQuery ||
      ApplicationPaths.DefaultLoginRedirectPath
    );
  }

  private async navigateToReturnUrl(returnUrl: string) {
    // It's important that we do a replace here so that we remove the callback uri with the
    // fragment containing the tokens from the browser history.
    await this.router.navigateByUrl(returnUrl, {
      replaceUrl: true,
    });
  }
}

interface INavigationState {
  [ReturnUrlType]: string;
}
