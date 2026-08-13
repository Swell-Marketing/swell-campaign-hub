export type ApprovedCaseStudyRecord = {
  clientLabel: string;
  sourceName: string;
  sourceUrl: string;
  scope: string;
  reportingWindow: string;
  reviewedAt: string;
  sourceSupportedFinding: string;
};

/**
 * This collection stays empty until Swell receives an approved, public-safe source record.
 * Do not add inferred outcomes, internal-only data, or unapproved client information here.
 */
export const approvedCaseStudyRecords: readonly ApprovedCaseStudyRecord[] = [];
