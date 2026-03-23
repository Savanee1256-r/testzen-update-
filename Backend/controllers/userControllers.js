const userModel = require('../models/userModel');
const submissionService = require('../services/submissionService');

function formatUser(user) {
    const firstname = user?.fullname?.firstname || '';
    const lastname = user?.fullname?.lastname || '';

    return {
        _id: user._id,
        fullname: user.fullname,
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

function toGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

async function buildStudentSummary(student) {
    const submissions = await submissionService.getSubmissionsByStudent(student._id);
    const checkedSubmissions = submissions.filter((submission) => submission.status === 'checked');
    const avgScore = checkedSubmissions.length
        ? Math.round(
            checkedSubmissions.reduce((sum, submission) => sum + (submission.percentage || 0), 0) /
            checkedSubmissions.length
        )
        : null;

    return {
        ...formatUser(student),
        totalExams: submissions.length,
        avgScore,
        submissions: submissions.map((submission) => ({
            _id: submission._id,
            examTitle: submission.exam?.title || 'Untitled Exam',
            subject: submission.exam?.subject || '',
            score: submission.totalMarks || 0,
            maxScore: submission.maxScore || submission.exam?.totalMarks || 0,
            percentage: submission.percentage || 0,
            grade: toGrade(submission.percentage || 0),
            status: submission.published ? 'published' : submission.status,
            submittedAt: submission.submittedAt,
        })),
    };
}

module.exports.getUserProfile = async (req, res, next) => {
    try {
        res.status(200).json({ user: formatUser(req.user) });
    } catch (err) {
        next(err);
    }
};

module.exports.updateUserProfile = async (req, res, next) => {
    try {
        const updates = {};

        if (req.body.name) {
            const nameParts = String(req.body.name).trim().split(/\s+/).filter(Boolean);
            const firstname = nameParts.shift() || req.user.fullname?.firstname;
            const lastname = nameParts.join(' ') || req.user.fullname?.lastname || firstname;
            updates.fullname = { firstname, lastname };
        }

        ['phone', 'department', 'enrollmentNo', 'semester'].forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updates[field] = req.body[field];
            }
        });

        const user = await userModel.findByIdAndUpdate(req.user._id, updates, { returnDocument: 'after' });
        res.json({ user: formatUser(user) });
    } catch (err) {
        next(err);
    }
};

module.exports.getStudents = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    try {
        const students = await userModel.find({ role: 'student' }).sort({ createdAt: -1 });
        const formattedStudents = await Promise.all(students.map(buildStudentSummary));
        res.json({ students: formattedStudents });
    } catch (err) {
        next(err);
    }
};

module.exports.getStudentById = async (req, res, next) => {
    if (req.user.role !== 'Teacher') {
        return res.status(403).json({ message: 'Forbidden: teachers only' });
    }

    try {
        const student = await userModel.findOne({ _id: req.params.id, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ student: await buildStudentSummary(student) });
    } catch (err) {
        next(err);
    }
};
