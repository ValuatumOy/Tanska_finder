#!/usr/bin/env python3
"""Extract a WordPress WXR export into a rebuild-friendly content package."""

from __future__ import annotations

import argparse
import html
import json
import mimetypes
import os
import re
import shutil
import sys
import textwrap
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from lxml import etree
from lxml import html as lxml_html


NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    "wp": "http://wordpress.org/export/1.2/",
}

ASSET_URL_RE = re.compile(
    r"https?://[^\s\"'<>]+?\.(?:png|jpe?g|gif|webp|svg|pdf|mp4|pptx)(?:\?[^\s\"'<>]*)?",
    re.IGNORECASE,
)

IMG_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}
DOWNLOAD_EXTS = IMG_EXTS | {".pdf", ".mp4", ".pptx"}
REMOTE_TIMEOUT = 25


@dataclass
class DownloadResult:
    status: str
    source_url: str
    local_path: str
    bytes: int = 0
    error: str = ""


class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        old = urllib.parse.urldefrag(req.full_url)[0].rstrip("/")
        new = urllib.parse.urldefrag(newurl)[0].rstrip("/")
        if old == new:
            return None
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def text(node: etree._Element, path: str, default: str = "") -> str:
    found = node.find(path, namespaces=NS)
    return found.text if found is not None and found.text is not None else default


def norm_url(url: str) -> str:
    url = html.unescape(url or "").strip()
    url = url.rstrip(".,)")
    return url


def slugify(value: str, fallback: str = "item") -> str:
    value = html.unescape(value or "").lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value or fallback


def ensure_unique_slug(slug: str, seen: dict[str, int]) -> str:
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


def safe_rel_from_url(url: str, prefix: str = "") -> Path:
    parsed = urllib.parse.urlparse(url)
    parts = [urllib.parse.unquote(p) for p in parsed.path.split("/") if p]
    if not parts:
        parts = [slugify(parsed.netloc or "asset")]
    if "uploads" in parts:
        idx = parts.index("uploads")
        parts = parts[idx + 1 :]
    if prefix:
        parts = [prefix] + parts
    return Path(*[slugify(p, "part") if i < len(parts) - 1 else p for i, p in enumerate(parts)])


def postmeta(item: etree._Element) -> dict[str, list[str]]:
    data: dict[str, list[str]] = defaultdict(list)
    for meta in item.findall("wp:postmeta", namespaces=NS):
        key = text(meta, "wp:meta_key")
        value = text(meta, "wp:meta_value")
        data[key].append(value)
    return dict(data)


def one_meta(metas: dict[str, list[str]], key: str) -> str:
    values = metas.get(key) or []
    return values[0] if values else ""


def parse_php_s3(value: str) -> dict[str, str]:
    if not value:
        return {}
    result = {}
    for key in ("bucket", "key", "region"):
        match = re.search(rf's:\d+:"{re.escape(key)}";s:\d+:"([^"]+)"', value)
        if match:
            result[key] = match.group(1)
    return result


def parse_attachment_metadata(value: str) -> dict[str, Any]:
    data: dict[str, Any] = {"sizes": []}
    if not value:
        return data
    for field in ("width", "height"):
        match = re.search(rf's:\d+:"{field}";i:(\d+);', value)
        if match:
            data[field] = int(match.group(1))
    file_match = re.search(r's:\d+:"file";s:\d+:"([^"]+)";', value)
    if file_match:
        data["file"] = file_match.group(1)
    size_re = re.compile(
        r's:\d+:"(?P<label>[^"]+)";a:\d+:\{'
        r's:\d+:"file";s:\d+:"(?P<file>[^"]+)";'
        r's:\d+:"width";i:(?P<width>\d+);'
        r's:\d+:"height";i:(?P<height>\d+);'
        r's:\d+:"mime-type";s:\d+:"(?P<mime>[^"]+)";',
        re.DOTALL,
    )
    for match in size_re.finditer(value):
        data["sizes"].append(
            {
                "label": match.group("label"),
                "file": match.group("file"),
                "width": int(match.group("width")),
                "height": int(match.group("height")),
                "mime_type": match.group("mime"),
            }
        )
    return data


