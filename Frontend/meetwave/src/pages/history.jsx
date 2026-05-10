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
        console.log("TYPE:", typeof data, "VALUE:", data);

        // Handle different response shapes
        if (Array.isArray(data)) {
          setMeetings(data);
        } else if (data?.meetings) {
          setMeetings(data.meetings);
        } else if (data?.data) {
          setMeetings(data.data);
        } else {
          setMeetings([]);
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

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
            <Card className="history-card" key={item?.meetingCode || item?._id || index}>
              <CardMedia
                component="img"
                height="140"
                image="https://picsum.photos/seed/meeting/400/200"
                alt="Meeting"
              />

              <CardContent>
                <Typography className="card-title" variant="h6">
                  Meeting #{index + 1}
                </Typography>

                <Typography className="card-text" variant="body2">
                  Code: {item?.meetingCode || "N/A"}
                </Typography>

                <Typography className="card-text" variant="body2">
                  Date:{" "}
                  {item?.date
                    ? new Date(item.date).toLocaleDateString()
                    : "N/A"}
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