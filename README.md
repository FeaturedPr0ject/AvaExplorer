# AvaExplorer XP

A lightweight Windows file manager prototype with a custom Windows XP Explorer-inspired interface.

## XP-inspired UI kit

The `assets/xp-ui/` directory includes original SVG symbols and design tokens:
- File, folder, drive, common-type and toolbar icons in `icons.svg`
- Reusable XP-inspired colors and controls in `theme.css`
- Machine-readable color and geometry values in `theme.json`
- Notes and usage examples in `assets/xp-ui/README.md`

These are original vector recreations inspired by the Windows XP visual language; the repository does not include Windows XP DLLs, system files, or extracted proprietary icon binaries.

## Requirements

- Windows 10 or Windows 11
- Python 3.10 or newer
- Microsoft Edge WebView2 Runtime (commonly already installed on modern Windows)

## Run from source

```powershell
py -m pip install -r requirements.txt
py app.py
```

## Build an EXE

Run `build.bat`. It installs the build dependencies and creates a one-folder PyInstaller build under `dist\\AvaExplorer\\`, including the `assets` directory.

The executable is typically `dist\\AvaExplorer\\AvaExplorer.exe`. Keep the generated files in that directory together.

## Current features

- Browse folders and drives
- Address bar and Back/Forward navigation
- Create folders, rename, delete with confirmation
- Open files with their default Windows app
- Search filenames in the current folder

## Safety and limitations

Deletion is permanent in this prototype. Confirm carefully before deleting files or folders. Access to protected folders may be denied by Windows. Do not run the app as Administrator unless you have a specific need. Native Windows Shell features such as the original context menu and Recycle Bin integration are not yet implemented.
