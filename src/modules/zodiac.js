import { Solar } from 'lunar-javascript';

export function initZodiac(element) {
    // Map zodiac animals to emojis
    const zodiacEmojis = {
        '鼠': '🐭', // Rat
        '牛': '🐂', // Ox
        '虎': '🐯', // Tiger
        '兔': '🐰', // Rabbit
        '龙': '🐉', // Dragon
        '蛇': '🐍', // Snake
        '马': '🐴', // Horse
        '羊': '🐐', // Goat
        '猴': '🐵', // Monkey
        '鸡': '🐔', // Rooster
        '狗': '🐕', // Dog
        '猪': '🐷', // Pig
    };

    const render = () => {
        const now = new Date();
        const solar = Solar.fromDate(now);
        const lunar = solar.getLunar();

        // Get Chinese Zodiac for the year
        const yearZodiac = lunar.getYearShengXiao();
        const zodiacEmoji = zodiacEmojis[yearZodiac] || yearZodiac;

        element.innerHTML = `
            <div class="zodiac-display">
                <div class="zodiac-label">Zodiac</div>
                <div class="zodiac-value">${zodiacEmoji}</div>
            </div>
        `;
    };

    render();
    // Update daily at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow - now;
    setTimeout(() => {
        render();
        setInterval(render, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
}
