@echo off
title Memasang Dashboard Laporan SDN Kalisalak 01
color 0a

echo ================================================================
echo   MEMASANG DASHBOARD LAPORAN // SDN KALISALAK 01
echo ================================================================
echo.

set "TARGET_DIR=%~dp0"
set "EXE_FILE=%TARGET_DIR%DASHBOARD_LAPORAN_GURU.exe"
set "HTA_FILE=%TARGET_DIR%DASHBOARD_LAPORAN_GURU.hta"
set "ICO_FILE=%TARGET_DIR%logo.ico"

if exist "%EXE_FILE%" (
    set "APP_TARGET=%EXE_FILE%"
) else (
    set "APP_TARGET=%HTA_FILE%"
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ws = New-Object -ComObject WScript.Shell; ^
     $desktop = [System.Environment]::GetFolderPath('Desktop'); ^
     $shortcutPath = Join-Path $desktop 'DASHBOARD LAPORAN SDN KALISALAK 01.lnk'; ^
     $s = $ws.CreateShortcut($shortcutPath); ^
     $s.TargetPath = '%APP_TARGET%'; ^
     $s.WorkingDirectory = '%TARGET_DIR%'; ^
     $s.IconLocation = '%ICO_FILE%, 0'; ^
     $s.Description = 'Aplikasi Resmi Laporan Administrasi SDN Kalisalak 01'; ^
     $s.Save();"


echo [BERHASIL] Shortcut berlogo resmi berhasil dipasang di Desktop Anda!
echo.
echo Nama Pintasan: DASHBOARD LAPORAN SDN KALISALAK 01
echo.
echo Silakan periksa layar Desktop komputer Anda dan dobel-klik untuk membuka.
echo ================================================================
pause
