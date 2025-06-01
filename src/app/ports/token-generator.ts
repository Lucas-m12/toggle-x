export interface TokenGenerator {
  sign(
    payload: Record<string, unknown>,
    options?: { expiresIn?: string | number },
  ): string;
}
