import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="HomepageContainer">
      <nav>
        <div className="navbar">
          <div className="logo">🌍</div>

          <div className="nav-links">
            <a onClick={() => navigate("/nckn")}>Join as Guest</a>
          </div>

          <button onClick={() => navigate("/register")} className="email-btn">
            Register
          </button>
          <button onClick={() => navigate("/signin")} className="login-btn">
            Login
          </button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-left">
          <h1>
            <span className="orange">Connect with your loved Ones</span>
          </h1>

          <div role="button">
            <Link to="#" className="highlight">
              Video Call
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39"
            alt="video-call"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;