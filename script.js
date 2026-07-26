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

    // Subtle 3D Hover Tilt (Only enabled on Desktop to save mobile battery/performance)
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
                // Subtle 2-degree rotation, ensuring jitter-free smoothness
                const rotateX = ((y - centerY) / centerY) * -2; 
                const rotateY = ((x - centerX) / centerX) * 2;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // Contact Form Submission (Formspree)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page reload
            formStatus.textContent = 'Envoi en cours...';
            formStatus.className = 'form-status';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    formStatus.textContent = '✅ Demande envoyée avec succès ! Nous vous recontacterons rapidement.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = '❌ Erreur lors de l\'envoi. Veuillez réessayer ou appeler directement.';
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.textContent = '❌ Erreur réseau. Veuillez réessayer plus tard.';
                formStatus.className = 'form-status error';
            }
        });
    }

    // Scroll Reveal (Parallax-like Entrance)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        const animateItems = document.querySelectorAll('.service-card, .gallery-item, .contact-info, .form-container');
        animateItems.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(25px)';
            el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }
});
