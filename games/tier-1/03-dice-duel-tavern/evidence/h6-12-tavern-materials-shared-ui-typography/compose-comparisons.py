from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
H611 = ROOT.parent / "h6-11-live-dierig-random-d6-integration" / "captures"
H612 = ROOT / "captures"


def compose(before_name: str, after_name: str, output_name: str) -> None:
    before = Image.open(H611 / before_name).convert("RGB")
    after = Image.open(H612 / after_name).convert("RGB")
    target_height = min(before.height, after.height)

    def fit(image: Image.Image) -> Image.Image:
        width = round(image.width * target_height / image.height)
        return image.resize((width, target_height), Image.Resampling.LANCZOS)

    before = fit(before)
    after = fit(after)
    header = 48
    canvas = Image.new("RGB", (before.width + after.width, target_height + header), "#17101b")
    canvas.paste(before, (0, header))
    canvas.paste(after, (before.width, header))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default(size=22)
    draw.text((16, 12), "BEFORE - H6.11", fill="#fff0c4", font=font)
    draw.text((before.width + 16, 12), "AFTER - H6.12", fill="#fff0c4", font=font)
    draw.line((before.width, 0, before.width, canvas.height), fill="#bd834a", width=3)
    canvas.save(H612 / output_name, optimize=True)


compose("01-initial-ready-1920x1080.png", "01-initial-tavern-1920x1080.png", "03-before-after-1920x1080.png")
compose("01-initial-ready-1024x640.png", "01-initial-tavern-1024x640.png", "04-before-after-1024x640.png")
