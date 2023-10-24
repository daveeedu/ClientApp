import {HttpHeaders} from "@angular/common/http";
import {AccountType} from "../models/persona.model";

export const StatusCodes = {
  success: 999,
  unauthenticated: '041',
  resourceAlreadyExist: '060',
  resourceNoLongerInuse: '065',
  noData: '069',
  noPermission: '079',
  badRequest: '089',
  serviceError: '099',
};

export const PAGINATION_SKIP = 0;
export const PAGINATION_LIMIT = 25;

export const Transactions = {
  cashWithdrawal: 'Cash Withdrawal',
  nipTransfer: 'Nip Transfer',
  thirdPartyDeposit: 'Third Party Deposit',
  selfDeposit: 'Self Deposit',
  intraBankTransfer: 'UBA Transfer'
}

export const notificationDuration = 5000;

export const EmailRegex = '^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}(\\.[a-z]{2,3})?$';
export const AuthEmailRegex = '^\\w+[\\w-\\.\\+]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}(\\.[a-z]{2,3})?$';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

export const httpCSVOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data',
  }),
};

export const ReturnUrlType = 'returnUrl';
export const QueryParameterNames = {
  ReturnUrl: ReturnUrlType,
  Message: 'message',
};

export const adminRoot = 'admin';
// _____________________________________________________Actions_____________________________________________________
export const AuthActions = {
  Auth: 'auth',
  Signin: 'signin',
  Profile: 'profile',
  Signout: 'signout',
  AccessDenied: 'accessdenied',
  ForgotPassword: 'forgotpassword',
  ChangePassword: 'changepassword',
};

export const TellerActions = {
  List: 'tellers',
  Create: 'create',
  Edit: 'edit',
};

export const SupervisorsActions = {
  List: 'supervisors',
  Create: 'create',
  Edit: 'edit',
};

export const CsoActions = {
  List: 'cso',
  Create: 'create',
  Edit: 'edit',
};

export const ReportActions = {
  List: 'report'
}

export const DeviceActions = {
  List: 'devices',
  Create: 'create',
  Multiple: 'create-multiple',
  Edit: 'edit',
  Move: 'move'
};

export const BranchActions = {
  List: 'branches',
  Create: 'create',
  Edit: 'edit',
};

export const AuditActions = {
  List: 'audits',
};

//__________________________________________________Application Paths__________________________________________________
interface ApplicationPathsType {
  readonly DefaultLoginRedirectPath: string;
  readonly Auth: string;
  readonly SignIn: string;
  readonly ForgotPassword: string;
  readonly ChangePassword: string;
  readonly Tellers: string;
  readonly TellerCreate: string;
  readonly TellerEdit: string;
  readonly Supervisors: string;
  readonly SupervisorEdit: string;
  readonly Cso: string;
  readonly CsoEdit: string;
  readonly Report: string;
  readonly Devices: string;
  readonly DeviceStatus: string;
  readonly TellerActivity: string;
  readonly TransactionStatus: string;
  readonly LastTransaction: string;
  readonly FailedTransaction: string;
  readonly DeviceCreate: string;
  readonly DeviceMove: string;
  readonly DeviceCreateMultiple: string;
  readonly DeviceEdit: string;
  readonly Branches: string;
  readonly Audit: string;
  readonly BranchCreate: string;
  readonly BranchEdit: string;
  readonly Approvals: string;
  readonly Dashboard: string;
  readonly GeneralDistribution: string;
  readonly AuthPathComponents: string[];
  readonly DevicePathComponents: string[];
  readonly SigninPathComponents: string[];
  readonly ProfilePathComponents: string[];
  readonly DashboardPathComponents: string[];
  readonly GeneralDistributionPathComponents: string[];
  readonly UsersPathComponents: string[];
  readonly CreateUserPathComponents: string[];
  readonly EditUserPathComponents: string[];
  readonly AccessDeniedPathComponents: string[];
  readonly TellerPathComponents: string[];
  readonly SupervisorPathComponents: string[];
  readonly BranchPathComponents: string[];
  readonly ApprovalsPathComponents: string[];
  readonly CsoPathComponents: string[];
}

