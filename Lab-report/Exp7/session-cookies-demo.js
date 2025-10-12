const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cookieParser());
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

// Serve a simple login form
app.get('/', (req, res) => {
    if (req.session.user) {
        res.send(`
            <h2>Welcome back, ${req.session.user} 👋</h2>
            <p>Cookie username: ${req.cookies.username || 'No cookie set'}</p>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <h2>Login Page</h2>
            <form method="POST" action="/login">
                <label>Username:</label>
                <input type="text" name="username" required />
                <br><br>
                <button type="submit">Login</button>
            </form>
        `);
    }
});

// Handle login
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        req.session.user = username; // store in session
        res.cookie('username', username, { maxAge: 600000 }); // store in cookie
        res.redirect('/');
    } else {
        res.send('Please enter a username.');
    }
});

// View session and cookie info
app.get('/info', (req, res) => {
    res.json({
        sessionUser: req.session.user || null,
        cookieUser: req.cookies.username || null,
        sessionID: req.sessionID
    });
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out.');
        }
        res.send(`
            <h3>Session and cookie cleared successfully.</h3>
            <a href="/">Go back to Login</a>
        `);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});
