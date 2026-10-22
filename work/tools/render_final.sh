#!/bin/zsh
# 1080p master: 1920x1080 @ 60 fps, H.264 + AAC 320k   (run work/tools/prepare.sh first)
set -e
ROOT=${0:A:h:h:h}
cd $ROOT/studio
export TMPDIR=${TMPDIR_RENDER:-$ROOT/work/tmp}; mkdir -p $TMPDIR $ROOT/mv
OUT=${1:-$ROOT/mv/world.execute(me)_claude_edition_1080p60.mp4}
npx remotion render src/index.ts MV "$OUT" \
  --codec=h264 --crf=14 --x264-preset=slow --pixel-format=yuv420p --color-space=bt709 \
  --image-format=png --audio-codec=aac --audio-bitrate=320k \
  --concurrency=${CONCURRENCY:-8} --timeout=120000 --log=info
