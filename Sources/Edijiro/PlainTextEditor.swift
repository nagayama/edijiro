import SwiftUI
import AppKit

struct PlainTextEditor: NSViewRepresentable {
    @Binding var text: String
    var theme: Theme
    var fontSize: Double
    var fontFamily: String
    var onTextChange: ((Int, Int) -> Void)?

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeNSView(context: Context) -> NSScrollView {
        let scrollView = NSScrollView()
        scrollView.hasVerticalScroller = true
        scrollView.hasHorizontalScroller = false
        scrollView.autohidesScrollers = true
        scrollView.borderType = .noBorder
        scrollView.drawsBackground = false

        let textView = PlainNSTextView()
        textView.isRichText = false
        textView.allowsUndo = true
        textView.isEditable = true
        textView.isSelectable = true
        textView.usesFindBar = true
        textView.isAutomaticQuoteSubstitutionEnabled = false
        textView.isAutomaticDashSubstitutionEnabled = false
        textView.isAutomaticTextReplacementEnabled = false
        textView.isAutomaticSpellingCorrectionEnabled = false
        textView.isAutomaticLinkDetectionEnabled = false
        textView.isAutomaticDataDetectionEnabled = false
        textView.smartInsertDeleteEnabled = false

        textView.autoresizingMask = [.width]
        textView.isVerticallyResizable = true
        textView.isHorizontallyResizable = false
        textView.textContainerInset = NSSize(width: 8, height: 8)
        textView.textContainer?.widthTracksTextView = true

        textView.delegate = context.coordinator
        textView.string = text

        scrollView.documentView = textView
        context.coordinator.textView = textView

        applyAppearance(to: textView)

        DispatchQueue.main.async {
            textView.window?.makeFirstResponder(textView)
            self.notifyTextChange(textView.string)
        }

        return scrollView
    }

    func updateNSView(_ scrollView: NSScrollView, context: Context) {
        guard let textView = scrollView.documentView as? PlainNSTextView else { return }

        if textView.string != text {
            let selectedRanges = textView.selectedRanges
            textView.string = text
            textView.selectedRanges = selectedRanges
        }

        applyAppearance(to: textView)
    }

    private func applyAppearance(to textView: NSTextView) {
        let font: NSFont
        if !fontFamily.isEmpty, let customFont = NSFont(name: fontFamily, size: fontSize) {
            font = customFont
        } else {
            font = NSFont.monospacedSystemFont(ofSize: fontSize, weight: .regular)
        }

        textView.font = font
        textView.textColor = theme.nsTextColor
        textView.backgroundColor = theme.nsBackgroundColor
        textView.insertionPointColor = theme.nsCursorColor

        if let scrollView = textView.enclosingScrollView {
            scrollView.backgroundColor = theme.nsBackgroundColor
        }
    }

    private func notifyTextChange(_ string: String) {
        let characterCount = string.count
        let lineCount = string.components(separatedBy: "\n").count
        onTextChange?(characterCount, lineCount)
    }

    class Coordinator: NSObject, NSTextViewDelegate {
        var parent: PlainTextEditor
        weak var textView: PlainNSTextView?

        init(_ parent: PlainTextEditor) {
            self.parent = parent
        }

        func textDidChange(_ notification: Notification) {
            guard let textView = notification.object as? NSTextView else { return }
            parent.text = textView.string
            parent.notifyTextChange(textView.string)
        }
    }
}

class PlainNSTextView: NSTextView {
    override func paste(_ sender: Any?) {
        pasteAsPlainText(sender)
    }
}
