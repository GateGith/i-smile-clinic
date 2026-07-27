document.addEventListener('DOMContentLoaded', () => {
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

    // Reveal Scroll (No failures if JS breaks)
    if ('IntersectionObserver' in window) {
        const revealItems = document.querySelectorAll('.service-card, .gallery-item, .contact-info, .form-container');
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

    // Formspree logic
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (contactForm && !contactForm.action.includes('YOUR_FORM_ID')) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Envoi en cours...';
            formStatus.className = 'form-status';
            const data = Object.fromEntries(new FormData(contactForm).entries());
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    formStatus.textContent = '✅ Demande envoyée !';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = '❌ Erreur, veuillez réessayer.';
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.textContent = '❌ Erreur réseau.';
                formStatus.className = 'form-status error';
            }
        });
    }
});
