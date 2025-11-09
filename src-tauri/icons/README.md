# Icons

This app needs icon files for different platforms. Use the Tauri icon generator:

```bash
npm install -g @tauri-apps/cli
npm run tauri icon /path/to/your/icon.png
```

Or manually create:
- 32x32.png
- 128x128.png
- 128x128@2x.png
- icon.icns (macOS)
- icon.ico (Windows)

For development, Tauri will use default icons if these are missing.
