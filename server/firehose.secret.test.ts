import { describe, expect, it } from "vitest";
import { firehoseMonitoringControl } from "./monitoringControl";

describe("Firehose monitoring retirement", () => {
  it("keeps the discontinued monitor paused with no retained data or automatic actions", () => {
    expect(firehoseMonitoringControl.status).toBe("paused");
    expect(firehoseMonitoringControl.retention).toBe("none");
    expect(firehoseMonitoringControl.automaticActions).toEqual([]);
  });
});
