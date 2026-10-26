@echo off
setlocal
cd /d "%~dp0"
echo Installing build dependencies...
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
if errorlevel 1 goto error
echo Building AvaExplorer XP...
py -m PyInstaller --noconfirm --clean --windowed --name AvaExplorer --add-data "index.html;." --add-data "styles.css;." --add-data "app.js;." --add-data "assets;assets" app.py
if errorlevel 1 goto error
echo.
echo Build complete. Check dist\AvaExplorer\AvaExplorer.exe
pause
exit /b 0
:error
echo.
echo Build failed. Check the messages above.
pause
exit /b 1
