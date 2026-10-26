import os
import sys
import shutil
import subprocess
import webview
from pathlib import Path

APP_NAME = "AvaExplorer XP"

def resource_path(relative):
    root = getattr(sys, "_MEIPASS", os.path.abspath("."))
    return os.path.join(root, relative)

class FileAPI:
    def __init__(self):
        self.current_path = str(Path.home())
        self.window = None
        self._maximized = False

    def minimize_window(self):
        if self.window:
            self.window.minimize()
        return True

    def toggle_maximize(self):
        if not self.window:
            return {"maximized": False}
        if self._maximized:
            self.window.restore()
            self._maximized = False
        else:
            self.window.maximize()
            self._maximized = True
        return {"maximized": self._maximized}

    def close_window(self):
        if self.window:
            self.window.destroy()
        return True

    def get_drives(self):
        drives = []
        if os.name == "nt":
            import string
            for letter in string.ascii_uppercase:
                p = f"{letter}:\\"
                if os.path.exists(p):
                    drives.append({"name": f"Local Disk ({letter}:)", "path": p, "kind": "drive"})
        else:
            drives.append({"name": "/", "path": "/", "kind": "drive"})
        return drives

    def list_dir(self, path=None):
        candidate = os.path.abspath(os.path.expanduser(path)) if path else self.current_path
        if not os.path.isdir(candidate):
            return {"ok": False, "error": "Folder does not exist."}
        try:
            self.current_path = candidate
            entries = []
            with os.scandir(candidate) as scan:
                for entry in scan:
                    try:
                        st = entry.stat(follow_symlinks=False)
                        is_dir = entry.is_dir(follow_symlinks=False)
                        entries.append({
                            "name": entry.name,
                            "path": entry.path,
                            "type": "File folder" if is_dir else (Path(entry.name).suffix[1:].upper() + " File" if Path(entry.name).suffix else "File"),
                            "size": None if is_dir else st.st_size,
                            "modified": __import__("datetime").datetime.fromtimestamp(st.st_mtime).strftime("%m/%d/%Y %I:%M %p"),
                            "is_dir": is_dir
                        })
                    except (PermissionError, OSError):
                        continue
            entries.sort(key=lambda x: (not x["is_dir"], x["name"].lower()))
            return {"ok": True, "path": candidate, "items": entries}
        except (PermissionError, OSError) as e:
            return {"ok": False, "error": str(e)}

    def create_folder(self, parent, name):
        name = (name or "").strip()
        if not name or name in (".", "..") or any(c in name for c in '<>:"/\\|?*'):
            return {"ok": False, "error": "Enter a valid folder name."}
        target = os.path.join(os.path.abspath(parent), name)
        try:
            os.mkdir(target)
            return {"ok": True}
        except OSError as e:
            return {"ok": False, "error": str(e)}

    def rename_item(self, old_path, new_name):
        new_name = (new_name or "").strip()
        if not new_name or new_name in (".", "..") or any(c in new_name for c in '<>:"/\\|?*'):
            return {"ok": False, "error": "Enter a valid name."}
        target = os.path.join(os.path.dirname(os.path.abspath(old_path)), new_name)
        try:
            os.rename(old_path, target)
            return {"ok": True}
        except OSError as e:
            return {"ok": False, "error": str(e)}

    def delete_item(self, path):
        path = os.path.abspath(path)
        try:
            if os.path.isdir(path) and not os.path.islink(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
            return {"ok": True}
        except OSError as e:
            return {"ok": False, "error": str(e)}

    def open_item(self, path):
        path = os.path.abspath(path)
        try:
            if os.path.isdir(path):
                return self.list_dir(path)
            if os.name == "nt":
                os.startfile(path)
            elif sys.platform == "darwin":
                subprocess.Popen(["open", path])
            else:
                subprocess.Popen(["xdg-open", path])
            return {"ok": True}
        except Exception as e:
            return {"ok": False, "error": str(e)}

    def parent_path(self, path):
        parent = os.path.dirname(os.path.abspath(path))
        return self.list_dir(parent or path)

def main():
    api = FileAPI()
    window = webview.create_window(
        APP_NAME,
        url=resource_path("index.html"),
        js_api=api,
        width=1100,
        height=720,
        min_size=(760, 480),
        background_color="#ECE9D8",
        frameless=True,
        easy_drag=True,
        shadow=True
    )
    api.window = window
    webview.start(debug=False)

if __name__ == "__main__":
    main()
