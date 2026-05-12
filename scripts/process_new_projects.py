"""
Process new project asset folders dropped from Google Drive.
- Rename to kebab-case slug folders
- Rename files to cover.{jpg,webp,avif} and detail-NN.{jpg,webp,avif} + detail-NN.mp4
- Optimize images (max 2400px, JPG q82, WebP q80, AVIF q60)
- Optimize videos (H.264 CRF 23, max 1920px width)
- Extract poster frames from videos
- Delete original Drive-named source folders
"""
from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path("e:/WebGitHub/ViAnPortfolio/assets/projects")

PROJECTS = [
    {"src": "2021 Go PrEp - Life Saigon-20260512T132055Z-3-001/2021 Go PrEp - Life Saigon", "slug": "go-prep-life-saigon"},
    {"src": "2023 Hazeline-20260512T132105Z-3-001/2023 Hazeline", "slug": "hazeline"},
    {"src": "2023 _Now is not the time_ installation -20260512T132130Z-3-001/2023 _Now is not the time_ installation", "slug": "now-is-not-the-time"},
    {"src": "2024 G.G.G-20260512T132152Z-3-001/2024 G.G.G", "slug": "g-g-g"},
    {"src": "2024 Maison Marou -20260512T132207Z-3-001/2024 Maison Marou", "slug": "maison-marou"},
    {"src": "2024 Naomi Cover-20260512T132219Z-3-001/2024 Naomi Cover", "slug": "naomi-cover"},
    {"src": "2024 Nimai-20260512T132224Z-3-001/2024 Nimai", "slug": "nimai"},
    {"src": "2024 Táo Tào-20260512T132235Z-3-001/2024 Táo Tào", "slug": "tao-tao"},
    {"src": "2024 Vesou -20260512T132614Z-3-001/2024 Vesou", "slug": "vesou"},
    {"src": "2024 Ép Phê-20260512T132142Z-3-001/2024 Ép Phê", "slug": "ep-phe"},
]

IMAGE_EXT = {".jpg", ".jpeg", ".png"}
VIDEO_EXT = {".mp4", ".mov"}
ANIM_EXT = {".gif"}

JPG_QUALITY = "3"   # ffmpeg q:v scale (2 best, 31 worst) - q=3 ~ q82
WEBP_QUALITY = "80"
AVIF_CRF = "28"     # libaom-av1: lower=better, ~28 is good photo quality
VIDEO_CRF = "23"
MAX_IMG_W = 2400
MAX_VID_W = 1920


def run(cmd: list[str]) -> None:
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        print(f"  ! ffmpeg failed: {' '.join(cmd[:6])}...")
        print(f"    stderr: {proc.stderr[-400:]}")


def encode_image_variants(src: Path, dest_base: Path) -> None:
    """src can be any raster image; produces dest_base.jpg / .webp / .avif."""
    scale_filter = f"scale='min({MAX_IMG_W},iw)':-2:flags=lanczos"

    # JPG
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
         "-i", str(src), "-vf", scale_filter, "-q:v", JPG_QUALITY,
         str(dest_base.with_suffix(".jpg"))])
    # WebP
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
         "-i", str(src), "-vf", scale_filter, "-c:v", "libwebp",
         "-quality", WEBP_QUALITY, "-compression_level", "6",
         str(dest_base.with_suffix(".webp"))])
    # AVIF (libaom-av1, single frame)
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
         "-i", str(src), "-vf", scale_filter, "-c:v", "libaom-av1",
         "-still-picture", "1", "-crf", AVIF_CRF, "-b:v", "0",
         "-cpu-used", "6", "-row-mt", "1", "-tiles", "2x2",
         str(dest_base.with_suffix(".avif"))])


def encode_image_from_video_frame(video_src: Path, dest_base: Path, ts: str = "00:00:00.5") -> None:
    """Extract a frame from a video at given timestamp, then encode 3 image variants."""
    tmp_png = dest_base.with_suffix(".__tmp.png")
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
         "-ss", ts, "-i", str(video_src), "-frames:v", "1",
         str(tmp_png)])
    if tmp_png.exists():
        encode_image_variants(tmp_png, dest_base)
        tmp_png.unlink(missing_ok=True)
    else:
        print(f"  ! could not extract frame from {video_src.name}")


