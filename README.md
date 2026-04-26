# scousegpt

A chat interface for talking to **Tommy la** — a proper Scouse lad from Liverpool who gives sound advice on anything from heartbreak to debugging code. *Sound advice from a proper Scouse lad.*

Fanzine cut-and-paste aesthetic: Bebas Neue wordmark with a single red stamp shadow, halftone-dotted cream paper, solid black column rules, 90s photocopier energy.

---

## Local dev setup

Requires Node 20+ and pnpm.

```bash
pnpm install
cp .env.local.example .env.local
# fill in keys, then:
pnpm dev
```

Open http://localhost:3000.

### Environment variables

```
ANTHROPIC_API_KEY=
NEXT_PUBLIC_STRIPE_BEER_LINK=
NEXT_PUBLIC_STRIPE_CASE_LINK=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=scousegpt.com
```

Restart `pnpm dev` after editing — Next.js loads env at startup.

---

## Editing the personality

**To change how Tommy la talks, open [`lib/systemPrompt.ts`](lib/systemPrompt.ts). This is the most important file in the project.** Voice, vocabulary, refusals, length defaults — it all lives in that one string. Edit, save, refresh.

To change paywall phrasing, suggestions, or stamp microtype — edit [`lib/constants.ts`](lib/constants.ts).

---

## Stripe Setup

The free tier gives 3 questions. After that, two unlocks via Stripe Payment Links — no Stripe backend code, just hosted links.

### Step 1 — Create a Stripe account

