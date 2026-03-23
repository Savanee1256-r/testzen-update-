const Submission = require('../models/submissionModel');

function withDetails(query) {
    return query
        .populate({
            path: 'examId',
            populate: {
                path: 'questions',
            },
        })
        .populate('studentId')
        .populate('answers.questionId');
}

module.exports.create = function(data) {
    return Submission.create(data);
};

module.exports.findByStudent = function(studentId) {
    return Submission.find({ studentId });
};

module.exports.findByExam = function(examId) {
    return Submission.find({ examId });
};

module.exports.findAllDetailed = function() {
    return withDetails(Submission.find({}).sort({ submittedAt: -1 }));
};

module.exports.findByStudentDetailed = function(studentId) {
    return withDetails(Submission.find({ studentId }).sort({ submittedAt: -1 }));
};

module.exports.findByExamDetailed = function(examId) {
    return withDetails(Submission.find({ examId }).sort({ submittedAt: -1 }));
};

module.exports.findOneByStudentAndExam = function(studentId, examId) {
    return Submission.findOne({ studentId, examId });
};

module.exports.findById = function(id) {
    return Submission.findById(id);
};

module.exports.findByIdDetailed = function(id) {
    return withDetails(Submission.findById(id));
};

module.exports.update = function(id, changes) {
    return Submission.findByIdAndUpdate(id, changes, { returnDocument: 'after' });
};
