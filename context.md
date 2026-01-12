# Cose Vintage

## Overview
- **Tipo:** E-commerce abbigliamento vintage premium
- **Stato:** Pronto per deploy
- **URL Prod:** https://cose-vintage.pages.dev (dopo setup Cloudflare)
- **URL Preview:** https://{branch}.cose-vintage.pages.dev
- **Repo:** https://github.com/emiliomartucci/cose-vintage

## Config
- **Linguaggio:** HTML/CSS/JS
- **Test:** no
- **Env Vars:** si (SNIPCART_API_KEY da configurare)

## Stack
- **Frontend:** HTML5 + CSS3 + Vanilla JS
- **Design System:** "La Brocante" (mercatino parigino)
- **E-commerce:** Snipcart (dashboard per gestione prodotti)
- **Pagamenti:** Stripe + PayPal (via Snipcart)
- **Hosting:** Cloudflare Pages (git-connected)
- **Backend:** Nessuno (Snipcart gestisce tutto)

## Brand Identity

### Concept
"La Brocante" - Mercatino parigino romantico. Eleganza vissuta, patina del tempo, scoperta di pezzi unici.

### Palette
| Token | Colore | Uso |
|-------|--------|-----|
| --color-sage | #8B9A7A | Primario, CTA, categorie |
| --color-cream | #F7F3EB | Background principale |
| --color-terracotta | #C4846C | Accento, link, badge sale |
| --color-gold | #B8976D | Decorazioni luxury |
| --color-ink | #3D352E | Testo principale |

### Typography
- **Display:** Playfair Display (titoli)
- **Body:** Lora (testo)
- **Accent:** Cormorant Garamond (quote, italici)
- **UI:** Source Sans 3 (bottoni, labels)

### Tone of Voice
Appassionato, racconta storie, emotivo. Ogni capo ha una storia.

## Struttura Pagine
```
src/
├── index.html          # Homepage
├── shop.html           # Catalogo con filtri
├── product.html        # Template prodotto singolo
├── chi-siamo.html      # Storia del brand
├── contatti.html       # Form contatti + FAQ
├── privacy.html        # Privacy policy
├── styles.css          # Design system completo
├── script.js           # JS condiviso
├── robots.txt          # SEO
├── sitemap.xml         # SEO
├── llms.txt            # AI crawlers
└── design-preview.html # Preview componenti (dev)
```

## Setup Snipcart (TODO)
1. Crea account su https://snipcart.com
2. Vai su Dashboard → API Keys
3. Copia la **Public API Key**
4. Sostituisci `YOUR_SNIPCART_PUBLIC_API_KEY` in tutti i file HTML
5. Configura dominio autorizzato in Snipcart settings

## Setup Cloudflare Pages (TODO)
1. Vai su https://dash.cloudflare.com/ → Pages
2. Connect to Git → seleziona `cose-vintage`
3. Build output: `src`
4. Deploy

## Prossimi Step
- [ ] Setup account Snipcart
- [ ] Inserire API key Snipcart
- [ ] Deploy su Cloudflare Pages
- [ ] Configurare dominio custom (opzionale)
- [ ] Aggiungere prodotti reali in Snipcart
- [ ] Inserire foto prodotti reali
- [ ] Sostituire email/telefono placeholder
- [ ] Setup Google Analytics

## Recent Changes
- 2026-01-12: Progetto creato
- 2026-01-12: Design system "La Brocante" implementato
- 2026-01-12: Tutte le pagine implementate
- 2026-01-12: Git init + push su GitHub
