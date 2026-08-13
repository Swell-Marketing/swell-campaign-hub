import React, { useState } from "react";
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

function DirectionalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href={CAMPAIGN_LINKS.diagnosticHero}>
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
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" onClick={closeMobileMenu}>
                {link.label}
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            ))}
            <a className="mobile-nav__cta" href={CAMPAIGN_LINKS.diagnosticHero} onClick={closeMobileMenu}>
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
              The room remembers brands it can verify. Swell finds where answers overlook or misrepresent your brand, then builds evidence machines can inspect.
            </p>
            <div className="hero__actions reveal-item">
              <a className="button button--lime" href={CAMPAIGN_LINKS.diagnosticHero}>
                Run the free GEO diagnostic <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="button button--ghost" href={CAMPAIGN_LINKS.booking} target="_blank" rel="noreferrer">
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
              <DirectionalLink href={CAMPAIGN_LINKS.diagnosticHero}>Start with the representation gap</DirectionalLink>
            </div>
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
                    <a href={post.href} className="post-card__cta">
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
            <DirectionalLink href={CAMPAIGN_LINKS.method}>Explore the Swell method</DirectionalLink>
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
            <a className="button button--ink" href={CAMPAIGN_LINKS.diagnosticHero}>
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
              Name what the AI product says, what your evidence supports, and why the difference matters commercially. We will recommend one next step.
            </p>
            <a className="button button--outline" href={CAMPAIGN_LINKS.booking} target="_blank" rel="noreferrer">
              Book a working session <MoveRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="page-container">
          <div className="footer-top">
            <BrandMark />
            <p>Technical foundations, citable content, authority signals, and measurable AI visibility for brands building their next growth channel.</p>
          </div>
          <div className="footer-grid">
            <div>
              <p className="footer-label">Start here</p>
              <a href={CAMPAIGN_LINKS.diagnosticHero}>Free GEO Diagnostic</a>
              <a href={CAMPAIGN_LINKS.booking} target="_blank" rel="noreferrer">Book a working session</a>
            </div>
            <div>
              <p className="footer-label">Explore</p>
              {NAV_LINKS.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}
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
    </div>
  );
}
