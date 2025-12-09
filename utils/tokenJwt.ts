import jwt from "jsonwebtoken";
export default {
  async decodificarToken(token: string) {
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!token) {
      return { ok: false, message: "Token não enviado" };
    }

    const cleanToken = token.replace(/bearer\s+/i, "");

    try {
      const tokenVerify = jwt.verify(cleanToken, jwtSecret);
      return { ok: true, tokenDecoded: tokenVerify };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return { ok: false, message: "Token expirado, faça login novamente" };
      } else {
        return { ok: false, message: "Token inválido" };
      }
    }
  },
};
