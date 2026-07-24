from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "docs" / "design" / "questory-avatar-style-reference.png"
DEFAULT_OUTPUT = ROOT / "apps" / "frontend" / "public" / "avatar-art" / "v1"
DEFAULT_CONTACT_SHEET = ROOT / "docs" / "design" / "avatar-art-v1-contact-sheet.jpg"


@dataclass(frozen=True)
class Asset:
    name: str
    box: tuple[int, int, int, int]
    trim_result: bool = True


ASSETS = [
    # Hair keeps the blank mannequin face. The renderer places the image behind
    # Questory's head and repeats only the upper fringe in front of the forehead.
    Asset("hair-spiky-black", (1165, 57, 1255, 178), False),
    Asset("hair-wavy-brown", (1259, 57, 1350, 178), False),
    Asset("hair-long-blonde", (1354, 57, 1445, 178), False),
    Asset("hair-short-red", (1449, 57, 1540, 178), False),
    Asset("hair-curly-black", (1165, 184, 1255, 313), False),
    Asset("hair-buns-pink", (1259, 184, 1350, 313), False),
    Asset("hair-cap-red", (1354, 184, 1445, 313), False),
    Asset("hair-braid-blonde", (1449, 184, 1540, 313), False),
    Asset("hat-cap-teal", (1165, 316, 1255, 396)),
    Asset("hat-wizard-purple", (1259, 316, 1350, 396)),
    Asset("hat-beanie-gold", (1354, 316, 1445, 396)),
    Asset("hat-cap-blue", (1449, 316, 1540, 396)),
    Asset("glasses-round-black", (1165, 402, 1255, 447)),
    Asset("glasses-square-red", (1259, 402, 1350, 447)),
    Asset("glasses-square-teal", (1354, 402, 1445, 447)),
    Asset("glasses-heart", (1449, 402, 1540, 447)),
    Asset("top-hoodie-teal", (1165, 459, 1255, 574)),
    Asset("top-sun-yellow", (1259, 459, 1350, 574)),
    Asset("top-mountain", (1354, 459, 1445, 574)),
    Asset("top-hoodie-purple", (1449, 459, 1540, 574)),
    Asset("bottom-cargo-black", (1165, 575, 1255, 657)),
    Asset("bottom-skirt-denim", (1259, 575, 1350, 657)),
    Asset("bottom-cargo-green", (1354, 575, 1445, 657)),
    Asset("bottom-skirt-purple", (1449, 575, 1540, 657)),
    Asset("shoes-teal", (1165, 668, 1255, 734)),
    Asset("shoes-yellow", (1259, 668, 1350, 734)),
    Asset("shoes-blue", (1354, 668, 1445, 734)),
    Asset("shoes-boots-brown", (1449, 668, 1540, 734)),
    Asset("backpack-teal", (1165, 746, 1255, 864)),
    Asset("backpack-purple", (1259, 746, 1350, 864)),
    Asset("backpack-brown", (1354, 746, 1445, 864)),
    Asset("backpack-pink", (1449, 746, 1540, 864)),
    Asset("weapon-staff", (1557, 62, 1617, 365)),
    Asset("weapon-wand", (1632, 96, 1683, 279)),
    Asset("weapon-sword", (1631, 284, 1685, 452)),
    Asset("gadget-camera", (1560, 474, 1681, 556)),
    Asset("pet-cat", (1564, 557, 1678, 715)),
    Asset("pet-dragon", (1554, 716, 1683, 876)),
]


def is_catalog_background(pixel: tuple[int, int, int]) -> bool:
    darkest = min(pixel)
    lightest = max(pixel)
    return darkest >= 188 and lightest - darkest <= 62


def edge_background_mask(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    width, height = rgb.size
    mask = Image.new("L", rgb.size, 0)
    pixels = rgb.load()
    output = mask.load()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if output[x, y]:
            continue
        if not is_catalog_background(pixels[x, y]):
            continue
        output[x, y] = 255
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    return mask.filter(ImageFilter.MaxFilter(3))


def make_transparent(image: Image.Image, masks: list[Image.Image]) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    for mask in masks:
        alpha = Image.composite(Image.new("L", alpha.size, 0), alpha, mask)
    rgba.putalpha(alpha)
    return rgba


def remove_edge_fragments(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    pixels = alpha.load()
    visited: set[tuple[int, int]] = set()
    components: list[list[tuple[int, int]]] = []

    for start_y in range(image.height):
        for start_x in range(image.width):
            if pixels[start_x, start_y] == 0 or (start_x, start_y) in visited:
                continue
            queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
            visited.add((start_x, start_y))
            component: list[tuple[int, int]] = []

            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for neighbor in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    nx, ny = neighbor
                    if 0 <= nx < image.width and 0 <= ny < image.height and pixels[nx, ny] > 0 and neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)

            components.append(component)

    if not components:
        return image

    largest = max(components, key=len)
    cleaned_alpha = alpha.copy()
    cleaned_pixels = cleaned_alpha.load()
    for component in components:
        if component is largest:
            continue
        touches_edge = any(x <= 1 or y <= 1 or x >= image.width - 2 or y >= image.height - 2 for x, y in component)
        if touches_edge and len(component) < len(largest) * 0.35:
            for x, y in component:
                cleaned_pixels[x, y] = 0

    cleaned = image.copy()
    cleaned.putalpha(cleaned_alpha)
    return cleaned


def trim(image: Image.Image, padding: int = 4) -> Image.Image:
    box = image.getchannel("A").getbbox()
    if box is None:
        return image
    left = max(0, box[0] - padding)
    top = max(0, box[1] - padding)
    right = min(image.width, box[2] + padding)
    bottom = min(image.height, box[3] + padding)
    return image.crop((left, top, right, bottom))


def contact_sheet(images: list[tuple[str, Image.Image]], output: Path) -> None:
    thumb_width = 180
    thumb_height = 180
    columns = 5
    rows = (len(images) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * thumb_width, rows * (thumb_height + 28)), "#f8f5ed")
    draw = ImageDraw.Draw(sheet)

    for index, (name, image) in enumerate(images):
        x = (index % columns) * thumb_width
        y = (index // columns) * (thumb_height + 28)
        preview = image.copy()
        preview.thumbnail((thumb_width - 18, thumb_height - 18), Image.Resampling.LANCZOS)
        px = x + (thumb_width - preview.width) // 2
        py = y + (thumb_height - preview.height) // 2
        checker = Image.new("RGB", preview.size, "#dceee4")
        if preview.mode == "RGBA":
            checker.paste(preview, mask=preview.getchannel("A"))
        else:
            checker.paste(preview)
        sheet.paste(checker, (px, py))
        draw.text((x + 8, y + thumb_height + 4), name, fill="#2f333d")

    sheet.save(output, quality=92)


def main() -> None:
    source = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_SOURCE
    output = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else DEFAULT_OUTPUT
    output.mkdir(parents=True, exist_ok=True)
    original = Image.open(source).convert("RGB")
    rendered: list[tuple[str, Image.Image]] = []

    for asset in ASSETS:
        crop = original.crop(asset.box)
        masks = [edge_background_mask(crop)]
        transparent = remove_edge_fragments(make_transparent(crop, masks))
        result = trim(transparent) if asset.trim_result else transparent
        result.save(output / f"{asset.name}.webp", "WEBP", lossless=True, method=6)
        rendered.append((asset.name, result))

    contact_sheet(rendered, DEFAULT_CONTACT_SHEET)
    print(f"Extracted {len(rendered)} assets to {output}")


if __name__ == "__main__":
    main()
