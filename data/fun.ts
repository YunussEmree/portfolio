/** Easter eggs: the hidden achievements and the copy of the arcade games (components/fun). */

export type AchievementId =
  | "logo"
  | "bugs"
  | "konami"
  | "snake"
  | "whack"
  | "memory"
  | "ping"
  | "inspector"
  | "sudo"
  | "polyglot"
  | "indecisive";

export const ACHIEVEMENTS: { id: AchievementId; title: string; detail: string; hint: string }[] = [
  { id: "logo", title: "Persistent", detail: "Clicked the logo five times in a row.", hint: "Logos like attention. Lots of it, quickly." },
  { id: "bugs", title: "Exterminator", detail: "Squashed a bug crawling across the screen.", hint: "Every now and then a bug crawls across the screen. Squash it." },
  { id: "konami", title: "Old school", detail: "Entered the Konami code. Do a barrel roll!", hint: "↑ ↑ ↓ ↓ … you know the rest." },
  { id: "snake", title: "Snake charmer", detail: "Scored 10 in Packet Snake.", hint: "Packet Snake in the arcade: score 10." },
  { id: "whack", title: "Bug bounty", detail: "Scored 20 in Whack-a-Bug.", hint: "Whack-a-Bug in the arcade: score 20. Red bugs count triple." },
  { id: "memory", title: "Total recall", detail: "Finished Stack Match in 14 moves or fewer.", hint: "Stack Match rewards a good memory: 14 moves or fewer." },
  { id: "ping", title: "Low latency", detail: "Averaged under 300 ms in Ping.", hint: "Your reflexes have a ping too. Get it under 300 ms." },
  { id: "inspector", title: "Inspector", detail: "Called hire() from the console.", hint: "Developers always open the console first." },
  { id: "sudo", title: "Nice try", detail: "yunus is not in the sudoers file. This incident will be reported.", hint: "Type a famous admin command anywhere on the page." },
  { id: "polyglot", title: "Polyglot", detail: "Got greeted in five languages.", hint: "Say hi to the photo. Then say it again." },
  { id: "indecisive", title: "Indecisive", detail: "Switched the theme eight times in a row.", hint: "Light or dark? Can't decide?" },
];

export type GameId = "snake" | "whack" | "memory" | "ping";

/** The arcade's games, in the order of the picker. `unit` follows the best score. */
export const GAMES: { id: GameId; title: string; tagline: string; bestKey: string; unit: string; lowerIsBetter?: boolean }[] = [
  { id: "snake", title: "Packet Snake", tagline: "Eat the requests, don't time out against the walls.", bestKey: "snake-best", unit: "" },
  { id: "whack", title: "Whack-a-Bug", tagline: "Bugs pop up for 30 seconds. Debug as many as you can.", bestKey: "whack-best", unit: "" },
  { id: "memory", title: "Stack Match", tagline: "Find the pairs in my tech stack in as few moves as you can.", bestKey: "memory-best", unit: " moves", lowerIsBetter: true },
  { id: "ping", title: "Ping", tagline: "Click the moment it turns green. Five rounds, lowest latency wins.", bestKey: "ping-best", unit: " ms", lowerIsBetter: true },
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
  arcade: {
    title: "Arcade",
    subtitle: "Four small games. Each one hides an achievement.",
    open: "Open the arcade",
    back: "All games",
    close: "Close the arcade",
    best: "Best",
    noBest: "Not played yet",
    play: "Play a game while you're here",
  },
  score: "Score",
  best: "Best",
  time: "Time",
  snake: {
    start: "Press Space or tap to start",
    paused: "Paused. Space to resume",
    over: "Timed out!",
    retry: "Space or tap to try again",
    keys: "Arrows / WASD to move · Space to pause · Esc to close",
  },
  whack: {
    intro: "Click the bugs or press 1–9. Red ones are critical bugs: +3.",
    start: "Start debugging",
    over: "Time's up!",
    again: "Play again",
    hole: "Hole",
  },
  memory: {
    intro: "Flip two cards at a time. Matching pairs stay open.",
    moves: "Moves",
    done: "Stack complete!",
    again: "Shuffle again",
    hidden: "Hidden card",
    stack: ["Java", "Spring", "Kotlin", "TypeScript", "Angular", "React", "Flutter", "Dart", "NestJS", "Docker", "K8s", "Postgres", "MongoDB", "Firebase", "Linux", "nginx"],
  },
  ping: {
    idle: "Click, tap or press Space to start",
    wait: "Wait for green…",
    go: "Click!",
    early: "Packet loss! You clicked too early. Click to retry the round.",
    next: "Click for the next round",
    average: "Average",
    again: "Click to run it again",
    round: "Round",
    ratings: [
      { max: 220, label: "Fiber" },
      { max: 300, label: "Wi-Fi" },
      { max: 450, label: "4G" },
      { max: Infinity, label: "Dial-up" },
    ],
  },
};
