export interface Usuario {
  id?: string;
  fullName : string | null;
  email: string;
  password: string;
  isAdmin?: boolean;
}
