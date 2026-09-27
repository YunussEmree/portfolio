import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { PROFILE } from "@/data/profile";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? PROFILE.site;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/cv`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
