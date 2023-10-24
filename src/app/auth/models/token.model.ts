export interface TokenModel {
  Email: string;
  Role: string;
  StaffId: string;
  PersonaId: string;
  Type: number;
  Session: string;
  Fullname: string;
  ExpireDate: Date | null;
  IsExp: boolean;
}
