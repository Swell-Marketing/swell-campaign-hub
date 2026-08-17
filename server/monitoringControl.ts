/**
 * The Firehose concept is intentionally paused. Keeping this state explicit
 * prevents future changes from treating an external stream or credential as a
 * build dependency or as authority to initiate downstream actions.
 */
export const firehoseMonitoringControl = {
  status: "paused" as const,
  retention: "none" as const,
  automaticActions: [] as const,
} as const;
