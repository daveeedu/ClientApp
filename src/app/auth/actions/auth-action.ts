export class SignIn {
  static readonly type = '[Auth] Signin';
  constructor(public payload: { email: string; password: string }) {}
}

export class ActiveDirSignIn {
  static readonly type = '[Auth] ActiveDirSignIn';
  constructor(public payload: { email: string; password: string }) {}
}

export class TwoFactorSignIn {
  static readonly type = '[Auth] TwoFactorSignIn';
  constructor(public payload: { email: string; token: string }) {}
}

export class CancelSignIn {
  static readonly type = '[Auth] CancelSignIn';
}

export class SignOut {
  static readonly type = '[Auth] Signout';
}

export class AutoSignOut {
  static readonly type = '[Auth] AutoSignout';
}
