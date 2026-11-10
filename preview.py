from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import webbrowser
root = Path(__file__).resolve().parent / "dist"
server = ThreadingHTTPServer(("127.0.0.1", 8765), partial(SimpleHTTPRequestHandler, directory=str(root)))
print("Cleo Marsh preview: http://127.0.0.1:8765/ (Ctrl+C to stop)")
webbrowser.open("http://127.0.0.1:8765/")
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
