// Mongoose schema validation: built-in validators, custom validator, enum, defaults and unique index
const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/fsdPractice";

const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      match: [/^A\d{11}$/, "Roll number must look like A24126552186"]
    },
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: props => `${props.value} is not a valid email`
      }
    },
    branch: { type: String, enum: ["CSE", "CSM", "CSD", "ECE", "EEE", "MECH"], default: "CSM" },
    year: { type: Number, min: 1, max: 4, required: true },
    cgpa: { type: Number, min: 0, max: 10 },
    skills: {
      type: [String],
      validate: { validator: arr => arr.length <= 10, message: "At most 10 skills allowed" }
    }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

async function tryInsert(label, data) {
  try {
    const doc = await Student.create(data);
    console.log(`OK   ${label}: saved ${doc.name} (${doc.branch})`);
  } catch (err) {
    if (err.name === "ValidationError") {
      const reasons = Object.values(err.errors).map(e => e.message).join("; ");
      console.log(`FAIL ${label}: ${reasons}`);
    } else if (err.code === 11000) {
      console.log(`FAIL ${label}: duplicate roll number`);
    } else {
      console.log(`FAIL ${label}: ${err.message}`);
    }
  }
}

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to", MONGO_URL);
  await Student.deleteMany({});
  await Student.syncIndexes();

  await tryInsert("valid student", { rollNo: "A24126552186", name: "V. Govardhan", email: "Example@Gmail.com", year: 3, cgpa: 8.5, skills: ["HTML", "CSS", "Node"] });
  await tryInsert("missing name", { rollNo: "A24126552101", email: "a@b.com", year: 3 });
  await tryInsert("bad email", { rollNo: "A24126552102", name: "Kiran", email: "kiran-at-mail", year: 2 });
  await tryInsert("year out of range", { rollNo: "A24126552103", name: "Divya", email: "divya@mail.com", year: 6 });
  await tryInsert("branch not in enum", { rollNo: "A24126552104", name: "Ravi", email: "ravi@mail.com", year: 1, branch: "CIVIL" });
  await tryInsert("bad roll number", { rollNo: "12345", name: "Sita", email: "sita@mail.com", year: 2 });
  await tryInsert("duplicate roll number", { rollNo: "A24126552186", name: "Someone Else", email: "x@mail.com", year: 3 });

  const saved = await Student.find({}, { _id: 0, rollNo: 1, name: 1, email: 1, branch: 1 }).lean();
  console.log("\nDocuments in the collection:", saved);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error("Could not run:", err.message);
  process.exit(1);
});
