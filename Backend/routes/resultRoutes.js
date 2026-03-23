const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const resultController = require('../controllers/resultController');

router.get(
    '/my',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['student']),
    resultController.getMyResults
);

router.post(
    '/grade',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    resultController.grade
);

router.get(
    '/exam/:examId',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    [param('examId').notEmpty().withMessage('examId parameter is required')],
    resultController.getExamResults
);

router.put(
    '/publish/:submissionId',
    authMiddleware.authUser,
    roleMiddleware.requireRole(['Teacher']),
    [param('submissionId').notEmpty().withMessage('submissionId parameter is required')],
    resultController.publishResult
);

router.get(
    '/:resultId',
    authMiddleware.authUser,
    [param('resultId').notEmpty().withMessage('resultId is required')],
    resultController.getResultById
);

module.exports = router;
