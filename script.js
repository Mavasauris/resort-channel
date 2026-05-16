/***********************
 *  CONFIG
 ***********************/ 
const PASSWORD = "123";  
const PIN_LEN = PASSWORD.length;
const POST_TRIP_START_DAYS = 2;     // show post-trip starting 2 days after arrival day
const POST_TRIP_KEEP_DAYS = 30;     // keep arrival date for up to 30 days, then wipe


/***********************
 * ROUTING / VIEWS
 * Pages = mutually exclusive views (rendered inside #pageHost)
 * Overlays = can stack on top of any page
 ***********************/
const VIEWS = Object.freeze({
  SPLASH: "splash",
  CHOOSER: "chooser",
  PROFILE: "profile",
  COUNTDOWN_DISPLAY: "countdownDisplay",
  DISNEY_HOME: "disneyHome",
});

const OVERLAYS = Object.freeze({
  NUMPAD: "numpad",
  COUNTDOWN: "countdown",
});

/***********************
 * QUOTES
 ***********************/
const DISNEY_QUOTES = [
  "“Adventure is out there.”\n— Ellie (Up)",
  "“Ohana means family. Family means nobody gets left behind.”\n— Lilo (Lilo & Stitch)",
  "“Just keep swimming.”\n— Dory (Finding Nemo)",
  "“You’ve got a friend in me.”\n— Woody (Toy Story)",
  "“If you can dream it, you can do it.”\n— Walt Disney",
  "“All our dreams can come true, if we have the courage to pursue them.”\n— Walt Disney",
  "“It’s kind of fun to do the impossible.”\n— Walt Disney",
  "“The way to get started is to quit talking and begin doing.”\n— Walt Disney",
  "“We keep moving forward, opening new doors, and doing new things.”\n— Walt Disney",
  "“The flower that blooms in adversity is the most rare and beautiful.”\n— Mulan (Mulan)",
  "“Today is a good day to try.”\n— Quasimodo (The Hunchback of Notre Dame)",
  "“You’re braver than you believe, stronger than you seem.”\n— Christopher Robin (Winnie the Pooh)",
  "“Even miracles take a little time.”\n— Fairy Godmother (Cinderella)",
  "“A true hero isn’t measured by the size of his strength.”\n— Zeus (Hercules)",
  "“The very things that hold you down are going to lift you up.”\n— Timothy Q. Mouse (Dumbo)",
  "“Sometimes the right path is not the easiest one.”\n— Grandmother Willow (Pocahontas)",
  "“The past can hurt, but you can learn from it.”\n— Rafiki (The Lion King)",
  "“If watching is all you’re going to do, then you’re going to watch.”\n— Laverne (The Hunchback of Notre Dame)",
  "“It’s up to you how far you’ll go.”\n— Tigger (Winnie the Pooh)",
  "“Venture outside your comfort zone.”\n— Rapunzel (Tangled)",
  "“You control your destiny — you don’t need magic to do it.”\n— Merida (Brave)",
  "“When there’s nobody else, look inside yourself.”\n— Mulan (Mulan)",
  "“Life’s a journey to be experienced, not a problem to be solved.”\n— Pooh (Winnie the Pooh)",
  "“You don’t lose hope, you find it.”\n— Judy Hopps (Zootopia)",
  "“Sometimes you gotta get through your fear to see the beauty.”\n— Miguel (Coco)",
  "“The moment you doubt whether you can fly, you cease forever.”\n— Peter Pan (Peter Pan)",
  "“There’s a great big beautiful tomorrow.”\n— Carousel of Progress (Disney Parks)",
  "“You are stronger than you think.”\n— Pinocchio (Pinocchio)",
  "“Happiness is a state of mind.”\n— Joy (Inside Out)"
];

/***********************
 * ONE DAY MESSAGES
 ***********************/
const ONE_DAY_MESSAGES = [
  "Tomorrow, the magic begins",
  "Just one sleep until Disney",
  "One more day… dreams come true",
  "1 day until happily ever after",
  "Tomorrow: Disney magic",
  "Almost there… Disney awaits",
  "Tomorrow, we go to Disney",
  "One last day before the magic"
];
const ONE_DAY_ANIM_MS = 6000;

/***********************
 * PROFILES
 ***********************/
const PROFILES = {
  verhulst: { name: "Stocker/ Verhulst Family", greetingName: "Krista and Mike", greeting: "Welcome Home!", tagline: "Family, comfort, and everyday magic." },
  lori:     { name: "Biermann Family", greetingName: "Lori and Dave", greeting: "Welcome Home, Lori and Dave!", tagline: "Take a breath. You're home." },
  mckenzie: { name: "Verhulst Family", greetingName: "McKenzie", greeting: "Welcome Home, McKenzie!", tagline: "Adventure starts today." },
  kaylia:   { name: "Verhulst Family", greetingName: "Kaylia", greeting: "Welcome Home, Kaylia!", tagline: "Frogs, fun, and fairy tales." },
  mira:     { name: "Mira & Baby Hazel Family", greetingName: "Mira & Baby Hazel", greeting: "Welcome Home, Mira & Baby Hazel!", tagline: "Wonder everywhere." },
  resort:   { name: "Rios Family", greetingName: "Tisha and Christian", greeting: "Welcome Home, Tisha and Christian!", tagline: "Villainy never looked so relaxing." }
};

/***********************
 * UI (single source of truth for elements)
 ***********************/
