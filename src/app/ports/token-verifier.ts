import { UserRole } from "@/domain/user/entities/user";

export interface AuthPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
}

export interface TokenVerifier {
  verify(token: string): AuthPayload;
}
