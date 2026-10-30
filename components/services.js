/**
 * services.js
 * Cartões de serviço: "Saber mais" abre um modal com os detalhes do
 * serviço (conteúdo em <template class="service-detail"> de cada cartão)
 * e "Solicitar orçamento" leva ao formulário de contacto existente,
 * identificando o serviço na mensagem. O envio do formulário não muda.
 */

import { trapFocus, lockScroll } from './a11y.js';

function prefillQuote(service) {
    const message = document.getElementById('mensagem');
    if (!message || !service) return;

    const text = `Olá, gostaria de solicitar um orçamento para o serviço: ${service}.\n\n`;
    const previous = message.dataset.prefill || '';
    // Só substitui se o campo estiver vazio ou ainda tiver o texto automático anterior.
    if (!message.value.trim() || message.value === previous) {
        message.value = text;
        message.dataset.prefill = text;
    }
    setTimeout(() => {
        message.focus({ preventScroll: true });
        message.setSelectionRange(message.value.length, message.value.length);
    }, 50);
}

export function initServices() {
    const modal = document.getElementById('serviceModal');
    const panel = modal?.querySelector('.modal__panel');
    const titleEl = document.getElementById('serviceModalTitle');
    const iconEl = document.getElementById('serviceModalIcon');
    const contentEl = document.getElementById('serviceModalContent');
    const quoteBtn = document.getElementById('serviceModalQuote');
    const closeBtn = modal?.querySelector('.modal__close');

    let lastFocused = null;
    let release = () => {};

    const close = ({ restoreFocus = true } = {}) => {
        if (!modal?.classList.contains('is-visible')) return;
        panel.classList.remove('is-open');
        release();
        lockScroll(false);
        setTimeout(() => modal.classList.remove('is-visible'), 250);
        if (restoreFocus) lastFocused?.focus();
    };

    const open = (card) => {
        const service = card.dataset.service;
        titleEl.textContent = service;
        iconEl.innerHTML = card.querySelector('.card__icon')?.innerHTML || '';
        contentEl.replaceChildren(card.querySelector('template.service-detail').content.cloneNode(true));
        quoteBtn.dataset.service = service;

        lastFocused = document.activeElement;
        modal.classList.add('is-visible');
        lockScroll(true);
        requestAnimationFrame(() => panel.classList.add('is-open'));
        release = trapFocus(panel);
        closeBtn.focus();
    };

    document.querySelectorAll('[data-service] .btn-saber-mais').forEach((btn) => {
        btn.addEventListener('click', () => open(btn.closest('[data-service]')));
    });

    // "Solicitar orçamento" (cartões e modal): o scroll até #contacto é feito
    // pelo navbar.js (âncoras internas); aqui só se identifica o serviço.
    document.querySelectorAll('.btn-orcamento').forEach((btn) => {
        btn.addEventListener('click', () => {
            close({ restoreFocus: false });
            prefillQuote(btn.dataset.service);
        });
    });

    modal?.querySelectorAll('[data-service-close]').forEach((el) => el.addEventListener('click', () => close()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
