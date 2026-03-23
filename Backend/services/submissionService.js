const submissionRepo = require('../repositories/submissionRepositories');
const examModel = require('../models/examModel');

function formatUser(user) {
    const firstname = user?.fullname?.firstname || '';
    const lastname = user?.fullname?.lastname || '';

    return {
        _id: user._id,
        name: [firstname, lastname].filter(Boolean).join(' ').trim(),
        email: user.email,
        role: String(user.role).toLowerCase() === 'teacher' ? 'teacher' : 'student',
        phone: user.phone,
        department: user.department,
        enrollmentNo: user.enrollmentNo,
        semester: user.semester,
        createdAt: user.createdAt,
        joinedAt: user.createdAt,
    };
}

function formatQuestion(question) {
    if (!question) {
        return null;
    }

    return {
        _id: question._id,
        questionText: question.questionText,
        type: question.type,
        options: question.options || [],
        correctAnswer: question.correctAnswer,
        starterCode: question.starterCode,
        expectedOutput: question.expectedOutput,
        marks: question.marks || 0,
    };
}

function formatExam(exam) {
    if (!exam) {
        return null;
    }

    return {
        _id: exam._id,
        title: exam.title,
        subject: exam.subject,
        description: exam.description,
        duration: exam.duration,
        totalMarks: exam.totalMarks || 0,
        status: exam.status,
        teacher: exam.teacher,
        type: exam.type,
        createdAt: exam.createdAt,
        questions: Array.isArray(exam.questions) ? exam.questions.map(formatQuestion).filter(Boolean) : [],
    };
}

function formatSubmission(submission) {
    const exam = formatExam(submission.examId || submission.exam);
    const student = submission.studentId ? formatUser(submission.studentId) : null;
    const maxScore = exam?.totalMarks || 0;
    const percentage = maxScore ? Math.round((Number(submission.totalMarks || 0) / maxScore) * 100) : 0;

    return {
        _id: submission._id,
        exam,
        examId: exam?._id || submission.examId,
        student,
        studentId: student?._id || submission.studentId,
        answers: (submission.answers || []).map((answer) => {
            const question = answer.questionId?.questionText
                ? formatQuestion(answer.questionId)
                : exam?.questions?.find((item) => String(item._id) === String(answer.questionId)) || null;
            const isLongAnswer = question?.type === 'THEORY' || question?.type === 'CODING';

            return {
                questionId: question?._id || answer.questionId,
                questionText: question?.questionText || '',
                type: isLongAnswer ? 'long' : 'mcq',
                answer: answer.answer,
                longAnswer: isLongAnswer ? answer.answer : undefined,
                marks: answer.marks || 0,
                maxMarks: question?.marks || 0,
                options: question?.options || [],
                correctAnswer: question?.correctAnswer,
            };
        }),
        totalMarks: submission.totalMarks || 0,
        maxScore,
        percentage,
        status: submission.status,
        published: Boolean(submission.published),
        submittedAt: submission.submittedAt,
    };
}

async function submitExam(studentId, examId, answers = []) {
    if (!examId || !studentId) {
        throw new Error('Exam ID and student ID are required');
    }

    const exam = await examModel.findById(examId).populate('questions');
    if (!exam) {
        throw new Error('Exam not found');
    }

    const existing = await submissionRepo.findOneByStudentAndExam(studentId, examId);
    if (existing) {
        throw new Error('You have already submitted this exam');
    }

    let totalMarks = 0;
    const processedAnswers = answers.map((answer) => ({
        questionId: answer.questionId,
        answer: answer.answer,
        marks: 0
    }));

    const questionMap = new Map(exam.questions.map((question) => [question._id.toString(), question]));
    for (const answer of processedAnswers) {
        const question = questionMap.get(answer.questionId.toString());
        if (question && question.type === 'MCQ' && answer.answer === question.correctAnswer) {
            answer.marks = question.marks || 0;
            totalMarks += answer.marks;
        }
    }

    const hasLongFormQuestion = exam.questions.some((question) => question.type !== 'MCQ');
const status = hasLongFormQuestion ? 'pending' : 'checked';
const published = !hasLongFormQuestion; // Auto-publish MCQ

const submission = await submissionRepo.create({
    examId,
    studentId,
    answers: processedAnswers,
    totalMarks,
    status,
    published,
    submittedAt: new Date()
});

    return {
        message: 'Exam submitted successfully',
        totalMarks: submission.totalMarks,
        status: submission.status,
        submission
    };
}

async function evaluateSubmission(submissionId, marksArray = []) {
    if (!submissionId) {
        throw new Error('Submission ID is required');
    }

    const submission = await submissionRepo.findById(submissionId);
    if (!submission) {
        throw new Error('Submission not found');
    }

    if (submission.status === 'checked') {
        throw new Error('Submission has already been evaluated');
    }

    const marksMap = new Map(marksArray.map((entry) => [entry.questionId.toString(), entry.marks]));
    let total = 0;

    submission.answers = submission.answers.map((answer) => {
        const answerKey = answer.questionId.toString();
        const awardedMarks = marksMap.has(answerKey)
            ? Number(marksMap.get(answerKey) || 0)
            : Number(answer.marks || 0);
        answer.marks = awardedMarks;
        total += awardedMarks;
        return answer;
    });

    submission.totalMarks = total;
    submission.status = 'checked';

    await submissionRepo.update(submissionId, {
        answers: submission.answers,
        totalMarks: submission.totalMarks,
        status: submission.status
    });

    return getSubmissionById(submissionId);
}

async function getAllSubmissions() {
    const submissions = await submissionRepo.findAllDetailed();
    return submissions.map(formatSubmission);
}

async function getSubmissionsByStudent(studentId, options = {}) {
    if (!studentId) {
        throw new Error('Student ID is required');
    }

    const submissions = await submissionRepo.findByStudentDetailed(studentId);
    const formatted = submissions.map(formatSubmission);
    return options.publishedOnly ? formatted.filter((submission) => submission.published) : formatted;
}

async function getSubmissionsByExam(examId) {
    if (!examId) {
        throw new Error('Exam ID is required');
    }

    const submissions = await submissionRepo.findByExamDetailed(examId);
    return submissions.map(formatSubmission);
}

async function getSubmissionById(submissionId) {
    if (!submissionId) {
        throw new Error('Submission ID is required');
    }

    const submission = await submissionRepo.findByIdDetailed(submissionId);
    if (!submission) {
        return null;
    }

    return formatSubmission(submission);
}

async function publishResult(submissionId) {
    if (!submissionId) {
        throw new Error('Submission ID is required');
    }

    const submission = await submissionRepo.findById(submissionId);
    if (!submission) {
        throw new Error('Submission not found');
    }

    await submissionRepo.update(submissionId, { published: true });
    return getSubmissionById(submissionId);
}

module.exports = {
    submitExam,
    evaluateSubmission,
    getAllSubmissions,
    getSubmissionById,
    getSubmissionsByStudent,
    getSubmissionsByExam,
    publishResult
};
