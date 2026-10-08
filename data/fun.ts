/** Easter eggs: the hidden achievements and the copy of the arcade games (components/fun). */

export type AchievementId =
  | "logo"
  | "bugs"
  | "konami"
  | "thorough"
  | "copycat"
  | "nightowl"
  | "inspector"
  | "sudo"
  | "polyglot"
  | "indecisive"
  | "snake"
  | "whack"
  | "memory"
  | "ping"
  | "stack"
  | "merge"
  | "typer"
  | "duelist"
  | "collector"
  | "bulb"
  | "airdefense"
  | "teapot"
  | "shipit";

export const ACHIEVEMENTS: { id: AchievementId; title: string; detail: string; hint: string }[] = [
  { id: "logo", title: "Persistent", detail: "Clicked the logo five times in a row.", hint: "Logos like attention. Lots of it, quickly." },
  { id: "bugs", title: "Exterminator", detail: "Squashed a bug crawling across the screen.", hint: "Every now and then a bug crawls across the screen. Squash it." },
  { id: "konami", title: "Old school", detail: "Entered the Konami code. Do a barrel roll!", hint: "↑ ↑ ↓ ↓ … you know the rest." },
  { id: "thorough", title: "Thorough", detail: "Scrolled all the way down to the footer.", hint: "Read everything. All the way down." },
  { id: "copycat", title: "Copycat", detail: "Copied something from the page. Ctrl+C, the developer's best friend.", hint: "Select some text and copy it." },
  { id: "nightowl", title: "Night owl", detail: "Browsed this portfolio between midnight and 5 am.", hint: "Some secrets only come out at night." },
  { id: "inspector", title: "Inspector", detail: "Called hire() from the console.", hint: "Developers always open the console first." },
  { id: "sudo", title: "Nice try", detail: "yunus is not in the sudoers file. This incident will be reported.", hint: "Type a famous admin command anywhere on the page." },
  { id: "polyglot", title: "Polyglot", detail: "Got greeted in five languages.", hint: "Say hi to the photo. Then say it again." },
  { id: "indecisive", title: "Indecisive", detail: "Switched the theme eight times in a row.", hint: "Light or dark? Can't decide? Take a few seconds between switches, the bulb is fragile." },
  { id: "snake", title: "Snake charmer", detail: "Scored 10 in Packet Snake.", hint: "Packet Snake: score 10. Golden hotfixes are worth 3." },
  { id: "whack", title: "Bug bounty", detail: "Scored 20 in Whack-a-Bug.", hint: "Whack-a-Bug: score 20. Keep a combo going and leave the features alone." },
  { id: "memory", title: "Total recall", detail: "Finished Stack Match in 14 moves or fewer.", hint: "Stack Match rewards a good memory: 14 moves or fewer." },
  { id: "ping", title: "Low latency", detail: "Averaged under 300 ms in Ping.", hint: "Ping: average under 300 ms, and don't fall for the fake signal." },
  { id: "stack", title: "Orchestrator", detail: "Stacked 15 containers in Container Stack.", hint: "Container Stack: 15 high. Three perfect drops in a row grow the container back." },
  { id: "merge", title: "Merge master", detail: "Reached a 256 commit in Merge Conflict.", hint: "Merge Conflict: merge your way up to 256." },
  { id: "typer", title: "Shell wizard", detail: "Typed 6 commands in 30 seconds in Terminal Typer.", hint: "Terminal Typer: six commands in 30 seconds." },
  { id: "duelist", title: "Duelist", detail: "Beat the bot in the KPSS Düello demo.", hint: "One of the project cards has a sword on it. Win the duel." },
  { id: "bulb", title: "Power surge", detail: "Blew the bulb by switching the theme three times in a row. Somebody had to come and replace it.", hint: "The theme switch is a light bulb. Light bulbs don't like being flicked in a hurry." },
  { id: "airdefense", title: "Air defense", detail: "Cleared a whole wave of targets with the ENGEREK turret.", hint: "One project defends the skies. Fire its turret and leave nothing standing." },
  { id: "teapot", title: "I'm a teapot", detail: "Asked my API for coffee and got a 418.", hint: "My API serves many things. Coffee is not one of them." },
  { id: "shipit", title: "Shipped it", detail: "Deployed the EngerekTech platform from push to production.", hint: "One project card ships to production in a single click." },
  { id: "collector", title: "Word collector", detail: "Emptied the review jar in the Kelime Kavanozu demo.", hint: "One of the project cards has a jar on it. Empty it." },
];

