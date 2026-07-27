document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            const icon = navToggle.querySelector('i');
            if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        });
    }

    // 2. Subtle 3D Hover Tilt (Desktop only)
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
                const rotateX = ((y - centerY) / centerY) * -2;
                const rotateY = ((x - centerX) / centerX) * 2;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // 3. Scroll Reveal - FIXED (Catastrophic failure avoided)
    if ('IntersectionObserver' in window) {
        const revealItems = document.querySelectorAll('.service-card, .gallery-item, .contact-info, .form-container');
        
        // Set initial hidden state visually via class
        revealItems.forEach(el => el.classList.add('is-hidden'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('is-hidden');
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealItems.forEach(el => observer.observe(el));
    }
    
    // 4. Contact Form Submission (Formspree)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Only run if the action attribute is actually set (not empty or placeholder)
    if (contactForm && contactForm.action && !contactForm.action.includes('YOUR_FORM_ID')) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if(!formStatus) return;
            
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
                    formStatus.textContent = '❌ Erreur lors de l\'envoi. Veuillez réessayer ou nous appeler directement.';
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.textContent = '❌ Erreur réseau. Veuillez réessayer plus tard.';
                formStatus.className = 'form-status error';
            }
        });
    } else {
        console.warn("Formspree ID not set. Add your ID to the 'action' attribute.");
    }
});
