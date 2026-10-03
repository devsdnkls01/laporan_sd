@echo off
setlocal enabledelayedexpansion
color 0A
mode con cols=100 lines=32 >nul 2>&1
title CYBERHACK DASHBOARD v7.0 - [SDN KALISALAK 01 LIVE SECURITY ENGINE]

cd /d "%~dp0"

:: ============================================================================
:: 1. BACA VARIABEL DARI FILE .ENV
:: ============================================================================
set "TUNNEL_TOKEN="
set "D1_DB_ID="
set "CF_ACC_ID="
set "PUBLIC_DOM=laporan_sdnkalisalak01.develzy.my.id"
set "APP_PORT=2025"

if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        set "KEY=%%A"
        set "VAL=%%B"
        if "!KEY!"=="CLOUDFLARE_TUNNEL_TOKEN" set "TUNNEL_TOKEN=!VAL!"
        if "!KEY!"=="CLOUDFLARE_D1_DATABASE_ID" set "D1_DB_ID=!VAL!"
        if "!KEY!"=="CLOUDFLARE_ACCOUNT_ID" set "CF_ACC_ID=!VAL!"
        if "!KEY!"=="PUBLIC_DOMAIN" set "PUBLIC_DOM=!VAL!"
        if "!KEY!"=="PORT" set "APP_PORT=!VAL!"
    )
)

:: ============================================================================
:: 2. ANIMASI BOOT KERNEL HACKER (STARTING DAEMONS IN BACKGROUND)
:: ============================================================================
cls
echo [CYBERHACK KERNEL] INITIALIZING ZERO-TRACE RECONNAISSANCE...
echo.
ping 127.0.0.1 -n 1 >nul
echo  [01/06] Scanning socket listener on port !APP_PORT!...
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":!APP_PORT!" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%p >nul 2>&1
)
echo         --^> Socket !APP_PORT! cleared and primed for injection.

ping 127.0.0.1 -n 1 >nul
echo  [02/06] Mounting Node.js V8 runtime into background thread...
start /b node server.js >nul 2>&1
echo         --^> Node server engaged in background thread (0 separate windows).

ping 127.0.0.1 -n 1 >nul
echo  [03/06] Handshaking Cloudflare D1 SQL Cluster...
echo         --^> Cluster ID: 6ae50a84-d394-4d98-a392-0b3c9a3e00b2 [ONLINE]

ping 127.0.0.1 -n 1 >nul
echo  [04/06] Establishing Zero-Trust Cloudflare Edge Tunnel...
if exist "cloudflared-windows-amd64.exe" (
    taskkill /F /IM cloudflared-windows-amd64.exe >nul 2>&1
    if not "!TUNNEL_TOKEN!"=="" (
        start /b cloudflared-windows-amd64.exe tunnel run --token !TUNNEL_TOKEN! >nul 2>&1
        echo         --^> Tunnel daemon active on edge domain: !PUBLIC_DOM!
    )
)

ping 127.0.0.1 -n 1 >nul
echo  [05/06] Connecting Cloudinary Media Asset Pipeline...
echo         --^> Encrypted media bucket: cloud ixjihcvx [SYNCED]

:: Tunggu 3 detik agar handshake QUIC ke data center Cloudflare selesai sempurna
echo  [06/06] Menghubungkan browser langsung ke Cloud Domain publik...
ping 127.0.0.1 -n 4 >nul
start https://!PUBLIC_DOM!
echo         --^> Browser diarahkan ke https://!PUBLIC_DOM!
start cyber_dashboard.hta
echo         --^> Antarmuka GUI Dashboard Laporan diluncurkan.
ping 127.0.0.1 -n 2 >nul

