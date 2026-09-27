import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { PROFILE } from "@/data/profile";
import { experiences } from "@/data/experiences";
import { EDUCATION } from "@/data/profile";
import { skillGroups } from "@/data/skills";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist", display: "swap" });
// Only the body face is preloaded; the mono labels and the serif accent may arrive a moment later.
const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});
const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? PROFILE.site;
const TITLE = `${PROFILE.name} — ${PROFILE.role}`;
const DESCRIPTION = PROFILE.bio;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f6f6f3" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${PROFILE.name}` },
  description: DESCRIPTION,
  keywords: [
    "backend engineer",
    "software engineer",
    "spring boot",
    "java",
    "nestjs",
    "node.js",
    "flutter",
    "firebase",
    "angular",
    "docker",
    "antalya",
    "türkiye",
    PROFILE.name,
  ],
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    type: "profile",
    locale: "en_US",
    siteName: PROFILE.name,
    firstName: "Yunus Emre",
    lastName: "Şenyiğit",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

/** Structured data so search engines understand who this page is about. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: PROFILE.name,
    jobTitle: PROFILE.role,
    url: SITE_URL,
    image: `${SITE_URL}${PROFILE.photo}`,
    email: `mailto:${PROFILE.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Antalya", addressCountry: "TR" },
    sameAs: [PROFILE.github, PROFILE.linkedin],
    worksFor: experiences
      .filter((e) => e.roles.some((r) => r.period.includes("Present")))
      .map((e) => ({ "@type": "Organization", name: e.company, ...(e.url ? { url: e.url } : {}) })),
    alumniOf: { "@type": "CollegeOrUniversity", name: EDUCATION.school },
    knowsAbout: skillGroups.flatMap((g) => g.skills),
  },
};

// Dark unless the visitor picked light before; runs before the first paint so the theme never flashes.
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light')}catch(e){document.documentElement.classList.add('dark')}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable} ${geistMono.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