def s3_url(info: dict[str, str]) -> str:
    if not {"bucket", "key", "region"} <= set(info):
        return ""
    key = urllib.parse.quote(info["key"], safe="/")
    return f"https://{info['bucket']}.s3.{info['region']}.amazonaws.com/{key}"


def public_upload_url(base_url: str, filename: str) -> str:
    parsed = urllib.parse.urlparse(base_url)
    path = parsed.path
    dir_path = path.rsplit("/", 1)[0]
    return urllib.parse.urlunparse(parsed._replace(path=f"{dir_path}/{filename}", query=""))


def variant_s3_url(original_s3_url: str, filename: str) -> str:
    if not original_s3_url:
        return ""
    parsed = urllib.parse.urlparse(original_s3_url)
    path = parsed.path.rsplit("/", 1)[0] + "/" + urllib.parse.quote(filename)
    return urllib.parse.urlunparse(parsed._replace(path=path))


def remove_wp_size_suffix(filename: str) -> str:
    stem, ext = os.path.splitext(filename)
    stem = re.sub(r"-\d+x\d+$", "", stem)
    return stem + ext


def extract_urls(value: str) -> list[str]:
    return sorted({norm_url(url) for url in ASSET_URL_RE.findall(value or "")})


def is_downloadable(url: str) -> bool:
    ext = Path(urllib.parse.urlparse(url).path).suffix.lower()
    return ext in DOWNLOAD_EXTS


def is_image(url: str) -> bool:
    ext = Path(urllib.parse.urlparse(url).path).suffix.lower()
    return ext in IMG_EXTS


def download_one(source_urls: list[str], local_file: Path) -> DownloadResult:
    local_file.parent.mkdir(parents=True, exist_ok=True)
    if local_file.exists() and local_file.stat().st_size > 0:
        return DownloadResult("exists", "", str(local_file), local_file.stat().st_size)

    opener = urllib.request.build_opener(SafeRedirect)
    headers = {"User-Agent": "Mozilla/5.0 WordPress export asset archiver"}
    last_error = ""

    for source_url in [u for u in source_urls if u]:
        request = urllib.request.Request(source_url, headers=headers)
        try:
            try:
                response = opener.open(request, timeout=REMOTE_TIMEOUT)
            except urllib.error.HTTPError as exc:
                if 300 <= exc.code < 400:
                    raise RuntimeError(f"redirect loop blocked: {exc.headers.get('Location', '')}") from exc
                raise

            with response:
                ctype = response.headers.get("Content-Type", "")
                if "text/html" in ctype and Path(local_file).suffix.lower() not in {".html", ".htm"}:
                    raise RuntimeError(f"unexpected HTML response ({ctype})")
                with local_file.open("wb") as fh:
                    shutil.copyfileobj(response, fh)

            size = local_file.stat().st_size
            if size == 0:
                local_file.unlink(missing_ok=True)
                raise RuntimeError("downloaded zero bytes")
            return DownloadResult("downloaded", source_url, str(local_file), size)
        except Exception as exc:  # noqa: BLE001 - keep going through alternate sources.
            last_error = f"{type(exc).__name__}: {exc}"
            local_file.unlink(missing_ok=True)

    return DownloadResult("failed", source_urls[0] if source_urls else "", str(local_file), 0, last_error)