const UI = {
  app: document.querySelector(".app"),

  // Pages
  splash: document.getElementById("splash"),
  chooser: document.getElementById("chooser"),
  profileView: document.getElementById("profileView"),
  countdownSection: document.getElementById("countdownSection"),
  resortTV: document.getElementById("resortTV"),

  // Common
  backBtn: document.getElementById("backBtn"),
  resortName: document.getElementById("resortName"),
  note: document.getElementById("note"),
  message: document.getElementById("message"),

  // Clock (cache instead of querying every tick)
  clock: document.getElementById("clock"),
  day: document.getElementById("day"),
  date: document.getElementById("date"),

  // Splash / unlock
  lockBox: document.getElementById("lockBox"),
  unlockBtn: document.getElementById("unlock"),
  splashTagline: document.getElementById("splashTagline"),
  splashError: document.getElementById("error"),
  splashMenu: document.querySelector("#splash .menuGrid--welcome"),

  // Numpad overlay
  numpadOverlay: document.getElementById("numpadOverlay"),
  npClose: document.getElementById("npClose"),
  npError: document.getElementById("npError"),
  dots: Array.from(document.querySelectorAll(".dot")),

  // Profile fields
  greeting: document.getElementById("greeting"),
  tagline: document.getElementById("tagline"),
  profileActions: document.getElementById("profileActions"),

  // Countdown overlay
  countdownOverlay: document.getElementById("countdownOverlay"),
  cdDate: document.getElementById("cdDate"),
  cdError: document.getElementById("cdError"),
  cdClose: document.querySelector("#countdownOverlay .cdClose"),
  cdClear: document.getElementById("cdClear"),
  cdSave: document.getElementById("cdSave"),

  // Countdown display
  arrivalDateText: document.getElementById("arrivalDateText"),
  cdDigit1: document.getElementById("cdDigit1"),
  cdDigit2: document.getElementById("cdDigit2"),
  cdDigit3: document.getElementById("cdDigit3"),
  changeDateBtn: document.getElementById("changeDateBtn"),
  oneDayMessage: document.getElementById("oneDayMessage"),
  oneDayText: document.getElementById("oneDayText"),
  flipcounter: document.querySelector("#countdownSection .flipcounter"),
};


/***********************
 * RESORT TV: HERO ROTATION
 ***********************/
const RESORT_HERO_SLIDES = [
{ title: "Magic Kingdom", subtitle: "Disney Enchantment", time: "Tonight • 8:15 PM", bg: "assets/MKResortbg.png" },
  { title: "EPCOT", subtitle: "Luminous: The Symphony of Us", time: "Tonight • 9:00 PM", bg: "assets/resort/epcot.webp" },
  { title: "Hollywood Studios", subtitle: "Fantasmic!", time: "Tonight • 9:30 PM", bg: "assets/resort/dhs.webp" },
  { title: "Animal Kingdom", subtitle: "Tree of Life Awakenings", time: "After Sunset", bg: "assets/resort/ak.webp" },
  { title: "Disney Springs", subtitle: "Dining • Shopping • Live Music", time: "Open Late", bg: "assets/resort/springs.webp" },
];

const resortTV = {
  timer: null,
  idx: 0,
};

function setResortHero(slide) {
  const t = document.getElementById("heroTitle");
  const s = document.getElementById("heroSubtitle");
  const tm = document.getElementById("heroTime");
  if (!t || !s || !tm) return;

  t.textContent = slide.title ?? "";
  s.textContent = slide.subtitle ?? "";
  tm.textContent = slide.time ?? "";
}

function startResortHeroRotation() {
  stopResortHeroRotation();

  // reset index each time you enter (optional)
  resortTV.idx = 0;
  setResortHero(RESORT_HERO_SLIDES[resortTV.idx]);

  resortTV.timer = window.setInterval(() => {
    // safety: only rotate if still on this view
    if (state.view !== VIEWS.DISNEY_HOME) return;

    resortTV.idx = (resortTV.idx + 1) % RESORT_HERO_SLIDES.length;
    setResortHero(RESORT_HERO_SLIDES[resortTV.idx]);
  }, 12_000); // rotate every 12s (tweak if you want)
}

function stopResortHeroRotation() {
  if (resortTV.timer) {
    clearInterval(resortTV.timer);
    resortTV.timer = null;
  }
}

