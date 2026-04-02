import SwiftUI

enum Theme: String, CaseIterable, Identifiable {
    case light
    case dark

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .light: return "Light"
        case .dark: return "Dark"
        }
    }

    var backgroundColor: Color {
        switch self {
        case .light: return Color(nsColor: .white)
        case .dark: return Color(nsColor: NSColor(red: 0.12, green: 0.12, blue: 0.14, alpha: 1.0))
        }
    }

    var textColor: Color {
        switch self {
        case .light: return Color(nsColor: .black)
        case .dark: return Color(nsColor: NSColor(red: 0.85, green: 0.85, blue: 0.85, alpha: 1.0))
        }
    }

    var nsBackgroundColor: NSColor {
        switch self {
        case .light: return .white
        case .dark: return NSColor(red: 0.12, green: 0.12, blue: 0.14, alpha: 1.0)
        }
    }

    var nsTextColor: NSColor {
        switch self {
        case .light: return .black
        case .dark: return NSColor(red: 0.85, green: 0.85, blue: 0.85, alpha: 1.0)
        }
    }

    var nsCursorColor: NSColor {
        switch self {
        case .light: return .black
        case .dark: return .white
        }
    }
}
