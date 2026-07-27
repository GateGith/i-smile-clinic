document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            const icon = navToggle.querySelector('i');
            if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        });
    }

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
        const cards = document.querySelectorAll('.service-card-3d');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -2.5;
                const rotateY = ((x - centerX) / centerX) * 2.5;
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (form && status) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            status.textContent = 'جاري الإرسال...';
            status.className = 'form-status';
            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form)
                });
                if (res.ok) {
                    status.textContent = '✅ تم إرسال الطلب بنجاح! سنتصل بك قريباً.';
                    status.className = 'form-status success';
                    form.reset();
                } else {
                    status.textContent = '❌ حدث خطأ أثناء الإرسال.';
                    status.className = 'form-status error';
                }
            } catch {
                status.textContent = '❌ خطأ في الشبكة. يرجى المحاولة لاحقاً.';
                status.className = 'form-status error';
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

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
