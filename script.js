// script.js

/***********************
 *  CONFIG
 ***********************/
const PASSWORD = "123";
const PIN_LEN = PASSWORD.length;
const POST_TRIP_START_DAYS = 2;     // show post-trip starting 2 days after arrival day
const POST_TRIP_KEEP_DAYS = 30;     // keep arrival date for up to 30 days, then wipe
const WEATHER_ICON_BASE = "assets/weather/icons/";
const APP_VERSION = "v2.1.0";
const KEY_SHOW_CD_ON_TV = "showCountdownOnResortTV";
const KEY_HOME_LOCATION = "homeLocation"; // per-profile storage key prefix




/***********************
 * ROUTING / VIEWS
 ***********************/
const VIEWS = Object.freeze({
  SPLASH: "splash",
  CHOOSER: "chooser",
  PROFILE: "profile",
  COUNTDOWN_DISPLAY: "countdownDisplay",
  DISNEY_HOME: "disneyHome",
  PROFILE_SETTINGS: "profileSettings",

});

const OVERLAYS = Object.freeze({
  NUMPAD: "numpad",
  COUNTDOWN: "countdown",
  HOME_LOCATION: "homeLocation",
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
  resort:   { name: "Resort Test", greetingName: "Resort", greeting: "Resort Test", tagline: "Testing environment." }
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
  profileSettingsView: document.getElementById("profileSettingsView"),

  // Common
  backBtn: document.getElementById("backBtn"),
  resortName: document.getElementById("resortName"),
  versionTag: document.getElementById("versionTag"),
  note: document.getElementById("note"),
  message: document.getElementById("message"),

  // Clock
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

  // Home Location overlay
  homeLocationOverlay: document.getElementById("homeLocationOverlay"),
  homeLocClose: document.getElementById("homeLocClose"),
  homeLocQuery: document.getElementById("homeLocQuery"),
  homeLocError: document.getElementById("homeLocError"),
  homeLocStatus: document.getElementById("homeLocStatus"),
  homeLocClear: document.getElementById("homeLocClear"),
  homeLocSearch: document.getElementById("homeLocSearch"),
  homeLocSave: document.getElementById("homeLocSave"),
  homeLocResults: document.getElementById("homeLocResults"),
};



/***********************
 * RESORT TV: HERO ROTATION
 ***********************/
const RESORT_HERO_SLIDES = [
  { subtitle:"Disney Enchantment", time:"Tonight • 8:15 PM", bg:"assets/bg-mk-resortTV.png", layout:"center-parks-bg" },
  { subtitle:"Luminous: The Symphony of Us", time:"Tonight • 9:00 PM", bg:"assets/bg-ep-resortTV.png", layout:"center-parks-bg" },
  { subtitle:"Fantasmic!", time:"Tonight • 9:30 PM", bg:"assets/bg-hs-resortTV.png", layout:"center-parks-bg" },
  { subtitle:"Tree of Life Awakenings", time:"After Sunset", bg:"assets/bg-ak-resortTV.png", layout:"center-parks-bg" },
  { subtitle:"Dining • Shopping • Live Music", time:"Open Late", bg:"assets/bg-ds-resortTV.png", layout:"center-parks-bg" },
];

const resortTV = { timer: null, idx: 0 };

function preloadImage(src) {
  if (!src) return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

function setResortBackground(src) {
  if (!UI.app || !src) return;
  UI.app.style.setProperty("--resort-bg", `url("${src}")`);
}

function setResortHero(slide) {
  const hero = document.querySelector(".resortTV-hero");
  if (!hero || !slide) return;

  // background on .bg
  setResortBackground(slide.bg);

  const subEl  = document.getElementById("heroSubtitle");
  const timeEl = document.getElementById("heroTime");

  let textBox = hero.querySelector(".hero-text");
  if (!textBox) {
    textBox = document.createElement("div");
    textBox.className = "hero-text";
    hero.appendChild(textBox);

    if (subEl) textBox.appendChild(subEl);
    if (timeEl) textBox.appendChild(timeEl);
  }

  if (subEl) subEl.textContent = slide.subtitle ?? "";
  if (timeEl) timeEl.textContent = slide.time ?? "";
}

function startResortHeroRotation() {
  stopResortHeroRotation();

  resortTV.idx = 0;
  setResortHero(RESORT_HERO_SLIDES[resortTV.idx]);

  resortTV.timer = window.setInterval(() => {
    if (state.view !== VIEWS.DISNEY_HOME) return;
    resortTV.idx = (resortTV.idx + 1) % RESORT_HERO_SLIDES.length;
    setResortHero(RESORT_HERO_SLIDES[resortTV.idx]);
  }, 12_000);
}

function stopResortHeroRotation() {
  if (resortTV.timer) {
    clearInterval(resortTV.timer);
    resortTV.timer = null;
  }
}

/***********************
 * STATE
 ***********************/
const state = {
  view: VIEWS.SPLASH,
overlay: {

  [OVERLAYS.NUMPAD]: false,
  [OVERLAYS.COUNTDOWN]: false,
  [OVERLAYS.HOME_LOCATION]: false,
},


  pin: "",
  isUnlocked: false,
  activeProfileKey: null,

  pendingGoToCountdownDisplay: false,
  inCountdownDisplay: false,

  oneDayIndex: 0,
  oneDayLoopTimer: null,

  countAnimRaf: null,
  lastDaysLeft: null,
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
 setProfileBackground(state.activeProfileKey);


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

      if (state.countAnimRaf) {
        cancelAnimationFrame(state.countAnimRaf);
        state.countAnimRaf = null;
      }

      stopOneDayLoop();
      hideOneDayMessage();
      Fireworks.stop({ clear: true });
      UI.app?.classList.remove(
        "countdown-mode",
        "one-day-mode",
        "arrival-day-mode",
        "post-trip-mode"
      );
      
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

      RESORT_HERO_SLIDES.forEach(sl => preloadImage(sl.bg));
      startResortHeroRotation();
  updateParkHoursLive();
applyCountdownOnTvFlag();


    },
    exit() {
      UI.app?.classList.remove("view-disneyHome");
      UI.app?.classList.remove("tv-countdown-enabled");

      stopResortHeroRotation();
    }
  },

[VIEWS.PROFILE_SETTINGS]: {
  enter() {
    if (!state.activeProfileKey) return;

    const p = PROFILES[state.activeProfileKey];
    if (UI.resortName && p) UI.resortName.textContent = `${p.name} • Profile Settings`;

    if (UI.note) UI.note.textContent = "";
    if (UI.backBtn) UI.backBtn.style.display = "flex";
    if (UI.message) UI.message.textContent = getRandomQuote();
updateCountdownOnTvLabel();
updateArrivalDateSettingLabel();
updateHomeLocationSettingLabel();

    stopOneDayLoop();
    Fireworks.stop({ clear: true });
  },
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
  show(UI.profileSettingsView, state.view === VIEWS.PROFILE_SETTINGS);

}

function renderOverlays() {
  if (UI.numpadOverlay) {
    const open = state.overlay[OVERLAYS.NUMPAD];
    UI.numpadOverlay.removeAttribute("hidden");
    UI.numpadOverlay.classList.toggle("show", open);
  }

  if (UI.countdownOverlay) {
    const open = state.overlay[OVERLAYS.COUNTDOWN];
    UI.countdownOverlay.removeAttribute("hidden");
    UI.countdownOverlay.classList.toggle("show", open);
    UI.countdownOverlay.setAttribute("aria-hidden", open ? "false" : "true");

    if (open) UI.countdownOverlay.removeAttribute("inert");
    else UI.countdownOverlay.setAttribute("inert", "");
  }

  if (UI.homeLocationOverlay) {
    const open = state.overlay[OVERLAYS.HOME_LOCATION];
    UI.homeLocationOverlay.removeAttribute("hidden");
    UI.homeLocationOverlay.classList.toggle("show", open);
    UI.homeLocationOverlay.setAttribute("aria-hidden", open ? "false" : "true");

    if (open) UI.homeLocationOverlay.removeAttribute("inert");
    else UI.homeLocationOverlay.setAttribute("inert", "");
  }

// Disable Back button when a blocking modal is open
const modalOpen =
  state.overlay[OVERLAYS.COUNTDOWN] ||
  state.overlay[OVERLAYS.HOME_LOCATION];

if (UI.backBtn) {
  UI.backBtn.classList.toggle("disabled", modalOpen);
  UI.backBtn.setAttribute("aria-disabled", modalOpen ? "true" : "false");
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

  setDigits(daysLeft, { flip: false });
  applyOneDayMode();

 const dFrom = daysFromArrival();
const isNormalCountdown =
  state.inCountdownDisplay && dFrom !== null && dFrom > 1;


  if (isNormalCountdown) {
    if (state.lastDaysLeft === null || state.lastDaysLeft !== daysLeft) {
      animateCountdownTo(daysLeft);
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

  // ✅ Weather updater (Open-Meteo) every 10 minutes
  if (typeof startWeather === "function") setTimeout(startWeather, 0);
if (typeof startParkHours === "function") setTimeout(startParkHours, 0);
setView(VIEWS.SPLASH);

if (UI.versionTag) UI.versionTag.textContent = APP_VERSION;



})();


/***********************
 * CLOCK
 ***********************/
function updateClock() {
  const now = new Date();
  const dayNum = now.getDate();
  const suffix = getDaySuffix(dayNum);

  if (UI.clock) {
    UI.clock.textContent = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  if (UI.day) {
    UI.day.textContent = now.toLocaleDateString([], { weekday: "long" });
  }

  if (UI.date) {
    UI.date.innerHTML = `
      ${now.toLocaleDateString([], { month: "long" })}
      ${dayNum}<span class="daySuffix">${suffix}</span>
    `;
  }

  // Resort TV rail clock (same device time)
  const railDay = document.getElementById("railDay");
  const railTime = document.getElementById("railTimeBig");

  if (railDay) {
    railDay.textContent = now.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }

  if (railTime) {
    railTime.textContent = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
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
  const wrap = noteEl?.parentElement;
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

function updateCountdownOnTvLabel() {
  const el = document.getElementById("countdownOnTvState");
  if (!el) return;
  el.textContent = getShowCountdownOnResortTV() ? "On" : "Off";
}

function applyCountdownOnTvFlag() {
  const enabled = getShowCountdownOnResortTV();
  UI.app?.classList.toggle("tv-countdown-enabled", enabled && state.view === VIEWS.DISNEY_HOME);
}



function getShowCountdownOnResortTV() {
  const v = localStorage.getItem(KEY_SHOW_CD_ON_TV);
  if (v === null) return true;          // default ON
  return v === "true";
}

function setShowCountdownOnResortTV(on) {
  localStorage.setItem(KEY_SHOW_CD_ON_TV, String(Boolean(on)));
}


function openNextTripPlanner() {
  if (state.view !== VIEWS.COUNTDOWN_DISPLAY) return;
  if (state.overlay[OVERLAYS.COUNTDOWN]) return;
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
    void tile.offsetWidth;
    tile.classList.add("is-flipping");
  };

  setOne(UI.cdDigit1, s[0]);
  setOne(UI.cdDigit2, s[1]);
  setOne(UI.cdDigit3, s[2]);
}

function animateCountdownTo(target) {
  if (state.countAnimRaf) {
    cancelAnimationFrame(state.countAnimRaf);
    state.countAnimRaf = null;
  }

  const end = Math.max(0, target ?? 0);

  if (end === 0) {
    setDigits(0, { flip: false });
    state.lastDaysLeft = 0;
    return;
  }

  // If less than 8 days: one flip every 500ms
  if (end < 8) {
    setDigits(0, { flip: false });

    let value = 0;
    const timer = setInterval(() => {
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

  const TOTAL_MS = 7000;
  setDigits(0, { flip: false });

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const t0 = performance.now();
  let value = 0;

  const frame = (now) => {
    if (state.view !== VIEWS.COUNTDOWN_DISPLAY) {
      state.countAnimRaf = null;
      return;
    }

    const elapsed = Math.min(TOTAL_MS, now - t0);
    const t = elapsed / TOTAL_MS;
    const eased = easeOutCubic(t);
    const targetValue = Math.floor(eased * end);

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

  if (d === 1) {
    app.classList.add("one-day-mode");
    if (UI.flipcounter) UI.flipcounter.style.display = "";
    startOneDayLoop();
    Fireworks.start();
    return;
  }

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
  e.stopPropagation();
  state.pin = "";
  UI.dots.forEach(d => d.classList.remove("filled"));
  if (UI.npError) UI.npError.hidden = true;
  setOverlay(OVERLAYS.NUMPAD, true);
});

// Profile Settings → Disney Arrival Date (open the existing countdown modal)
document
  .querySelector('#profileSettingsView [data-setting="arrivalDate"]')
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Must have an active profile to know which localStorage key to use
    if (!state.activeProfileKey) return;

    state.pendingGoToCountdownDisplay = false;
    openCountdownConfig("config"); // opens your existing modal
  });



document.addEventListener("click", (e) => {

  // 1️⃣ SETTINGS (MOST SPECIFIC)
  const settingBtn = e.target.closest("[data-setting]");
  if (settingBtn) {
    const which = settingBtn.dataset.setting;

    if (which === "toggleCountdownOnTV") {
      const next = !getShowCountdownOnResortTV();
      setShowCountdownOnResortTV(next);

      updateCountdownOnTvLabel();
      applyCountdownOnTvFlag();

      setSystemMessage(next ? "Resort TV countdown: ON" : "Resort TV countdown: OFF");
      return;
    }

    if (which === "arrivalDate") {
      state.pendingGoToCountdownDisplay = false;
      openCountdownConfig("config");
      return;
    }

if (which === "homeLocation") {
  openHomeLocationModal();
  return;
}


    if (which === "resetProfile") {
      localStorage.removeItem(countdownKey());
      updateResortNameWithSavedDate();
      setSystemMessage("Profile settings reset.");
      return;
    }
  }

  // 2️⃣ POST-TRIP TAP ANYWHERE
  if (
    state.view === VIEWS.COUNTDOWN_DISPLAY &&
    (() => {
      const d = daysFromArrival();
      return d !== null && d < 0;
    })() &&
    !e.target.closest("#countdownOverlay, #numpadOverlay, button, a, input, [data-page], [data-profile]")
  ) {
    openNextTripPlanner();
    return;
  }

  // 3️⃣ PROFILE BUTTONS
  const profileBtn = e.target.closest("[data-profile]");
  if (profileBtn) {
    if (!state.isUnlocked) return;
    loadProfile(profileBtn.dataset.profile);
    return;
  }

  // 4️⃣ PAGE NAVIGATION
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

updateArrivalDateSettingLabel();
updateHomeLocationSettingLabel();
applyHomeLocationToWeather(); // so weather uses the saved home location immediately
if (typeof updateWeatherBoard === "function") updateWeatherBoard();




  setProfileBackground(key);
  clearIfArrivalOlderThan(POST_TRIP_KEEP_DAYS);

  setView(VIEWS.PROFILE);
  closeCountdownModal();
}

function loadPage(pageKey) {
  if (!state.activeProfileKey) return;

  const p = PROFILES[state.activeProfileKey];

  if (pageKey === "disneyHome") {
    if (UI.resortName) UI.resortName.textContent = `${p.name} • Disney Resort`;
    setSystemMessage("");
    setView(VIEWS.DISNEY_HOME);
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

  if (pageKey === "profileSettings") {
    setView(VIEWS.PROFILE_SETTINGS);
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
    return;
  }
}



UI.homeLocClose?.addEventListener("click", () => {
  haptic("light");
  closeHomeLocationModal();
});

UI.homeLocSearch?.addEventListener("click", async () => {
  haptic("light");
  if (!state.activeProfileKey) return;

  setHomeLocError("");
  setHomeLocStatus("Searching…");
  pendingHomeLoc = null;
  if (UI.homeLocSave) UI.homeLocSave.disabled = true;

  try {
    const loc = await geocodeHomeQuery(UI.homeLocQuery?.value);
    pendingHomeLoc = loc;
    setHomeLocStatus(`Found: ${loc.label} (TZ: ${loc.tz})`);
    if (UI.homeLocSave) UI.homeLocSave.disabled = false;
  } catch (err) {
    setHomeLocStatus("");
    setHomeLocError(err?.message || "Search failed.");
    haptic("error");
  }
});

UI.homeLocClear?.addEventListener("click", () => {
  haptic("light");

  // Clear input + transient state
  if (UI.homeLocQuery) {
    UI.homeLocQuery.value = "";
    UI.homeLocQuery.focus(); // ✅ KEEP KEYBOARD OPEN
  }

  if (UI.homeLocResults) UI.homeLocResults.innerHTML = "";
  pendingHomeLoc = null;

  // Disable Save
  if (UI.homeLocSave) UI.homeLocSave.disabled = true;

  // Clear messages
  setHomeLocError("");
  setHomeLocStatus("");
});



UI.homeLocSave?.addEventListener("click", () => {
  haptic("medium");
  if (!state.activeProfileKey) return;
  if (!pendingHomeLoc) {
    setHomeLocError("Tap Search first to validate your location.");
    haptic("error");
    return;
  }

  setSavedHomeLocation(pendingHomeLoc);
  applyHomeLocationToWeather();
  updateHomeLocationSettingLabel();
  if (typeof updateWeatherBoard === "function") updateWeatherBoard();

  closeHomeLocationModal();
  setSystemMessage("Home location saved");
});



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

  if (UI.countdownOverlay.contains(document.activeElement)) {
    UI.changeDateBtn?.focus?.();
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
  if (!state.activeProfileKey) return;

  // 1️⃣ Remove arrival date
  localStorage.removeItem(countdownKey());

  // 2️⃣ Reset UI state
  if (UI.cdError) UI.cdError.hidden = true;
  if (UI.cdDate) UI.cdDate.value = todayYYYYMMDD();

  // 3️⃣ Reset header title
  const p = PROFILES[state.activeProfileKey];
  if (p && UI.resortName) {
    UI.resortName.textContent = p.name;
  }

  // 4️⃣ Update Profile Settings button label
  updateArrivalDateSettingLabel();

  // 5️⃣ Close modal
  closeCountdownModal();

  // 6️⃣ If user was viewing countdown, return to profile
  if (state.view === VIEWS.COUNTDOWN_DISPLAY) {
    setView(VIEWS.PROFILE);
  }

  // 7️⃣ Optional feedback
  setSystemMessage("Disney arrival date cleared");
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

setSystemMessage("Disney arrival date saved");
updateArrivalDateSettingLabel();

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

/******BACK BUTTON ****************/
UI.backBtn?.addEventListener("click", () => {

  // 1️⃣ Overlay-first behavior (unchanged)
  if (state.overlay[OVERLAYS.COUNTDOWN]) {
    closeCountdownModal();
    return;
  }

  if (state.overlay[OVERLAYS.HOME_LOCATION]) {
    closeHomeLocationModal();
    return;
  }

  if (state.overlay[OVERLAYS.NUMPAD]) {
    setOverlay(OVERLAYS.NUMPAD, false);
    return;
  }

  // 2️⃣ View navigation (THIS WAS MISSING)
  switch (state.view) {
    case VIEWS.PROFILE_SETTINGS:
      setView(VIEWS.PROFILE);
      break;

    case VIEWS.DISNEY_HOME:
    case VIEWS.COUNTDOWN_DISPLAY:
      setView(VIEWS.PROFILE);
      break;

    case VIEWS.PROFILE:
      setView(VIEWS.CHOOSER);
      break;

    case VIEWS.CHOOSER:
      setView(VIEWS.SPLASH);
      break;

    default:
      // SPLASH or unknown → no-op
      break;
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

/* =========================================================
   WEATHER (Open-Meteo) — HOME + DISNEY, Now/Later
   Night rule: 9pm–5:59am (per-location timezone)
   ========================================================= */

// ✅ Set your HOME coords if you want exact local weather.
// Current defaults: Woodbury, MN (approx) + Disney (WDW area)
const WEATHER = {
  home:   { lat: 44.9239, lon: -92.9594, tz: "America/Chicago" },
  disney: { lat: 28.3852, lon: -81.5639, tz: "America/New_York" },
  refreshMs: 10 * 60 * 1000,
};

function isNightHour(hour24) {
  return (hour24 >= 21 || hour24 < 6);
}

// timezone-safe: get hour/date parts in that timezone
function tzParts(timeZone, date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });

  const parts = fmt.formatToParts(date);
  const get = (t) => parts.find(p => p.type === t)?.value;

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: Number(get("hour")),
  };
}

async function fetchOpenMeteo({ lat, lon, tz }) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&current=temperature_2m,weather_code` +
    `&hourly=temperature_2m,weather_code` +
    `&temperature_unit=fahrenheit` +
    `&timezone=${encodeURIComponent(tz)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  return res.json();
}

function iconForWeatherCode(code, isNight) {
  const day = !isNight;

  // Clear / partly / cloudy
  if (code === 0) return day ? "clear_day.svg" : "clear_night.svg";
  if (code === 1 || code === 2) return day ? "partly_day.svg" : "partly_night.svg";
  if (code === 3) return "cloudy.svg";

  // Fog
  if (code === 45 || code === 48) return "fog.svg";

  // Drizzle
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) return "drizzle.svg";

  // Rain (+ freezing rain + showers)
  if (
    code === 61 || code === 63 || code === 65 ||
    code === 66 || code === 67 ||
    code === 80 || code === 81 || code === 82
  ) return "rain.svg";

  // Sleet
  if (code === 68 || code === 69) return "sleet.svg";

  // Snow range
  if (code === 71 || code === 73 || code === 85) return "snow_light.svg";
  if (code === 75 || code === 77) return "snow.svg";
  if (code === 86) return "snow_heavy.svg";

  // Thunder (separate from snow)
  if (code === 95 || code === 96 || code === 99) return "storm.svg";

  return "cloudy.svg";
}

function iconUrl(filename) {
  return `${WEATHER_ICON_BASE}${filename}`;
}

function setIconSpan(spanId, filename) {
  const el = document.getElementById(spanId);
  if (!el) return;

  const src = iconUrl(filename);
  el.innerHTML = `<img src="${src}" alt="" draggable="false" />`;
}

function setTemp(spanId, tempF) {
  const el = document.getElementById(spanId);
  if (!el) return;

  if (typeof tempF !== "number" || Number.isNaN(tempF)) {
    el.textContent = "—";
    return;
  }
  el.textContent = `${Math.round(tempF)}°`;
}

// Pick your "Later" bucket (per timezone):
// - before 6am  -> Morning (8)
// - before 11am -> Midday (12)
// - before 5pm  -> Evening (18)
// - before 9pm  -> Tonight (21)
// - 9pm+        -> Late Night (1 next day)
function pickLaterTargetKey(timeZone) {
  const now = tzParts(timeZone);
  const h = now.hour;

  let label = "Later";
  let targetHour = 12;
  let addDay = 0;

  if (h < 6)       { label = "Morning";   targetHour = 8;  addDay = 0; }
  else if (h < 11) { label = "Midday";    targetHour = 12; addDay = 0; }
  else if (h < 17) { label = "Evening";   targetHour = 18; addDay = 0; }
  else if (h < 21) { label = "Tonight";   targetHour = 21; addDay = 0; }
  else             { label = "Late Night";targetHour = 1;  addDay = 1; } // 9pm–11:59 -> 1am

  // build target date in timezone by starting from "now" in local device and reformatting:
  const base = new Date();
  base.setDate(base.getDate() + addDay);
  const p = tzParts(timeZone, base);

  const HH = String(targetHour).padStart(2, "0");
  const key = `${p.year}-${p.month}-${p.day}T${HH}:00`;

  return { key, label, targetHour };
}

// Find exact time match, else first time >= key (lexicographic works for YYYY-MM-DDTHH:MM)
function findTimeIndex(times, key) {
  if (!Array.isArray(times) || !times.length) return -1;

  let exact = times.indexOf(key);
  if (exact >= 0) return exact;

  for (let i = 0; i < times.length; i++) {
    if (times[i] >= key) return i;
  }
  return times.length - 1;
}

function parseHourFromTimeString(t) {
  // "YYYY-MM-DDTHH:MM"
  const hh = String(t).slice(11, 13);
  const n = Number(hh);
  return Number.isFinite(n) ? n : 12;
}

function applyWeatherToUI(prefix, data, timeZone) {
  // NOW
  const nowTemp = data?.current?.temperature_2m;
  const nowCode = data?.current?.weather_code;

  const nowHour = tzParts(timeZone).hour;
  const nightNow = isNightHour(nowHour);

  setTemp(`${prefix}NowTemp`, nowTemp);
  setIconSpan(`${prefix}NowIcon`, iconForWeatherCode(nowCode, nightNow));

  // LATER
  const times = data?.hourly?.time;
  const temps = data?.hourly?.temperature_2m;
  const codes = data?.hourly?.weather_code;

  if (!times || !temps || !codes) return;

  const pick = pickLaterTargetKey(timeZone);
  const idx = findTimeIndex(times, pick.key);

  if (idx >= 0) {
    const laterTemp = temps[idx];
    const laterCode = codes[idx];

    const laterHour = parseHourFromTimeString(times[idx]);
    const laterNight = isNightHour(laterHour);

    setTemp(`${prefix}LaterTemp`, laterTemp);
    setIconSpan(`${prefix}LaterIcon`, iconForWeatherCode(laterCode, laterNight));

    const whenEl = document.getElementById(`${prefix}LaterWhen`);
    if (whenEl) whenEl.textContent = pick.label;
  }
}

async function updateWeatherBoard() {
  try {
    const [home, disney] = await Promise.all([
      fetchOpenMeteo(WEATHER.home),
      fetchOpenMeteo(WEATHER.disney),
    ]);

    applyWeatherToUI("home", home, WEATHER.home.tz);
    applyWeatherToUI("disney", disney, WEATHER.disney.tz);
  } catch (err) {
    console.warn("Weather update failed:", err);
  }
}

function startWeather() {
  updateWeatherBoard();
  window.setInterval(updateWeatherBoard, WEATHER.refreshMs);
}

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





/* =========================================================
   PARK HOURS (ThemeParks.wiki) — live schedule with fallback
   ========================================================= */

// Hardcode these once (you already discovered them)
const PARKS = [
  {
    key: "mk",
    name: "Magic Kingdom",
    entityId: "75ea578a-adc8-4116-a54d-dccb60765ef9",
    typical: "9:00 AM – 9:00 PM*",
  },
  {
    key: "ep",
    name: "Epcot",
    entityId: "47f90d2c-e191-4239-a466-5892ef59a88b",
    typical: "11:00 AM – 10:00 PM*",
  },
  {
    key: "hs",
    name: "Disney’s Hollywood Studios",
    entityId: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
    typical: "9:00 AM – 9:00 PM*",
  },
  {
    key: "ak",
    name: "Disney’s Animal Kingdom",
    entityId: "1c84a229-8862-4648-9c71-378ddd2c7693",
    typical: "8:00 AM – 7:00 PM*",
  },
];

// ThemeParks.wiki base
const THEMEPARKS_BASE = "https://api.themeparks.wiki/v1";

// Helpers
function fmtTimeRange(openISO, closeISO) {
  const opts = { hour: "numeric", minute: "2-digit" };
  const open = new Date(openISO);
  const close = new Date(closeISO);
  if (Number.isNaN(open.getTime()) || Number.isNaN(close.getTime())) return null;

  // Use local display; if you want Orlando time always, we can format w/ timeZone.
  const a = open.toLocaleTimeString([], opts);
  const b = close.toLocaleTimeString([], opts);
  return `${a} – ${b}`;
}

function updateArrivalDateSettingLabel() {
  // Matches index.html: <span id="arrivalDateSettingValue" ...>
  const valueEl = document.getElementById("arrivalDateSettingValue");
  if (!valueEl) return;

  const savedIso = localStorage.getItem(countdownKey());
  if (!savedIso) {
    valueEl.textContent = "Not set";
    return;
  }

  const d = new Date(savedIso);
  if (Number.isNaN(d.getTime())) {
    valueEl.textContent = "Not set";
    return;
  }

  valueEl.textContent = d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}





function ymdInTZ(timeZone) {
  const p = tzParts(timeZone); // you already have tzParts() in your weather code
  return `${p.year}-${p.month}-${p.day}`;
}

async function fetchTodayHoursForPark(entityId) {
  // Upcoming schedule endpoint
  const url = `${THEMEPARKS_BASE}/entity/${encodeURIComponent(entityId)}/schedule`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Hours HTTP ${res.status}`);

  const data = await res.json();

  // ThemeParks schedule response typically has "schedule": [ { date, openingTime, closingTime, type } ... ]
  const schedule = data?.schedule;
  if (!Array.isArray(schedule) || schedule.length === 0) return null;

  // Pick "today" in Orlando time to match WDW operations
  const todayYMD = ymdInTZ("America/New_York");

  // Prefer OPERATING type if present
  const todays = schedule.filter(s => s?.date === todayYMD);
  const operating =
    todays.find(s => String(s?.type || "").toUpperCase() === "OPERATING") ||
    todays[0];

  const openISO = operating?.openingTime;
  const closeISO = operating?.closingTime;
  if (!openISO || !closeISO) return null;

  return fmtTimeRange(openISO, closeISO);
}

function setTypicalHoursAndShowNote(showNote) {
  // Overwrite times back to typical (with *)
  const items = document.querySelectorAll("#railHoursList .rail-hoursItem");
  items.forEach(item => {
    const nameEl = item.querySelector(".rail-hoursName");
    const timeEl = item.querySelector(".rail-hoursTime");
    if (!nameEl || !timeEl) return;

    const park = PARKS.find(p => p.name === nameEl.textContent.trim());
    if (!park) return;

    timeEl.textContent = park.typical;
  });

  const note = document.getElementById("parkHoursNote");
  if (note) note.hidden = !showNote;
}

async function updateParkHoursLive() {
  try {
    // fetch in parallel
    const results = await Promise.all(
      PARKS.map(p => fetchTodayHoursForPark(p.entityId))
    );

    // If any park failed to resolve hours, treat as failure (so you keep the * typical hours note)
    if (results.some(r => !r)) throw new Error("Missing schedule for one or more parks");

    // Apply live hours (NO *)
    const items = document.querySelectorAll("#railHoursList .rail-hoursItem");
    items.forEach(item => {
      const nameEl = item.querySelector(".rail-hoursName");
      const timeEl = item.querySelector(".rail-hoursTime");
      if (!nameEl || !timeEl) return;

      const idx = PARKS.findIndex(p => p.name === nameEl.textContent.trim());
      if (idx < 0) return;

      timeEl.textContent = results[idx]; // already formatted
    });

    // Hide "* typical hours"
    const note = document.getElementById("parkHoursNote");
    if (note) note.hidden = true;

  } catch (err) {
    console.warn("Park hours live update failed; using typical hours.", err);
    setTypicalHoursAndShowNote(true);
  }
}

function startParkHours() {
  updateParkHoursLive();

  // refresh every 30 minutes while running
  window.setInterval(updateParkHoursLive, 30 * 60 * 1000);
}

/***********************
 * HOME LOCATION (per-profile)
 ***********************/
const DEFAULT_HOME = { label: "Woodbury, MN", lat: 44.9239, lon: -92.9594, tz: "America/Chicago" };

function homeLocationKey() {
  return `${KEY_HOME_LOCATION}_${state.activeProfileKey || "unknown"}`;
}

function getSavedHomeLocation() {
  if (!state.activeProfileKey) return DEFAULT_HOME;

  const raw = localStorage.getItem(homeLocationKey());
  if (!raw) return DEFAULT_HOME;

  try {
    const obj = JSON.parse(raw);
    const lat = Number(obj.lat);
    const lon = Number(obj.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return DEFAULT_HOME;
    }

    return {
      label: String(obj.label || DEFAULT_HOME.label),
      lat,
      lon,
      tz: String(obj.tz || DEFAULT_HOME.tz),
    };
  } catch {
    return DEFAULT_HOME;
  }
}


function setSavedHomeLocation(locOrNull) {
  if (!state.activeProfileKey) return;
  if (!locOrNull) {
    localStorage.removeItem(homeLocationKey());
    return;
  }
  localStorage.setItem(homeLocationKey(), JSON.stringify(locOrNull));
}

function applyHomeLocationToWeather() {
  const saved = getSavedHomeLocation();
  const loc = saved ?? DEFAULT_HOME;

  WEATHER.home.lat = loc.lat;
  WEATHER.home.lon = loc.lon;
  WEATHER.home.tz  = loc.tz || DEFAULT_HOME.tz;
}

function updateHomeLocationSettingLabel() {
  const el = document.getElementById("homeLocationSettingValue");
  if (!el) return;

  const saved = getSavedHomeLocation();
  if (!saved) {
    el.textContent = "Not set";
    return;
  }

  // Prefer a friendly label; fall back to coords
  const label = String(saved.label || "").trim();
  el.textContent = label ? label : `${saved.lat.toFixed(4)}, ${saved.lon.toFixed(4)}`;
}

function isValidLatLon(lat, lon) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
}

function openHomeLocationModal() {
  if (!UI.homeLocationOverlay) return;
  if (!state.activeProfileKey) return;

  // Load saved (or default) into the search box
  const saved = getSavedHomeLocation();
  const loc = saved ?? DEFAULT_HOME;

  if (UI.homeLocQuery) UI.homeLocQuery.value = loc.label ?? "";

  // No selection yet until user searches (or uses Woodbury button)
  pendingHomeLoc = null;
  if (UI.homeLocSave) UI.homeLocSave.disabled = true;

  setHomeLocError("");
  setHomeLocStatus(saved ? `Current: ${loc.label}` : "Tip: enter “City, ST” or a ZIP");

  setOverlay(OVERLAYS.HOME_LOCATION, true);
  UI.homeLocQuery?.focus?.();

  applyHomeLocationToWeather();
  updateHomeLocationSettingLabel();
}


function closeHomeLocationModal() {
  setOverlay(OVERLAYS.HOME_LOCATION, false);
  setHomeLocError("");
  setHomeLocStatus("");
  pendingHomeLoc = null;
  if (UI.homeLocSave) UI.homeLocSave.disabled = true;
}


let pendingHomeLoc = null; // holds last successful geocode result until Save

function looksLikeZip(s) {
  return /^\d{5}(-\d{4})?$/.test(String(s).trim());
}

async function geocodeHomeQuery(query) {
  const q = String(query || "").trim();
  if (!q) throw new Error("Please enter a City, State or ZIP.");

  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(q)}` +
    `&format=json` +
    `&addressdetails=1` +
    `&limit=5` +
    `&countrycodes=us`;

  const res = await fetch(url, {
    headers: {
      // REQUIRED by Nominatim usage policy
      "User-Agent": "ResortChannel/2.0 (home-tablet)",
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Geocoding failed (HTTP ${res.status})`);
  }

  const results = await res.json();
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("No matches found. Try City, ST or ZIP.");
  }

  const best = results[0];

  const lat = Number(best.lat);
  const lon = Number(best.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Invalid coordinates returned.");
  }

  const addr = best.address || {};
  const labelParts = [
    addr.city || addr.town || addr.village || addr.hamlet,
    addr.state,
  ].filter(Boolean);

  return {
    label: labelParts.join(", ") || best.display_name,
    lat,
    lon,
    // timezone handled elsewhere (same as today)
    tz: DEFAULT_HOME.tz,
  };
}


function setHomeLocError(msg) {
  if (!UI.homeLocError) return;
  UI.homeLocError.hidden = !msg;
  UI.homeLocError.textContent = msg || "";
}

function setHomeLocStatus(msg) {
  if (!UI.homeLocStatus) return;
  UI.homeLocStatus.hidden = !msg;
  UI.homeLocStatus.textContent = msg || "";
}
