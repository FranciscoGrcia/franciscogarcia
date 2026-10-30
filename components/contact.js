/**
 * contact.js
 * Formulário de contacto: validação em tempo real, modal de confirmação,
 * estado de loading e envio real para o Formspree, com feedback por toast.
 *
 * Nota: na versão anterior existiam DOIS handlers (este, que só simulava
 * o envio, e outro em main.js que enviava para o Formspree). Ao confirmar,
 * corriam ambos. Foram unificados aqui, mantendo o envio real.
 */

import { trapFocus, lockScroll } from './a11y.js';
import { showToast } from './toast.js';

// Endpoint Formspree já existente no projecto (não é um segredo: é público por natureza).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojgypld';

const VALIDATORS = {
    name: (v) => {
        if (!v.trim()) return 'Indique o seu nome.';
        if (v.trim().length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
        return '';
    },
    telefone: (v) => {
        const cleaned = v.replace(/[\s().-]/g, '');
        if (!cleaned) return 'Indique um número de telefone.';
        if (!/^\+?\d{9,15}$/.test(cleaned)) return 'Número de telefone inválido.';
        return '';
    },
    email: (v) => {
        if (!v.trim()) return 'Indique o seu e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'E-mail em formato inválido.';
        return '';
    },
    mensagem: (v) => {
        if (!v.trim()) return 'Escreva a sua mensagem.';
        if (v.trim().length < 10) return 'A mensagem deve ter pelo menos 10 caracteres.';
        return '';
    },
};

function setFieldState(input, message) {
    const field = input.closest('.field');
    const errorEl = field?.querySelector('.field__error');
    if (!field || !errorEl) return;

    field.classList.toggle('is-invalid', Boolean(message));
    field.classList.toggle('is-valid', !message && input.value.trim() !== '');
    errorEl.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
}

function clearFieldState(input) {
    const field = input.closest('.field');
    field?.classList.remove('is-invalid', 'is-valid');
    const errorEl = field?.querySelector('.field__error');
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
}

function validateField(input) {
    const validator = VALIDATORS[input.name];
    if (!validator) return true;
    const message = validator(input.value);
    setFieldState(input, message);
    return !message;
}

export function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = [...form.querySelectorAll('.field__input')];
    const submitBtn = document.getElementById('submitBtn');

    const confirmModal = document.getElementById('confirmModal');
    const confirmPanel = confirmModal.querySelector('.modal__panel');
    const confirmSend = document.getElementById('confirmSend');

    let release = () => {};
    let sending = false;

    // Validação em tempo real: ao sair do campo e, depois do primeiro erro, ao escrever.
    inputs.forEach((input) => {
        input.addEventListener('blur', () => { if (input.value.trim()) validateField(input); });
        input.addEventListener('input', () => {
            if (input.closest('.field')?.classList.contains('is-invalid')) validateField(input);
        });
    });

    const openConfirm = () => {
        confirmModal.classList.add('is-visible');
        lockScroll(true);
        requestAnimationFrame(() => confirmPanel.classList.add('is-open'));
        release = trapFocus(confirmPanel);
        confirmSend.focus();
    };

    const closeConfirm = ({ restoreFocus = true } = {}) => {
        if (!confirmModal.classList.contains('is-visible')) return;
        confirmPanel.classList.remove('is-open');
        release();
        lockScroll(false);
        setTimeout(() => confirmModal.classList.remove('is-visible'), 250);
        if (restoreFocus) submitBtn.focus();
    };

    confirmModal.querySelectorAll('[data-confirm-cancel]').forEach((el) =>
        el.addEventListener('click', () => { if (!sending) closeConfirm(); })
    );
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !sending) closeConfirm();
    });

    const setLoading = (isLoading) => {
        sending = isLoading;
        [submitBtn, confirmSend].forEach((btn) => {
            btn.disabled = isLoading;
            btn.classList.toggle('is-loading', isLoading);
            btn.setAttribute('aria-busy', String(isLoading));
        });
    };

    const send = async () => {
        if (sending) return;
        const data = Object.fromEntries(inputs.map((i) => [i.name, i.value.trim()]));
        setLoading(true);
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            form.reset();
            inputs.forEach(clearFieldState);
            closeConfirm();
            showToast('Mensagem enviada com sucesso! Obrigado pelo contacto.', 'success');
        } catch (err) {
            closeConfirm();
            showToast('Não foi possível enviar a mensagem. Verifique a ligação e tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    confirmSend.addEventListener('click', send);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = inputs.map(validateField).every(Boolean);
        if (!valid) {
            form.querySelector('[aria-invalid="true"]')?.focus();
            showToast('Verifique os campos assinalados.', 'error');
            return;
        }
        openConfirm();
    });
}
