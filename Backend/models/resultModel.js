const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
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
  score: { 
    type: Number, 
    default: 0 
  },
  totalMarks: { 
    type: Number, 
    required: true 
  },
  answers: { 
    type: Map, 
    of: String 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Result', resultSchema);
