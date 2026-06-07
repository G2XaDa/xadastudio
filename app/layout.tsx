import type { Metadata } from "next";
import { DM_Sans, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import CursorDistortion from "@/components/CursorDistortion";
import { TransitionProvider } from "@/components/PageTransition";
import { RevealProvider } from "@/components/Preloader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Handwritten font used for the testimonial sticky-notes.
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const SITE_URL = "https://xadastudio.com";
const SITE_NAME = "Xada Studio";
const SITE_TAGLINE = "Premium Web Design & Development Studio";
const SITE_DESCRIPTION =
  "Xada Studio designs and builds premium, high-performance websites — and software products for the internet, like xadaHub. From landing pages, business sites, and ecommerce to immersive WebGL and AI-powered tools, built with Next.js, React, GSAP, and Three.js.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "web design studio",
    "web development agency",
    "software studio",
    "software engineering company",
    "software product development",
    "AI website builder",
    "Next.js development",
    "React development",
    "landing page design",
    "business website",
    "ecommerce development",
    "WebGL",
    "Three.js",
    "GSAP animation",
    "premium web design",
    "xadaHub",
    "Xada Studio",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    // og:image is auto-attached from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    // twitter:image falls back to og:image from app/opengraph-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  // Replace the empty string with the verification code from Google Search Console
  // (Search Console → Settings → Ownership verification → HTML tag).
  verification: {
    google: "",
  },
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  email: "hello@xadastudio.com",
  image: `${SITE_URL}/opengraph-image`,
  logo: `${SITE_URL}/icon`,
  founder: {
    "@type": "Person",
    name: "Titas Bugailiškis",
    jobTitle: "Developer & Founder",
  },
  sameAs: [
    "https://www.instagram.com/xadastudio/",
    "https://www.tiktok.com/@xadahub",
    "https://www.facebook.com/profile.php?id=61583792437330",
  ],
  areaServed: "Worldwide",
  knowsAbout: [
    "Web Design",
    "Web Development",
    "Software Engineering",
    "Software Product Development",
    "Artificial Intelligence",
    "AI Applications",
    "Next.js",
    "React",
    "TypeScript",
    "WebGL",
    "Three.js",
    "GSAP",
    "Ecommerce",
    "Landing Pages",
    "SEO",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landing Page Design & Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Website Design & Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ecommerce Store Design & Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Web Features & Integrations" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "WebGL & Animation" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI-Powered Product Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO & Web Performance" } },
  ],
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${dmSans.variable} ${caveat.variable}`}>
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <RevealProvider>
          <TransitionProvider>
            <CursorDistortion />
            <SmoothScroll />
            <Navbar />
            {children}
          </TransitionProvider>
        </RevealProvider>
        <Analytics />
      </body>
    </html>
  );
}
