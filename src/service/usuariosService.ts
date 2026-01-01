import {
  CredenciaisLogin,
  UsuarioResponse,
  UsuarioResponseArray,
} from "../model/dto/usuarios";
import { Usuario } from "../model/entities/usuarios";
import { prisma } from "../../lib/prisma";
import adminRoute from "../middleware/adminRoute";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export default {
  async postUsuario(dados: Usuario) {
    try {
      const salt = await bcrypt.genSalt(10);
      const senhaUser = await bcrypt.hash(dados.password, salt);
      const response = await prisma.user.create({
        data: {
          fullName: dados.fullName,
          email: dados.email,
          password: senhaUser,
        },
      });
      console.log(response);
      const data: UsuarioResponse = {
        id: response.id,
        email: response.email,
        fullName: response.fullName ?? "",
        isAdmin: response.isAdmin,
      };
      return { ok: true, data: data };
    } catch (error: any) {
      if (error.code === "P2002") {
        return { ok: false, error: "Email já cadastrado" };
      }
      console.log(error);

      return { ok: false, error: "Erro ao criar usuário" };
    }
  },
  async usuarioLogin(dados: CredenciaisLogin) {
    const jwtSecret = process.env.JWT_SECRET as string;
    try {
      const response = await prisma.user.findUnique({
        where: { email: dados.email },
      });
      if (!response) {
        return { ok: false, message: "Usuário não encontrado!" };
      }
      const password = await bcrypt.compare(dados.password, response.password);
      if (response.fullName !== null) {
        if (password == true) {
          const user: UsuarioResponse = {
            id: response.id,
            fullName: response.fullName,
            email: response.email,
            isAdmin: response.isAdmin,
          };
          const token = jwt.sign(user, jwtSecret, { expiresIn: "1d" });
          const resposta = {
            ok: true,
            message: "Usuário logado com sucesso!",
            token: token,
          };
          return { response: resposta };
        }
      } else {
        return { ok: false, message: "Usuário ou senha incorretos!" };
      }
    } catch (erro) {
      return { ok: false, error: "Erro no servidor, tente novamente!" };
    }
  },
  async listarUsuarios(token: string) {
    const response = adminRoute.isAdmin(token);
    if (!response) {
      return {
        ok: false,
        message: "Acesso negado!",
      };
    }
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          fullName: true,
          isAdmin: true,
          email: true,
        },
      });
      const usuariosResponse: UsuarioResponseArray = users;
      return {
        ok: true,
        message: "Usuários listados com sucesso!",
        users: usuariosResponse,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, message: "Erro no servidor, tente novamente!" };
    }
  },
};
