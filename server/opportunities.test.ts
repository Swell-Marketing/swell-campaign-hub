import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { createOpportunityInput } from "./routers/opportunities";
import type { TrpcContext } from "./_core/context";

function createContext(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: role === "admin" ? 1 : 2,
      openId: `${role}-test-user`,
      email: `${role}@example.com`,
      name: `${role} Test`,
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const validOpportunityInput = {
  accountName: "Example Organization",
  sourceChannel: "public_business_channel",
  sourceReference: "https://example.com/contact",
  evidenceRoute: "https://example.com/evidence",
  evidenceSummary: "Public source and a permissioned business channel are documented.",
  offerHypothesis: "swell_geo_growth",
  qualificationState: "qualified",
  scopeState: "not_started",
  collectionState: "not_requested",
  onboardingState: "not_ready",
  nextAction: "Prepare an individualized fit-check.",
  nextActionAt: null,
};

describe("private revenue-control board", () => {
  it("blocks a non-admin user before any opportunity data can be read", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(caller.opportunities.list()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("rejects malformed evidence URLs before a record can reach persistence", () => {
    const result = createOpportunityInput.safeParse({
      ...validOpportunityInput,
      evidenceRoute: "not-a-valid-url",
    });

    expect(result.success).toBe(false);
  });

  it("accepts business-control fields but strips an attempted payment-data field", () => {
    const parsed = createOpportunityInput.parse({
      ...validOpportunityInput,
      paymentInstrument: "do-not-store",
    });

    expect(parsed).toMatchObject(validOpportunityInput);
    expect(parsed).not.toHaveProperty("paymentInstrument");
  });
});
