/* ==================================================
   PRELOADER — Seamless video version
   ---------------------------------------------------
   • Keeps the existing reveal timing (FADE_START 3200ms)
     and the existing safety timeout (6500ms).
   • Adds a scroll-lock class on <html> while the
     preloader is visible, then removes it on reveal,
     so the underlying page never shows a scrollbar
     behind the fixed overlay.
   • No changes to any other site behaviour.
   ================================================== */
(function () {
    'use strict';

    const overlay = document.getElementById('preloader');
    if (!overlay) return;

    const brandEl   = overlay.querySelector('.preloader-brand');
    const taglineEl = overlay.querySelector('.preloader-tagline');
    const heroContent = document.querySelector('.hero-content');

    /* Lock the page scroll while the preloader is up.
       This prevents a scrollbar / gutter from appearing
       behind the fixed overlay. */
    document.documentElement.classList.add('preloader-active');

    let revealed = false;

    function revealSite() {
        if (revealed) return;
        revealed = true;

        overlay.classList.add('fade-out');
        if (heroContent) heroContent.classList.add('hero-ready');

        /* After the CSS opacity transition completes,
           hide the overlay and release the scroll lock. */
        setTimeout(function () {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
            document.documentElement.classList.remove('preloader-active');
        }, 550);
    }

    /* -------------------------------------------------
       Reduced motion: reveal quickly, no long animation
    ------------------------------------------------- */
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        if (brandEl)   brandEl.classList.add('visible');
        if (taglineEl) taglineEl.classList.add('visible');
        setTimeout(revealSite, 500);
        return;
    }

    /* -------------------------------------------------
       Text fade-in (kept from the original preloader)
    ------------------------------------------------- */
    setTimeout(function () {
        if (brandEl) brandEl.classList.add('visible');
    }, 500);

    setTimeout(function () {
        if (taglineEl) taglineEl.classList.add('visible');
    }, 800);

    /* -------------------------------------------------
       Reveal the site after the same delay as before.
       (Original FADE_START = 3200ms — unchanged.)
    ------------------------------------------------- */
    const FADE_START = 3200;
    setTimeout(revealSite, FADE_START);

    /* -------------------------------------------------
       Safety net — never leave the page hidden.
       (Original 6500ms — unchanged.)
    ------------------------------------------------- */
    setTimeout(revealSite, 6500);

})();
