const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// Home route
app.get('/', (req, res) => {
    res.send(`
        <h2>🍪 Cookie Example App</h2>
        <ul>
            <li><a href="/set-cookie">Set Cookie</a></li>
            <li><a href="/get-cookie">Get Cookie</a></li>
            <li><a href="/delete-cookie">Delete Cookie</a></li>
        </ul>
    `);
});

// Set a cookie
app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'JohnDoe', { maxAge: 900000 });
    res.send('Cookie has been set');
});

// Get the cookie
app.get('/get-cookie', (req, res) => {
    const user = req.cookies['username'];
    if (user) {
        res.send(`Cookie Retrieved: ${user}`);
    } else {
        res.send('No cookie found');
    }
});

// Delete the cookie
app.get('/delete-cookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie deleted');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
