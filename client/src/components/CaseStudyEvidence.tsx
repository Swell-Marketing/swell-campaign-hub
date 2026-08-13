import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { ApprovedCaseStudyRecord } from "@/lib/evidence";

export function CaseStudyEvidence({ records }: { records: readonly ApprovedCaseStudyRecord[] }) {
  if (records.length === 0) {
    return (
      <article className="evidence-empty">
        <div className="evidence-empty__eyebrow"><span className="pulse-dot" /> Evidence ledger status</div>
        <h3>No approved client<br />outcome record is<br /><em>published here yet.</em></h3>
        <p>This hub will show case evidence only when the source record and publication approval are available. Until then, it keeps the claim boundary visible.</p>
      </article>
    );
  }

  return (
    <div className="evidence-records" aria-label="Approved case-study evidence">
      {records.map((record) => (
        <article className="evidence-record" key={`${record.clientLabel}-${record.sourceUrl}`}>
          <p className="post-card__eyebrow">Approved source record</p>
          <h3>{record.clientLabel}</h3>
          <p className="evidence-record__finding">{record.sourceSupportedFinding}</p>
          <dl>
            <div><dt>Scope</dt><dd>{record.scope}</dd></div>
            <div><dt>Window</dt><dd>{record.reportingWindow}</dd></div>
            <div><dt>Reviewed</dt><dd>{record.reviewedAt}</dd></div>
          </dl>
          <a className="text-link" href={record.sourceUrl} target="_blank" rel="noreferrer">
            Review {record.sourceName} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </article>
      ))}
    </div>
  );
}
