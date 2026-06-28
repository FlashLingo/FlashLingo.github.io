# Legal content (public pages source)

Bilingual (Spanish + English) **drafts** for the public legal pages that the app
links to from its general settings screen. They are written from FlashLingo's
verified technical behavior, but they are **not legal advice** — have them
reviewed by a legal professional and fill in the `[ ]` placeholders (governing
jurisdiction, address/tax id if applicable) before publishing.

| Document | Publish to |
| --- | --- |
| [privacy-policy.md](privacy-policy.md) | `https://flashlingo.github.io/privacy.html` |
| [terms-of-service.md](terms-of-service.md) | `https://flashlingo.github.io/terms.html` |
| [legal-notice.md](legal-notice.md) | `https://flashlingo.github.io/legal.html` |

These three pages are currently empty online, which is a Play Store publication
blocker (a working privacy policy is mandatory because the app uses Google
AdMob / Advertising ID). Publishing the content below resolves that blocker.

The app opens these URLs from `lib/features/settings/general_settings_page.dart`
(the `_privacyUri` / `_termsUri` / `_legalUri` entries, shown under the legal
section) with `launchUrl` in external mode, regardless of the in-app UI language,
so each published page is intentionally bilingual.

Before publishing:

- [ ] Legal review of all three documents.
- [ ] Set the governing jurisdiction/country.
- [ ] Confirm the public contact email (currently `flashlingo.lenguageapp@gmail.com`).
- [ ] Set the effective/last-updated date you want to show publicly.
- [ ] Convert to HTML and publish at the URLs above.
