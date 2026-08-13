import { describe, expect, it } from "vitest";
import { CAMPAIGN_LINKS, METHOD_STAGES, NAV_LINKS } from "./campaign";

describe("Swell campaign configuration", () => {
  it("uses the required canonical navigation destinations", () => {
    expect(NAV_LINKS.map((link) => link.label)).toEqual([
      "Services",
      "Method",
      "Plans",
      "About",
      "Contact",
    ]);
    expect(NAV_LINKS.every((link) => link.href.startsWith("https://swellmarketing.xyz/"))).toBe(true);
  });

  it("keeps the GEO operating sequence in the required order", () => {
    expect(METHOD_STAGES).toEqual(["Observe", "Prove", "Decide", "Learn"]);
  });

  it("uses tagged Swell diagnostic destinations and the exact booking URL", () => {
    expect(CAMPAIGN_LINKS.diagnosticHero).toContain("utm_source=facebook");
    expect(CAMPAIGN_LINKS.signal).toContain("utm_content=post_01_signal");
    expect(CAMPAIGN_LINKS.diagnostic).toContain("utm_content=post_03_diagnostic");
    expect(CAMPAIGN_LINKS.booking).toBe("https://meetings-na2.hubspot.com/mason-nguyen");
  });
});