function preloadImage(src) {
  if (!src) return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

function setResortBackground(src) {
  if (!UI.app) return;
  if (!src) return;
  UI.app.style.setProperty("--resort-bg", `url("${src}")`);
}


/***********************
 * STATE (single source of truth)
 ***********************/
const state = {
  view: VIEWS.SPLASH,
  overlay: {
    [OVERLAYS.NUMPAD]: false,
    [OVERLAYS.COUNTDOWN]: false,
  },

  // auth + profile
  pin: "",
  isUnlocked: false,
  activeProfileKey: null,

  // countdown flow
  pendingGoToCountdownDisplay: false,
  inCountdownDisplay: false,

  // one-day rotation
  oneDayIndex: 0,
  oneDayLoopTimer: null,

  // countdown animation
  countAnimRaf: null,
  lastDaysLeft: null,

countAnimTimer: null,

};

/***********************
 * VIEW DEFS
 ***********************/
const viewDefs = {
  [VIEWS.SPLASH]: {
    enter() {
      setProfileBackground(null);
      state.activeProfileKey = null;

      if (UI.backBtn) UI.backBtn.style.display = "none";
      if (UI.resortName) UI.resortName.textContent = "Resort Channel • Locked";
      if (UI.note) UI.note.textContent = "";
      if (UI.message) UI.message.textContent = getRandomQuote();

      stopOneDayLoop();
      Fireworks.stop({ clear: true });
    },
  },

  [VIEWS.CHOOSER]: {
    enter() {
      setProfileBackground(null);

      if (UI.resortName) UI.resortName.textContent = "Resort Channel • Choose Profile";
      if (UI.note) UI.note.textContent = "";
      if (UI.backBtn) UI.backBtn.style.display = "none";
      if (UI.message) UI.message.textContent = getRandomQuote();
    },
  },

  [VIEWS.PROFILE]: {
    enter() {
      if (!state.activeProfileKey) return;

      state.inCountdownDisplay = false;
      stopOneDayLoop();
      Fireworks.stop({ clear: true });

      updateResortNameWithSavedDate();

      const p = PROFILES[state.activeProfileKey];
      if (!p) return;

      if (UI.greeting) {
        UI.greeting.textContent =
          (state.activeProfileKey === "resort")
            ? (p.greeting || "")
            : getTimeGreeting(p.greetingName || p.name);
      }
      if (UI.tagline) UI.tagline.textContent = p.tagline || "";

      if (UI.backBtn) UI.backBtn.style.display = "flex";
      if (UI.message) UI.message.textContent = getRandomQuote();
      if (UI.note) UI.note.textContent = "";
    },
  },

  [VIEWS.COUNTDOWN_DISPLAY]: {
    enter() {
      state.inCountdownDisplay = true;
      if (UI.backBtn) UI.backBtn.style.display = "flex";
      if (UI.message) UI.message.textContent = getRandomQuote();
      renderCountdownDisplay();
    },
exit() {
  state.inCountdownDisplay = false;

  // STOP any running countdown animations (THIS IS THE FIX)
  if (state.countAnimRaf) {
    cancelAnimationFrame(state.countAnimRaf);
    state.countAnimRaf = null;
  }

  stopOneDayLoop();
  hideOneDayMessage();
  Fireworks.stop({ clear: true });
  UI.app?.classList.remove("countdown-mode", "one-day-mode", "arrival-day-mode");
},

  },

[VIEWS.DISNEY_HOME]: {
  enter() {
    if (!state.activeProfileKey) return;
    const p = PROFILES[state.activeProfileKey];

    UI.app?.classList.add("view-disneyHome");

    if (UI.resortName && p) UI.resortName.textContent = `${p.name} • Disney Resort`;
    if (UI.note) UI.note.textContent = "";
    if (UI.backBtn) UI.backBtn.style.display = "flex";
    if (UI.message) UI.message.textContent = getRandomQuote();

    startResortHeroRotation();
  },
  exit() {
    UI.app?.classList.remove("view-disneyHome");
    stopResortHeroRotation();
  }
},

};

/***********************
 * setView / render
 ***********************/
function setView(nextView) {
  if (!nextView || nextView === state.view) return;

  viewDefs[state.view]?.exit?.();
  state.view = nextView;
  viewDefs[state.view]?.enter?.();
  render();
}

function setOverlay(name, open) {
  if (!(name in state.overlay)) return;
  state.overlay[name] = Boolean(open);
  render();
}

function render() {
  renderPages();
  renderOverlays();
  renderUnlockUI();
  renderCountdownDisplay(); // no-op unless in countdown view
}

/***********************
 * RENDER HELPERS
 ***********************/
function renderPages() {
  const show = (el, on) => { if (el) el.hidden = !on; };

  show(UI.splash, state.view === VIEWS.SPLASH);
  show(UI.chooser, state.view === VIEWS.CHOOSER);
  show(UI.profileView, state.view === VIEWS.PROFILE);
  show(UI.countdownSection, state.view === VIEWS.COUNTDOWN_DISPLAY);
  show(UI.resortTV, state.view === VIEWS.DISNEY_HOME);

}

function renderOverlays() {
  // NUMPAD
  if (UI.numpadOverlay) {
    const open = state.overlay[OVERLAYS.NUMPAD];
    UI.numpadOverlay.removeAttribute("hidden");
    UI.numpadOverlay.classList.toggle("show", open);
  }

  // COUNTDOWN CONFIG
  if (UI.countdownOverlay) {
    const open = state.overlay[OVERLAYS.COUNTDOWN];
    UI.countdownOverlay.removeAttribute("hidden");
    UI.countdownOverlay.classList.toggle("show", open);
   UI.countdownOverlay.setAttribute("aria-hidden", open ? "false" : "true");

if (open) {
  UI.countdownOverlay.removeAttribute("inert");
} else {
  UI.countdownOverlay.setAttribute("inert", "");
}

  }
}

function renderUnlockUI() {
  const unlocked = state.isUnlocked;

  if (UI.lockBox) UI.lockBox.style.display = unlocked ? "none" : "block";
  if (UI.splashMenu) UI.splashMenu.style.display = unlocked ? "grid" : "none";
  if (UI.splashTagline) UI.splashTagline.style.display = unlocked ? "none" : "block";

  UI.splash?.classList.toggle("unlocked", unlocked);
}

function renderCountdownDisplay() {
  if (state.view !== VIEWS.COUNTDOWN_DISPLAY) return;
  if (!state.activeProfileKey) return;

  const p = PROFILES[state.activeProfileKey];
  if (UI.resortName && p) UI.resortName.textContent = `${p.name} • Countdown`;

  const savedIso = localStorage.getItem(countdownKey());
  if (!savedIso) {
    if (UI.note) UI.note.textContent = "Please set your Disney arrival date first.";
    state.pendingGoToCountdownDisplay = true;
    openCountdownConfig("config");
    return;
  }

  if (UI.arrivalDateText) {
    const d = new Date(savedIso);
    UI.arrivalDateText.textContent = Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  }

const daysLeft = daysUntilArrival() ?? 0;

// Always apply mode FIRST so arrival-day / one-day can hide flipcounter
// (but we need digits value for mode logic, so keep daysLeft computed)
setDigits(daysLeft, { flip: false });
applyOneDayMode();

// If we're in normal countdown (not arrival day, not one-day), animate
const dFrom = daysFromArrival();
const isNormalCountdown = (state.inCountdownDisplay && dFrom !== 0 && dFrom !== 1);

if (isNormalCountdown) {
  // Only animate when value changes or first enter
  if (state.lastDaysLeft === null || state.lastDaysLeft !== daysLeft) {
    animateCountdownTo(daysLeft, { durationMs: 2200 });
  }
} else {
  state.lastDaysLeft = daysLeft;
}

}

/***********************
 * INIT
 ***********************/
(function init() {
  if (UI.splashError) UI.splashError.hidden = true;
  if (UI.npError) UI.npError.hidden = true;
  if (UI.cdError) UI.cdError.hidden = true;

  const fw = document.getElementById("fireworksCanvas");
  if (fw) fw.style.display = "none";

  rotateTickerMessage();
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(rotateTickerMessage, 30 * 1000);

  setView(VIEWS.SPLASH);
})();

/***********************
 * CLOCK
 ***********************/
function updateClock() {
  const now = new Date();
  const dayNum = now.getDate();
  const suffix = getDaySuffix(dayNum);

  if (UI.clock) {
    UI.clock.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (UI.date) {
    UI.date.innerHTML = `
      ${now.toLocaleDateString([], { month: "long" })}
      ${dayNum}<span class="daySuffix">${suffix}</span>
    `;
  }
  if (UI.day) {
    UI.day.textContent = now.toLocaleDateString([], { weekday: "long" });
  }
}

/***********************
 * TICKER ROTATION
 ***********************/
function rotateTickerMessage() {
  if (!UI.message) return;
  UI.message.textContent = getRandomQuote();
}

/***********************
 * System message float
 ***********************/
let messageTimer;

function setSystemMessage(text) {
  const noteEl = UI.note;
  const wrap = noteEl?.parentElement; // .systemMessage
  if (!noteEl || !wrap) return;

  clearTimeout(messageTimer);

  wrap.classList.remove("fade-in", "fade-out");
  noteEl.textContent = text;

  void wrap.offsetWidth;

  wrap.classList.add("fade-in");
  messageTimer = setTimeout(() => {
    wrap.classList.remove("fade-in");
    wrap.classList.add("fade-out");
  }, 1000);
}

/***********************
 * HELPERS
 ***********************/
function getRandomQuote() {
  return DISNEY_QUOTES[Math.floor(Math.random() * DISNEY_QUOTES.length)];
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => {
    page.hidden = page.dataset.page !== pageName;
  });
}


function isPostTrip() {
  const d = daysFromArrival();
  return d !== null && d <= -POST_TRIP_START_DAYS;
}


function openNextTripPlanner() {
  if (state.view !== VIEWS.COUNTDOWN_DISPLAY) return;

  // If overlay already open, don't re-open
  if (state.overlay[OVERLAYS.COUNTDOWN]) return;

  // On arrival day you said block changes
  if (daysFromArrival() === 0) return;

  state.pendingGoToCountdownDisplay = true;
  openCountdownConfig("change");
}



function haptic(type = "light") {
  if (!("vibrate" in navigator)) return;
  const patterns = { light: 10, medium: 20, error: [30, 40, 30] };
  navigator.vibrate(patterns[type] ?? 10);
}

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function getTimeGreeting(name) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name}!`;
  if (hour < 18) return `Good Afternoon, ${name}!`;
  return `Good Evening, ${name}!`;
}

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


function tomorrowYYYYMMDD() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Returns true if chosen date is today or in the past (blocked) */
function isBlockedDate(yyyyMMdd) {
  const chosen = new Date(`${yyyyMMdd}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return chosen < today;
}

