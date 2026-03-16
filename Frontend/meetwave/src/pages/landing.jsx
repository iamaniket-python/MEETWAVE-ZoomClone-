import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
function HomePage() {
  return (
    <div className="HomepageContainer">
      <nav>
        <div className="navbar">
          <div className="logo">🌍</div>

          <div className="nav-links">
            <a href="#">Join as Guest</a>
          </div>

          <button className="email-btn">Register</button>
          <button className="login-btn">Login</button>
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
