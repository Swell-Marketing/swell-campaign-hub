import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  createInternalReviewEvent,
  dispatchInternalReviewEvent,
  INTERNAL_REVIEW_EVENT_TYPE,
  INTERNAL_REVIEW_SOURCE,
} from "./activepiecesHandoff";

describe("internal review handoff", () => {
  it("sends only the minimal signed event contract to the configured endpoint", async () => {
    const event = createInternalReviewEvent("hub-review-test-001");
    const fetchImplementation = vi.fn().mockResolvedValue({ ok: true, status: 200 });

    const result = await dispatchInternalReviewEvent({
      environment: {
        ACTIVEPIECES_WEBHOOK_URL: "https://internal.example.test/webhook/",
        ACTIVEPIECES_HMAC_SECRET: "test-only-hmac-secret",
      },
      event,
      fetchImplementation,
    });

    expect(result).toEqual({ eventId: "hub-review-test-001", status: 200 });
    expect(fetchImplementation).toHaveBeenCalledTimes(1);

    const [url, request] = fetchImplementation.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://internal.example.test/webhook");
    expect(request.method).toBe("POST");
    expect(JSON.parse(String(request.body))).toEqual({
      event_id: "hub-review-test-001",
      source: INTERNAL_REVIEW_SOURCE,
      event_type: INTERNAL_REVIEW_EVENT_TYPE,
    });
    expect(request.body).not.toContain("account");
    expect(request.body).not.toContain("email");

    const expectedSignature = createHmac("sha256", "test-only-hmac-secret")
      .update(String(request.body))
      .digest("hex");
    expect(request.headers).toMatchObject({
      "content-type": "application/json",
      "x-signature": expectedSignature,
    });
  });

  it("fails closed when the endpoint configuration is absent", async () => {
    await expect(
      dispatchInternalReviewEvent({
        environment: {},
        fetchImplementation: vi.fn(),
      }),
    ).rejects.toThrow("not configured");
  });
});
