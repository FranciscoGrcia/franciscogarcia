/**
 * a11y.js
 * Utilitários partilhados de acessibilidade: armadilha de foco para
 * diálogos (modal, menu mobile) e bloqueio do scroll da página.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Mantém o Tab dentro de `container`. Devolve a função que remove o efeito. */
export function trapFocus(container) {
    const handler = (e) => {
        if (e.key !== 'Tab') return;
        const items = [...container.querySelectorAll(FOCUSABLE)].filter(
            (el) => el.offsetParent !== null && !el.closest('[hidden]')
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };
    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
}

let lockCount = 0;
/** Bloqueia/desbloqueia o scroll do <body> (suporta diálogos sobrepostos). */
export function lockScroll(lock) {
    lockCount = Math.max(0, lockCount + (lock ? 1 : -1));
    document.body.classList.toggle('is-locked', lockCount > 0);
}

export const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
