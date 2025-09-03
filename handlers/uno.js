module.exports = (io, socket) => {
  console.log("🃏 Uno handler ready for:", socket.id);

  // example event
  socket.on("uno_play_card", (card) => {
    console.log("Card played:", card);
    io.emit("uno_update", { card, player: socket.id });
  });
};
