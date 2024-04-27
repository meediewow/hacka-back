import { JwtPayload } from 'jsonwebtoken';

export interface AppJwtPayload extends JwtPayload {
  appPayload: true;
  password: string;
}
