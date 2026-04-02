#\!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Building Edijiro..."
swift build -c release

APP_DIR="Edijiro.app/Contents/MacOS"
mkdir -p "$APP_DIR"

cp .build/release/Edijiro "$APP_DIR/Edijiro"
cp Sources/Edijiro/Info.plist Edijiro.app/Contents/Info.plist

echo ""
echo "Built: $(pwd)/Edijiro.app"
echo ""
echo "To install, copy to /Applications:"
echo "  cp -r Edijiro.app /Applications/"
