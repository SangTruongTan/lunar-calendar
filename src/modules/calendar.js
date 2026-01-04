import { Solar } from 'lunar-javascript';

export function initCalendar(element) {
    let currentDate = new Date();

    // Helper: Get ISO Week Number
    const getWeekNumber = (d) => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
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

        const monthName = firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        let html = `
      <div class="calendar-header-controls">
        <button id="prev-month" class="nav-btn">&larr;</button>
        <h2>${monthName}</h2>
        <button id="next-month" class="nav-btn">&rarr;</button>
      </div>
      <div class="calendar-grid-header">
        <div class="week-col-header">Wk</div>
        <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
      </div>
      <div class="calendar-grid-body">
    `;

        // Fill grid
        // We need 6 rows to be safe? Or dynamic.
        // Logic: calculate start padding.

        let dayCount = 1;
        let rows = [];
        let currentWeekDate = new Date(year, month, 1 - startDayOfWeek); // Start date of the first week row

        // Generate maximum 6 rows (42 cells) to cover all possibilities
        for (let i = 0; i < 6; i++) {
            let rowHtml = `<div class="calendar-row">`;

            // Week Number for this row
            const weekNum = getWeekNumber(new Date(currentWeekDate));
            rowHtml += `<div class="week-cell">${weekNum}</div>`;

            // 7 Days
            for (let j = 0; j < 7; j++) {
                // Iterate days
                // Check if currentWeekDate is within current month or padding
                const isCurrentMonth = currentWeekDate.getMonth() === month;
                const dayNum = currentWeekDate.getDate();
                const fullYear = currentWeekDate.getFullYear();
                const fullMonth = currentWeekDate.getMonth() + 1; // 1-indexed for Lunar

                // Lunar Conversion
                const solar = Solar.fromYmd(fullYear, fullMonth, dayNum);
                const lunar = solar.getLunar();
                // Latin Format: Month/Day
                const lunarString = `${lunar.getMonth()}/${lunar.getDay()}`;

                const isToday = new Date().toDateString() === currentWeekDate.toDateString();

                rowHtml += `
                <div class="day-cell ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}">
                    <span class="gregorian">${dayNum}</span>
                    <span class="lunar">${lunarString}</span>
                </div>
            `;

                // Advance day
                currentWeekDate.setDate(currentWeekDate.getDate() + 1);
            }

            rowHtml += `</div>`;
            rows.push(rowHtml);

            // If we processed all days in month and reached end of week, break? 
            // Actually simplest is just always render 6 rows or check if currentWeekDate > lastDayOfMonth + remainder
            if (currentWeekDate.getMonth() !== month && i >= 4) {
                // If we are in next month and have rendered at least 5 rows (index 4), we might be done.
                // But simpler to just fixed 6 rows for stability
            }
        }

        html += rows.join('') + `</div>`;
        element.innerHTML = html;

        // Event Listeners
        element.querySelector('#prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            render();
        });
        element.querySelector('#next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            render();
        });
    };

    render();
}
