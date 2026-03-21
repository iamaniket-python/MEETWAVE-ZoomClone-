import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "../styles/videocom.css";

import { TextField, Button, IconButton, Badge } from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";

const server_url = "http://localhost:8000";

var connections = {};
const peerConfigConnections = {};

export default function VideoMeetComponent() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoRef = useRef();

  const videoRef = useRef([]);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [screen, setScreen] = useState(false);

  const [screenAvailable, setScreenAvailable] = useState(false);

  const [videos, setVideos] = useState([]);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);

  const [showModal, setModal] = useState(true);

  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");

  // ================= PERMISSIONS =================
  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      const videoPerm = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setVideoAvailable(!!videoPerm);

      const audioPerm = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioAvailable(!!audioPerm);

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      window.localStream = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= MEDIA =================
  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    }
  };

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch {}

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      if (window.localStream) {
        connections[id].addStream(window.localStream);
      }

      connections[id].createOffer().then((desc) => {
        connections[id].setLocalDescription(desc).then(() => {
          socketRef.current.emit(
            "signal",
            id,
            JSON.stringify({ sdp: connections[id].localDescription }),
          );
        });
      });
    }
  };

  // ================= SOCKET =================
  const connectToSocketServer = () => {
    socketRef.current = io(server_url);

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current.id;

      const roomId = window.location.pathname;
      socketRef.current.emit("join-call", roomId);

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((prev) => prev.filter((v) => v.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections,
          );

          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            const exists = videoRef.current.find(
              (v) => v.socketId === socketListId,
            );

            if (exists) {
              setVideos((prev) => {
                const updated = prev.map((v) =>
                  v.socketId === socketListId
                    ? { ...v, stream: event.stream }
                    : v,
                );
                videoRef.current = updated;
                return updated;
              });
            } else {
              const newVideo = {
                socketId: socketListId,
                stream: event.stream,
              };
              setVideos((prev) => {
                const updated = [...prev, newVideo];
                videoRef.current = updated;
                return updated;
              });
            }
          };

          if (window.localStream) {
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            connections[id2].createOffer().then((desc) => {
              connections[id2].setLocalDescription(desc).then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({
                    sdp: connections[id2].localDescription,
                  }),
                );
              });
            });
          }
        }
      });
    });
  };

  const gotMessageFromServer = (fromId, message) => {
    let signal;

    try {
      signal = typeof message === "string" ? JSON.parse(message) : message;
    } catch (e) {
      console.log("Invalid JSON:", message);
      return;
    }

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId].createAnswer().then((desc) => {
                connections[fromId].setLocalDescription(desc).then(() => {
                  socketRef.current.emit(
                    "signal",
                    fromId,
                    JSON.stringify({
                      sdp: connections[fromId].localDescription,
                    }),
                  );
                });
              });
            }
          });
      }

      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice));
      }
    }
  };

  // ================= CHAT =================
  const addMessage = (data, sender, senderId) => {
    setMessages((prev) => [...prev, { sender, data }]);

    if (senderId !== socketIdRef.current) {
      setNewMessages((prev) => prev + 1);
    }
  };

  const sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  const connect = () => {
    setAskForUsername(false);
    setVideo(true);
    setAudio(true);
    connectToSocketServer();
  };

  const handleEndCall = () => {
    try {
      localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    } catch {}
    window.location.href = "/";
  };
  // -----------------------------

  const getDisplayMediaSuccess = (stream) => {
    const screenTrack = stream.getVideoTracks()[0];

    // Replace video track in all peers
    for (let id in connections) {
      const sender = connections[id]
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      if (sender) {
        sender.replaceTrack(screenTrack);
      }
    }

    localVideoRef.current.srcObject = stream;

    screenTrack.onended = () => {
      stopScreenShare();
    };
  };

  const getDisplayMedia = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then(getDisplayMediaSuccess)
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (screen) {
      getDisplayMedia();
    }
  }, [screen]);

  const stopScreenShare = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: audio,
    });

    const videoTrack = stream.getVideoTracks()[0];

    for (let id in connections) {
      const sender = connections[id]
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    }

    localVideoRef.current.srcObject = stream;
    window.localStream = stream;

    setScreen(false);
  };

  const handleScreenShare = () => {
    if (screen) {
      stopScreenShare();
    } else {
      setScreen(true);
    }
  };

  //  ui
  return (
    <div className="app-container">
      {askForUsername ? (
        <div className="lobby">
          <h2 className="title">Join Meeting</h2>

          <TextField
            label="Enter your name"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />

          <Button variant="contained" onClick={connect} className="join-btn">
            Join Now
          </Button>

          <video ref={localVideoRef} autoPlay muted className="preview-video" />
        </div>
      ) : (
        <div className="video-container">
          {/* Local Video */}
          <video ref={localVideoRef} autoPlay muted className="local-video" />

          <div className="remote-grid">
            {videos.map((v) => (
              <video
                key={v.socketId}
                ref={(ref) => {
                  if (ref && v.stream) ref.srcObject = v.stream;
                }}
                autoPlay
                className="remote-video"
              />
            ))}
          </div>

          <div className="controls">
            <IconButton
              onClick={() => setVideo(!video)}
              className="control-btn"
            >
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              onClick={() => setAudio(!audio)}
              className="control-btn"
            >
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            <IconButton onClick={handleEndCall} className="end-call">
              <CallEndIcon />
            </IconButton>

            <Badge badgeContent={newMessages} color="primary">
              <IconButton
                onClick={() => setModal(!showModal)}
                className="control-btn"
              >
                <ChatIcon />
              </IconButton>
              <IconButton onClick={handleScreenShare} className="control-btn">
                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
