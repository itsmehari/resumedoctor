# Mobile & tablet acceptance checklist

Use on real devices (or BrowserStack) for ~80% mobile/tablet traffic.

## Breakpoints (Tailwind defaults)

| Token | Min width |
|-------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |

## Marketing

- [ ] Home hero shows artwork below `lg` (not desktop-only proof)
- [ ] Template filter chips ≥ 44px touch height on home and `/templates`
- [ ] Pricing: mobile “Compare plans” accordion works; desktop table at `lg+`
- [ ] Megamenu drawer: open, accordion, close, Esc

## Auth & try

- [ ] `/try` OTP inputs usable on 320px width
- [ ] Signup/login buttons full-width and tappable

## Logged-in product

- [ ] Dashboard: card grid readable; sidebar stacks below main on phone
- [ ] Resume editor: sections stack; export menu reachable
- [ ] Share popover: vanity slug field usable on phone
- [ ] `/jobs` and `/interview-prep` redirect to login when logged out (middleware)

## Analytics (device class)

Segment key events (`sign_up`, `first_export`, `checkout_started`) by device type in GA4 explorations.
