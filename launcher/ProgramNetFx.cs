using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Windows.Forms;

internal static class Program
{
    private static DateTime _startedAt = DateTime.UtcNow;
    private static DateTime _lastPingAt = DateTime.UtcNow;
    private static bool _hasPing = false;
    private static Process _appProcess = null;
    private static bool _topMost = false;
    private static readonly IntPtr HwndTopMost = new IntPtr(-1);
    private static readonly IntPtr HwndNotTopMost = new IntPtr(-2);
    private const uint SwpNoSize = 0x0001;
    private const uint SwpNoMove = 0x0002;
    private const uint SwpNoActivate = 0x0010;
    private const uint SwpShowWindow = 0x0040;

    private delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    private static extern bool EnumWindows(EnumWindowsProc enumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    private static extern bool IsWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    private static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    private static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int maxCount);

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

    [DllImport("user32.dll")]
    private static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int x, int y, int cx, int cy, uint flags);

    private static void Main(string[] args)
    {
        try
        {
            Run(args);
        }
        catch (Exception error)
        {
            if (HasArg(args, "--no-open"))
            {
                Console.WriteLine("debug-error: " + error.GetType().FullName + " " + error.Message);
            }
            WriteCrashLog(error);
        }
    }

    private static void Run(string[] args)
    {
        if (HasArg(args, "--no-open")) Console.WriteLine("debug: run start");
        int port = FindOpenPort();
        if (HasArg(args, "--no-open")) Console.WriteLine("debug: port " + port);
        string prefix = "http://127.0.0.1:" + port + "/";
        string startPage = IsEnglishLaunch(args) ? "index-en.html" : "index.html";
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add(prefix);
        listener.Start();
        if (HasArg(args, "--no-open")) Console.WriteLine("debug: listener " + listener.IsListening);
        WriteRuntimeLog("started " + prefix + " listening=" + listener.IsListening);

        try
        {
            Console.Title = "Collins";
            Console.WriteLine("Collins is running.");
            Console.WriteLine(prefix);
            Console.WriteLine("Close this window to stop the local app.");
        }
        catch
        {
            // WinExe builds do not always have a console attached.
        }

        if (!HasArg(args, "--no-open"))
        {
            _appProcess = LaunchAppWindow(prefix + startPage);
        }
        ThreadPool.QueueUserWorkItem(delegate
        {
            while (listener.IsListening)
            {
                Thread.Sleep(5000);
                DateTime now = DateTime.UtcNow;
                if (_hasPing && (now - _lastPingAt).TotalSeconds > 25)
                {
                    try { listener.Stop(); } catch { }
                    break;
                }
                if (!_hasPing && (now - _startedAt).TotalMinutes > 2)
                {
                    try { listener.Stop(); } catch { }
                    break;
                }
            }
        });

        WriteRuntimeLog("enter loop listening=" + listener.IsListening);
        if (HasArg(args, "--no-open")) Console.WriteLine("debug: enter loop " + listener.IsListening);
        while (listener.IsListening)
        {
            try
            {
                HttpListenerContext context = listener.GetContext();
                ThreadPool.QueueUserWorkItem(delegate { Serve(context); });
            }
            catch (HttpListenerException error)
            {
                WriteRuntimeLog("listener stopped: " + error.ErrorCode + " " + error.Message);
                break;
            }
        }
    }

    private static void WriteCrashLog(Exception error)
    {
        try
        {
            string folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "HoudiniNodeAtlas");
            Directory.CreateDirectory(folder);
            string path = Path.Combine(folder, "last-error.txt");
            File.WriteAllText(path, DateTime.Now.ToString("s") + Environment.NewLine + error.GetType().FullName + Environment.NewLine + error.Message + Environment.NewLine + error.StackTrace, Encoding.UTF8);
        }
        catch
        {
            // Last-resort logging must never throw.
        }
    }

    private static void WriteRuntimeLog(string message)
    {
        try
        {
            string folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "HoudiniNodeAtlas");
            Directory.CreateDirectory(folder);
            string path = Path.Combine(folder, "runtime.log");
            File.AppendAllText(path, DateTime.Now.ToString("s") + " " + message + Environment.NewLine, Encoding.UTF8);
        }
        catch
        {
            // Runtime logging is best effort only.
        }
    }

    private static int FindOpenPort()
    {
        for (int port = 47321; port < 47421; port++)
        {
            try
            {
                HttpListener probe = new HttpListener();
                probe.Prefixes.Add("http://127.0.0.1:" + port + "/");
                probe.Start();
                probe.Stop();
                return port;
            }
            catch
            {
                // Try next local port.
            }
        }

        return 47321;
    }

    private static void Serve(HttpListenerContext context)
    {
        try
        {
            string path = context.Request.Url == null ? "" : context.Request.Url.AbsolutePath.Trim('/');
            if (String.IsNullOrWhiteSpace(path)) path = "index.html";

            if (path == "api/node-index-check")
            {
                ServeNodeIndexCheck(context);
                return;
            }
            if (path == "api/workspace")
            {
                ServeWorkspace(context);
                return;
            }
            if (path == "api/ping")
            {
                _hasPing = true;
                _lastPingAt = DateTime.UtcNow;
                WriteJson(context, "{\"ok\":true}");
                return;
            }
            if (path == "api/clipboard-text")
            {
                ServeClipboardText(context);
                return;
            }
            if (path == "api/window-topmost")
            {
                ServeWindowTopMost(context);
                return;
            }

            string resourceName = ResourceName(path);
            if (resourceName.Length == 0)
            {
                context.Response.StatusCode = 404;
                context.Response.Close();
                return;
            }

            Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
            if (stream == null)
            {
                context.Response.StatusCode = 404;
                context.Response.Close();
                return;
            }

            context.Response.ContentType = ContentType(path);
            context.Response.Headers["Cache-Control"] = "no-store";
            stream.CopyTo(context.Response.OutputStream);
            stream.Dispose();
            context.Response.Close();
        }
        catch (Exception error)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(error.Message);
            context.Response.StatusCode = 500;
            context.Response.ContentType = "text/plain; charset=utf-8";
            context.Response.OutputStream.Write(bytes, 0, bytes.Length);
            context.Response.Close();
        }
    }

    private static string ResourceName(string path)
    {
        switch (path)
        {
            case "index.html": return "web.index.html";
            case "index-en.html": return "web.index-en.html";
            case "styles.css": return "web.styles.css";
            case "app.js": return "web.app.js";
            case "assets/octopus.ico": return "web.assets.octopus.ico";
            case "assets/octopus-favicon.svg": return "web.assets.octopus-favicon.svg";
            default: return "";
        }
    }

    private static string ContentType(string path)
    {
        switch (path)
        {
            case "styles.css": return "text/css; charset=utf-8";
            case "app.js": return "text/javascript; charset=utf-8";
            case "assets/octopus.ico": return "image/x-icon";
            case "assets/octopus-favicon.svg": return "image/svg+xml; charset=utf-8";
            default: return "text/html; charset=utf-8";
        }
    }

    private static bool IsEnglishLaunch(string[] args)
    {
        if (HasArg(args, "--en")) return true;

        string exe = Path.GetFileNameWithoutExtension(Assembly.GetExecutingAssembly().Location);
        return exe.IndexOf("en", StringComparison.OrdinalIgnoreCase) >= 0 || exe.IndexOf("English", StringComparison.OrdinalIgnoreCase) >= 0;
    }

    private static bool HasArg(string[] args, string value)
    {
        foreach (string arg in args)
        {
            if (String.Equals(arg, value, StringComparison.OrdinalIgnoreCase)) return true;
        }
        return false;
    }

    private static Process LaunchAppWindow(string url)
    {
        string edge = FindEdgePath();
        if (edge.Length > 0)
        {
            string profile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "HoudiniNodeAtlas", "EdgeProfile");
            Directory.CreateDirectory(profile);
            ProcessStartInfo info = new ProcessStartInfo(edge);
            info.UseShellExecute = false;
            info.Arguments = "--app=\"" + url + "\" --user-data-dir=\"" + profile + "\" --no-first-run";
            return Process.Start(info);
        }

        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
        return null;
    }

    private static string FindEdgePath()
    {
        string[] paths =
        {
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft", "Edge", "Application", "msedge.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft", "Edge", "Application", "msedge.exe")
        };
        foreach (string path in paths)
        {
            if (File.Exists(path)) return path;
        }
        return "";
    }

    private static void ServeWorkspace(HttpListenerContext context)
    {
        try
        {
            string lang = SafeLang(context.Request.QueryString["lang"]);
            string path = WorkspacePath(lang);
            Directory.CreateDirectory(Path.GetDirectoryName(path));

            if (String.Equals(context.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase))
            {
                bool exists = File.Exists(path);
                string workspace = exists ? File.ReadAllText(path, Encoding.UTF8) : "null";
                string savedAt = exists ? File.GetLastWriteTimeUtc(path).ToString("o") : "";
                string json = "{"
                    + "\"ok\":true,"
                    + "\"exists\":" + (exists ? "true" : "false") + ","
                    + "\"path\":\"" + JsonEscape(path) + "\","
                    + "\"fileName\":\"" + JsonEscape(Path.GetFileName(path)) + "\","
                    + "\"savedAt\":\"" + JsonEscape(savedAt) + "\","
                    + "\"workspace\":" + workspace
                    + "}";
                WriteJson(context, json);
                return;
            }

            if (String.Equals(context.Request.HttpMethod, "POST", StringComparison.OrdinalIgnoreCase))
            {
                string body = ReadRequestBody(context);
                if (String.IsNullOrWhiteSpace(body) || body.TrimStart()[0] != '{')
                {
                    context.Response.StatusCode = 400;
                    WriteJson(context, "{\"ok\":false,\"message\":\"Invalid workspace JSON\"}");
                    return;
                }

                string backup = path + ".bak";
                string temp = path + ".tmp";
                if (File.Exists(path)) File.Copy(path, backup, true);
                File.WriteAllText(temp, body, Encoding.UTF8);
                File.Copy(temp, path, true);
                File.Delete(temp);

                string savedAt = File.GetLastWriteTimeUtc(path).ToString("o");
                string json = "{"
                    + "\"ok\":true,"
                    + "\"path\":\"" + JsonEscape(path) + "\","
                    + "\"fileName\":\"" + JsonEscape(Path.GetFileName(path)) + "\","
                    + "\"savedAt\":\"" + JsonEscape(savedAt) + "\""
                    + "}";
                WriteJson(context, json);
                return;
            }

            context.Response.StatusCode = 405;
            WriteJson(context, "{\"ok\":false,\"message\":\"Method not allowed\"}");
        }
        catch (Exception error)
        {
            context.Response.StatusCode = 500;
            WriteJson(context, "{\"ok\":false,\"message\":\"" + JsonEscape(error.Message) + "\"}");
        }
    }

    private static string WorkspacePath(string lang)
    {
        string folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "HoudiniNodeAtlas");
        string name = String.Equals(lang, "en", StringComparison.OrdinalIgnoreCase) ? "workspace-en.json" : "workspace-cn.json";
        return Path.Combine(folder, name);
    }

    private static string SafeLang(string value)
    {
        return String.Equals(value, "en", StringComparison.OrdinalIgnoreCase) ? "en" : "zh";
    }

    private static string ReadRequestBody(HttpListenerContext context)
    {
        using (StreamReader reader = new StreamReader(context.Request.InputStream, context.Request.ContentEncoding ?? Encoding.UTF8))
        {
            return reader.ReadToEnd();
        }
    }

    private static void ServeClipboardText(HttpListenerContext context)
    {
        try
        {
            string text = ReadClipboardText();
            WriteJson(context, "{\"ok\":true,\"text\":\"" + JsonEscape(text) + "\"}");
        }
        catch (Exception error)
        {
            context.Response.StatusCode = 500;
            WriteJson(context, "{\"ok\":false,\"message\":\"" + JsonEscape(error.Message) + "\"}");
        }
    }

    private static void ServeWindowTopMost(HttpListenerContext context)
    {
        try
        {
            bool requested = _topMost;
            if (String.Equals(context.Request.HttpMethod, "POST", StringComparison.OrdinalIgnoreCase))
            {
                string value = context.Request.QueryString["topMost"];
                requested = String.IsNullOrWhiteSpace(value) ? !_topMost : ParseBool(value);
                bool changed = ApplyTopMost(requested);
                if (changed) _topMost = requested;
                WriteJson(context, "{\"ok\":true,\"available\":" + (changed ? "true" : "false") + ",\"topMost\":" + (_topMost ? "true" : "false") + "}");
                return;
            }

            if (!String.Equals(context.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase))
            {
                context.Response.StatusCode = 405;
                WriteJson(context, "{\"ok\":false,\"message\":\"Method not allowed\"}");
                return;
            }

            bool available = WaitForAppWindowHandle(250) != IntPtr.Zero;
            WriteJson(context, "{\"ok\":true,\"available\":" + (available ? "true" : "false") + ",\"topMost\":" + (_topMost ? "true" : "false") + "}");
        }
        catch (Exception error)
        {
            context.Response.StatusCode = 500;
            WriteJson(context, "{\"ok\":false,\"message\":\"" + JsonEscape(error.Message) + "\"}");
        }
    }

    private static bool ParseBool(string value)
    {
        if (String.IsNullOrWhiteSpace(value)) return false;
        value = value.Trim();
        return value == "1" || value.Equals("true", StringComparison.OrdinalIgnoreCase) || value.Equals("yes", StringComparison.OrdinalIgnoreCase) || value.Equals("on", StringComparison.OrdinalIgnoreCase);
    }

    private static bool ApplyTopMost(bool enabled)
    {
        IntPtr handle = WaitForAppWindowHandle(2500);
        if (handle == IntPtr.Zero) return false;
        return SetWindowPos(handle, enabled ? HwndTopMost : HwndNotTopMost, 0, 0, 0, 0, SwpNoMove | SwpNoSize | SwpNoActivate | SwpShowWindow);
    }

    private static IntPtr WaitForAppWindowHandle(int timeoutMilliseconds)
    {
        DateTime deadline = DateTime.UtcNow.AddMilliseconds(timeoutMilliseconds);
        IntPtr handle;
        do
        {
            handle = FindAppWindowHandle();
            if (handle != IntPtr.Zero && IsWindow(handle)) return handle;
            Thread.Sleep(80);
        }
        while (DateTime.UtcNow < deadline);

        return IntPtr.Zero;
    }

    private static IntPtr FindAppWindowHandle()
    {
        try
        {
            if (_appProcess != null && !_appProcess.HasExited)
            {
                _appProcess.Refresh();
                if (_appProcess.MainWindowHandle != IntPtr.Zero && IsWindow(_appProcess.MainWindowHandle)) return _appProcess.MainWindowHandle;
            }
        }
        catch
        {
            // Edge can hand off the app window to a different process.
        }

        IntPtr found = IntPtr.Zero;
        EnumWindows(delegate (IntPtr hWnd, IntPtr lParam)
        {
            if (!IsWindowVisible(hWnd)) return true;

            StringBuilder titleBuilder = new StringBuilder(256);
            GetWindowText(hWnd, titleBuilder, titleBuilder.Capacity);
            string title = titleBuilder.ToString();
            if (title.IndexOf("Collins", StringComparison.OrdinalIgnoreCase) < 0) return true;

            uint processId;
            GetWindowThreadProcessId(hWnd, out processId);
            try
            {
                Process process = Process.GetProcessById((int)processId);
                string name = process.ProcessName ?? "";
                if (name.IndexOf("msedge", StringComparison.OrdinalIgnoreCase) >= 0 || name.IndexOf("chrome", StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    found = hWnd;
                    return false;
                }
            }
            catch
            {
                // Keep looking.
            }

            return true;
        }, IntPtr.Zero);

        return found;
    }

    private static string ReadClipboardText()
    {
        string result = "";
        Exception failure = null;
        Thread thread = new Thread(new ThreadStart(delegate
        {
            try
            {
                if (Clipboard.ContainsText()) result = Clipboard.GetText(TextDataFormat.Text);
            }
            catch (Exception error)
            {
                failure = error;
            }
        }));
        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();
        if (!thread.Join(1200)) return "";
        if (failure != null) throw failure;
        return result ?? "";
    }

    private static void ServeNodeIndexCheck(HttpListenerContext context)
    {
        try
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string[] contexts = { "obj", "sop", "dop", "vop", "lop", "rop", "chop", "cop", "top", "apex" };
            HashSet<string> nodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            string docsVersion = "";

            using (WebClient client = new WebClient())
            {
                client.Headers["User-Agent"] = "Collins/0.9";
                foreach (string ctx in contexts)
                {
                    string url = "https://www.sidefx.com/docs/houdini/nodes/" + ctx + "/index.html";
                    try
                    {
                        string html = client.DownloadString(url);
                        if (docsVersion.Length == 0) docsVersion = ExtractDocsVersion(html);
                        MatchCollection matches = Regex.Matches(html, "(?:/docs/houdini/nodes/" + ctx + "/|href=[\"'])([^\"'#?/.]+)\\.html", RegexOptions.IgnoreCase);
                        foreach (Match match in matches)
                        {
                            string name = match.Groups[1].Value;
                            if (name != "index") nodes.Add(ctx + ":" + name);
                        }
                    }
                    catch
                    {
                        // Some contexts can be missing in older docs; keep scanning the rest.
                    }
                }
            }

            int localCount = ParseInt(context.Request.QueryString["localCount"]);
            string json = "{"
                + "\"ok\":true,"
                + "\"source\":\"https://www.sidefx.com/docs/houdini/nodes/index.html\","
                + "\"checkedAt\":\"" + JsonEscape(DateTime.UtcNow.ToString("o")) + "\","
                + "\"docsVersion\":\"" + JsonEscape(docsVersion.Length == 0 ? "SideFX current docs" : docsVersion) + "\","
                + "\"remoteCount\":" + nodes.Count + ","
                + "\"localCount\":" + localCount + ","
                + "\"delta\":" + (nodes.Count - localCount)
                + "}";
            WriteJson(context, json);
        }
        catch (Exception error)
        {
            string json = "{"
                + "\"ok\":false,"
                + "\"checkedAt\":\"" + JsonEscape(DateTime.UtcNow.ToString("o")) + "\","
                + "\"remoteCount\":0,"
                + "\"message\":\"" + JsonEscape(error.Message) + "\""
                + "}";
            WriteJson(context, json);
        }
    }

    private static string ExtractDocsVersion(string html)
    {
        Match title = Regex.Match(html, "Houdini\\s+([0-9]+(?:\\.[0-9]+)?)", RegexOptions.IgnoreCase);
        if (title.Success) return "Houdini " + title.Groups[1].Value;
        Match version = Regex.Match(html, "docs/houdini([0-9]+(?:\\.[0-9]+)?)", RegexOptions.IgnoreCase);
        if (version.Success) return "Houdini " + version.Groups[1].Value;
        return "";
    }

    private static void WriteJson(HttpListenerContext context, string json)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(json);
        context.Response.ContentType = "application/json; charset=utf-8";
        context.Response.Headers["Cache-Control"] = "no-store";
        context.Response.OutputStream.Write(bytes, 0, bytes.Length);
        context.Response.Close();
    }

    private static int ParseInt(string value)
    {
        int result;
        return Int32.TryParse(value, out result) ? result : 0;
    }

    private static string JsonEscape(string value)
    {
        return (value ?? "").Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "\\r").Replace("\n", "\\n");
    }
}
