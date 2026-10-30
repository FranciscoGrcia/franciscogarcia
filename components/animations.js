/**
 * animations.js
 * Revela elementos ao entrar na viewport e aplica uma entrada suave às
 * imagens lazy — ambos via Intersection Observer e respeitando
 * prefers-reduced-motion.
 */

import { prefersReducedMotion } from './a11y.js';

export function initRevealOnScroll() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.style.transitionDelay = `${Number(el.dataset.revealDelay || 0)}ms`;
                el.classList.add('is-revealed');
                obs.unobserve(el);
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
}

export function initLazyImages() {
    // As imagens têm `src` real + loading="lazy" nativo: carregam mesmo sem JS.
    // Aqui só se marca o fim do carregamento para a transição de entrada.
    document.querySelectorAll('img.lazy-img').forEach((img) => {
        const done = () => img.classList.add('is-loaded');
        if (img.complete && img.naturalWidth > 0) done();
        else {
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
        }
    });
}

export function initAnimations() {
    initRevealOnScroll();
    initLazyImages();
}