def encode_video(src: Path, dest: Path) -> None:
    scale_filter = f"scale='min({MAX_VID_W},iw)':-2:flags=lanczos"
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
         "-i", str(src), "-vf", scale_filter,
         "-c:v", "libx264", "-preset", "medium", "-crf", VIDEO_CRF,
         "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "-c:a", "aac", "-b:a", "128k", "-ac", "2",
         str(dest)])


# Parse "detail 1.jpg", "detail 13.png", "detaIl 13.jpg", "detail 1 .mp4" etc.
DETAIL_RE = re.compile(r"^det[ail]+\s*([0-9]+)\b", re.IGNORECASE)
COVER_RE = re.compile(r"^cover\b", re.IGNORECASE)


def classify(name: str) -> tuple[str, int | None]:
    base = Path(name).stem
    if COVER_RE.match(base.strip()):
        return ("cover", None)
    m = DETAIL_RE.match(base.strip())
    if m:
        return ("detail", int(m.group(1)))
    return ("unknown", None)


def process_project(src_rel: str, slug: str) -> None:
    src_dir = ROOT / src_rel
    dest_dir = ROOT / slug
    if not src_dir.exists():
        print(f"[skip] missing source: {src_dir}")
        return

    dest_dir.mkdir(parents=True, exist_ok=True)
    print(f"\n=== {slug}  (src: {src_dir.name}) ===")

    cover_src: Path | None = None
    details: dict[int, Path] = {}  # index -> source file

    for f in sorted(src_dir.iterdir()):
        if not f.is_file():
            continue
        kind, idx = classify(f.name)
        if kind == "cover":
            cover_src = f
        elif kind == "detail" and idx is not None:
            # Prefer image over video if collision; otherwise just record latest.
            existing = details.get(idx)
            if existing is None:
                details[idx] = f
            else:
                prev_ext = existing.suffix.lower()
                cur_ext = f.suffix.lower()
                if prev_ext in VIDEO_EXT and cur_ext in IMAGE_EXT:
                    details[idx] = f

    # Build renumbered list (1..N) using sorted original numbers
    ordered = [details[k] for k in sorted(details.keys())]
    n_total = len(ordered)
    print(f"  cover: {cover_src.name if cover_src else '(none)'} | details: {n_total}")

    # Cover
    cover_base = dest_dir / "cover"
    if cover_src:
        ext = cover_src.suffix.lower()
        if ext in IMAGE_EXT:
            encode_image_variants(cover_src, cover_base)
        elif ext in ANIM_EXT:
            encode_image_from_video_frame(cover_src, cover_base, ts="00:00:00")
        elif ext in VIDEO_EXT:
            encode_image_from_video_frame(cover_src, cover_base)
        print(f"  cover -> OK")
    elif ordered:
        # No cover file; derive from first detail
        first = ordered[0]
        if first.suffix.lower() in VIDEO_EXT:
            encode_image_from_video_frame(first, cover_base)
        else:
            encode_image_variants(first, cover_base)
        print(f"  cover -> derived from {first.name}")

    # Details
    for i, src_f in enumerate(ordered, start=1):
        n = f"{i:02d}"
        dest_base = dest_dir / f"detail-{n}"
        ext = src_f.suffix.lower()
        if ext in IMAGE_EXT:
            encode_image_variants(src_f, dest_base)
        elif ext in VIDEO_EXT:
            encode_video(src_f, dest_base.with_suffix(".mp4"))
            # Poster
            encode_image_from_video_frame(src_f, dest_base)
        else:
            print(f"  ! skip unknown {src_f.name}")
        print(f"  detail-{n}  <-  {src_f.name}")


def cleanup_originals() -> None:
    """Delete the Drive-style top-level folders."""
    drive_pattern = re.compile(r"-2026\d{4}T\d{6}Z-\d+-\d+$")
    for p in ROOT.iterdir():
        if p.is_dir() and drive_pattern.search(p.name):
            print(f"  rm -rf {p.name}")
            shutil.rmtree(p, ignore_errors=True)


def main() -> int:
    if "--cleanup" in sys.argv:
        cleanup_originals()
        return 0

    only = None
    if "--only" in sys.argv:
        i = sys.argv.index("--only")
        only = sys.argv[i + 1] if i + 1 < len(sys.argv) else None

    for proj in PROJECTS:
        if only and proj["slug"] != only:
            continue
        process_project(proj["src"], proj["slug"])

    print("\n--- All projects processed. Use --cleanup to remove original Drive folders. ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
