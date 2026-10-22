#!/bin/zsh
# One-shot build: install dependencies, prepare assets, render the MV.
#   ./render.sh          -> mv/world.execute(me)_claude_edition_1080p60.mp4
#   ./render.sh 4k       -> mv/world.execute(me)_claude_edition_4K60.mp4
#   ./render.sh both
# Needs: Node.js 20+, ImageMagick 7, and the song in source/ (see README).
set -e
ROOT=${0:A:h}
cd $ROOT
command -v node   >/dev/null || { echo "Node.js 20+ is required" >&2; exit 1; }
command -v magick >/dev/null || { echo "ImageMagick 7 (magick) is required" >&2; exit 1; }
[[ -d studio/node_modules ]] || (cd studio && npm ci)
work/tools/prepare.sh
case ${1:-1080} in
  1080|1080p) work/tools/render_final.sh ;;
  4k|4K)      work/tools/render_4k.sh ;;
  both)       work/tools/render_final.sh && work/tools/render_4k.sh ;;
  *) echo "usage: ./render.sh [1080|4k|both]" >&2; exit 1 ;;
esac
ls -la mv/*.mp4
