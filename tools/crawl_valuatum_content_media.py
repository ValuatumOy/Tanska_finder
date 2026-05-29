#!/usr/bin/env python3
"""Create a content/media-only handoff folder for valuatum.com."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import mimetypes
import os
import re
import shutil
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from lxml import etree
from lxml import html as lxml_html


SITEMAP_NS = {
    "sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
    "image": "http://www.google.com/schemas/sitemap-image/1.1",
}

IMG_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}
DOC_EXTS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".zip"}
VIDEO_EXTS = {".mp4", ".mov", ".webm", ".m4v"}
DOWNLOAD_EXTS = IMG_EXTS | DOC_EXTS | VIDEO_EXTS
ASSET_URL_RE = re.compile(
    r"https?://[^\s\"'<>)]*?\.(?:png|jpe?g|gif|webp|svg|pdf|docx?|xlsx?|pptx?|zip|mp4|mov|webm|m4v)(?:\?[^\s\"'<>)]*)?",
    re.I,
)
STYLE_URL_RE = re.compile(r"url\((?:'|\")?([^'\")]+)(?:'|\")?\)", re.I)

USER_AGENT = "Mozilla/5.0 content/media handoff crawler"
TIMEOUT = 35


class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        old = urllib.parse.urldefrag(req.full_url)[0].rstrip("/")
        new = urllib.parse.urldefrag(newurl)[0].rstrip("/")
        if old == new:
            return None
        return super().redirect_request(req, fp, code, msg, headers, newurl)


OPENER = urllib.request.build_opener(SafeRedirect)


def fetch_bytes(url: str) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with OPENER.open(request, timeout=TIMEOUT) as response:
        final_url = response.geturl()
        return response.read(), final_url


def fetch_text(url: str) -> tuple[str, str]:
    data, final_url = fetch_bytes(url)
    return data.decode("utf-8", errors="replace"), final_url


def slugify(value: str, fallback: str = "page") -> str:
    value = html.unescape(value or "").lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value or fallback


def unique_slug(slug: str, seen: dict[str, int]) -> str:
    if slug not in seen:
        seen[slug] = 1
        return slug
    index = seen[slug] + 1
    while True:
        candidate = f"{slug}-{index}"
        if candidate not in seen:
            seen[slug] = index
            seen[candidate] = 1
            return candidate
        index += 1


def normalize_url(url: str, base: str) -> str:
    url = html.unescape((url or "").strip())
    if not url or url.startswith(("mailto:", "tel:", "javascript:", "#")):
        return url
    url = urllib.parse.urljoin(base, url)
    parsed = urllib.parse.urlparse(url)
    clean = parsed._replace(fragment="")
    return urllib.parse.urlunparse(clean)


def strip_tracking_query(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    if not parsed.query:
        return url
    keep = []
    for key, value in urllib.parse.parse_qsl(parsed.query, keep_blank_values=True):
        if key.lower() in {"ver", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"}:
            continue
        keep.append((key, value))
    return urllib.parse.urlunparse(parsed._replace(query=urllib.parse.urlencode(keep)))


def url_ext(url: str) -> str:
    return Path(urllib.parse.urlparse(url).path).suffix.lower()


def asset_type(url: str) -> str:
    ext = url_ext(url)
    if ext in IMG_EXTS:
        return "image"
    if ext == ".pdf":
        return "pdf"
    if ext in {".doc", ".docx"}:
        return "document"
    if ext in {".xls", ".xlsx"}:
        return "spreadsheet"
    if ext in {".ppt", ".pptx"}:
        return "presentation"
    if ext in VIDEO_EXTS:
        return "video"
    if "youtube.com" in url or "youtu.be" in url or "vimeo.com" in url:
        return "embedded video"
    return "asset"


def is_downloadable(url: str) -> bool:
    return url_ext(url) in DOWNLOAD_EXTS


def safe_rel_from_url(url: str) -> Path:
    parsed = urllib.parse.urlparse(url)
    parts = [urllib.parse.unquote(part) for part in parsed.path.split("/") if part]
    if "uploads" in parts:
        parts = parts[parts.index("uploads") + 1 :]
        if parts[:2] == ["sites", "10"]:
            parts = parts[2:]
    elif parsed.netloc and parsed.netloc not in {"www.valuatum.com", "valuatum.com"}:
        parts = ["external-" + slugify(parsed.netloc, "host")] + parts
    if not parts:
        parts = [slugify(parsed.netloc or "asset")]

    filename = parts[-1]
    if "." not in filename:
        guessed = mimetypes.guess_extension(mimetypes.guess_type(url)[0] or "") or ".asset"
        filename = filename + guessed
    filename = re.sub(r"[<>:\"/\\|?*]+", "-", filename)
    parts[-1] = filename
    clean_parts = [slugify(part, "part") if index < len(parts) - 1 else part for index, part in enumerate(parts)]
    return Path(*clean_parts)


def text_content(node: etree._Element | None) -> str:
    if node is None:
        return ""
    value = " ".join(part.strip() for part in node.itertext() if part and part.strip())
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def clean_text(value: str) -> str:
    value = re.sub(r"\s+", " ", html.unescape(value or ""))
    return value.strip()


def remove_noise(root: etree._Element) -> None:
    noise_xpath = (
        ".//script|.//style|.//noscript|.//header|.//footer|.//nav|"
        ".//*[@id='cookie-law-info-bar']|.//*[@id='cookie-law-info-again']|"
        ".//*[contains(concat(' ', normalize-space(@class), ' '), ' cli-modal ')]|"
        ".//*[contains(concat(' ', normalize-space(@class), ' '), ' menu-main ')]|"
        ".//*[contains(concat(' ', normalize-space(@class), ' '), ' menu-mobile ')]|"
        ".//*[contains(concat(' ', normalize-space(@class), ' '), ' breadcrumb ')]"
    )
    for node in list(root.xpath(noise_xpath)):
        parent = node.getparent()
        if parent is not None:
            parent.remove(node)


def content_root(doc: etree._Element) -> etree._Element:
    candidates = doc.xpath("//*[@id='main']") or doc.xpath("//main") or doc.xpath("//article")
    if candidates:
        root = candidates[0]
    else:
        body = doc.find("body")
        root = body if body is not None else doc
    root = lxml_html.fromstring(etree.tostring(root, encoding="unicode"))
    remove_noise(root)
    return root


def inline_markdown(node: etree._Element, url_map: dict[str, str]) -> str:
    parts: list[str] = []
    if node.text:
        parts.append(node.text)
    for child in node:
        tag = child.tag.lower() if isinstance(child.tag, str) else ""
        if tag == "br":
            parts.append("\n")
        elif tag == "a":
            href = normalize_url(child.get("href") or "", "")
            label = inline_markdown(child, url_map).strip() or href
            href = url_map.get(href, href)
            parts.append(f"[{label}]({href})" if href and label else label)
        elif tag == "img":
            src = normalize_url(child.get("src") or child.get("data-src") or "", "")
            alt = child.get("alt") or ""
            src = url_map.get(src, src)
            if src:
                parts.append(f"![{alt}]({src})")
        elif tag in {"strong", "b"}:
            value = inline_markdown(child, url_map).strip()
            parts.append(f"**{value}**" if value else "")
        elif tag in {"em", "i"}:
            value = inline_markdown(child, url_map).strip()
            parts.append(f"*{value}*" if value else "")
        else:
            parts.append(inline_markdown(child, url_map))
        if child.tail:
            parts.append(child.tail)
    value = "".join(parts)
    value = re.sub(r"[ \t\r\f\v]+", " ", value)
    value = re.sub(r" *\n *", "\n", value)
    return html.unescape(value)


def node_markdown(node: etree._Element, url_map: dict[str, str]) -> str:
    tag = node.tag.lower() if isinstance(node.tag, str) else ""
    if tag in {"script", "style", "noscript"}:
        return ""
    if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
        level = int(tag[1])
        value = inline_markdown(node, url_map).strip()
        return f"\n{'#' * level} {value}\n\n" if value else ""
    if tag == "p":
        value = inline_markdown(node, url_map).strip()
        return f"{value}\n\n" if value else ""
    if tag == "li":
        value = inline_markdown(node, url_map).strip()
        return f"- {value}\n" if value else ""
    if tag in {"ul", "ol"}:
        return "".join(node_markdown(child, url_map) for child in node).strip() + "\n\n"
    if tag == "blockquote":
        value = children_markdown(node, url_map).strip()
        value = "\n".join(f"> {line}" if line else ">" for line in value.splitlines())
        return f"{value}\n\n" if value else ""
    if tag == "img":
        src = normalize_url(node.get("src") or node.get("data-src") or "", "")
        alt = node.get("alt") or ""
        src = url_map.get(src, src)
        return f"![{alt}]({src})\n\n" if src else ""
    if tag == "figure":
        return children_markdown(node, url_map)
    if tag == "figcaption":
        value = inline_markdown(node, url_map).strip()
        return f"*{value}*\n\n" if value else ""
    if tag == "table":
        rows = []
        for tr in node.xpath(".//tr"):
            cells = [inline_markdown(cell, url_map).strip().replace("|", "\\|") for cell in tr.xpath("./th|./td")]
            if cells:
                rows.append(cells)
        if not rows:
            return ""
        max_cols = max(len(row) for row in rows)
        rows = [row + [""] * (max_cols - len(row)) for row in rows]
        lines = ["| " + " | ".join(rows[0]) + " |", "| " + " | ".join(["---"] * max_cols) + " |"]
        lines.extend("| " + " | ".join(row) + " |" for row in rows[1:])
        return "\n".join(lines) + "\n\n"
    return children_markdown(node, url_map)


def children_markdown(node: etree._Element, url_map: dict[str, str]) -> str:
    parts: list[str] = []
    if node.text and node.text.strip():
        parts.append(clean_text(node.text) + "\n\n")
    for child in node:
        parts.append(node_markdown(child, url_map))
        if child.tail and child.tail.strip():
            parts.append(clean_text(child.tail) + "\n\n")
    return "".join(parts)


def html_to_markdown(root: etree._Element, url_map: dict[str, str]) -> str:
    md = children_markdown(root, url_map)
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.strip()


def nearest_heading(node: etree._Element) -> str:
    current = node
    while current is not None:
        prev = current.getprevious()
        while prev is not None:
            tag = prev.tag.lower() if isinstance(prev.tag, str) else ""
            if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
                return text_content(prev)
            headings = prev.xpath(".//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]")
            if headings:
                return text_content(headings[-1])
            prev = prev.getprevious()
        current = current.getparent()
    return ""


def context_for_node(node: etree._Element) -> str:
    parent = node.getparent()
    candidates = [node, parent, parent.getparent() if parent is not None else None]
    for candidate in candidates:
        value = text_content(candidate)
        if value and len(value) > 12:
            return value[:260] + ("..." if len(value) > 260 else "")
    return ""


def table_cell(value: Any) -> str:
    value = str(value or "")
    value = value.replace("\n", " ").replace("|", "\\|")
    return value


def parse_srcset(value: str, base_url: str) -> list[str]:
    urls = []
    for part in (value or "").split(","):
        candidate = part.strip().split(" ")[0]
        if candidate:
            urls.append(normalize_url(candidate, base_url))
    return urls


def add_media(
    placements: list[dict[str, Any]],
    url: str,
    page_url: str,
    placement_type: str,
    node: etree._Element | None = None,
    section: str = "",
    context: str = "",
    link_label: str = "",
) -> None:
    url = strip_tracking_query(normalize_url(url, page_url))
    if not url or url.startswith(("mailto:", "tel:", "javascript:", "#")):
        return
    placements.append(
        {
            "type": placement_type,
            "asset_type": asset_type(url),
            "section": section or (nearest_heading(node) if node is not None else ""),
            "context": context or (context_for_node(node) if node is not None else ""),
            "link_label": clean_text(link_label),
            "source_url": url,
            "local_url": "",
            "local_path": "",
            "status": "pending",
        }
    )


def collect_page_data(root: etree._Element, page_url: str, sitemap_images: list[str], head_images: list[str]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    placements: list[dict[str, Any]] = []
    links: list[dict[str, Any]] = []

    for img in root.xpath(".//img"):
        src = img.get("src") or img.get("data-src")
        if src:
            add_media(placements, src, page_url, "inline image", img)
        for srcset_url in parse_srcset(img.get("srcset") or img.get("data-srcset") or "", page_url):
            add_media(placements, srcset_url, page_url, "responsive image variant", img)

    for node in root.xpath(".//*[@style]"):
        for url in STYLE_URL_RE.findall(node.get("style") or ""):
            add_media(placements, url, page_url, "background/section image", node)

    for node in root.xpath(".//video|.//source"):
        src = node.get("src")
        if src:
            add_media(placements, src, page_url, "video file", node)

    for iframe in root.xpath(".//iframe"):
        src = iframe.get("src")
        if src:
            add_media(placements, src, page_url, "embedded video", iframe)

    for anchor in root.xpath(".//a[@href]"):
        href = normalize_url(anchor.get("href") or "", page_url)
        label = text_content(anchor)
        parsed = urllib.parse.urlparse(href)
        if not href or href.startswith(("mailto:", "tel:", "javascript:", "#")):
            link_type = "special"
        elif url_ext(href) in DOC_EXTS | VIDEO_EXTS | IMG_EXTS:
            link_type = asset_type(href) + " link"
            add_media(placements, href, page_url, link_type, anchor, link_label=label)
        elif parsed.netloc in {"www.valuatum.com", "valuatum.com", ""}:
            link_type = "internal"
        else:
            link_type = "external"
        links.append({"label": label, "url": href, "type": link_type, "section": nearest_heading(anchor)})

    seen_assets = {placement["source_url"] for placement in placements}
    for image_url in sitemap_images + head_images:
        image_url = strip_tracking_query(normalize_url(image_url, page_url))
        if image_url and image_url not in seen_assets:
            placements.append(
                {
                    "type": "sitemap/featured image",
                    "asset_type": asset_type(image_url),
                    "section": "",
                    "context": "Featured/page image from sitemap or page metadata.",
                    "link_label": "",
                    "source_url": image_url,
                    "local_url": "",
                    "local_path": "",
                    "status": "pending",
                }
            )
            seen_assets.add(image_url)

    for url in ASSET_URL_RE.findall(etree.tostring(root, encoding="unicode")):
        url = strip_tracking_query(normalize_url(url, page_url))
        if url and url not in seen_assets:
            placements.append(
                {
                    "type": "content asset reference",
                    "asset_type": asset_type(url),
                    "section": "",
                    "context": "Asset URL found inside page content.",
                    "link_label": "",
                    "source_url": url,
                    "local_url": "",
                    "local_path": "",
                    "status": "pending",
                }
            )
            seen_assets.add(url)

    return placements, links


def sitemap_entries(sitemap_url: str) -> list[dict[str, Any]]:
    xml, final_url = fetch_text(sitemap_url)
    root = etree.fromstring(xml.encode("utf-8"))
    entries = []
    for url_node in root.xpath("//sm:url", namespaces=SITEMAP_NS):
        locs = url_node.xpath("./sm:loc/text()", namespaces=SITEMAP_NS)
        if not locs:
            continue
        entries.append(
            {
                "url": locs[0].strip(),
                "lastmod": (url_node.xpath("./sm:lastmod/text()", namespaces=SITEMAP_NS) or [""])[0],
                "images": [value.strip() for value in url_node.xpath(".//image:loc/text()", namespaces=SITEMAP_NS)],
            }
        )
    return entries


def discover_page_sitemaps(index_url: str) -> list[str]:
    xml, _ = fetch_text(index_url)
    root = etree.fromstring(xml.encode("utf-8"))
    urls = [value.strip() for value in root.xpath("//sm:sitemap/sm:loc/text()", namespaces=SITEMAP_NS)]
    return [url.replace("http://", "https://") for url in urls if "page-sitemap" in url]


def page_slug_from_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    path = parsed.path.strip("/")
    if not path:
        return "home"
    return slugify(path)


def head_meta(doc: etree._Element, xpath: str) -> str:
    values = doc.xpath(xpath)
    return clean_text(values[0]) if values else ""


def head_images(doc: etree._Element, page_url: str) -> list[str]:
    images = []
    for xpath in [
        "//meta[@property='og:image']/@content",
        "//meta[@name='twitter:image']/@content",
        "//link[@rel='image_src']/@href",
    ]:
        for value in doc.xpath(xpath):
            images.append(normalize_url(value, page_url))
    return images


def localize_media(placements: list[dict[str, Any]], output_dir: Path) -> dict[str, dict[str, Any]]:
    media_map: dict[str, dict[str, Any]] = {}
    used_paths: dict[str, str] = {}
    assets_root = output_dir / "assets" / "website-media"

    for placement in placements:
        url = placement["source_url"]
        if not is_downloadable(url):
            placement["status"] = "external-not-downloaded"
            continue

        rel = safe_rel_from_url(url)
        rel_string = rel.as_posix()
        if rel_string in used_paths and used_paths[rel_string] != url:
            digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:8]
            rel = rel.with_name(f"{rel.stem}-{digest}{rel.suffix}")
            rel_string = rel.as_posix()
        used_paths[rel_string] = url

        local_path = Path("assets") / "website-media" / rel
        local_url = "/" + local_path.as_posix()
        placement["local_path"] = local_path.as_posix()
        placement["local_url"] = local_url
        placement["status"] = "mapped"

        if url not in media_map:
            media_map[url] = {
                "source_url": url,
                "asset_type": asset_type(url),
                "local_path": local_path.as_posix(),
                "local_url": local_url,
                "extension": url_ext(url),
                "download": {"status": "pending", "bytes": 0, "error": ""},
                "used_on_pages": [],
            }

    return media_map


def download_media(media_map: dict[str, dict[str, Any]], output_dir: Path) -> None:
    for index, media in enumerate(media_map.values(), start=1):
        local_file = output_dir / media["local_path"]
        local_file.parent.mkdir(parents=True, exist_ok=True)
        if local_file.exists() and local_file.stat().st_size > 0:
            media["download"] = {"status": "exists", "bytes": local_file.stat().st_size, "error": ""}
            continue
        try:
            data, _ = fetch_bytes(media["source_url"])
            ctype = mimetypes.guess_type(media["source_url"])[0] or ""
            if data[:200].lower().startswith(b"<!doctype html") and not ctype.startswith("text/html"):
                raise RuntimeError("HTML response for asset")
            local_file.write_bytes(data)
            media["download"] = {"status": "downloaded", "bytes": local_file.stat().st_size, "error": ""}
        except Exception as exc:  # noqa: BLE001
            local_file.unlink(missing_ok=True)
            media["download"] = {"status": "failed", "bytes": 0, "error": f"{type(exc).__name__}: {exc}"}
        if index % 50 == 0:
            print(f"Downloaded/checked {index}/{len(media_map)} media files...")


def relink_markdown_urls(markdown: str, media_map: dict[str, dict[str, Any]]) -> str:
    for source_url, media in sorted(media_map.items(), key=lambda item: len(item[0]), reverse=True):
        if media.get("local_url"):
            markdown = markdown.replace(source_url, media["local_url"])
    return markdown


def page_md(page: dict[str, Any]) -> str:
    media_rows = ["| # | Type | Where / context | Local media | Source |", "|---:|---|---|---|---|"]
    for media in page["media_placements"]:
        local = media.get("local_url") or media.get("local_path") or ""
        where = media.get("section") or media.get("context") or media.get("link_label") or ""
        if media.get("link_label") and media["link_label"] not in where:
            where = (where + " Link text: " + media["link_label"]).strip()
        media_rows.append(
            f"| {media['order']} | {table_cell(media['type'])} | {table_cell(where)} | `{table_cell(local)}` | {table_cell(media['source_url'])} |"
        )
    if len(media_rows) == 2:
        media_table = "No media references found for this page."
    else:
        media_table = "\n".join(media_rows)

    link_rows = ["| Label | Type | URL | Section |", "|---|---|---|---|"]
    for link in page["links"]:
        link_rows.append(f"| {table_cell(link['label'])} | {table_cell(link['type'])} | {table_cell(link['url'])} | {table_cell(link['section'])} |")
    links_table = "\n".join(link_rows) if len(link_rows) > 2 else "No links found for this page."

    fm = {
        "url": page["url"],
        "title": page["title"],
        "lastmod": page["lastmod"],
        "slug": page["slug"],
    }
    lines = ["---"]
    for key, value in fm.items():
        lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
    lines.append("---")
    return (
        "\n".join(lines)
        + f"\n\n# {page['title']}\n\n"
        + "## Page Content\n\n"
        + (page["content_markdown"] or "_No page text extracted._")
        + "\n\n## Media Placement Map\n\n"
        + media_table
        + "\n\n## Links\n\n"
        + links_table
        + "\n"
    )


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", default="https://www.valuatum.com/")
    parser.add_argument("--out", default=r"C:\Users\Lauri H\Downloads\Valuatum_sivujen_content_ja_media")
    args = parser.parse_args()

    output_dir = Path(args.out).resolve()
    if output_dir.exists():
        if output_dir.name != "Valuatum_sivujen_content_ja_media":
            raise RuntimeError(f"Refusing to delete unexpected output folder: {output_dir}")
        for child in output_dir.iterdir():
            if child.name == "assets":
                continue
            if child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
    (output_dir / "pages").mkdir(parents=True, exist_ok=True)

    sitemap_index = urllib.parse.urljoin(args.site, "/sitemap_index.xml")
    page_sitemaps = discover_page_sitemaps(sitemap_index)
    entries: list[dict[str, Any]] = []
    for sitemap in page_sitemaps:
        entries.extend(sitemap_entries(sitemap))

    seen_urls = set()
    entries = [entry for entry in entries if not (entry["url"] in seen_urls or seen_urls.add(entry["url"]))]
    pages: list[dict[str, Any]] = []
    all_placements: list[dict[str, Any]] = []
    slug_seen: dict[str, int] = {}
    errors = []

    for index, entry in enumerate(entries, start=1):
        url = entry["url"].replace("http://", "https://")
        try:
            data, final_url = fetch_bytes(url)
            doc = lxml_html.fromstring(data, base_url=final_url)
            root = content_root(doc)
            title = head_meta(doc, "//meta[@property='og:title']/@content") or head_meta(doc, "//title/text()") or text_content(root.xpath(".//h1")[0] if root.xpath(".//h1") else None) or url
            title = re.sub(r"\s+-\s+Valuatum$", "", title).strip()
            description = head_meta(doc, "//meta[@name='description']/@content") or head_meta(doc, "//meta[@property='og:description']/@content")
            placements, links = collect_page_data(root, final_url, entry.get("images", []), head_images(doc, final_url))
            slug = unique_slug(page_slug_from_url(final_url), slug_seen)
            page = {
                "title": title,
                "description": description,
                "url": final_url,
                "source_sitemap_url": url,
                "lastmod": entry.get("lastmod", ""),
                "slug": slug,
                "content_markdown": "",
                "media_placements": placements,
                "links": links,
            }
            pages.append(page)
            all_placements.extend(placements)
        except Exception as exc:  # noqa: BLE001
            errors.append({"url": url, "error": f"{type(exc).__name__}: {exc}"})
        if index % 20 == 0:
            print(f"Crawled {index}/{len(entries)} pages...")
        time.sleep(0.05)

    media_map = localize_media(all_placements, output_dir)

    download_media(media_map, output_dir)

    successful_url_map = {
        source: media["local_url"]
        for source, media in media_map.items()
        if (media.get("download") or {}).get("status") in {"downloaded", "exists"} and media.get("local_url")
    }

    for page in pages:
        for placement in page["media_placements"]:
            media = media_map.get(placement["source_url"])
            if media:
                media["used_on_pages"].append({"title": page["title"], "url": page["url"], "slug": page["slug"]})
                download_status = (media.get("download") or {}).get("status", "")
                placement["download_status"] = download_status
                if download_status in {"downloaded", "exists"}:
                    placement["status"] = "local"
                else:
                    placement["status"] = "source-only"
                    placement["local_url"] = ""
                    placement["local_path"] = ""
            else:
                placement["download_status"] = "not-downloaded"
        data, _ = fetch_bytes(page["url"])
        doc = lxml_html.fromstring(data, base_url=page["url"])
        root = content_root(doc)
        page["content_markdown"] = html_to_markdown(root, successful_url_map)
        for order, placement in enumerate(page["media_placements"], start=1):
            placement["order"] = order

    media_status_counts = Counter((media["download"] or {}).get("status", "unknown") for media in media_map.values())

    page_index = [
        {
            "title": page["title"],
            "url": page["url"],
            "lastmod": page["lastmod"],
            "content_file": f"pages/{page['slug']}.md",
            "structured_file": f"pages/{page['slug']}.json",
            "media_count": len(page["media_placements"]),
            "link_count": len(page["links"]),
        }
        for page in pages
    ]

    for page in pages:
        md_path = output_dir / "pages" / f"{page['slug']}.md"
        json_path = output_dir / "pages" / f"{page['slug']}.json"
        md_path.write_text(page_md(page), encoding="utf-8")
        write_json(json_path, page)

    page_rows = ["| Page | URL | Media | Links | File |", "|---|---|---:|---:|---|"]
    for page in page_index:
        page_rows.append(
            f"| {table_cell(page['title'])} | {table_cell(page['url'])} | {page['media_count']} | {page['link_count']} | `{page['content_file']}` |"
        )
    (output_dir / "pages-index.md").write_text("\n".join(page_rows) + "\n", encoding="utf-8")
    write_json(output_dir / "pages-index.json", page_index)
    write_json(output_dir / "media-by-page.json", [{"title": p["title"], "url": p["url"], "slug": p["slug"], "media_placements": p["media_placements"]} for p in pages])
    write_json(output_dir / "links-by-page.json", [{"title": p["title"], "url": p["url"], "slug": p["slug"], "links": p["links"]} for p in pages])
    write_json(
        output_dir / "media-index.json",
        {
            "summary": {
                "site": args.site,
                "pages_crawled": len(pages),
                "page_errors": len(errors),
                "media_records": len(media_map),
                "download_status_counts": dict(media_status_counts),
            },
            "media": list(media_map.values()),
            "errors": errors,
        },
    )
    write_json(output_dir / "crawl-errors.json", errors)

    readme = f"""# Valuatum.com Content + Media

