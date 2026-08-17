import { createHmac, randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

function requireActivepiecesConfiguration() {
  const webhookUrl = process.env.ACTIVEPIECES_WEBHOOK_URL;
  const hmacSecret = process.env.ACTIVEPIECES_HMAC_SECRET;

  if (!webhookUrl || !hmacSecret) {
    throw new Error("Activepieces webhook configuration is required for the internal handoff test.");
  }

  return {
    webhookUrl: webhookUrl.replace(/\/$/, ""),
    hmacSecret,
  };
}

describe("Activepieces internal handoff configuration", () => {
  it("authenticates a minimal non-recording test event", async () => {
    const { webhookUrl, hmacSecret } = requireActivepiecesConfiguration();
    const body = JSON.stringify({
      event_id: `configuration-check-${randomUUID()}`,
      source: "swell-campaign-hub",
    });
    const signature = createHmac("sha256", hmacSecret).update(body).digest("hex");

    const response = await fetch(`${webhookUrl}/test`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": signature,
      },
      body,
    });

    expect(response.status).toBe(200);
  });
});
