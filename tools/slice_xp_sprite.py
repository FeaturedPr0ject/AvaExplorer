from __future__ import annotations
import argparse
import json
from pathlib import Path
from PIL import Image

def main() -> int:
    parser = argparse.ArgumentParser(description="Slice a transparent icon sprite sheet into evenly sized PNG cells.")
    parser.add_argument("source", nargs="?", default="assets/xp-ui/source/windows-xp-sprite.png", help="Source PNG/JPG sprite sheet")
    parser.add_argument("--rows", type=int, default=20, help="Number of rows (default: 20)")
    parser.add_argument("--cols", type=int, default=20, help="Number of columns (default: 20)")
    parser.add_argument("--out", default="assets/xp-ui/sliced", help="Output directory")
    parser.add_argument("--trim", action="store_true", help="Trim transparent borders from each cell")
    parser.add_argument("--padding", type=int, default=0, help="Inset each cell by this many pixels")
    args = parser.parse_args()
    source = Path(args.source)
    output = Path(args.out)
    if not source.is_file():
        parser.error(f"Sprite sheet not found: {source}. Save the source PNG there or pass its path as the first argument.")
    if args.rows < 1 or args.cols < 1:
        parser.error("Rows and columns must be positive integers.")
    if args.padding < 0:
        parser.error("Padding cannot be negative.")
    image = Image.open(source).convert("RGBA")
    output.mkdir(parents=True, exist_ok=True)
    manifest = {
        "source": str(source), "source_size": [image.width, image.height],
        "rows": args.rows, "columns": args.cols, "padding": args.padding,
        "trim_transparency": args.trim, "icons": []
    }
    for row in range(args.rows):
        for col in range(args.cols):
            left = round(col * image.width / args.cols) + args.padding
            top = round(row * image.height / args.rows) + args.padding
            right = round((col + 1) * image.width / args.cols) - args.padding
            bottom = round((row + 1) * image.height / args.rows) - args.padding
            if right <= left or bottom <= top:
                continue
            cell = image.crop((left, top, right, bottom))
            if args.trim:
                bounds = cell.getbbox()
                if bounds:
                    cell = cell.crop(bounds)
            index = row * args.cols + col
            filename = f"icon-{index:03d}.png"
            cell.save(output / filename, optimize=True)
            manifest["icons"].append({
                "index": index, "row": row, "column": col,
                "source_rect": [left, top, right, bottom],
                "file": filename, "size": list(cell.size)
            })
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Sliced {len(manifest['icons'])} cells from {image.width}x{image.height} into: {output.resolve()}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
