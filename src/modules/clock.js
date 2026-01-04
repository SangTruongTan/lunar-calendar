export function initClock(element) {
  const render = () => {
    const now = new Date();
    element.innerHTML = `
      <div class="time-display" style="font-size: 5rem; font-weight: 200;">
        ${now.toLocaleTimeString([], { hour12: false })}
      </div>
      <div class="date-display" style="font-size: 1.2rem; color: var(--text-secondary); margin-top: 0.5rem;">
        ${now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    `;
  };

  render();
  setInterval(render, 1000);
}
