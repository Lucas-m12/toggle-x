import { InvalidOrExpiredTokenError } from "@/domain/user/errors/InvalidOrExpiredToken";
import { UserNotFoundError } from "@/domain/user/errors/user-not-found";
import { UserRepository } from "@/domain/user/repositories/user-repository";
import { PasswordHasher } from "../ports/password-hasher";
import { PasswordResetTokenStore } from "../ports/password-reset-token-store";

interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly tokenStore: PasswordResetTokenStore,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const userId = await this.tokenStore.validate(input.token);
    if (!userId) throw new InvalidOrExpiredTokenError();
    const user = await this.users.findById(userId);
    if (!user) throw new UserNotFoundError();
    const hashedPassword = await this.hasher.hash(input.newPassword);
    await this.users.updatePassword(user.id, hashedPassword);
  }
}
