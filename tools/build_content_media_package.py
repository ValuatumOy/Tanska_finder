#!/usr/bin/env python3
"""Build a content-and-media-only handoff from the extracted WordPress package."""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import shutil
import sys
import urllib.parse
from pathlib import Path
from typing import Any


IMG_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}


def slugify(value: str, fallback: str = "page") -> str:
    value = html.unescape(value or "").lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value or fallback


def strip_tags(value: str) -> str:
    value = re.sub(r"<script[\s\S]*?</script>", " ", value, flags=re.I)
    value = re.sub(r"<style[\s\S]*?</style>", " ", value, flags=re.I)
    value = re.sub(r"<!--[\s\S]*?-->", " ", value)
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def table_cell(value: Any) -> str:
    text = str(value or "")
    text = text.replace("\n", " ").replace("|", "\\|")
    return text


def asset_type(url: str, fallback_status: str = "") -> str:
    ext = Path(urllib.parse.urlparse(url).path).suffix.lower()
    if ext in IMG_EXTS:
        return "image"
    if ext == ".pdf":
        return "pdf"
    if ext == ".mp4":
        return "video"
    if ext == ".pptx":
        return "presentation"
    return fallback_status or "asset"


def clean_markdown(markdown: str) -> str:
    markdown = markdown or ""
    markdown = markdown.replace("\ufeff", "")
    markdown = re.sub(r"<!--\s*/?wp:[\s\S]*?-->", "", markdown)
    markdown = re.sub(r"={8,}\s*DROP-IN START\s*={8,}", "", markdown, flags=re.I)
    markdown = re.sub(r"={8,}\s*DROP-IN END\s*={8,}", "", markdown, flags=re.I)
    markdown = re.sub(r"\n{3,}", "\n\n", markdown)
    return markdown.strip()


def headings_with_positions(html_text: str) -> list[dict[str, Any]]:
    headings = []
    for match in re.finditer(r"<h([1-6])[^>]*>([\s\S]*?)</h\1>", html_text or "", flags=re.I):
        label = strip_tags(match.group(2))
        if label:
            headings.append({"pos": match.start(), "level": int(match.group(1)), "text": label})
    return headings


def heading_before(headings: list[dict[str, Any]], pos: int) -> str:
    previous = [heading for heading in headings if heading["pos"] <= pos]
    return previous[-1]["text"] if previous else ""


def classify_occurrence(html_text: str, pos: int, url: str) -> tuple[str, str]:
    ext_type = asset_type(url)
    tag_start = html_text.rfind("<", 0, pos)
    previous_tag_end = html_text.rfind(">", 0, pos)
    tag_end = html_text.find(">", pos)
    inside_tag = tag_start > previous_tag_end and tag_end >= pos
    tag = html_text[tag_start : tag_end + 1] if inside_tag else ""
    tag_lower = tag.lower()

    if tag_lower.startswith("<img"):
        return "inline image", ""

    if tag_lower.startswith("<a"):
        close = html_text.lower().find("</a>", tag_end)
        link_html = html_text[tag_start : close + 4] if close > tag_end else tag
        label = strip_tags(link_html)
        if label:
            return f"{ext_type} link", label
        return f"{ext_type} link", ""

    before = html_text[max(0, pos - 500) : pos]
    after = html_text[pos : pos + 500]
    around = before + after
    if "background" in around.lower() or "url(" in around.lower() or "style=" in around.lower():
        placement_type = "background/section image" if ext_type == "image" else f"section {ext_type}"
        return placement_type, ""

    return ext_type, ""


def context_around(html_text: str, pos: int, fallback: str = "") -> str:
    if pos < 0:
        return fallback
    snippet = html_text[max(0, pos - 350) : pos + 350]
    text = strip_tags(snippet)
    if len(text) > 220:
        text = text[:217].rstrip() + "..."
    return text or fallback


