import React from "react";
import "../App.css";
import { Link, Router, useNavigate } from "react-router-dom";
function HomePage() {

  const Router =useNavigate();
  return (
    <div className="HomepageContainer">
      <nav>
        <div className="navbar">
          <div className="logo">🌍</div>

          <div className="nav-links">
            <a onClick={()=>{
              Router("/nckn")
            }} >Join as Guest</a>
          </div>

          <button onClick={()=>{
              Router("/register")
            }} className="email-btn">Register</button>
          <button onClick={()=>{
              Router("/signin")
            }} className="login-btn">Login</button>
        </div>
        <div className="hero">
          <div className="hero-left">
            <h1>
              <span className="orange">Connect with your loved Ones</span>
            </h1>

            <p>
              <div role="button">
                <Link to="#" className="highlight">
                  Video Call
                </Link>
              </div>
            </p>
          </div>

          <div className="hero-right">
            <img
              src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39"
              alt="video-call"
            />
          </div>
          <div className="hero-left">
            <img
              src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39"
              alt="video-call"
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HomePage;
