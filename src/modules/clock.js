import { AnimatedClockNumber } from "./AnimatedNumber.js";

export function initClock(element) {
  // Render the static structure once
  element.innerHTML = `
    <div class="info-label">🕐 Clock</div>
    <div class="clock-visual">
      <div class="time-large">
        <div id="clock-hours" class="digit-group"></div>
        <span class="time-separator">:</span>
        <div id="clock-minutes" class="digit-group"></div>
        <span class="time-separator pulse">:</span>
        <div id="clock-seconds" class="digit-group"></div>
      </div>
      <div class="time-labels">
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
    </div>
  `;

  // Select the containers
  const hoursGroup = element.querySelector("#clock-hours");
  const minutesGroup = element.querySelector("#clock-minutes");
  const secondsGroup = element.querySelector("#clock-seconds");

  // Helper to create 2 digit slots in a group
  const createSlots = (group) => {
    const slot1 = document.createElement("div");
    const slot2 = document.createElement("div");
    group.appendChild(slot1);
    group.appendChild(slot2);
    return [slot1, slot2];
  };

  const [h1, h2] = createSlots(hoursGroup);
  const [m1, m2] = createSlots(minutesGroup);
  const [s1, s2] = createSlots(secondsGroup);

  // Helper to get time parts as separated digits
  const getParts = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    return {
      h1: h[0],
      h2: h[1],
      m1: m[0],
      m2: m[1],
      s1: s[0],
      s2: s[1],
    };
  };

  // Initialize with current time
  const t = getParts();

  const anims = {
    h1: new AnimatedClockNumber(h1, t.h1),
    h2: new AnimatedClockNumber(h2, t.h2),
    m1: new AnimatedClockNumber(m1, t.m1),
    m2: new AnimatedClockNumber(m2, t.m2),
    s1: new AnimatedClockNumber(s1, t.s1),
    s2: new AnimatedClockNumber(s2, t.s2),
  };

  /**
   * Master Update Function
   * @param {boolean} animate - Whether to animate the update (default true)
   */
  const tick = (animate = true) => {
    const now = getParts();
    anims.h1.update(now.h1, { animate });
    anims.h2.update(now.h2, { animate });
    anims.m1.update(now.m1, { animate });
    anims.m2.update(now.m2, { animate });
    anims.s1.update(now.s1, { animate });
    anims.s2.update(now.s2, { animate });
  };

  // --- Scheduler Logic ---

  // 1. Safe Interval for ticking
  // We use standard setInterval but we always derive state from Date() inside tick()
  // which solves the drift.
  const timer = setInterval(() => tick(true), 1000);

  // 2. Visibility Handler for fast-forward prevention
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Optional: Pause interval to save resources, but purely deriving from Date is enough safety.
      // However, stopping it prevents a queue of callbacks if the browser throttles weirdly.
      // But standard throttle just slows down the callback rate.
      // We will let it run, but when we come back, we FORCE a sync.
    } else {
      // User returned to tab.
      // 1. Immediately force screen to show correct time WITHOUT animation
      //    (This prevents the "fast forward" effect of catching up animations)
      tick(false);

      // 2. We don't need to restart interval if we didn't clear it.
      //    The next interval tick will just proceed normally from this new state.
    }
  });

  // Initial alignment (Wait for the next second boundary to start the interval)
  const now = new Date();
  const delay = 1000 - now.getMilliseconds();

  setTimeout(() => {
    tick(true); // First real tick
    // Note: The timer variable above was defined early but only starts here?
    // Actually the logic above started it immediately. Let's fix the startup.
    // We should clear the initial timer and start a synchronized one.
    clearInterval(timer);
    setInterval(() => tick(true), 1000);
  }, delay);
}
