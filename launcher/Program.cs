using System.Diagnostics;
using System.Net;
using System.Reflection;
using System.Text;

var listener = new HttpListener();
var port = FindOpenPort();
var prefix = $"http://127.0.0.1:{port}/";
listener.Prefixes.Add(prefix);
listener.Start();

Console.Title = "Collins";
Console.WriteLine("Collins is running.");
Console.WriteLine(prefix);
Console.WriteLine("Close this window to stop the local app.");

Process.Start(new ProcessStartInfo(prefix) { UseShellExecute = true });

while (listener.IsListening)
{
    try
    {
        var context = await listener.GetContextAsync();
        _ = Task.Run(() => ServeAsync(context));
    }
    catch (HttpListenerException)
    {
        break;
    }
}

static int FindOpenPort()
{
    for (var port = 47321; port < 47421; port++)
    {
        try
        {
            using var probe = new HttpListener();
            probe.Prefixes.Add($"http://127.0.0.1:{port}/");
            probe.Start();
            return port;
        }
        catch
        {
            // Try the next local port.
        }
    }

    return 47321;
}

static async Task ServeAsync(HttpListenerContext context)
{
    try
    {
        var path = context.Request.Url?.AbsolutePath.Trim('/') ?? "";
        if (string.IsNullOrWhiteSpace(path)) path = "index.html";

        var resourceName = path switch
        {
            "index.html" => "web.index.html",
            "styles.css" => "web.styles.css",
            "app.js" => "web.app.js",
            _ => ""
        };

        if (string.IsNullOrEmpty(resourceName))
        {
            context.Response.StatusCode = 404;
            context.Response.Close();
            return;
        }

        await using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
        if (stream is null)
        {
            context.Response.StatusCode = 404;
            context.Response.Close();
            return;
        }

        context.Response.ContentType = path switch
        {
            "styles.css" => "text/css; charset=utf-8",
            "app.js" => "text/javascript; charset=utf-8",
            _ => "text/html; charset=utf-8"
        };
        context.Response.Headers["Cache-Control"] = "no-store";
        await stream.CopyToAsync(context.Response.OutputStream);
        context.Response.Close();
    }
    catch (Exception error)
    {
        var bytes = Encoding.UTF8.GetBytes(error.Message);
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain; charset=utf-8";
        await context.Response.OutputStream.WriteAsync(bytes);
        context.Response.Close();
    }
}
