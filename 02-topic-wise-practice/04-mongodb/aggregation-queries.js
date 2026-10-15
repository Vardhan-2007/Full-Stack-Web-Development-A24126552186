// MongoDB aggregation pipeline examples with Mongoose
const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/fsdPractice";

const orderSchema = new mongoose.Schema({
  customer: String,
  city: String,
  category: String,
  item: String,
  qty: Number,
  price: Number,
  orderedOn: Date
});
const Order = mongoose.model("Order", orderSchema);

const sampleOrders = [
  { customer: "Kiran",  city: "Visakhapatnam", category: "Books",       item: "JS Guide",      qty: 2, price: 450,  orderedOn: new Date("2026-08-02") },
  { customer: "Divya",  city: "Vijayawada",    category: "Electronics", item: "Earphones",     qty: 1, price: 1299, orderedOn: new Date("2026-08-05") },
  { customer: "Ravi",   city: "Visakhapatnam", category: "Electronics", item: "Mouse",         qty: 2, price: 499,  orderedOn: new Date("2026-08-11") },
  { customer: "Anjali", city: "Guntur",        category: "Books",       item: "DBMS Notes",    qty: 3, price: 250,  orderedOn: new Date("2026-09-01") },
  { customer: "Kiran",  city: "Visakhapatnam", category: "Stationery",  item: "Notebook pack", qty: 5, price: 120,  orderedOn: new Date("2026-09-03") },
  { customer: "Divya",  city: "Vijayawada",    category: "Books",       item: "React Basics",  qty: 1, price: 550,  orderedOn: new Date("2026-09-14") },
  { customer: "Sita",   city: "Guntur",        category: "Electronics", item: "Keyboard",      qty: 1, price: 899,  orderedOn: new Date("2026-09-20") }
];

async function main() {
  await mongoose.connect(MONGO_URL);
  await Order.deleteMany({});
  await Order.insertMany(sampleOrders);

  // 1. $match + $group: total revenue and quantity per category
  const byCategory = await Order.aggregate([
    { $group: { _id: "$category", totalQty: { $sum: "$qty" }, revenue: { $sum: { $multiply: ["$qty", "$price"] } } } },
    { $sort: { revenue: -1 } }
  ]);
  console.log("1. Revenue by category:", byCategory);

  // 2. $match then $group: orders from Visakhapatnam per customer
  const vizag = await Order.aggregate([
    { $match: { city: "Visakhapatnam" } },
    { $group: { _id: "$customer", orders: { $sum: 1 }, spent: { $sum: { $multiply: ["$qty", "$price"] } } } }
  ]);
  console.log("2. Visakhapatnam customers:", vizag);

  // 3. $project with a computed field and $sort/$limit: top 3 most expensive orders
  const top3 = await Order.aggregate([
    { $project: { _id: 0, customer: 1, item: 1, total: { $multiply: ["$qty", "$price"] } } },
    { $sort: { total: -1 } },
    { $limit: 3 }
  ]);
  console.log("3. Top 3 orders by value:", top3);

  // 4. Group by month using a date operator
  const byMonth = await Order.aggregate([
    { $group: { _id: { $month: "$orderedOn" }, orders: { $sum: 1 }, avgOrderValue: { $avg: { $multiply: ["$qty", "$price"] } } } },
    { $sort: { _id: 1 } }
  ]);
  console.log("4. Orders per month:", byMonth);

  // 5. $group with $push and $addToSet: items and categories bought by each customer
  const perCustomer = await Order.aggregate([
    { $group: { _id: "$customer", items: { $push: "$item" }, categories: { $addToSet: "$category" } } },
    { $sort: { _id: 1 } }
  ]);
  console.log("5. Items per customer:", JSON.stringify(perCustomer, null, 2));

  // 6. $count: how many orders were worth more than 800
  const bigOrders = await Order.aggregate([
    { $match: { $expr: { $gt: [{ $multiply: ["$qty", "$price"] }, 800] } } },
    { $count: "ordersAbove800" }
  ]);
  console.log("6.", bigOrders[0]);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error("Could not run:", err.message);
  process.exit(1);
});
