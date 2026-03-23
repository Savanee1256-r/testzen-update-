const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

function normalizeRole(role) {
    return String(role || '').toLowerCase() === 'teacher' ? 'Teacher' : 'student';
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function createUser({ firstname, lastname, email, password, role, phone, department, enrollmentNo, semester }) {
    if (!firstname || !lastname || !email || !password) {
        throw new Error('All fields are required');
    }

    const hashed = await hashPassword(password);
    const user = new userModel({
        fullname: { firstname, lastname },
        email,
        password: hashed,
        role: normalizeRole(role),
        phone,
        department,
        enrollmentNo,
        semester,
    });

    return user.save();
}

async function findByEmail(email) {
    return userModel.findOne({ email }).select('+password');
}

module.exports = {
    hashPassword,
    createUser,
    findByEmail,
};
