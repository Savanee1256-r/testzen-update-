const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistTokenModel');

function formatUser(user) {
    const firstname = user?.fullname?.firstname || '';
    const lastname = user?.fullname?.lastname || '';

    return {
        _id: user._id,
        fullname: user.fullname,
        name: [firstname, lastname].filter(Boolean).join(' ').trim(),
        email: user.email,
        role: String(user.role).toLowerCase() === 'teacher' ? 'teacher' : 'student',
        phone: user.phone,
        department: user.department,
        enrollmentNo: user.enrollmentNo,
        semester: user.semester,
        createdAt: user.createdAt,
    };
}

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, role } = req.body;

    try {
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password,
            role,
        });
        const token = user.generateAuthToken();
        res.status(201).json({ token, user: formatUser(user) });
    } catch (err) {
        next(err);
    }
};

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = user.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
        });

        res.json({ token, user: formatUser(user) });
    } catch (err) {
        next(err);
    }
};

module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            await blacklistTokenModel.create({ token });
        }

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};
