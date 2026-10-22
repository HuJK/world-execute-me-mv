#!/bin/zsh
# usage: gen.sh <name> <prompt-file> [ref images...]
# Generates one image with codex (gpt-image-2) into assets/gen/<name>.png
# e.g. work/tools/gen.sh cc_cat work/prompts/cc_cat.txt assets/gen/sheet_A.png   (all poses use sheet_A.png as the style reference)
set -u
mkdir -p ${0:A:h:h}/genlogs
ROOT=${0:A:h:h:h}
OUT=$ROOT/assets/gen
name=$1; pf=$2; shift 2
imgs=()
for r in "$@"; do imgs+=(-i "$r"); done
marker=$(mktemp)
prompt="$(cat $pf)

Use your image generation tool (gpt-image-2) to create exactly ONE image for the description above. Generate it once; do not iterate or create alternatives. After it is generated, copy the PNG file into the current working directory as ${name}.png using a shell cp command (do not edit, resize or convert it). Then reply with just the word DONE."
print -r -- "$prompt" | codex exec --skip-git-repo-check -s workspace-write -C $OUT "${imgs[@]}" - > $ROOT/work/genlogs/${name}.log 2>&1
if [[ ! -f $OUT/${name}.png ]]; then
  f=$(find ~/.codex/generated_images -name '*.png' -newer $marker -print0 | xargs -0 ls -t 2>/dev/null | head -1)
  [[ -n "$f" ]] && cp "$f" $OUT/${name}.png
fi
rm -f $marker
[[ -f $OUT/${name}.png ]] && echo "OK $name $(magick identify -format '%wx%h' $OUT/${name}.png)" || echo "FAIL $name"
