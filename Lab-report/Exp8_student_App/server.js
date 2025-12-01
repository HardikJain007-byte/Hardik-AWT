const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema
const studentSchema = new mongoose.Schema({
    name: String,
    roll: Number,
    branch: String,
    year: Number
});

const Student = mongoose.model("Student", studentSchema);

// Serve the HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "student.html"));
});

// Add student
app.post("/students/add", async (req, res) => {
    try {
        await Student.create(req.body);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err });
    }
});

// Get all students
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Search student (optional)
app.get("/students/search", async (req, res) => {
    const q = req.query.q;

    const result = await Student.find({
        $or: [
            { name: { $regex: q, $options: "i" } },
            { roll: Number(q) }
        ]
    });

    res.json(result);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});