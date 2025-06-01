import { describe, expect, it } from "vitest";
import { Project } from "./project";

describe("Project Entity", () => {
  it("should create a project", () => {
    const project = new Project({
      id: "123",
      tenantId: "tenant_abc",
      name: "project_test",
      clientKey: "togx_pk_123456",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(project).toBeInstanceOf(Project);
    expect(project.id).toBe("123");
    expect(project.tenantId).toBe("tenant_abc");
    expect(project.name).toBe("project_test");
    expect(project.clientKey).toBe("togx_pk_123456");
    expect(project.createdAt).toBeInstanceOf(Date);
    expect(project.updatedAt).toBeInstanceOf(Date);
  });

  it("sould can rename project", () => {
    const project = new Project({
      id: "123",
      tenantId: "tenant_abc",
      name: "project_test",
      clientKey: "togx_pk_123456",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(project.name).toBe("project_test");

    project.rename("new_name");
    expect(project.name).toBe("new_name");
  });

  it("should throw an error if name is empty", () => {
    expect(() => {
      new Project({
        id: "123",
        tenantId: "tenant_abc",
        name: "",
        clientKey: "togx_pk_123456",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }).toThrow("Name is required");
  });

  it("should throw an error if tenantId is empty", () => {
    expect(() => {
      new Project({
        id: "123",
        tenantId: "",
        name: "project_test",
        clientKey: "togx_pk_123456",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }).toThrow("Tenant ID is required");
  });

  it("should throw an error if clientKey is empty", () => {
    expect(() => {
      new Project({
        id: "123",
        tenantId: "tenant_abc",
        name: "project_test",
        clientKey: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }).toThrow("Client Key is required");
  });

  it("should throw an error if id is empty", () => {
    expect(() => {
      new Project({
        id: "",
        tenantId: "tenant_abc",
        name: "project_test",
        clientKey: "togx_pk_123456",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }).toThrow("Id is required");
  });

  it('should throw an error if try to rename with empty name', () => {
    const project = new Project({
      id: "123",
      tenantId: "tenant_abc",
      name: "project_test",
      clientKey: "togx_pk_123456",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(() => project.rename("")).toThrow("New name is required");
  });

});
