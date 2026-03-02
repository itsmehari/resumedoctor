# Analytics & Pixel Tracking

ResumeDoctor uses consent-gated analytics and ad pixels. Scripts load only after the user accepts cookies.

## Configuration

Set these optional env vars (all optional; GA has a default fallback):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID (default: G-K4VS43PF7T) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta (Facebook) Pixel ID |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | LinkedIn Insight Tag Partner ID |

## Events Tracked

| Event | When | GA4 | Meta | LinkedIn |
|-------|------|-----|------|----------|
| `page_view` | Route change | ✓ | ✓ | ✓ |
| `sign_up` | Account created | ✓ | Lead | Conversion |
| `trial_start` | OTP verified, trial started | ✓ | CompleteRegistration | Conversion |
| `resume_created` | First resume created | ✓ | Custom | - |
| `upgrade_click` | "Upgrade to Pro" clicked | ✓ | Custom | - |
| `resume_export` | PDF/Word downloaded | ✓ | Custom | - |
| `cover_letter_created` | Cover letter created | ✓ | - | - |
| `cover_letter_export` | Cover letter exported | ✓ | - | - |
| `template_selected` | Template chosen | ✓ | - | - |

## Implementation

- **Analytics wrapper:** `src/lib/analytics.ts`
- **Consent:** `src/contexts/consent-context.tsx`, `src/components/consent-banner.tsx`
- **Script loader:** `src/components/analytics-provider.tsx`
- **Event calls:** In signup, try flow, export buttons, settings, etc.

## Testing Checklist (Phase 6)

1. [ ] Accept consent → GA4 loads, page_view fires
2. [ ] Reject consent → No scripts load
3. [ ] Sign up → `sign_up` event
4. [ ] Trial verify → `trial_start` event
5. [ ] Create resume (trial templates) → `resume_created`
6. [ ] Click "Upgrade to Pro" → `upgrade_click`
7. [ ] Download PDF → `resume_export` (format: pdf)
8. [ ] Download Word → `resume_export` (format: docx)
9. [ ] Create cover letter → `cover_letter_created`
10. [ ] Export cover letter → `cover_letter_export`
11. [ ] UTM params present → Passed to events

## GA4 DebugView

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) or enable `debug_mode: true` in gtag config
2. Open GA4 → Admin → DebugView
3. Trigger events and verify they appear

## Meta Events Manager

1. Meta Business Suite → Events Manager
2. Select your Pixel
3. Test events with "Test Events" tab

## Privacy

- Consent stored in `localStorage` under `rd_analytics_consent`
- Scripts load only when `accepted`
- Document in Privacy Policy: analytics tools, data collected, user rights