export type GameId = "snake" | "whack" | "memory" | "ping" | "stack" | "merge" | "typer";

/** The arcade's games, in the order of the picker. `unit` follows the best score. */
export const GAMES: { id: GameId; title: string; tagline: string; bestKey: string; unit: string; lowerIsBetter?: boolean }[] = [
  { id: "snake", title: "Packet Snake", tagline: "Eat the requests, don't time out against the walls.", bestKey: "snake-best", unit: "" },
  { id: "whack", title: "Whack-a-Bug", tagline: "Bugs pop up for 30 seconds. Debug them, leave the features alone.", bestKey: "whack-best", unit: "" },
  { id: "stack", title: "Container Stack", tagline: "Drop the containers. Only what overlaps stays on the stack.", bestKey: "stack-best", unit: "" },
  { id: "merge", title: "Merge Conflict", tagline: "Slide the board and merge matching commits. Reach 256.", bestKey: "merge-best", unit: " pts" },
  { id: "memory", title: "Stack Match", tagline: "Find the pairs in my tech stack in as few moves as you can.", bestKey: "memory-best", unit: " moves", lowerIsBetter: true },
  { id: "typer", title: "Terminal Typer", tagline: "Type shell commands as fast as you can for 30 seconds.", bestKey: "typer-best", unit: " cmds" },
  { id: "ping", title: "Ping", tagline: "Click the moment it turns green. Five rounds, lowest latency wins.", bestKey: "ping-best", unit: " ms", lowerIsBetter: true },
];

export const FUN = {
  achievementLabel: "Achievement unlocked",
  complete: {
    title: "Completionist",
    detail: "You found every secret on this site. Shall we build something together?",
    cta: "Say hi",
  },
  stats: { bug: "bug fixed", bugs: "bugs fixed", secrets: "secrets found", open: "Open the trophy case", everyone: "Bugs squashed by every visitor so far", mine: "Bugs you have squashed" },
  hint: { label: "Hint", none: "You already found everything. Impressive." },
  trophies: {
    title: "Trophy case",
    subtitle: "Hidden achievements on this site. Found ones show what you did.",
    locked: "???",
    showHint: "Hint",
    found: "found",
  },
  sudoAgain: "Permission denied. Still.",
  bug: "Squash the bug",
  debugged: "debugged!",
  // The portrait greets in the visitor's browser language first.
  greetings: [
    { lang: "en", text: "Hello!" },
    { lang: "tr", text: "Merhaba!" },
    { lang: "de", text: "Hallo!" },
    { lang: "es", text: "¡Hola!" },
    { lang: "fr", text: "Bonjour!" },
    { lang: "it", text: "Ciao!" },
    { lang: "ja", text: "こんにちは!" },
  ],
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
    subtitle: "Seven small games. Each one hides an achievement.",
    open: "Open the arcade",
    back: "Back",
    close: "Close the arcade",
    best: "Best",
    noBest: "Not played yet",
    play: "Play a game while you're here",
  },
  newBest: "New best!",
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
    intro: "Click the bugs or press 1–9. Red bugs are critical (+3). Don't squash the features ✦ (−2).",
    start: "Start debugging",
    over: "Time's up!",
    again: "Play again",
    hole: "Hole",
    combo: "Combo",
    feature: "That was a feature!",
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
    fake: "Almost…",
    go: "Click!",
    early: "Packet loss! You clicked too early. Click to retry the round.",
    tricked: "That was a fake signal! Click to retry the round.",
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
  stack: {
    start: "Tap, click or press Space to drop",
    over: "The stack fell over!",
    retry: "Tap or Space to try again",
    perfect: "Perfect!",
    height: "Height",
  },
  merge: {
    keys: "Arrows / WASD or swipe to slide",
    over: "No moves left.",
    again: "New game",
    top: "Top commit",
  },
  typer: {
    intro: "Type each command exactly; the next one comes by itself. The clock starts on your first key.",
    placeholder: "type the command…",
    over: "Time's up!",
    commands: "Commands",
    wpm: "WPM",
    accuracy: "Accuracy",
    again: "Try again",
    list: [
      "git status",
      "npm run build",
      "docker compose up -d",
      "git push origin main",
      "kubectl get pods",
      "./mvnw spring-boot:run",
      "flutter run",
      "git checkout -b feature",
      "curl -I localhost:8080",
      "ls -la",
      "git rebase -i HEAD~3",
      "psql -U postgres",
      "ssh deploy@prod",
      "npm i",
      "git log --oneline",
      "docker ps",
      "cat .env",
      "ng serve",
    ],
  },
};