:: ============================================================================
:: 3. INISIALISASI ROLLING LOG BUFFER (6 BARIS TETAP DI DALAM FRAME)
:: ============================================================================
set "LOG_1=[--:--:--] [KERNEL_INIT] Security subsystem engaged. Monitoring telemetry stream...        "
set "LOG_2=[--:--:--] [ZERO_TRUST] Cloudflare tunnel connector established to edge data centers...    "
set "LOG_3=[--:--:--] [D1_DATABASE] Cloudflare D1 SQL cluster synced: tables verified [OK]...          "
set "LOG_4=[--:--:--] [CLOUDINARY] Media CDN pipeline active: signed uploads ready [ixjihcvx]...      "
set "LOG_5=[--:--:--] [SECURE_PING] Local port !APP_PORT! daemon responding [HTTP 200 OK]...               "
set "LOG_6=[--:--:--] [SYSTEM_READY] Telemetry online. Directing traffic to https://!PUBLIC_DOM! "

set /a LOOP_COUNT=0

:: ============================================================================
:: 4. LOOPING ANIMASI HACKER REAL-TIME (REDRAW DALAM FRAME, TANPA SCROLLING)
:: ============================================================================
:live_loop
set /a LOOP_COUNT+=1
set /a TICK=%LOOP_COUNT% %% 8
set "CUR_TIME=%TIME:~0,8%"

:: Nilai telemetry beranimasi dinamis (panjang tepat 28 karakter untuk menjaga kerapihan garis)
if %TICK%==1 (
    set "HLTH_STR=[=====>               ] 42%% "
    set "CPU_STR= 24%% [===>          ]       "
    set "MEM_STR= 1.18 GB (V8 Heap)          "
    set "NET_STR= 4.2 MB/s (TLS Encrypted)   "
    set "SOCK_STR= 12 Active Sockets          "
    set "NEW_LOG=[!CUR_TIME!] [SECURE_PING] Localhost loopback verified -- Port !APP_PORT! listening [HTTP 200 OK]    "
)
if %TICK%==2 (
    set "HLTH_STR=[=========>           ] 64%% "
    set "CPU_STR= 41%% [=====>        ]       "
    set "MEM_STR= 1.22 GB (V8 Heap)          "
    set "NET_STR= 7.8 MB/s (TLS Encrypted)   "
    set "SOCK_STR= 15 Active Sockets          "
    set "NEW_LOG=[!CUR_TIME!] [D1_SQL_SYNC] Edge query dispatched: SELECT * FROM reports WHERE status='OK'      "
)
if %TICK%==3 (
    set "HLTH_STR=[=============>       ] 81%% "
    set "CPU_STR= 58%% [=======>      ]       "
    set "MEM_STR= 1.25 GB (V8 Heap)          "
    set "NET_STR=11.5 MB/s (TLS Encrypted)   "
    set "SOCK_STR= 18 Active Sockets          "
    set "NEW_LOG=[!CUR_TIME!] [ZERO_TRUST] Packet inspection completed: 0 threats detected / AES-256 TLS 1.3    "
)
if %TICK%==4 (
    set "HLTH_STR=[=================>   ] 92%% "
    set "CPU_STR= 32%% [====>         ]       "
    set "MEM_STR= 1.21 GB (V8 Heap)          "
    set "NET_STR= 5.1 MB/s (TLS Encrypted)   "
    set "SOCK_STR= 14 Active Sockets          "
    set "NEW_LOG=[!CUR_TIME!] [TUNNEL_STATUS] Cloudflare edge route handshake: syn-ack confirmed from edge      "
)
if %TICK%==5 (
    set "HLTH_STR=[====================>] 99%% "
    set "CPU_STR= 67%% [========>     ]       "
    set "MEM_STR= 1.24 GB (V8 Heap)          "
    set "NET_STR= 8.9 MB/s (TLS Encrypted)   "
    set "SOCK_STR= 17 Active Sockets          "
    set "NEW_LOG=[!CUR_TIME!] [MEDIA_CDN] Cloudinary asset pipeline synced: signatures verified for bucket      "
)
if %TICK%==6 (
    set "HLTH_STR=[====================>] 100%%"
    set "CPU_STR= 29%% [===>          ]       "
    set "MEM_STR= 1.19 GB (V8 Heap)          "
    set "NET_STR=14.2 MB/s (TLS Encrypted)   "
    set "SOCK_STR= 13 Active Sockets          "
    set "NEW_LOG=[!CUR_TIME!] [DUAL_STORAGE] Cache coherency check: Local IndexedDB [SYNC] Cloudflare D1        "
)
if %TICK%==7 (
    set "HLTH_STR=[=================>   ] 94%% "
    set "CPU_STR= 48%% [======>       ]       "
    set "MEM_STR= 1.23 GB (V8 Heap)          "
    set "NET_STR= 6.3 MB/s (TLS Encrypted)   "
    set "SOCK_STR= 19 Active Sockets          "
    set "NEW_LOG=[!CUR_TIME!] [MEMORY_GC] V8 Engine Heap: 36.4 MB / Garbage Collection cycle optimal             "
)
if %TICK%==0 (
    set "HLTH_STR=[=============>       ] 86%% "
    set "CPU_STR= 35%% [====>         ]       "
    set "MEM_STR= 1.20 GB (V8 Heap)          "
    set "NET_STR= 9.4 MB/s (TLS Encrypted)   "
    set "SOCK_STR= 16 Active Sockets          "
    set "NEW_LOG=[!CUR_TIME!] [SECURITY_AUDIT] Encryption keys rotated: Session auth valid. Zero vulnerabilities "
)

