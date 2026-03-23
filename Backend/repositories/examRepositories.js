const Exam = require('../models/examModel');

exports.createExam = async (examData) => {
  const exam = new Exam(examData);
  return exam.save();
};

exports.getAllExams = async () => {
  return Exam.find().populate('questions').lean();
};

exports.getExamById = async (id) => {
  return Exam.findById(id).populate('questions').lean();
};

exports.addQuestionToExam = async (examId, questionId) => {
  return Exam.findByIdAndUpdate(
    examId,
    { $addToSet: { questions: questionId } },
    { returnDocument: 'after' }
  ).populate('questions').lean();
};

exports.removeQuestionFromExam = async (examId, questionId) => {
  return Exam.findByIdAndUpdate(
    examId,
    { $pull: { questions: questionId } },
    { returnDocument: 'after' }
  ).populate('questions').lean();
};

exports.recalculateTotal = async (examId) => {
  const exam = await Exam.findById(examId).populate('questions');
  if (!exam) return null;

  exam.totalMarks = exam.questions.reduce((sum, question) => sum + (question.marks || 0), 0);
  await exam.save();
  return exam.toObject();
};

exports.updateExam = async (id, data) => {
  return Exam.findByIdAndUpdate(id, data, { returnDocument: 'after' }).populate('questions').lean();
};

exports.deleteExam = async (id) => {
  return Exam.findByIdAndDelete(id).lean();
};

exports.publishExam = async (id) => {
  return Exam.findByIdAndUpdate(
    id,
    { status: 'published' },
    { returnDocument: 'after' }
  ).populate('questions').lean();
};
