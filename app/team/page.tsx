import type { Metadata } from "next";
import TeamClient from "./TeamClient";

const TITLE = "The Team";
const DESCRIPTION =
  "Meet the three people behind Xada Studio — strategy, development, and growth. We design and build premium web experiences with Next.js, WebGL, and motion.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/team" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/team",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <TeamClient />;
}
