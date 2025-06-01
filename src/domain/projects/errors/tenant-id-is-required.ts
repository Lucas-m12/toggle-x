import { AppError } from "@/core/errors/app-error";

export class TenantIdIsRequired extends AppError {
  constructor() {
    super(`Tenant ID is required.`);
    this.name = "TenantIdIsRequired";
  }
}
