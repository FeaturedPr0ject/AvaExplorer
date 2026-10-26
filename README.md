# AvaExplorer XP

A lightweight Windows file manager prototype with a custom Windows XP Explorer-inspired interface.

## XP-inspired UI assets

The `assets/xp-ui/` directory contains the original SVG icon sprite plus reusable theme tokens. The SVG symbols cover file and folder types, drive and computer icons, toolbar actions, and sidebar shortcuts. These were drawn for this project rather than extracted from Windows system files.

## Sprite slicing utilities

- Open `tools/sprite-slicer.html` in a browser to load a sprite sheet, configure rows/columns, click a cell, and download that crop as a PNG.
- For batch slicing, install the optional dependency with `py -m pip install -r tools/requirements-slicer.txt`, then run:

```bat
py tools/slice_xp_sprite.py assets/xp-ui/source/windows-xp-sprite.png --rows 20 --cols 20
```

The script writes `assets/xp-ui/sliced/icon-000.png ...` and a `manifest.json` containing row/column coordinates. Put a sprite sheet at that path or pass a custom image path as the first argument. Add source sheets only when you have permission to redistribute them.

## Run from source

- Windows 10 or Windows 11
- Python 3.10+
- WebView2 Runtime

```powershell
py -m pip install -r requirements.txt
py app.py
```

## Build an EXE

Run `build.bat`. It uses PyInstaller and includes the `assets` directory. The executable is usually `dist\\AvaExplorer\\AvaExplorer.exe`; keep the whole directory together.

## Current features and limitations

- Browse folders and drives, use address bar and Back/Forward
- Create folders, rename, delete with confirmation
- Open files with their default Windows application
- Search filenames in the current folder

Deletion is permanent in this prototype. Confirm carefully before deleting files or folders. Native Explorer shell context menus, Recycle Bin integration, copy/paste, and drag-and-drop are not implemented yet.
