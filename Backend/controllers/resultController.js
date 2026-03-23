const resultService = require('../services/resultService');

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

exports.getMyResults = async (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden: students only' });
    }

    try {
        const results = await resultService.getMyResults(req.user._id);
        res.json({ results });
    } catch (err) {
        next(err);
    }
};

exports.getExamResults = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    try {
        const results = await resultService.getExamResults(req.params.examId);
        res.json({ results });
    } catch (err) {
        next(err);
    }
};

exports.grade = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    const { submissionId } = req.body;
    const marks = parseMarks(req.body);

    if (!submissionId || !marks.length) {
        return res.status(400).json({ message: 'submissionId and marks are required' });
    }

    try {
        const updated = await resultService.gradeSubmission(submissionId, marks);
        res.json({ message: 'Submission graded', submission: updated });
    } catch (err) {
        next(err);
    }
};

exports.getResultById = async (req, res, next) => {
    try {
        const result = await resultService.getResultById(req.params.resultId);

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        if (req.user.role === 'student' && String(result.studentId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.json({ result });
    } catch (err) {
        next(err);
    }
};

exports.publishResult = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    try {
        const updated = await resultService.publishResult(req.params.submissionId);
        res.json({ message: 'Result published', submission: updated });
    } catch (err) {
        next(err);
    }
};
