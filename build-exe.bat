@echo off
title Build Tiger Pomodoro Executable
echo ======================================================
echo    Packaging Tiger Pomodoro into Windows .exe ...
echo ======================================================
echo.

cmd.exe /c npm run build:exe

echo.
echo ======================================================
echo    Build complete! Check the "dist" folder for:
echo    - dist\Tiger-Pomodoro-Windows.exe (Standalone single file)
echo    - dist\win-unpacked\Tiger Pomodoro.exe (Unpacked folder)
echo ======================================================
pause
