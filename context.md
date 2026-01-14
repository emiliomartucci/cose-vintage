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
- **E-commerce:** Snipcart (checkout, pagamenti)
- **Pagamenti:** Stripe + PayPal (via Snipcart)
- **Hosting:** Cloudflare Pages (git-connected)
- **Admin:** Cloudflare Workers + D1 + R2
- **Database:** Cloudflare D1 (SQLite)
- **Images:** Cloudflare R2 (object storage)

## Brand Identity

### Concept
"La Brocante" - Mercatino parigino romantico. Eleganza vissuta, patina del tempo, scoperta di pezzi unici.

### Palette
| Token | Colore | Uso |
|-------|--------|-----|
| --color-sage | #8B9A7A | Primario, CTA, categorie |
| --color-cream | #F7F3EB | Background principale |
| --color-terracotta | #CB8587 | Accento, link, badge sale (Rosa Antico) |
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

admin/
├── src/
│   ├── index.js         # Worker API HTTP
│   ├── products.js      # CRUD prodotti
│   ├── images.js        # Upload R2
│   └── ui.js            # Admin UI HTML
├── tests/
│   ├── products.test.js # Test CRUD
│   └── images.test.js   # Test upload
├── scripts/
│   ├── scrape-vinted.js # Scraper Vinted
│   └── populate-admin.js # Popola admin
├── schema.sql           # Schema D1
├── wrangler.toml        # Config Cloudflare
└── package.json

output/
├── design-system-export.html  # Design system (print-ready)
└── design-system.pdf          # Export PDF design system
```

## Admin Panel

### URLs
- **Admin UI:** https://cose-vintage-admin.emi-martucci.workers.dev
- **API Base:** https://cose-vintage-admin.emi-martucci.workers.dev/api

### Cloudflare Resources
- **Worker:** cose-vintage-admin
- **D1 Database:** cose-vintage-db (ID: 556587eb-0023-4a4a-99c1-e7162d7bd022)
- **R2 Bucket:** cose-vintage-images

### Authentication
Basic Auth con password in `ADMIN_PASSWORD` env var (default: "changeme")

### API Endpoints
| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| GET | /api/products | Lista prodotti (con filtri) | No |
| POST | /api/products | Crea prodotto | Si |
| GET | /api/products/:id | Dettaglio prodotto | No |
| PUT | /api/products/:id | Aggiorna prodotto | Si |
| DELETE | /api/products/:id | Elimina prodotto | Si |
| GET | /api/products/:id/images | Lista immagini prodotto | No |
| POST | /api/products/:id/images | Upload immagine | Si |
| GET | /images/* | Serve immagini R2 | No |

### Schema Prodotto
```json
{
  "nome": "string (required)",
  "prezzo": "number > 0 (required)",
  "descrizione": "string",
  "categoria": "giacche|vestiti|camicie|gonne|maglieria|accessori (required)",
  "genere": "donna|uomo|unisex (required)",
  "taglia": "string",
  "epoca": "50|60|70|80|90|00|10|20",
  "condizione": "eccellente|buona|usato",
  "disponibile": "0|1"
}
```

### Funzionalita Admin UI
- CRUD prodotti completo
- Upload multiplo immagini (drag & drop)
- Galleria immagini con view, crop, remove
- Imposta immagine principale
- Filtri per categoria, genere, disponibilita
- **Cropper.js** per editing immagini (zoom, rotate, flip, crop)

### Deploy Admin
```bash
cd admin
CLOUDFLARE_API_TOKEN=xxx npx wrangler deploy
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
- [ ] Impostare password admin sicura (attuale: "changeme")
- [x] Collegare shop.html per fetch prodotti da API admin
- [x] Immagini servite da Worker (no R2 public URL necessario)
- [x] Implementare product.html dinamico
- [x] Homepage dinamica (hero, nuovi arrivi, categorie)
- [ ] Upload foto prodotti reali via admin UI
- [ ] Configurare dominio custom (opzionale)
- [ ] Sostituire email/telefono placeholder
- [ ] Setup Google Analytics
- [ ] Passare a API key LIVE Snipcart

## Recent Changes
- 2026-01-14: Homepage completamente dinamica (hero cards, nuovi arrivi, conteggi)
- 2026-01-14: Product.html dinamico con galleria immagini e related products
- 2026-01-14: Tutti i prodotti ora caricati da API admin
- 2026-01-13: Fix campo immagine (image vs primary_image) - shop funzionante
- 2026-01-13: API products endpoint reso pubblico per frontend
- 2026-01-13: shop.html ora fetch prodotti dinamicamente da API admin
- 2026-01-13: Cropper.js integrato per editing immagini (zoom, rotate, flip)
- 2026-01-13: Filtri dinamici con conteggi basati su prodotti reali
- 2026-01-13: Gestione immagini completa (view, crop, remove, set primary)
- 2026-01-13: Scraper Vinted aggiornato per tutte le foto (2-6 per prodotto)
- 2026-01-13: Aggiunte opzioni epoca (50-20) e condizione (usato)
- 2026-01-13: Admin deployato su Cloudflare Workers + D1 + R2
- 2026-01-13: Scraper Vinted creato, 10 prodotti importati dal profilo Anna
- 2026-01-13: Implementato sistema filtri shop.html (categoria, genere, taglia, prezzo)
- 2026-01-13: Aggiunto pattern botanico + blob sfumati all'hero, ridotto padding top
- 2026-01-13: Rifatto gradiente hero (cream→rosa→sage) senza marrone intermedio
- 2026-01-13: Sostituito terracotta (#C4846C) con rosa antico (#CB8587) su richiesta cliente
- 2026-01-12: Progetto creato
- 2026-01-12: Design system "La Brocante" implementato
- 2026-01-12: Tutte le pagine implementate
- 2026-01-12: Git init + push su GitHub
- 2026-01-12: Deploy su Cloudflare Pages
- 2026-01-12: Snipcart configurato con loader centralizzato
- 2026-01-12: Export design system PDF
