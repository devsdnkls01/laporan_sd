using System;
using System.IO;
using System.Drawing;
using System.Diagnostics;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using Microsoft.Win32;

namespace SdnKalisalak01.Admin {
    [ComVisible(true)]
    public class ScriptBridge {
        private AdminForm form;
        public ScriptBridge(AdminForm f) { form = f; }

        public void OpenUrl(string url) {
            try { 
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); 
            } catch (Exception) {}
        }

        public void CloseApp() {
            form.Close();
        }
    }

    public class AdminForm : Form {
        [DllImport("shell32.dll", SetLastError = true)]
        public static extern int SetCurrentProcessExplicitAppUserModelID([MarshalAs(UnmanagedType.LPWStr)] string AppID);

        private WebBrowser webBrowser;
        private Process nodeProcess;
        private Process cfProcess;
        private string baseDir;

        public AdminForm() {
            SetCurrentProcessExplicitAppUserModelID("SDNKalisalak01.Admin.Laporan.v1");
            baseDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');

            SetBrowserEmulation();

            this.Text = "DASHBOARD LAPORAN // SDN KALISALAK 01";
            
            string icoFile = Path.Combine(baseDir, "logo.ico");
            if (File.Exists(icoFile)) {
                try { 
                    this.Icon = new Icon(icoFile); 
                } catch (Exception) {
                    try { this.Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch (Exception) {}
                }
            } else {
                try { this.Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch (Exception) {}
            }

            this.Size = new Size(1020, 740);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(2, 7, 4);

            webBrowser = new WebBrowser {
                Dock = DockStyle.Fill,
                ScriptErrorsSuppressed = true,
                IsWebBrowserContextMenuEnabled = false,
                ObjectForScripting = new ScriptBridge(this)
            };
            this.Controls.Add(webBrowser);

            this.FormClosing += (s, e) => CleanupServices();

            BootstrapServices();

            string viewPath = Path.Combine(baseDir, "dashboard_view.html");
            if (File.Exists(viewPath)) {
                webBrowser.Navigate(new Uri(viewPath));
            } else {
                string indexPath = Path.Combine(baseDir, "index.html");
                if (File.Exists(indexPath)) webBrowser.Navigate(new Uri(indexPath));
            }
        }

        private void SetBrowserEmulation() {
            try {
                string appName = Process.GetCurrentProcess().ProcessName + ".exe";
                using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION")) {
                    if (key != null) key.SetValue(appName, 11001, RegistryValueKind.DWord);
                }
            } catch (Exception) {}
        }

        private void BootstrapServices() {
            KillOldProcesses();

            // 1. Jalankan Node.js server
            try {
                var nodePsi = new ProcessStartInfo {
                    FileName = "cmd.exe",
                    Arguments = "/c node server.js",
                    WorkingDirectory = baseDir,
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    WindowStyle = ProcessWindowStyle.Hidden
                };
                nodeProcess = Process.Start(nodePsi);
            } catch (Exception) {}

            // 2. Jalankan Cloudflare Tunnel jika token tersedia
            try {
                string token = GetTunnelToken();
                string exePath = Path.Combine(baseDir, "bin", "cloudflared-windows-amd64.exe");
                if (!File.Exists(exePath)) {
                    exePath = Path.Combine(baseDir, "cloudflared-windows-amd64.exe");
                }

                if (!string.IsNullOrEmpty(token) && File.Exists(exePath)) {
                    var cfPsi = new ProcessStartInfo {
                        FileName = exePath,
                        Arguments = "tunnel run --token " + token,
                        WorkingDirectory = baseDir,
                        CreateNoWindow = true,
                        UseShellExecute = false,
                        WindowStyle = ProcessWindowStyle.Hidden
                    };
                    cfProcess = Process.Start(cfPsi);
                }
            } catch (Exception) {}
        }

        private string GetTunnelToken() {
            string envPath = Path.Combine(baseDir, ".env");
            if (File.Exists(envPath)) {
                foreach (var line in File.ReadAllLines(envPath)) {
                    var t = line.Trim();
                    if (t.StartsWith("CLOUDFLARE_TUNNEL_TOKEN=")) {
                        string val = t.Substring("CLOUDFLARE_TUNNEL_TOKEN=".Length).Trim();
                        return val.Trim('"', '\'');
                    }
                }
            }
            return "";
        }

        private void KillOldProcesses() {
            try {
                var psi = new ProcessStartInfo("taskkill", "/F /IM cloudflared-windows-amd64.exe") {
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
                var p = Process.Start(psi);
                if (p != null) p.WaitForExit(1000);
            } catch (Exception) {}
            try {
                var psi = new ProcessStartInfo("taskkill", "/F /IM node.exe") {
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
                var p = Process.Start(psi);
                if (p != null) p.WaitForExit(1000);
            } catch (Exception) {}
        }

        private void CleanupServices() {
            try { if (nodeProcess != null && !nodeProcess.HasExited) nodeProcess.Kill(); } catch (Exception) {}
            try { if (cfProcess != null && !cfProcess.HasExited) cfProcess.Kill(); } catch (Exception) {}
            KillOldProcesses();
        }

        [STAThread]
        public static void Main() {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new AdminForm());
        }
    }
}
