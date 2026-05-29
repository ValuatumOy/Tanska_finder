# WordPress Export Rebuild Context

Source export: `C:\Users\Lauri H\Downloads\creditreportsdk.WordPress.2026-05-29.xml`

Generated: 2026-05-29 12:54:38

## Start Here

This folder turns the WordPress export into files another coding agent can use without re-parsing WXR/XML.

- Page inventory: `content-inventory.json`
- Full structured content: `all-content.json`
- Media index and download report: `media-index.json`
- Per-page source: `pages/<slug>/page.md`, `page.json`, `raw.html`, `localized.html`
- Local media root for the static site: `/assets/wordpress-media/`
- Original export copy: `source/creditreportsdk.WordPress.2026-05-29.xml`

Use `localized.html` when copying old layout/content because WordPress media URLs have been replaced with local project paths where possible. Use `page.md` when you only need clean text, headings, lists, tables, links, and the asset list.

## Site Summary

- Site: CreditReports.dk (https://creditreports.dk)
- Description: Credit risk reports and company valuations for companies in Denmark.
- Export item counts: {"attachment": 150, "nav_menu_item": 23, "custom_css": 1, "elementor_library": 1, "page": 42, "wp_block": 7, "saswp": 1, "wpcf7_contact_form": 1, "wp_global_styles": 2, "wp_navigation": 1}
- Pages: 42 total, {'draft': 12, 'publish': 29, 'trash': 1}
- Media records: 195 total (150 WordPress attachments, 12 referenced WordPress variants, 33 extra referenced assets)
- Download results: {"exists": 185, "failed": 2, "downloaded": 8}

## Existing Frontend Routes

- `/companies/en/`
- `/companies/en/companies/example-company/`
- `/en/`
- `/en/ai-credit-report/`
- `/en/contact/`
- `/en/create-account/`
- `/en/login/`
- `/en/pricing/`
- `/en/product/`
- `/en/products/company-valuation-tool/`
- `/en/products/credit-risk-assessment-methods/`
- `/en/products/credit-risk-tool/`
- `/en/support/`
- `/en/support/credit-risk-faq/`
- `/en/support/credit-risk-management/`
- `/en/support/credit-risk-manual/`
- `/en/support/credit-risk-model-overview/`
- `/en/support/get-started/`

## Published Pages To Rebuild / Merge

| Old page | Suggested new route | Assets | File |
|---|---:|---:|---|
| HomeOLD (`/home222/`) | `/en/home222/` | 9 | `pages/home222/page.md` |
| Product (`/product/`) | `/en/product/` | 6 | `pages/product/page.md` |
| Credit Risk Assessment Methods (`/product/credit-risk-assessment-methods/`) | `/en/products/credit-risk-assessment-methods/` | 4 | `pages/credit-risk-assessment-methods/page.md` |
| Contact us (`/contactold/`) | `/en/contact/` | 0 | `pages/contactold/page.md` |
| Pricing (`/pricing/`) | `/en/pricing/` | 2 | `pages/pricing/page.md` |
| Privacy Policy (`/privacy-policy/`) | `/en/privacy-policy/` | 0 | `pages/privacy-policy/page.md` |
| Company Valuation Tool (`/product/company-valuation-tool/`) | `/en/products/company-valuation-tool/` | 6 | `pages/company-valuation-tool/page.md` |
| Credit Risk Management (`/support/credit-risk-management/`) | `/en/support/credit-risk-management/` | 3 | `pages/credit-risk-management/page.md` |
| Company Views (`/support/credit-risk-manual-company-views/`) | `/en/support/credit-risk-manual-company-views/` | 25 | `pages/credit-risk-manual-company-views/page.md` |
| Comparisons (`/support/comparisons/`) | `/en/support/comparisons/` | 2 | `pages/comparisons/page.md` |
| Estimate Generation (`/support/estimate-generation/`) | `/en/support/estimate-generation/` | 6 | `pages/estimate-generation/page.md` |
| General (`/support/credit-risk-manualold/general/`) | `/en/support/credit-risk-manualold/general/` | 0 | `pages/general/page.md` |
| Credit Risk Manual (`/support/credit-risk-manual/`) | `/en/support/credit-risk-manual/` | 0 | `pages/credit-risk-manual/page.md` |
| Support (`/support/`) | `/en/support/` | 6 | `pages/support/page.md` |
| Get Started (`/support/get-started/`) | `/en/support/get-started/` | 7 | `pages/get-started/page.md` |
| All Cleaning ApS, 35831894 (`/all-cleaning-aps/`) | `/en/all-cleaning-aps/` | 2 | `pages/all-cleaning-aps/page.md` |
| ALLAN STEEN HANSEN TØMRER- OG ENTREPRENØRFIRMA ApS, 33356455 (`/allan-steen-hansen-tomrer-og-entreprenorfirma-aps/`) | `/en/allan-steen-hansen-tomrer-og-entreprenorfirma-aps/` | 2 | `pages/allan-steen-hansen-tomrer-og-entreprenorfirma-aps/page.md` |
| ANDERS BRØNDUM EJENDOMME III ApS, 25566769 (`/anders-brondum-ejendomme-iii-aps/`) | `/en/anders-brondum-ejendomme-iii-aps/` | 2 | `pages/anders-brondum-ejendomme-iii-aps/page.md` |
| ANKERHUS INVEST ApS, 30509315 (`/ankerhus-invest-aps/`) | `/en/ankerhus-invest-aps/` | 2 | `pages/ankerhus-invest-aps/page.md` |
| ANPARTSSELSKABET AF 28. AUGUST 2014, 34703604 (`/anpartsselskabet-af-28-august-2014/`) | `/en/anpartsselskabet-af-28-august-2014/` | 2 | `pages/anpartsselskabet-af-28-august-2014/page.md` |
| FAQ (`/support/faq-old/`) | `/en/support/credit-risk-faq/` | 3 | `pages/faq-old/page.md` |
| Platform Tutorials (`/support/platform-tutorials/`) | `/en/support/platform-tutorials/` | 4 | `pages/platform-tutorials/page.md` |
| Support (`/support-2/`) | `/en/support/` | 6 | `pages/support-2/page.md` |
| Credit Risk Model Overview (`/support/credit-risk-model-overview-3/`) | `/en/support/credit-risk-model-overview-3/` | 12 | `pages/credit-risk-model-overview-3/page.md` |
| Contact us (`/contact/`) | `/en/contact/` | 1 | `pages/contact/page.md` |
| Credit Risk Model Overview (`/support/credit-risk-model-overview/`) | `/en/support/credit-risk-model-overview/` | 14 | `pages/credit-risk-model-overview/page.md` |
| Home (`/`) | `/en/` | 9 | `pages/home-7/page.md` |
| Credit Risk FAQ (`/support/credit-risk-faq/`) | `/en/support/credit-risk-faq/` | 3 | `pages/credit-risk-faq/page.md` |
| Home Preview testi (`/crdk-preview-x7k92/`) | `/en/crdk-preview-x7k92/` | 8 | `pages/crdk-preview-x7k92/page.md` |

## High-Signal Pages With Lots Of Content Or Assets

- HomeOLD: `pages/home222/page.md` (20024 chars, 9 assets)
- Product: `pages/product/page.md` (28560 chars, 6 assets)
- Credit Risk Assessment Methods: `pages/credit-risk-assessment-methods/page.md` (9864 chars, 4 assets)
- Contact us: `pages/contactold/page.md` (1403 chars, 0 assets)
- Pricing: `pages/pricing/page.md` (16288 chars, 2 assets)
- Privacy Policy: `pages/privacy-policy/page.md` (8807 chars, 0 assets)
- Company Valuation Tool: `pages/company-valuation-tool/page.md` (13396 chars, 6 assets)
- Credit Risk Management: `pages/credit-risk-management/page.md` (6655 chars, 3 assets)
- Company Views: `pages/credit-risk-manual-company-views/page.md` (47612 chars, 25 assets)
- Comparisons: `pages/comparisons/page.md` (8054 chars, 2 assets)
- Estimate Generation: `pages/estimate-generation/page.md` (14147 chars, 6 assets)
- Credit Risk Manual: `pages/credit-risk-manual/page.md` (8974 chars, 0 assets)
- Support: `pages/support/page.md` (13380 chars, 6 assets)
- Get Started: `pages/get-started/page.md` (16326 chars, 7 assets)
- All Cleaning ApS, 35831894: `pages/all-cleaning-aps/page.md` (9178 chars, 2 assets)
- ALLAN STEEN HANSEN TØMRER- OG ENTREPRENØRFIRMA ApS, 33356455: `pages/allan-steen-hansen-tomrer-og-entreprenorfirma-aps/page.md` (9180 chars, 2 assets)
- ANDERS BRØNDUM EJENDOMME III ApS, 25566769: `pages/anders-brondum-ejendomme-iii-aps/page.md` (9216 chars, 2 assets)
- ANKERHUS INVEST ApS, 30509315: `pages/ankerhus-invest-aps/page.md` (9191 chars, 2 assets)
- ANPARTSSELSKABET AF 28. AUGUST 2014, 34703604: `pages/anpartsselskabet-af-28-august-2014/page.md` (9150 chars, 2 assets)
- FAQ: `pages/faq-old/page.md` (7810 chars, 3 assets)
- Platform Tutorials: `pages/platform-tutorials/page.md` (15968 chars, 4 assets)
- Support: `pages/support-2/page.md` (13306 chars, 6 assets)
- Credit Risk Model Overview: `pages/credit-risk-model-overview-3/page.md` (40757 chars, 12 assets)
- Contact us: `pages/contact/page.md` (2655 chars, 1 assets)
- Credit Risk Model Overview: `pages/credit-risk-model-overview/page.md` (49742 chars, 14 assets)
- Home: `pages/home-7/page.md` (21907 chars, 9 assets)
- Credit Risk FAQ: `pages/credit-risk-faq/page.md` (15954 chars, 3 assets)
- Home Preview testi: `pages/crdk-preview-x7k92/page.md` (29250 chars, 8 assets)

## Draft / Old / Trashed Pages

These are preserved because older drafts often contain copy or media that is still useful.

- Allegiant Backup Settings [draft]: `pages/allegiant-backup-settings/page.md` old `/`
- What Is Credit Risk? [draft]: `pages/what-is-credit-risk/page.md` old `/`
- About us [draft]: `pages/about-us/page.md` old `/`
- Prices [draft]: `pages/prices/page.md` old `/`
- Credit Risk Manual [draft]: `pages/credit-risk-manualold/page.md` old `/`
- Allegiant Pro Backup Settings [draft]: `pages/allegiant-pro-backup-settings/page.md` old `/`
- Home [draft]: `pages/home/page.md` old `/`
- Home [draft]: `pages/home-2/page.md` old `/`
- Home [draft]: `pages/home-3/page.md` old `/`
- Home [draft]: `pages/home-4/page.md` old `/`
- Home [draft]: `pages/home-5/page.md` old `/`
- Home [draft]: `pages/home-6/page.md` old `/`
- Get Started [trash]: `pages/get-startedold-trashed/page.md` old `/`

## Reusable Blocks

- Untitled Reusable Block: `wp_block/untitled-reusable-block/page.md`
- general: `wp_block/untitled-reusable-block-2/page.md`
- Fin.data table: `wp_block/untitled-reusable-block-3/page.md`
- Uusi_Support: `wp_block/uusi-support/page.md`
- Uusi_Support2: `wp_block/uusi-support2/page.md`
- Uusi_Support3: `wp_block/uusi-support3/page.md`
- testi: `wp_block/testi/page.md`

## Media Notes

The WordPress export stores media metadata, not binary files. This extractor downloaded what it could from direct URLs, S3 URLs found in export metadata, and downloadable image references from page content.

Failed media count: 2

- `assets/wordpress-media/2018/06/josh-calabrese-112481-unsplash.jpg` from https://creditreports.dk/wp-content/uploads/sites/9/2018/06/josh-calabrese-112481-unsplash.jpg - HTTPError: HTTP Error 404: Not Found
- `assets/wordpress-media/2018/06/josh-calabrese-112481-unsplash1.jpg` from https://creditreports.dk/wp-content/uploads/sites/9/2018/06/josh-calabrese-112481-unsplash1.jpg - HTTPError: HTTP Error 404: Not Found

## Suggested Agent Workflow

1. Open this file, then `content-inventory.json`.
2. For each existing frontend route, find the matching old page via `suggested_new_route`.
3. Copy missing text from `pages/<slug>/page.md`.
4. Copy image/PDF references from the page's `Asset References` section. Prefer local paths like `/assets/wordpress-media/...`.
5. If an asset is marked `external` or appears in the failed list, keep the original URL or replace it with a new generated/available asset.
