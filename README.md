# AvaExplorer XP

A lightweight Windows file manager prototype with a classic Windows XP Explorer-inspired interface.

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

Double-click `build.bat`. It installs the build dependencies and creates a one-folder PyInstaller build under `dist\AvaExplorer\`.

The executable is typically:

`dist\AvaExplorer\AvaExplorer.exe`

Keep the generated files in the `dist\AvaExplorer\` folder together when running the app.

## Features

- Browse folders and drives
- Address bar navigation
- Back and forward navigation
- Create folders, rename, delete with confirmation
- Open files using their default Windows application
- Search names in the current folder

## Safety

Deletion is permanent in this prototype. Confirm carefully before deleting files or folders. Access to protected folders may be denied by Windows. Do not run the app as Administrator unless you have a specific need.
