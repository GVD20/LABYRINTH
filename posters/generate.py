#!/usr/bin/env python3
"""
BetaFPV Drone Poster Generator
Generates A4-sized PNG posters for each drone using headless Chrome.
"""

import json
import os
import subprocess
import sys
import time
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
TEMPLATE_PATH = BASE_DIR / "template.html"
DATA_PATH = BASE_DIR / "drones.json"
IMAGES_DIR = BASE_DIR / "images"
OUTPUT_DIR = BASE_DIR / "output"

def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_template():
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        return f.read()


def build_spec_rows(specs: dict) -> str:
    """Return all HTML spec rows (for 2-column grid layout)."""
    rows = []
    for label, value in specs.items():
        rows.append(
            f'<div class="spec-row">'
            f'<span class="spec-label">{label}</span>'
            f'<span class="spec-value">{value}</span>'
            f'</div>'
        )
    return "\n".join(rows)


def build_highlights(highlights: list, accent: str) -> str:
    rows = []
    for h in highlights:
        rows.append(
            f'<div class="highlight-item">'
            f'<span class="highlight-dot" style="background:{accent}"></span>'
            f'{h}'
            f'</div>'
        )
    return "\n".join(rows)


def render_poster(drone: dict, template: str, output_path: Path):
    """Fill in the template with drone data and render PDF via headless Chrome, then convert to PNG."""
    image1 = IMAGES_DIR / f"{drone['id']}-view1.svg"
    image2 = IMAGES_DIR / f"{drone['id']}-view2.svg"

    html = template
    html = html.replace("{{NAME}}", drone["name"])
    html = html.replace("{{SUBTITLE}}", drone["subtitle"])
    html = html.replace("{{TAGLINE}}", drone["tagline"])
    html = html.replace("{{DESCRIPTION}}", drone["description"])
    html = html.replace("{{ACCENT}}", drone["accent"])
    html = html.replace("{{PRICE}}", drone["price"])
    html = html.replace("{{IMAGE1}}", str(image1.resolve()))
    html = html.replace("{{IMAGE2}}", str(image2.resolve()))
    html = html.replace(
        "{{SPECS_ALL}}", build_spec_rows(drone["specs"])
    )
    html = html.replace(
        "{{HIGHLIGHTS}}", build_highlights(drone["highlights"], drone["accent"])
    )

    # Write temp HTML
    tmp_html = BASE_DIR / f"_tmp_{drone['id']}.html"
    tmp_pdf = BASE_DIR / f"_tmp_{drone['id']}.pdf"
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(html)

    # Step 1: Render HTML → PDF via headless Chrome (preserves full A4 page)
    cmd_pdf = [
        "google-chrome",
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-dev-shm-usage",
        f"--print-to-pdf={tmp_pdf}",
        "--print-to-pdf-no-header",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=2000",
        f"file://{tmp_html.resolve()}",
    ]
    subprocess.run(cmd_pdf, capture_output=True, text=True, timeout=30)

    if not tmp_pdf.exists():
        print(f"  ERROR: PDF not created for {drone['id']}")
        tmp_html.unlink(missing_ok=True)
        return False

    # Step 2: Convert PDF → PNG at 96dpi (A4 = 794×1123 px)
    cmd_png = [
        "pdftoppm",
        "-r", "96",
        "-png",
        "-singlefile",
        str(tmp_pdf),
        str(output_path.with_suffix("")),
    ]
    result = subprocess.run(cmd_png, capture_output=True, text=True, timeout=30)

    # pdftoppm adds -1 suffix when using -singlefile, output_path without suffix
    # The actual file is output_path (we pass output_path without extension)
    actual_output = output_path  # pdftoppm with -singlefile outputs to stem.png

    # Clean up temp files
    tmp_html.unlink(missing_ok=True)
    tmp_pdf.unlink(missing_ok=True)

    if not actual_output.exists():
        print(f"  ERROR: Output file not created for {drone['id']}")
        print(f"  stderr: {result.stderr[-500:]}")
        return False

    size = actual_output.stat().st_size
    if size < 10000:
        print(f"  WARNING: Output file suspiciously small ({size} bytes)")

    print(f"  ✓ {drone['id']}.png  ({size:,} bytes)")
    return True


def verify_png(path: Path) -> bool:
    """Check PNG header magic bytes."""
    try:
        with open(path, "rb") as f:
            header = f.read(8)
        return header == b'\x89PNG\r\n\x1a\n'
    except Exception:
        return False


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    data = load_data()
    template = load_template()

    print(f"\n{'='*50}")
    print(f"  BetaFPV Drone Poster Generator")
    print(f"{'='*50}\n")

    results = []
    for drone in data["drones"]:
        print(f"→ Generating: {drone['name']}")
        out_path = OUTPUT_DIR / f"{drone['id']}.png"
        ok = render_poster(drone, template, out_path)
        results.append((drone["name"], out_path, ok))

    print(f"\n{'='*50}")
    print("  Verification")
    print(f"{'='*50}")

    all_ok = True
    for name, path, rendered in results:
        if not rendered:
            print(f"  ✗ FAILED to render: {name}")
            all_ok = False
            continue

        valid_png = verify_png(path)
        size = path.stat().st_size if path.exists() else 0
        status = "✓" if valid_png else "✗"
        note = "" if valid_png else " (INVALID PNG HEADER)"
        print(f"  {status} {path.name}: {size:,} bytes{note}")
        if not valid_png:
            all_ok = False

    print(f"\n{'='*50}")
    if all_ok:
        print(f"  All {len(results)} posters generated successfully.")
    else:
        print(f"  Some posters had issues. Check output above.")
    print(f"  Output directory: {OUTPUT_DIR}")
    print(f"{'='*50}\n")

    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
