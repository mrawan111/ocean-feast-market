This is a large build. I'll deliver it in one comprehensive pass, but want to align on scope, priorities, and defaults before writing code.

## What I'll build

A premium bilingual (Arabic-default / English) seafood marketplace for **أسماك أبو ناجي**, with a customer storefront and an admin dashboard, backed by Lovable Cloud (Supabase).

### Design direction
- Deep ocean navy background with gold accents (inspired by the uploaded logo).
- Arabic-first, RTL by default, toggle to English (LTR).
- Mobile-first, large product imagery, subtle motion, marketplace feel (not a menu PDF).
- Typography: Cairo/Tajawal (Arabic) + Inter (English).
- Semantic tokens in `src/styles.css` (oklch), no hardcoded colors in components.

### Storefront (public)
- **Home**: hero with logo + seafood imagery, categories showcase, best sellers, today's fresh (market-price items), reviews, location/contact, footer.
- **Shop**: category filter, search, availability filter, sort. Product cards with image, bilingual name, price (or "سعر اليوم").
- **Product detail**: gallery, bilingual description, quantity, weight selector (when price/kg), cooking method (fried / grilled / oven / clean only), extras (rice, tahini, salad, bread), add to cart.
- **Cart & Checkout**: guest checkout — name, phone, address, notes. No account required.
- **Language switch** persists in localStorage; RTL/LTR flips via `dir` attribute.

### Admin dashboard (`/admin`)
- Supabase email/password login gated by an `admin` role in a separate `user_roles` table (RLS-safe pattern).
- Categories CRUD, Products CRUD (all fields below), image uploads to Supabase Storage.
- Orders list with status updates (pending / preparing / out for delivery / completed / cancelled).
- Site settings: contact phone, WhatsApp, Google Maps URL, opening hours (JSON), delivery fees, hero copy.
- Simple analytics: orders count, revenue, top products, orders by status.

### Data model (Supabase)
- `categories` (name_ar, name_en, sort_order, image_url, active)
- `products` (name_ar/en, desc_ar/en, price, price_per_kg, image_url, category_id, available, featured, sort_order, is_market_price)
- `orders` (customer_name, phone, address, notes, subtotal, delivery_fee, total, status, created_at)
- `order_items` (order_id, product_id, name_snapshot, qty, weight_kg, cooking_method, extras jsonb, unit_price, line_total)
- `site_settings` (single row: phone, whatsapp, maps_url, hours jsonb, delivery_fee, hero_ar/en)
- `reviews` (name, rating, comment_ar/en, approved)
- `user_roles` (user_id, role) + `has_role()` security-definer function
- RLS: public SELECT on categories/products/settings/approved reviews; public INSERT on orders + order_items; admin-only writes elsewhere.

### Product fields (per spec)
Arabic name, English name, Arabic desc, English desc, price, optional price/kg, image, category, availability, featured, sort order, today's-price flag.

### Contact defaults (editable in admin)
- Phone: 0103460744
- WhatsApp: 0103460744
- Maps: https://maps.app.goo.gl/KUxZWNB76kJHnjHw9

### Assumptions I'll make unless you say otherwise
1. **No payments** — orders are placed and confirmed by phone/WhatsApp. Admin marks status. (Payment integration can come later.)
2. **Menu seeding**: I'll seed categories + a starter set of products from the uploaded menu image (Asmak, Tawagen, Makarona, Wajbat, Sanawat, Sandwiches, Salads, Soups, Ma3jenat). You can edit/add more from the admin.
3. **Admin account**: after the migration you'll sign up at `/admin/login`, then I'll show you the one SQL snippet to grant your user the admin role (one-time).
4. **Images**: I'll generate hero/category placeholders; product photos can be uploaded via admin (bucket set up).
5. **Reviews**: seeded with a few sample reviews; admin can approve/hide.
6. **Language default**: Arabic RTL.

### Delivery order
1. DB migration (schema + RLS + seed).
2. Design tokens + i18n scaffolding + layout with language/RTL switch.
3. Storefront pages (home, shop, product, cart, checkout).
4. Admin (auth gate, CRUD screens, orders, settings, analytics).
5. Polish, SEO metadata per route, sitemap/robots.

## Questions before I start
- OK to skip online payment for now (phone/WhatsApp confirmation only)? 
- OK to seed products from the menu image so the site isn't empty?
- Any brand color preference beyond navy + gold, or trust my direction?

If you're happy, reply "go" (or answer above) and I'll ship it.