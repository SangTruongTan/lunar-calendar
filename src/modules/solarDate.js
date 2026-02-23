import { onDateChange } from "./dateChange.js";

export function initSolarDate(element) {
  const render = () => {
    const now = new Date();
    const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
    const month = now.toLocaleDateString("en-US", { month: "short" });
    const day = now.getDate();
    const year = now.getFullYear();

    element.innerHTML = `
      <div class="info-label">☀️ Solar Date</div>
      <div class="info-value date-visual">
        <div class="date-day-number">${day}</div>
        <div class="date-details">
          <div class="date-month">${month} ${year}</div>
          <div class="date-weekday">${weekday}</div>
        </div>
      </div>
    `;
  };

  render();

  // Re-render whenever the calendar date changes (midnight, visibility restore, etc.)
  onDateChange(render);
}
