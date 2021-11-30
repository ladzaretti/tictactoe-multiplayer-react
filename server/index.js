const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

// Use cross origins
app.use(cors());

// Set static folder to the build folder
app.use(express.static(path.join(__dirname, "../client/build")));

// run when client connects
io.on("connection", (socket) => {
  let interval;
  console.log("Client connected!");

  interval = setInterval(() => {
    socket.emit("message", { message: new Date() });
  }, 1000);

  socket.on("client", (data, callaback) => {
    console.log(data);
    callaback({
      status: "ok",
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected!");
    clearInterval(interval);
  });
});

// /api endpoint
app.get("/api", (req, res) => {
  res.json({ message: `/api: Server running on port ${PORT}.` });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
