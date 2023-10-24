import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenModel } from '../models/token.model';

export class JwtHelper {
  static getokenData(token: string | null): TokenModel | null {
    if (token === null) {
      return null;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const expirationDate = helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);
    return {
      Email: decodedToken.Email,
      Role: decodedToken.Role,
      StaffId: decodedToken.StaffId,
      PersonaId: decodedToken.PersonaId,
      ExpireDate: expirationDate,
      IsExp: isExpired,
      Type: decodedToken.Type,
      Fullname: decodedToken.Fullname,
      Session: decodedToken.Session
    };
  }
}
