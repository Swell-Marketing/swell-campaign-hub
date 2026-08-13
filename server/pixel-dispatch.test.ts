import { afterEach, describe, expect, it, vi } from "vitest";
import { subscribeToPixelDispatches, trackMetaIntent } from "../client/src/lib/metaPixel";
import { TRACKING_EVENTS } from "../client/src/lib/tracking";

describe("Meta Pixel intent dispatch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("dispatches a consented local diagnostic intent to fbq and the operator event log", () => {
    const fbq = vi.fn();
    const observed: string[] = [];
    const unsubscribe = subscribeToPixelDispatches((dispatch) => observed.push(dispatch.eventName));
    vi.stubGlobal("window", { fbq });

    const didDispatch = trackMetaIntent(TRACKING_EVENTS.diagnosticIntent, "pixel_test_utility");
    unsubscribe();

    expect(didDispatch).toBe(true);
    expect(fbq).toHaveBeenCalledWith("trackCustom", TRACKING_EVENTS.diagnosticIntent, { source: "pixel_test_utility" });
    expect(observed).toContain(TRACKING_EVENTS.diagnosticIntent);
  });
});
