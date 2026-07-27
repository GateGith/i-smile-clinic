document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Mobile
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

    // 2. تأثير 3D
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

    // 3. Scroll Reveal
    if ('IntersectionObserver' in window) {
        const items = document.querySelectorAll('.service-card-3d, .gallery-item-main, .gallery-item-thumb, .contact-info, .form-container');
        items.forEach(el => el.classList.add('is-hidden'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('is-hidden');
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        items.forEach(el => observer.observe(el));
    }

    // 4. زر الواتساب العائم
    const waCta = document.getElementById('waCta');
    let scrollTimeout;
    if(waCta) {
        window.addEventListener('scroll', () => {
            waCta.style.opacity = '1';
            waCta.style.transform = 'translateX(0)';
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.innerWidth > 768) {
                    waCta.style.opacity = '0.7';
                }
            }, 3000);
        });
        waCta.addEventListener('mouseenter', () => waCta.style.opacity = '1');
        waCta.addEventListener('mouseleave', () => waCta.style.opacity = '0.7');
    }

    // 5. معالج النموذج
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (form && !form.action.includes('YOUR_FORM_ID')) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            status.textContent = 'جاري الإرسال...';
            status.className = 'form-status';
            try {
                const res = await fetch(form.action, {
                    method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
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
            }
        });
    }

    // 6. زر "Lire la suite" للتقييمات (نسخة نظيفة)
    const reviewTexts = document.querySelectorAll('.review-text');
    reviewTexts.forEach(text => {
        let textContent = text.innerText;
        if (textContent.length > 130) {
            let shortText = textContent.substring(0, 130) + '...';
            let moreBtn = document.createElement('button');
            moreBtn.innerText = 'Lire la suite';
            moreBtn.className = 'read-more-btn';

            let isExpanded = false;
            moreBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                if (isExpanded) {
                    text.innerText = textContent;
                    text.appendChild(moreBtn);
                    moreBtn.innerText = 'Réduire';
                } else {
                    text.innerText = shortText;
                    text.appendChild(moreBtn);
                    moreBtn.innerText = 'Lire la suite';
                }
            });
            
            text.innerText = shortText;
            text.appendChild(moreBtn);
        }
    });
});
