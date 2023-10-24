export interface BranchModel extends BranchCreateModel{
    id: string | null;
    approvalStatus: string | null;
}

export interface BranchCreateModel {
  code: string | null;
  name: string | null;
  address: string | null;
  contact: Contact;
  country: string | null;
  subnet: string | null;
}

export interface BranchEditModel {
  address: string | null;
  branchCode: string | null;
  contact: Contact;
  subnet: string | null;
}

interface Contact {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
}
