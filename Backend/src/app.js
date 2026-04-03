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
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/v1/users", userRoutes);


app.get("/home", (req, res) => {
  return res.json({ hello: "aniket" });
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://aniketsrivastava57_db_user:Shriradha@cluster0.2qsle1e.mongodb.net/zoomProject"
    );

    console.log("MongoDB Connected");

    server.listen(app.get("port"), () => {
      console.log("Server running on 8000");
    });

  } catch (error) {
    console.log("MongoDB ERROR:", error.message);


    server.listen(app.get("port"), () => {
      console.log("Server running without DB on 8000");
    });
  }
};

start();
