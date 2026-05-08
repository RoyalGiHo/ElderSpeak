/**
 * Dev-only: phục vụ thư mục frontend + API lưu JSON vào src/data.
 */
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.join(__dirname, "..");
const basePort = Number(process.env.ADMIN_PORT || 8765);
let offset = 0;
const MAX_TRIES = 30;

const ALLOWED_PREFIX = path.join(FRONTEND_ROOT, "src", "data");

function safeResolve(rel) {
  const normalized = rel.replace(/\\/g, "/").replace(/^\/+/, "");
  const full = path.normalize(path.join(FRONTEND_ROOT, normalized));
  if (!full.startsWith(ALLOWED_PREFIX)) return null;
  if (!/\.json$/i.test(full)) return null;
  return full;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath);
  res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/save-json") {
    let body = "";
    req.on("data", (c) => {
      body += c;
      if (body.length > 50 * 1024 * 1024) req.destroy();
    });
    req.on("end", () => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      try {
        const { relativePath, data } = JSON.parse(body);
        const target = safeResolve(relativePath);
        if (!target) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "Invalid path" }));
          return;
        }
        const text =
          typeof data === "string" ? data : JSON.stringify(data, null, 2);
        JSON.parse(text);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, text, "utf8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, path: relativePath }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: String(e.message) }));
      }
    });
    return;
  }

  let urlPath = req.url.split("?")[0];
  if (urlPath === "/") urlPath = "/admin/index.html";

  const filePath = path.join(
    FRONTEND_ROOT,
    urlPath.replace(/^\/+/, "")
  );

  if (!filePath.startsWith(FRONTEND_ROOT)) {
    res.writeHead(403);
    res.end();
    return;
  }

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    sendFile(res, filePath);
  });
});

function listenNext() {
  const port = basePort + offset;

  function onListening() {
    server.removeListener("error", onError);
    const addr = server.address();
    const p = typeof addr === "object" && addr ? addr.port : port;
    console.log(`Admin UI: http://localhost:${p}/admin/index.html`);
  }

  function onError(err) {
    server.removeListener("listening", onListening);
    if (err.code === "EADDRINUSE" && offset < MAX_TRIES - 1) {
      console.warn(`Port ${port} đang được dùng, thử ${port + 1}…`);
      offset += 1;
      listenNext();
    } else if (err.code === "EADDRINUSE") {
      console.error(
        `Không mở được cổng (đã thử ${MAX_TRIES} cổng từ ${basePort}). Đóng tiến trình cũ hoặc đặt ADMIN_PORT.`
      );
      process.exit(1);
    } else {
      console.error(err);
      process.exit(1);
    }
  }

  server.once("listening", onListening);
  server.once("error", onError);
  server.listen(port, "127.0.0.1");
}

listenNext();
