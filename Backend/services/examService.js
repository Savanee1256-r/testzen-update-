const examRepo = require('../repositories/examRepositories');
const questionRepo = require('../repositories/questionRepositories');

function normalizeQuestionType(type) {
  const normalized = String(type || '').toLowerCase();

  if (normalized === 'mcq') {
    return 'MCQ';
  }

  if (normalized === 'coding') {
    return 'CODING';
  }

  return 'THEORY';
}

function buildExamPayload(examData = {}) {
  const questions = Array.isArray(examData.questions) ? examData.questions : [];
  const hasLongFormQuestion = questions.some((question) => normalizeQuestionType(question.type) !== 'MCQ');

  return {
    title: examData.title,
    subject: examData.subject || 'General',
    description: examData.description || '',
    duration: Number(examData.duration) || 60,
    status: examData.status === 'published' ? 'published' : 'draft',
    teacher: examData.teacher || 'Teacher',
    type: hasLongFormQuestion ? 'LONG' : 'MCQ',
  };
}

function buildQuestionPayload(question = {}, examId) {
  const type = normalizeQuestionType(question.type);
  const options = Array.isArray(question.options)
    ? question.options.map((option) => String(option).trim()).filter(Boolean)
    : undefined;

  return {
    examId,
    questionText: question.questionText || question.text,
    type,
    options: type === 'MCQ' ? options : undefined,
    correctAnswer: type === 'MCQ' ? question.correctAnswer : undefined,
    starterCode: type === 'CODING' ? question.starterCode || '' : undefined,
    expectedOutput: type === 'CODING' ? question.expectedOutput || '' : undefined,
    marks: Number(question.marks) || 1,
  };
}

async function createExam(examData) {
  if (!examData || typeof examData !== 'object') {
    throw new Error('Valid exam data is required');
  }

  const questions = Array.isArray(examData.questions) ? examData.questions : [];
  const exam = await examRepo.createExam(buildExamPayload(examData));

  if (questions.length) {
    const questionIds = [];

    for (const question of questions) {
      const createdQuestion = await questionRepo.create(buildQuestionPayload(question, exam._id));
      questionIds.push(createdQuestion._id);
    }

    await examRepo.updateExam(exam._id, { questions: questionIds });
    await examRepo.recalculateTotal(exam._id);
  }

  return examRepo.getExamById(exam._id);
}

async function getExams() {
  return examRepo.getAllExams();
}

async function getExamById(id) {
  if (!id) throw new Error('Exam id is required');
  return examRepo.getExamById(id);
}

async function updateExam(id, data = {}) {
  if (!id) throw new Error('Exam id is required');

  const updates = {};

  ['title', 'subject', 'description', 'teacher'].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updates[field] = data[field];
    }
  });

  if (Object.prototype.hasOwnProperty.call(data, 'duration')) {
    updates.duration = Number(data.duration) || 60;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'status')) {
    updates.status = data.status === 'published' ? 'published' : 'draft';
  }

  return examRepo.updateExam(id, updates);
}

async function deleteExam(id) {
  if (!id) throw new Error('Exam id is required');
  return examRepo.deleteExam(id);
}

async function publishExam(id) {
  if (!id) throw new Error('Exam id is required');
  return examRepo.publishExam(id);
}

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
};
