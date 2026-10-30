/**
 * portfolio.js
 * Modal de detalhes dos projectos (lê os atributos data-* de cada cartão)
 * e estado vazio quando não existe nenhum projecto na grelha.
 */

import { trapFocus, lockScroll } from './a11y.js';

function initEmptyState() {
    const empty = document.getElementById('projectsEmpty');
    if (!empty) return;
    const hasProjects = document.querySelectorAll('#portfolio .project-card').length > 0;
    empty.hidden = hasProjects;
}

export function initPortfolioModal() {
    initEmptyState();

    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const panel = modal.querySelector('.modal__panel');
    const imgEl = document.getElementById('modalImg');
    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDesc');
    const roleEl = document.getElementById('modalRole');
    const tagsEl = document.getElementById('modalTags');
    const linkEl = document.getElementById('modalLink');
    const soonEl = document.getElementById('modalSoon');
    const closeBtn = modal.querySelector('.modal__close');

    let lastFocused = null;
    let release = () => {};

    const open = (card) => {
        const { title = '', desc = '', role = '', tags = '', img = '', link = '' } = card.dataset;

        titleEl.textContent = title;
        descEl.textContent = desc;
        roleEl.textContent = role ? `Contributo: ${role}` : '';
        roleEl.hidden = !role;
        imgEl.src = img;
        imgEl.style.objectPosition = card.dataset.imgPosition || '';
        imgEl.alt = card.querySelector('.project-card__media img')?.alt || `Imagem do projecto ${title}`;

        tagsEl.replaceChildren(
            ...tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => {
                const li = document.createElement('li');
                li.className = 'badge';
                li.textContent = t;
                return li;
            })
        );
        tagsEl.hidden = !tagsEl.children.length;

        const hasLink = Boolean(link.trim());
        linkEl.hidden = !hasLink;
        linkEl.style.display = hasLink ? '' : 'none';
        soonEl.hidden = hasLink;
        if (hasLink) linkEl.href = link;

        lastFocused = document.activeElement;
        modal.classList.add('is-visible');
        lockScroll(true);
        requestAnimationFrame(() => panel.classList.add('is-open'));
        release = trapFocus(panel);
        closeBtn.focus();
    };

    const close = () => {
        if (!modal.classList.contains('is-visible')) return;
        panel.classList.remove('is-open');
        release();
        lockScroll(false);
        setTimeout(() => modal.classList.remove('is-visible'), 250);
        lastFocused?.focus();
    };

    document.querySelectorAll('.project-card').forEach((card) => {
        card.querySelector('.btn-ver-projecto')?.addEventListener('click', () => open(card));
    });

    modal.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
