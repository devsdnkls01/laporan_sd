Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class Win32IconHelper {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern IntPtr LoadImage(IntPtr hinst, string lpszName, uint uType, int cxDesired, int cyDesired, uint fuLoad);

    public const uint WM_SETICON = 0x0080;
    public const int ICON_SMALL = 0;
    public const int ICON_BIG = 1;
    public const uint IMAGE_ICON = 1;
    public const uint LR_LOADFROMFILE = 0x0010;

    public static bool ApplyIcon(string title, string iconPath) {
        IntPtr hWnd = FindWindow(null, title);
        if (hWnd == IntPtr.Zero) return false;

        IntPtr hSmall = LoadImage(IntPtr.Zero, iconPath, IMAGE_ICON, 16, 16, LR_LOADFROMFILE);
        IntPtr hBig = LoadImage(IntPtr.Zero, iconPath, IMAGE_ICON, 32, 32, LR_LOADFROMFILE);

        if (hSmall != IntPtr.Zero) SendMessage(hWnd, WM_SETICON, (IntPtr)ICON_SMALL, hSmall);
        if (hBig != IntPtr.Zero) SendMessage(hWnd, WM_SETICON, (IntPtr)ICON_BIG, hBig);

        return true;
    }
}
"@

$title = "DASHBOARD LAPORAN//SDN KALISALAK 01"
$iconPath = Join-Path $PSScriptRoot "logo.ico"

for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Milliseconds 400
    if ([Win32IconHelper]::ApplyIcon($title, $iconPath)) {
        Write-Output "ICON_APPLIED_SUCCESSFULLY"
        break
    }
}
