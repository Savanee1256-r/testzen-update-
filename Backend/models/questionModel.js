const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['MCQ', 'THEORY', 'CODING'],
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
        index: true
    },
    options: {
        type: [String],
        default: undefined
    },
    correctAnswer: {
        type: String
    },
    starterCode: {
        type: String
    },
    expectedOutput: {
        type: String
    },
    marks: {
        type: Number,
        default: 1
    }
});

questionSchema.pre('validate', function() {
    if (this.type === 'MCQ') {
        if (!this.options || this.options.length < 2) {
            this.invalidate('options', 'MCQ questions must have at least two options');
        }
        if (!this.correctAnswer) {
            this.invalidate('correctAnswer', 'MCQ questions must define a correctAnswer');
        }
    }
});

module.exports = mongoose.model('Question', questionSchema);
