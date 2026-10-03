using System;
using System.IO;
using System.Drawing;
using System.Diagnostics;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using Microsoft.Win32;

namespace SdnKalisalak01.Guru {
    [ComVisible(true)]
    public class ScriptBridge {
        private GuruForm form;
        public ScriptBridge(GuruForm f) { form = f; }

        public void OpenUrl(string url) {
            try { 
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); 
            } catch (Exception) {}
        }

        public void CloseApp() {
            form.Close();
        }
    }

    public class GuruForm : Form {
        [DllImport("shell32.dll", SetLastError = true)]
        public static extern int SetCurrentProcessExplicitAppUserModelID([MarshalAs(UnmanagedType.LPWStr)] string AppID);

        private WebBrowser webBrowser;
        private string baseDir;

        public GuruForm() {
            SetCurrentProcessExplicitAppUserModelID("SDNKalisalak01.Guru.Laporan.v1");
            baseDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');

            SetBrowserEmulation();

            this.Text = "DASHBOARD LAPORAN GURU // SDN KALISALAK 01";
            
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

            this.Size = new Size(1000, 720);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(2, 7, 4);

            webBrowser = new WebBrowser {
                Dock = DockStyle.Fill,
                ScriptErrorsSuppressed = true,
                IsWebBrowserContextMenuEnabled = false,
                ObjectForScripting = new ScriptBridge(this)
            };
            this.Controls.Add(webBrowser);

            string htmlPath = Path.Combine(baseDir, "dashboard_guru.html");
            if (File.Exists(htmlPath)) {
                webBrowser.Navigate(new Uri(htmlPath));
            } else {
                string url = "https://laporan_sdnkalisalak01.develzy.my.id/?auth_key=kalisalak01_secure_key_9f82a17b3c";
                try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); } catch (Exception) {}
                this.Close();
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

        [STAThread]
        public static void Main() {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new GuruForm());
        }
    }
}
