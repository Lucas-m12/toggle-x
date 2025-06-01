export interface RegisterInput {
  tenantId: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  tenantId: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  accessToken: string;
  expiresIn: number;
}

export interface AuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(raw: string, hash: string): Promise<boolean>;
  generateJwt(payload: Record<string, unknown>): string;
}
