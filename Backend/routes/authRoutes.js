const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authControllers = require('../controllers/authControllers');

router.post('/register', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['student', 'teacher', 'Teacher']).withMessage('Role must be student or teacher'),
], authControllers.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
], authControllers.loginUser);

module.exports = router;
