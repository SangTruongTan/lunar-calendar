import './style.css';

document.querySelector('#app').innerHTML = `
  <aside id="clock-panel" class="glass-card">
    <div id="clock-container"></div>
    <div id="quote-container"></div>
  </aside>
  
  <main id="calendar-panel" class="glass-card">
    <div id="calendar-header"></div>
    <div id="calendar-grid"></div>
  </main>
`;

// Initialize Modules
import { initClock } from './modules/clock.js';
import { initCalendar } from './modules/calendar.js';
import { initQuote } from './modules/quote.js';

initClock(document.querySelector('#clock-container'));
initCalendar(document.querySelector('#calendar-panel'));
initQuote(document.querySelector('#quote-container'));