/***********************
 * COUNTDOWN STORAGE + CALCS
 ***********************/
function countdownKey() {
  return `arrivalDate_${state.activeProfileKey || "unknown"}`;
}

function daysUntilArrival() {
  const saved = localStorage.getItem(countdownKey());
  if (!saved) return null;

  const arrival = new Date(saved);
  if (Number.isNaN(arrival.getTime())) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  arrival.setHours(0, 0, 0, 0);

  const diffMs = arrival - now;
  return Math.max(0, Math.ceil(diffMs / 86400000));
}

function daysFromArrival() {
  const saved = localStorage.getItem(countdownKey());
  if (!saved) return null;

  const arrival = new Date(saved);
  if (Number.isNaN(arrival.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  arrival.setHours(0, 0, 0, 0);

  return Math.round((arrival - today) / 86400000);
}

/** If saved arrival is in the past, wipe it (daysAfter defines how long we keep it) */
function clearIfArrivalOlderThan(daysAfter = POST_TRIP_KEEP_DAYS) {
  if (!state.activeProfileKey) return;
  const d = daysFromArrival();
  if (d === null) return;
  if (d < -daysAfter) localStorage.removeItem(countdownKey());
}


function updateResortNameWithSavedDate() {
  if (!state.activeProfileKey) return;

  const p = PROFILES[state.activeProfileKey];
  if (!p || !UI.resortName) return;

  const savedIso = localStorage.getItem(countdownKey());
  if (!savedIso) {
    UI.resortName.textContent = p.name;
    return;
  }

  const d = new Date(savedIso);
  if (Number.isNaN(d.getTime())) {
    localStorage.removeItem(countdownKey());
    UI.resortName.textContent = p.name;
    return;
  }

  const pretty = d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  UI.resortName.textContent = `${p.name} • ${pretty}`;
}

/***********************
 * Profile background
 ***********************/
function setProfileBackground(profileKey) {
  const app = UI.app;
  if (!app) return;

  app.className = app.className
    .split(" ")
    .filter(c => !c.startsWith("profile-"))
    .join(" ");

  if (profileKey) app.classList.add(`profile-${profileKey}`);
}

/***********************
 * COUNTDOWN DISPLAY (digits + one-day/arrival-day)
 ***********************/

function setDigits(daysLeft, { flip = true } = {}) {
  const s = String(Math.max(0, daysLeft ?? 0)).padStart(3, "0").slice(-3);

  const setOne = (el, ch) => {
    if (!el) return;

    const prev = el.textContent;
    if (prev === ch) return;

    el.textContent = ch;

    if (!flip) return;
    const tile = el.closest(".flipcounter-tile");
    if (!tile) return;

    tile.classList.remove("is-flipping");
    void tile.offsetWidth; // reflow to restart animation
    tile.classList.add("is-flipping");
  };

  setOne(UI.cdDigit1, s[0]);
  setOne(UI.cdDigit2, s[1]);
  setOne(UI.cdDigit3, s[2]);
}


function animateCountdownTo(target) {
  // Cancel any in-flight RAF animation
  if (state.countAnimRaf) {
    cancelAnimationFrame(state.countAnimRaf);
    state.countAnimRaf = null;
  }

  const end = Math.max(0, target ?? 0);

  // Nothing to do
  if (end === 0) {
    setDigits(0, { flip: false });
    state.lastDaysLeft = 0;
    return;
  }

  // ✅ If less than 8 days: ONE flip every 500ms (super readable)
  if (end < 8) {
    setDigits(0, { flip: false });

    let value = 0;
    const timer = setInterval(() => {
      // If user navigated away mid-animation, stop cleanly
      if (state.view !== VIEWS.COUNTDOWN_DISPLAY) {
        clearInterval(timer);
        return;
      }

      value++;
      setDigits(value, { flip: true });

      if (value >= end) {
        clearInterval(timer);
        state.lastDaysLeft = end;
      }
    }, 500);

    return;
  }

  // ✅ Otherwise: your existing 7s ease-out “count up” animation
  const TOTAL_MS = 7000;

  setDigits(0, { flip: false });

  // TRUE ease-out: fast → slow
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const t0 = performance.now();
  let value = 0;

  const frame = (now) => {
    if (state.view !== VIEWS.COUNTDOWN_DISPLAY) {
      state.countAnimRaf = null;
      return;
    }

    const elapsed = Math.min(TOTAL_MS, now - t0);
    const t = elapsed / TOTAL_MS;      // 0 → 1
    const eased = easeOutCubic(t);     // fast early, slow late
    const targetValue = Math.floor(eased * end);

    // Catch up step-by-step so EVERY number flips
    while (value < targetValue) {
      value++;
      setDigits(value, { flip: true });
    }

    if (elapsed < TOTAL_MS) {
      state.countAnimRaf = requestAnimationFrame(frame);
    } else {
      setDigits(end, { flip: true });
      state.lastDaysLeft = end;
      state.countAnimRaf = null;
    }
  };

  state.countAnimRaf = requestAnimationFrame(frame);
}


function applyOneDayMode() {
  const app = UI.app;
  if (!app) return;

  const d = daysFromArrival();
  if (d === null || !state.inCountdownDisplay) return;

  // Clean slate
  app.classList.remove("arrival-day-mode", "one-day-mode", "post-trip-mode");
  app.classList.add("countdown-mode");

  const showBanner = (html) => {
    if (!UI.oneDayMessage || !UI.oneDayText) return;
    UI.oneDayMessage.hidden = false;
    UI.oneDayText.innerHTML = html;
  };

  const hideBanner = () => {
    stopOneDayLoop();
    hideOneDayMessage();
  };

  /**
   * MODE: ANYTIME AFTER ARRIVAL (d < 0)
   * Immediately switch to return / plan-next-trip
   */
  if (d < 0) {
    app.classList.add("post-trip-mode");

    if (UI.flipcounter) UI.flipcounter.style.display = "none";

    showBanner(`
      <div>Welcome home</div>
      <div style="margin-top:.25em; font-size:.85em; opacity:.95;">
        Tap to plan your next Disney trip
      </div>
    `);

    stopOneDayLoop();
    Fireworks.stop({ clear: true });
    return;
  }

  /**
   * ARRIVAL DAY
   */
  if (d === 0) {
    app.classList.remove("countdown-mode");
    app.classList.add("arrival-day-mode");

    if (UI.flipcounter) UI.flipcounter.style.display = "none";

    showBanner(`
      <div>Today’s the day</div>
      <div style="margin-top:.25em;">Let the magic begin</div>
    `);

    stopOneDayLoop();
    Fireworks.start();
    return;
  }

  /**
   * ONE DAY BEFORE
   */
  if (d === 1) {
    app.classList.add("one-day-mode");

    if (UI.flipcounter) UI.flipcounter.style.display = "";

    startOneDayLoop();
    Fireworks.start();
    return;
  }

  /**
   * NORMAL COUNTDOWN
   */
  if (UI.flipcounter) UI.flipcounter.style.display = "";
  hideBanner();
  Fireworks.stop({ clear: true });
}




/***********************
 * One-Day message loop
 ***********************/
function splitTwoLinesBalanced(message) {
  const clean = String(message ?? "").trim();
  if (!clean) return { line1: "", line2: "" };

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return { line1: clean, line2: "" };

  let bestIdx = 1;
  let bestScore = Infinity;

  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const score = Math.abs(a.length - b.length);
    if (score < bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return {
    line1: words.slice(0, bestIdx).join(" "),
    line2: words.slice(bestIdx).join(" ")
  };
}

function setOneDayMessageText() {
  const wrap = UI.oneDayMessage;
  const textEl = UI.oneDayText;
  if (!wrap || !textEl) return;

  let idx = Math.floor(Math.random() * ONE_DAY_MESSAGES.length);
  if (ONE_DAY_MESSAGES.length > 1) {
    while (idx === state.oneDayIndex) idx = Math.floor(Math.random() * ONE_DAY_MESSAGES.length);
  }
  state.oneDayIndex = idx;

  const msg = ONE_DAY_MESSAGES[idx];
  const { line1, line2 } = splitTwoLinesBalanced(msg);

  textEl.innerHTML = `
    <div>${line1}</div>
    ${line2 ? `<div style="margin-top: 0.25em;">${line2}</div>` : ``}
  `.trim();
}

function startOneDayLoop() {
  stopOneDayLoop();
  const el = UI.oneDayMessage;
  if (!el) return;

  el.hidden = false;

  const tick = () => {
    setOneDayMessageText();
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = `oneDayInOut ${ONE_DAY_ANIM_MS}ms ease-in-out infinite`;
  };

  tick();
  state.oneDayLoopTimer = window.setInterval(tick, ONE_DAY_ANIM_MS);
}

function stopOneDayLoop() {
  if (state.oneDayLoopTimer) {
    clearInterval(state.oneDayLoopTimer);
    state.oneDayLoopTimer = null;
  }
}

function hideOneDayMessage() {
  if (UI.oneDayMessage) UI.oneDayMessage.hidden = true;
}

/***********************
 * EVENTS
 ***********************/
UI.unlockBtn?.addEventListener("click", (e) => {
  e.stopPropagation(); // prevents your document click from also trying to route
  state.pin = "";
  UI.dots.forEach(d => d.classList.remove("filled"));
  if (UI.npError) UI.npError.hidden = true;
  setOverlay(OVERLAYS.NUMPAD, true);
});


document.addEventListener("click", (e) => {

  /* -------------------------
     POST-TRIP: TAP ANYWHERE
     ------------------------- */
  if (
    state.view === VIEWS.COUNTDOWN_DISPLAY &&
    (() => {
      const d = daysFromArrival();
      return d !== null && d < 0; // anytime past arrival
    })() &&
    !e.target.closest(
      "#countdownOverlay, #numpadOverlay, button, a, input, [data-page], [data-profile]"
    )
  ) {
    openNextTripPlanner();
    return;
  }

  /* -------------------------
     NORMAL ROUTING
     ------------------------- */
  const profileBtn = e.target.closest("[data-profile]");
  if (profileBtn) {
    if (!state.isUnlocked) return;
    loadProfile(profileBtn.dataset.profile);
    return;
  }

  const pageBtn = e.target.closest("[data-page]");
  if (pageBtn) {
    loadPage(pageBtn.dataset.page);
    return;
  }

});


UI.npClose?.addEventListener("click", () => setOverlay(OVERLAYS.NUMPAD, false));

document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("click", () => {
    const k = btn.dataset.k;
    haptic("light");

    if (k === "back") {
      state.pin = "";
      UI.dots.forEach(d => d.classList.remove("filled"));
      setOverlay(OVERLAYS.NUMPAD, false);
      if (UI.npError) UI.npError.hidden = true;
      return;
    }

    if (k === "clear") {
      state.pin = "";
      UI.dots.forEach(d => d.classList.remove("filled"));
      if (UI.npError) UI.npError.hidden = true;
      return;
    }

    if (state.pin.length < PIN_LEN) {
      state.pin += k;
      UI.dots.forEach((d, i) => d.classList.toggle("filled", i < state.pin.length));
    }

    if (state.pin.length === PIN_LEN) {
      if (state.pin === PASSWORD) {
        haptic("medium");

        setOverlay(OVERLAYS.NUMPAD, false);

        state.isUnlocked = true;
        state.pin = "";
        UI.dots.forEach(d => d.classList.remove("filled"));
        if (UI.npError) UI.npError.hidden = true;

        setView(VIEWS.CHOOSER);
        return;
      } else {
        haptic("error");
        state.pin = "";
        if (UI.npError) UI.npError.hidden = false;
        UI.dots.forEach(d => d.classList.remove("filled"));
      }
    }
  });
});



function loadProfile(key) {
  const p = PROFILES[key];
  if (!p) return;

  state.activeProfileKey = key;
  setProfileBackground(key);
clearIfArrivalOlderThan(POST_TRIP_KEEP_DAYS);


  setView(VIEWS.PROFILE);
  closeCountdownModal();
}

function loadPage(pageKey) {
  if (!state.activeProfileKey) return;

  const p = PROFILES[state.activeProfileKey];

if (pageKey === "disneyHome") {
  if (UI.resortName) UI.resortName.textContent = `${p.name} • Disney Resort.`;
  setSystemMessage("");          // clear the “coming soon” message
  setView(VIEWS.DISNEY_HOME);    // <-- show the Resort TV page
  closeCountdownModal();
  return;
}


  if (pageKey === "disneyPictures") {
    if (UI.resortName) UI.resortName.textContent = `${p.name} • Disney Pictures`;
    setSystemMessage("Disney Pictures coming soon.");
    setView(VIEWS.PROFILE);
    closeCountdownModal();
    return;
  }

  if (pageKey === "countdownConfig") {
    if (state.inCountdownDisplay && daysFromArrival() === 0) return;

    setView(VIEWS.PROFILE);
    updateResortNameWithSavedDate();
    if (UI.note) UI.note.textContent = "Pick your Disney arrival date.";
    state.pendingGoToCountdownDisplay = false;
    openCountdownConfig("config");
    return;
  }

  if (pageKey === "countdownDisplay") {
    clearIfArrivalOlderThan(2);

    const saved = localStorage.getItem(countdownKey());
    if (!saved) {
      if (UI.note) UI.note.textContent = "Please set your Disney arrival date first.";
      state.pendingGoToCountdownDisplay = true;
      openCountdownConfig("config");
      return;
    }

    if (UI.note) UI.note.textContent = "";
    setView(VIEWS.COUNTDOWN_DISPLAY);
  }
}






/***********************
 * COUNTDOWN CONFIG OVERLAY
 ***********************/
function openCountdownConfig(mode = "config") {
  if (!UI.countdownOverlay || !UI.cdDate) return;

  UI.countdownOverlay.dataset.mode = mode;
  UI.cdDate.min = todayYYYYMMDD();

  const saved = localStorage.getItem(countdownKey());
  if (saved) {
    const dt = new Date(saved);
    if (!Number.isNaN(dt.getTime())) {
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const dd = String(dt.getDate()).padStart(2, "0");
      UI.cdDate.value = `${yyyy}-${mm}-${dd}`;
    }
  } else {
    UI.cdDate.value = todayYYYYMMDD();
  }

  if (UI.cdError) UI.cdError.hidden = true;

  setOverlay(OVERLAYS.COUNTDOWN, true);
  try { UI.cdDate.showPicker?.(); } catch {}
}

function closeCountdownModal() {
  if (!UI.countdownOverlay) return;

  // ✅ move focus OUT of the overlay before hiding it
  if (UI.countdownOverlay.contains(document.activeElement)) {
    UI.changeDateBtn?.focus?.(); // or UI.backBtn?.focus?.() if you prefer
  }

  setOverlay(OVERLAYS.COUNTDOWN, false);
  if (UI.cdError) UI.cdError.hidden = true;
  UI.countdownOverlay.removeAttribute("data-mode");
}


UI.cdClose?.addEventListener("click", closeCountdownModal);

UI.cdDate?.addEventListener("change", () => {
  if (!UI.cdDate?.value) return;
  const bad = isBlockedDate(UI.cdDate.value);
  if (UI.cdError) UI.cdError.hidden = !bad;
});

UI.cdClear?.addEventListener("click", () => {
  localStorage.removeItem(countdownKey());

  if (UI.cdError) UI.cdError.hidden = true;
  if (UI.cdDate) UI.cdDate.value = todayYYYYMMDD();

  const p = PROFILES[state.activeProfileKey];
  if (p && UI.resortName) UI.resortName.textContent = p.name;

  if (UI.note) UI.note.textContent = "Disney arrival date cleared.";
  state.pendingGoToCountdownDisplay = false;

  closeCountdownModal();

  if (state.view === VIEWS.COUNTDOWN_DISPLAY) setView(VIEWS.PROFILE);
});

UI.cdSave?.addEventListener("click", () => {
  if (!UI.cdDate || !UI.cdDate.value) return;

  if (isBlockedDate(UI.cdDate.value)) {
    if (UI.cdError) UI.cdError.hidden = false;
    return;
  }

  const dt = new Date(`${UI.cdDate.value}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return;

  localStorage.setItem(countdownKey(), dt.toISOString());
  if (UI.note) UI.note.textContent = "Disney arrival date saved.";

  updateResortNameWithSavedDate();
  closeCountdownModal();

  if (state.pendingGoToCountdownDisplay) {
    state.pendingGoToCountdownDisplay = false;
    setView(VIEWS.COUNTDOWN_DISPLAY);
    return;
  }

  if (state.view === VIEWS.COUNTDOWN_DISPLAY) renderCountdownDisplay();
});

UI.changeDateBtn?.addEventListener("click", () => {
  state.pendingGoToCountdownDisplay = true;
  openCountdownConfig("change");
});

/***********************
 * BACK BUTTON (hierarchy)
 ***********************/
UI.backBtn?.addEventListener("click", () => {
  if (state.overlay[OVERLAYS.COUNTDOWN]) {
    closeCountdownModal();
    return;
  }
  if (state.overlay[OVERLAYS.NUMPAD]) {
    setOverlay(OVERLAYS.NUMPAD, false);
    return;
  }

if (state.view === VIEWS.COUNTDOWN_DISPLAY) {
  if (state.countAnimRaf) {
    cancelAnimationFrame(state.countAnimRaf);
    state.countAnimRaf = null;
  }
  state.lastDaysLeft = null;

  setView(VIEWS.PROFILE);
  return;
}

  if (state.view === VIEWS.PROFILE) {
    setView(VIEWS.CHOOSER);
    return;
  }

  if (state.view === VIEWS.CHOOSER) {
    state.isUnlocked = false;
    state.activeProfileKey = null;
    setProfileBackground(null);
    setView(VIEWS.SPLASH);
    return;
  }
// ✅ Back from Resort TV → Profile
if (state.view === VIEWS.DISNEY_HOME) {
  setView(VIEWS.PROFILE);
  return;
}

  
});

/***********************
 * MIDNIGHT WATCHER
 ***********************/
(function startMidnightWatcher() {
  function msUntilNextMidnight() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return next - now;
  }

  function tickAtMidnight() {
    if (state.view === VIEWS.COUNTDOWN_DISPLAY) {
      renderCountdownDisplay();
    }
    setTimeout(tickAtMidnight, msUntilNextMidnight() + 250);
  }

  setTimeout(tickAtMidnight, msUntilNextMidnight() + 250);
})();

/*******************************
 * Fireworks Overlay (Canvas)
 *******************************/
const Fireworks = (() => {
  const DEFAULTS = {
    density: 0.8,
    mickeyRate: 0.35,
    sparkleTrail: true,
    zones: ["top"],
    maxRockets: 6,
    rocketIntervalMs: 500,
    gravity: 0.08,
    wind: 0.02,
    fadeSpeed: 0.20,
    DPRCap: 2.0,
    rocketMinFrames: 220,
    rocketMaxFrames: 340,
    centerSpread: 0.08,
    trailMax: 30,
    rocketSpeed: 1.25,
    trailFadeStart: 0.58,
    trailFadeRange: 0.10,
  };

  let canvas = null, ctx = null;
  let w = 0, h = 0, dpr = 1;
  let running = false;
  let cfg = { ...DEFAULTS };
  let rafId = null, lastTime = 0, rocketTimer = 0;

  const rockets = [];
  const particles = [];
  const sparkles = [];

  const rand = (a, b) => a + Math.random() * (b - a);
  const randi = (a, b) => Math.floor(rand(a, b + 1));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function initCanvasFromHTML() {
    canvas = document.getElementById("fireworksCanvas");
    if (!canvas) return false;

    ctx = canvas.getContext("2d", { alpha: true });
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return true;
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    dpr = clamp(window.devicePixelRatio || 1, 1, cfg.DPRCap);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function pickLaunchPoint() {
    const zones = Array.isArray(cfg.zones) && cfg.zones.length ? cfg.zones : ["top"];
    const z = zones[randi(0, zones.length - 1)];

    if (typeof z === "string") {
      if (z === "top")
        return { x: rand(w * 0.15, w * 0.85), y: rand(h * 0.22, h * 0.60) };

      if (z === "corners") {
        const left = Math.random() < 0.5;
        return {
          x: left ? rand(w * 0.05, w * 0.20) : rand(w * 0.80, w * 0.95),
          y: rand(h * 0.10, h * 0.28)
        };
      }

      if (z === "random") return { x: rand(w * 0.1, w * 0.9), y: rand(h * 0.12, h * 0.6) };

      return { x: rand(w * 0.15, w * 0.85), y: rand(h * 0.08, h * 0.22) };
    }

    if (z && typeof z === "object") {
      const x0 = clamp(z.x0 ?? 0.1, 0, 1);
      const y0 = clamp(z.y0 ?? 0.1, 0, 1);
      const x1 = clamp(z.x1 ?? 0.9, 0, 1);
      const y1 = clamp(z.y1 ?? 0.4, 0, 1);
      return { x: rand(w * x0, w * x1), y: rand(h * y0, h * y1) };
    }

    return { x: rand(w * 0.15, w * 0.85), y: rand(h * 0.08, h * 0.22) };
  }

  function makeParticle(x, y, vx, vy, hue) {
    return { x, y, vx, vy, hue, alpha: 1, size: rand(1.5, 3.2), drag: rand(0.985, 0.996), twinkle: Math.random() < 0.35 };
  }

  function makeSparkle(x, y) {
    return { x, y, vx: rand(-0.7, 0.7), vy: rand(-1.2, -0.2), alpha: rand(0.5, 1), size: rand(0.8, 1.6), life: rand(30, 60) };
  }

  function spawnRocket() {
    if (!ctx) return;
    if (rockets.length >= cfg.maxRockets) return;

    const target = pickLaunchPoint();
    const spread = (cfg.centerSpread ?? 0.08) * w;
    const startX = (w * 0.5) + rand(-spread, spread);
    const startY = h + rand(h * 0.02, h * 0.10);

    const dx = target.x - startX;
    const dy = target.y - startY;
    const t = rand(cfg.rocketMinFrames ?? 160, cfg.rocketMaxFrames ?? 220);

    rockets.push({
      x: startX, y: startY,
      vx: dx / t, vy: dy / t,
      life: t,
      trail: [],
      hue: rand(0, 360),
      sparkle: cfg.sparkleTrail
    });
  }

  function spawnRadialBurst(x, y, hue) {
    const count = Math.floor(rand(55, 95) * clamp(cfg.density, 0.2, 1.5));
    const speed = rand(2.2, 4.3);
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const s = speed * rand(0.6, 1.2);
      particles.push(makeParticle(x, y, Math.cos(a) * s, Math.sin(a) * s, hue + rand(-25, 25)));
    }
    for (let i = 0; i < Math.floor(count * 0.15); i++) sparkles.push(makeSparkle(x, y));
  }

  function spawnMickeyBurst(x, y, hue) {
    const headR = rand(20, 34);
    const earR = headR * rand(0.55, 0.70);
    const earOffsetX = headR * rand(0.85, 1.05);
    const earOffsetY = headR * rand(0.65, 0.95);

    const centers = [
      { cx: x, cy: y, r: headR },
      { cx: x - earOffsetX, cy: y - earOffsetY, r: earR },
      { cx: x + earOffsetX, cy: y - earOffsetY, r: earR },
    ];

    const baseCount = Math.floor(rand(40, 70) * clamp(cfg.density, 0.2, 1.5));
    centers.forEach((c, idx) => {
      const count = Math.floor(baseCount * (idx === 0 ? 1.0 : 0.7));
      for (let i = 0; i < count; i++) {
        const a = rand(0, Math.PI * 2);
        const px = c.cx + Math.cos(a) * c.r + rand(-2, 2);
        const py = c.cy + Math.sin(a) * c.r + rand(-2, 2);
        const vx = Math.cos(a) * rand(1.8, 3.2);
        const vy = Math.sin(a) * rand(1.8, 3.2);
        particles.push(makeParticle(px, py, vx, vy, hue + rand(-18, 18)));
      }
    });

    for (let i = 0; i < 36; i++) sparkles.push(makeSparkle(x + rand(-18, 18), y + rand(-18, 18)));
  }

  function explode(x, y, hue) {
    if (Math.random() < cfg.mickeyRate) spawnMickeyBurst(x, y, hue);
    else spawnRadialBurst(x, y, hue);
  }

  function clearFrame() {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${cfg.fadeSpeed})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawRocket(r) {
    const startY = h * (cfg.trailFadeStart ?? 0.62);
    const rangeY = h * (cfg.trailFadeRange ?? 0.12);
    const aboveCastle = (r.y < startY);

    if (!aboveCastle) {
      r.trail.length = 0;
      return;
    }

    r.trail.push({ x: r.x, y: r.y });
    const maxTrail = cfg.trailMax ?? 15;
    if (r.trail.length > maxTrail) r.trail.shift();

    ctx.globalCompositeOperation = "source-over";

    for (let i = 0; i < r.trail.length; i++) {
      const t = r.trail[i];
      const k = i / r.trail.length;
      const fadeIn = clamp((startY - t.y) / rangeY, 0, 1);

      ctx.globalAlpha = (1 - k) * 0.7 * fadeIn;
      ctx.fillStyle = `hsla(${r.hue},100%,70%,1)`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2.2 - k * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = `hsla(${r.hue},100%,80%,1)`;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawParticle(p) {
    ctx.globalCompositeOperation = "lighter";
    const a = p.twinkle ? p.alpha * rand(0.6, 1.0) : p.alpha;
    ctx.globalAlpha = a;
    ctx.fillStyle = `hsla(${p.hue},100%,70%,1)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSparkle(s) {
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = `rgba(255,255,255,1)`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function step(ts) {
    if (!running || !ctx) return;
    rafId = requestAnimationFrame(step);

    const dt = Math.min(0.05, (ts - lastTime) / 1000 || 0.016);
    lastTime = ts;

    clearFrame();

    rocketTimer += dt * 1000;
    const interval = clamp(cfg.rocketIntervalMs / clamp(cfg.density, 0.2, 1.5), 120, 1200);
    if (rocketTimer >= interval) {
      rocketTimer = 0;
      spawnRocket();
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];

      const FRAME_SCALE = 60;
      r.life -= dt * FRAME_SCALE;

      r.vx += cfg.wind * dt;
      r.vy += cfg.gravity * dt;

      const SPEED = cfg.rocketSpeed ?? 1.0;
      r.x += r.vx * (dt * FRAME_SCALE) * SPEED;
      r.y += r.vy * (dt * FRAME_SCALE) * SPEED;

      drawRocket(r);

      const sparkleStartY = h * (cfg.trailFadeStart ?? 0.62);
      if (r.sparkle && r.y < sparkleStartY && Math.random() < 0.35) {
        sparkles.push(makeSparkle(r.x + rand(-4, 4), r.y + rand(-4, 4)));
      }

      if (r.life <= 0) {
        rockets.splice(i, 1);
        explode(r.x, r.y, r.hue);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx += cfg.wind * dt;
      p.vy += cfg.gravity * dt;

      p.vx *= p.drag; p.vy *= p.drag;

      p.x += p.vx * (dt * 60);
      p.y += p.vy * (dt * 60);

      p.alpha -= dt * rand(0.55, 0.9);
      if (p.alpha <= 0 || p.y > h + 40 || p.x < -40 || p.x > w + 40) {
        particles.splice(i, 1);
        continue;
      }
      drawParticle(p);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.life -= 1;
      s.x += s.vx * (dt * 60);
      s.y += s.vy * (dt * 60);
      s.alpha -= dt * 1.2;
      if (s.life <= 0 || s.alpha <= 0) {
        sparkles.splice(i, 1);
        continue;
      }
      drawSparkle(s);
    }

    ctx.globalAlpha = 1;
  }

  function start(options = {}) {
    if (!canvas && !initCanvasFromHTML()) return;

    cfg = { ...DEFAULTS, ...options };

    canvas.style.display = "block";
    resize();

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);

    rockets.length = 0;
    particles.length = 0;
    sparkles.length = 0;

    running = true;
    lastTime = performance.now();
    rocketTimer = 0;

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(step);
  }

  function stop({ clear = true } = {}) {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = null;

    rockets.length = 0;
    particles.length = 0;
    sparkles.length = 0;

    if (canvas) {
      if (clear && ctx) ctx.clearRect(0, 0, w, h);
      canvas.style.display = "none";
    }
  }

  return { start, stop };
})();


