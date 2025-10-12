const express = require('express');
const app = express();
const PORT = 3002;

app.get('/calculate', (req, res) => {
    const { operation, num1, num2 } = req.query;
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.json({ result: 'Error: num1 and num2 must be numbers' });
    }

    let result;
    switch (operation) {
        case 'add':
            result = n1 + n2;
            break;
        case 'subtract':
            result = n1 - n2;
            break;
        case 'multiply':
            result = n1 * n2;
            break;
        case 'divide':
            result = n2 !== 0 ? n1 / n2 : 'Error: Division by zero';
            break;
        default:
            result = 'Error: Invalid operation';
    }

    res.json({ result });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
