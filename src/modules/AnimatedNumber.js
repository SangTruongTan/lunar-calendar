export class AnimatedClockNumber {
  /**
   * @param {HTMLElement} element - The container element for this digit
   * @param {string} initialValue - The initial value to display
   * @param {Object} options - Configuration options
   * @param {number} options.duration - Animation duration in ms (default: 400)
   */
  constructor(element, initialValue, { duration = 400 } = {}) {
    this.container = element;
    this.value = initialValue;
    this.isAnimating = false;
    this.animationCleaner = null;

    // Set up the DOM structure
    this.container.classList.add("ticker-wrapper");
    this.container.style.setProperty("--ticker-duration", `${duration}ms`);

    this.track = document.createElement("div");
    this.track.classList.add("ticker-track");
    this.container.appendChild(this.track);

    // Create the initial value
    this.addValueToTrack(initialValue);
  }

  /**
   * Helper to append a digit to the track
   * @param {string} val
   */
  addValueToTrack(val) {
    const div = document.createElement("div");
    div.classList.add("ticker-value");
    div.textContent = val;
    this.track.appendChild(div);
  }

  /**
   * Cleans up any active animation wrapper state
   */
  cleanupAnimation() {
    if (this.animationCleaner) {
      this.animationCleaner();
      this.animationCleaner = null;
    }
  }

  /**
   * Updates the value.
   * @param {string} newValue
   * @param {Object} options
   * @param {boolean} options.animate - Whether to animate the transition
   */
  update(newValue, { animate = true } = {}) {
    // If value hasn't changed, do nothing
    if (newValue === this.value) return;

    // If we are currently animating, we must interrupt it to prevent corruption.
    // Or if animate=false (e.g. visibility restore), we snap instantly.
    if (this.isAnimating || !animate) {
      this.cleanupAnimation();

      // Hard reset to the new value instantly
      this.track.innerHTML = "";
      this.addValueToTrack(newValue);
      this.track.classList.remove("animating");
      this.track.style.transform = "translateY(0)";

      this.value = newValue;
      this.isAnimating = false;

      // If we were told NOT to animate, we are done.
      // If we WERE told to animate but we interrupted, strictly speaking
      // we could just snap to the new value (which is what we just did).
      // Trying to animate from a mid-state is complex and prone to errors.
      // Snapping to the *latest* correct time is the safest recovery.
      return;
    }

    // --- Standard Animation Path --- //

    // 1. Prepare DOM: [Current, Next]
    this.addValueToTrack(newValue);

    // 2. Trigger reflow to ensure browser registers the new DOM state before sliding
    void this.track.offsetHeight;

    // 3. Start Animation
    this.isAnimating = true;
    this.track.classList.add("animating");
    this.track.style.transform = "translateY(-50%)";

    // 4. Cleanup Logic
    const onTransitionEnd = () => {
      // Only run if we are still the active animation
      if (!this.isAnimating) return;

      this.track.classList.remove("animating");

      // Remove the old value (first child)
      if (this.track.firstElementChild) {
        this.track.firstElementChild.remove();
      }

      this.track.style.transform = "translateY(0)";
      this.value = newValue;
      this.isAnimating = false;
      this.animationCleaner = null;
    };

    this.track.addEventListener("transitionend", onTransitionEnd, {
      once: true,
    });

    // Store cleaner in case we need to abort
    this.animationCleaner = () => {
      this.track.removeEventListener("transitionend", onTransitionEnd);
      // The rest of the DOM cleanup happens in the if(isAnimating) block above
    };
  }
}
