import React, { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Compass,
  Menu,
  MoveRight,
  Sparkles,
  Waves,
  X,
} from "lucide-react";
import { CAMPAIGN_LINKS, CONTACT, METHOD_STAGES, NAV_LINKS } from "@/lib/campaign";
import { approvedCaseStudyRecords } from "@/lib/evidence";
import { initializeMetaPixel, trackMetaIntent } from "@/lib/metaPixel";
import { TRACKING_EVENTS, type TrackingEventName } from "@/lib/tracking";
import { CaseStudyEvidence } from "@/components/CaseStudyEvidence";
import { PerformanceDashboard } from "@/components/PerformanceDashboard";
import { PixelEventTestUtility } from "@/components/PixelEventTestUtility";

const postCards = [
  {
    id: "01",
    title: "The Signal",
    eyebrow: "Entity clarity",
    body: "A louder brand is not always a clearer brand. Start with the evidence your organization can support and the answer a buyer actually encounters.",
    href: CAMPAIGN_LINKS.signal,
    cta: "Run the diagnostic",
    visual: "signal",
  },
  {
    id: "02",
    title: "The Method",
    eyebrow: "Representation operations",
    body: "What machines repeat should be traceable to what you can prove. Work from observation to evidence, then choose the first constraint worth repairing.",
    href: CAMPAIGN_LINKS.method,
    cta: "See the method",
    visual: "method",
  },
  {
    id: "03",
    title: "The Diagnostic",
    eyebrow: "A better first question",
    body: "Before adding another page, campaign, or content calendar, identify the first broken link in the system.",
    href: CAMPAIGN_LINKS.diagnostic,
    cta: "Find the first constraint",
    visual: "diagnostic",
  },
];

const portfolioCards = [
  {
    id: "01",
    eyebrow: "Establish the record",
    title: "Name the first constraint.",
    offer: "ARM Signal Audit · $2,500 fixed scope",
    body: "For a consequential representation or workflow question that needs a supported fact base, a clear owner, and a prioritized decision record before recurring work begins.",
  },
  {
    id: "02",
    eyebrow: "Make information usable",
    title: "Create inspectable clarity.",
    offer: "Swell GEO Growth · $2,500 / month",
    body: "For teams that need a source-led representation cadence: visible evidence, structured-data parity, stable internal paths, and a documented monthly review.",
  },
  {
    id: "03",
    eyebrow: "Operate controlled change",
    title: "Keep decisions governable.",
    offer: "Swell GEO Scale · $3,500 / month · ARM Mandate Pro · $5,000 / month",
    body: "For organizations coordinating recurring content, technical representation, source governance, or qualified agent-workflow controls across named reviewers and decision points.",
  },
];

const AUTHORITY_TOOL_URL = "https://swellmarketing.xyz/resources/representation-readiness-map/";

const authoritySources = [
  {
    role: "Primary source",
    title: "Google Search Central",
    body: "Use the official guidance to separate durable search foundations from unsupported AI-search tactics or outcome promises.",
    href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
  },
  {
    role: "Primary source",
    title: "web.dev",
    body: "Agent-friendly interface guidance connects semantic controls, stable layouts, and accessible labels to a clearer path for people and browser agents.",
    href: "https://web.dev/articles/ai-agent-site-ux",
  },
  {
    role: "Identity reference",
    title: "Schema.org Organization",
    body: "Organization identity references should clarify who an entity is; they do not turn a profile or public listing into an endorsement.",
    href: "https://schema.org/Organization",
  },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="brand-mark" aria-label="Swell Marketing home">
      <span className="brand-mark__glyph" aria-hidden="true">
        <Waves strokeWidth={2.2} />
      </span>
      <span className="brand-mark__words">
        <strong>SWELL</strong>
        {!compact && <small>MARKETING</small>}
      </span>
    </a>
  );
}

function DirectionalLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer" onClick={onClick}>
      <span>{children}</span>
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState<"unknown" | "granted" | "declined">("unknown");

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const trackIntent = (eventName: TrackingEventName, source: string) => trackMetaIntent(eventName, source);

  useEffect(() => {
    const savedChoice = window.localStorage.getItem("swell:analytics-consent");
    if (savedChoice === "granted") {
      setAnalyticsChoice("granted");
      initializeMetaPixel();
    } else if (savedChoice === "declined") {
      setAnalyticsChoice("declined");
    }
  }, []);

  const chooseAnalytics = (choice: "granted" | "declined") => {
    window.localStorage.setItem("swell:analytics-consent", choice);
    setAnalyticsChoice(choice);
    if (choice === "granted") initializeMetaPixel();
  };

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" onClick={() => trackIntent(TRACKING_EVENTS.navigationIntent, link.label.toLowerCase())}>
                {link.label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href={CAMPAIGN_LINKS.diagnosticHero} onClick={() => trackIntent(TRACKING_EVENTS.diagnosticIntent, "header")}>
            <span>Run the diagnostic</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" onClick={() => { trackIntent(TRACKING_EVENTS.navigationIntent, `mobile_${link.label.toLowerCase()}`); closeMobileMenu(); }}>
                {link.label}
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            ))}
            <a className="mobile-nav__cta" href={CAMPAIGN_LINKS.diagnosticHero} onClick={() => { trackIntent(TRACKING_EVENTS.diagnosticIntent, "mobile_menu"); closeMobileMenu(); }}>
              Run the free diagnostic
            </a>
          </nav>
        )}
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__glow hero__glow--one" />
          <div className="hero__glow hero__glow--two" />
          <div className="hero__wave-forms" aria-hidden="true">
            <span className="hero__wave-form hero__wave-form--one" />
            <span className="hero__wave-form hero__wave-form--two" />
            <span className="hero__wave-form hero__wave-form--three" />
          </div>
          <div className="hero__texture" aria-hidden="true" />
          <div className="hero__content page-container">
            <div className="hero__eyebrow reveal-item">
              <span className="pulse-dot" />
              Swell Marketing · GEO growth systems
            </div>
            <h1 id="hero-title" className="hero__title reveal-item">
              Make Waves.<br />
              <em>Grow Brands.</em>
            </h1>
            <p className="hero__lede reveal-item">
              The room remembers brands it can verify. Swell maps what your source records support, then makes that information easier for people and systems to inspect.
            </p>
            <div className="hero__actions reveal-item">
              <a className="button button--lime" href={CAMPAIGN_LINKS.diagnosticHero} onClick={() => trackIntent(TRACKING_EVENTS.diagnosticIntent, "hero")}>
                Run the free GEO diagnostic <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="button button--ghost" href={CAMPAIGN_LINKS.booking} target="_blank" rel="noreferrer" onClick={() => trackIntent(TRACKING_EVENTS.workingSessionIntent, "hero")}>
                Book a working session <MoveRight size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="hero__proofline reveal-item">
              <span>01</span> Find the leak <i /> <span>02</span> Repair the signal <i /> <span>03</span> Check the answer
            </div>
          </div>
          <div className="hero__side-caption" aria-hidden="true">
            <span>01 / Evidence before noise</span>
          </div>
        </section>

        <section className="intro-section page-container" aria-labelledby="intro-title">
          <div className="section-label">
            <span>Campaign series</span>
            <div />
          </div>
          <div className="intro-grid">
            <h2 id="intro-title">One signal.<br /><em>Three ways in.</em></h2>
            <div className="intro-copy">
              <p>
                This campaign hub carries the Swell starter series from social attention into one clear decision path: establish the evidence, inspect the first constraint, then choose the next step.
              </p>
              <DirectionalLink href={CAMPAIGN_LINKS.diagnosticHero} onClick={() => trackIntent(TRACKING_EVENTS.diagnosticIntent, "campaign_intro")}>Start with the representation gap</DirectionalLink>
            </div>
          </div>
        </section>

        <section className="authority-atlas" aria-labelledby="authority-title">
          <div className="page-container">
            <div className="authority-atlas__heading">
              <div>
                <p className="section-kicker">Authority system</p>
                <h2 id="authority-title">Make the record<br /><em>inspectable.</em></h2>
              </div>
              <p>
                Useful authority is not a volume metric. It is the condition in which a buyer can identify the organization, inspect what supports a claim, follow a clear action, and understand the boundary of the evidence.
              </p>
            </div>

            <div className="authority-atlas__grid">
              <figure className="authority-hero-image">
                <img
                  src="/manus-storage/representation-gap_44e0c11d.png"
                  alt="A dark architectural structure opposite a layered public information record, illustrating the gap between an organization and how systems can inspect it."
                  width={1672}
                  height={941}
                  loading="lazy"
                />
                <figcaption>Representation gap: the public record requires an inspectable source of truth before more distribution.</figcaption>
              </figure>

              <div className="authority-atlas__copy">
                <p className="section-kicker">Free local worksheet</p>
                <h3>Start with what can be checked.</h3>
                <p>
                  The Representation Readiness Map turns eight plain-language responses into a private inspection list across identity, visible evidence, public access, and buyer decision surfaces. It does not score an organization, retain answers, or predict a search, AI, or browser-agent outcome.
                </p>
                <a className="button button--lime" href={AUTHORITY_TOOL_URL} target="_blank" rel="noreferrer">
                  Open the free Readiness Map <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <p className="authority-atlas__note">No account. No email gate. No retained answers.</p>
              </div>
            </div>

            <div className="authority-visual-grid" aria-label="Evidence, access, and record imagery">
              <figure className="authority-visual-card">
                <img
                  src="/manus-storage/evidence-system_259f69bd.png"
                  alt="A dark architectural evidence system with labeled organization, people, sources, identifiers, publications, citations, and verification layers."
                  width={1672}
                  height={941}
                  loading="lazy"
                />
                <figcaption><span>01</span> Evidence is visible before it is machine-readable.</figcaption>
              </figure>
              <figure className="authority-visual-card">
                <img
                  src="/manus-storage/first-constraint_a7af08d9.png"
                  alt="A dark architectural corridor with ordered rails and a lighted path, representing an upstream constraint that should be inspected before downstream work."
                  width={1672}
                  height={941}
                  loading="lazy"
                />
                <figcaption><span>02</span> The first constraint determines the next valid action.</figcaption>
              </figure>
              <figure className="authority-visual-card">
                <img
                  src="/manus-storage/entity-architecture_f5f839c5.png"
                  alt="An overhead evidence workspace showing a central organization record linked to sources, citations, relationships, and verification materials."
                  width={1122}
                  height={1402}
                  loading="lazy"
                />
                <figcaption><span>03</span> Entity references explain relationship; they do not imply endorsement.</figcaption>
              </figure>
            </div>

            <div className="authority-source-grid" aria-label="Primary sources and reference roles">
              {authoritySources.map((source) => (
                <article className="authority-source-card" key={source.title}>
                  <p>{source.role}</p>
                  <h3>{source.title}</h3>
                  <span>{source.body}</span>
                  <a href={source.href} target="_blank" rel="noreferrer">Open the source <ArrowUpRight size={15} aria-hidden="true" /></a>
                </article>
              ))}
            </div>
            <p className="authority-disclosure">Independent examples—including a competitor—belong here only when a specific public practice can be described fairly. A link is labeled for its actual role and never used to imply affiliation, endorsement, or comparative superiority.</p>
          </div>
        </section>

        <section className="post-showcase" aria-labelledby="posts-title">
          <div className="page-container">
            <div className="showcase-heading">
              <div>
                <p className="section-kicker">The Swell starter series</p>
                <h2 id="posts-title">Built for the<br /><em>next right move.</em></h2>
              </div>
              <p className="showcase-heading__note">Three editorial doors. One canonical system.</p>
            </div>
            <div className="post-grid">
              {postCards.map((post) => (
                <article key={post.title} className={`post-card post-card--${post.visual}`}>
                  <div className="post-card__visual" aria-hidden="true">
                    <span className="post-card__index">{post.id}</span>
                    {post.visual === "signal" && (
                      <>
                        <div className="signal-orbit signal-orbit--one" />
                        <div className="signal-orbit signal-orbit--two" />
                        <Waves className="signal-wave" />
                      </>
                    )}
                    {post.visual === "method" && (
                      <div className="method-mini">
                        {METHOD_STAGES.map((stage, index) => (
                          <div key={stage} className="method-mini__step">
                            <span>0{index + 1}</span>
                            <b>{stage}</b>
                          </div>
                        ))}
                      </div>
                    )}
                    {post.visual === "diagnostic" && (
                      <>
                        <Compass className="diagnostic-compass" />
                        <div className="diagnostic-ring" />
                        <div className="diagnostic-line" />
                      </>
                    )}
                  </div>
                  <div className="post-card__content">
                    <p className="post-card__eyebrow">{post.eyebrow}</p>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                    <a href={post.href} className="post-card__cta" onClick={() => trackIntent(TRACKING_EVENTS.postIntent, post.id)}>
                      {post.cta} <ArrowDownRight size={17} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="method-section page-container" id="method" aria-labelledby="method-title">
          <div className="method-section__header">
            <div>
              <p className="section-kicker">Representation operations</p>
              <h2 id="method-title">The work has<br /><em>an order.</em></h2>
            </div>
            <p>
              A beautiful content program cannot compensate for an organization that machines cannot identify. Swell starts upstream and gives every intervention an acceptance test.
            </p>
          </div>
          <div className="method-track">
            {METHOD_STAGES.map((stage, index) => (
              <div className="method-stage" key={stage}>
                <div className="method-stage__line"><span>{String(index + 1).padStart(2, "0")}</span></div>
                <h3>{stage}</h3>
                <p>
                  {index === 0 && "Record the answer, evidence, and conditions that shape the current representation."}
                  {index === 1 && "Connect important claims to specific first-party evidence and corroboration."}
                  {index === 2 && "Choose the first material constraint instead of adding an unranked backlog."}
                  {index === 3 && "Compare later observations against the same documented baseline."}
                </p>
              </div>
            ))}
          </div>
          <div className="method-section__footer">
            <span><Sparkles size={17} aria-hidden="true" /> Evidence-led by design</span>
            <DirectionalLink href={CAMPAIGN_LINKS.method} onClick={() => trackIntent(TRACKING_EVENTS.navigationIntent, "method_section")}>Explore the Swell method</DirectionalLink>
          </div>
        </section>

        <section className="portfolio-section" aria-labelledby="portfolio-title">
          <div className="page-container">
            <div className="portfolio-section__header">
              <div>
                <p className="section-kicker">Agent-readiness portfolio</p>
                <h2 id="portfolio-title">Make the record<br /><em>usable.</em></h2>
              </div>
              <p>
                AI-mediated discovery and browser agents need clear information, stable paths, and accountable context. The right engagement depends on the first constraint—not a promise about a third-party answer.
              </p>
            </div>
            <div className="portfolio-grid">
              {portfolioCards.map((card) => (
                <article key={card.id} className="portfolio-card">
                  <span className="portfolio-card__index">{card.id}</span>
                  <p className="post-card__eyebrow">{card.eyebrow}</p>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <div className="portfolio-card__offer">{card.offer}</div>
                  <a
                    className="portfolio-card__cta"
                    href={CAMPAIGN_LINKS.booking}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackIntent(TRACKING_EVENTS.workingSessionIntent, `portfolio_${card.id}`)}
                  >
                    Discuss the fit <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
            <p className="portfolio-section__note">No public checkout. A fit review confirms the evidence boundary, delivery capacity, accepted scope, and private collection path before work begins.</p>
          </div>
        </section>

        <section className="evidence-section" aria-labelledby="evidence-title">
          <div className="page-container">
            <div className="evidence-section__header">
              <div>
                <p className="section-kicker">Case-study evidence</p>
                <h2 id="evidence-title">Trust what can be<br /><em>checked.</em></h2>
              </div>
              <p>
                Swell does not turn a finished engagement into a vague success story. A publishable record needs an accountable source, a defined scope, a review date, and permission to share it.
              </p>
            </div>
            <div className="evidence-grid">
              <article className="evidence-standard">
                <div className="evidence-standard__seal"><Check size={19} aria-hidden="true" /></div>
                <p className="post-card__eyebrow">Publication standard</p>
                <h3>Evidence before<br />the headline.</h3>
                <ul>
                  <li><span>01</span> A named first-party or independently verifiable source</li>
                  <li><span>02</span> A clearly bounded question, scope, and timeframe</li>
                  <li><span>03</span> A review state and approval for public use</li>
                </ul>
              </article>
              <CaseStudyEvidence records={approvedCaseStudyRecords} />
            </div>
          </div>
        </section>

        <section className="performance-section" aria-labelledby="performance-title">
          <div className="page-container">
            <div className="performance-section__header">
              <div>
                <p className="section-kicker">Campaign pulse</p>
                <h2 id="performance-title">Results need a<br /><em>source record.</em></h2>
              </div>
              <p>Post-performance becomes visible here only after the originating platform data is verified and the reporting window is recorded.</p>
            </div>
            <PerformanceDashboard />
            <PixelEventTestUtility analyticsChoice={analyticsChoice} />
          </div>
        </section>

        <section className="diagnostic-banner" aria-labelledby="diagnostic-title">
          <div className="diagnostic-banner__wave" aria-hidden="true"><Waves /></div>
          <div className="page-container diagnostic-banner__content">
            <p className="section-kicker">Free GEO diagnostic</p>
            <h2 id="diagnostic-title">The first broken link<br /> <em>sets the ceiling.</em></h2>
            <p className="diagnostic-banner__lede">
              Five questions reveal where identity, access, evidence, authority, or measurement breaks first. No vanity score. Just the next thing worth verifying.
            </p>
            <a className="button button--ink" href={CAMPAIGN_LINKS.diagnosticHero} onClick={() => trackIntent(TRACKING_EVENTS.diagnosticIntent, "diagnostic_banner")}>
              Open the free diagnostic <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="session-section page-container" aria-labelledby="session-title">
          <div className="session-card">
            <div className="session-card__mark"><Check size={22} /></div>
            <p className="section-kicker">Working session</p>
            <h2 id="session-title">Bring the answer<br /><em>costing you trust.</em></h2>
              <p>
              Name the answer a buyer, search system, or browser agent may encounter, what your evidence supports, and why the difference matters commercially. We will recommend one next step.
            </p>
            <a className="button button--outline" href={CAMPAIGN_LINKS.booking} target="_blank" rel="noreferrer" onClick={() => trackIntent(TRACKING_EVENTS.workingSessionIntent, "working_session") }>
              Book a working session <MoveRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="page-container">
          <div className="footer-top">
            <BrandMark />
            <p>Technical foundations, source-led content, authority signals, and governed representation work for brands building their next growth channel.</p>
          </div>
          <div className="footer-grid">
            <div>
              <p className="footer-label">Start here</p>
              <a href={CAMPAIGN_LINKS.diagnosticHero} onClick={() => trackIntent(TRACKING_EVENTS.diagnosticIntent, "footer")}>Free GEO Diagnostic</a>
              <a href={CAMPAIGN_LINKS.booking} target="_blank" rel="noreferrer" onClick={() => trackIntent(TRACKING_EVENTS.workingSessionIntent, "footer")}>Book a working session</a>
            </div>
            <div>
              <p className="footer-label">Explore</p>
              {NAV_LINKS.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer" onClick={() => trackIntent(TRACKING_EVENTS.navigationIntent, `footer_${link.label.toLowerCase()}`)}>{link.label}</a>)}
            </div>
            <div>
              <p className="footer-label">Contact</p>
              <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <a href={CONTACT.website} target="_blank" rel="noreferrer">swellmarketing.xyz</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Swell Marketing</span>
            <span>Make Waves. Grow Brands.</span>
          </div>
        </div>
      </footer>

      {analyticsChoice === "unknown" && (
        <section className="analytics-consent" aria-label="Optional analytics preference">
          <p><strong>Optional analytics</strong> — Allow Swell to measure page and intent signals on this campaign hub.</p>
          <div>
            <button type="button" className="analytics-consent__decline" onClick={() => chooseAnalytics("declined")}>Decline</button>
            <button type="button" className="analytics-consent__accept" onClick={() => chooseAnalytics("granted")}>Allow analytics</button>
          </div>
        </section>
      )}
    </div>
  );
}
