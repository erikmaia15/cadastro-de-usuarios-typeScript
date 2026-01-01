import jwt from "jsonwebtoken";
import { UserJwtPayload } from "../model/entities/jwt";

export default {
  isAdmin(token: string): boolean {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as UserJwtPayload;
      console.log(decoded);
      return decoded.isAdmin === true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
