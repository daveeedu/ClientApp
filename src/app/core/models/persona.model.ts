export interface PersonaModel {
  id: string | null;
  fullName: string | null;
  emailAddress: string | null;
  staffId: string | null;
  bvn: string | null;
  personaType: string | null;
  authState: string | null;
  approvalStatus: string | null;
  branchName: string | null;
  branchId: string | null;
}

export interface PersonaCreateModel {
  fullName: string | null;
  emailAddress: string | null;
  staffId: string | null;
  bvn: string | null;
  accountType: number | null;
  branchId: string | null;
}


export interface PersonaEditModel {
  fullName: string | null;
  bvn: string | null;
  accountType: number | null;
  branchId: string | null;
}

export interface AccountType {
  name: string,
  value: number
}
