import { ImageResponse } from "next/og";
import { PROFILE } from "@/data/profile";

export const alt = `${PROFILE.name} — ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Only the glyphs the card uses, as TTF from Google Fonts (read at build time). */
async function googleFont(family: string, text: string, variant = "wght@600") {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family}:${variant}&text=${encodeURIComponent(text)}`)
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`No font file for ${family}`);
  return (await fetch(url)).arrayBuffer();
}

const TAGS = ["Spring Boot", "NestJS", "Node", "Flutter", "Firebase", "Docker"];

/** The link preview card for LinkedIn, X, Slack and messaging apps. */
export default async function OpengraphImage() {
  const accent = PROFILE.headline.match(/\*([^*]+)\*/)?.[1] ?? "";
  const site = PROFILE.site.replace("https://", "");
  const sansText = `YE${site}${PROFILE.name} — ${PROFILE.role}${PROFILE.headline}${TAGS.join("")}open to roles`;

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" | "italic" }[] = [];
  try {
    fonts.push({ name: "Geist", data: await googleFont("Geist", sansText, "wght@400"), weight: 400, style: "normal" });
    fonts.push({ name: "Geist", data: await googleFont("Geist", sansText), weight: 600, style: "normal" });
    fonts.push({
      name: "Instrument Serif",
      data: await googleFont("Instrument+Serif", accent, "ital@1"),
      weight: 400,
      style: "italic",
    });
  } catch {
    /* offline build: the default font is used */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#09090b",
          backgroundImage: "radial-gradient(60% 70% at 85% 10%, rgba(198,243,106,0.16), transparent 70%)",
          color: "#ededef",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#ededef",
              color: "#09090b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            YE
          </div>
          <div style={{ fontSize: 28, color: "#9a9ba3" }}>{site}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 32, color: "#9a9ba3", marginBottom: 24 }}>{`${PROFILE.name} — ${PROFILE.role}`}</div>
          {PROFILE.headline.split("|").map((line) => (
            <div key={line} style={{ display: "flex", fontSize: 84, fontWeight: 600, letterSpacing: -3.5, lineHeight: 1.05 }}>
              {line.split(/(\*[^*]+\*)/).filter(Boolean).map((part) =>
                part.startsWith("*") ? (
                  <span
                    key={part}
                    style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontWeight: 400, color: "#c6f36a", letterSpacing: -1, padding: "0 2px 0 22px" }}
                  >
                    {part.slice(1, -1)}
                  </span>
                ) : (
                  <span key={part}>{part.trim()}</span>
                ),
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#9a9ba3" }}>
          {TAGS.map((t) => (
            <div key={t} style={{ border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "8px 20px" }}>
              {t}
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, color: "#c6f36a" }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#c6f36a" }} />
            open to roles
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
