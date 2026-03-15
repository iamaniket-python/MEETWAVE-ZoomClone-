import { Server } from "socket.io";

let connections ={}
let messages ={}

let timeOnline={}


const intializeSocket = (server)=>{
    const io = new Server(server);


    io.on("connections",(socket)=>{
        socket.on("accept-call",(path)=>{

            if(connections[path] === undefined){
                connections[path] =[]
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] =new Date();


            for(let user=0; user<connections[path].length; user++){
                io.to(connections[path][a]).emit("user-joined")
            }

        })
        socket.on("signal",(toId,message)=>{
            io.to(toId).emit("singal",socket.id,message);
        })
        socket.on("chat-message", (data,sender)=>{

        })

        socket.on("disconnect",()=>{

        })
    })

    return io;
}

export default intializeSocket;