const { io } = require("../server");
const { Users } = require("../classes/users");
const { createMessage } = require("../utils/utils");

const users = new Users();

io.on("connection", (client) => {
  client.on("enterChat", (user, callback) => {
    if (!user.name || !user.room) {
      return callback({
        ok: false,
        msg: "You must provide username/room",
      });
    }

    client.join(user.room);

    users.addPerson(client.id, user.name, user.room);
    client.broadcast.to(user.room).emit("personsList", users.getPersonsByRoom(user.room));
    client.broadcast.to(user.room).emit("createMessage", createMessage(user.name, `${user.name} has joined us`));
    callback(users.getPersonsByRoom(user.room));
  });

  client.on("disconnect", () => {
    let removedPerson = users.removePerson(client.id);
    client.broadcast
      .to(removedPerson.room)
      .emit("createMessage", createMessage("Admin", `${removedPerson.name} leave the chat`));
    client.broadcast.to(removedPerson.room).emit("personsList", users.getPersonsByRoom(removedPerson.room));
  });

  client.on("sendMessage", (data, callback) => {
    let person = users.getPerson(client.id);
    let msg = createMessage(person.name, data.message);
    client.broadcast.to(person.room).emit("createMessage", msg);
    callback(msg);
  });

  client.on("privateMessage", (data) => {
    let person = users.getPerson(client.id);
    client.broadcast.to(data.to).emit("privateMessage", createMessage(person.name, data.message));
  });
});
