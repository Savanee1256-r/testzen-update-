const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

router.get('/profile', authMiddleware.authUser, userController.getUserProfile);
router.put('/profile', authMiddleware.authUser, userController.updateUserProfile);
router.get('/students', authMiddleware.authUser, userController.getStudents);
router.get('/students/:id', authMiddleware.authUser, userController.getStudentById);
router.get('/logout', authMiddleware.authUser, authControllers.logoutUser);

module.exports = router;
