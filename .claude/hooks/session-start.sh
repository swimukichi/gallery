#!/bin/bash
# Claude Code on the web（スマホ含む）でセッション開始時に依存関係とフォントを入れる
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
npm install --no-audit --no-fund --loglevel=error

# サムネ・文字動画用の明朝体（しっぽり明朝 B1、SIL OFL で無料）。取れなくても続行
FONT_DIR="$HOME/.local/share/fonts"
mkdir -p "$FONT_DIR"
for w in Regular Bold; do
  f="$FONT_DIR/ShipporiMinchoB1-$w.ttf"
  [ -s "$f" ] || curl -sSfL -m 60 -o "$f" "https://raw.githubusercontent.com/google/fonts/main/ofl/shipporiminchob1/ShipporiMinchoB1-$w.ttf" || rm -f "$f"
done
fc-cache -f "$FONT_DIR" >/dev/null 2>&1 || true
