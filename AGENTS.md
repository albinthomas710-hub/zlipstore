# AGENTS.md (Project Constitution)

## Behavioral Rules
- Prioritize reliability over speed.
- Never guess at business logic.
- The "Data-First" Rule: Before building any Tool, define the Data Schema in AGENTS.md. Coding only begins once the "Payload" shape is confirmed.
- Self-Annealing (The Repair Loop): Analyze -> Patch -> Test -> Update Architecture (SOP in ops/).
- Deliverables vs. Intermediates: Local (`env/tmp/`) for ephemeral data, Global (Cloud) for the "Payload".

## Architectural Invariants
- Layer 1: Architecture (`ops/`) - Technical SOPs in Markdown.
- Layer 2: Navigation (Decision Making) - Route data between SOPs and Tools. No complex tasks, just call execution tools.
- Layer 3: Tools (`resources/`) - Deterministic Python scripts. Atomic and testable.
- Variables/Tokens in `env/.env`.
- `env/tmp/` for intermediate file operations.

## Business Context
- **Brand:** Zlip Store (Instagram: @zlip_.store.__)
- **Location:** Nilambur, India
- **Products:** Jerseys (primary), Clothing, Footwear, Gadgets, Accessories
- **Model:** Reselling — inventory fluctuates, items can restock or go out of stock
- **Sales Channel:** WhatsApp DM / Instagram DM (no payment gateway)
- **Phone:** 9633870945
- **Audience:** Mobile-first, low-to-mid-range Android devices, India
- **Tagline:** Premium Products | Affordable Price

## Core User Flow
Instagram/SEO → Zlip Website → Product Discovery → Product Selection → Cart → WhatsApp pre-filled message → Human closes sale

## Data Schema

### Product
```json
{
  "id": "string (UUID)",
  "name": "string",
  "slug": "string (URL-friendly, auto-generated)",
  "description": "string",
  "category": "jersey | clothing | footwear | gadget | accessory",
  "tags": ["new-arrival", "trending", "limited-stock", "special-edition", "premium-quality"],
  "player": "string | null",
  "club": "string | null",
  "images": [
    {
      "url": "string",
      "alt": "string",
      "label": "front | back | side | detail | null"
    }
  ],
  "sizes": ["S", "M", "L", "XL", "XXL"] | null,
  "colors": ["string"] | null,
  "priceMode": "display | enquiry",
  "price": "number | null",
  "originalPrice": "number | null",
  "inStock": true,
  "featured": false,
  "sortOrder": "number",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### Cart Item (Client-side only, ephemeral)
```json
{
  "productId": "string",
  "productName": "string",
  "selectedSize": "string | null",
  "selectedColor": "string | null",
  "quantity": 1,
  "price": "number | null",
  "priceMode": "display | enquiry"
}
```

### WhatsApp Message Payload (Generated from Cart)
```
Hi Zlip Store! 👋 I'd like to order:

1. [Product Name] — Size: [Size], Color: [Color], Qty: [Qty], Price: ₹[Price]
2. [Product Name] — Size: [Size], Color: [Color], Qty: [Qty], Price: Enquiry

Total: ₹[Total] (excluding enquiry items)

Please confirm availability and total. Thank you!
```

### Admin Session
```json
{
  "authenticated": "boolean",
  "sessionToken": "string (HTTP-only cookie)",
  "expiresAt": "ISO 8601 (24h TTL)"
}
```

## Navigation Structure
- `/` — Home
- `/products` — All Products (filterable)
- `/products/[slug]` — Product Detail
- `/contact` — Contact Us
- `/faq` — FAQ
- `/panel` — Hidden Admin (not in nav, password-protected)

## Psychology & Conversion Principles
1. **Social Proof:** "200+ Trusted Customers", "Since 2025"
2. **Scarcity / Urgency:** "Limited Stock" badges, low-stock indicators
3. **Trust Signals:** All India Delivery, customer count, brand age
4. **FOMO:** Trending section, "Others are viewing this" (future)
5. **Anchoring:** Show original price crossed out next to sale price
6. **Friction Reduction:** One-tap WhatsApp, pre-filled cart message
7. **Authority:** Premium design = perceived product quality

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
