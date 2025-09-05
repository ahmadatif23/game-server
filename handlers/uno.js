const {
  getUsersInRoom,
  addUser,
  getUser,
  removeUser,
} = require("../utils/users");

module.exports = (io, socket) => {
  socket.on("join", (payload, callback) => {
    const usersInRoom = getUsersInRoom(payload.room);

    let role;
    if (!usersInRoom.find((u) => u.role === "player1")) {
      role = "player1";
    } else if (!usersInRoom.find((u) => u.role === "player2")) {
      role = "player2";
    }

    const { error, newUser } = addUser({
      id: socket.id,
      name: payload.playerName,
      role,
      room: payload.room,
    });

    if (error) return callback(error);
    socket.join(newUser.room);

    io.to(newUser.room).emit("roomData", {
      room: newUser.room,
      users: getUsersInRoom(newUser.room),
    });

    // find opponent
    const opponent = getUsersInRoom(newUser.room).find(
      (u) => u.id !== newUser.id
    );

    // send current user their data + opponent (if exists)
    socket.emit("currentUserData", {
      role: newUser.role,
      opponentName: opponent ? opponent.name : null,
    });

    // if opponent exists, also send them the new user's name
    if (opponent) {
      io.to(opponent.id).emit("currentUserData", {
        role: opponent.role,
        opponentName: newUser.name,
      });
    }

    callback();
  });

  socket.on("initGameState", (gameState) => {
    const user = getUser(socket.id);

    if (user) io.to(user.room).emit("initGameState", gameState);
  });

  socket.on("updateGameState", (gameState) => {
    const user = getUser(socket.id);

    if (user) io.to(user.room).emit("updateGameState", gameState);
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user)
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
  });
};
