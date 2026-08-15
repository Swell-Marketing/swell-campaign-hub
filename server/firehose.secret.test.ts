import { describe, expect, it } from "vitest";

describe("Firehose credential", () => {
  it("authenticates to the Firehose tap-management endpoint without exposing the secret", async () => {
    const token = process.env.FIREHOSE_API;

    expect(token, "FIREHOSE_API must be configured for approved monitoring").toBeTruthy();

    const response = await fetch("https://api.firehose.com/v1/taps", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // A management key returns 200. A tap-scoped token may return 403, which still proves
    // the credential authenticated but lacks tap-management scope; 401 indicates bad auth.
    expect(response.status, "Firehose credential must authenticate").not.toBe(401);
    expect(response.status, "Firehose endpoint must be reachable with the supplied credential").toBeLessThan(500);
  });
});
