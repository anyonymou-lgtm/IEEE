document.addEventListener("DOMContentLoaded", () => {
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const galleryGrid = document.getElementById('gallery-grid');

    if (galleryGrid) {
        const imagePaths = [
            'assets/gallery/Iot Workshop/p1.avif',
            'assets/gallery/Womens Day/p2.avif',
            'assets/gallery/Iot Workshop/p3.avif',
            'assets/gallery/Iot Workshop/p4.avif',
            'assets/gallery/Womens Day/p5.avif',
            'assets/gallery/Iot Workshop/p6.avif'
        ];

        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxContent = document.querySelector('.lightbox-content');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');

        const backdropLayers = [
            document.getElementById('lightbox-backdrop-a'),
            document.getElementById('lightbox-backdrop-b')
        ];

        let backdropIndex = 0;
        let currentIndex = 0;

        imagePaths.forEach((src, index) => {
            const item = document.createElement('div');
            item.classList.add('gallery-item', 'stagger-item');
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Gallery Image ' + (index + 1);
            img.loading = 'lazy';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            item.appendChild(img);

            item.addEventListener('click', () => {
                openLightbox(index);
            });

            galleryGrid.appendChild(item);
        });

        function setBackdrop(src) {
            if (!backdropLayers[0] || !backdropLayers[1]) return;

            const current = backdropLayers[backdropIndex];
            const next = backdropLayers[1 - backdropIndex];

            next.style.backgroundImage = 'url("' + src + '")';

            void next.offsetWidth;

            next.classList.add('active');
            current.classList.remove('active');

            backdropIndex = 1 - backdropIndex;
        }

        function showImageAt(index) {
            if (!imagePaths.length) return;

            const total = imagePaths.length;
            currentIndex = ((index % total) + total) % total;

            const src = imagePaths[currentIndex];
            lightboxImage.src = src;
            lightboxCaption.textContent = 'Gallery Image ' + (currentIndex + 1);

            setBackdrop(src);

            lightboxImage.classList.remove('lb-switch');
            void lightboxImage.offsetWidth;
            lightboxImage.classList.add('lb-switch');
        }

        function openLightbox(index) {
            if (!lightbox) return;
            showImageAt(index);
            lightbox.classList.add('active');
        }

        function closeLightbox() {
            if (!lightbox) return;
            lightbox.classList.remove('active');
        }

        function nextImage() {
            showImageAt(currentIndex + 1);
        }

        function prevImage() {
            showImageAt(currentIndex - 1);
        }

        if (lightboxClose && lightbox) {
            lightboxClose.addEventListener('click', closeLightbox);

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!lightbox || !lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevImage();
            }
        });

        (function () {
            if (!lightboxContent || !lightbox) return;

            const SWIPE_THRESHOLD = 30;
            const SWIPE_MAX_TIME = 800;

            let startX = 0;
            let startY = 0;
            let startTime = 0;
            let tracking = false;

            lightboxContent.addEventListener('touchstart', function (e) {
                if (e.touches.length !== 1) return;
                if (e.target.closest('.lightbox-close')) return;

                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
                tracking = true;
            }, { passive: true });

            lightboxContent.addEventListener('touchend', function (e) {
                if (!tracking) return;
                tracking = false;

                if (!lightbox.classList.contains('active')) return;
                if (!e.changedTouches.length) return;

                const dx = e.changedTouches[0].clientX - startX;
                const dy = e.changedTouches[0].clientY - startY;
                const dt = Date.now() - startTime;

                if (dt > SWIPE_MAX_TIME) return;
                if (Math.abs(dx) < Math.abs(dy)) return;
                if (Math.abs(dx) < SWIPE_THRESHOLD) return;

                if (dx < 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }, { passive: true });

            lightboxContent.addEventListener('touchcancel', function () {
                tracking = false;
            }, { passive: true });
        })();
    }

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .stagger-item');

    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

});
