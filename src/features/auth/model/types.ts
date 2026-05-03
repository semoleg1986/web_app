export type AuthRole = "admin" | "teacher" | "parent" | "student";
export type AuthStatus = "active" | "blocked" | "archived";

export interface AuthLoginPayload {
  email: string;
  password: string;
  session_fingerprint?: string;
}

export interface AuthRegisterPayload {
  email: string;
  password: string;
  default_role: AuthRole;
}

export interface AuthMe {
  account_id: string;
  user_id: string;
  email: string;
  roles: AuthRole[];
  status: AuthStatus;
}

export interface AuthSessionSnapshot {
  user: AuthMe;
  expires_in: number;
  token_type: "Bearer";
}
