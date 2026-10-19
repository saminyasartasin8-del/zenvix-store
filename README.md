# ZENVIX Store — Shared Orders & Delivery Settings

## Setup

1. Extract this ZIP and open the folder in VS Code.
2. In Supabase Dashboard → SQL Editor, run `SUPABASE_SETUP.sql`. If you already ran an earlier setup script, run the updated SQL again to add storefront settings and access policies.
3. In Supabase Dashboard → Authentication → Users, create an admin email/password account.
4. Copy that account's UUID, then run the final `INSERT` example at the bottom of `SUPABASE_SETUP.sql` with the real UUID.
5. Run `index.html` using VS Code Live Server (or `python -m http.server 5500`). Avoid opening pages directly as `file://` URLs.
6. Open `admin.html`, sign in, then use **Delivery Settings** to set your courier label, origin district, local rate, Dhaka city rate, other-district rate, and optional area overrides.

## Pages

- `index.html` — home page
- `products.html` — product listing
- `product.html` — product details, image gallery, cash price, and Specification/Description tabs
- `cart.html` — shopping cart
- `checkout.html` — checkout and automatic delivery calculation
- `admin.html` — admin login and dashboard, with product editing and storefront settings

## Shared data and access

- `SUPABASE_SETUP.sql` creates or upgrades the Supabase `products` and `product_images` tables and applies public-read/admin-write policies without deleting existing product rows.
- Customer orders are inserted into `zenvix_orders` in Supabase. Admin users granted in `zenvix_admin_users` can view orders and update their status.
- Admins can archive Delivered or Cancelled orders to hide them from the active order list. Archived orders remain saved, stay in the customer's order history, and can be restored from the Archive shortcut in the Admin dashboard header. Run this ZIP's `SUPABASE_SETUP.sql` before using this feature; it adds `archived_at` without deleting existing orders.
- Delivery settings are stored in `zenvix_delivery_settings`; checkout on other devices reads the same shared settings.
- Store name, contact details, homepage copy, promotion visibility, and footer content/links are stored in `zenvix_store_settings` and can be changed from Admin → Storefront. Click a storefront preview card to jump to its related editor field.
- Admin → Products lets you add, edit, and delete products. When editing, current photos stay unless you add replacement photos or select “Remove current product photos.”
- Admin login uses Supabase Auth. Creating an Auth user alone does not grant admin permissions; its UUID must be added to `zenvix_admin_users`.
- `SUPABASE_SETUP.sql` creates the new tables and Row Level Security policies. Run it before testing this version.
- Never put a Supabase service-role key in browser JavaScript. Use only the public/publishable key in the frontend.
- Before public launch, add server-side order validation and abuse prevention (such as CAPTCHA/rate limiting), test RLS carefully, and replace demo catalog information with accurate supplier/product data.

## Delivery rules

Exact area overrides use one rule per line in this format:

`District | Area | Charge`

Checkout applies an exact area override first, then the Dhaka city rate, then the same-district/local rate, then the other-district rate. Applied delivery charge and the final total are saved with each order.

## Customer accounts and checkout

1. Deploy every site file together, including `account.html`, on the same HTTPS website. Share the public `index.html` page with customers; keep `admin.html` for the store owner.
2. Run the updated `SUPABASE_SETUP.sql` in Supabase SQL Editor. It adds `user_id` to orders, removes anonymous order submission, and limits each signed-in customer to their own orders. Re-running it is safe; older guest orders remain admin-only.
3. In Supabase Authentication settings, enable email/password sign-up and choose whether to require email confirmation. Set the production website as the Site URL and add the website's `account.html` address to the allowed redirect URLs. Add your local development account URL too if you will test locally.
4. Customers can browse without signing in. Buy Now and checkout require an account. Their signed-in email is attached to each order, and account pages show only their own order history. Admins continue to see and manage orders in `admin.html`.

Supabase Auth stores the password; this website never saves or reads a customer's password. Keep using only the Supabase publishable key in the browser. Never add a service-role key to this project.

