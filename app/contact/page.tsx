import type { Metadata } from "next";
import ContactClient from "./ContactClient";

const TITLE = "Contact";
const DESCRIPTION =
  "Tell us about your project and we'll get back to you within 24 hours. No fluff, no sales pitch — just a straight conversation. hello@xadastudio.com";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <ContactClient />;
}
