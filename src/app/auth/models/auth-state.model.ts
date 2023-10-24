export interface AuthStateModel {
  tokenRequested: boolean;
  token: string | null;
  message: string | null;
  authState: boolean;
}
