from __future__ import annotations

import argparse
import colorsys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "apps/frontend/public/avatar-complete/v1/characters"
OUTPUT_DIR = ROOT / "apps/frontend/public/avatar-complete/v2/characters"


@dataclass(frozen=True)
class HairMaskConfig:
    source_name: str
    polygons: tuple[tuple[tuple[int, int], ...], ...]
    hue_ranges: tuple[tuple[float, float], ...]
    min_saturation: float
    min_value: float
    min_red_green_delta: int | None = None
    min_green_blue_delta: int | None = None
    exclusion_ellipses: tuple[tuple[int, int, int, int], ...] = ()
    protected_hue_ranges: tuple[tuple[float, float], ...] = ()


@dataclass(frozen=True)
class HairColor:
    hue: float
    saturation: float
    lightness_range: tuple[float, float]


MASK_CONFIGS = {
    "smiley": HairMaskConfig(
        source_name="smiley.png",
        polygons=(
            (
                (250, 45),
                (520, 45),
                (545, 245),
                (490, 350),
                (280, 350),
                (225, 245),
            ),
            (
                (318, 190),
                (369, 184),
                (372, 207),
                (320, 211),
            ),
            (
                (399, 184),
                (451, 190),
                (449, 211),
                (397, 207),
            ),
        ),
        hue_ranges=((0.0, 0.16),),
        min_saturation=0.46,
        min_value=0.12,
        min_red_green_delta=88,
        min_green_blue_delta=36,
    ),
    "explorer": HairMaskConfig(
        source_name="explorer.png",
        polygons=(
            (
                (245, 45),
                (525, 45),
                (555, 235),
                (505, 350),
                (265, 350),
                (215, 235),
            ),
            (
                (291, 205),
                (367, 235),
                (351, 278),
                (370, 320),
                (351, 360),
                (366, 410),
                (344, 503),
                (278, 503),
                (292, 450),
                (274, 405),
                (292, 365),
                (276, 325),
                (294, 280),
            ),
            (
                (321, 171),
                (371, 165),
                (375, 187),
                (322, 193),
            ),
            (
                (398, 165),
                (450, 171),
                (448, 193),
                (396, 187),
            ),
        ),
        hue_ranges=((0.09, 0.19),),
        min_saturation=0.28,
        min_value=0.16,
        min_green_blue_delta=78,
    ),
    "star": HairMaskConfig(
        source_name="star.png",
        polygons=(
            (
                (235, 40),
                (545, 40),
                (585, 325),
                (535, 515),
                (255, 515),
                (195, 310),
            ),
            (
                (318, 192),
                (369, 187),
                (372, 210),
                (319, 214),
            ),
            (
                (397, 187),
                (449, 192),
                (448, 214),
                (395, 210),
            ),
        ),
        hue_ranges=((0.80, 1.0), (0.0, 0.025)),
        min_saturation=0.18,
        min_value=0.15,
        exclusion_ellipses=((316, 215, 380, 286), (390, 215, 455, 286)),
        protected_hue_ranges=((0.60, 0.88),),
    ),
}


HAIR_COLORS = {
    "red": HairColor(hue=0.025, saturation=0.82, lightness_range=(0.12, 0.64)),
    "pink": HairColor(hue=0.94, saturation=0.72, lightness_range=(0.25, 0.78)),
    "blue": HairColor(hue=0.58, saturation=0.75, lightness_range=(0.11, 0.62)),
    "brown": HairColor(hue=0.065, saturation=0.58, lightness_range=(0.07, 0.43)),
    "blonde": HairColor(hue=0.12, saturation=0.68, lightness_range=(0.30, 0.86)),
    "black": HairColor(hue=0.62, saturation=0.12, lightness_range=(0.025, 0.22)),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate flattened Questory hair-color variants from complete master avatars."
    )
    parser.add_argument(
        "--debug-dir",
        type=Path,
        help="Optional directory for mask previews and a contact sheet.",
    )
    parser.add_argument(
        "--style",
        choices=tuple(MASK_CONFIGS),
        help="Generate only one style while refining its mask.",
    )
    return parser.parse_args()


