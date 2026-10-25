#!/usr/bin/env python3
"""Check local page and document links in the actual academic portfolio."""
from __future__ import annotations

import posixpath
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

PAGES = (
    "index.html",
    "research/index.html",
    "publications/index.html",
    "projects/index.html",
    "cv/index.html",
    "contact/index.html",
)


class AcademicLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.hrefs: list[str] = []

    def handle_starttag(self, tag, attrs):
        properties = dict(attrs)
        if self.depth:
            self.depth += 1
        elif tag == "div" and "mf-wrap" in properties.get("class", "").split():
            self.depth = 1
        if self.depth and tag == "a" and properties.get("href"):
            self.hrefs.append(properties["href"])

    def handle_endtag(self, tag):
        if self.depth:
            self.depth -= 1


def main(root: Path) -> int:
    failures = []
    count = 0
    for rel in PAGES:
        source = root / rel
        if not source.is_file():
            failures.append(f"Required page missing: {rel}")
            continue
        parser = AcademicLinks()
        parser.feed(source.read_text(encoding="utf-8"))
        url_dir = "/" + posixpath.dirname(rel)
        for href in parser.hrefs:
            parsed = urlsplit(href)
            if parsed.scheme or parsed.netloc or href.startswith(("#", "//")):
                continue
            urlpath = unquote(parsed.path)
            if not urlpath:
                continue
            target = (
                posixpath.normpath(urlpath)
                if urlpath.startswith("/")
                else posixpath.normpath(posixpath.join(url_dir, urlpath))
            )
            if target.startswith("../"):
                failures.append(f"{rel}: link escapes site root: {href}")
                continue
            local = root / target.lstrip("/")
            if local.is_dir() or urlpath.endswith("/"):
                local /= "index.html"
            count += 1
            if not local.is_file():
                failures.append(f"{rel}: missing internal link {href} -> {local}")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print(f"Academic internal link check passed: {count} links across {len(PAGES)} pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(Path(sys.argv[1]).resolve()))
