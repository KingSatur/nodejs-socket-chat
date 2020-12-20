let socket = io();

if (!params.has("nombre") || !params.has("sala")) {
  window.location = "index.html";
  throw new Error("The has not been provided");
}

let user = {
  name: params.get("nombre"),
  room: params.get("sala"),
};

socket.on("connect", function () {
  //   console.log("Conectado al servidor");
  socket.emit("enterChat", user, (resp) => {
    // console.log(resp);
    console.log(resp);
    renderUsers(resp);
  });
});

socket.on("createMessage", (msg) => {
  renderMessages(msg, false);
  scrollBottom();
});

socket.on("personsList", (list) => {
  renderUsers(list);
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

socket.on("privateMessage", (msg) => {
  console.log("Mensaje privado", msg);
});