def find_positions(html_text: str, markdown: str, ref: dict[str, Any]) -> list[dict[str, Any]]:
    candidates = [ref.get("local_url"), ref.get("url")]
    candidates = [candidate for candidate in candidates if candidate]
    seen: set[tuple[str, int]] = set()
    positions = []
    headings = headings_with_positions(html_text)

    for candidate in candidates:
        start = 0
        while True:
            pos = html_text.find(candidate, start)
            if pos < 0:
                break
            key = (candidate, pos)
            if key not in seen:
                placement_type, label = classify_occurrence(html_text, pos, candidate)
                positions.append(
                    {
                        "html_position": pos,
                        "markdown_position": markdown.find(candidate),
                        "type": placement_type,
                        "link_label": label,
                        "section": heading_before(headings, pos),
                        "context": context_around(html_text, pos, heading_before(headings, pos)),
                    }
                )
                seen.add(key)
            start = pos + len(candidate)

    if not positions:
        markdown_pos = -1
        for candidate in candidates:
            markdown_pos = markdown.find(candidate)
            if markdown_pos >= 0:
                break
        positions.append(
            {
                "html_position": 999_999_999,
                "markdown_position": markdown_pos,
                "type": asset_type(ref.get("url") or ref.get("local_url"), ref.get("status")),
                "link_label": "",
                "section": "",
                "context": "Referenced by this WordPress page, but not found as an inline placement in cleaned content.",
            }
        )

    return positions


def build_page_media(entry: dict[str, Any]) -> list[dict[str, Any]]:
    placements = []
    html_text = entry.get("localized_html") or entry.get("raw_html") or ""
    markdown = clean_markdown(entry.get("markdown") or "")
    counter = 1
    for ref in entry.get("asset_refs", []):
        for occurrence in find_positions(html_text, markdown, ref):
            placements.append(
                {
                    "order": counter,
                    "type": occurrence["type"],
                    "section": occurrence["section"],
                    "context": (
                        "Background image in old WordPress section/block."
                        if occurrence["type"] == "background/section image" and not occurrence["section"]
                        else occurrence["context"]
                    ),
                    "link_label": occurrence["link_label"],
                    "local_url": ref.get("local_url", ""),
                    "local_path": ref.get("local_path", ""),
                    "source_url": ref.get("url", ""),
                    "status": ref.get("status", ""),
                    "markdown_position": occurrence["markdown_position"],
                    "html_position": occurrence["html_position"],
                }
            )
            counter += 1

    placements.sort(key=lambda item: (item["html_position"], item["order"]))
    for index, placement in enumerate(placements, start=1):
        placement["order"] = index
        placement.pop("html_position", None)
    return placements


