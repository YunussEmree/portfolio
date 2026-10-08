/**
 * Playable demos of the mobile apps, opened from their project cards (components/demos).
 * The apps are Turkish, so the demos are too; the frame around them follows the site.
 */

export type DemoId = "kpss" | "kelime";

export const DEMO_CALLOUT: Record<DemoId, { label: string; button: string }> = {
  kpss: { label: "Try a duel!", button: "Play a demo duel of KPSS Düello" },
  kelime: { label: "Try the jar!", button: "Try a demo of Kelime Kavanozu" },
};

export const DEMO_FRAME = {
  subtitle: "A playable demo with sample content. The real app is in closed testing on Google Play.",
  caseStudy: "Read the case study",
  close: "Close the demo",
};

export type DuelQuestion = { topic: string; q: string; options: string[]; answer: number };

export const KPSS_DEMO = {
  you: "Sen",
  bot: "Bot Selin",
  intro: "5 soruluk bir düello. Doğru ve hızlı cevap daha çok puan getirir.",
  start: "Düelloya başla",
  searching: "Rakip aranıyor…",
  found: "Rakip bulundu!",
  question: "Soru",
  timeUp: "Süre doldu",
  correct: "Doğru!",
  wrong: "Yanlış",
  win: "Kazandın! 🏆",
  lose: "Bot Selin kazandı",
  draw: "Berabere!",
  again: "Tekrar oyna",
  seconds: 10,
  questions: [
    { topic: "Tarih", q: "Malazgirt Meydan Muharebesi hangi yılda yapılmıştır?", options: ["1071", "1176", "1243", "1453"], answer: 0 },
    { topic: "Tarih", q: "TBMM hangi tarihte açılmıştır?", options: ["29 Ekim 1923", "23 Nisan 1920", "30 Ağustos 1922", "19 Mayıs 1919"], answer: 1 },
    { topic: "Tarih", q: "Cumhuriyet hangi tarihte ilan edilmiştir?", options: ["23 Nisan 1920", "3 Mart 1924", "29 Ekim 1923", "24 Temmuz 1923"], answer: 2 },
    { topic: "Tarih", q: "İstanbul hangi yılda fethedilmiştir?", options: ["1299", "1402", "1517", "1453"], answer: 3 },
    { topic: "Coğrafya", q: "Türkiye'nin en yüksek dağı hangisidir?", options: ["Erciyes", "Süphan", "Ağrı Dağı", "Uludağ"], answer: 2 },
    { topic: "Coğrafya", q: "Türkiye'nin en büyük gölü hangisidir?", options: ["Tuz Gölü", "Van Gölü", "Beyşehir Gölü", "Eğirdir Gölü"], answer: 1 },
    { topic: "Coğrafya", q: "Tamamı Türkiye sınırları içinde akan en uzun nehir hangisidir?", options: ["Fırat", "Sakarya", "Kızılırmak", "Yeşilırmak"], answer: 2 },
    { topic: "Vatandaşlık", q: "Ankara hangi yıl başkent ilan edilmiştir?", options: ["1920", "1921", "1923", "1924"], answer: 2 },
    { topic: "Vatandaşlık", q: "TBMM kaç milletvekilinden oluşur?", options: ["450", "550", "600", "650"], answer: 2 },
    { topic: "Vatandaşlık", q: "Cumhurbaşkanı kaç yıllığına seçilir?", options: ["4", "5", "6", "7"], answer: 1 },
    { topic: "Türkçe", q: "\"Kitaplık\" sözcüğündeki \"-lık\" eki hangisidir?", options: ["Çekim eki", "Yapım eki", "Hal eki", "Kaynaştırma harfi"], answer: 1 },
    { topic: "Türkçe", q: "Aşağıdakilerden hangisi bir zamirdir?", options: ["güzel", "biz", "koşmak", "hızlıca"], answer: 1 },
    { topic: "Matematik", q: "3x + 5 = 20 ise x kaçtır?", options: ["3", "5", "6", "15"], answer: 1 },
    { topic: "Matematik", q: "Bir sayının %20'si 30 ise bu sayı kaçtır?", options: ["120", "150", "160", "600"], answer: 1 },
  ] as DuelQuestion[],
};

export type JarWord = { word: string; sentence: string; meaning: string };

export const KELIME_DEMO = {
  deck: "YDS · Demo destesi",
  tap: "Anlamı görmek için dokun",
  known: "Biliyorum",
  review: "Tekrar et",
  keys: "← tekrar · boşluk anlam · biliyorum →",
  jar: "Tekrar kavanozu",
  jarRule: "Kavanozdaki kelime, 3 kez doğru bilinince çıkar.",
  learned: "öğrenildi",
  left: "kaldı",
  done: "Deste bitti! 🎉",
  doneDetail: "Bütün kelimeler öğrenildi, kavanoz boş.",
  again: "Baştan başla",
  words: [
    { word: "suspend", sentence: "The match was suspended because of heavy rain.", meaning: "askıya almak, ertelemek" },
    { word: "reluctant", sentence: "She was reluctant to share her answer with the class.", meaning: "isteksiz, gönülsüz" },
    { word: "abundant", sentence: "Fresh water is abundant in this region.", meaning: "bol, çok miktarda" },
    { word: "deteriorate", sentence: "His health began to deteriorate after the long winter.", meaning: "kötüleşmek" },
    { word: "thrive", sentence: "Small plants thrive in warm and humid weather.", meaning: "gelişmek, serpilmek" },
    { word: "inevitable", sentence: "Some mistakes are inevitable when you learn something new.", meaning: "kaçınılmaz" },
  ] as JarWord[],
};

/** The turret on the ENGEREK card (components/demos/turret-callout.tsx). Class labels match the team's detector. */
export const TURRET = {
  label: "Fire!",
  button: "Fire the ENGEREK turret at a wave of targets",
  lock: "LOCK",
  labels: { missile: "fuze", f16: "f16", heli: "helikopter", drone: "drone" },
  down: "✓",
  cleared: "Wave cleared!",
};

/**
 * "Ship it!" on the EngerekTech platform card (components/demos/deploy-callout.tsx): the real pipeline from the case
 * study, sped up. `fail` marks the stage where a flaky test sometimes fails and is re-run.
 */
export const DEPLOY = {
  label: "Ship it!",
  button: "Deploy the EngerekTech platform",
  title: "Build & deploy · main",
  spedUp: "sped up",
  done: "Deployed in",
  stages: [
    { id: "push", label: "push", log: "$ git push origin main" },
    { id: "build", label: "build", log: "▸ GitHub Actions: build Angular SSR + Spring Boot images", fail: "✗ 1 test failed: BlogTranslationTest (flaky)", retry: "↻ re-running failed jobs…" },
    { id: "image", label: "GHCR", log: "✓ images pushed to ghcr.io" },
    { id: "deploy", label: "server", log: "▸ ssh deploy@server · docker compose pull && up -d" },
    { id: "migrate", label: "Flyway", log: "✓ database migrated on start" },
    { id: "live", label: "live", log: "🚀 live at engerektech.com · nginx + TLS" },
  ],
};
