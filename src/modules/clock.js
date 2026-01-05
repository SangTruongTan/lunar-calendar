export function initClock(element) {
  const render = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    element.innerHTML = `
      <div class="info-label">🕐 Clock</div>
      <div class="clock-visual">
        <div class="time-large">
          <span class="time-unit">${hours}</span><span class="time-separator">:</span><span class="time-unit">${minutes}</span><span class="time-separator pulse">:</span><span class="time-unit">${seconds}</span>
        </div>
        <div class="time-labels">
          <span>Hours</span>
          <span>Minutes</span>
          <span>Seconds</span>
        </div>
      </div>
    `;
  };

  render();
  setInterval(render, 1000);
}
