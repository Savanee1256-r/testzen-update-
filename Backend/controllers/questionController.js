const questionService = require('../services/questionService');
const { validationResult } = require('express-validator');

exports.addQuestion = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { examId } = req.params;
    try {
        const question = await questionService.createQuestion(examId, req.body);
        return res.status(201).json({ question });
    } catch (err) {
        next(err);
    }
};

exports.getQuestions = async (req, res, next) => {
    const { examId } = req.params;
    try {
        let questions = await questionService.getQuestionsByExam(examId);
        questions = questions.map((question) => (question.toObject ? question.toObject() : question));

        if (req.user.role !== 'Teacher') {
            questions = questions.map(({ correctAnswer, ...rest }) => rest);
        }

        res.json({ questions });
    } catch (err) {
        next(err);
    }
};

exports.updateQuestion = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updated = await questionService.updateQuestion(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ question: updated });
    } catch (err) {
        next(err);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    try {
        const deleted = await questionService.deleteQuestion(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted' });
    } catch (err) {
        next(err);
    }
};
