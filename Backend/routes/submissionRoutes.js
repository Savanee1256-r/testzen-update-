const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const submissionController = require('../controllers/submissionController');

router.post(
    '/',
    authMiddleware.authUser,
    [
        body('examId').notEmpty().withMessage('examId is required'),
        body('answers').isArray({ min: 1 }).withMessage('answers must be a non-empty array'),
        body('answers.*.questionId').notEmpty().withMessage('each answer must have a questionId'),
        body('answers.*.answer').notEmpty().withMessage('each answer must have an answer value')
    ],
    submissionController.submitExam
);

router.post(
    '/submit',
    authMiddleware.authUser,
    [
        body('examId').notEmpty().withMessage('examId is required'),
        body('answers').isArray({ min: 1 }).withMessage('answers must be a non-empty array'),
        body('answers.*.questionId').notEmpty().withMessage('each answer must have a questionId'),
        body('answers.*.answer').notEmpty().withMessage('each answer must have an answer value')
    ],
    submissionController.submitExam
);

router.get('/', authMiddleware.authUser, submissionController.getAllSubmissions);
router.get('/my', authMiddleware.authUser, submissionController.getMySubmissions);

router.get(
    '/exam/:examId',
    authMiddleware.authUser,
    [param('examId').notEmpty().withMessage('examId parameter is required')],
    submissionController.getSubmissionsByExam
);

router.put(
    '/:submissionId/grade',
    authMiddleware.authUser,
    [param('submissionId').notEmpty().withMessage('submissionId parameter is required')],
    submissionController.evaluateSubmission
);

router.put(
    '/evaluate/:submissionId',
    authMiddleware.authUser,
    [param('submissionId').notEmpty().withMessage('submissionId parameter is required')],
    submissionController.evaluateSubmission
);

router.get('/:id', authMiddleware.authUser, submissionController.getSubmissionById);

module.exports = router;
