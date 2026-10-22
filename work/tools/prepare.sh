#!/bin/zsh
# Prepare render inputs that are not stored in git:
#   1. studio/public/audio/song.m4a  <- the song from source/ (bring your own copy; not committed)
#   2. studio/public/img/*.png       <- assets/gen/*.png, trimmed (characters) and upscaled 2.5x (EWA LanczosSharp + unsharp)
# Requires: ImageMagick 7 (magick), ffmpeg/ffprobe (only if the audio needs transcoding / for the duration check)
set -e
ROOT=${0:A:h:h:h}
cd $ROOT
IMG=studio/public/img
AUD=studio/public/audio
mkdir -p $IMG $AUD

# ---------- audio
src=""
for f in source/*.m4a(N) source/*.mp3(N) source/*.wav(N) source/*.flac(N) source/*.aac(N); do src=$f; break; done
if [[ -z $src ]]; then
  echo "!! no audio found in source/ — put Mili's 'world.execute(me);' (official MV audio, 3:32) there" >&2
  exit 1
fi
if [[ $src == *.m4a ]]; then
  cp -f "$src" $AUD/song.m4a
else
  ffmpeg -v error -y -i "$src" -vn -c:a aac -b:a 320k $AUD/song.m4a
fi
# duration sanity check (skipped if ffprobe is unavailable or broken)
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $AUD/song.m4a 2>/dev/null) || d=""
if [[ -n $d ]]; then
  echo "audio: $src -> $AUD/song.m4a (${d}s)"
  python3 -c "import sys; d=float('$d'); sys.exit(0 if abs(d-212.32)<0.5 else 1)" 2>/dev/null || echo "!! warning: expected ~212.32 s (official MV audio); lyric/beat timings assume that version" >&2
else
  echo "audio: $src -> $AUD/song.m4a (duration not checked)"
fi

# ---------- images (6 in parallel)
UP=(-filter LanczosSharp -distort Resize 250% -unsharp 0x2+0.6+0.01 -define png:compression-level=6)
for f in assets/gen/*.png; do
  n=${f:t}
  [[ $n == sheet_* ]] && continue
  if [[ $n == cc_* || $n == ck_* ]]; then
    # transparent character art: trim to content + 8px margin, then upscale
    print -r -- "magick '$f' -trim +repage -bordercolor none -border 8 ${UP[*]} '$IMG/$n'"
  else
    # opaque scene art: upscale only
    print -r -- "magick '$f' ${UP[*]} '$IMG/$n'"
  fi
done | xargs -P 6 -I{} sh -c {}
echo "images: $(ls $IMG/*.png | wc -l | tr -d ' ') files in $IMG"