def node_to_markdown(node: etree._Element) -> str:
    tag = node.tag.lower() if isinstance(node.tag, str) else ""

    if tag in {"script", "style", "noscript"}:
        return ""

    if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
        level = int(tag[1])
        content = inline_text(node).strip()
        return f"\n{'#' * level} {content}\n\n" if content else ""

    if tag == "p":
        content = inline_text(node).strip()
        return f"{content}\n\n" if content else ""

    if tag == "li":
        content = "".join(node_to_markdown(child) for child in node).strip()
        if not content:
            content = inline_text(node).strip()
        content = re.sub(r"\n+", "\n  ", content)
        return f"- {content}\n" if content else ""

    if tag in {"ul", "ol"}:
        return "".join(node_to_markdown(child) for child in node).strip() + "\n\n"

    if tag == "blockquote":
        content = children_markdown(node).strip()
        content = "\n".join(f"> {line}" if line else ">" for line in content.splitlines())
        return f"{content}\n\n" if content else ""

    if tag == "table":
        rows = []
        for tr in node.xpath(".//tr"):
            cells = [inline_text(cell).strip().replace("|", "\\|") for cell in tr.xpath("./th|./td")]
            if cells:
                rows.append(cells)
        if not rows:
            return ""
        max_cols = max(len(row) for row in rows)
        rows = [row + [""] * (max_cols - len(row)) for row in rows]
        lines = ["| " + " | ".join(rows[0]) + " |", "| " + " | ".join(["---"] * max_cols) + " |"]
        lines.extend("| " + " | ".join(row) + " |" for row in rows[1:])
        return "\n".join(lines) + "\n\n"

    if tag == "img":
        alt = node.get("alt") or ""
        src = node.get("src") or ""
        return f"![{alt}]({src})\n\n" if src else ""

    return children_markdown(node)


def inline_text(node: etree._Element) -> str:
    parts: list[str] = []
    if node.text:
        parts.append(node.text)
    for child in node:
        tag = child.tag.lower() if isinstance(child.tag, str) else ""
        if tag == "br":
            parts.append("\n")
        elif tag == "a":
            label = inline_text(child).strip()
            href = child.get("href") or ""
            parts.append(f"[{label}]({href})" if href and label else label)
        elif tag == "img":
            alt = child.get("alt") or ""
            src = child.get("src") or ""
            parts.append(f"![{alt}]({src})" if src else alt)
        elif tag in {"strong", "b"}:
            content = inline_text(child).strip()
            parts.append(f"**{content}**" if content else "")
        elif tag in {"em", "i"}:
            content = inline_text(child).strip()
            parts.append(f"*{content}*" if content else "")
        else:
            parts.append(inline_text(child))
        if child.tail:
            parts.append(child.tail)
    value = "".join(parts)
    value = re.sub(r"[ \t\r\f\v]+", " ", value)
    value = re.sub(r" *\n *", "\n", value)
    return html.unescape(value)


def children_markdown(node: etree._Element) -> str:
    parts = []
    if node.text and node.text.strip():
        parts.append(node.text.strip() + "\n\n")
    for child in node:
        parts.append(node_to_markdown(child))
        if child.tail and child.tail.strip():
            parts.append(child.tail.strip() + "\n\n")
    return "".join(parts)


def html_to_markdown(value: str) -> str:
    value = re.sub(r"<!--\s*/?wp:[\s\S]*?-->", "", value or "")
    if not value.strip():
        return ""
    try:
        doc = lxml_html.fragment_fromstring(value, create_parent="div")
    except etree.ParserError:
        return html.unescape(re.sub(r"<[^>]+>", " ", value)).strip()
    md = children_markdown(doc)
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.strip()


def localized_html(value: str, url_map: dict[str, str]) -> str:
    output = value or ""
    for remote, local in sorted(url_map.items(), key=lambda pair: len(pair[0]), reverse=True):
        output = output.replace(remote, local)
        output = output.replace(html.escape(remote), html.escape(local))
    return output


def route_path(link: str) -> str:
    parsed = urllib.parse.urlparse(link or "")
    path = parsed.path or "/"
    return path if path.startswith("/") else f"/{path}"


def existing_frontend_routes(frontend_dir: Path) -> set[str]:
    routes = set()
    for index in frontend_dir.rglob("index.html"):
        rel = index.parent.relative_to(frontend_dir).as_posix()
        route = "/" + rel.strip("/") + "/"
        if route == "//":
            route = "/"
        routes.add(route)
    return routes


