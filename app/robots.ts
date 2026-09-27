import type { MetadataRoute } from "next";
import { PROFILE } from "@/data/profile";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? PROFILE.site;

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
