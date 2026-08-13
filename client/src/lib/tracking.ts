export const TRACKING_EVENTS = {
  diagnosticIntent: "SwellDiagnosticIntent",
  workingSessionIntent: "SwellWorkingSessionIntent",
  postIntent: "SwellPostIntent",
  navigationIntent: "SwellNavigationIntent",
} as const;

export type TrackingEventName = (typeof TRACKING_EVENTS)[keyof typeof TRACKING_EVENTS];
