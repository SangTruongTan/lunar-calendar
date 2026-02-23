import { Solar } from "lunar-javascript";
import { onDateChange } from "./dateChange.js";

export function initLunarDate(element) {
  // Map zodiac animals to emojis
  const zodiacEmojis = {
    鼠: "🐭", // Rat
    牛: "🐂", // Ox
    虎: "🐯", // Tiger
    兔: "🐰", // Rabbit
    龙: "🐉", // Dragon
    蛇: "🐍", // Snake
    马: "🐴", // Horse
    羊: "🐐", // Goat
    猴: "🐵", // Monkey
    鸡: "🐔", // Rooster
    狗: "🐕", // Dog
    猪: "🐷", // Pig
  };

  const render = () => {
    const now = new Date();
    const solar = Solar.fromDate(now);
    const lunar = solar.getLunar();

    // Get Chinese Zodiac for the year
    const yearZodiac = lunar.getYearShengXiao();
    const zodiacEmoji = zodiacEmojis[yearZodiac] || yearZodiac;

    // Format lunar date
    const lunarDay = String(lunar.getDay()).padStart(2, "0");
    const lunarMonth = String(lunar.getMonth()).padStart(2, "0");
    const lunarYear = lunar.getYear();

    element.innerHTML = `
            <div class="info-label">🌙 Lunar Date</div>
            <div class="info-value date-visual">
                <div class="date-day-number">${lunarDay}</div>
                <div class="date-details">
                    <div class="date-month">Month ${lunarMonth}</div>
                    <div class="date-weekday">${lunarYear} ${zodiacEmoji}</div>
                </div>
            </div>
        `;
  };

  render();

  // Re-render whenever the calendar date changes (midnight, visibility restore, etc.)
  onDateChange(render);
}
