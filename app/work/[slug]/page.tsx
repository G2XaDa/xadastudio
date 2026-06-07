import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CASE_STUDIES,
  getCaseStudy,
  getNextCaseStudy,
} from "@/lib/caseStudies";
import CaseStudyClient from "./CaseStudyClient";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const title = `${study.name} — Case Study`;
  const description = study.overview;

  return {
    title,
    description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      title,
      description,
      url: `/work/${study.slug}`,
      type: "article",
      images: [{ url: study.cover }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [study.cover],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const next = getNextCaseStudy(slug);
  return <CaseStudyClient study={study} next={next} />;
}
