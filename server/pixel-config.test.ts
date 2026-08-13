import { describe, expect, it } from "vitest";

describe("Meta Pixel configuration", () => {
  it("provides a numeric managed Pixel identifier for browser tracking", () => {
    const pixelId = process.env.VITE_META_PIXEL_ID;

    expect(pixelId).toBeDefined();
    expect(pixelId).toMatch(/^\d+$/);
  });
});