let applicationPaths: ApplicationPathsType = {
  DefaultLoginRedirectPath: '/',
  Auth: `${adminRoot}/${AuthActions.Auth}`,
  SignIn: `${adminRoot}/${AuthActions.Signin}`,
  ForgotPassword: `${adminRoot}/${AuthActions.ForgotPassword}`,
  ChangePassword: `${adminRoot}/${AuthActions.ChangePassword}`,
  Tellers: `${adminRoot}/${TellerActions.List}`,
  TellerCreate: `${TellerActions.Create}`,
  TellerEdit: `${TellerActions.Edit}`,
  Supervisors: `${SupervisorsActions.List}`,
  SupervisorEdit: `${SupervisorsActions.Edit}`,
  Cso: `${CsoActions.List}`,
  CsoEdit: `${CsoActions.Edit}`,
  Report: `${ReportActions.List}`,
  Devices: `${adminRoot}/${DeviceActions.List}`,
  DeviceCreate: `${DeviceActions.Create}`,
  DeviceCreateMultiple: `${DeviceActions.Multiple}`,
  DeviceMove: `${DeviceActions.Move}`,
  DeviceEdit: `${DeviceActions.Edit}`,
  DevicePathComponents: [adminRoot, DeviceActions.List],
  Branches: `${adminRoot}/${BranchActions.List}`,
  Audit: `${AuditActions.List}`,
  BranchCreate: `${BranchActions.Create}`,
  BranchEdit: `${BranchActions.Edit}`,
  BranchPathComponents: [adminRoot, BranchActions.List],
  AuthPathComponents: [adminRoot, AuthActions.Signin],
  Approvals: `${adminRoot}/approvals`,
  Dashboard: `${adminRoot}/dashboard`,
  DeviceStatus: `${adminRoot}/dashboard/deviceStatus`,
  TellerActivity: `${adminRoot}/dashboard/tellerActivity`,
  TransactionStatus: `${adminRoot}/dashboard/transactionStatus`,
  LastTransaction: `${adminRoot}/dashboard/lastTransaction`,
  FailedTransaction: `${adminRoot}/dashboard/failedTransaction`,
  GeneralDistribution: `${adminRoot}/general-distribution`,
  SigninPathComponents: [],
  ProfilePathComponents: [],
  DashboardPathComponents: [],
  UsersPathComponents: [],
  CreateUserPathComponents: [],
  EditUserPathComponents: [],
  AccessDeniedPathComponents: [],
  TellerPathComponents: [adminRoot, TellerActions.List],
  SupervisorPathComponents: [ SupervisorsActions.List],
  CsoPathComponents: [ CsoActions.List],
  ApprovalsPathComponents: [],
  GeneralDistributionPathComponents: [],
};

export const ApplicationPaths: ApplicationPathsType = applicationPaths;

// _____________________________________________________EndPoints_____________________________________________________
export const EndPoints = {
  approvals: 'approvals',
  approvalreview: 'approvals/review',
  auth: 'auth',
  operatorAuth: 'personaauth/login',
  activeDirAuth: 'adminauth/activedir',
  twoFactorAuth: 'adminauth/twofactor',
  getToken: '/auth/token/generate',
  changePassword: '/auth/password',
  forgotPassword: '/auth/password/forgot',
  resetPassword: '/auth/password/reset',
  signOut: 'auth/logout',
  personas: 'personas',
  devices: 'devices',
  dashboard: 'dashboard',
  branches: 'branches',
  auditLog: 'audit-report',
  dashboardReport: 'reports/transactions/summary',
  dashboardReportOverview: 'reports/transactions/overview',
  dashboardReportLastTransaction: 'reports/last-transactions/summary',
  dashboardTellerActivity: 'reports/teller-activity',
  dashboardDeviceActivity: 'reports/device-activity',
  defaultReport: 'reports/default',
  generalDistribution: 'general-distribution',
  feedback: 'feedback/analysis'
};


export const STATUS_ACTIVE = 1;
export const STATUS_DEACTIVATED = 2;
export const STATUS_SUSPENDED = 4;
export const STATUS_PENDING = 8;

export const ACTIVE_STATUS = 'true';
export const INACTIVE_STATUS = 'false';

export const StatusTypes = [
  { value: ACTIVE_STATUS, name: 'Active' },
  { value: INACTIVE_STATUS, name: 'Deactivated' },
];

export const TransactionTypes = [
  { value: 'cashWithdrawal', name: 'Cash Withdrawal' },
  { value: 'thirdPartyDeposit', name: 'Third Party Deposit'},
  { value: 'selfDeposit', name: 'Self Deposit' },
  { value: 'intraBankTransfer', name: 'Intra Bank Transfer' },
  { value: 'nipTransfer', name: 'Nip Transfer' }
]

export const PersonaTypes = {
  supervisor: 1,
  teller: 2,
  Cso : 4
}

export const AccountTypes: AccountType[] = [
  { name: 'Supervisor', value: 1 },
  { name: 'Teller', value: 2 },
  { name: 'Cso', value: 4 }
]

export const ApprovedItem = 'No Pending Approval';
export const ApprovedItemName = 'Approved';

export const InActiveItem = 'Inactive';
export const ActiveItem = 'Active';

export const DeviceStates = {
  inactive: 0,
  active: 1
}
export const DeviceStateNames = {
  inactive: 'Inactive',
  active: 'Active'
}
