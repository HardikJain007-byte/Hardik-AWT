// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n 590018657');
});

// starts a simple http server locally on port 3000
server.listen(3002, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3002');
});

// run with `node server.mjs`

