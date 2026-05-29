# WordPress Content + Media Only

Use this folder when you only need page copy and media placement, not old WordPress design/layout files.

## Files To Use

- `pages-index.md` - quick human-readable page list.
- `pages-index.json` - same page list for an agent/script.
- `pages/<slug>.md` - one page's clean content plus a media placement table.
- `pages/<slug>.json` - structured version with `content_markdown` and `media_placements`.
- `media-by-page.json` - all pages with their media in original page order.
- `media-index.json` - local media inventory and download status.

## Media Location

Actual media files are in:

`/assets/wordpress-media/`

Use the `local_url` / `local_path` values from the page files. Inline images appear directly in `Page Content` as markdown image tags where the old content placed them. Other media, such as background images or PDF links, is listed in `Media Placement Map` with type, section/context, local file, and original source URL.

Generated from `docs/wordpress-export/all-content.json`.
