import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Authcontext";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import "../styles/history.css";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistoryOfUser();
        console.log("FULL RESPONSE:", data); 
        setMeetings(data || []);
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <Button className="back-btn" onClick={() => navigate("/home")}>
        ⬅ Back to Home
      </Button>

      <h1 className="history-title">📜 Meeting History</h1>

      <div className="history-grid">
        {meetings.length === 0 ? (
          <p className="no-data">No meetings found</p>
        ) : (
          meetings.map((item, index) => (
            <Card className="history-card" key={index}>
              <CardMedia
                className="card-image"
                image="https://source.unsplash.com/featured/?meeting"
              />

              <CardContent>
                <Typography className="card-title">
                  Meeting #{index + 1}
                </Typography>

                <Typography className="card-text">
                  Code: {item?.meetingCode}
                </Typography>

                <Typography className="card-text">
                  Date: {item?.date}
                </Typography>
              </CardContent>

              <CardActions className="card-actions">
                <Button
                  size="small"
                  className="join-btn"
                  onClick={() => navigate(`/${item?.meetingCode}`)}
                >
                  Join Again
                </Button>

                <Button size="small" className="details-btn">
                  Details
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}