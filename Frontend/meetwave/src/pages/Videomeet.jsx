import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "../styles/videocom.css";
import { TextField, Button, Card } from "@mui/material";

const server_url = "http:/localhost:8000";

var connections = {};
const peerConfiqConnections = {};

export default function VideoMeet() {
  var SocketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();
  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState([]);

  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState();
  const [audioPermission, setAudioPermission] = useState(false);
  let [screenAvailable, setScreenAvailable] = useState();

  let [message, setMessage] = useState([]);

  //  let [message,setMessage]=useState("[]");

  let [askForUsername, seAskforUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }
    } catch {}
  };
  const videoPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const usermediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audioAvailable,
        });

        if (usermediaStream) {
          window.localStream = usermediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = usermediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPermissions();
    videoPermissions();
    initializeSocket();
  }, []);

  let getUserMediaSuccess = (stream) => {};

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (video === undefined && audio === undefined) {
      getMedia();
    }
  }, [audio, video]);

  let gotMessageFromServer = (formId, message) => {};

  let addMessage = () => {};
  const initializeSocket = () => {
    SocketRef.current = io(server_url);

    //signal event
    SocketRef.current.on("signal", gotMessageFromServer);

    SocketRef.current.on("connect", () => {
      SocketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = SocketRef.current.id;

      // chat
      SocketRef.current.on("chat-message", addMessage);

      // user left
      SocketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      // user joined
      SocketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfiqConnections,
          );
          connections[socketListId].onicecandate = (event) => {
            if (event.candiate == null) {
              SocketRef.current.emit(
                "siganl",
                socketListId,
                JSON.stringify({ ice: event.candiate }),
              );
            }
          };
          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketId,
            );

            if (videoExists) {
              setVideo((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video,
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsInline: true,
              };
              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };
        });
      });
    });
  };

  let getMedia = () => {
    setAudio(audioAvailable);
    setVideo(audioAvailable);
    initializeSocket();
  };
  let connect = () => {
    seAskforUsername(false);
    getMedia();
  };
  return (
    <div>
      {askForUsername === true ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#0f172a",
          }}
        >
          {askForUsername && (
            <Card
              style={{
                padding: "30px",
                width: "350px",
                textAlign: "center",
                borderRadius: "20px",
                background: "#1e293b",
                color: "white",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Join Video Meet</h2>

              <TextField
                fullWidth
                label="Enter Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  style: { color: "white" },
                }}
                InputLabelProps={{
                  style: { color: "#94a3b8" },
                }}
                style={{ marginBottom: "20px" }}
              />

              <Button
                variant="contained"
                onClick={connect}
                fullWidth
                style={{
                  background: "#6366f1",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                Join Meeting
              </Button>
              <div>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ width: "300px", background: "black" }}
                />
              </div>
            </Card>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
