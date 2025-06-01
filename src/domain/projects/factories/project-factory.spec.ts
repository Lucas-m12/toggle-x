import { describe, expect, it } from "vitest";
import { ProjectFactory } from "./project-factory";

describe("ProjectFactory", () => {
  it("should create a valid project with name and tenantId", () => {
    const project = ProjectFactory.create("tenant_abc", "My project");

    expect(project.id).toBeDefined();
    expect(project.clientKey).toMatch(/^togx_pk_/);
    expect(project.name).toBe("My project");
    expect(project.tenantId).toBe("tenant_abc");
  });

  it("should throw an error if name is empty", () => {
    expect(() => ProjectFactory.create("tenant_abc", "")).toThrow(
      "Name is required"
    );
  });
});