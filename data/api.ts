/**
 * "Try my API": a pretend REST API about me, answered in the browser (components/fun/api-console.tsx).
 * Responses are built from the same data as the rest of the site, so they stay true.
 */
import { experiences } from "./experiences";
import { EDUCATION, LANGUAGES, PROFILE } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";

export type Method = "GET" | "POST" | "DELETE";
export type ApiResponse = { status: number; text: string; body?: unknown; effect?: "confetti" | "teapot" | "bug" };

export const API_COPY = {
  title: "Or just ask my API",
  intro: "A pretend REST API about me. Requests never leave your browser; responses come from this site's own data.",
  base: "https://api.yunusemresenyigit.dev",
  send: "Send",
  placeholder: "/me",
  waiting: "Waiting for a request…",
  try: "Try",
};

/** The chips under the request bar, in this order. */
export const SUGGESTED: { method: Method; path: string }[] = [
  { method: "GET", path: "/me" },
  { method: "GET", path: "/skills" },
  { method: "GET", path: "/projects" },
  { method: "GET", path: "/experience" },
  { method: "POST", path: "/hire" },
  { method: "DELETE", path: "/bugs" },
  { method: "GET", path: "/coffee" },
];

const ROUTES: Record<string, ApiResponse> = {
  "GET /me": {
    status: 200,
    text: "OK",
    body: {
      name: PROFILE.name,
      role: PROFILE.role,
      location: PROFILE.location,
      available: PROFILE.available,
      availability: PROFILE.availability,
      education: `${EDUCATION.degree}, ${EDUCATION.school}`,
      languages: LANGUAGES.map((l) => `${l.name} (${l.level})`),
      links: { site: PROFILE.site, github: PROFILE.github, linkedin: PROFILE.linkedin },
    },
  },
  "GET /skills": {
    status: 200,
    text: "OK",
    body: Object.fromEntries(skillGroups.map((g) => [g.name.toLowerCase(), g.skills])),
  },
  "GET /projects": {
    status: 200,
    text: "OK",
    body: projects.map((p) => ({ name: p.title, year: p.year, status: p.status, stack: p.stack.slice(0, 4) })),
  },
  "GET /experience": {
    status: 200,
    text: "OK",
    body: experiences.map((e) => ({ company: e.company, roles: e.roles.map((r) => `${r.title} · ${r.period}`) })),
  },
  "POST /hire": {
    status: 201,
    text: "Created",
    body: { message: "Great choice. Let's talk.", email: PROFILE.email, linkedin: PROFILE.linkedin },
    effect: "confetti",
  },
  "DELETE /bugs": {
    status: 202,
    text: "Accepted",
    body: { message: "Deleting bugs… one just escaped onto your screen. Squash it!" },
    effect: "bug",
  },
  "GET /coffee": {
    status: 418,
    text: "I'm a teapot",
    body: { error: "I'm a teapot", detail: "This server only brews tea.", try: "GET /tea" },
    effect: "teapot",
  },
  "GET /tea": {
    status: 200,
    text: "OK",
    body: { tea: "çay", served_in: "ince belli bardak", sugar: "two cubes", refill: true },
  },
  "GET /secrets": {
    status: 403,
    text: "Forbidden",
    body: { error: "Nice try.", hint: "Secrets are found, not requested. Check the trophy case." },
  },
};

export function respond(method: Method, rawPath: string): ApiResponse {
  const path = "/" + rawPath.trim().replace(/^https?:\/\/[^/]+/, "").replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
  const hit = ROUTES[`${method} ${path}`];
  if (hit) return hit;
  const exists = Object.keys(ROUTES).some((k) => k.endsWith(` ${path}`));
  if (exists) return { status: 405, text: "Method Not Allowed", body: { error: `${method} is not allowed on ${path}` } };
  return { status: 404, text: "Not Found", body: { error: `Nothing at ${path}`, try: SUGGESTED.map((s) => `${s.method} ${s.path}`) } };
}
