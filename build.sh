#\!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Building Edijiro..."
swift build -c release

APP_DIR="Edijiro.app/Contents/MacOS"
RES_DIR="Edijiro.app/Contents/Resources"
mkdir -p "$APP_DIR" "$RES_DIR"

cp .build/release/Edijiro "$APP_DIR/Edijiro"
cp Sources/Edijiro/Info.plist Edijiro.app/Contents/Info.plist
cp Resources/Edijiro.icns "$RES_DIR/Edijiro.icns"

echo ""
echo "Built: $(pwd)/Edijiro.app"
echo ""
echo "To install, copy to /Applications:"
echo "  cp -r Edijiro.app /Applications/"
