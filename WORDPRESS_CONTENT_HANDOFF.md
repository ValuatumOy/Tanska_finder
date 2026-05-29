# WordPress Content Handoff

Start here for content and media only:

`docs/wordpress-content-media/README.md`

The main page list is:

`docs/wordpress-content-media/pages-index.md`

Each `docs/wordpress-content-media/pages/<slug>.md` file has the page copy and a media placement table showing which media belongs to that page and roughly where it appears.

The fuller WordPress extraction package is here if raw WordPress source is ever needed:

`docs/wordpress-export/AGENT_CONTEXT.md`

That package was generated from:

`C:\Users\Lauri H\Downloads\creditreportsdk.WordPress.2026-05-29.xml`

It contains:

- 42 WordPress pages, including published, draft, and trashed versions
- content/media-only page files in `docs/wordpress-content-media/pages/`
- a route/content inventory in `docs/wordpress-content-media/pages-index.json`
- page-level media placement data in `docs/wordpress-content-media/media-by-page.json`
- local media files under `/assets/wordpress-media/`

For rebuilding pages, use the `suggested_new_route` fields in `pages-index.json`, then copy missing copy and media from each `pages/<slug>.md`. Inline images appear directly inside the markdown content. Background images, PDF links, and other non-inline media are listed in the page's `Media Placement Map`.

Download status: 193 of 195 media records were available locally after extraction. The 2 failed downloads are old 2018 Unsplash attachments and are not referenced by any extracted page content.

Regenerate the package with:

```powershell
& 'C:\Users\Lauri H\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' '.\tools\extract_wordpress_export.py' --xml 'C:\Users\Lauri H\Downloads\creditreportsdk.WordPress.2026-05-29.xml' --frontend-dir '.'
& 'C:\Users\Lauri H\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' '.\tools\build_content_media_package.py' --frontend-dir '.'
```
