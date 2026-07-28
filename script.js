document.addEventListener('DOMContentLoaded', () => {
    // Navigation mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mainContent = document.getElementById('main-content');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            const icon = navToggle.querySelector('i');
            if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            
            // Focus trap for accessibility
            if (isOpen) {
                const firstLink = navMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            } else {
                navToggle.focus();
            }
        });
        
        // Close menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                navToggle.focus();
            }
        });
        
        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    // Services 3D hover (desktop only)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isDesktop && !reduceMotion) {
        const cards = document.querySelectorAll('.service-card-3d');
        cards.forEach(card => {
            let ticking = false;
            
            card.addEventListener('mousemove', (e) => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = ((y - centerY) / centerY) * -2.5;
                        const rotateY = ((x - centerX) / centerX) * 2.5;
                        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // Reveal on scroll
    const revealItems = document.querySelectorAll('.service-card-3d, .gallery-item-main, .gallery-item-thumb, .contact-info, .form-container');
    
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(el => {
            el.classList.remove('is-hidden');
            el.classList.add('is-visible');
        });
    } else {
        revealItems.forEach(el => el.classList.add('is-hidden'));
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('is-hidden');
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        revealItems.forEach(el => observer.observe(el));
    }

    // Floating WhatsApp CTA
    const waCta = document.getElementById('waCta');
    if (waCta) {
        let hideTimer;
        const showCta = () => {
            waCta.style.opacity = '1';
            waCta.style.transform = 'translateX(0)';
        };
        const dimCta = () => {
            if (window.innerWidth > 768) waCta.style.opacity = '0.7';
        };
        showCta();
        window.addEventListener('scroll', () => {
            showCta();
            clearTimeout(hideTimer);
            hideTimer = setTimeout(dimCta, 3000);
        }, { passive: true });
        waCta.addEventListener('mouseenter', () => waCta.style.opacity = '1');
        waCta.addEventListener('mouseleave', dimCta);
    }

    // Form handling - Formspree
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    
    if (form && status) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (submitBtn) submitBtn.disabled = true;
            status.textContent = 'Envoi en cours...';
            status.className = 'form-status';
            
            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form)
                });
                
                if (res.ok) {
                    status.textContent = '✅ Votre demande a bien été envoyée. Nous vous contacterons rapidement.';
                    status.className = 'form-status success';
                    form.reset();
                } else {
                    status.textContent = '❌ Une erreur est survenue. Veuillez réessayer.';
                    status.className = 'form-status error';
                }
            } catch {
                status.textContent = '❌ Erreur réseau. Veuillez vérifier votre connexion et réessayer.';
                status.className = 'form-status error';
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // Review text expand/collapse
    const reviewTexts = document.querySelectorAll('.review-text');
    reviewTexts.forEach(text => {
        const full = text.innerText.trim();
        if (full.length > 130) {
            const shortText = full.substring(0, 130) + '...';
            const moreBtn = document.createElement('button');
            moreBtn.type = 'button';
            moreBtn.innerText = 'Lire la suite';
            moreBtn.className = 'read-more-btn';
            moreBtn.setAttribute('aria-expanded', 'false');
            let isExpanded = false;
            
            const render = () => {
                text.innerText = isExpanded ? full : shortText;
                text.appendChild(moreBtn);
                moreBtn.innerText = isExpanded ? 'Réduire' : 'Lire la suite';
                moreBtn.setAttribute('aria-expanded', String(isExpanded));
            };
            
            moreBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                render();
            });
            
            render();
        }
    });
});
