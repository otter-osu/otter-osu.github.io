"""Generate favicon sizes from the master logo PNG.

Usage:
    pip install Pillow
    python3 make_favicons.py

Reads:  assets/images/otter-logo.png
Writes: assets/images/{favicon-16,favicon-32,apple-touch-icon}.png
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent
SRC = ROOT / "assets" / "images" / "otter-logo.png"
OUT_DIR = ROOT / "assets" / "images"

TARGETS = [
    ("favicon-16.png", 16),
    ("favicon-32.png", 32),
    ("apple-touch-icon.png", 180),
]


def main():
    if not SRC.exists():
        raise SystemExit(f"Logo not found: {SRC}")
    img = Image.open(SRC).convert("RGBA")
    for name, size in TARGETS:
        out = img.copy()
        out.thumbnail((size, size), Image.LANCZOS)
        # Center on a transparent canvas to ensure exact dimensions.
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        x = (size - out.width) // 2
        y = (size - out.height) // 2
        canvas.paste(out, (x, y), out)
        canvas.save(OUT_DIR / name, "PNG", optimize=True)
        print(f"  wrote {name} ({size}x{size})")


if __name__ == "__main__":
    main()