def frontmatter(entry: dict[str, Any]) -> str:
    fields = {
        "wp_id": entry.get("id", ""),
        "status": entry.get("status", ""),
        "old_url": entry.get("link", ""),
        "old_path": entry.get("old_path", ""),
        "suggested_new_route": entry.get("suggested_new_route", ""),
        "modified": entry.get("modified", ""),
    }
    lines = ["---"]
    for key, value in fields.items():
        lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def page_markdown(entry: dict[str, Any], placements: list[dict[str, Any]]) -> str:
    content = clean_markdown(entry.get("markdown") or "")
    media_rows = [
        "| # | Type | Where / context | Local media | Source |",
        "|---:|---|---|---|---|",
    ]
    for item in placements:
        where = item["section"] or item["context"] or item["link_label"]
        if item["link_label"] and item["link_label"] not in where:
            where = f"{where} Link text: {item['link_label']}".strip()
        local = item["local_url"] or item["local_path"] or ""
        media_rows.append(
            f"| {item['order']} | {table_cell(item['type'])} | {table_cell(where)} | `{table_cell(local)}` | {table_cell(item['source_url'])} |"
        )

    if len(media_rows) == 2:
        media_block = "No media references found for this page."
    else:
        media_block = "\n".join(media_rows)

    return (
        frontmatter(entry)
        + f"# {entry.get('title')}\n\n"
        + "## Page Content\n\n"
        + (content or "_No page text extracted._")
        + "\n\n## Media Placement Map\n\n"
        + media_block
        + "\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frontend-dir", default=".", help="Frontend project root")
    parser.add_argument("--source", default="docs/wordpress-export/all-content.json")
    parser.add_argument("--media-index", default="docs/wordpress-export/media-index.json")
    parser.add_argument("--out", default="docs/wordpress-content-media")
    args = parser.parse_args()

    root = Path(args.frontend_dir).resolve()
    source_path = root / args.source
    media_index_path = root / args.media_index
    out_dir = root / args.out
    pages_dir = out_dir / "pages"

    if out_dir.exists():
        shutil.rmtree(out_dir)
    pages_dir.mkdir(parents=True, exist_ok=True)

    content = json.loads(source_path.read_text(encoding="utf-8"))
    media_index = json.loads(media_index_path.read_text(encoding="utf-8"))
    pages = [entry for entry in content if entry.get("type") == "page"]

    page_index = []
    media_by_page = []
    for entry in pages:
        slug = entry.get("unique_slug") or slugify(entry.get("title", "page"), entry.get("id", "page"))
        placements = build_page_media(entry)
        md_file = f"pages/{slug}.md"
        json_file = f"pages/{slug}.json"

        (out_dir / md_file).write_text(page_markdown(entry, placements), encoding="utf-8")
        (out_dir / json_file).write_text(
            json.dumps(
                {
                    "title": entry.get("title"),
                    "wp_id": entry.get("id"),
                    "status": entry.get("status"),
                    "old_url": entry.get("link"),
                    "old_path": entry.get("old_path"),
                    "suggested_new_route": entry.get("suggested_new_route"),
                    "modified": entry.get("modified"),
                    "content_markdown": clean_markdown(entry.get("markdown") or ""),
                    "media_placements": placements,
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

        page_index.append(
            {
                "title": entry.get("title"),
                "wp_id": entry.get("id"),
                "status": entry.get("status"),
                "old_path": entry.get("old_path"),
                "suggested_new_route": entry.get("suggested_new_route"),
                "content_file": md_file,
                "structured_file": json_file,
                "media_count": len(placements),
            }
        )
        media_by_page.append(
            {
                "title": entry.get("title"),
                "wp_id": entry.get("id"),
                "status": entry.get("status"),
                "old_path": entry.get("old_path"),
                "suggested_new_route": entry.get("suggested_new_route"),
                "media_placements": placements,
            }
        )

    (out_dir / "pages-index.json").write_text(json.dumps(page_index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (out_dir / "media-by-page.json").write_text(json.dumps(media_by_page, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    rows = [
        "| Page | Status | Suggested route | Media | File |",
        "|---|---|---|---:|---|",
    ]
    for page in page_index:
        rows.append(
            f"| {table_cell(page['title'])} | {table_cell(page['status'])} | `{table_cell(page['suggested_new_route'])}` | {page['media_count']} | `{page['content_file']}` |"
        )
    (out_dir / "pages-index.md").write_text("\n".join(rows) + "\n", encoding="utf-8")

    local_media = [
        {
            "title": item.get("title"),
            "local_url": item.get("local_url"),
            "local_path": item.get("local_path"),
            "source_url": item.get("url"),
            "download_status": (item.get("download") or {}).get("status"),
            "bytes": (item.get("download") or {}).get("bytes"),
        }
        for item in media_index.get("media", [])
    ]
    (out_dir / "media-index.json").write_text(
        json.dumps({"summary": media_index.get("summary", {}), "media": local_media}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    readme = f"""# WordPress Content + Media Only

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
"""
    (out_dir / "README.md").write_text(readme, encoding="utf-8")

    print(f"Wrote content/media-only package to: {out_dir}")
    print(f"Pages: {len(page_index)}")
    print(f"Media records: {len(local_media)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
