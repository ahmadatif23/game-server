const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const unoHandler = require("./handlers/uno");
const ticTacToeHandler = require("./handlers/ticTacToe");
const chatHandler = require("./handlers/chat");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  unoHandler(io, socket);

  // Register feature handlers
  // ticTacToeHandler(io, socket);
  // chatHandler(io, socket);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Running on ${PORT}`));
