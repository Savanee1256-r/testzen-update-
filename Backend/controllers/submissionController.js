const submissionService = require('../services/submissionService');
const { validationResult } = require('express-validator');

function parseMarks(payload = {}) {
    if (Array.isArray(payload.marks)) {
        return payload.marks.map((entry) => ({
            questionId: entry.questionId,
            marks: Number(entry.marks ?? 0),
        }));
    }

    if (Array.isArray(payload.answerGrades)) {
        return payload.answerGrades.map((entry) => ({
            questionId: entry.questionId,
            marks: Number(entry.marksAwarded ?? entry.marks ?? 0),
        }));
    }

    return [];
}

module.exports.submitExam = async (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden: students only' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { examId, answers } = req.body;

    try {
        const result = await submissionService.submitExam(req.user._id, examId, answers);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports.getAllSubmissions = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    try {
        const submissions = await submissionService.getAllSubmissions();
        res.json({ submissions });
    } catch (err) {
        next(err);
    }
};

module.exports.getMySubmissions = async (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden: students only' });
    }

    try {
        const submissions = await submissionService.getSubmissionsByStudent(req.user._id);
        res.json({ submissions });
    } catch (err) {
        next(err);
    }
};

module.exports.getSubmissionsByExam = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    try {
        const submissions = await submissionService.getSubmissionsByExam(req.params.examId);
        res.json({ submissions });
    } catch (err) {
        next(err);
    }
};

module.exports.getSubmissionById = async (req, res, next) => {
    try {
        const submission = await submissionService.getSubmissionById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        if (req.user.role === 'student' && String(submission.studentId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.json({ submission });
    } catch (err) {
        next(err);
    }
};

module.exports.evaluateSubmission = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    const marks = parseMarks(req.body);
    if (!marks.length) {
        return res.status(400).json({ message: 'A non-empty marks array is required' });
    }

    try {
        const updated = await submissionService.evaluateSubmission(req.params.submissionId, marks);
        res.json({ message: 'Submission evaluated', submission: updated });
    } catch (err) {
        next(err);
    }
};
