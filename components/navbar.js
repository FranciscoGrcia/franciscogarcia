/**
 * navbar.js
 * Menu mobile acessível, scroll spy, navbar reactiva ao scroll,
 * scroll suave com offset e botão "voltar ao topo".
 */

import { trapFocus, lockScroll, prefersReducedMotion } from './a11y.js';

const HEADER_OFFSET = 80; // = --header-height

function throttleRAF(fn) {
    let ticking = false;
    return () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { fn(); ticking = false; });
    };
}

function scrollToY(y) {
    window.scrollTo({ top: Math.max(y, 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

function initMobileMenu() {
    const openBtn = document.getElementById('abrirMenu');
    const closeBtn = document.getElementById('fecharMenu');
    const menu = document.getElementById('mobile-menu');
    if (!openBtn || !closeBtn || !menu) return null;

    const panel = menu.querySelector('.mobile-menu__panel');
    let release = () => {};

    const isOpen = () => menu.classList.contains('is-open');

    const open = () => {
        menu.classList.add('is-open');
        menu.inert = false;
        openBtn.setAttribute('aria-expanded', 'true');
        lockScroll(true);
        release = trapFocus(panel);
        closeBtn.focus();
    };

    const close = ({ restoreFocus = true } = {}) => {
        if (!isOpen()) return;
        menu.classList.remove('is-open');
        menu.inert = true;
        openBtn.setAttribute('aria-expanded', 'false');
        lockScroll(false);
        release();
        if (restoreFocus) openBtn.focus();
    };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', () => close());
    menu.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', () => close()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // Se o ecrã crescer para desktop com o menu aberto, fecha-o.
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
        if (e.matches) close({ restoreFocus: false });
    });

    return { close };
}

function initSmoothAnchors(menu) {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const hash = anchor.getAttribute('href');
            if (!hash || hash.length < 2) return;
            const target = document.querySelector(hash);
            if (!target) return;

            e.preventDefault();
            menu?.close({ restoreFocus: false });
            scrollToY(target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
            history.pushState(null, '', hash);

            // Move o foco para o destino (acessibilidade de teclado/leitor de ecrã)
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
}

function initScrollSpy() {
    const links = document.querySelectorAll('[data-nav]');
    const ids = [...new Set([...links].map((l) => l.dataset.nav))];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const setActive = (id) => {
        links.forEach((link) => {
            const active = link.dataset.nav === id;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    };

    const observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
}

function initScrollReactiveUI() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    if (!navbar) return;

    const update = () => {
        navbar.classList.toggle('is-scrolled', window.scrollY > 24);
        backToTop?.classList.toggle('is-visible', window.scrollY > 600);
    };

    window.addEventListener('scroll', throttleRAF(update), { passive: true });
    update();

    backToTop?.addEventListener('click', () => {
        scrollToY(0);
        document.querySelector('.navbar__brand')?.focus({ preventScroll: true });
    });
}

export function initNavbar() {
    const menu = initMobileMenu();
    initSmoothAnchors(menu);
    initScrollSpy();
    initScrollReactiveUI();
}
