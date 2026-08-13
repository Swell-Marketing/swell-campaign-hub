import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "../client/src/pages/Home";
import { CAMPAIGN_LINKS, METHOD_STAGES, NAV_LINKS } from "../client/src/lib/campaign";

describe("Swell campaign landing configuration", () => {
  it("contains the required canonical navigation labels", () => {
    expect(NAV_LINKS.map((link) => link.label)).toEqual([
      "Services",
      "Method",
      "Plans",
      "About",
      "Contact",
    ]);
  });

  it("uses the required GEO method sequence", () => {
    expect(METHOD_STAGES).toEqual(["Observe", "Prove", "Decide", "Learn"]);
  });

  it("preserves the required booking route and tagged diagnostic routes", () => {
    expect(CAMPAIGN_LINKS.booking).toBe("https://meetings-na2.hubspot.com/mason-nguyen");
    expect(CAMPAIGN_LINKS.diagnosticHero).toContain("utm_source=facebook");
    expect(CAMPAIGN_LINKS.signal).toContain("utm_content=post_01_signal");
    expect(CAMPAIGN_LINKS.method).toContain("utm_content=post_02_method");
    expect(CAMPAIGN_LINKS.diagnostic).toContain("utm_content=post_03_diagnostic");
  });

  it("renders the three mandatory post showcase labels", () => {
    const markup = renderToStaticMarkup(createElement(Home));

    expect(markup).toContain("The Signal");
    expect(markup).toContain("The Method");
    expect(markup).toContain("The Diagnostic");
  });

  it("renders every canonical navigation and campaign CTA destination", () => {
    const markup = renderToStaticMarkup(createElement(Home));

    NAV_LINKS.forEach((link) => expect(markup).toContain(`href=\"${link.href}\"`));
    Object.values(CAMPAIGN_LINKS).forEach((href) => {
      const htmlHref = href.replaceAll("&", "&amp;");
      expect(markup).toContain(`href=\"${htmlHref}\"`);
    });
  });
});
