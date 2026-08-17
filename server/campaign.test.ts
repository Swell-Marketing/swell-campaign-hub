import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "../client/src/pages/Home";
import { PerformanceDashboard } from "../client/src/components/PerformanceDashboard";
import { CaseStudyEvidence } from "../client/src/components/CaseStudyEvidence";
import { PixelEventTestUtility } from "../client/src/components/PixelEventTestUtility";
import { CAMPAIGN_LINKS, METHOD_STAGES, NAV_LINKS } from "../client/src/lib/campaign";
import { TRACKING_EVENTS } from "../client/src/lib/tracking";

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

  it("renders the evidence-limited agent-readiness portfolio without public checkout", () => {
    const markup = renderToStaticMarkup(createElement(Home));

    expect(markup).toContain("Agent-readiness portfolio");
    expect(markup).toContain("ARM Signal Audit · $2,500 fixed scope");
    expect(markup).toContain("Swell GEO Growth · $2,500 / month");
    expect(markup).toContain("Swell GEO Scale · $3,500 / month · ARM Mandate Pro · $5,000 / month");
    expect(markup).toContain("not a promise about a third-party answer");
    expect(markup).toContain("No public checkout.");
  });

  it("renders every canonical navigation and campaign CTA destination", () => {
    const markup = renderToStaticMarkup(createElement(Home));

    NAV_LINKS.forEach((link) => expect(markup).toContain(`href=\"${link.href}\"`));
    Object.values(CAMPAIGN_LINKS).forEach((href) => {
      const htmlHref = href.replaceAll("&", "&amp;");
      expect(markup).toContain(`href=\"${htmlHref}\"`);
    });
  });

  it("keeps trust and performance areas explicitly evidence-only until data is verified", () => {
    const markup = renderToStaticMarkup(createElement(Home));

    expect(markup).toContain("Evidence before");
    expect(markup).toContain("the headline.");
    expect(markup).toContain("No approved client");
    expect(markup).toContain("outcome record is");
    expect(markup).toContain("No verified campaign data");
    expect(markup).toContain("is available yet.");
  });

  it("uses an intent-only browser tracking contract on this campaign hub", () => {
    expect(TRACKING_EVENTS).toEqual({
      diagnosticIntent: "SwellDiagnosticIntent",
      workingSessionIntent: "SwellWorkingSessionIntent",
      postIntent: "SwellPostIntent",
      navigationIntent: "SwellNavigationIntent",
    });
  });

  it("renders the verified dashboard state only from a supplied source-backed record", () => {
    const markup = renderToStaticMarkup(createElement(PerformanceDashboard, {
      data: {
        sourceLabel: "Approved source record",
        sourceUrl: "https://example.com/approved-source-record",
        reportingWindow: "Declared reporting window",
        verifiedAt: "Source review complete",
        metrics: [{ label: "Approved field", value: "Approved value", detail: "Source-backed" }],
      },
    }));

    expect(markup).toContain('data-state="verified"');
    expect(markup).toContain("Approved source record");
    expect(markup).toContain("Approved field");
    expect(markup).toContain("Approved value");
  });

  it("keeps case-study claims absent until an approved record is provided", () => {
    const emptyMarkup = renderToStaticMarkup(createElement(CaseStudyEvidence, { records: [] }));
    const approvedMarkup = renderToStaticMarkup(createElement(CaseStudyEvidence, {
      records: [{
        clientLabel: "Approved client label",
        sourceName: "Approved source record",
        sourceUrl: "https://example.com/approved-source-record",
        scope: "Approved scope",
        reportingWindow: "Approved window",
        reviewedAt: "Approved review",
        sourceSupportedFinding: "Approved source-supported finding",
      }],
    }));

    expect(emptyMarkup).toContain("No approved client");
    expect(approvedMarkup).toContain("Approved client label");
    expect(approvedMarkup).toContain("Approved source-supported finding");
  });

  it("renders the consent-aware local Pixel event test utility only when operators enable it", () => {
    const markup = renderToStaticMarkup(createElement(PixelEventTestUtility, { analyticsChoice: "granted", forceOpen: true }));

    expect(markup).toContain("Pixel event");
    expect(markup).toContain("Test diagnostic intent");
    expect(markup).toContain("Open Meta Events Manager Test Events");
  });
});
