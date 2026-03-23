require('dotenv').config();
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;


const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});

// global handlers to avoid silent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // crash safely
});