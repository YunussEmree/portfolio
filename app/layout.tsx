import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeProvider from "@/components/ThemeProvider";
import { PROFILE } from "@/data/profile";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

// Update SITE_URL to your actual domain before deploying
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${PROFILE.name} | Backend Developer`,
  description: PROFILE.bio,
  keywords: [
    "backend developer",
    "spring boot",
    "java",
    "nestjs",
    "django",
    "software engineer",
    "react",
    "typescript",
    "antalya",
    "turkey",
    "full stack developer",
    "yunus emre şenyiğit",
  ],
  authors: [{ name: PROFILE.name }],
  creator: PROFILE.name,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${PROFILE.name} | Backend Developer`,
    description: PROFILE.bio,
    url: SITE_URL,
    type: "website",
    locale: "en_US",
    siteName: `${PROFILE.name} Portfolio`,
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: `${PROFILE.name} – Backend Developer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} | Backend Developer`,
    description: PROFILE.bio,
    images: ["/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme: apply dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased`}>
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