def hue_matches(hue: float, ranges: tuple[tuple[float, float], ...]) -> bool:
    return any(start <= hue <= end for start, end in ranges)


def build_mask(image: Image.Image, config: HairMaskConfig) -> Image.Image:
    geometry = Image.new("L", image.size, 0)
    draw = ImageDraw.Draw(geometry)
    for polygon in config.polygons:
        draw.polygon(polygon, fill=255)

    protected = Image.new("L", image.size, 0)
    protected_draw = ImageDraw.Draw(protected)
    for ellipse in config.exclusion_ellipses:
        protected_draw.ellipse(ellipse, fill=255)

    source = image.convert("RGBA")
    mask = Image.new("L", image.size, 0)
    source_pixels = source.load()
    geometry_pixels = geometry.load()
    protected_pixels = protected.load()
    mask_pixels = mask.load()
    geometry_box = geometry.getbbox()

    if geometry_box is None:
        raise RuntimeError(f"Hair geometry for {config.source_name} is empty.")

    for y in range(geometry_box[1], geometry_box[3]):
        for x in range(geometry_box[0], geometry_box[2]):
            if geometry_pixels[x, y] == 0:
                continue

            red, green, blue, alpha = source_pixels[x, y]
            if alpha == 0:
                continue

            hue, saturation, value = colorsys.rgb_to_hsv(red / 255, green / 255, blue / 255)
            if protected_pixels[x, y] and hue_matches(hue, config.protected_hue_ranges):
                continue
            if (
                hue_matches(hue, config.hue_ranges)
                and saturation >= config.min_saturation
                and value >= config.min_value
                and (
                    config.min_red_green_delta is None
                    or red - green >= config.min_red_green_delta
                )
                and (
                    config.min_green_blue_delta is None
                    or green - blue >= config.min_green_blue_delta
                )
            ):
                mask_pixels[x, y] = alpha

    return mask


def percentile(values: list[float], fraction: float) -> float:
    if not values:
        raise ValueError("Cannot calculate a percentile for an empty list.")

    position = min(len(values) - 1, max(0, round((len(values) - 1) * fraction)))
    return sorted(values)[position]


def recolor_hair(source: Image.Image, mask: Image.Image, color: HairColor) -> Image.Image:
    result = source.convert("RGBA").copy()
    source_pixels = source.convert("RGBA").load()
    result_pixels = result.load()
    mask_pixels = mask.load()
    lightness_values: list[float] = []
    mask_box = mask.getbbox()

    if mask_box is None:
        raise RuntimeError("Cannot recolor an empty hair mask.")

    for y in range(mask_box[1], mask_box[3]):
        for x in range(mask_box[0], mask_box[2]):
            if mask_pixels[x, y] == 0:
                continue
            red, green, blue, _alpha = source_pixels[x, y]
            _hue, lightness, _saturation = colorsys.rgb_to_hls(red / 255, green / 255, blue / 255)
            lightness_values.append(lightness)

    low_source = percentile(lightness_values, 0.03)
    high_source = percentile(lightness_values, 0.97)
    source_span = max(0.01, high_source - low_source)
    low_target, high_target = color.lightness_range

    for y in range(mask_box[1], mask_box[3]):
        for x in range(mask_box[0], mask_box[2]):
            mask_alpha = mask_pixels[x, y] / 255
            if mask_alpha == 0:
                continue

            red, green, blue, alpha = source_pixels[x, y]
            _hue, lightness, source_saturation = colorsys.rgb_to_hls(
                red / 255, green / 255, blue / 255
            )
            normalized_lightness = min(1.0, max(0.0, (lightness - low_source) / source_span))
            target_lightness = low_target + normalized_lightness * (high_target - low_target)
            target_saturation = min(1.0, max(0.0, color.saturation * (0.8 + source_saturation * 0.2)))
            target_red, target_green, target_blue = colorsys.hls_to_rgb(
                color.hue, target_lightness, target_saturation
            )

            result_pixels[x, y] = (
                round(red * (1 - mask_alpha) + target_red * 255 * mask_alpha),
                round(green * (1 - mask_alpha) + target_green * 255 * mask_alpha),
                round(blue * (1 - mask_alpha) + target_blue * 255 * mask_alpha),
                alpha,
            )

    return result


