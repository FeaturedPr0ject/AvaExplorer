# AvaExplorer XP

A lightweight Windows file manager prototype with a Windows XP Explorer-inspired interface.

## XP-inspired UI

- `assets/xp-ui/icons.svg` contains original fallback SVG symbols.
- `assets/xp-ui/theme.css` and `theme.json` define reusable UI tokens.
- If you have a Windows XP Shell32 icon pack for personal/educational use, place the extracted `ICON*.ico` files in `assets/xp-ui/windows-xp/shell32.dll/`. AvaExplorer uses selected shell icons for folders, drives, common file types, Search and sidebar actions, then falls back to the SVG sprite when a local icon is absent.
- The locally supplied shell icon folder is ignored by Git so Microsoft system assets are not accidentally republished in this public repository. Those graphics remain subject to Microsoft's licensing terms; check the original source's legal notice before redistribution.

## Run from source

- Windows 10 or Windows 11
- Python 3.10+
- WebView2 Runtime

```powershell
py -m pip install -r requirements.txt
py app.py
```

## Build an EXE

Run `build.bat`. PyInstaller includes the `assets` directory. The executable is usually `dist\\AvaExplorer\\AvaExplorer.exe`; keep the whole directory together.

## Current features and limitations

- Browse folders and drives, use address bar and Back/Forward
- Create folders, rename, delete with confirmation
- Open files with their default Windows application
- Search filenames in the current folder

Deletion is permanent in this prototype. Confirm carefully before deleting files or folders. Native Explorer Shell context menus, Recycle Bin integration, copy/paste, and drag-and-drop are not implemented yet.
