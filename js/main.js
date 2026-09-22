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
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (galleryGrid) {
        const imagePaths = [
            'assets/gallery/Iot Workshop/p1.jpg',
            'assets/gallery/Womens Day/p2.jpg',
            'assets/gallery/Iot Workshop/p3.jpg',
            'assets/gallery/Iot Workshop/p4.jpg',
            'assets/gallery/Womens Day/p5.jpg',
            'assets/gallery/Iot Workshop/p6.jpg'
        ];

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
                if (lightboxImage && lightboxCaption && lightbox) {
                    lightboxImage.src = src;
                    lightboxCaption.textContent = 'Gallery Image ' + (index + 1);
                    lightbox.classList.add('active');
                }
            });

            galleryGrid.appendChild(item);
        });
    }

    if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });

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
