/**
 * toast.js
 * Componente de feedback (sucesso, erro, informação) anunciado
 * por leitores de ecrã através da região aria-live #toastRegion.
 */

const ICONS = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info',
};

let timer;

export function showToast(message, type = 'success', duration = 4500) {
    const region = document.getElementById('toastRegion');
    if (!region) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icon = document.createElement('i');
    icon.className = `fa-solid ${ICONS[type] || ICONS.info} toast__icon`;
    icon.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = message;

    toast.append(icon, text);
    region.replaceChildren(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    clearTimeout(timer);
    timer = setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
