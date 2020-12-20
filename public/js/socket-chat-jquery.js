let params = new URLSearchParams(window.location.search);

let container = $("#divUsuarios");
let formEnviar = $("#form-enviar");
let input = $("#messageInput");
let chatBox = $("#divChatbox");

// Funciones para renderizar usuarios
function renderUsers(users) {
  console.log(users);

  let html = "";
  html += "<li>";
  html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + params.get("sala") + "</span></a>";
  html += "</li>";

  users.forEach((element) => {
    html += "<li>";
    html += '<a data-id="' + element.id + '" href="javascript:void(0)">';
    html += '<img src="assets/images/users/1.jpg" alt="user-img" class="img-circle" />';
    html += "<span>";
    html += element.name;
    html += '<small class="text-success">online</small>';
    html += "</span>";
    html += "</a>";
    html += "</li>";
  });

  container.html(html);
}

// Listeners
container.on("click", "a", function () {
  let id = $(this).data("id");
  if (id) {
    console.log(id);
  }
});

formEnviar.on("submit", function (e) {
  console.log("here");
  e.preventDefault();
  if (input.val().trim().length === 0) {
    return;
  }

  socket.emit("sendMessage", { message: input.val() }, (resp) => {
    input.val("").focus();
    renderMessages(resp, true);
    scrollBottom();
  });
});

function renderMessages(msg, me) {
  let html = "";
  let date = new Date(msg.date);
  let hour = date.getHours();
  let adminClass = msg.name === "Admin" ? "danger" : "info";

  html += `<li class="animated fadeIn ${(me && "") || (!me && "reverse")}">`;
  html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
  html += '<div class="chat-content">';
  html += "<h5>" + msg.name + "</h5>";
  html += `<div class="box bg-light-${adminClass}">`;
  html += msg.message;
  html += "</div>";
  html += "</div>";
  html += ' <div class="chat-time">' + hour + "</div>";
  html += "</li>";

  chatBox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = chatBox.children("li:last-child");

  // heights
  var clientHeight = chatBox.prop("clientHeight");
  var scrollTop = chatBox.prop("scrollTop");
  var scrollHeight = chatBox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    chatBox.scrollTop(scrollHeight);
  }
}
