import React, { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Radio } from "lucide-react";
import { hasMetaPixelId, subscribeToPixelDispatches, trackMetaIntent, type PixelDispatch } from "@/lib/metaPixel";
import { TRACKING_EVENTS } from "@/lib/tracking";

type AnalyticsChoice = "unknown" | "granted" | "declined";

export function PixelEventTestUtility({ analyticsChoice, forceOpen = false }: { analyticsChoice: AnalyticsChoice; forceOpen?: boolean }) {
  const [isTestMode, setIsTestMode] = useState(forceOpen);
  const [dispatches, setDispatches] = useState<PixelDispatch[]>([]);

  useEffect(() => {
    if (!forceOpen) setIsTestMode(new URLSearchParams(window.location.search).get("pixelTest") === "1");
    return subscribeToPixelDispatches((dispatch) => setDispatches((current) => [dispatch, ...current].slice(0, 5)));
  }, [forceOpen]);

  if (!isTestMode) return null;

  const canDispatch = analyticsChoice === "granted" && hasMetaPixelId;
  const dispatchTest = (eventName: keyof typeof TRACKING_EVENTS) => {
    trackMetaIntent(TRACKING_EVENTS[eventName], "pixel_test_utility");
  };

  return (
    <section className="pixel-test-utility" aria-labelledby="pixel-test-title">
      <div className="pixel-test-utility__heading">
        <div><Radio size={18} aria-hidden="true" /><span>Operator utility</span></div>
        <span className={canDispatch ? "pixel-test-utility__state pixel-test-utility__state--ready" : "pixel-test-utility__state"}>{canDispatch ? "Ready to dispatch" : "Consent required"}</span>
      </div>
      <h2 id="pixel-test-title">Pixel event<br /><em>test console.</em></h2>
      <p>Use this only while Meta Events Manager Test Events is open. The console records a local dispatch after consent; confirm receipt in Meta before relying on the event.</p>
      <ol>
        <li>Open the matching Dataset or Pixel in Meta Events Manager and select <strong>Test events</strong>.</li>
        <li>Allow optional analytics on this page, then trigger each event below.</li>
        <li>Confirm the same event name arrives in Meta’s test stream.</li>
      </ol>
      <div className="pixel-test-utility__controls">
        <button type="button" disabled={!canDispatch} onClick={() => dispatchTest("diagnosticIntent")}>Test diagnostic intent</button>
        <button type="button" disabled={!canDispatch} onClick={() => dispatchTest("workingSessionIntent")}>Test working-session intent</button>
        <button type="button" disabled={!canDispatch} onClick={() => dispatchTest("postIntent")}>Test post intent</button>
      </div>
      <div className="pixel-test-utility__log" aria-live="polite">
        {dispatches.length === 0 ? <span>No local test event has been dispatched in this session.</span> : dispatches.map((dispatch) => (
          <span key={`${dispatch.eventName}-${dispatch.dispatchedAt}`}><CheckCircle2 size={14} aria-hidden="true" /> {dispatch.eventName} dispatched locally</span>
        ))}
      </div>
      <a href="https://business.facebook.com/events_manager2/list/pixel/overview" target="_blank" rel="noreferrer" className="text-link">Open Meta Events Manager Test Events <ExternalLink size={15} aria-hidden="true" /></a>
    </section>
  );
}
