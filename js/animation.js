/* ==================================================
   PRELOADER — Video logo overlay
   ---------------------------------------------------
   Plays `assets/logo.mp4` once, muted, autoplay, inline.
   When the video fires its `ended` event, the overlay
   fades out and the site is revealed.

   Robustness:
     • If the video cannot autoplay (blocked / unsupported),
       the site is still revealed so the user is never stuck.
     • If the video fails to load, the site is revealed.
     • Scrolling is locked while the overlay is visible and
       restored as soon as it is removed.
     • The overlay is set to `display: none` after the fade
       so it never blocks clicks.
================================================== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var preloader = document.getElementById('preloader');
        var video = document.getElementById('preloader-video');
        var heroContent = document.querySelector('.hero-content');

        /* -------------------------------------------------
           If the preloader markup is missing entirely,
           just reveal the site.
        ------------------------------------------------- */
        if (!preloader) {
            if (heroContent) heroContent.classList.add('hero-ready');
            return;
        }

        /* -------------------------------------------------
           Lock scrolling while the preloader is active.
        ------------------------------------------------- */
        var previousBodyOverflow = document.body.style.overflow;
        var previousHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        /* -------------------------------------------------
           Idempotent reveal — safe to call multiple times.
        ------------------------------------------------- */
        var revealed = false;
        var FADE_DURATION = 600;

        function revealSite() {
            if (revealed) return;
            revealed = true;

            /* Fade the overlay out */
            preloader.classList.add('fade-out');

            /* Reveal the hero content (existing mechanism) */
            if (heroContent) heroContent.classList.add('hero-ready');

            /* Restore scrolling */
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;

            /* Fully remove the preloader once the fade completes */
            window.setTimeout(function () {
                preloader.classList.add('is-hidden');
                preloader.setAttribute('aria-hidden', 'true');
            }, FADE_DURATION);
        }

        /* -------------------------------------------------
           Safety net — if anything goes wrong (video stuck,
           no ended event, unsupported codec, etc.), reveal
           the site after a maximum timeout.
        ------------------------------------------------- */
        var MAX_WAIT_MS = 15000;
        var safetyTimer = window.setTimeout(revealSite, MAX_WAIT_MS);

        function clearSafety() {
            if (safetyTimer) {
                window.clearTimeout(safetyTimer);
                safetyTimer = null;
            }
        }

        /* -------------------------------------------------
           If the video element is missing, reveal immediately.
        ------------------------------------------------- */
        if (!video) {
            clearSafety();
            revealSite();
            return;
        }

        /* -------------------------------------------------
           Video finished — reveal the site.
        ------------------------------------------------- */
        video.addEventListener('ended', function () {
            clearSafety();
            revealSite();
        }, { once: true });

        /* -------------------------------------------------
           If the video errors out (network / codec / missing
           file), reveal the site instead of getting stuck.
        ------------------------------------------------- */
        video.addEventListener('error', function () {
            clearSafety();
            revealSite();
        }, { once: true });

        /* -------------------------------------------------
           Try to start playback. Some browsers block autoplay;
           if `play()` rejects, reveal so users are not stuck.
        ------------------------------------------------- */
        var playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(function () {
                clearSafety();
                revealSite();
            });
        }

        /* -------------------------------------------------
           Fail-safe: if the video pauses mid-way while we are
           still on the preloader, treat it as an early exit.
        ------------------------------------------------- */
        video.addEventListener('pause', function () {
            if (!revealed && video.currentTime > 0 && !video.seeking) {
                clearSafety();
                revealSite();
            }
        });
    });
})();
