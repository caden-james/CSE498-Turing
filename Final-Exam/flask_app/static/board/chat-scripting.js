var socket;

function openForm() {
  document.getElementById("myForm").style.display = "block";
  document.getElementById("open").style.display = "none";

  // Set up chat

  $(document).ready(function () {
    socket = io.connect(
      "https://" + document.domain + ":" + location.port + "/openboard"
    );
    socket.on("connect", function () {
      socket.emit("joined", {});
    });

    socket.on("status", function (data) {
      let tag = document.createElement("div");
      let text = document.createTextNode(data.msg);
      let element = document.getElementById("chat");
      tag.appendChild(text);
      console.log(data);
      tag.style.cssText = data.style;
      element.appendChild(tag);
      $("#chat").scrollTop($("#chat")[0].scrollHeight);
    });
  });
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("open").style.display = "block";

  socket.emit("leaving", {}, function () {
    // Disconnect socket
    socket.disconnect();
  });
}

var chat = document.getElementById("chat");
chat.scrollTop = chat.scrollHeight - chat.clientHeight;

const messagebox = document.getElementById("chat-message-box");
const chat_chatbox = document.getElementById("chat");
const submitButton = document.getElementById("submit-button");

//handle sending message
messagebox.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 && messagebox.value != "") {
    // Grab message and reset message box
    msg = messagebox.value;
    messagebox.value = "";
    // send message
    socket.emit("sending", { msg: msg });
  }
});

//handle sending message
submitButton.addEventListener("click", (e) => {
  if (messagebox.value != "") {
    // Grab message and reset message box
    msg = messagebox.value;
    messagebox.value = "";

    // send message
    socket.emit("sending", { msg: msg });
  }
});
