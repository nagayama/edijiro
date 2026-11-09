import SwiftUI

struct PreferencesView: View {
    @AppStorage("edijiro-theme") private var themeName: String = Theme.dark.rawValue
    @AppStorage("edijiro-fontSize") private var fontSize: Double = 13
    @AppStorage("edijiro-fontFamily") private var fontFamily: String = ""

    private static let fontSizeRange: ClosedRange<Double> = 10...40

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

            LabeledContent("Font Size") {
                HStack(spacing: 4) {
                    TextField("", value: $fontSize, format: .number)
                        .labelsHidden()
                        .multilineTextAlignment(.trailing)
                        .frame(width: 48)
                    Stepper("", value: $fontSize, in: Self.fontSizeRange, step: 1)
                        .labelsHidden()
                    Text("px")
                }
            }
            .onChange(of: fontSize) { _, newValue in
                let clamped = min(max(newValue.rounded(), Self.fontSizeRange.lowerBound), Self.fontSizeRange.upperBound)
                if clamped != newValue { fontSize = clamped }
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
