/***********************
 * CONFIG
 ***********************/
const PASSWORD = "123";
const PIN_LEN = PASSWORD.length;

/***********************
 * QUOTES
 ***********************/
const DISNEY_QUOTES = [
  "“Adventure is out there.” — Ellie",
  "“Ohana means family. Family means nobody gets left behind.” — Lilo",
  "“Just keep swimming.” — Dory",
  "“You’ve got a friend in me.” — Woody",
  "“If you can dream it, you can do it.” — Walt Disney",
  "“All our dreams can come true, if we have the courage to pursue them.” — Walt Disney",
  "“It’s kind of fun to do the impossible.” — Walt Disney",
  "“The way to get started is to quit talking and begin doing.” — Walt Disney",
  "“We keep moving forward, opening new doors, and doing new things.” — Walt Disney"
];

/***********************
 * PROFILES
 ***********************/
const PROFILES = {
  verhulst: { name: "Stocker/ Verhulst Family", greetingName: "Krista and Mike", greeting: "Welcome Home!", tagline: "Family, comfort, and everyday magic." },
  lori: { name: "Biermann Family", greetingName: "Lori and Dave", greeting: "Welcome Home, Lori and Dave!", tagline: "Take a breath. You're home." },
  mckenzie: { name: "Verhulst Family", greetingName: "McKenzie", greeting: "Welcome Home, McKenzie!", tagline: "Adventure starts today." },
  kaylia: { name: "Verhulst Family", greetingName: "Kaylia", greeting: "Welcome Home, Kaylia!", tagline: "Frogs, fun, and fairy tales." },
  mira: { name: "Mira & Baby Hazel Family", greetingName: "Mira & Baby Hazel", greeting: "Welcome Home, Mira & Baby Hazel!", tagline: "Wonder everywhere." },
  resort: { name: "Resort Test", greetingName: "Resort", greeting: "Resort Test", tagline: "Testing environment." }
};

/***********************
 * STATE
 ***********************/
let pin = "";
let activeProfileKey = null;
/** If user tapped Countdown Display but no date exists, open config then auto-show display after Save */
let pendingGoToCountdownDisplay = false;

/***********************
 * ELEMENTS
 ***********************/
const splash = document.getElementById("splash");
const chooser = document.getElementById("chooser");
const lockBox = document.getElementById("lockBox");
const backBtn = document.getElementById("backBtn");

const overlay = document.getElementById("numpadOverlay");
const npError = document.getElementById("npError");
const dots = Array.from(document.querySelectorAll(".dot"));

const profileView = document.getElementById("profileView");

// Countdown config modal (split)
const countdownOverlay = document.getElementById("countdownOverlay"); // .cdOverlay
const cdDate = document.getElementById("cdDate");
const cdError = document.getElementById("cdError");

// Flipcounter display
const countdownSection = document.getElementById("countdownSection");
const arrivalDateText = document.getElementById("arrivalDateText");

// Digits
const cdDigit1 = document.getElementById("cdDigit1");
const cdDigit2 = document.getElementById("cdDigit2");
const cdDigit3 = document.getElementById("cdDigit3");

/***********************
 * INIT
 ***********************/
(function initUI() {
  chooser && (chooser.style.display = "none");
  lockBox && (lockBox.style.display = "block");
  backBtn && (backBtn.style.display = "none");
  profileView && profileView.classList.remove("isOpen");

  if (countdownOverlay) {
    countdownOverlay.classList.remove("show");
    countdownOverlay.setAttribute("aria-hidden", "true");
    countdownOverlay.removeAttribute("data-mode");
  }
  cdError && (cdError.style.display = "none");

  countdownSection && (countdownSection.hidden = true);
  document.querySelector(".app")?.classList.remove("countdown-mode");
})();

/***********************
 * CLOCK
 ***********************/
function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");

  if (clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (dateEl) dateEl.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}
setInterval(updateClock, 1000);
updateClock();

/***********************
 * HELPERS
 ***********************/
function getRandomQuote() {
  return DISNEY_QUOTES[Math.floor(Math.random() * DISNEY_QUOTES.length)];
}

