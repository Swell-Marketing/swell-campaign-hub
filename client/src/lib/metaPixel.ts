import type { TrackingEventName } from "./tracking";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const pixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

export const hasMetaPixelId = Boolean(pixelId && /^\d+$/.test(pixelId));

export type PixelDispatch = {
  eventName: string;
  source: string;
  dispatchedAt: string;
};

const dispatchListeners = new Set<(dispatch: PixelDispatch) => void>();

function recordDispatch(eventName: string, source: string) {
  const dispatch = { eventName, source, dispatchedAt: new Date().toISOString() };
  dispatchListeners.forEach((listener) => listener(dispatch));
}

export function subscribeToPixelDispatches(listener: (dispatch: PixelDispatch) => void) {
  dispatchListeners.add(listener);
  return () => {
    dispatchListeners.delete(listener);
  };
}

export function initializeMetaPixel() {
  if (!hasMetaPixelId || typeof window === "undefined") return false;
  if (window.fbq) return true;

  const fbq = function (...args: unknown[]) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  } as ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; loaded?: boolean; version?: string };

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
  fbq("track", "PageView");
  recordDispatch("PageView", "pixel_initialize");
  return true;
}

export function trackMetaIntent(eventName: TrackingEventName, source: string) {
  if (!hasMetaPixelId || typeof window === "undefined" || !window.fbq) return false;
  window.fbq("trackCustom", eventName, { source });
  recordDispatch(eventName, source);
  return true;
}
