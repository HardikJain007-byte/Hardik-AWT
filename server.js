const express = require('express');
const app = express();
const port = 3002;

// Hello World endpoint
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// String replacement endpoint
app.get('/replace', (req, res) => {
    const { text } = req.query;
    if (!text) {
        return res.status(400).json({ error: 'Text parameter is required' });
    }

    const regex = /a{2,}/g;
    const result = text.replace(regex, 'b');
    res.json({ original: text, replaced: result });
});

// Calculator endpoint
app.get('/calculate', (req, res) => {
    const { operation, num1, num2 } = req.query;
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).json({ error: 'Invalid numbers provided' });
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
            return res.status(400).json({ error: 'Invalid operation. Use add, subtract, multiply, or divide' });
    }

    res.json({ operation, num1: n1, num2: n2, result });
});

// Array iteration endpoint
app.get('/iterate', (req, res) => {
    const array = [10, 20, 30, 40, 50];
    const iterations = [];

    // Using for loop
    iterations.push("Using for loop:");
    for (let i = 0; i < array.length; i++) {
        iterations.push(`Index ${i}: ${array[i]}`);
    }

    // Using forEach
    iterations.push("Using forEach:");
    array.forEach((item, index) => {
        iterations.push(`Index ${index}: ${item}`);
    });

    // Using for...of
    iterations.push("Using for...of:");
    for (const item of array) {
        iterations.push(`Item: ${item}`);
    }

    res.json({ array, iterations });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('  GET / - Hello World');
    console.log('  GET /replace?text=your_text - Replace multiple a\'s with b');
    console.log('  GET /calculate?operation=add&num1=5&num2=3 - Calculator');
    console.log('  GET /iterate - Array iteration examples');
});
