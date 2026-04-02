import SwiftUI

struct PreferencesView: View {
    @AppStorage("edijiro-theme") private var themeName: String = Theme.dark.rawValue
    @AppStorage("edijiro-fontSize") private var fontSize: Double = 13
    @AppStorage("edijiro-fontFamily") private var fontFamily: String = ""

    private static let fontFamilies: [String] = {
        let manager = NSFontManager.shared
        return manager.availableFontFamilies.sorted()
    }()

    var body: some View {
        Form {
            Picker("Theme", selection: $themeName) {
                ForEach(Theme.allCases) { theme in
                    Text(theme.displayName).tag(theme.rawValue)
                }
            }
            .pickerStyle(.segmented)

            HStack {
                Text("Font Size: \(Int(fontSize))px")
                Slider(value: $fontSize, in: 10...40, step: 1)
            }

            Picker("Font Family", selection: $fontFamily) {
                Text("System Mono (Default)").tag("")
                ForEach(Self.fontFamilies, id: \.self) { family in
                    Text(family).tag(family)
                }
            }
        }
        .padding()
        .frame(width: 350)
    }
}
