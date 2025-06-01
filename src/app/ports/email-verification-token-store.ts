export interface EmailVerificationTokenStore {
  generate(userId: string): Promise<string>;
  validate(token: string): Promise<string | null>;
}
