/* ==================================================
   PRELOADER — Video logo overlay
   ---------------------------------------------------
   Plays `assets/logo.mp4` once, muted, autoplay, inline.
   When the video fires its `ended` event, the overlay
   fades out and the (already-rendered) site is revealed
   by adding `.hero-ready` to the hero content.

   Robustness:
     • If the video cannot autoplay (blocked / unsupported),
       we still reveal the site after a short fallback delay.
     • If the video fails to load, we reveal the site
       immediately.
     • Scrolling is locked while the overlay is visible and
       restored as soon as it is removed.
     • The overlay is fully removed from the DOM flow after
       the fade (`display: none`) so it never blocks clicks.
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
           Prevent scrolling while the preloader is active.
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
        var MAX_WAIT_MS = 15000; /* 15s upper bound */
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
           If the video errors out (network / codec), reveal
           the site right away instead of getting stuck.
        ------------------------------------------------- */
        video.addEventListener('error', function () {
            clearSafety();
            revealSite();
        }, { once: true });

        /* -------------------------------------------------
           Try to start playback. Some browsers block autoplay
           for various reasons; if `play()` rejects, we still
           let the safety timer handle the reveal, but also
           reveal earlier so users are not left waiting.
        ------------------------------------------------- */
        var playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise
                .then(function () {
                    /* Autoplay started — nothing to do; wait for
                       the `ended` event to reveal the site. */
                })
                .catch(function () {
                    /* Autoplay failed; reveal the site so the user
                       is not stuck behind the preloader. */
                    clearSafety();
                    revealSite();
                });
        }

        /* -------------------------------------------------
           Fail-safe: if for any reason the `ended` event never
           fires (e.g. video paused mid-way), watch for the
           video element to become hidden and reveal.
        ------------------------------------------------- */
        video.addEventListener('pause', function () {
            /* If the video is paused while we are still on the
               preloader, treat it as an early exit. */
            if (!revealed && video.currentTime > 0 && !video.seeking) {
                clearSafety();
                revealSite();
            }
        });
    });
})();
