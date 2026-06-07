// ─────────────────────────────────────────────────────────────────────────────
// Case-study data — single source of truth for /work and /work/[slug].
//
// To publish a real case study: add one object to CASE_STUDIES below. The index
// listing and the detail page both read from here. Images live in /public.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#a78bfa";

export type Metric = { label: string; value: string };

export type CaseStudy = {
  /** URL segment — /work/<slug> */
  slug: string;
  name: string;
  client: string;
  /** Short category, e.g. "Business Website" */
  type: string;
  year: string;
  /** Hero / cover image path in /public */
  cover: string;
  /** Per-study accent colour (defaults to brand purple) */
  accent: string;
  /** Tilt for the floating hover preview on the index (see WorkShowcase) */
  rotate: number;
  /** One-liner shown on the index row */
  excerpt: string;
  /** Live site, opens in a new tab */
  liveHref?: string;
  // ── Detail-page content (template placeholders for now) ──────────────────
  role: string[];
  overview: string;
  challenge: string;
  approach: string;
  outcome: string;
  gallery: string[];
  metrics: Metric[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "st-concrete",
    name: "S&T Concrete",
    client: "S&T Concrete Solutions",
    type: "Business Website",
    year: "2026",
    cover: "/stconcrete.png",
    accent: ACCENT,
    rotate: 3,
    excerpt: "A trade brand reframed as a premium, conversion-first web presence.",
    liveHref: "https://www.st-concrete.com",
    role: ["Strategy", "Web Design", "Development", "SEO"],
    overview:
      "S&T Concrete had the craft but not the credibility online. We rebuilt their presence around a single goal: turn local searches into booked quotes, with a site that feels as solid as the work itself.",
    challenge:
      "The old site buried the services, loaded slowly on mobile, and gave prospects no reason to trust the team over a dozen identical competitors. Leads were leaking at every step.",
    approach:
      "We led with proof — real projects, real numbers — and designed a fast, opinionated layout that walks a visitor from problem to quote in a few scrolls. Built on Next.js with image optimisation and structured data baked in.",
    outcome:
      "A site that loads in under a second, ranks for the services that matter, and gives the team a link they're proud to hand out. Enquiries now arrive pre-qualified.",
    gallery: [],
    metrics: [
      { label: "Lighthouse Performance", value: "98" },
      { label: "Faster Load Time", value: "3.4×" },
      { label: "More Qualified Leads", value: "+62%" },
    ],
  },
  {
    slug: "sourdough-construction",
    name: "Sourdough Construction",
    client: "Sourdough Construction LLC",
    type: "Business Website",
    year: "2026",
    cover: "/sourdough.png",
    accent: "#c084fc",
    rotate: -2,
    excerpt: "Editorial structure and motion for a construction firm that builds to last.",
    liveHref: "https://www.sourdoughconstructionllc.com",
    role: ["Brand Direction", "Web Design", "Development", "Motion"],
    overview:
      "Sourdough wanted to look less like a contractor and more like a studio. We gave them an editorial, photography-led site with motion that earns attention without getting in the way.",
    challenge:
      "Construction sites tend to look the same: stock photos, tired templates, no point of view. Sourdough needed to stand apart while still reading as dependable to everyday clients.",
    approach:
      "We built a typographic system with generous whitespace, scroll-driven reveals, and a project gallery that lets the work speak. Every interaction is tuned to feel intentional, never decorative.",
    outcome:
      "A presence that punches above the firm's size and gives the sales conversation a confident head start — visitors arrive already impressed.",
    gallery: [],
    metrics: [
      { label: "Avg. Session Duration", value: "2.8×" },
      { label: "Bounce Rate", value: "−41%" },
      { label: "Lighthouse Accessibility", value: "100" },
    ],
  },
  {
    slug: "evans-custom-home",
    name: "Evans Custom Homes",
    client: "Evans Custom Homes LLC",
    type: "Business Website",
    year: "2026",
    cover: "/evanscustomhome.jpg",
    accent: "#c2a06a",
    rotate: -1,
    excerpt: "An heirloom home builder given a digital flagship as crafted as the houses.",
    liveHref: "https://www.evanscustomhome.com",
    role: ["Web Design", "Development", "Motion", "SEO"],
    overview:
      "Evans Custom Homes builds heirloom houses across the North Atlanta metro. We gave founder Trevor Evans a site with the same standard of craft — editorial, photography-led, and built to earn trust before the first call.",
    challenge:
      "Custom-home builders tend to look the same online: stock galleries, contractor templates, no point of view. Evans needed a presence that signalled genuine craftsmanship and turned high-intent visitors into qualified build enquiries.",
    approach:
      "We led with the work — full-bleed photography, an editorial type system, and scroll-driven motion that reveals each home like a portfolio. A clear 'Begin your build' path runs throughout, with the founder's story up front to earn trust. Engineered on Next.js: fast, accessible, and SEO-ready.",
    outcome:
      "A flagship that looks like the homes it sells — warm, confident, built to last. Evans now has a link that does the selling before the first meeting, with enquiries arriving already sold on the standard.",
    gallery: ["/evanscustomhome-full.jpg"],
    metrics: [
      { label: "Lighthouse Performance", value: "99" },
      { label: "Locations Served", value: "6" },
      { label: "Custom-Built, No Templates", value: "100%" },
    ],
  },
];

export const getCaseStudy = (slug: string): CaseStudy | undefined =>
  CASE_STUDIES.find((c) => c.slug === slug);

/** The next study in the list (wraps around) — used for the bottom link. */
export const getNextCaseStudy = (slug: string): CaseStudy => {
  const i = CASE_STUDIES.findIndex((c) => c.slug === slug);
  return CASE_STUDIES[(i + 1) % CASE_STUDIES.length];
};
