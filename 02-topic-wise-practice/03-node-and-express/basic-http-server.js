// A web server using only Node's built-in http module (no Express)
const http = require("http");
const url = require("url");

const PORT = 4000;

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  console.log(`${req.method} ${req.url}`);

  if (pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Home</h1><p>Try <a href='/about'>/about</a>, <a href='/time'>/time</a> or <a href='/greet?name=Govardhan'>/greet?name=Govardhan</a></p>");
  } else if (pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Basic HTTP server built with the Node.js http module.");
  } else if (pathname === "/time") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ serverTime: new Date().toISOString() }));
  } else if (pathname === "/greet") {
    const name = query.name || "Guest";
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Hello, ${name}!`);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page not found");
  }
});

server.listen(PORT, () => console.log(`HTTP server running at http://localhost:${PORT}`));
