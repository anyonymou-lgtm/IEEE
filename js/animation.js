/* ==================================================
   PRELOADER — Video version
   - Replaces the previous SVG animation with a simple
     video background.
   - Keeps the same reveal timing and logic.
   ================================================== */
(function () {
    'use strict';

    const overlay = document.getElementById('preloader');
    if (!overlay) return;

    const brandEl = overlay.querySelector('.preloader-brand');
    const taglineEl = overlay.querySelector('.preloader-tagline');
    const heroContent = document.querySelector('.hero-content');

    let revealed = false;

    function revealSite() {
        if (revealed) return;
        revealed = true;
        overlay.classList.add('fade-out');
        if (heroContent) heroContent.classList.add('hero-ready');
        setTimeout(function () {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
        }, 550);
    }

    /* -------------------------------------------------
       Reduced motion: reveal quickly without waiting
    ------------------------------------------------- */
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        if (brandEl) brandEl.classList.add('visible');
        if (taglineEl) taglineEl.classList.add('visible');
        setTimeout(revealSite, 500);
        return;
    }

    /* -------------------------------------------------
       Text fade‑in (kept from original)
    ------------------------------------------------- */
    setTimeout(() => {
        if (brandEl) brandEl.classList.add('visible');
    }, 500);

    setTimeout(() => {
        if (taglineEl) taglineEl.classList.add('visible');
    }, 800);

    /* -------------------------------------------------
       Reveal the site after the same duration as before
       (original fadeStart was 3200 ms)
    ------------------------------------------------- */
    const FADE_START = 3200;
    setTimeout(revealSite, FADE_START);

    /* -------------------------------------------------
       Safety net — never leave the page hidden
    ------------------------------------------------- */
    setTimeout(revealSite, 6500);

})();
