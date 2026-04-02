// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Edijiro",
    platforms: [
        .macOS(.v14)
    ],
    targets: [
        .executableTarget(
            name: "Edijiro",
            path: "Sources/Edijiro",
            exclude: ["Info.plist"]
        )
    ]
)
