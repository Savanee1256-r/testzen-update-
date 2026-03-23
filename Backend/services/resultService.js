const submissionService = require('./submissionService');

async function getMyResults(studentId) {
    if (!studentId) {
        throw new Error('Student ID is required');
    }

    return submissionService.getSubmissionsByStudent(studentId, { publishedOnly: true });
}

async function getExamResults(examId) {
    if (!examId) {
        throw new Error('Exam ID is required');
    }

    return submissionService.getSubmissionsByExam(examId);
}

async function gradeSubmission(submissionId, marksArray) {
    return submissionService.evaluateSubmission(submissionId, marksArray);
}

async function getResultById(resultId) {
    return submissionService.getSubmissionById(resultId);
}

async function publishResult(submissionId) {
    return submissionService.publishResult(submissionId);
}

module.exports = {
    getMyResults,
    getExamResults,
    gradeSubmission,
    getResultById,
    publishResult
};
