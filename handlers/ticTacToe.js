let game = { board: Array(9).fill(null), turn: "X" };

module.exports = (io, socket) => {
  console.log("🎮 TicTacToe handler ready for:", socket.id);

  socket.emit("game_state", game);

  socket.on("make_move", (index) => {
    if (game.board[index] === null && game.turn) {
      game.board[index] = game.turn;
      game.turn = game.turn === "X" ? "O" : "X";
      io.emit("game_state", game);
    }
  });

  socket.on("reset_game", () => {
    game = { board: Array(9).fill(null), turn: "X" };
    io.emit("game_state", game);
  });
};
