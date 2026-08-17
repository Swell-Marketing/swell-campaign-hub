import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const demoRoot = path.resolve(import.meta.dirname, "../vercel-demo");
const readDemoFile = (name: string) => fs.readFileSync(path.join(demoRoot, name), "utf8");

describe("independent Vercel campaign demonstration", () => {
  it("keeps the required public method language and one canonical diagnostic route", () => {
    const html = readDemoFile("index.html");

    expect(html).toContain("The Signal");
    expect(html).toContain("The Method");
    expect(html).toContain("The Diagnostic");
    expect(html).toContain("Observe");
    expect(html).toContain("Prove");
    expect(html).toContain("Decide");
    expect(html).toContain("Learn");
    expect(html).toContain("https://swellmarketing.xyz/geo-audit/?utm_source=arm-agency");
    expect(html).toContain('rel="canonical" href="https://swellmarketing.arm-agency.com/"');
  });

  it("is portable and excludes public checkout, server endpoints, and runtime-bound assets", () => {
    const html = readDemoFile("index.html");

    expect(html).not.toContain("/manus-storage/");
    expect(html).not.toContain("/api/trpc");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("/checkout");
    expect(html).toContain("No public checkout.");
    expect(html).toContain("SwellMarketing.xyz</strong> remains the canonical Swell authority property");
  });

  it("applies security headers without rewriting the private board into the static demonstration", () => {
    const config = JSON.parse(readDemoFile("vercel.json"));
    const headers = config.headers[0].headers as Array<{ key: string; value: string }>;

    expect(config.cleanUrls).toBe(true);
    expect(config.rewrites).toBeUndefined();
    expect(headers).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "X-Content-Type-Options", value: "nosniff" }),
      expect.objectContaining({ key: "Permissions-Policy" }),
    ]));
  });
});
