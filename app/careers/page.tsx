import type { Metadata } from "next";
import CareersClient from "./CareersClient";

const TITLE = "Careers";
const DESCRIPTION =
  "Open roles at Xada Studio — Business Development Rep, Social Media Manager, and Web Developer. Remote, part-time, and project-based. Build with us.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/careers" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/careers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <CareersClient />;
}
