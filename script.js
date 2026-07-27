document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
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

    // Révélation éditoriale au scroll
    if ('IntersectionObserver' in window) {
        const items = document.querySelectorAll('.service-card-geo, .gallery-item, .contact-info, .form-container');
        items.forEach(el => el.classList.add('is-hidden'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('is-hidden');
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });
        items.forEach(el => observer.observe(el));
    }

    // Formulaire
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (form && !form.action.includes('YOUR_FORM_ID')) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            status.textContent = 'Envoi en cours...';
            status.className = 'form-status';
            try {
                const res = await fetch(form.action, {
                    method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
                });
                if (res.ok) {
                    status.textContent = '✅ Demande envoyée !';
                    status.className = 'form-status success';
                    form.reset();
                } else {
                    status.textContent = '❌ Erreur.';
                    status.className = 'form-status error';
                }
            } catch { 
                status.textContent = '❌ Erreur réseau.'; 
                status.className = 'form-status error'; 
            }
        });
    }
});
