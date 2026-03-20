import { Server } from "socket.io";

let connections = {};
let messages = {};

let timeOnline = {};

const intializeSocket = (server) => {
  const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
        allowedHeaders:["*"],
        credentials:true

    }
  });

  io.on("connection", (socket) => {
    console.log("Something Connected")
    socket.on("join-call", (path) => {
  if (connections[path] === undefined) {
    connections[path] = [];
  }

  connections[path].push(socket.id);
  timeOnline[socket.id] = new Date();

  for (let user = 0; user < connections[path].length; user++) {
    io.to(connections[path][user]).emit(
      "user-joined",
      socket.id,
      connections[path]
    );
  }

  if (messages[path] !== undefined) {
    for (let user = 0; user < messages[path].length; user++) {
      io.to(socket.id).emit(
        "chat-message",
        messages[path][user]["data"],
        messages[path][user]["sender"],
        messages[path][user]["socket-id-sender"]
      );
    }
  }
});
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });
    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false],
      );

      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
         "socket-id-sender": socket.id,
        });

        //from where the messaging is coming
        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());

      var key;

      for (const [rooms, person] of JSON.parse(
        JSON.parse(JSON.stringify(Object.entries(connections))),
      )) {
        for (let a = 0; a < person.length; ++a) {
          if (person[a] === socket.id) {
            key = rooms;

            for (let a = 0; a < connections[key].length; ++a) {
             io.to(connections[key][a]).emit("user-left", socket.id);
            }
            var index = connections[key].indexOf(socket.id);

            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
    });
  });

  return io;
};

export default intializeSocket;
