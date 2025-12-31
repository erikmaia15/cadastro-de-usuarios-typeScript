import { Usuario } from "../entities/usuarios";

export type UsuarioResponse = Omit<Usuario, "password">;
export type CredenciaisLogin = Pick<Usuario, "email" | "password">;
