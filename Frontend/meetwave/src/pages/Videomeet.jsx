import React, { use, useState } from "react";

const server_url = "http:/localhost:8000";

var connections = {};
const peerConfiqConnections = {};

export default function VideoMeet() {
  var SocketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = userRef();
  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState();

  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState();

  let [screenAvailable, setScreenAvailable] = useState();

  let [message, setMessage] = useState([]);

  //  let [message,setMessage]=useState("[]");

  let [askForUsername, seAskforUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  return(
<div>
    
</div>
  ) 
}
