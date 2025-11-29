require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Todo = require('./models/Todo');

const app = express();

// ---------- MONGOOSE CONNECTION ----------
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'todo_app'
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions (stored in MongoDB via connect-mongo)
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'changeme',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            dbName: 'todo_app',
            collectionName: 'sessions'
        }),
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 1 day
            // secure: true, // enable this in production with HTTPS
        }
    })
);

// Serve frontend
app.use(express.static('public'));

// ---------- AUTH MIDDLEWARE ----------
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
}

// ---------- ROUTES ----------

// Check current user
app.get('/api/me', async (req, res) => {
    if (!req.session.userId) {
        return res.json({ user: null });
    }
    const user = await User.findById(req.session.userId).select('email');
    res.json({ user });
});

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || password.length < 4) {
            return res.status(400).json({ error: 'Email and password (min 4 chars) are required.' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ email: email.toLowerCase(), passwordHash });

        req.session.userId = user._id;
        res.json({ message: 'Registered successfully', user: { email: user.email } });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        req.session.userId = user._id;
        res.json({ message: 'Logged in', user: { email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destroy error:', err);
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

// ----- TODO ROUTES (require login) -----

// Get todos for logged-in user
app.get('/api/todos', requireLogin, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.session.userId }).sort({ createdAt: -1 });
        res.json({ todos });
    } catch (err) {
        console.error('Get todos error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create todo
app.post('/api/todos', requireLogin, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Todo text is required' });
        }

        const todo = await Todo.create({
            user: req.session.userId,
            text: text.trim()
        });

        res.json({ todo });
    } catch (err) {
        console.error('Create todo error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update todo (text / completed)
app.put('/api/todos/:id', requireLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;

        const todo = await Todo.findOne({ _id: id, user: req.session.userId });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        if (typeof text === 'string') {
            todo.text = text.trim();
        }
        if (typeof completed === 'boolean') {
            todo.completed = completed;
        }

        await todo.save();
        res.json({ todo });
    } catch (err) {
        console.error('Update todo error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete todo
app.delete('/api/todos/:id', requireLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ _id: id, user: req.session.userId });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Deleted', id });
    } catch (err) {
        console.error('Delete todo error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
