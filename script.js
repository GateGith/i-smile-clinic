document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Premium Restrained 3D Tilt (ONLY for Desktop Devices)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches && window.matchMedia('(hover: hover)').matches;
    if (isDesktop) {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Subtle 3-degree rotation to avoid jitter
                const rotateX = ((y - centerY) / centerY) * -3; 
                const rotateY = ((x - centerX) / centerX) * 3;
                
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // Smooth Scroll to Contact on Maps link clicked
    const mapsLinks = document.querySelectorAll('.bottom-bar-btn.maps, .hero-actions .btn-outline');
    mapsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#contact') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    
                    // Close mobile menu if it's open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });
    });

    // Scroll Reveal Fade-in
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        const animateItems = document.querySelectorAll('.service-card, .gallery-item, .contact-info, .map-container');
        animateItems.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
            observer.observe(el);
        });
    }
});