def create_contact_sheet(images: list[tuple[str, Image.Image]], destination: Path) -> None:
    preview_width = 192
    preview_height = 288
    label_height = 28
    columns = len(HAIR_COLORS)
    rows = max(1, (len(images) + columns - 1) // columns)
    sheet = Image.new("RGBA", (preview_width * columns, (preview_height + label_height) * rows), "#edf7f2")
    draw = ImageDraw.Draw(sheet)

    for index, (label, image) in enumerate(images):
        row = index // columns
        column = index % columns
        preview = image.copy()
        preview.thumbnail((preview_width, preview_height), Image.Resampling.LANCZOS)
        x = column * preview_width + (preview_width - preview.width) // 2
        y = row * (preview_height + label_height) + (preview_height - preview.height) // 2
        sheet.alpha_composite(preview, (x, y))
        draw.text(
            (column * preview_width + 8, row * (preview_height + label_height) + preview_height + 5),
            label,
            fill="#172033",
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.convert("RGB").save(destination, quality=92)


def assert_non_hair_pixels_unchanged(
    source: Image.Image,
    variant: Image.Image,
    mask: Image.Image,
    label: str,
) -> None:
    background = Image.new("RGBA", source.size, "#edf7f2")
    source_visible = Image.alpha_composite(background, source)
    variant_visible = Image.alpha_composite(background, variant)
    difference = ImageChops.difference(source_visible, variant_visible)
    binary_mask = mask.point(lambda value: 255 if value else 0)
    outside_mask = ImageOps.invert(binary_mask)
    outside_difference = Image.composite(
        difference,
        Image.new("RGBA", source.size, (0, 0, 0, 0)),
        outside_mask,
    )

    if outside_difference.getbbox() is not None:
        raise RuntimeError(f"Variant {label} changed visible pixels outside the hair mask.")


def main() -> None:
    args = parse_args()
    generated: list[tuple[str, Image.Image]] = []

    selected_configs = (
        {args.style: MASK_CONFIGS[args.style]}
        if args.style
        else MASK_CONFIGS
    )

    for style_key, config in selected_configs.items():
        source_path = SOURCE_DIR / config.source_name
        source = Image.open(source_path).convert("RGBA")
        mask = build_mask(source, config)

        if mask.getbbox() is None:
            raise RuntimeError(f"Hair mask for {style_key} is empty.")

        if args.debug_dir:
            args.debug_dir.mkdir(parents=True, exist_ok=True)
            overlay = source.copy()
            red_overlay = Image.new("RGBA", source.size, (255, 0, 0, 0))
            red_overlay.putalpha(mask.point(lambda value: round(value * 0.55)))
            overlay.alpha_composite(red_overlay)
            overlay.save(args.debug_dir / f"{style_key}-mask.png")

        style_output_dir = OUTPUT_DIR / style_key
        style_output_dir.mkdir(parents=True, exist_ok=True)

        for color_key, color in HAIR_COLORS.items():
            variant = recolor_hair(source, mask, color)
            output_path = style_output_dir / f"{color_key}.webp"
            variant.save(output_path, "WEBP", lossless=True, method=6)
            exported_variant = Image.open(output_path).convert("RGBA")
            assert_non_hair_pixels_unchanged(
                source,
                exported_variant,
                mask,
                f"{style_key}/{color_key}",
            )
            generated.append((f"{style_key} / {color_key}", exported_variant))

    if args.debug_dir:
        create_contact_sheet(generated, args.debug_dir / "hair-variants-contact-sheet.jpg")

    print(f"Generated {len(generated)} complete avatar variants in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
