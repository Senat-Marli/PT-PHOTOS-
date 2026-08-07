document.addEventListener('DOMContentLoaded', function() {

    // Mobile nav
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // About read more / read less
    const aboutToggle = document.getElementById('aboutToggle');
    const aboutMore = document.getElementById('aboutMore');
    
    aboutToggle.addEventListener('click', () => {
        const isOpen = aboutMore.classList.toggle('open');
        aboutToggle.textContent = isOpen ? 'Read less' : 'Read more';
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn');
        const original = btn.textContent;
        btn.textContent = 'Sent!';
        btn.style.background = '#333';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            contactForm.reset();
        }, 2500);
    });

});
