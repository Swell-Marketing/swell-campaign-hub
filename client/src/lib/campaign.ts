export const NAV_LINKS = [
  { label: "Services", href: "https://swellmarketing.xyz/services/" },
  { label: "Method", href: "https://swellmarketing.xyz/method/" },
  { label: "Plans", href: "https://swellmarketing.xyz/pricing/" },
  { label: "About", href: "https://swellmarketing.xyz/about/" },
  { label: "Contact", href: "https://swellmarketing.xyz/contact/" },
] as const;

export const CAMPAIGN_LINKS = {
  diagnosticHero:
    "https://swellmarketing.xyz/geo-audit/?utm_source=facebook&utm_medium=organic_social&utm_campaign=swell_page_launch&utm_content=hero_diagnostic",
  signal:
    "https://swellmarketing.xyz/geo-audit/?utm_source=facebook&utm_medium=organic_social&utm_campaign=swell_page_launch&utm_content=post_01_signal",
  method:
    "https://swellmarketing.xyz/method/?utm_source=facebook&utm_medium=organic_social&utm_campaign=swell_page_launch&utm_content=post_02_method",
  diagnostic:
    "https://swellmarketing.xyz/geo-audit/?utm_source=facebook&utm_medium=organic_social&utm_campaign=swell_page_launch&utm_content=post_03_diagnostic",
  booking: "https://meetings-na2.hubspot.com/mason-nguyen",
} as const;

export const CONTACT = {
  phoneDisplay: "(619) 745-6997",
  phoneHref: "tel:+16197456997",
  email: "ops@swellmarketing.xyz",
  website: "https://swellmarketing.xyz/",
} as const;

export const METHOD_STAGES = ["Observe", "Prove", "Decide", "Learn"] as const;
