// Lab Task 3b - JavaScript arrays and functions
// Each program returns its output as text so it can be shown on the page and in the console.

// Program 1: Sum, average, largest and smallest of an array
function arrayStats(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  const average = sum / numbers.length;
  const largest = Math.max(...numbers);
  const smallest = Math.min(...numbers);
  return `Array: [${numbers}]\nSum: ${sum}\nAverage: ${average.toFixed(2)}\nLargest: ${largest}\nSmallest: ${smallest}`;
}

// Program 2: map, filter and reduce on marks
function marksReport(marks) {
  const withGrace = marks.map(m => Math.min(m + 5, 100));
  const passed = withGrace.filter(m => m >= 40);
  const total = withGrace.reduce((acc, m) => acc + m, 0);
  return `Original marks: [${marks}]\nAfter 5 grace marks (map): [${withGrace}]\nPassed, >= 40 (filter): [${passed}]\nTotal (reduce): ${total}`;
}

// Program 3: Sort an array of student objects by CGPA (descending) and by name
function sortStudents(students) {
  const byCgpa = [...students].sort((a, b) => b.cgpa - a.cgpa);
  const byName = [...students].sort((a, b) => a.name.localeCompare(b.name));
  return "By CGPA (high to low):\n" +
    byCgpa.map(s => `  ${s.name} - ${s.cgpa}`).join("\n") +
    "\nBy name (A to Z):\n" +
    byName.map(s => `  ${s.name} - ${s.cgpa}`).join("\n");
}

// Program 4: Remove duplicates and count how often each value appears
function uniqueAndCount(items) {
  const unique = [...new Set(items)];
  const counts = {};
  items.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  const countText = Object.entries(counts).map(([k, v]) => `  ${k}: ${v}`).join("\n");
  return `Input: [${items}]\nUnique (Set): [${unique}]\nFrequency:\n${countText}`;
}

// Program 5: Function declaration, function expression, arrow function and default parameters
function simpleInterest(p, r, t = 1) {
  return (p * r * t) / 100;
}
const compoundInterest = function (p, r, t) {
  return p * Math.pow(1 + r / 100, t) - p;
};
const emi = (p, annualRate, months) => {
  const r = annualRate / 12 / 100;
  return (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};
function interestDemo() {
  return `Simple interest on 10000 at 8% for 1 year (default t): ${simpleInterest(10000, 8)}\n` +
    `Compound interest on 10000 at 8% for 3 years: ${compoundInterest(10000, 8, 3).toFixed(2)}\n` +
    `EMI for 100000 at 10% for 12 months: ${emi(100000, 10, 12).toFixed(2)}`;
}

// Program 6: Callback and higher-order function
function applyToAll(arr, callback) {
  const result = [];
  for (const item of arr) {
    result.push(callback(item));
  }
  return result;
}
function callbackDemo() {
  const nums = [1, 2, 3, 4, 5];
  const squares = applyToAll(nums, n => n * n);
  const labels = applyToAll(nums, n => (n % 2 === 0 ? `${n} even` : `${n} odd`));
  return `Numbers: [${nums}]\nSquares: [${squares}]\nEven/odd: [${labels.join(", ")}]`;
}

// Program 7: Closure - a counter that remembers its value, and a recursive factorial
function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count
  };
}
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
function closureDemo() {
  const counter = makeCounter(10);
  counter.increment();
  counter.increment();
  counter.decrement();
  return `Counter started at 10, +1 +1 -1 -> ${counter.value()}\n` +
    `Factorials: ${[1, 3, 5, 7].map(n => `${n}! = ${factorial(n)}`).join(", ")}`;
}

const programs = [
  { title: "1. Sum, average, largest and smallest", run: () => arrayStats([12, 45, 7, 89, 23, 56]) },
  { title: "2. map, filter and reduce", run: () => marksReport([35, 72, 38, 90, 55, 20]) },
  { title: "3. Sorting objects", run: () => sortStudents([
      { name: "Kiran", cgpa: 8.4 }, { name: "Anjali", cgpa: 9.1 },
      { name: "Ravi", cgpa: 7.6 }, { name: "Divya", cgpa: 8.9 }]) },
  { title: "4. Remove duplicates and frequency", run: () => uniqueAndCount(["html", "css", "js", "css", "html", "react", "js", "css"]) },
  { title: "5. Types of functions", run: interestDemo },
  { title: "6. Callbacks and higher-order functions", run: callbackDemo },
  { title: "7. Closures and recursion", run: closureDemo }
];

if (typeof document !== "undefined") {
  const out = document.getElementById("output");
  programs.forEach(p => {
    const section = document.createElement("section");
    const h2 = document.createElement("h2");
    h2.textContent = p.title;
    const pre = document.createElement("pre");
    pre.textContent = p.run();
    section.appendChild(h2);
    section.appendChild(pre);
    out.appendChild(section);
  });
} else {
  programs.forEach(p => console.log(`\n${p.title}\n${p.run()}`));
}
