@echo off
color 0C
mode con cols=90 lines=22 >nul 2>&1
title SHUTDOWN SYSTEM // SDN KALISALAK 01

cls
echo ==========================================================================================
echo  [SYSTEM SHUTDOWN] MEMATIKAN SERVER SIM-LAPOR ^& TUNNEL CLOUDFLARE...
echo ==========================================================================================
echo.

echo [1/2] Menghentikan background daemon server Node.js pada port 2025 / 3000...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":2025" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo       -- Socket port aplikasi telah dibersihkan.

echo [2/3] Menghentikan background daemon Cloudflare Tunnel...
taskkill /F /IM cloudflared-windows-amd64.exe >nul 2>&1
echo       -- Cloudflare Tunnel routing dinonaktifkan.

echo [3/3] Menutup antarmuka Dashboard Laporan...
taskkill /F /IM mshta.exe >nul 2>&1
echo       -- Antarmuka GUI ditutup.

echo.
echo ==========================================================================================
echo  STATUS: SELURUH SERVER DAN PROSES LATAR BELAKANG TELAH DINONAKTIFKAN DENGAN AMAN.
echo ==========================================================================================
echo.
echo Jendela ini akan tertutup otomatis dalam 3 detik...
ping 127.0.0.1 -n 4 >nul
exit
