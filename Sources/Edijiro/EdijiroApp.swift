import SwiftUI

@main
struct EdijiroApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        Window("Edijiro", id: "main") {
            ContentView()
        }
        .defaultSize(width: 600, height: 500)

        Settings {
            PreferencesView()
        }
    }
}

class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.activate(ignoringOtherApps: true)

        if let window = NSApp.windows.first {
            window.delegate = self
            window.standardWindowButton(.closeButton)?.isHidden = true
            window.standardWindowButton(.miniaturizeButton)?.isHidden = true
            window.standardWindowButton(.zoomButton)?.isHidden = true
        }
    }

    func windowShouldClose(_ sender: NSWindow) -> Bool {
        return false
    }
}
