import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createNonAdminContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "non-admin-test-user",
      email: "user@example.com",
      name: "Non-admin Test",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("internal review router", () => {
  it("rejects a non-admin caller before any internal event can be dispatched", async () => {
    const caller = appRouter.createCaller(createNonAdminContext());

    await expect(caller.internalReview.request()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
