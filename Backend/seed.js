require('dotenv').config();
const mongoose = require('mongoose');
const db = require('./db/db');
const User = require('./models/userModel');
const Exam = require('./models/examModel');
const Submission = require('./models/submissionModel');
const Question = require('./models/questionModel');

async function seedData() {
  try {
    // Clear existing data
    await Submission.deleteMany({});
    await Question.deleteMany({});
    await Exam.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } });

    // Create teacher
    const teacher = await User.create({
      fullname: { firstname: 'John', lastname: 'Teacher' },
      email: 'teacher@test.com',
      password: '$2b$10$K.0xNMcxQvJq8zI7J2p5vO4z8K1z8i5z8K1z8i5z8K1z8i5z8K1', // dummy
      role: 'Teacher',
      phone: '1234567890'
    });

    // Create student
    const student = await User.create({
      fullname: { firstname: 'Jane', lastname: 'Student' },
      email: 'student@test.com',
      enrollmentNo: 'STU001',
      semester: '3',
      role: 'student'
    });

    // Create exam
    const exam = await Exam.create({
      title: 'JAVA Programming Exam',
      subject: 'JAVA',
      description: 'MCQ test',
      duration: 60,
      status: 'published',
      teacher: teacher._id,
      type: 'MCQ',
      totalMarks: 10
    });

    // Create question
    const question = await Question.create({
      examId: exam._id,
      questionText: 'What is Java?',
      type: 'MCQ',
      options: ['Language', 'Platform', 'Both', 'None'],
      correctAnswer: 'Both',
      marks: 10
    });

    await Exam.updateOne({ _id: exam._id }, { questions: [question._id] });

    // Create submission
    await Submission.create({
      student: student._id,
      exam: exam._id,
      answers: [{ questionId: question._id, answer: 'Both' }],
      totalMarks: 10,
      maxScore: 10,
      percentage: 100,
      status: 'checked',
      published: true,
      submittedAt: new Date()
    });

    console.log('✅ Seeded: Teacher, Student, JAVA Exam, Submission! Dashboards populated.');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();

