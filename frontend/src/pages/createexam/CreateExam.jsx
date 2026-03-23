import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createExam } from '../../services/examService';
import './CreateExam.css';

const CreateExam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    examName: '',
    subject: '',
    duration: 30,
    totalQuestions: 0,
    totalMarks: 0,
    description: '',
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    questionType: 'mcq',
    marks: 1,
  });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration' || name === 'totalQuestions' || name === 'totalMarks' 
        ? parseInt(value) 
        : value,
    });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (currentQuestion.questionType === 'mcq') {
      if (currentQuestion.options.some(opt => !opt.trim())) {
        alert('Please fill all options');
        return;
      }
      if (!currentQuestion.correctAnswer) {
        alert('Please select the correct answer');
        return;
      }
    }

    setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      questionType: 'mcq',
      marks: 1,
    });
    setShowQuestionForm(false);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmitExam = async () => {
    if (!formData.examName.trim()) {
      alert('Please enter exam name');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setLoading(true);
    try {
      const examData = {
        title: formData.examName,
        subject: formData.subject,
        description: formData.description,
        duration: formData.duration,
        totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
        questions: questions.map(q => ({
          questionText: q.questionText,
          type: q.questionType.toUpperCase(),
          marks: q.marks,
          options: q.questionType === 'mcq' ? q.options : [],
          correctAnswer: q.questionType === 'mcq' ? q.correctAnswer : '',
        })),
        teacher: user?.name || "Teacher",
        status: "published"
      };

      await createExam(examData, localStorage.getItem('token'));
      setSubmitted(true);
      
      // Reset form after submission
      setTimeout(() => {
        setFormData({
          examName: '',
          subject: '',
          duration: 30,
          totalQuestions: 0,
          totalMarks: 0,
          description: '',
        });
        setQuestions([]);
        setSubmitted(false);
        navigate('/teacher/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Failed to create exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-exam-container">
      <div className="create-exam-card">
        <h2>Create New Exam</h2>

        {submitted && (
          <div className="success-message">
            ✓ Exam created successfully! Redirecting...
          </div>
        )}

        {loading && (
          <div className="loading-message">
            Creating exam... Please wait.
          </div>
        )}

        <div className="exam-details-section">
          <h3>Exam Details</h3>
          <form className="exam-form">
            <div className="form-group">
              <label>Exam Name *</label>
              <input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleFormChange}
                placeholder="e.g., Java Basics Quiz"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  placeholder="e.g., Java Programming"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  min="5"
                  max="300"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter exam description"
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="questions-section">
          <div className="section-header">
            <h3>Questions ({questions.length})</h3>
            <button
              className="btn-add-question"
              onClick={() => setShowQuestionForm(!showQuestionForm)}
            >
              {showQuestionForm ? 'Cancel' : '+ Add Question'}
            </button>
          </div>

          {showQuestionForm && (
            <div className="question-form">
              <div className="form-group">
                <label>Question Type</label>
                <select
                  name="questionType"
                  value={currentQuestion.questionType}
                  onChange={handleQuestionChange}
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="theory">Theory</option>
                </select>
              </div>

              <div className="form-group">
                <label>Question Text *</label>
                <textarea
                  name="questionText"
                  value={currentQuestion.questionText}
                  onChange={handleQuestionChange}
                  placeholder="Enter the question"
                  rows="2"
                ></textarea>
              </div>

              {currentQuestion.questionType === 'mcq' && (
                <>
                  <div className="options-group">
                    <label>Options *</label>
                    {currentQuestion.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Correct Answer *</label>
                    <select
                      name="correctAnswer"
                      value={currentQuestion.correctAnswer}
                      onChange={handleQuestionChange}
                    >
                      <option value="">Select correct answer</option>
                      {currentQuestion.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option || `Option ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Marks *</label>
                <input
                  type="number"
                  name="marks"
                  value={currentQuestion.marks}
                  onChange={handleQuestionChange}
                  min="1"
                  max="100"
                />
              </div>

              <button
                type="button"
                className="btn-add-question"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
            </div>
          )}

          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={question.id} className="question-item">
                <div className="question-header">
                  <span className="question-number">Q{index + 1}</span>
                  <span className="question-type">{question.questionType === 'mcq' ? 'MCQ' : 'Theory'}</span>
                  <span className="question-marks">{question.marks} marks</span>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveQuestion(question.id)}
                  >
                    ✕
                  </button>
                </div>
                <p className="question-text">{question.questionText}</p>
                {question.questionType === 'mcq' && (
                  <ul className="question-options">
                    {question.options.map((option, idx) => (
                      <li key={idx}>
                        <input type="radio" disabled />
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn-cancel"
            onClick={() => navigate('/teacher/dashboard')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmitExam}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;
