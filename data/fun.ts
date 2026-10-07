/** Easter eggs: the hidden achievements and the copy of the mini games (components/fun). */

export type AchievementId = "logo" | "bugs" | "konami" | "snake" | "inspector" | "sudo" | "polyglot" | "indecisive";

export const ACHIEVEMENTS: { id: AchievementId; title: string; detail: string; hint: string }[] = [
  { id: "logo", title: "Persistent", detail: "Clicked the logo five times in a row.", hint: "Logos like attention. Lots of it, quickly." },
  { id: "bugs", title: "Exterminator", detail: "Fixed five bugs in the footer.", hint: "There are bugs in the footer. Somebody should fix them." },
  { id: "konami", title: "Old school", detail: "Entered the Konami code. Do a barrel roll!", hint: "↑ ↑ ↓ ↓ … you know the rest." },
  { id: "snake", title: "Snake charmer", detail: "Scored 10 in Packet Snake.", hint: "There is a game in the footer. Score 10." },
  { id: "inspector", title: "Inspector", detail: "Called hire() from the console.", hint: "Developers always open the console first." },
  { id: "sudo", title: "Nice try", detail: "yunus is not in the sudoers file. This incident will be reported.", hint: "Type a famous admin command anywhere on the page." },
  { id: "polyglot", title: "Polyglot", detail: "Got greeted in five languages.", hint: "Say hi to the photo. Then say it again." },
  { id: "indecisive", title: "Indecisive", detail: "Switched the theme eight times in a row.", hint: "Light or dark? Can't decide?" },
];

export const FUN = {
  achievementLabel: "Achievement unlocked",
  complete: {
    title: "Completionist",
    detail: "You found every secret on this site. Shall we build something together?",
    cta: "Say hi",
  },
  stats: { bug: "bug fixed", bugs: "bugs fixed", secrets: "secrets found", hint: "Get a hint" },
  hint: { label: "Hint", none: "You already found everything. Impressive." },
  sudoAgain: "Permission denied. Still.",
  bug: "Squash the bug",
  debugged: "debugged!",
  greetings: ["Hello!", "Merhaba!", "Hallo!", "¡Hola!", "Bonjour!", "Ciao!", "こんにちは!"],
  sayHi: "Say hi",
  away: "👀 Come back, the bugs miss you",
  console: {
    banner: "Hey, fellow developer 👋",
    body: "Thanks for looking under the hood. This site is Next.js, Tailwind and no animation library.",
    call: "Type hire() and press Enter.",
    reply: "📬 Great choice! Write to",
  },
  snake: {
    title: "Packet Snake",
    subtitle: "Eat the requests, don't time out against the walls.",
    start: "Press Space or tap to start",
    paused: "Paused. Space to resume",
    over: "Timed out!",
    retry: "Space or tap to try again",
    score: "Score",
    best: "Best",
    keys: "Arrows / WASD to move · Space to pause · Esc to close",
  },
  playSnake: "Play Packet Snake while you're here",
};
