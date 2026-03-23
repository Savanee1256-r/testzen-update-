import React, { useState } from 'react'
import './login.css'

const Login = () => {
  const [userType, setUserType] = useState('student')
  const isStudent = userType === 'student'

  return (
    <div className="student-login-page">
      <div className="login-card">
        <div className="switch-row">
          <button
            type="button"
            className={userType === 'student' ? 'switch-btn active' : 'switch-btn'}
            onClick={() => setUserType('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={userType === 'teacher' ? 'switch-btn active' : 'switch-btn'}
            onClick={() => setUserType('teacher')}
          >
            Teacher
          </button>
        </div>

        <div className="login-header">
          <h2>{isStudent ? 'Student Login' : 'Teacher Login'}</h2>
          <p>{isStudent ? 'Access your exams and results' : 'Manage quizzes, exam papers and students'}</p>
        </div>

        <form className="login-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" required />

          <button type="submit" className="login-btn">Log In</button>
        </form>

        <div className="alt-actions">
          <p>
            New {isStudent ? 'student' : 'teacher'}? <a href={isStudent ? '/student-signup' : '/teacher-signup'}>Create an account</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
