
export interface AuditModel {
  transactionType: string;
  transactionDate: Date | string;
  transactingAccountName: string;
  transactingAccountNumber: string;
  transactionAmount: number;
  transactingBVN: string;
  beneficiaryAccountNumber: string;
  authorizer: string;
  branchCode: string;
  status: boolean;
}
