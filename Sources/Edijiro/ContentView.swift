import SwiftUI

struct ContentView: View {
    @AppStorage("edijiro-text") private var text: String = ""
    @AppStorage("edijiro-theme") private var themeName: String = Theme.dark.rawValue
    @AppStorage("edijiro-fontSize") private var fontSize: Double = 13
    @AppStorage("edijiro-fontFamily") private var fontFamily: String = ""
    @AppStorage("edijiro-alwaysOnTop") private var alwaysOnTop: Bool = false

    @State private var characterCount: Int = 0
    @State private var lineCount: Int = 0

    private var theme: Theme {
        Theme(rawValue: themeName) ?? .dark
    }

    var body: some View {
        VStack(spacing: 0) {
            PlainTextEditor(
                text: $text,
                theme: theme,
                fontSize: fontSize,
                fontFamily: fontFamily,
                onTextChange: { characters, lines in
                    characterCount = characters
                    lineCount = lines
                }
            )
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            Divider()

            HStack {
                Text("Characters: \(characterCount)  Lines: \(lineCount)")
                Spacer()
                Toggle("Always on top", isOn: $alwaysOnTop)
                    .toggleStyle(.checkbox)
                    .onChange(of: alwaysOnTop) { _, newValue in
                        setWindowLevel(newValue)
                    }
            }
            .font(.system(size: 11))
            .foregroundColor(theme.textColor.opacity(0.6))
            .padding(.horizontal, 10)
            .frame(height: 24)
            .background(theme.backgroundColor)
        }
        .background(theme.backgroundColor)
        .onAppear {
            if alwaysOnTop {
                DispatchQueue.main.async {
                    setWindowLevel(true)
                }
            }
        }
    }

    private func setWindowLevel(_ floating: Bool) {
        let level: NSWindow.Level = floating ? .floating : .normal
        for window in NSApp.windows where window.isVisible {
            window.level = level
        }
    }
}
