# Cose Vintage

## Overview
- **Tipo:** E-commerce abbigliamento vintage premium
- **Stato:** Live (TEST mode)
- **URL Prod:** https://cose-vintage.pages.dev
- **URL Preview:** https://{branch}.cose-vintage.pages.dev
- **Repo:** https://github.com/emiliomartucci/cose-vintage

## Config
- **Linguaggio:** HTML/CSS/JS
- **Test:** no
- **Env Vars:** no (API key pubblica in snipcart-loader.js)

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
├── index.html           # Homepage
├── shop.html            # Catalogo con filtri
├── product.html         # Template prodotto singolo
├── chi-siamo.html       # Storia del brand
├── contatti.html        # Form contatti + FAQ
├── privacy.html         # Privacy policy
├── styles.css           # Design system completo
├── script.js            # JS condiviso
├── snipcart-loader.js   # Configurazione Snipcart centralizzata
├── robots.txt           # SEO
├── sitemap.xml          # SEO
├── llms.txt             # AI crawlers
└── design-preview.html  # Preview componenti (dev)

output/
├── design-system-export.html  # Design system (print-ready)
└── design-system.pdf          # Export PDF design system
```

## Setup Snipcart
API key pubblica configurata in `src/snipcart-loader.js`.

Per passare a LIVE:
1. Dashboard Snipcart → API Keys → Copia Live Public Key
2. Modifica `src/snipcart-loader.js`
3. Configura dominio autorizzato in Snipcart settings

## Deploy
- **Hosting:** Cloudflare Pages
- **Git-connected:** si
- **URL Prod:** https://cose-vintage.pages.dev/
- **Source dir:** src/

## Comandi Utili
```bash
# Export design system a PDF
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu \
  --print-to-pdf="output/design-system.pdf" \
  --no-margins --print-to-pdf-no-header \
  "file://$(pwd)/output/design-system-export.html"
```

## Prossimi Step
- [ ] Configurare dominio custom (opzionale)
- [ ] Aggiungere prodotti reali in Snipcart
- [ ] Inserire foto prodotti reali
- [ ] Sostituire email/telefono placeholder
- [ ] Setup Google Analytics
- [ ] Passare a API key LIVE Snipcart

## Recent Changes
- 2026-01-12: Progetto creato
- 2026-01-12: Design system "La Brocante" implementato
- 2026-01-12: Tutte le pagine implementate
- 2026-01-12: Git init + push su GitHub
- 2026-01-12: Deploy su Cloudflare Pages
- 2026-01-12: Snipcart configurato con loader centralizzato
- 2026-01-12: Export design system PDF
