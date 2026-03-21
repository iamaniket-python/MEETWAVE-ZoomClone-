import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

const intializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join-call", (path) => {
      if (!connections[path]) {
        connections[path] = [];
      }
      if (!connections[path].includes(socket.id)) {
        connections[path].push(socket.id);
      }

      timeOnline[socket.id] = new Date();
      connections[path].forEach((id) => {
        io.to(id).emit("user-joined", socket.id, connections[path]);
      });
      if (messages[path]) {
        messages[path].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg["socket-id-sender"],
          );
        });
      }
    });
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });
    socket.on("chat-message", (data, sender) => {
      let roomKey = null;
      for (let key in connections) {
        if (connections[key].includes(socket.id)) {
          roomKey = key;
          break;
        }
      }

      if (roomKey) {
        if (!messages[roomKey]) {
          messages[roomKey] = [];
        }

        const msgData = {
          sender,
          data,
          "socket-id-sender": socket.id,
        };

        messages[roomKey].push(msgData);
        connections[roomKey].forEach((id) => {
          io.to(id).emit("chat-message", data, sender, socket.id);
        });
      }
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      let roomKey = null;
      for (let key in connections) {
        if (connections[key].includes(socket.id)) {
          roomKey = key;
          break;
        }
      }

      if (roomKey) {
        connections[roomKey].forEach((id) => {
          io.to(id).emit("user-left", socket.id);
        });
        connections[roomKey] = connections[roomKey].filter(
          (id) => id !== socket.id,
        );

        if (connections[roomKey].length === 0) {
          delete connections[roomKey];
          delete messages[roomKey];
        }
      }

      delete timeOnline[socket.id];
    });
  });

  return io;
};

export default intializeSocket;
