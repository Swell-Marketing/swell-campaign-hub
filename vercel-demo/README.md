# ARM × Swell Campaign Demonstration

This directory is the independent static deployment source for `swellmarketing.arm-agency.com`. It deliberately contains no server runtime, environment variables, payment integration, visitor form, CRM connection, analytics tag, public checkout, or client-performance claim.

The directory must be selected as the **Root Directory** for a separate Vercel project under the COREWEAVER team. It must not be attached to the existing ARM production project. The final custom-domain binding must use the authoritative Vercel DNS zone for `arm-agency.com`, not the Hostinger registrar interface.

## Public-content boundary

The page is a compact referred-visit demonstration. `swellmarketing.xyz` remains the canonical Swell authority property for service pages, resources, diagnostics, and any source-governed long-form content. This page provides one tracked consultative path back to the canonical Swell GEO diagnostic and does not duplicate the Swell homepage, pricing, or resource library.

## Validation

The repository test suite includes `server/vercelDemo.test.ts`, which checks the required method language, the single canonical diagnostic route, portable static asset behavior, commercial exclusions, and the Vercel security configuration.
