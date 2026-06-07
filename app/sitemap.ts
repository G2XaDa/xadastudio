import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { HUB } from "@/lib/hub";

const SITE_URL = "https://xadastudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}${HUB.href}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...CASE_STUDIES.map((c) => ({
      url: `${SITE_URL}/work/${c.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
