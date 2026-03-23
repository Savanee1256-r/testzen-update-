const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.DB_URL;
    if (!uri) {
        console.error('DB_URL is not set in environment');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;