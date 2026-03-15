import { Server } from "socket.io";

let connections = {};
let messages = {};

let timeOnline = {};

const intializeSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    socket.on("accept-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      for (let user = 0; user < connections[path].length; user++) {
        io.to(connections[path][user]).emit("user-joined");
      }

      if (messages[path] === undefined) {
        for (let user = 0; user < connections[path].length; user++) {
          io.to(socket.id).emit(
            "chat-message",
            message[path][user]["data"],
            messages[path][user]["sender"],
            messages[path][user]["socket-id-sender"],
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
  
    if (found === true){
        if (messages[matchingRoom] === undefined){
            messages[matchingRoom]=[]
        }
        messages[matchingRoom].push({'sender': sender,'data':data, "socket-id-sender":
            console.log("message",key,":",sender,data)})

          //from where the messaging is coming
        connections[matchingRoom].forEach((elem)=>{
            io.to(elem).emit("chat-message",data,sender,socket.id)
        })
        
        }
    
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export default intializeSocket;
