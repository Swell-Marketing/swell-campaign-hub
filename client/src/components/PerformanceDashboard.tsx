import React from "react";

export type VerifiedPerformanceRecord = {
  sourceLabel: string;
  sourceUrl: string;
  reportingWindow: string;
  verifiedAt: string;
  metrics: Array<{
    label: string;
    value: string;
    detail?: string;
  }>;
};

type PerformanceDashboardProps = {
  data?: VerifiedPerformanceRecord;
};

export function PerformanceDashboard({ data }: PerformanceDashboardProps) {
  if (!data) {
    return (
      <div className="performance-dashboard" data-state="awaiting-verification">
        <div className="performance-dashboard__main">
          <div className="dashboard-status"><span className="pulse-dot" /> Measurement status · awaiting verified source data</div>
          <h3>No verified campaign data<br />is available yet.</h3>
          <p>The Meta Pixel is configured for consented browser measurement. This page records page and intent signals; completed conversion reporting remains on the first-party Swell destination.</p>
          <div className="dashboard-events" aria-label="Measured event contract">
            <span>Page view</span>
            <span>Diagnostic intent</span>
            <span>Working-session intent</span>
            <span>Post intent</span>
          </div>
        </div>
        <aside className="performance-dashboard__aside">
          <p className="post-card__eyebrow">Reporting standard</p>
          <div><span>Source</span><b>Platform export or first-party record</b></div>
          <div><span>Window</span><b>Declared with each publication</b></div>
          <div><span>State</span><b>Verified before display</b></div>
        </aside>
      </div>
    );
  }

  return (
    <div className="performance-dashboard performance-dashboard--verified" data-state="verified">
      <div className="performance-dashboard__main">
        <div className="dashboard-status"><span className="pulse-dot" /> Measurement status · verified source record</div>
        <h3>Published from a<br />source-backed record.</h3>
        <p>Every displayed field identifies its source and reporting window. Values shown here are limited to the approved public record.</p>
        <div className="dashboard-metrics" aria-label="Verified campaign fields">
          {data.metrics.length > 0 ? data.metrics.map((metric) => (
            <div key={metric.label} className="dashboard-metric">
              <span>{metric.label}</span>
              <b>{metric.value}</b>
              {metric.detail && <small>{metric.detail}</small>}
            </div>
          )) : <p className="dashboard-metrics__empty">No dashboard fields have been approved for public display.</p>}
        </div>
      </div>
      <aside className="performance-dashboard__aside">
        <p className="post-card__eyebrow">Source record</p>
        <div><span>Source</span><a href={data.sourceUrl} target="_blank" rel="noreferrer">{data.sourceLabel}</a></div>
        <div><span>Window</span><b>{data.reportingWindow}</b></div>
        <div><span>Reviewed</span><b>{data.verifiedAt}</b></div>
      </aside>
    </div>
  );
}