def suggest_new_route(old_path: str, title: str, slug: str, routes: set[str]) -> str:
    title_slug = slugify(title)
    candidates = []
    if old_path == "/":
        candidates.extend(["/en/", "/"])
    normalized = old_path.strip("/")
    if normalized:
        candidates.append(f"/en/{normalized}/")
        candidates.append(f"/en/{slug}/")
        candidates.append(f"/en/{title_slug}/")
        if normalized.startswith("product/"):
            candidates.append(f"/en/products/{normalized.removeprefix('product/')}/")
        if normalized.startswith("support/faq") or slug in {"faq-old", "credit-risk-faq"}:
            candidates.append("/en/support/credit-risk-faq/")
        if slug.endswith("old"):
            candidates.append(f"/en/{slug.removesuffix('old')}/")
        if slug.endswith("old__trashed"):
            candidates.append(f"/en/{slug.removesuffix('old__trashed')}/")
    for candidate in candidates:
        if candidate in routes:
            return candidate
    return candidates[0] if candidates else ""


def frontmatter(data: dict[str, Any]) -> str:
    lines = ["---"]
    for key, value in data.items():
        if isinstance(value, list):
            lines.append(f"{key}:")
            for item in value:
                lines.append(f"  - {json.dumps(item, ensure_ascii=False)}")
        else:
            lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--xml", required=True, help="Path to WordPress WXR XML export")
    parser.add_argument("--frontend-dir", default=".", help="Frontend project root")
    parser.add_argument("--out", default="docs/wordpress-export", help="Output docs directory")
    parser.add_argument("--assets", default="assets/wordpress-media", help="Output media directory")
    parser.add_argument("--no-download", action="store_true", help="Skip asset downloads")
    args = parser.parse_args()

    xml_path = Path(args.xml).resolve()
    frontend_dir = Path(args.frontend_dir).resolve()
    out_dir = (frontend_dir / args.out).resolve()
    assets_dir = (frontend_dir / args.assets).resolve()
    source_xml_copy = out_dir / "source" / xml_path.name

    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    root = etree.parse(str(xml_path)).getroot()
    channel = root.find("channel")
    if channel is None:
        raise RuntimeError("No channel found in WordPress export")

    site = {
        "title": text(channel, "title"),
        "link": text(channel, "link"),
        "description": text(channel, "description"),
        "language": text(channel, "language"),
        "base_site_url": text(channel, "wp:base_site_url"),
        "base_blog_url": text(channel, "wp:base_blog_url"),
        "export_pub_date": text(channel, "pubDate"),
        "source_xml": str(xml_path),
    }

    items = channel.findall("item")
    type_counts = Counter(text(item, "wp:post_type") for item in items)
    routes = existing_frontend_routes(frontend_dir)

    source_xml_copy.parent.mkdir(parents=True, exist_ok=True)
    if not source_xml_copy.exists() or source_xml_copy.stat().st_size != xml_path.stat().st_size:
        shutil.copy2(xml_path, source_xml_copy)

    # Attachments and every public variant URL we can infer from WordPress metadata.
    attachments: list[dict[str, Any]] = []
    url_to_media: dict[str, dict[str, Any]] = {}
    filename_to_media: dict[str, dict[str, Any]] = {}
    known_media_by_local_path: dict[str, dict[str, Any]] = {}

    for item in items:
        if text(item, "wp:post_type") != "attachment":
            continue
        metas = postmeta(item)
        attachment_url = norm_url(text(item, "wp:attachment_url"))
        attached_file = one_meta(metas, "_wp_attached_file")
        metadata = parse_attachment_metadata(one_meta(metas, "_wp_attachment_metadata"))
        s3_info = parse_php_s3(one_meta(metas, "amazonS3_info"))
        source_s3 = s3_url(s3_info)
        public_rel = Path(attached_file) if attached_file else safe_rel_from_url(attachment_url)
        local_file = assets_dir / public_rel
        local_url = "/" + local_file.relative_to(frontend_dir).as_posix()
        ext = Path(public_rel).suffix.lower()
        media = {
            "id": text(item, "wp:post_id"),
            "title": text(item, "title"),
            "slug": text(item, "wp:post_name"),
            "status": text(item, "wp:status"),
            "date": text(item, "wp:post_date"),
            "modified": text(item, "wp:post_modified"),
            "url": attachment_url,
            "s3_url": source_s3,
            "guid": text(item, "guid"),
            "attached_file": attached_file,
            "local_path": str(local_file.relative_to(frontend_dir)).replace("\\", "/"),
            "local_url": local_url,
            "extension": ext,
            "mime_type": mimetypes.guess_type(attachment_url)[0] or "",
            "alt": one_meta(metas, "_wp_attachment_image_alt"),
            "width": metadata.get("width"),
            "height": metadata.get("height"),
            "sizes": metadata.get("sizes", []),
            "download": None,
        }
        attachments.append(media)
        known_media_by_local_path[media["local_path"]] = media
        for key_url in [attachment_url, text(item, "guid")]:
            if key_url:
                url_to_media[norm_url(key_url)] = media
        filename_to_media[Path(urllib.parse.urlparse(attachment_url).path).name.lower()] = media

        for size in media["sizes"]:
            variant_public_url = norm_url(public_upload_url(attachment_url, size["file"]))
            variant_rel = public_rel.parent / size["file"]
            variant_local_file = assets_dir / variant_rel
            variant = {
                **media,
                "url": variant_public_url,
                "s3_url": variant_s3_url(source_s3, size["file"]),
                "local_path": str(variant_local_file.relative_to(frontend_dir)).replace("\\", "/"),
                "local_url": "/" + variant_local_file.relative_to(frontend_dir).as_posix(),
                "width": size.get("width"),
                "height": size.get("height"),
                "size_label": size.get("label"),
                "is_variant": True,
                "download": None,
            }
            url_to_media[variant_public_url] = variant
            filename_to_media[size["file"].lower()] = variant
            known_media_by_local_path[variant["local_path"]] = variant

    # Parse content items. Variants are intentionally only downloaded when
    # content references them, because WordPress can generate hundreds.
    content_items: list[dict[str, Any]] = []
    seen_slugs: dict[str, int] = {}
    for item in items:
        post_type = text(item, "wp:post_type")
        if post_type not in {"page", "wp_block", "wp_navigation", "custom_css", "wpcf7_contact_form"}:
            continue

        post_id = text(item, "wp:post_id")
        title = text(item, "title") or f"Untitled {post_type} {post_id}"
        slug = text(item, "wp:post_name") or slugify(title, post_id)
        unique_slug = ensure_unique_slug(slugify(slug or title, post_id), seen_slugs)
        link = text(item, "link")
        old_path = route_path(link)
        raw_html = text(item, "content:encoded")
        asset_urls = extract_urls(raw_html)
        image_urls = [url for url in asset_urls if is_image(url)]
        local_url_map: dict[str, str] = {}
        asset_refs = []
        for url in asset_urls:
            media = url_to_media.get(url)
            if media is None:
                filename = Path(urllib.parse.urlparse(url).path).name.lower()
                media = filename_to_media.get(filename) or filename_to_media.get(remove_wp_size_suffix(filename))
            if media is not None:
                local_url_map[url] = media["local_url"]
                asset_refs.append(
                    {
                        "url": url,
                        "local_url": media["local_url"],
                        "local_path": media["local_path"],
                        "title": media.get("title", ""),
                        "status": "mapped",
                    }
                )
            else:
                asset_refs.append({"url": url, "local_url": "", "local_path": "", "title": "", "status": "external"})

        localized = localized_html(raw_html, local_url_map)
        markdown = html_to_markdown(localized)
        content_items.append(
            {
                "id": post_id,
                "type": post_type,
                "title": title,
                "slug": slug,
                "unique_slug": unique_slug,
                "status": text(item, "wp:status"),
                "author": text(item, "dc:creator"),
                "date": text(item, "wp:post_date"),
                "modified": text(item, "wp:post_modified"),
                "parent": text(item, "wp:post_parent"),
                "menu_order": text(item, "wp:menu_order"),
                "link": link,
                "old_path": old_path,
                "suggested_new_route": suggest_new_route(old_path, title, slug, routes) if post_type == "page" else "",
                "content_length": len(raw_html),
                "asset_urls": asset_urls,
                "image_urls": image_urls,
                "asset_refs": asset_refs,
                "raw_html": raw_html,
                "localized_html": localized,
                "markdown": markdown,
                "excerpt": text(item, "excerpt:encoded"),
                "metas": postmeta(item),
            }
        )

    # WordPress-generated image variants referenced directly in page content.
    attachment_local_paths = {media["local_path"] for media in attachments}
    referenced_variants: list[dict[str, Any]] = []
    referenced_variant_paths: set[str] = set()
    for entry in content_items:
        for ref in entry["asset_refs"]:
            local_path = ref.get("local_path") or ""
            if not local_path or local_path in attachment_local_paths or local_path in referenced_variant_paths:
                continue
            known = known_media_by_local_path.get(local_path)
            if known and known.get("is_variant"):
                variant = dict(known)
                variant["download"] = None
                variant["is_referenced_variant"] = True
                referenced_variants.append(variant)
                referenced_variant_paths.add(local_path)

    # Extra content asset URLs that were not part of attachment metadata.
    extra_media: list[dict[str, Any]] = []
    extra_by_url: dict[str, dict[str, Any]] = {}
    for entry in content_items:
        for ref in entry["asset_refs"]:
            url = ref["url"]
            if ref["status"] == "mapped" or url in extra_by_url or not is_downloadable(url):
                continue
            parsed = urllib.parse.urlparse(url)
            ext = Path(parsed.path).suffix.lower()
            should_download = ext in IMG_EXTS or parsed.netloc.endswith("creditreports.dk") or parsed.netloc.endswith("valuatum.com")
            if not should_download:
                continue
            rel = safe_rel_from_url(url, prefix=f"external/{slugify(parsed.netloc, 'host')}")
            local_file = assets_dir / rel
            media = {
                "id": "",
                "title": Path(parsed.path).name,
                "slug": slugify(Path(parsed.path).stem),
                "status": "external",
                "date": "",
                "modified": "",
                "url": url,
                "s3_url": "",
                "guid": "",
                "attached_file": "",
                "local_path": str(local_file.relative_to(frontend_dir)).replace("\\", "/"),
                "local_url": "/" + local_file.relative_to(frontend_dir).as_posix(),
                "extension": ext,
                "mime_type": mimetypes.guess_type(url)[0] or "",
                "alt": "",
                "width": None,
                "height": None,
                "sizes": [],
                "download": None,
                "is_extra_reference": True,
            }
            extra_by_url[url] = media
            extra_media.append(media)
            ref["local_url"] = media["local_url"]
            ref["local_path"] = media["local_path"]
            ref["status"] = "downloadable-external"

    all_media = attachments + referenced_variants + extra_media

    if not args.no_download:
        for idx, media in enumerate(all_media, start=1):
            ext = media["extension"]
            if ext not in DOWNLOAD_EXTS:
                media["download"] = {"status": "skipped", "error": f"extension {ext} not downloaded"}
                continue
            local_file = frontend_dir / media["local_path"]
            candidates = [media.get("s3_url", ""), media.get("url", ""), media.get("guid", "")]
            result = download_one(candidates, local_file)
            media["download"] = {
                "status": result.status,
                "source_url": result.source_url,
                "bytes": result.bytes,
                "error": result.error,
            }
            if idx % 25 == 0:
                print(f"Downloaded/checked {idx}/{len(all_media)} media files...")

    # Re-localize after adding downloadable external refs.
    for entry in content_items:
        local_url_map = {ref["url"]: ref["local_url"] for ref in entry["asset_refs"] if ref["local_url"]}
        entry["localized_html"] = localized_html(entry["raw_html"], local_url_map)
        entry["markdown"] = html_to_markdown(entry["localized_html"])

    pages = [entry for entry in content_items if entry["type"] == "page"]
    reusable = [entry for entry in content_items if entry["type"] == "wp_block"]
    other_content = [entry for entry in content_items if entry["type"] not in {"page", "wp_block"}]

    # Write per-content files.
    for entry in content_items:
        group = "pages" if entry["type"] == "page" else entry["type"]
        entry_dir = out_dir / group / entry["unique_slug"]
        page_data = {k: v for k, v in entry.items() if k not in {"raw_html", "localized_html", "markdown", "metas"}}
        page_data["metas"] = entry["metas"]
        write_json(entry_dir / "page.json", {**page_data, "raw_html": entry["raw_html"], "localized_html": entry["localized_html"], "markdown": entry["markdown"]})
        write_text(entry_dir / "raw.html", entry["raw_html"])
        write_text(entry_dir / "localized.html", entry["localized_html"])

        asset_lines = []
        for ref in entry["asset_refs"]:
            asset_lines.append(
                f"- `{ref['status']}` {ref['title'] or Path(urllib.parse.urlparse(ref['url']).path).name}: "
                f"{ref['local_url'] or ref['url']} (source: {ref['url']})"
            )
        md = frontmatter(
            {
                "wp_id": entry["id"],
                "type": entry["type"],
                "status": entry["status"],
                "old_url": entry["link"],
                "old_path": entry["old_path"],
                "suggested_new_route": entry["suggested_new_route"],
                "modified": entry["modified"],
            }
        )
        md += f"# {entry['title']}\n\n"
        md += "## Asset References\n\n"
        md += "\n".join(asset_lines) if asset_lines else "No asset references found."
        md += "\n\n## Extracted Markdown\n\n"
        md += entry["markdown"] or "_No text content extracted._"
        md += "\n\n## Localized HTML\n\n```html\n"
        md += entry["localized_html"].strip()
        md += "\n```\n"
        write_text(entry_dir / "page.md", md)

    download_status_counts = Counter((media.get("download") or {}).get("status", "not-run") for media in all_media)
    pages_by_status = Counter(page["status"] for page in pages)
    media_index = {
        "summary": {
            "total_media_records": len(all_media),
            "wordpress_attachments": len(attachments),
            "referenced_wordpress_variants": len(referenced_variants),
            "extra_referenced_assets": len(extra_media),
            "download_status_counts": dict(download_status_counts),
        },
        "media": all_media,
    }
    write_json(out_dir / "media-index.json", media_index)

    inventory_pages = [
        {
            "title": page["title"],
            "status": page["status"],
            "old_path": page["old_path"],
            "suggested_new_route": page["suggested_new_route"],
            "slug": page["slug"],
            "wp_id": page["id"],
            "modified": page["modified"],
            "content_length": page["content_length"],
            "asset_count": len(page["asset_refs"]),
            "image_count": len([r for r in page["asset_refs"] if Path(urllib.parse.urlparse(r["url"]).path).suffix.lower() in IMG_EXTS]),
            "content_file": f"pages/{page['unique_slug']}/page.md",
        }
        for page in pages
    ]
    write_json(
        out_dir / "content-inventory.json",
        {
            "site": site,
            "type_counts": dict(type_counts),
            "pages_by_status": dict(pages_by_status),
            "existing_frontend_routes": sorted(routes),
            "pages": inventory_pages,
            "reusable_blocks": [
                {
                    "title": item["title"],
                    "slug": item["slug"],
                    "content_file": f"wp_block/{item['unique_slug']}/page.md",
                    "asset_count": len(item["asset_refs"]),
                }
                for item in reusable
            ],
            "other_content": [
                {
                    "title": item["title"],
                    "type": item["type"],
                    "content_file": f"{item['type']}/{item['unique_slug']}/page.md",
                }
                for item in other_content
            ],
        },
    )

    write_json(out_dir / "all-content.json", content_items)

    # Compact agent context with the highest-signal handoff instructions.
    published_pages = [page for page in inventory_pages if page["status"] == "publish"]
    draft_pages = [page for page in inventory_pages if page["status"] != "publish"]
    failed_media = [
        media
        for media in all_media
        if (media.get("download") or {}).get("status") == "failed"
    ]
    important_routes = [
        page
        for page in published_pages
        if page["suggested_new_route"] in routes or page["asset_count"] or page["content_length"] > 8000
    ]

    agent_md = f"""# WordPress Export Rebuild Context

Source export: `{xml_path}`

Generated: {time.strftime("%Y-%m-%d %H:%M:%S")}

## Start Here

This folder turns the WordPress export into files another coding agent can use without re-parsing WXR/XML.

- Page inventory: `content-inventory.json`
- Full structured content: `all-content.json`
- Media index and download report: `media-index.json`
- Per-page source: `pages/<slug>/page.md`, `page.json`, `raw.html`, `localized.html`
- Local media root for the static site: `/{args.assets.replace(os.sep, "/")}/`
- Original export copy: `source/{xml_path.name}`

Use `localized.html` when copying old layout/content because WordPress media URLs have been replaced with local project paths where possible. Use `page.md` when you only need clean text, headings, lists, tables, links, and the asset list.

## Site Summary

- Site: {site['title']} ({site['link']})
- Description: {site['description']}
- Export item counts: {json.dumps(dict(type_counts), ensure_ascii=False)}
- Pages: {len(pages)} total, {dict(pages_by_status)}
- Media records: {len(all_media)} total ({len(attachments)} WordPress attachments, {len(referenced_variants)} referenced WordPress variants, {len(extra_media)} extra referenced assets)
- Download results: {json.dumps(dict(download_status_counts), ensure_ascii=False)}

## Existing Frontend Routes

{chr(10).join(f"- `{route}`" for route in sorted(routes)) or "- No routes found."}

## Published Pages To Rebuild / Merge

| Old page | Suggested new route | Assets | File |
|---|---:|---:|---|
{chr(10).join(f"| {page['title']} (`{page['old_path']}`) | `{page['suggested_new_route']}` | {page['asset_count']} | `{page['content_file']}` |" for page in published_pages)}

## High-Signal Pages With Lots Of Content Or Assets

{chr(10).join(f"- {page['title']}: `{page['content_file']}` ({page['content_length']} chars, {page['asset_count']} assets)" for page in important_routes) or "- None."}

## Draft / Old / Trashed Pages

These are preserved because older drafts often contain copy or media that is still useful.

{chr(10).join(f"- {page['title']} [{page['status']}]: `{page['content_file']}` old `{page['old_path']}`" for page in draft_pages) or "- None."}

## Reusable Blocks

{chr(10).join(f"- {item['title']}: `wp_block/{item['unique_slug']}/page.md`" for item in reusable) or "- None."}

## Media Notes

The WordPress export stores media metadata, not binary files. This extractor downloaded what it could from direct URLs, S3 URLs found in export metadata, and downloadable image references from page content.

Failed media count: {len(failed_media)}

{chr(10).join(f"- `{media['local_path']}` from {media['url']} - {(media.get('download') or {}).get('error', '')}" for media in failed_media[:40]) or "- No failed downloads."}

## Suggested Agent Workflow

1. Open this file, then `content-inventory.json`.
2. For each existing frontend route, find the matching old page via `suggested_new_route`.
3. Copy missing text from `pages/<slug>/page.md`.
4. Copy image/PDF references from the page's `Asset References` section. Prefer local paths like `/assets/wordpress-media/...`.
5. If an asset is marked `external` or appears in the failed list, keep the original URL or replace it with a new generated/available asset.
"""
    write_text(out_dir / "AGENT_CONTEXT.md", textwrap.dedent(agent_md).strip() + "\n")

    report_md = "# Media Download Report\n\n"
    report_md += f"Summary: {json.dumps(dict(download_status_counts), ensure_ascii=False)}\n\n"
    for status in sorted(download_status_counts):
        report_md += f"## {status}\n\n"
        for media in all_media:
            dl = media.get("download") or {}
            if dl.get("status") == status:
                report_md += f"- `{media['local_path']}` ({media['url']})"
                if dl.get("error"):
                    report_md += f" - {dl['error']}"
                report_md += "\n"
        report_md += "\n"
    write_text(out_dir / "MEDIA_DOWNLOAD_REPORT.md", report_md)

    print(f"Wrote WordPress content package to: {out_dir}")
    print(f"Wrote media to: {assets_dir}")
    print(f"Pages: {len(pages)}; media: {len(all_media)}; download statuses: {dict(download_status_counts)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
