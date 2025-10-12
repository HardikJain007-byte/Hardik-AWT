const express = require('express');
const session = require('express-session');

const app = express();

// Configure session middleware
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

// Root route — count visits using session
app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Welcome back! You visited ${req.session.views} times.`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh to count visits.');
    }
});

// Destroy the session
app.get('/destroy', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error destroying session');
        }
        res.send('Session destroyed');
    });
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
