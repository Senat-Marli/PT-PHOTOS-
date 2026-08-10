document.addEventListener('DOMContentLoaded', function() {

    /* ─── Mobile nav ─── */
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ─── About: read more / read less ─── */
    const aboutToggle = document.getElementById('aboutToggle');
    const aboutMore   = document.getElementById('aboutMore');

    if (aboutToggle && aboutMore) {
        aboutToggle.addEventListener('click', () => {
            const isOpen = aboutMore.classList.toggle('open');
            aboutToggle.textContent = isOpen ? 'Read less' : 'Read more';
        });
    }

    /* ─── About: click to enlarge photo ─── */
    const aboutPhoto = document.querySelector('.about-photo');

    if (aboutPhoto) {
        aboutPhoto.addEventListener('click', (e) => {
            e.stopPropagation();
            aboutPhoto.classList.toggle('expanded');
        });

        document.addEventListener('click', (e) => {
            if (aboutPhoto.classList.contains('expanded') && !aboutPhoto.contains(e.target)) {
                aboutPhoto.classList.remove('expanded');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') aboutPhoto.classList.remove('expanded');
        });
    }

    /* ─── Smooth scroll ─── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ─── Portfolio: drag-to-scroll ─── */
    const portfolioScroll = document.getElementById('portfolioScroll');
    if (portfolioScroll) {
        let isDown = false, startX, scrollLeft;

        portfolioScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            portfolioScroll.classList.add('dragging');
            startX = e.pageX - portfolioScroll.offsetLeft;
            scrollLeft = portfolioScroll.scrollLeft;
        });

        portfolioScroll.addEventListener('mouseleave', () => {
            isDown = false;
            portfolioScroll.classList.remove('dragging');
        });

        portfolioScroll.addEventListener('mouseup', () => {
            isDown = false;
            portfolioScroll.classList.remove('dragging');
        });

        portfolioScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - portfolioScroll.offsetLeft;
            const walk = (x - startX) * 1.5;
            portfolioScroll.scrollLeft = scrollLeft - walk;
        });
    }

    /* ─── Date validation: block past dates ─── */
    const weddingDate = document.getElementById('weddingDate');
    let todayDate;

    function setMinDate() {
        if (!weddingDate) return;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        todayDate = now;
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        weddingDate.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    }
    setMinDate();

    function isPastDate(dateString) {
        if (!dateString) return false;
        const selected = new Date(dateString + 'T00:00:00');
        return selected < todayDate;
    }

    function shakeInput(input) {
        input.style.borderColor = '#ff4444';
        input.style.transition = 'border-color 0.3s ease';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 1500);
    }

    if (weddingDate) {
        // При ручном вводе или выборе
        weddingDate.addEventListener('change', function() {
            if (isPastDate(this.value)) {
                this.value = '';
                shakeInput(this);
            }
        });

        // Защита от копипасты и автозаполнения
        weddingDate.addEventListener('input', function() {
            if (isPastDate(this.value)) {
                this.value = '';
                shakeInput(this);
            }
        });
    }

    /* ─── Contact form ─── */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверка даты перед отправкой
            if (weddingDate && isPastDate(weddingDate.value)) {
                weddingDate.value = '';
                shakeInput(weddingDate);
                weddingDate.focus();
                return;
            }

            const btn = contactForm.querySelector('.btn');
            const original = btn.textContent;

            btn.textContent = 'Sent!';
            btn.style.background = '#333';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 2500);
        });
    }

    /* ─── Scroll reveal ─── */
    const revealElements = document.querySelectorAll('.about, .portfolio, .packages, .contact');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        revealObserver.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .revealed { opacity: 1 !important; transform: translateY(0) !important; }
        .portfolio-scroll.dragging { cursor: grabbing; }
        .portfolio-scroll.dragging .portfolio-item img { pointer-events: none; }
    `;
    document.head.appendChild(style);

});