function haptic(type = "light") {
  if (!("vibrate" in navigator)) return;
  const patterns = { light: 10, medium: 20, error: [30, 40, 30] };
  navigator.vibrate(patterns[type] ?? 10);
}

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isPastDate(yyyyMMdd) {
  const chosen = new Date(`${yyyyMMdd}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return chosen < today;
}

function countdownKey() {
  return `arrivalDate_${activeProfileKey || "unknown"}`;
}

function clearIfPastArrival() {
  if (!activeProfileKey) return;

  const saved = localStorage.getItem(countdownKey());
  if (!saved) return;

  const savedDate = new Date(saved);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (savedDate < today) localStorage.removeItem(countdownKey());
}

function getTimeGreeting(name) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name}!`;
  if (hour < 18) return `Good Afternoon, ${name}!`;
  return `Good Evening, ${name}!`;
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

function updateResortNameWithSavedDate() {
  if (!activeProfileKey) return;

  const p = PROFILES[activeProfileKey];
  const rn = document.getElementById("resortName");
  if (!p || !rn) return;

  const savedIso = localStorage.getItem(countdownKey());
  if (!savedIso) {
    rn.textContent = p.name;
    return;
  }

  const d = new Date(savedIso);
  if (Number.isNaN(d.getTime())) {
    localStorage.removeItem(countdownKey());
    rn.textContent = p.name;
    return;
  }

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const ymd = `${yyyy}-${mm}-${dd}`;

  if (isPastDate(ymd)) {
    localStorage.removeItem(countdownKey());
    rn.textContent = p.name;
    return;
  }

  const pretty = d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  rn.textContent = `${p.name} • ${pretty}`;
}

/***********************
 * FLIPCOUNTER DISPLAY
 ***********************/
function setDigits(daysLeft) {
  const s = String(Math.max(0, daysLeft ?? 0)).padStart(3, "0").slice(-3);
  cdDigit1 && (cdDigit1.textContent = s[0]);
  cdDigit2 && (cdDigit2.textContent = s[1]);
  cdDigit3 && (cdDigit3.textContent = s[2]);
}

function showCountdownDisplay() {
  document.querySelector(".app")?.classList.add("countdown-mode");
  document.getElementById("profileActions")?.style.setProperty("display", "none");

  if (countdownSection) countdownSection.hidden = false;

  const savedIso = localStorage.getItem(countdownKey());
  if (arrivalDateText) {
    if (!savedIso) {
      arrivalDateText.textContent = "—";
    } else {
      const d = new Date(savedIso);
      arrivalDateText.textContent = Number.isNaN(d.getTime())
        ? "—"
        : d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    }
  }

  setDigits(daysUntilArrival() ?? 0);
  closeCountdownModal();
}

function hideCountdownDisplay() {
  document.querySelector(".app")?.classList.remove("countdown-mode");
  if (countdownSection) countdownSection.hidden = true;
  document.getElementById("profileActions")?.style.setProperty("display", "grid");
}

/***********************
 * NUMPAD / UNLOCK
 ***********************/
document.getElementById("unlock")?.addEventListener("click", () => {
  pin = "";
  dots.forEach(d => d.classList.remove("filled"));
  npError && (npError.style.display = "none");
  overlay?.classList.add("show");
});

document.getElementById("npClose")?.addEventListener("click", () => {
  overlay?.classList.remove("show");
});

document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("click", () => {
    const k = btn.dataset.k;
    haptic("light");

    if (k === "back") {
      pin = "";
      dots.forEach(d => d.classList.remove("filled"));
      overlay?.classList.remove("show");
      npError && (npError.style.display = "none");
      return;
    }

    if (k === "clear") {
      pin = "";
      dots.forEach(d => d.classList.remove("filled"));
      npError && (npError.style.display = "none");
      return;
    }

    if (pin.length < PIN_LEN) {
      pin += k;
      dots.forEach((d, i) => d.classList.toggle("filled", i < pin.length));
    }

    if (pin.length === PIN_LEN) {
      if (pin === PASSWORD) {
        haptic("medium");
        overlay?.classList.remove("show");
        lockBox && (lockBox.style.display = "none");
        chooser && (chooser.style.display = "block");
        npError && (npError.style.display = "none");
        document.getElementById("splashTagline")?.style.setProperty("display", "none");
      } else {
        haptic("error");
        pin = "";
        npError && (npError.style.display = "block");
        dots.forEach(d => d.classList.remove("filled"));
      }
    }
  });
});

/***********************
 * CLICK HANDLING
 ***********************/
document.addEventListener("click", (e) => {
  const profileBtn = e.target.closest("[data-profile]");
  if (profileBtn) {
    loadProfile(profileBtn.dataset.profile);
    return;
  }

  const pageBtn = e.target.closest("[data-page]");
  if (pageBtn) {
    loadPage(pageBtn.dataset.page);
    return;
  }
});

/***********************
 * PROFILE LOADING
 ***********************/
function loadProfile(key) {
  const p = PROFILES[key];
  if (!p) return;

  activeProfileKey = key;
  clearIfPastArrival();

  splash && (splash.style.display = "none");
  profileView && profileView.classList.add("isOpen");
  backBtn && (backBtn.style.display = "flex");

  hideCountdownDisplay();
  updateResortNameWithSavedDate();

  document.getElementById("greeting").textContent =
    (key === "resort") ? (p.greeting || "") : getTimeGreeting(p.greetingName || p.name);

  document.getElementById("tagline").textContent = p.tagline || "";
  document.getElementById("message").textContent = getRandomQuote();
  document.getElementById("note").textContent = "";

  closeCountdownModal();
}

/***********************
 * PAGE NAV
 ***********************/
