# Robin Food

Мобильное приложение для покупки продуктов с истекающим сроком годности со скидками до 70%. React + Vite + Tailwind CSS + Self-hosted Supabase.

## Quick Start

```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Production build
VITE_SUPABASE_URL=https://robin-food.ru/api \
VITE_SUPABASE_ANON_KEY=<your_key> \
npm run build
```

## Project Structure

```
robin-food/
├── .cursor/rules/              # 15 Cursor AI rules (.mdc)
├── cursor/
│   ├── Docs/                   # 7 source-of-truth документов
│   │   ├── Spec_v1.4.5_consolidated.md
│   │   ├── API_Contract_v1.4.5_consolidated.md
│   │   ├── Data_Model_v1.4.11_consolidated.md
│   │   ├── Navigation_v1.4.5_consolidated.md
│   │   ├── Integration_Contracts_v1.6.5_consolidated.md
│   │   ├── BNPL_Integration_v1.2.3_consolidated.md
│   │   └── Settlement_v1.2.3_consolidated.md
│   └── rules/                  # Cursor rules (backup)
├── src/
│   ├── components/
│   │   ├── ui/                 # UI primitives (Button, Input, Badge, Card)
│   │   ├── layout/             # Header, BottomNav
│   │   ├── screens/            # App screens (Catalog, Map, Cart, Profile)
│   │   ├── modals/             # Modal dialogs
│   │   └── overlays/           # Overlay screens (Settings, Checkout)
│   ├── hooks/                  # useCart, useFavorites, useMap
│   ├── utils/                  # price, phone utilities
│   ├── data/                   # Constants, catalog data
│   ├── lib/                    # Supabase client
│   └── styles/                 # Global CSS + Tailwind
├── docker/robin-food/          # Supabase Docker stack (9 services)
├── nginx/                      # Nginx reverse proxy config
├── deploy/                     # Server setup scripts & SQL
├── DEPLOY.md                   # Full deployment guide (SSH)
└── Load/                       # Original project specifications
```

## Cursor AI Rules

The project uses a 3-level rules system to optimize token usage:

| Level | Files | When loaded | Tokens |
|-------|-------|-------------|--------|
| **alwaysApply** | `000` | Every request — naming, state machine, NFR | ~1000 |
| **globs** | `010–060` | Auto on file open by pattern | ~500-800 |
| **agent/command** | `070–095` | On demand / by command | ~300-500 |

### Cursor Rules Triggers

| File | Trigger globs |
|------|---------------|
| `010-data-model` | `**/models/**`, `**/migrations/**`, `**/schemas/**` |
| `020-api-contracts` | `**/api/**`, `**/routes/**`, `**/controllers/**` |
| `030-integration-contracts` | `**/integrations/**`, `**/webhooks/**`, `**/providers/**` |
| `040-bnpl-integration` | `**/bnpl/**`, `**/payments/**bnpl**` |
| `050-partner-settlement` | `**/settlement/**`, `**/dispute/**`, `**/payout/**` |
| `060-navigation` | `**/screens/**`, `**/navigation/**`, `**/components/**` |

### Cursor Commands

```
/new-endpoint   → REST API scaffold (11 steps)
/add-screen     → Screen scaffold (10 steps)
/add-cron       → CRON job scaffold (5 steps)
/add-ws-event   → WebSocket event scaffold (7 steps)
/add-push       → Push notification scaffold (7 steps)
/add-provider   → External provider scaffold (7 steps)
```

## Development Workflow

**Roles**: You = PM + Technical Approver, Cursor Agent = Developer

### Effective Prompt Formula

```
[Command] + [What to do] + [Context @file] + [Constraints] + [Docs reference]
```

**Examples:**

| Bad | Good |
|-----|------|
| «Сделай оплату» | «Реализуй SBP flow: Tinkoff Init PayType=SBP, QR в checkout response. См. @docs/IC_v1.6.5 sec 1.2» |
| «Добавь тесты» | «Integration тесты для POST /auth/verify-otp: happy path, INVALID_OTP, OTP_BLOCKED. См. @docs/API_Contract sec 1.2» |

### Commit Conventions

```
feat(orders): add SBP payment flow
fix(bnpl): handle duplicate webhook PaymentId
chore(docs): bump API Contract to v1.4.6
```

## Design System

### Colors (DS v3)

| Token | HEX | Usage |
|-------|-----|-------|
| `semantic.fresh` | `#2DB87A` | Fresh products, CTA primary |
| `semantic.good` | `#FFCC00` | Good freshness, warnings |
| `semantic.lastday` | `#FF8A3D` | Last day products |
| `semantic.urgent` | `#E53935` | Urgent/expired, errors |
| `semantic.discount` | `#FF6D00` | Discount badges |
| `base.surface` | `#FAFAFA` | Background |
| `base.card` | `#FFFFFF` | Card backgrounds |
| `base.text-primary` | `#1A1A1A` | Primary text |
| `base.text-secondary` | `#757575` | Secondary text |

### Typography

- **Headings**: Manrope, semibold/bold (600-800)
- **Body**: Inter, regular (400)
- **Labels**: Inter, medium/semibold (500-600)

### Border Radius

- Cards: `rounded-ds-m` (12px)
- Buttons: `rounded-ds-s` (8px)
- Modals: `rounded-t-[16px]`
- Pills/badges: `rounded-ds-full` (999px)

## Hooks

### useCart

```jsx
const {
  items,           // Cart products
  stats,           // { count, totalQuantity, totalPrice }
  addItem,         // (product, qty) => void
  removeItem,      // (productId) => void
  incrementItem,   // (productId) => void
  decrementItem,   // (productId) => void
  clearCart,       // () => void
} = useCart();
```

### useFavorites

```jsx
const {
  favorites,        // [productId, ...]
  toggleFavorite,   // (productId) => void
  isFavorite,       // (productId) => boolean
  count,            // number
} = useFavorites([initialIds]);
```

### useMap

```jsx
const { mapRef } = useMap({
  enabled: true,    // Activate map
  radius: 1.5,      // Radius in km
});
```

## Utilities

### calculatePrices

```js
import { calculatePrices } from '@/utils/price';

const { unitPrice, totalPrice, discountPercent, bulkBonusPercent } =
  calculatePrices(product, quantity);
```

### formatPhone

```js
import { formatPhone, isValidPhone } from '@/utils/phone';

formatPhone('+79851234567'); // '+7 (985) 123-45-67'
isValidPhone('+7 (985) 123-45-67'); // true
```

## Deployment

Full deployment guide: **[DEPLOY.md](DEPLOY.md)**

**Production**: https://robin-food.ru (Timeweb Cloud VPS)

Quick frontend deploy:

```bash
npm run build
rsync -avz dist/ root@85.239.47.69:/var/www/robin-food/
```

## Architecture

```
Browser → Nginx (:443)
            ├── / → React SPA (static files)
            └── /api/* → Kong API Gateway (:8100)
                          ├── /rest/v1/* → PostgREST
                          ├── /auth/v1/* → GoTrue
                          ├── /realtime/v1/* → Realtime (WebSocket)
                          └── /storage/v1/* → Storage API
                                               └── PostgreSQL 15
```

## Tech Stack

- **React** 18 + **Vite** 5
- **Tailwind CSS** 3.4
- **Lucide React** — icons
- **Leaflet** — maps
- **Supabase** (self-hosted) — auth, database, storage, realtime

## License

MIT