This folder contains the public page content and page-related media from `https://www.valuatum.com/`.

## Start Here

- `pages-index.md` - human-readable list of crawled pages.
- `pages/` - one `.md` and one `.json` file per page.
- `media-by-page.json` - machine-readable map of which media belongs to which page and where it appears.
- `links-by-page.json` - all content links by page.
- `media-index.json` - media download inventory and status.
- `assets/website-media/` - downloaded local images, PDFs, videos, and document files.

## How To Use

Open `pages/<slug>.md` for a page. Each file has:

1. `Page Content` - extracted text and inline image/file links as markdown.
2. `Media Placement Map` - every image, PDF, video, document, or featured/sitemap image associated with that page.
3. `Links` - internal and external links found in the page content.

Prefer local paths beginning with `/assets/website-media/...` when rebuilding. Embedded videos and normal external web links are listed but not downloaded.

If a media item could not be downloaded, the page's `Media Placement Map` keeps it as `source-only` with the original URL instead of a missing local path.

## Crawl Summary

- Pages crawled: {len(pages)} / {len(entries)}
- Page crawl errors: {len(errors)}
- Media records: {len(media_map)}
- Download statuses: {json.dumps(dict(media_status_counts), ensure_ascii=False)}

Generated: {time.strftime("%Y-%m-%d %H:%M:%S")}
"""
    (output_dir / "README.md").write_text(readme, encoding="utf-8")

    print(f"Wrote Valuatum content/media folder to: {output_dir}")
    print(f"Pages crawled: {len(pages)}/{len(entries)}")
    print(f"Media records: {len(media_map)}; download statuses: {dict(media_status_counts)}")
    if errors:
        print(f"Page errors: {len(errors)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
