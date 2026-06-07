// ─────────────────────────────────────────────────────────────────────────────
// xadaHub — single source of truth for the launch announcement.
//
// Used by the /work featured news block, the announcement post at
// /work/introducing-xada-hub, and the homepage popup. Keep copy here so the
// three surfaces never drift apart.
// ─────────────────────────────────────────────────────────────────────────────

export const HUB = {
  /** URL segment + full path of the announcement post. */
  slug: "introducing-xada-hub",
  href: "/work/introducing-xada-hub",

  /** Branding. "xada" reads solid, "Hub" gets the gradient treatment. */
  brandLead: "xada",
  brandTail: "Hub",

  status: "Now in the making — Coming soon",
  kicker: "Announcement",
  date: "2026",

  title: "Introducing xadaHub",
  tagline: "Build a website just by asking. Powered by AI.",

  /** One-liner for cards, OG description, and the popup. */
  excerpt:
    "Describe what you want, claim a domain, and go live in minutes — our first product, an AI website builder powered by the Anthropic API and custom skills.",

  /** Banner lives in /public (renamed from the original for a URL-safe path). */
  banner: "/xadahub-banner.png",

  /** What it does, in four beats. */
  steps: [
    {
      k: "01",
      title: "Describe it",
      desc: "Tell xadaHub what you want in plain language. No templates, no drag-and-drop — just a conversation.",
    },
    {
      k: "02",
      title: "Claim a domain",
      desc: "Search and buy the perfect domain right inside the Hub. No juggling registrars or DNS.",
    },
    {
      k: "03",
      title: "Go live in minutes",
      desc: "Your site is generated, previewed, and launched end to end — in about two minutes.",
    },
    {
      k: "04",
      title: "Edit by asking",
      desc: "Change anything later the same way you built it: just ask. The AI handles the rest.",
    },
  ],

  /** The stack we're proud of. */
  poweredBy: ["Anthropic API", "Custom Skills", "Domains", "Hosting"],

  /** Follow-for-updates links (Coming soon — no waitlist backend yet). */
  socials: [
    { label: "TikTok", handle: "@xadahub", href: "https://www.tiktok.com/@xadahub" },
    { label: "Instagram", handle: "@xadastudio", href: "https://www.instagram.com/xadastudio/" },
    {
      label: "Facebook",
      handle: "Xada Studio",
      href: "https://www.facebook.com/profile.php?id=61583792437330",
    },
  ],
} as const;