[stripe.com](https://stripe.com), verify email, default to test mode.

### Step 2 — Create two Payment Links (dashboard only)

Stripe dashboard → **Payment Links** → **+ New**.

**Link 1 — The pint ($2):**
1. + Add a product → Create new product
2. Name: `Pint for Tommy la`
3. Price: `$2.00 USD`, one-time
4. After payment → Redirect to your website
5. Redirect URL: `https://scousegpt.com?session=success&tier=beer`
6. Create link, copy the URL.

**Link 2 — The full session ($10):**
1. Repeat the above
2. Name: `A Full Session for Tommy la`
3. Price: `$10.00 USD`, one-time
4. Redirect URL: `https://scousegpt.com?session=success&tier=case`
5. Copy the link.

### Step 3 — Add links to your environment

In `.env.local` and Vercel Project → Settings → Environment Variables:

```
NEXT_PUBLIC_STRIPE_BEER_LINK=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_CASE_LINK=https://buy.stripe.com/...
```

### Step 4 — Test mode → Live mode switchover checklist

1. Stripe defaults to test mode. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.
2. Complete a test purchase end-to-end. Confirm:
   - Browser lands on `https://scousegpt.vercel.app?session=success&tier=beer`
   - URL is cleaned to `/`
   - Confirmation message appears in chat
   - Prompt counter shows the new total
3. Switch Stripe to **Live mode** (toggle top-left of dashboard).
4. Recreate both Payment Links in live mode (they're entirely separate from test).
5. Update Vercel env vars with the live links.
6. Redeploy.

### Pricing rationale

$2 / 30 questions ≈ a Scouse pint. $10 / 200 questions ≈ a full session at the bar. API costs at Anthropic Sonnet pricing ≈ $0.005-0.006 per question, leaving healthy margins after Stripe fees (~2.9% + $0.30).

### Note on payment verification

The current implementation issues a server-side token after `?session=success` is detected, but that endpoint isn't gated on a Stripe webhook — anyone with the URL can mint a token. Acceptable for a low-stakes novelty site. **For a hardened v2, verify via Stripe Webhook before issuing tokens.**

---

## Vercel deploy

1. Push the repo to GitHub.
2. Vercel → **Add New → Project**, import the repo.
3. Framework preset: Next.js (auto-detected).
4. **Environment Variables** — add `ANTHROPIC_API_KEY`, both `NEXT_PUBLIC_STRIPE_*`, and `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for Production, Preview, and Development.
5. Deploy. Vercel returns a `*.vercel.app` URL (e.g. `scousegpt.vercel.app`).

---

## Custom domain (Namecheap example)

1. **Vercel:** Project → Settings → Domains → add `scousegpt.com`.
2. **Namecheap:** Domain List → Manage → Advanced DNS.
3. Delete any existing parking-page records (URL Redirect for `@`, CNAME for `www`).
4. Add `A` record: Host `@`, Value `76.76.21.21`, TTL Automatic.
5. Add `CNAME`: Host `www`, Value `cname.vercel-dns.com`, TTL Automatic.
6. Wait 5–30 min for DNS + Vercel-issued SSL.

---

## OG image

`public/og.png` must be created manually — **1200×630**.

Brief (per design notes):
- Dark warm brown background (`#1a1612`) with subtle halftone radial fade at centre.
- "scousegpt" wordmark in Bebas Neue — massive, cream, single red drop shadow.
- Tagline "sound advice from a proper Scouse lad" in Source Serif Pro italic, gold (`#d4a017`).
- Thick black rule above and thin black rule below the tagline.
- Top-left stamp: ★ LIVERPOOL · THE MERSEY · BEYOND ★ in gold.
- Top-right: ☀ SOUND AS A POUND ☀ in gold.
- Bottom: single red/black stripe full width.
- Grain texture throughout. 90s fanzine cover, not a tech product.

---

## Favicon

Drop a 512×512 PNG at `app/icon.png` and a 180×180 PNG at `app/apple-icon.png`. Match the avatar styling — black circle, cream "TL" in Bebas Neue, gold outer ring.

---

## Design notes (this site's overrides on the master template)

- **Wordmark**: single red drop shadow (`#c8102e`) at 3px/3px. No multi-color stack — stamped, not designed.
- **Halftone**: cream chat card has a 6px-grid, 2px dot, 0.15-opacity SVG halftone overlay.
- **Avatar**: rendered in CSS as `.tl-avatar` — black circle, cream "TL", 2px cream border, gold outer ring. Replaces the master template's `<Image src={iconSrc} />` approach.
- **Header separator**: thick black 3px above the tagline, thin black 1px below. Replaces the dotted ink-divider.
- **Chat card stripes**: solid black 8px each side. No tri-color motif on this site.
- **Input bar**: 2px black border on cream, no gold ring shadow. Red send button — the one jab of color.
- **Stamp microtype**: Bebas Neue, `letter-spacing: 0.15em` (vs 0.3em on bumboclaude). Fanzines pack their type in.
- **Bottom stripe**: red/black 50/50, no gold or green.
- **Palette**: green is removed entirely on this site — `--bc-green` does not exist in `globals.css`.

---

## Custom analytics events

Plausible custom events fired by `lib/plausible.ts`:

| Event | Where |
|-------|-------|
| `Paywall Shown` | useEffect on `showPaywall === true` |
| `Beer Button Clicked` | onClick beer-tier `<a>` |
| `Case Button Clicked` | onClick case-tier `<a>` |
| `Payment Success Beer` | Stripe redirect handler, tier=beer |
| `Payment Success Case` | Stripe redirect handler, tier=case |
| `Share Card Opened` | useEffect mount of ShareCard |
| `Share Completed` | post-share / post-download |

`<Analytics />` from `@vercel/analytics/react` covers Web Vitals.

---

## Protecting yourself from API costs

Set a hard cap in the Anthropic console:

1. [console.anthropic.com](https://console.anthropic.com) → **Settings** → **Billing**
2. Monthly spend limit — suggested **$200** for launch.

In-app rate limiter (20 req/IP/min) is a second layer, in-memory, per-instance. For real traffic upgrade to Upstash Redis (V2 wishlist).

---

## V2 wishlist

- Upstash Redis rate limiting + session store (survives cold starts).
- Stripe Webhook prompt verification (closes the "anyone can call /api/session/create" loophole).
- Server-rendered share images via `@vercel/og`.
- Per-message OG image auto-generation.
