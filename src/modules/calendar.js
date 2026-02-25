import { Solar } from "lunar-javascript";

// Vietnamese Holidays (Solar calendar)
const solarHolidays = {
  "1-1": "Tết Dương lịch / New Year",
  "14-2": "Valentine's Day",
  "8-3": "Ngày Quốc tế Phụ nữ",
  "1-4": "April Fools' Day",
  "22-4": "Earth Day",
  "30-4": "Fall of Saigon",
  "1-5": "Ngày Quốc tế Lao động",
  "1-6": "Ngày Quốc tế Thiếu nhi",
  "28-6": "Ngày Gia đình Việt Nam",
  "2-9": "Quốc Khánh",
  "10-10": "Ngày Giải phóng Thủ đô",
  "20-10": "Ngày Phụ nữ Việt Nam",
  "31-10": "Halloween",
  "20-11": "Ngày Nhà giáo Việt Nam",
  "24-12": "Christmas Eve",
  "25-12": "Christmas",
};

// Vietnamese Holidays (Lunar calendar)
const lunarHolidays = {
  "1-1": "Tết Nguyên Đán",
  "2-1": "Mùng 2 Tết",
  "3-1": "Mùng 3 Tết",
  "4-1": "Mùng 4 Tết",
  "5-1": "Mùng 5 Tết",
  "15-1": "Tết Nguyên Tiêu",
  "10-3": "Giỗ Tổ Hùng Vương",
  "15-4": "Phật Đản",
  "5-5": "Tết Đoan Ngọ",
  "15-7": "Vu Lan",
  "15-8": "Tết Trung Thu",
  "23-12": "Ông Táo",
  "29-12": "Giao Thừa (Năm nhuận)",
  "30-12": "Giao Thừa",
};

/**
 * Initializes the calendar widget.
 * @param {HTMLElement} element
 * @returns {() => void} A refresh function to re-render the calendar (e.g. on date change).
 */
export function initCalendar(element) {
  let currentDate = new Date();
  // Track whether the user has manually navigated away from "today's" month.
  // If they haven't (or pressed Today), we auto-advance on date change.
  let isViewingCurrentMonth = true;

  // Helper: Get ISO Week Number
  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  const render = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of source month
    const firstDayOfMonth = new Date(year, month, 1);
    // Last day of source month
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Days in month
    const daysInMonth = lastDayOfMonth.getDate();

    // Day of week for 1st day (0 = Sunday, 1 = Monday, ...). Adjust for Monday start (0 = Mon, 6 = Sun)
    let startDayOfWeek = firstDayOfMonth.getDay();
    // Shift so Monday is 0, Sunday is 6
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const monthName = firstDayOfMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    let html = `
      <div class="calendar-header-controls">
        <button id="prev-month" class="nav-btn">&larr;</button>
        <h2>${monthName}</h2>
        <button id="next-month" class="nav-btn">&rarr;</button>
        <button id="today-btn" class="today-btn">Today</button>
      </div>
      <div class="calendar-grid-header">
        <div class="week-col-header">Wk</div>
        <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
      </div>
      <div class="calendar-grid-body">
    `;

    // Fill grid
    let dayCount = 1;
    let rows = [];
    let currentWeekDate = new Date(year, month, 1 - startDayOfWeek); // Start date of the first week row
    const todayWeekNum = getWeekNumber(new Date());

    // Generate maximum 6 rows (42 cells) to cover all possibilities
    for (let i = 0; i < 6; i++) {
      const weekNum = getWeekNumber(new Date(currentWeekDate));
      const isCurrentWeek =
        weekNum === todayWeekNum &&
        new Date().getFullYear() === currentWeekDate.getFullYear();
      let rowHtml = `<div class="calendar-row ${isCurrentWeek ? "current-week" : ""}">`;

      // Week Number for this row
      rowHtml += `<div class="week-cell">${weekNum}</div>`;

      // 7 Days
      for (let j = 0; j < 7; j++) {
        const isCurrentMonth = currentWeekDate.getMonth() === month;
        const dayNum = currentWeekDate.getDate();
        const fullYear = currentWeekDate.getFullYear();
        const fullMonth = currentWeekDate.getMonth() + 1; // 1-indexed for Lunar

        // Lunar Conversion
        const solar = Solar.fromYmd(fullYear, fullMonth, dayNum);
        const lunar = solar.getLunar();
        const lunarDay = String(lunar.getDay()).padStart(2, "0");
        const lunarMonth = String(lunar.getMonth()).padStart(2, "0");
        const lunarString = `${lunarDay}/${lunarMonth}`;

        // Check for holidays
        const solarKey = `${dayNum}-${fullMonth}`;
        const lunarKey = `${lunar.getDay()}-${lunar.getMonth()}`;
        const solarHoliday = solarHolidays[solarKey];
        const lunarHoliday = lunarHolidays[lunarKey];
        const holiday = solarHoliday || lunarHoliday;

        const isToday =
          new Date().toDateString() === currentWeekDate.toDateString();

        rowHtml += `
                <div class="day-cell ${isCurrentMonth ? "" : "other-month"} ${isToday ? "today" : ""} ${holiday ? "holiday" : ""}">
                    <span class="gregorian">${dayNum}</span>
                    <span class="lunar">${lunarString}</span>
                    ${holiday ? `<span class="holiday-indicator" title="${holiday}">🎉</span>` : ""}
                </div>
            `;

        // Advance day
        currentWeekDate.setDate(currentWeekDate.getDate() + 1);
      }

      rowHtml += `</div>`;
      rows.push(rowHtml);

      if (currentWeekDate.getMonth() !== month && i >= 4) {
        // Rendered enough rows
      }
    }

    html += rows.join("") + `</div>`;
    element.innerHTML = html;

    // Event Listeners
    element.querySelector("#prev-month").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      isViewingCurrentMonth = false;
      render();
    });
    element.querySelector("#next-month").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      isViewingCurrentMonth = false;
      render();
    });
    element.querySelector("#today-btn").addEventListener("click", () => {
      currentDate = new Date();
      isViewingCurrentMonth = true;
      render();
    });
  };

  render();

  // Return a refresh function for external callers (e.g. date-change handler in main.js)
  return () => {
    if (isViewingCurrentMonth) {
      currentDate = new Date();
    }
    render();
  };
}
