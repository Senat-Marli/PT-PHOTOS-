/* ============================================
   PT Photos — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    /* ─── Mobile nav ─── */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
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
    }

    /* ─── Smooth scroll ─── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ─── FAQ Accordion ─── */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            // Open clicked if wasn't active
            if (!isActive) item.classList.add('active');
        });
    });

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
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
    }

    if (weddingDate) {
        weddingDate.addEventListener('change', function() {
            if (isPastDate(this.value)) { this.value = ''; shakeInput(this); }
        });
        weddingDate.addEventListener('input', function() {
            if (isPastDate(this.value)) { this.value = ''; shakeInput(this); }
        });
    }

    /* ─── Contact forms (Web3Forms) ─── */
    const forms = document.querySelectorAll('form[data-form]');
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (weddingDate && isPastDate(weddingDate.value)) {
                weddingDate.value = ''; shakeInput(weddingDate); weddingDate.focus(); return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const formData = new FormData(form);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    btn.textContent = 'Sent!';
                    btn.style.background = '#333';
                    setTimeout(() => {
                        btn.textContent = original;
                        btn.style.background = '';
                        btn.disabled = false;
                        form.reset();
                    }, 2500);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                btn.textContent = 'Error. Try again.';
                btn.style.background = '#ff4444';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    });

    /* ─── Scroll reveal ─── */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ─── Navbar scroll effect ─── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }
});
