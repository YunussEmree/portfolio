import type { Project, SideProject } from "../types";

const phone = (src: string, alt: string) => ({ src, alt, width: 600, height: 1067 });

/** Flagship work: every entry gets a card on the home page and a case study at /work/<slug>. */
export const projects: Project[] = [
  {
    slug: "kpss-duello",
    title: "KPSS Düello",
    tagline: "Realtime quiz duels with server-verified scoring",
    summary:
      "A mobile app where candidates for KPSS, Türkiye's civil service exam, challenge a friend or a random opponent to a 10-question duel. I designed and built all of it: the Flutter app, the realtime game protocol, the Cloud Functions backend, payments and the release pipeline.",
    year: "2026",
    role: "Product, backend and mobile engineering",
    status: "Closed testing on Google Play",
    stack: ["Flutter", "Dart", "Firebase Realtime DB", "Firestore", "Cloud Functions", "Node.js", "Pub/Sub", "GitHub Actions"],
    links: [{ label: "Watch the trailer", href: "https://youtube.com/shorts/g4NbPTDgWBs" }],
    icon: "/work/kpss-icon.webp",
    demo: "kpss",
    tint: { from: "#3b2a8c", to: "#141a3d" },
    shotKind: "phone",
    shots: [
      phone("/work/kpss-home.webp", "KPSS Düello home screen with the duel call to action and subjects"),
      phone("/work/kpss-duel.webp", "A live duel: a matching question with both players' progress"),
      phone("/work/kpss-result.webp", "Duel result with the question-by-question comparison"),
    ],
    highlights: [
      "Server-authoritative scoring: clients send only their picks and server timestamps; Cloud Functions decide correctness and speed points.",
      "Matchmaking queue with transactional claims, so concurrent players never land in two rooms.",
      "Friend rooms with codes and invites, a server-played bot, weekly leagues and a daily challenge.",
      "Google Play Billing verified on the server, with real-time developer notifications over Pub/Sub.",
    ],
    caseStudy: {
      context:
        "Studying for KPSS is long and lonely. The idea was to make practice social: the same questions, a real opponent, and the one who knows more wins. That only works if nobody can fake a score, and if a duel survives flaky mobile connections.",
      flowTitle: "How a duel is played",
      flow: [
        { label: "Flutter app", detail: "joins the queue or opens a friend room through a callable function" },
        { label: "Cloud Functions", detail: "match players in a transaction, pick the questions and create the room" },
        { label: "Realtime Database", detail: "players write only their pick and a server timestamp per question" },
        { label: "Scoring function", detail: "checks answers against the published question bank and times the answers" },
        { label: "Firestore", detail: "result, profile stats, duel history and league points are written by the server" },
      ],
      sections: [
        {
          title: "Making scores impossible to fake",
          paragraphs: [
            "The first version let each device compute its own score, which meant a modified client could send any number. I moved to a second room protocol: the server creates every room and chooses the questions, and a player can write only two things per question, the chosen answer and a server-generated timestamp.",
            "When both players finish, or one leaves, a function reads the published question bank, checks each answer and computes speed points from the server times. Security rules make every other field read-only for clients, and old app versions keep working in a restricted legacy mode during the migration.",
          ],
        },
        {
          title: "Realtime that survives real phones",
          bullets: [
            "Disconnect handlers mark a player who drops as having left; a stalled opponent ends the duel after 45 seconds instead of hanging it.",
            "When one player finishes, the other's clock runs twice as fast, so nobody waits forever.",
            "If no opponent turns up, a bot is offered after 10 seconds and joins on its own at 20; it plays on the server, its answers are validated like a human's and it never touches league points.",
          ],
        },
        {
          title: "Everything around the game",
          bullets: [
            "Weekly leagues of 30 players with promotion and relegation, a daily challenge, streaks with freezes, a gold economy and cosmetics, all written only by the server.",
            "Mock exams with KPSS subject weights and an estimated score; a mistakes notebook with spaced repetition.",
            "Map questions drawn from Natural Earth data, and a separate map-duel queue.",
            "Question bank and subject catalog edited in a web portal and published to Firestore; the app syncs only the topics that changed.",
            "Subscriptions and one-time purchases verified with the Google Play Developer API; renewals, cancellations and refunds arrive through Pub/Sub.",
          ],
        },
        {
          title: "Testing and release",
          bullets: [
            "About 3,000 Flutter tests, including every question type rendered at two screen sizes to catch overflow.",
            "Node tests for answer checking and scoring, plus security-rules and integration tests that run against the Firebase emulators in CI.",
            "Pushing a version tag builds the app bundle in GitHub Actions and uploads it to the Play testing track.",
            "App Check with Play Integrity is rolled out in monitor mode before enforcement.",
          ],
        },
      ],
      lessons: [
        "Put the trust boundary on the server from day one; migrating a live protocol is much harder than designing it right.",
        "Emulator-backed rules tests are cheap insurance for a Firebase backend.",
      ],
    },
  },
  {
    slug: "engerektech-platform",
    title: "EngerekTech platform",
    tagline: "Company site, AI-assisted blog and internal portal on a self-hosted stack",
    summary:
      "The public website of my studio and the portal the team works in, built on Angular SSR and Spring Boot and run on a Linux server I manage. It publishes a bilingual blog with AI-assisted writing and translation, and gives the team analytics, a tester mailing tool and the question-bank editor for our apps.",
    year: "2026",
    role: "Full-stack engineering and operations",
    status: "Live",
    stack: ["Angular SSR", "Spring Boot", "Java 25", "PostgreSQL", "Docker", "GitHub Actions", "nginx", "Claude API"],
    links: [{ label: "engerektech.com", href: "https://engerektech.com/en" }],
    icon: "/logos/engerektech.svg",
    demo: "deploy",
    tint: { from: "#3569d9", to: "#1a2a55" },
    shotKind: "browser",
    shots: [
      { src: "/work/engerektech-home.webp", alt: "engerektech.com home page in English", width: 1200, height: 750 },
      { src: "/work/engerektech-blog.webp", alt: "The EngerekTech blog with search and topic filters", width: 1200, height: 750 },
    ],
    highlights: [
      "Angular with server-side rendering in front of a Spring Boot API and PostgreSQL, deployed as containers by GitHub Actions.",
      "Turkish and English pages with hreflang, sitemap, RSS and llms.txt; blog posts are translated to English automatically.",
      "WebMCP tools and agent discovery files, so AI assistants can read and use the site.",
      "Internal portal: privacy-friendly analytics, tester mailings, push notifications and the KPSS question bank.",
    ],
    caseStudy: {
      context:
        "A studio needs a site that sells, a blog that keeps it visible and an internal tool for everything else. I wanted all three on one codebase, cheap to run on a small server and easy to change every day.",
      flowTitle: "From push to production",
      flow: [
        { label: "git push", detail: "a commit on main starts the Build & deploy workflow" },
        { label: "GitHub Actions", detail: "builds the Angular SSR and Spring Boot images and pushes them to GHCR" },
        { label: "Linux server", detail: "pulls the new images over SSH and restarts them with Docker Compose" },
        { label: "nginx + TLS", detail: "routes the site, the API and analytics; Flyway migrates the database on start" },
      ],
      sections: [
        {
          title: "A blog that writes and translates itself, with a human in charge",
          paragraphs: [
            "A scheduled job scans tech news every hour. When the team picks a story, the Claude API researches it and writes a sourced draft, a 15-point SEO check fixes what is missing and a branded cover image is drawn. Nothing is published without review.",
            "Every published post gets an English version: a job translates one post a minute with structured output, keeps links and Markdown intact, maps internal links to their English pages and re-translates when the Turkish text changes, detected by a content hash.",
          ],
        },
        {
          title: "Built to be found by people and by AI",
          bullets: [
            "Server-side rendering, per-page metadata, hreflang pairs and a generated sitemap for both languages.",
            "FAQ and article structured data derived from the post content.",
            "WebMCP: the contact form and site tools are described so browser agents can use them; ARD and AI-catalog files point agents to an agent skill.",
            "Blog search, reading progress and share tools, in both languages.",
          ],
        },
        {
          title: "The portal the team works in",
          bullets: [
            "Google sign-in with an allowlist.",
            "Site visits from a self-hosted, cookieless Umami instance, for the last day, 7 days, 30 days or all time.",
            "Tester mailings whose release notes are written for users from the full commit history of each app.",
            "Push notifications to app users, and the question bank and subject catalog of KPSS Düello, published to Firestore.",
          ],
        },
        {
          title: "Operations",
          bullets: [
            "Runs on 1 vCPU and 2 GB of RAM with Docker Compose, host nginx and Let's Encrypt.",
            "Company email on a separate server with Mailu (Postfix, Dovecot, Rspamd, Roundcube), SPF, DKIM and DMARC, relayed through Amazon SES; a small forwarder rewraps shared mailboxes so they reach one inbox.",
            "Errors go to Sentry; uptime is checked by a scheduled workflow.",
          ],
        },
      ],
      lessons: [
        "A small server goes a long way when the build does the heavy lifting.",
        "AI features earn their place when there is a clear review step and a cheap way to redo the work.",
      ],
    },
  },
  {
    slug: "kelime-kavanozu",
    title: "Kelime Kavanozu",
    tagline: "Offline-first vocabulary app for five languages",
    summary:
      "A vocabulary app built around one idea: learn every word inside a sentence. Words you miss drop into a review jar and leave it only after you get them right three times. Decks cover English, German, Spanish, French and Arabic, from A1 to C2 and for Turkish language exams.",
    year: "2026",
    role: "Product and mobile engineering",
    status: "Closed testing on Google Play",
    stack: ["Flutter", "Dart", "Firebase Cloud Messaging", "Android"],
    links: [{ label: "Watch the trailer", href: "https://youtube.com/shorts/cnUsxQX81Jw" }],
    icon: "/work/kk-icon.webp",
    demo: "kelime",
    tint: { from: "#27513f", to: "#0f1f18" },
    shotKind: "phone",
    shots: [
      phone("/work/kk-card.webp", "A word card showing the word suspend inside an example sentence"),
      phone("/work/kk-jar.webp", "The jar screen with progress and the review jar"),
      phone("/work/kk-decks.webp", "Choosing a deck: YDS, YÖKDİL, YDT and English levels"),
    ],
    highlights: [
      "Sentence-first cards: tap to see the meaning, swipe to mark it known or to review.",
      "A review jar with a simple spaced-repetition rule: three correct answers take a word out.",
      "Exam decks (YDS, YÖKDİL, YDT, Goethe) and CEFR levels from A1 to C2.",
      "Works fully offline; streaks, themes and unlockable effects keep people coming back.",
    ],
    caseStudy: {
      context:
        "Most word apps show a word and its translation. People remember words better in context, and they quit when an app needs a connection or feels like homework. The goal was a calm, fast app that works on a train with no signal.",
      flowTitle: "How a word moves through the app",
      flow: [
        { label: "Deck", detail: "the learner picks an exam or a level and the jar fills with its words" },
        { label: "Card", detail: "the word appears inside an example sentence; a tap shows the meaning" },
        { label: "Review jar", detail: "a missed word goes here and comes back until it is right three times" },
        { label: "Streak", detail: "daily goals and streaks unlock new effects, sounds and themes" },
      ],
      sections: [
        {
          title: "Design decisions",
          bullets: [
            "Everything ships inside the app, so study never waits for the network.",
            "One gesture vocabulary on every card: tap for the meaning, swipe or tap a button to answer, undo the last card.",
            "Streaks unlock new effects and sounds, and themes let people make the app their own.",
          ],
        },
        {
          title: "Shipping it",
          bullets: [
            "Android 15 edge-to-edge support with correct insets on the word editor.",
            "Store listing, screenshots and privacy policy prepared in-house; releases go through Play testing tracks.",
            "Push notifications through Firebase Cloud Messaging.",
          ],
        },
      ],
      lessons: ["Small, opinionated rules (three correct answers and it's out) are easier to trust than clever algorithms."],
    },
  },
  {
    slug: "engerek",
    title: "ENGEREK",
    tagline: "An autonomous air-defense turret for TEKNOFEST 2026",
    summary:
      "Our entry for TEKNOFEST 2026's Steel Dome air-defense competition: a pan-tilt turret with an airsoft gun that finds target models, tells them apart and engages them, by hand or on its own. As team captain I led 13 people across software, electronics and mechanics, and worked on the vision and targeting software myself.",
    year: "2026",
    role: "Team captain · vision and targeting software",
    status: "TEKNOFEST 2026",
    stack: ["Python", "YOLOv11", "ByteTrack", "OpenCV", "NVIDIA Jetson", "Teensy 4.1"],
    links: [],
    demo: "engerek",
    tint: { from: "#1f3b4d", to: "#0b1720" },
    shotKind: "browser",
    shots: [
      { src: "/work/engerek-ui.webp", alt: "ENGEREK operator station: camera view with numbered targets, mode, zones and fire control", width: 794, height: 406 },
      { src: "/work/engerek-detect.webp", alt: "Simulation frame with YOLOv11 detections of helicopters, F-16s, missiles and drones", width: 472, height: 245 },
    ],
    highlights: [
      "Two fixed cameras are merged into one panorama for detection; a third on the barrel confirms the aim.",
      "A YOLOv11 model, trained on synthetic renders of the competition models, tells F-16s, helicopters, missiles and drones apart; ByteTrack follows them.",
      "Manual, semi-automatic and automatic modes on one operator screen, with emergency stops, no-move and no-fire zones and friend protection.",
    ],
    caseStudy: {
      context:
        "TEKNOFEST's Steel Dome competition asks for a system that finds red enemy models among blue friendly ones, classifies each by type and pops the balloon under it with an airsoft shot, within 15 metres, both manually and autonomously. The order and the range windows depend on the target type, so classification decides most of the score.",
      flowTitle: "From frame to shot",
      flow: [
        { label: "Cameras", detail: "two fixed cameras are undistorted and stitched into one panorama; the barrel camera watches the line of fire" },
        { label: "YOLOv11 + ByteTrack", detail: "detect the target models, classify them by type and keep their tracks" },
        { label: "Targeting", detail: "reads friend or foe from the model's colour, checks range and zones, and orders the targets" },
        { label: "Teensy 4.1", detail: "drives the pan-tilt motors in a closed loop from the main computer's commands" },
        { label: "Fire control", detail: "arms and fires only inside permitted zones; the emergency stop cuts both motion and fire" },
      ],
      sections: [
        {
          title: "What I did",
          bullets: [
            "Captained a 13-person team across software, electronics and mechanics through the preliminary and critical design reports.",
            "Built the real-time detection and tracking pipeline and integrated it with the turret's embedded control.",
          ],
        },
        {
          title: "When synthetic data meets bright light",
          paragraphs: [
            "The detector was trained on synthetic images of the competition models. On the real turret it struggled in bright light, so we measured instead of guessing: live frames were far less saturated than anything in the training set, even its palest example.",
            "The cause was an ordering bug in the renderer: scene lighting was applied to the background only and the models were drawn at full saturation on top, so the model learned \"saturated blob = target\". The same bug was quietly breaking the friend-or-foe colour check. Fixing the renderer fixed both.",
          ],
        },
        {
          title: "Safety first",
          bullets: [
            "Emergency stop in software and in hardware, for motion and for fire separately.",
            "No-move and no-fire zones the turret cannot enter, and protection for friendly targets.",
            "Three modes, so a person can always take over: manual, semi-automatic and automatic.",
          ],
        },
      ],
      lessons: [
        "Measure before you guess: comparing live frames with the training set found the bright-light problem quickly.",
        "Synthetic data is only as good as its lighting, and one bug can break more than one feature.",
      ],
    },
  },
];

