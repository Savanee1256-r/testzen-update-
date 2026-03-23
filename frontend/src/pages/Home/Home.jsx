import React from 'react'
import HomePage from '../../assets/HomePage.jpeg'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <div className="herosection" style={{ backgroundImage: `url(${HomePage})` }}>
        <div className="hero-content">
          
          <h1>Welcome to TestZen</h1>
          <p className="subtitle">
            Create, manage, and take exams smoothly with a modern, secure interface.
          </p>
          <button className="hero-btn" ><a href='/login'>Get Started</a></button>
        </div>
      </div>

     
    </div>
  )
}

export default Home
