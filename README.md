# Portefólio — Francisco Garcia

Portefólio pessoal de Francisco Garcia, desenvolvedor web e fundador da CISD Soluções.
Site estático de página única: **HTML5 + CSS3 + JavaScript (módulos ES) + Tailwind CSS (Play CDN)**.
Não precisa de build nem de `npm install`.

## Estrutura

```
index.html                 Página única (hero, sobre + experiência, formação, serviços, projectos, diferenciais, contacto)
assets/
  css/tokens.css           Design System: todas as variáveis (cores, tipografia, espaços, raios, sombras…)
  css/style.css            Componentes (botões, campos, badges, cartões, navbar, modal, toast, estado vazio)
  js/main.js               Ponto de entrada (inicializa os componentes)
  images/profile/          francisco-garcia.(webp|png) — hero · sobre.(webp|png) — secção Sobre
  images/projects/         cisd.png · sitekwatisa.png — capas dos projectos CISD Soluções e KWATISA
                           (cisd-cover.webp · kwatisa-cover.webp — ilustrações anteriores, já não usadas)
  images/                  Restantes imagens (APMCL, Gestor de Tarefas e imagens antigas)
  icons/favicon.ico
components/
  a11y.js                  Armadilha de foco, bloqueio de scroll, prefers-reduced-motion
  navbar.js                Menu mobile, scroll spy, navbar reactiva, voltar ao topo
  animations.js            Reveal ao fazer scroll e entrada das imagens lazy
  portfolio.js             Modal de detalhes dos projectos + estado vazio
  contact.js               Validação, confirmação e envio do formulário (Formspree)
  toast.js                 Mensagens de sucesso/erro acessíveis
  whatsapp.js              Botão flutuante do WhatsApp (esconde-se junto ao formulário)
  services.js              Serviços: modal "Saber mais" e "Solicitar orçamento" (pré-preenche a mensagem do formulário)
design/covers/             Fontes HTML das capas dos projectos (para editar/regenerar)
```

## Executar localmente

Os scripts são módulos ES, por isso o site tem de ser servido por HTTP (abrir o `index.html`
com duplo clique não carrega os módulos):

```bash
# opção 1 — Python
python -m http.server 5500
# opção 2 — Node
npx serve .
# opção 3 — VS Code: extensão "Live Server"
```

Depois abra `http://localhost:5500`.

## Publicar (Vercel)

1. Faça push para o GitHub.
2. Na Vercel: **Add New → Project →** importe o repositório.
3. Framework preset: **Other**. Build command: vazio. Output directory: `.` (raiz).
4. Deploy. Funciona igualmente no GitHub Pages ou Netlify (site estático).

## Design System

Tudo vive em `assets/css/tokens.css`. Para mudar o visual, altere só os tokens:

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#6C2BD9` | Botões primários, identidade |
| `--color-primary-hover` | `#5720B7` | Hover |
| `--color-primary-text` | `#A98BF5` | Texto/links em roxo sobre fundo escuro (o `#6C2BD9` só tem 2,7:1 e não serve para texto) |
| `--color-secondary` | `#FDC400` | Destaques pontuais e CISD |
| `--color-bg` / `--color-surface` / `--color-surface-elevated` | `#0B1020` / `#151C2E` / `#202A40` | Fundos |
| `--color-text` / `--color-text-secondary` | `#F8FAFC` / `#B6C0D2` | Texto |
| `--brand-cisd-navy` / `--brand-cisd-yellow` / `--brand-kwatisa` | `#000D74` / `#FDC400` / `#6C2BD9` | Cores próprias dos projectos |

O Tailwind lê as mesmas variáveis (ver `tailwind.config` no `<head>`), por isso classes como
`bg-primary`, `text-ink-muted` ou `border-line` seguem os tokens automaticamente.

**Componentes:** `.btn` (+ `--primary`, `--secondary`, `--outline`, `--ghost`, `--sm`, `--block`, estado `.is-loading`),
`.field` / `.field__input` (estados `.is-invalid` / `.is-valid`), `.badge` (+ `--primary`, `--highlight`),
`.card` (+ `--interactive`), `.project-card` (+ `--featured`), `.modal`, `.navbar`, `.mobile-menu`,
`.toast` (+ `--success`, `--error`, `--info`), `.empty-state`, `.icon-btn`, `.link`.

## Adicionar um projecto

Copie um `<article class="project-card">` dentro de `#projectsGrid` e preencha os atributos
`data-title`, `data-desc`, `data-role`, `data-tags` (separadas por vírgulas), `data-img` e `data-link`
(vazio = "Projecto em breve online"). O modal de detalhes lê estes atributos automaticamente.

## Formulário de contacto

Envia para o Formspree (`https://formspree.io/f/xojgypld`, definido em `components/contact.js`).
Pede confirmação antes de enviar, mostra loading no botão e toast de sucesso ou erro.

## Notas para produção

- O **Tailwind Play CDN** foi mantido para não alterar o fluxo de trabalho. Em produção a Tailwind
  recomenda compilar o CSS (Tailwind CLI) para eliminar o script em tempo de execução e o aviso na consola.
- Algumas imagens antigas em `assets/images/` (`sobreia.jpg`, `sobreangotic1.jpeg`, `cisdsolucoes.png`, `21.PNG`, …)
  já não são usadas na página. Foram mantidas por precaução; pode apagá-las para reduzir o tamanho do repositório.
