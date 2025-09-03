module.exports = (io, socket) => {
  console.log("💬 Chat handler ready for:", socket.id);

  socket.on("chat_message", (msg) => {
    console.log("📨 Chat:", msg);
    io.emit("chat_message", msg); // broadcast to everyone
  });
};
