/* ═══════════════════════════════════════════════════════════════════════
   TYPEWRITER
   Types a phrase out letter by letter, holds it, erases it, and moves
   on to the next one. Forever.

   The blinking "|" is not done here — it is a plain character in the
   HTML that blinks through CSS. That way it keeps blinking steadily
   even while letters are being typed, the way a real cursor does.
   ═══════════════════════════════════════════════════════════════════════ */

/* ─── EDIT HERE ────────────────────────────────────────────────────────
   The phrases, in the order they appear. Add or remove lines freely.
   Keep your name first — it is the one people came for.
   ────────────────────────────────────────────────────────────────────── */
const PHRASES = [
  "Deyssi Vedzijeva",
  "Engineer",
  "Woman in IT",
  "Student",
  "Kung fu practitioner",
  "Gymnast",
  "AI & Data Specialization",
];

/* Timings, all in milliseconds. Bigger number = slower. */
const TYPE_SPEED = 85; /* pause between two typed letters   */
const ERASE_SPEED = 40; /* pause between two erased letters  */
const HOLD_TIME = 1700; /* how long a finished phrase stays  */
const PAUSE_TIME = 350; /* blank moment before the next one  */

/* ─── The element the letters get written into ─────────────────────── */
const output = document.querySelector(".typewriter__text");

/* ─── A small helper: waits for a number of milliseconds ────────────── */
function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/* ─── Write one phrase, one letter at a time ────────────────────────── */
async function typePhrase(phrase) {
  for (let length = 1; length <= phrase.length; length++) {
    output.textContent = phrase.slice(0, length);
    await wait(TYPE_SPEED);
  }
}

/* ─── Take one phrase back off, one letter at a time ────────────────── */
async function erasePhrase(phrase) {
  for (let length = phrase.length; length >= 0; length--) {
    output.textContent = phrase.slice(0, length);
    await wait(ERASE_SPEED);
  }
}

/* ─── The loop that runs for as long as the page is open ────────────── */
async function runTypewriter() {
  while (true) {
    for (const phrase of PHRASES) {
      await typePhrase(phrase);
      await wait(HOLD_TIME);
      await erasePhrase(phrase);
      await wait(PAUSE_TIME);
    }
  }
}

/* ─── Start ─────────────────────────────────────────────────────────── */
if (output) {
  const motionIsOff = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (motionIsOff) {
    // Someone asked their system for less movement, so just show the name.
    output.textContent = PHRASES[0];
  } else {
    runTypewriter();
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   SEASON EASTER EGG
   The button in the top left shows the emoji for whatever season it is
   right now. Press it and that emoji rains down the page. Press it
   again to stop.

   The container the emoji fall into is built here, so there is nothing
   to add to the HTML for it.
   ═══════════════════════════════════════════════════════════════════════ */

/* ─── EDIT HERE ────────────────────────────────────────────────────────
   Which emoji belongs to which season, and the months each season
   covers. Months are counted from 0, so 0 = January and 11 = December.
   ────────────────────────────────────────────────────────────────────── */
const SEASONS = {
  winter: {
    emoji: "❄️",
    months: [11, 0, 1],
    tip: "It's winter. Press for snow.",
  },
  spring: {
    emoji: "🌸",
    months: [2, 3, 4],
    tip: "It's spring. Press for blossom.",
  },
  summer: {
    emoji: "☀️",
    months: [5, 6, 7],
    tip: "It's summer. Press for sunshine.",
  },
  autumn: {
    emoji: "🍁",
    months: [8, 9, 10],
    tip: "It's autumn. Press for falling leaves.",
  },
};

/* How the rain behaves */
const DROP_EVERY = 200; /* milliseconds between two new emoji    */
const OPENING_BURST = 12; /* how many appear the moment you press  */
const FALL_SLOWEST = 9; /* seconds a slow emoji takes to fall    */
const FALL_FASTEST = 5; /* seconds a fast one takes              */

/* ─── The pieces on the page ────────────────────────────────────────── */
const seasonButton = document.querySelector(".season");
const seasonEmoji = document.querySelector(".season__emoji");

/* The layer the emoji fall in. Built once, added to the page, and
   never clicked through — see the .rain rule in styles.css. */
const rainLayer = document.createElement("div");
rainLayer.className = "rain";
document.body.appendChild(rainLayer);

/* Holds the repeating timer while the rain is running.
   null means the rain is off. */
let rainTimer = null;

/* ─── Which season is it today? ─────────────────────────────────────── */
function currentSeason() {
  const month = new Date().getMonth();

  for (const season of Object.values(SEASONS)) {
    if (season.months.includes(month)) return season;
  }

  return SEASONS.summer; // never reached, but a function should always answer
}

/* ─── A random number between two values ────────────────────────────── */
function randomBetween(lowest, highest) {
  return lowest + Math.random() * (highest - lowest);
}

/* ─── Drop a single emoji from a random spot along the top ──────────── */
function dropOne(emoji) {
  const drop = document.createElement("span");

  drop.textContent = emoji;
  drop.style.left = randomBetween(0, 100) + "vw";
  drop.style.fontSize = randomBetween(14, 30) + "px";
  drop.style.opacity = randomBetween(0.45, 0.95);
  drop.style.animationDuration =
    randomBetween(FALL_FASTEST, FALL_SLOWEST) + "s";
  drop.style.setProperty("--spin", randomBetween(-220, 220) + "deg");

  // Clean up after itself, so the page never fills up with old emoji.
  drop.addEventListener("animationend", () => drop.remove());

  rainLayer.appendChild(drop);
}

/* ─── Start and stop ────────────────────────────────────────────────── */
function startRain(emoji) {
  for (let i = 0; i < OPENING_BURST; i++) dropOne(emoji);

  rainTimer = setInterval(() => dropOne(emoji), DROP_EVERY);
  seasonButton.setAttribute("aria-pressed", "true");
}

function stopRain() {
  clearInterval(rainTimer);
  rainTimer = null;
  seasonButton.setAttribute("aria-pressed", "false");
  // The emoji already falling are left alone; they clear themselves.
}

/* ─── Set the button up ─────────────────────────────────────────────── */
if (seasonButton && seasonEmoji) {
  const season = currentSeason();

  seasonEmoji.textContent = season.emoji;
  seasonButton.dataset.tip = season.tip + " The icon follows the seasons.";

  seasonButton.addEventListener("click", () => {
    if (rainTimer) {
      stopRain();
    } else {
      startRain(season.emoji);
    }
  });
}
