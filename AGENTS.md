# Swell Campaign Hub — Agent Collaboration Handoff

This file is the shared operating contract for anyone changing the **Swell Campaign Hub**. The project supports an evidence-led consultative service model for Swell Marketing and ARM. It is not a self-service storefront, lead-enrichment engine, or place to manufacture proof.

## Mission and commercial boundary

The hub turns qualified attention into one clear path: **diagnostic or fit review → written scope → private collection → onboarding**. The approved recurring offers are **Swell GEO Growth ($2,500/month)**, **Swell GEO Scale ($3,500/month)**, and **ARM Mandate Pro ($5,000/month)**. ARM also has a fixed-scope Signal Audit entry engagement on its own site.

| What the work can promise | What it must not promise |
| --- | --- |
| A scoped audit, representation map, evidence register, technical verification, agent-friendly journey review, source-led content system, governance cadence, acceptance criteria, and documented change log. | Rankings, citations, inclusion in a model answer, third-party model behavior, agent completion, lead volume, conversions, sales, revenue, automated outreach, or a return on spend. |

> **The governing standard is evidence before assertion.** A page, post, dashboard, or proposal may state only what a named and permitted source record can support.

## Project map

| Area | Location | Purpose | Change rule |
| --- | --- | --- | --- |
| Public campaign hub | `client/src/pages/Home.tsx` | The public Swell landing page and campaign narrative. | Preserve the required headings **The Signal**, **The Method**, and **The Diagnostic**, plus the stage order **Observe → Prove → Decide → Learn**. |
| Public links and contact constants | `client/src/lib/campaign.ts` | Canonical Swell links, conversion destinations, and contact information. | Do not introduce public checkout or untracked substitute booking links. |
| Evidence ledger UI | `client/src/components/CaseStudyEvidence.tsx`, `client/src/lib/evidence.ts` | Displays evidence only when a source record is approved for public use. | The ledger remains empty until an approved source record includes publication authorization. Never seed examples, reviews, ratings, or results. |
| Campaign measurement UI | `client/src/components/PerformanceDashboard.tsx`, `client/src/lib/tracking.ts`, `client/src/lib/metaPixel.ts` | Consent-aware campaign signals and explicit no-data state. | Do not add fabricated metrics or bypass consent. |
| Revenue-control board | `client/src/pages/Board.tsx`, `server/routers/opportunities.ts`, `drizzle/schema.ts` | Owner-only opportunity, scope, collection, and onboarding control. | Keep it access-controlled. Never store card details, payment instruments, or client secrets. |
| Server contracts | `server/routers.ts`, `server/db.ts`, `server/routers/` | tRPC procedures and persistence helpers. | Use tRPC procedures; do not add ad hoc client-side API calls. |
| Framework internals | `server/_core/` | OAuth, runtime, and platform plumbing. | Avoid edits unless an approved infrastructure need explicitly requires them. |
| Task register | `todo.md` | Persistent, code-verifiable work history. | Add a new `[ ]` item before implementation. Mark it `[x]` as soon as the feature is complete. Never delete history. |

## Related properties and responsibility split

| Property | Repository / location | Role in the buyer journey |
| --- | --- | --- |
| Swell Marketing | `/home/ubuntu/work/swellmarketing.xyz` | Public authority library, resources, plans, diagnostic, and fit-review preparation. |
| ARM Agency | `/home/ubuntu/work/tired-of-this-site-arm-agency-dot-com` | Signal Check, Audit Fit Review, scope-first ARM path, and ARM engagement presentation. |
| Swell Campaign Hub | `/home/ubuntu/swell-campaign-hub` | Campaign narrative, evidence boundary, consent-aware measurement, and private owner board. |

Changes that span properties must preserve a single consultative next step. A public call to action may lead to a preparation page, diagnostic, or meeting route, but private collection follows only written scope acceptance.

## Operating controls

| Topic | Required behavior |
| --- | --- |
| Client proof | Do not invent, infer, seed, or hardcode testimonials, ratings, reviews, client names, KPIs, outcomes, or success claims. Use the approved evidence contract only. |
| Outreach | Do not follow up, enrich contacts, or add anyone to a sequence without documented authorization and a recipient-initiated response after any one-time approved contact. |
| Social publishing | Each LinkedIn post needs its own owner confirmation. Do not publish, boost, or schedule content automatically. |
| Paid media | No campaign activation until a client has been collected, delivery capacity is confirmed, attribution is reconciled, and the owner has completed payment/account setup. |
| Payments | No public checkout. Send private payment instructions only after versioned written scope acceptance. |
| Firehose | The prior Swell authority-library tap is **paused** by owner direction. Do not resume, stream, modify rules, or create replacement monitoring unless the owner explicitly reapproves a narrow purpose, source scope, retention plan, and review cadence. |
| Secrets and sensitive data | Never commit credentials, payment data, client personal data, intake payloads, or private prospect information. Managed secrets stay server-side. |

## Standard change workflow

Begin by reading `todo.md`, this file, and the files directly affected. For every user-requested change, add a specific unchecked task to `todo.md` before editing. Use existing UI components and project patterns before building replacements. Keep public copy concise, people-first, source-governed, and clear about its boundary.

For a backend or schema change, update the Drizzle schema first, generate and inspect migration SQL, apply the migration through the approved database workflow, add a tRPC contract, and cover it with Vitest. For a front-end change, preserve accessibility, visible focus states, responsive behavior, semantic controls, and consent boundaries. Do not add decorative interactions that hide a conversion path from a human or browser agent.

Run the complete validation suite before declaring work complete:

```bash
cd /home/ubuntu/swell-campaign-hub
pnpm test
pnpm check
pnpm build
```

After tests pass, mark the completed task(s) in `todo.md`, reread the full task register, and create a project checkpoint. Do not publish or deploy directly; the owner uses the project interface after a checkpoint is available.

## Completion record

Every completed change should leave a future agent able to answer five questions without guessing: **What changed? Why was it permitted? Which source or owner decision supports it? How was it tested? What remains intentionally blocked?** Capture the answer in code comments only where needed, in a focused operating note for cross-property decisions, and in the checkpoint description for delivery history.
