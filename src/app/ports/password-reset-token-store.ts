export interface PasswordResetTokenStore {
  generate(userId: string): Promise<string>;
  validate(token: string): Promise<string | null>;
}
