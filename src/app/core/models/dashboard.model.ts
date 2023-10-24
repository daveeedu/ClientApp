interface Status {
  success: number | 0;
  failure: number | 0;
}
export interface DashboardModel {
  date: Date | string;
  branchCode: string | null;
  branchName: string | null;
  csmEmail: string | null;
  identifier: string | null;
  lastRecordedActivity: Date;
  thirdPartyDeposit: Status;
  cashWithdrawal: Status;
  selfDeposit: Status;
  intraBankTransfer: Status;
  nipTransfer: Status;
  volume: number;
}

export interface DeviceActivity {
  deviceId: string;
  branchId: string;
  csmName: string;
  csmEmail: string;
  daysElapsed: number;
  identifier: string;
  branchName: string;
  branchCode: string;
  lastRecordedActivity: string;
}
export interface TellerActivityModel {
  tellerId: string;
  tellerStaffId: string;
  branchId: string;
  tellerEmail: string;
  branchName: string;
  tellerName: string;
  branchCode: string;
  lastRecordedActivity: string;
  csmName: string;
  csmEmail: string;
  daysElapsed: number;
}
export interface LastTransactionModel {
  branchCode: string;
  branchName: string;
  csmEmail: string;
  value: string;
  content: {
    amount: number;
    date: string;
    daysElapsed: number;
  };
}

export interface TransactionStatusModel {
  transactionType: string;
  success: number;
  failure: number;
  successRate: number;
  failureRate: number;
}

export interface DashboardParams {
  startTime: string | null;
  endTime: string | null;
}

export interface ReportActivity {
  staffID: string;
  StaffName: string;
  BranchName: string;
  TotalNumTransaction: number;
  Excellent: number;
  Good: number;
  VeryGood: number;
  Average: number;
  Poor: number;
  AverageRate: number;
  TotalRAtedTransaction: number;
}

export interface AuditActivity {
  transactionType: string;
  transactionID: number;
  transactingAccName: string;
  transactingAccNumber: number;
  totalTransactions: number;
  transactionAmount: number;
  transactingBVN: number;
  beneficiaryAccName: string;
  beneficiaryAccNumber: number;
  initiatorID: number;
  authorizerID: number;
  dateTime: number;
  branchSolID: number;
  posStatus: number;
}

export interface TransactionStatusModel {
  transactionType: string;
  success: number;
  failure: number;
  successRate: number;
  failureRate: number;
}

export interface ReportModel {
  totalCounts: {
    totalRT: number;
    totalPercRT: number;
    totalBranches: number;
    totalServices: number;
    totalUsers: number;
  };
  generalRatings: {
    poorCount: number;
    badCount: number;
    goodCount: number;
    veryGoodCount: number;
    excellentCount: number;
  };
  topUsers: {
    name: string;
    totalNT: number;
    totalRT: number;
    average: number;
    totalPRT: number
  }[];
  topServices: {
    name: string;
    rateAverage: number;
  }[];
  topBranches: {
    name: string;
    rateAverage: number;
  }[];
  buttonBranches: {
    name: string;
    rateAverage: number;
  }[];
  buttonUsers: {
    name: string;
    totalNT: number;
    totalRT: number;
    average: number;
    totalPRT: number;
  }[];
  buttonServices: {
    name: string;
    rateAverage: number;
  }[];
}
