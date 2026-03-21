import React, { useRef, useState } from "react";
import { io } from "socket.io-client";
import "../styles/videocom.css";

import { TextField, Button, IconButton, Badge } from "@mui/material";
// import VideocamIcon from "@mui/icons-material/Videocam";
// import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// import MicIcon from "@mui/icons-material/Mic";
// import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";

const server_url = "http://localhost:8000";

const connections = {};
const peerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const socketRef = useRef(null);
  const socketIdRef = useRef(null);
  const localVideoRef = useRef(null);

  const [videos, setVideos] = useState([]);
  const [screen, setScreen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);

  const [showModal, setModal] = useState(false);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");

  // ================= SOCKET =================
  const connectToSocketServer = () => {
    if (socketRef.current) return;

    socketRef.current = io(server_url);

    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current.id;

      socketRef.current.emit("join-call", window.location.pathname);

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          if (connections[socketListId]) return;

          const peer = new RTCPeerConnection(peerConfig);
          connections[socketListId] = peer;

          // ICE
          peer.onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // TRACK
          peer.ontrack = (event) => {
            const stream = event.streams[0];

            setVideos((prev) => {
              const exists = prev.find(
                (v) => v.socketId === socketListId
              );
              if (exists) return prev;

              return [...prev, { socketId: socketListId, stream }];
            });
          };

          // ADD LOCAL STREAM
          window.localStream.getTracks().forEach((track) => {
            peer.addTrack(track, window.localStream);
          });
        });

        // SEND OFFER
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            connections[id2].createOffer().then((desc) => {
              connections[id2].setLocalDescription(desc).then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: desc })
                );
              });
            });
          }
        }
      });

      socketRef.current.on("signal", async (fromId, message) => {
        const signal = JSON.parse(message);
        const peer = connections[fromId];

        if (signal.sdp) {
          await peer.setRemoteDescription(
            new RTCSessionDescription(signal.sdp)
          );

          if (signal.sdp.type === "offer") {
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);

            socketRef.current.emit(
              "signal",
              fromId,
              JSON.stringify({ sdp: answer })
            );
          }
        }

        if (signal.ice) {
          peer.addIceCandidate(new RTCIceCandidate(signal.ice));
        }
      });

      socketRef.current.on("chat-message", (data, sender, senderId) => {
        setMessages((prev) => [...prev, { sender, data }]);

        if (senderId !== socketIdRef.current) {
          setNewMessages((prev) => prev + 1);
        }
      });

      socketRef.current.on("user-left", (id) => {
        setVideos((prev) => prev.filter((v) => v.socketId !== id));
      });
    });
  };

  // ================= JOIN =================
  const connect = async () => {
    setAskForUsername(false);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    window.localStream = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    connectToSocketServer();
  };

  // ================= CHAT =================
  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  // ================= SCREEN SHARE =================
  const handleScreenShare = async () => {
    if (!screen) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const screenTrack = stream.getVideoTracks()[0];

      for (let id in connections) {
        const sender = connections[id]
          .getSenders()
          .find((s) => s.track.kind === "video");

        if (sender) sender.replaceTrack(screenTrack);
      }

      localVideoRef.current.srcObject = stream;

      screenTrack.onended = async () => {
        const camStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        window.localStream = camStream;

        localVideoRef.current.srcObject = camStream;

        for (let id in connections) {
          const sender = connections[id]
            .getSenders()
            .find((s) => s.track.kind === "video");

          if (sender) {
            sender.replaceTrack(camStream.getVideoTracks()[0]);
          }
        }

        setScreen(false);
      };

      setScreen(true);
    }
  };

  // ================= END CALL =================
  const handleEndCall = () => {
    window.location.href = "/";
  };

  // ================= UI =================
  return (
    <div className="app-container">
      {askForUsername ? (
        <div className="lobby">
          <h2>Join Meeting</h2>

          <TextField
            label="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button variant="contained" onClick={connect}>
            Join
          </Button>

          <video ref={localVideoRef} autoPlay muted />
        </div>
      ) : (
        <div className="video-container">
          {/* CHAT */}
          {showModal && (
            <div className="chat-box">
              {messages.map((m, i) => (
                <div key={i}>
                  <b>{m.sender}:</b> {m.data}
                </div>
              ))}
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          )}

          {/* VIDEO */}
          <video ref={localVideoRef} autoPlay muted />

          <div className="remote-grid">
            {videos.map((v) => (
              <video
                key={v.socketId}
                ref={(ref) => {
                  if (ref && v.stream) ref.srcObject = v.stream;
                }}
                autoPlay
              />
            ))}
          </div>

          {/* CONTROLS */}
          <div className="controls">
            <IconButton onClick={() => setModal(!showModal)}>
              <Badge badgeContent={newMessages}>
                <ChatIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleScreenShare}>
              {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>

            <IconButton onClick={handleEndCall}>
              <CallEndIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}