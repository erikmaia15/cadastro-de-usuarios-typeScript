export interface Usuario {
  id?: string;
  fullName: string;
  email: string;
  password: string;
}

export type UsuarioResponse = Omit<Usuario, "password">;
export type CredenciaisLogin = Pick<Usuario, "email" | "password">;
