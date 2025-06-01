export interface LoginUserInput {
  tenantId: string;
  email: string;
  password: string;
}

export interface LoginUserOutput {
  accessToken: string;
  expiresIn: number;
}
