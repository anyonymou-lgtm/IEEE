/* ==================================================
   PRELOADER — Video only, accelerated playback
   ---------------------------------------------------
   • Sets the video playback rate to 4/3 so a ~4s clip
     completes in ~3s.
   • Playback rate is applied as early as possible:
       – immediately (script runs while parsing),
       – again on `loadedmetadata`,
       – and again right before an explicit play().
   • The preloader is hidden on the video's `ended`
     event (primary trigger), so it disappears only
     after the animation genuinely finishes.
   • A safety-net timeout remains in place so the page
     can never get stuck if the video fails to load.
   • Locks page scroll while the preloader is visible,
     then releases it on reveal.
   ================================================== */
(function () {
    'use strict';

    const overlay = document.getElementById('preloader');
    if (!overlay) return;

    const video = document.getElementById('preloader-video');
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

    /* -------- Accelerated playback rate (4/3) -------- */
    const PLAYBACK_RATE = 4 / 3;

    function applyPlaybackRate() {
        if (!video) return;
        try {
            video.playbackRate = PLAYBACK_RATE;
        } catch (e) {
            /* Some browsers can throw if the media isn't ready yet.
               We retry on loadedmetadata / play below. */
        }
    }

    /* Apply immediately — this usually runs before the
       browser's autoplay kicks in, so the very first frame
       already plays at the accelerated speed. */
    applyPlaybackRate();

    if (video) {
        /* Re-apply once metadata is available (Safari, etc.). */
        video.addEventListener('loadedmetadata', applyPlaybackRate);

        /* Re-apply right before playback starts, in case the
           browser reset it after autoplay initialisation. */
        video.addEventListener('play', applyPlaybackRate);

        /* Primary reveal trigger: when the video finishes,
           hide the preloader — no arbitrary 3s timeout. */
        video.addEventListener('ended', revealSite);

        /* If autoplay is blocked or the video fails, reveal
           rather than keep the page hidden. */
        video.addEventListener('error', revealSite);

        /* Best-effort explicit play() to guarantee the rate
           is set right before playback on stubborn browsers. */
        const tryPlay = function () {
            applyPlaybackRate();
            if (video.paused) {
                const p = video.play();
                if (p && typeof p.catch === 'function') {
                    p.catch(function () {
                        /* Autoplay blocked — reveal the site so
                           the user isn't stuck on a frozen frame. */
                        revealSite();
                    });
                }
            }
        };

        if (video.readyState >= 1) {
            tryPlay();
        } else {
            video.addEventListener('loadedmetadata', tryPlay, { once: true });
        }
    }

    /* -------- Reduced motion: reveal quickly -------- */
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        setTimeout(revealSite, 500);
        return;
    }

    /* -------- Safety net --------
       Primary reveal is driven by the `ended` event above.
       This fallback only exists so the page can never be
       stuck behind the preloader if the video never fires
       `ended` for any reason. */
    setTimeout(revealSite, 6500);

})();
