const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware.authUser, roleMiddleware.requireRole(['Teacher']), examController.createExam);
router.post('/add', authMiddleware.authUser, roleMiddleware.requireRole(['Teacher']), examController.createExam);
router.get('/', authMiddleware.authUser, examController.getExams);
router.get('/all', authMiddleware.authUser, examController.getExams);
router.get('/:id', authMiddleware.authUser, examController.getExam);
router.put('/:id', authMiddleware.authUser, roleMiddleware.requireRole(['Teacher']), examController.updateExam);
router.put('/:id/publish', authMiddleware.authUser, roleMiddleware.requireRole(['Teacher']), examController.publishExam);
router.delete('/:id', authMiddleware.authUser, roleMiddleware.requireRole(['Teacher']), examController.deleteExam);

module.exports = router;
