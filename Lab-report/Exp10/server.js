const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve files from the 'public' directory

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});