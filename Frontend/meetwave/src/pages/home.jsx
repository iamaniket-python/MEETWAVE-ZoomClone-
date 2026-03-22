import React from "react";
import Auth from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";


function HomeComponent(){

    let navigate =useNavigate();
    const [meetingCode ,setMetingCode] =useSate("");
    let hanndeljoinVideoCall =async ()=>{
        navigate(`/${meetingCode}`)
    }
    return (
        <div className="home-container">

      {/* HEADER */}
      <div className="home-header">
        <h1>Video Meet</h1>
        <p>Connect with anyone, anywhere 🚀</p>
      </div>

      {/* CARD */}
      <div className="home-card">

        <h2>Join a Meeting</h2>

        <input
          type="text"
          placeholder="Enter Meeting Code"
          value={meetingCode}
          onChange={(e) => setMetingCode(e.target.value)}
        />

        <button onClick={hanndeljoinVideoCall}>
          Join Meeting
        </button>

        <div className="divider">OR</div>

        <button
          className="create-btn"
          onClick={() => navigate(`/${Math.random().toString(36).substring(2, 8)}`)}
        >
          Create New Meeting
        </button>

      </div>

    </div>
  );
}

export default Auth(HomeComponent)