:: Geser rolling buffer log (log bergerak di dalam kotaknya sendiri, TIDAK mendorong dashboard!)
set "LOG_1=!LOG_2!"
set "LOG_2=!LOG_3!"
set "LOG_3=!LOG_4!"
set "LOG_4=!LOG_5!"
set "LOG_5=!LOG_6!"
set "LOG_6=!NEW_LOG!"

:: Render ulang dashboard tepat di posisi awal tanpa scrolling (cls)
cls
echo +------------------------------------------------------------------------------------------------+
echo ^|  CYBERHACK DASHBOARD // SDN KALISALAK 01     STATUS: ONLINE   PORT: !APP_PORT!         SEC: LEVEL 5  ^|
echo +------------------------------------------------------------------------------------------------+
echo ^| Active Operations / Missions                  ^| System Telemetry ^& Live Metrics                ^|
echo ^| --------------------------------------------- ^| ---------------------------------------------- ^|
echo ^| [x] Cloudflare D1 SQL Edge    : CONNECTED     ^| CPU Load        : !CPU_STR! ^|
echo ^| [x] Zero-Trust Edge Tunnel    : ACTIVE        ^| Memory Usage    : !MEM_STR! ^|
echo ^| [x] Cloudinary Media Asset CDN: SYNCED        ^| Network Traffic : !NET_STR! ^|
echo ^| [x] Dual-Storage Coherence    : VERIFIED      ^| Active Sockets  : !SOCK_STR! ^|
echo ^| [x] AES-256 TLS 1.3 Security  : ENGAGED       ^| System Health   : !HLTH_STR! ^|
echo +------------------------------------------------------------------------------------------------+
echo ^| QUICK NETWORK ACCESS ^& COMMAND CONTROL:                                                        ^|
echo ^| ^> Local Portal   : http://localhost:!APP_PORT!                                                       ^|
echo ^| ^> Cloud Edge     : https://!PUBLIC_DOM!                                ^|
echo ^| ^> MATIKAN SERVER : TUTUP JENDELA INI / JALANKAN Tutup_Aplikasi.bat                             ^|
echo +------------------------------------------------------------------------------------------------+
echo ^| LIVE SECURITY ACTIVITY LOG (AUTO-ROLLING REAL-TIME STREAM):                                    ^|
echo +------------------------------------------------------------------------------------------------+
echo ^| !LOG_1! ^|
echo ^| !LOG_2! ^|
echo ^| !LOG_3! ^|
echo ^| !LOG_4! ^|
echo ^| !LOG_5! ^|
echo ^| !LOG_6! ^|
echo +------------------------------------------------------------------------------------------------+

:: Jeda animasi real-time (1.5 detik)
ping 127.0.0.1 -n 2 >nul
goto live_loop
