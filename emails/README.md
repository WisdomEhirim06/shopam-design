# ShopAm transactional emails

On-brand HTML email templates for the ShopAm backend to send. The frontend owns
the HTML; the backend owns the token + delivery.

## How links work

The backend already deep-links into the frontend. Keep that pattern and build
links from a single configurable base URL (`FRONTEND_URL`, set per environment):

| Email | Frontend route |
| --- | --- |
| Verify email | `{FRONTEND_URL}/auth/user-verify?token={token}` |
| Reset password | `{FRONTEND_URL}/auth/reset-password?token={token}&email={email}` |
| Order / chat | `{FRONTEND_URL}/chats/{order_id}` |
| Checkout | `{FRONTEND_URL}/checkout/{order_id}` |
| Vendor orders | `{FRONTEND_URL}/dashboard/orders` |

> Trailing slash: `…/auth/user-verify/?token=…` still resolves (Next redirects to
> the non-slash route and keeps the query string), but prefer no trailing slash.

## Variables (placeholder syntax `{{ variable }}`)

Shared: `preheader`, `first_name`, `year`, `link`, `store_url`
(`https://www.shopam.net`), `support_url` (`https://www.shopam.net/help`).

| Template | Extra variables |
| --- | --- |
| `verify-email.html` | `link`, `expires_in` |
| `reset-password.html` | `link`, `expires_in`, `email` |
| `password-changed.html` | `when`, `link`, `email` |
| `welcome.html` | `link`, `role` (`customer` \| `vendor`) |
| `order-received.html` | `order_id`, `vendor_name`, `items[]` (`name`, `qty`, `price`), `subtotal`, `delivery_fee`, `total`, `link` |
| `vendor-new-order.html` | `order_id`, `buyer_name`, `items[]`, `subtotal`, `total`, `link` |
| `order-accepted.html` | `order_id`, `vendor_name`, `items[]`, `subtotal`, `delivery_fee`, `total`, `link` (Review & Pay) |
| `order-declined.html` | `order_id`, `vendor_name`, `reason`, `link` |
| `payment-receipt.html` | `order_id`, `vendor_name`, `amount`, `reference`, `when`, `link` |
| `shipping-update.html` | `order_id`, `vendor_name`, `status` (`shipped` \| `delivered`), `link` |

## Design rules

- Light theme only: page background `#F8F9FA`, card `#FFFFFF`, ink `#0F172A`,
  muted `#64748B`, brand red `#FA3728`, hairline `#E2E8F0`.
- 600px max width, single column, table-based layout (Outlook-safe), inline
  styles with a small `<style>` block for mobile/dark tweaks.
- Buttons: solid `#FA3728`, white bold text, fully rounded; always followed by a
  plain-text fallback link.
- Logo is a hosted absolute URL: `https://www.shopam.net/images/black-logo.png`.
  If images are blocked, the header text still reads "ShopAm".
- One primary action per email. Subject lines are suggested in each file's
  `<title>` and the README table below.

## Subject line suggestions

| Template | Subject |
| --- | --- |
| verify-email | Verify your ShopAm email |
| reset-password | Reset your ShopAm password |
| password-changed | Your ShopAm password was changed |
| welcome | Welcome to ShopAm, {{first_name}} |
| order-received | We received your order #{{order_id}} |
| vendor-new-order | New order request #{{order_id}} |
| order-accepted | {{vendor_name}} accepted your order #{{order_id}} |
| order-declined | Update on your order #{{order_id}} |
| payment-receipt | Payment received for order #{{order_id}} |
| shipping-update | Your order #{{order_id}} is on the way |

## Preview

Open `emails/preview.html` in a browser to view every template in one gallery.

## Hand-off checklist (for the backend developer)

1. Use these files as the HTML bodies and render the `{{ }}` variables above.
2. Send a **plain-text alternative** alongside the HTML (a one-line summary plus
   the link is fine).
3. Build links from `FRONTEND_URL` — never hardcode the domain.
4. Keep the existing `/api/accounts/*` endpoints the frontend calls unchanged.
5. Provide a `List-Unsubscribe` header for non-critical mail.