function loadPage(pageKey) {
  if (!activeProfileKey) return;

  const p = PROFILES[activeProfileKey];
  const rn = document.getElementById("resortName");
  const note = document.getElementById("note");
  const msg = document.getElementById("message");

  msg && (msg.textContent = getRandomQuote());

  if (pageKey === "disneyHome") {
    hideCountdownDisplay();
    rn && (rn.textContent = `${p.name} • Disney Resort.`);
    note && (note.textContent = "Disney Resort Home coming soon.");
    closeCountdownModal();
    return;
  }

  if (pageKey === "disneyPictures") {
    hideCountdownDisplay();
    rn && (rn.textContent = `${p.name} • Disney Pictures`);
    note && (note.textContent = "Disney Pictures coming soon.");
    closeCountdownModal();
    return;
  }

  if (pageKey === "countdownConfig") {
    hideCountdownDisplay();
    updateResortNameWithSavedDate();
    note && (note.textContent = "Pick your Disney arrival date.");
    pendingGoToCountdownDisplay = false;
    openCountdownConfig("config"); // <-- Clear is visible here
    return;
  }

  if (pageKey === "countdownDisplay") {
    clearIfPastArrival();

    const saved = localStorage.getItem(countdownKey());
    if (!saved) {
      note && (note.textContent = "Please set your Disney arrival date first.");
      pendingGoToCountdownDisplay = true;
      openCountdownConfig("config");
      return;
    }

    rn && (rn.textContent = `${p.name} • Countdown`);
    note && (note.textContent = "");
    showCountdownDisplay();
  }
}

/***********************
 * COUNTDOWN CONFIG MODAL
 ***********************/
function closeCountdownModal() {
  if (!countdownOverlay) return;
  countdownOverlay.classList.remove("show");
  countdownOverlay.setAttribute("aria-hidden", "true");
  cdError && (cdError.style.display = "none");
  countdownOverlay.removeAttribute("data-mode");
}

function openCountdownConfig(mode = "config") {
  if (!countdownOverlay || !cdDate) return;

  // Set mode so CSS can react (config = show Clear, change = hide Clear)
  countdownOverlay.dataset.mode = mode;

  cdDate.min = todayYYYYMMDD();

  const saved = localStorage.getItem(countdownKey());
  if (saved) {
    const dt = new Date(saved);
    if (!Number.isNaN(dt.getTime())) {
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const dd = String(dt.getDate()).padStart(2, "0");
      cdDate.value = `${yyyy}-${mm}-${dd}`;
    }
  } else {
    cdDate.value = todayYYYYMMDD();
  }

  if (cdError) cdError.style.display = "none";

  countdownOverlay.classList.add("show");
  countdownOverlay.setAttribute("aria-hidden", "false");

  try { cdDate.showPicker?.(); } catch {}
}


countdownOverlay?.querySelector(".cdClose")?.addEventListener("click", closeCountdownModal);

cdDate?.addEventListener("change", () => {
  if (!cdDate?.value) return;
  const bad = isPastDate(cdDate.value);
  cdError && (cdError.style.display = bad ? "block" : "none");
});

document.getElementById("cdClear")?.addEventListener("click", () => {
  // Only makes sense in config mode; if hidden, user can’t click it anyway.
  localStorage.removeItem(countdownKey());

  cdError && (cdError.style.display = "none");
  cdDate && (cdDate.value = todayYYYYMMDD());

  const p = PROFILES[activeProfileKey];
  const rn = document.getElementById("resortName");
  if (p && rn) rn.textContent = p.name;

  document.getElementById("note").textContent = "Disney arrival date cleared.";
  pendingGoToCountdownDisplay = false;

  closeCountdownModal();
});

document.getElementById("cdSave")?.addEventListener("click", () => {
  if (!cdDate || !cdDate.value) return;

  if (isPastDate(cdDate.value)) {
    cdError && (cdError.style.display = "block");
    return;
  }

  const dt = new Date(`${cdDate.value}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return;

  localStorage.setItem(countdownKey(), dt.toISOString());
  document.getElementById("note").textContent = "Disney arrival date saved.";

  updateResortNameWithSavedDate();
  closeCountdownModal();

  // If we came from Countdown Display (Change date), return there
  if (pendingGoToCountdownDisplay) {
    pendingGoToCountdownDisplay = false;
    showCountdownDisplay();
  }
});

/***********************
 * Change date button (inside flipcounter)
 ***********************/
document.getElementById("changeDateBtn")?.addEventListener("click", () => {
  pendingGoToCountdownDisplay = true;
  openCountdownConfig("change"); // <-- Clear hidden here
});

/***********************
 * BACK BUTTON (simple + global)
 ***********************/
backBtn?.addEventListener("click", () => {
  if (countdownOverlay?.classList.contains("show")) {
    closeCountdownModal();
    return;
  }

  if (countdownSection && countdownSection.hidden === false) {
    hideCountdownDisplay();
    return;
  }

  if (activeProfileKey && profileView?.classList.contains("isOpen")) {
    profileView.classList.remove("isOpen");
    splash && (splash.style.display = "block");
    chooser && (chooser.style.display = "block");
    lockBox && (lockBox.style.display = "none");

    document.getElementById("splashTagline")?.style.setProperty("display", "none");
    document.getElementById("resortName").textContent = "Main Home";
    document.getElementById("note").textContent = "";

    activeProfileKey = null;
    backBtn && (backBtn.style.display = "none");
  }
});
