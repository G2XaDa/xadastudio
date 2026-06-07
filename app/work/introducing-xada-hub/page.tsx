import type { Metadata } from "next";
import { HUB } from "@/lib/hub";
import HubPostClient from "./HubPostClient";

const TITLE = HUB.title;
const DESCRIPTION = HUB.excerpt;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: HUB.href },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: HUB.href,
    type: "article",
    images: [{ url: HUB.banner, width: 1200, height: 630, alt: "xadaHub — coming soon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [HUB.banner],
  },
};

export default function Page() {
  return <HubPostClient />;
}
