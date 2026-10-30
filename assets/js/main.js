/**
 * main.js
 * Ponto de entrada. Liga os componentes modulares, o efeito de
 * digitação do cartão "terminal" do hero e o ano do rodapé.
 */

import { initNavbar } from '../../components/navbar.js';
import { initAnimations } from '../../components/animations.js';
import { initPortfolioModal } from '../../components/portfolio.js';
import { initContactForm } from '../../components/contact.js';
import { initServices } from '../../components/services.js';
import { initWhatsappFab } from '../../components/whatsapp.js';
import { prefersReducedMotion } from '../../components/a11y.js';

function initTypedName() {
    const el = document.getElementById('typedName');
    if (!el) return;

    const text = '"Francisco Garcia",';
    if (prefersReducedMotion()) {
        el.textContent = text;
        return;
    }

    let i = 0;
    const type = () => {
        el.textContent = text.slice(0, i++);
        if (i <= text.length) setTimeout(type, 55);
    };
    setTimeout(type, 600);
}

function initFooterYear() {
    const el = document.getElementById('anoActual');
    if (el) el.textContent = String(new Date().getFullYear());
}

function init() {
    initNavbar();
    initAnimations();
    initPortfolioModal();
    initContactForm();
    initServices();
    initWhatsappFab();
    initTypedName();
    initFooterYear();
}

// Os módulos são diferidos: o DOM já pode estar pronto quando este código corre.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
