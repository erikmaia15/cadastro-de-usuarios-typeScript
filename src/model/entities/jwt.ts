import { JwtPayload } from "jsonwebtoken";

export interface UserJwtPayload extends JwtPayload {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
}
