const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            },
            answer: {
                type: String,
                required: true
            },
            marks: {
                type: Number,
                default: 0
            }
        }
    ],
    totalMarks: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'checked'],
        default: 'pending'
    },
    published: {
        type: Boolean,
        default: false
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

submissionSchema.index({ examId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ studentId: 1 });
submissionSchema.index({ examId: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
