// Express middleware: application-level, router-level, built-in, custom and error-handling
const express = require("express");
const app = express();
const PORT = 4001;

// Built-in middleware to parse JSON request bodies
app.use(express.json());

// Custom application-level middleware: logs every request and how long it took
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
});

// Custom middleware that adds data to the request object
app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  next();
});

// Route-specific middleware: a very simple API key check
function requireApiKey(req, res, next) {
  if (req.headers["x-api-key"] === "fsd-lab") {
    return next();
  }
  res.status(401).json({ error: "Missing or wrong x-api-key header" });
}

app.get("/", (req, res) => {
  res.send(`Hello! This request reached the server at ${req.requestTime}`);
});

app.get("/secret", requireApiKey, (req, res) => {
  res.json({ message: "You passed the API key middleware" });
});

// Router-level middleware
const adminRouter = express.Router();
adminRouter.use((req, res, next) => {
  console.log("Admin router middleware ran");
  next();
});
adminRouter.get("/dashboard", (req, res) => res.send("Admin dashboard"));
app.use("/admin", adminRouter);

// A route that throws, to show the error handler
app.get("/broken", (req, res) => {
  throw new Error("Something went wrong in /broken");
});

// 404 middleware (runs when no route matched)
app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

// Error-handling middleware has four parameters
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => console.log(`Middleware demo running at http://localhost:${PORT}`));
