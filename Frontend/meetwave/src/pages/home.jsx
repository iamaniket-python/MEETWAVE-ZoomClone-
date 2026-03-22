import React, { useContext, useState } from "react";
import Auth from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { AuthContext } from "../contexts/Authcontext";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  

  const {addToUserHistory} =useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode)
    navigate(`/${meetingCode}`);
  };

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
          onChange={(e) => setMeetingCode(e.target.value)}
        />

        <button onClick={handleJoinVideoCall}>Join Meeting</button>

        <div className="divider">OR</div>

        <button
          className="create-btn"
          onClick={() =>
            navigate(`/${Math.random().toString(36).substring(2, 8)}`)
          }
        >
          Create New Meeting
        </button>
      </div>
    </div>
  );
}

export default HomeComponent;
