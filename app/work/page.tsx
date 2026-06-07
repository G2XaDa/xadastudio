import type { Metadata } from "next";
import WorkClient from "./WorkClient";

const TITLE = "Work";
const DESCRIPTION =
  "Selected case studies from Xada Studio — premium websites, ecommerce stores, and immersive web experiences, with the story and the results behind each build.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/work",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <WorkClient />;
}
