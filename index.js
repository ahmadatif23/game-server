const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or your Vercel domain
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.emit("server_welcome", "Connected to Socket.IO server");

  socket.on("chat_message", (msg) => {
    console.log("📨 Message:", msg);
    io.emit("chat_message", msg); // broadcast to everyone
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`🚀 Running on ${PORT}`));
