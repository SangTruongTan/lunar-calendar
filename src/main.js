import './style.css';

document.querySelector('#app').innerHTML = `
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
import { initClock } from './modules/clock.js';
import { initCalendar } from './modules/calendar.js';
import { initQuote } from './modules/quote.js';
import { initSolarDate } from './modules/solarDate.js';
import { initLunarDate } from './modules/lunarDate.js';

initClock(document.querySelector('#clock-container'));
initCalendar(document.querySelector('#calendar-panel'));
initQuote(document.querySelector('#quote-container'));
initSolarDate(document.querySelector('#solar-container'));
initLunarDate(document.querySelector('#lunar-container'));

// Theme Toggle
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'light' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
});
