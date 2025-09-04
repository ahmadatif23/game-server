const {
  getUsersInRoom,
  addUser,
  getUser,
  removeUser,
} = require("../utils/users");

module.exports = (io, socket) => {
  socket.on("join", (payload, callback) => {
    let numberOfUsersInRoom = getUsersInRoom(payload.room).length;

    const { error, newUser } = addUser({
      id: socket.id,
      name: numberOfUsersInRoom === 0 ? "Player 1" : "Player 2",
      room: payload.room,
    });

    if (error) return callback(error);
    socket.join(newUser.room);

    io.to(newUser.room).emit("roomData", {
      room: newUser.room,
      users: getUsersInRoom(newUser.room),
    });

    socket.emit("currentUserData", { name: newUser.name });

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
