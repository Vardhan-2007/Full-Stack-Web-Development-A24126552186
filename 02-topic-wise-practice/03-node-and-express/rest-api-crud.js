// REST API with full CRUD on an in-memory array of courses
const express = require("express");
const app = express();
const PORT = 4002;

app.use(express.json());

let courses = [
  { id: 1, code: "CS301", name: "Full Stack Development", credits: 3 },
  { id: 2, code: "CS302", name: "Database Management Systems", credits: 4 },
  { id: 3, code: "AM303", name: "Machine Learning", credits: 3 }
];
let nextId = 4;

function validateCourse(body) {
  if (!body.code || !body.name) return "code and name are required";
  if (body.credits !== undefined && (typeof body.credits !== "number" || body.credits < 1 || body.credits > 5)) {
    return "credits must be a number from 1 to 5";
  }
  return null;
}

// READ all (with optional ?minCredits= filter)
app.get("/api/courses", (req, res) => {
  const min = Number(req.query.minCredits) || 0;
  res.json(courses.filter(c => c.credits >= min));
});

// READ one
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

// CREATE
app.post("/api/courses", (req, res) => {
  const error = validateCourse(req.body);
  if (error) return res.status(400).json({ error });
  const course = { id: nextId++, code: req.body.code, name: req.body.name, credits: req.body.credits ?? 3 };
  courses.push(course);
  res.status(201).json(course);
});

// UPDATE (replace)
app.put("/api/courses/:id", (req, res) => {
  const index = courses.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Course not found" });
  const error = validateCourse(req.body);
  if (error) return res.status(400).json({ error });
  courses[index] = { id: courses[index].id, code: req.body.code, name: req.body.name, credits: req.body.credits ?? 3 };
  res.json(courses[index]);
});

// DELETE
app.delete("/api/courses/:id", (req, res) => {
  const before = courses.length;
  courses = courses.filter(c => c.id !== Number(req.params.id));
  if (courses.length === before) return res.status(404).json({ error: "Course not found" });
  res.json({ message: "Course deleted" });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Course API running at http://localhost:${PORT}/api/courses`));
}
module.exports = app;
