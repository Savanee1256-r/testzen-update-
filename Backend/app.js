require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexPath);
const apiPrefixes = ['/auth', '/users', '/submissions', '/exams', '/results', '/questions'];

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/submissions', submissionRoutes);
app.use('/exams', examRoutes);
app.use('/', questionRoutes);
app.use('/results', resultRoutes);

connectDB();

if (hasFrontendBuild) {
    app.use(express.static(frontendDistPath));

    app.use((req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        if (apiPrefixes.some((prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`))) {
            return next();
        }

        return res.sendFile(frontendIndexPath);
    });
} else {
    app.get('/', (req, res) => {
        res.send('Hello World');
    });
}

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    });
});

module.exports = app;
