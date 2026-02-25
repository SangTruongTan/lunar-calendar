import "./style.css";

// Register service worker for offline support
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/lunar-calendar/sw.js", { scope: "/lunar-calendar/" })
    .catch(() => {
      // Silently fail if sw.js doesn't exist yet (VitePWA will generate it during build)
    });
}

document.querySelector("#app").innerHTML = `
  <button id="theme-toggle" class="theme-toggle" title="Toggle Theme">
    <span class="theme-icon">🌙</span>
  </button>

  <div id="info-row">
    <div id="clock-panel" class="glass-card info-card">
      <div id="clock-container"></div>
    </div>

    <div id="quote-panel" class="glass-card info-card">
      <div id="quote-container"></div>
    </div>

    <div id="solar-panel" class="glass-card info-card">
      <div id="solar-container"></div>
    </div>

    <div id="lunar-panel" class="glass-card info-card">
      <div id="lunar-container"></div>
    </div>
  </div>

  <main id="calendar-panel" class="glass-card">
    <div id="calendar-header"></div>
    <div id="calendar-grid"></div>
  </main>
`;

// Initialize Modules
import { initClock } from "./modules/clock.js";
import { initCalendar } from "./modules/calendar.js";
import { initQuote } from "./modules/quote.js";
import { initSolarDate } from "./modules/solarDate.js";
import { initLunarDate } from "./modules/lunarDate.js";
import { onDateChange } from "./modules/dateChange.js";

// Initialize each module and capture their re-render functions
const refreshCalendar = initCalendar(document.querySelector("#calendar-panel"));
const refreshQuote = initQuote(document.querySelector("#quote-container"));
const refreshSolarDate = initSolarDate(
  document.querySelector("#solar-container"),
);
const refreshLunarDate = initLunarDate(
  document.querySelector("#lunar-container"),
);

// The clock must be initialized last, because its tick() calls checkDateChange()
// which fires the listeners below. All subscribers must be registered first.
initClock(document.querySelector("#clock-container"));

// ─── Central date-change wiring ───
// When the date rolls over (midnight or tab-switch across midnight),
// re-render every date-dependent widget from this single place.
onDateChange(() => {
  refreshCalendar();
  refreshQuote();
  refreshSolarDate();
  refreshLunarDate();
});

// Theme Toggle
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-theme", savedTheme);
themeIcon.textContent = savedTheme === "light" ? "🌙" : "☀️";

themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeIcon.textContent = newTheme === "light" ? "🌙" : "☀️";
});