/** Earlier, research and competition projects: a compact list under the flagship work. */
export const sideProjects: SideProject[] = [
  {
    title: "Instagram content automation",
    context: "EngerekTech",
    year: "2026",
    desc: "Prepares and publishes a daily post for the apps' Instagram accounts from their question and word banks, rendered with an on-brand template.",
    stack: ["Spring Boot", "Java 2D", "Instagram Graph API"],
  },
  {
    title: "SosyalizBiz",
    context: "Gençlik Hackathonu",
    year: "2025",
    desc: "Event discovery and social platform with Google sign-in, filters, location navigation and email reminders, delivered as a working MVP.",
    stack: ["React", "Spring Boot", "PostgreSQL", "Docker"],
    href: "https://github.com/YunussEmree/sosyalizbiz",
  },
  {
    title: "Fungify",
    context: "TÜBİTAK 2209-B",
    year: "2024",
    desc: "Flutter app that classifies images through a Spring Boot API calling a Python model.",
    stack: ["Flutter", "Spring Boot", "Python"],
    href: "https://github.com/YunussEmree/Fungify",
  },
  {
    title: "Buyer",
    context: "Open source",
    year: "2024",
    desc: "E-commerce backend with a domain-oriented structure, JWT authentication and consistent API responses.",
    stack: ["Spring Boot", "Spring Security", "PostgreSQL", "Docker"],
    href: "https://github.com/YunussEmree/buyer",
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
