const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['MCQ', 'LONG'],
        required: true
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],
    totalMarks: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 60
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    teacher: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

examSchema.pre('save', async function() {
    if (this.questions && this.questions.length) {
        const Question = require('./questionModel');
        const questions = await Question.find({ _id: { $in: this.questions } });
        this.totalMarks = questions.reduce((sum, question) => sum + (question.marks || 0), 0);
    }
});

module.exports = mongoose.model('Exam', examSchema);
