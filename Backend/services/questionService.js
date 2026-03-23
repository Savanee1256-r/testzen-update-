const questionRepo = require('../repositories/questionRepositories');
const examRepo = require('../repositories/examRepositories');

async function createQuestion(examId, questionData) {
    if (!examId) {
        throw new Error('examId is required');
    }

    questionData.examId = examId;

    const question = await questionRepo.create(questionData);
    await examRepo.addQuestionToExam(examId, question._id);
    await examRepo.recalculateTotal(examId);
    return question;
}

async function getQuestionsByExam(examId) {
    if (!examId) throw new Error('examId is required');
    return questionRepo.findByExam(examId);
}

async function updateQuestion(id, changes) {
    if (!id) throw new Error('question id is required');
    const updated = await questionRepo.update(id, changes);
    if (updated && updated.examId) {
        await examRepo.recalculateTotal(updated.examId);
    }
    return updated;
}

async function deleteQuestion(id) {
    if (!id) throw new Error('question id is required');
    const question = await questionRepo.findById(id);
    if (!question) throw new Error('Question not found');

    const examId = question.examId;
    const deleted = await questionRepo.delete(id);

    if (examId) {
        await examRepo.removeQuestionFromExam(examId, id);
        await examRepo.recalculateTotal(examId);
    }

    return deleted;
}

module.exports = {
    createQuestion,
    getQuestionsByExam,
    updateQuestion,
    deleteQuestion
};
