export interface ApprovalModel {
    entityType: string;
    approvalKind: string;
    branchId: string;
    approvalId: string;
    permission: string;
    branchCode: string;
    creatorName: string;
    creatorEmail: string;
    creatorPersonaType: number;
    branchName: string;
    branchContact: Contact;
    entityCurrentSnapshot: string;
    entityUpdateSnapshot: string;
    approvalStatus: number;
  }
  
  interface Contact {
    name: string;
    email: string;
    phoneNumber: string;
  }

  export interface ApprovalUpdateModel {
    approvalId: string;
    comment: string;
    state: string;
  }
  