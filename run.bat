@echo off
title Tiger Pomodoro Launcher
echo ======================================================
echo          🐯 Welcome to Tiger Pomodoro! 🐯
echo ======================================================
echo.

if exist "dist\win-unpacked\Tiger Pomodoro.exe" (
    echo Starting Tiger Pomodoro Desktop App...
    start "" "dist\win-unpacked\Tiger Pomodoro.exe"
    exit
)

if exist "dist\Tiger-Pomodoro-Windows.exe" (
    echo Starting Tiger Pomodoro Portable Executable...
    start "" "dist\Tiger-Pomodoro-Windows.exe"
    exit
)

echo Starting via Electron...
cmd.exe /c npm start
