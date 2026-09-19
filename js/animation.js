/* ==================================================
   PRELOADER — Video only
   ---------------------------------------------------
   • Keeps the existing reveal timing
     (FADE_START = 3200ms, safety = 6500ms).
   • Locks page scroll while the preloader is visible,
     then releases it on reveal.
   • NO SVG animation logic.
   • NO reference to any old text / logo elements.
   ================================================== */
(function () {
    'use strict';

    const overlay = document.getElementById('preloader');
    if (!overlay) return;

    const heroContent = document.querySelector('.hero-content');

    /* Lock scroll while the preloader is up. */
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

    /* Reduced motion: reveal quickly. */
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        setTimeout(revealSite, 500);
        return;
    }

    /* Same reveal timing as before — unchanged. */
    const FADE_START = 3200;
    setTimeout(revealSite, FADE_START);

    /* Safety net — never leave the page hidden. */
    setTimeout(revealSite, 6500);

})();
