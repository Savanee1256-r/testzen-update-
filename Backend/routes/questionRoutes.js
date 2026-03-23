const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const questionController = require('../controllers/questionController');

router.post(
    '/exams/:examId/questions',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    [
        param('examId').notEmpty().withMessage('examId parameter is required'),
        body('questionText').notEmpty().withMessage('questionText is required'),
        body('type').isIn(['MCQ', 'THEORY', 'CODING']).withMessage('type must be MCQ, THEORY, or CODING'),
        body('marks').optional().isNumeric().withMessage('marks must be numeric'),
        body('options').if(body('type').equals('MCQ')).isArray({ min: 2 }).withMessage('MCQ must have at least two options'),
        body('correctAnswer').if(body('type').equals('MCQ')).notEmpty().withMessage('correctAnswer is required for MCQ')
    ],
    questionController.addQuestion
);

router.get(
    '/exams/:examId/questions',
    authMiddleware.authUser,
    [param('examId').notEmpty().withMessage('examId parameter is required')],
    questionController.getQuestions
);

router.put(
    '/questions/:id',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    [
        param('id').notEmpty().withMessage('question id is required'),
        body('questionText').optional().notEmpty().withMessage('questionText cannot be empty'),
        body('type').optional().isIn(['MCQ', 'THEORY', 'CODING']).withMessage('type must be MCQ, THEORY, or CODING'),
        body('marks').optional().isNumeric().withMessage('marks must be numeric'),
        body('options').optional().isArray().withMessage('options must be an array'),
        body('correctAnswer').optional().notEmpty().withMessage('correctAnswer cannot be empty')
    ],
    questionController.updateQuestion
);

router.delete(
    '/questions/:id',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    [param('id').notEmpty().withMessage('question id is required')],
    questionController.deleteQuestion
);

module.exports = router;
