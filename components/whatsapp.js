/**
 * whatsapp.js
 * Botão flutuante do WhatsApp: esconde-se enquanto o formulário de
 * contacto está visível, para nunca sobrepor os campos ou o botão de envio
 * (a secção de contacto já tem o seu próprio botão de WhatsApp).
 */

export function initWhatsappFab() {
    const fab = document.getElementById('whatsappFab');
    const form = document.getElementById('contactForm');
    if (!fab || !form || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            const hide = entry.isIntersecting;
            fab.classList.toggle('is-hidden', hide);
            // Fora da ordem de tabulação enquanto está escondido
            if (hide) fab.setAttribute('tabindex', '-1');
            else fab.removeAttribute('tabindex');
        },
        { threshold: 0 }
    );
    observer.observe(form);
}
