// server.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const User = require("./models/User");
const Student = require("./models/Student");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // important for form POST
app.use(cookieParser());
app.use(
    session({
        secret: "very-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
    })
);

app.use(express.static(path.join(__dirname, "public")));

// ---------- HELPER: setAuthCookies() ----------
function setAuthCookies(res, userId) {
    res.cookie("authUser", userId, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    });
}

// ---------- AUTH MIDDLEWARE ----------
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        if (req.path.startsWith("/api")) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        return res.redirect("/login");
    }
    next();
}

// ---------- CONNECT DB + FORCE CREATE TEACHER ----------
async function connectAndSeed() {
    const mongoUri =
        process.env.MONGO_URI || "mongodb://127.0.0.1:27017/marks_app";

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected:", mongoUri);

    // ALWAYS ensure teacher exists and has password "teacher123"
    let user = await User.findOne({ username: "teacher" });
    if (!user) {
        user = new User({ username: "teacher", passwordHash: "" });
    }

    await user.setPassword("teacher123");
    await user.save();

    console.log(
        "✅ Teacher user ready. Username: teacher , Password: teacher123"
    );
}

// ---------- PAGE ROUTES ----------
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/dashboard", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// ---------- AUTH ROUTES ----------
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log("🔐 Login attempt:", username, password); // debug

    const user = await User.findOne({ username });
    console.log("🔍 User from DB:", user ? user.username : null);

    if (!user) {
        console.log("❌ No such user");
        return res.status(401).send("Invalid username or password");
    }

    const ok = await user.validatePassword(password);
    console.log("✅ Password match?", ok);

    if (!ok) {
        return res.status(401).send("Invalid username or password");
    }

    req.session.userId = user._id.toString();
    setAuthCookies(res, user._id.toString());

    res.redirect("/dashboard");
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("authUser");
        res.redirect("/login");
    });
});

// ---------- API: STUDENTS ----------
app.get("/api/students", requireAuth, async (req, res) => {
    const students = await Student.find().sort({ sapId: 1 });
    res.json(students);
});

app.post("/api/students", requireAuth, async (req, res) => {
    const { sapId, name, marks } = req.body;
    if (!sapId || !name) {
        return res.status(400).json({ message: "SAP ID and name are required." });
    }
    const numMarks = Number(marks);
    if (isNaN(numMarks) || numMarks < 0 || numMarks > 100) {
        return res
            .status(400)
            .json({ message: "Marks must be a number between 0 and 100." });
    }

    const student = new Student({ sapId, name, marks: numMarks });
    await student.save();
    res.status(201).json(student);
});

app.put("/api/students/:id", requireAuth, async (req, res) => {
    const { sapId, name, marks } = req.body;
    const numMarks = Number(marks);
    if (isNaN(numMarks) || numMarks < 0 || numMarks > 100) {
        return res
            .status(400)
            .json({ message: "Marks must be a number between 0 and 100." });
    }

    const updated = await Student.findByIdAndUpdate(
        req.params.id,
        { sapId, name, marks: numMarks },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);
});

// ---------- API: PERFORMANCE ----------
app.get("/api/performance", requireAuth, async (req, res) => {
    const students = await Student.find();

    const ranges = [
        { label: "90-100", count: 0 },
        { label: "80-89", count: 0 },
        { label: "70-79", count: 0 },
        { label: "<70", count: 0 }
    ];

    students.forEach((s) => {
        const m = s.marks;
        if (m >= 90) ranges[0].count++;
        else if (m >= 80) ranges[1].count++;
        else if (m >= 70) ranges[2].count++;
        else ranges[3].count++;
    });

    res.json({ ranges });
});

// ---------- START SERVER AFTER DB & TEACHER READY ----------
const PORT = process.env.PORT || 3000;

connectAndSeed()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error starting app:", err);
    });
