import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";
import mongoose from "mongoose";

import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import  intializeSocket  from "./controllers/SocketManager.js"

const app = express();
const server = createServer(app);
const io =intializeSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({limit : "40kb"}));
app.use(express.urlencoded({ limit : '40kb', extended: true}));

app.use("/api/v1/users", userRoutes);


app.get("/home", (req, res) => {
  return res.json({ hello: "aniket" });
});

const start = async () => {
  app.set("mongo_user");
  const connectionDb = await mongoose.connect(
      "mongodb+srv://aniketsrivastava57_db_user:Shriradha@cluster0.2qsle1e.mongodb.net/zoomProject"
    );
  console.log(`MONGO CONNECTED HOST: ${connectionDb.connection.host}`)
  server.listen(app.get("port"), () => {
    console.log("Listing port 8000");
  });
};


start();
