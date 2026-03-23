const Question = require('../models/questionModel');

exports.create = function(data) {
    return Question.create(data);
};

exports.findByExam = function(examId) {
    return Question.find({ examId });
};

exports.findById = function(id) {
    return Question.findById(id);
};

exports.update = function(id, changes) {
    return Question.findByIdAndUpdate(id, changes, { returnDocument: 'after' });
};

exports.delete = function(id) {
    return Question.findByIdAndDelete(id);
};
