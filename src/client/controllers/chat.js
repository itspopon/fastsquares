import * as Chat from "../util/Chat";
import * as Input from "../util/Input";

export const onChatSubmit = socket => {
  document.querySelector("#chat-form").addEventListener("submit", e => {
    let username = socket.user.getUsername();
    let room = socket.user.getRoom();

    e.preventDefault(); // prevents page reloading
    let message = Input.clean(
      $("#m")
        .val()
        .trim()
    );
    // If the user is playing, blur the input after submiting
    if (!socket.user.isSpectator() && room !== "") {
      document.querySelector("#m").blur();
    }
    if (!message) {
      return false;
    }
    socket.emit("chat message", { username, message });
    if (message[0] !== "/") Chat.addMessage(username, message, false, socket);
    $("#m").val("");
    return false;
  });
};

export const onNewMessage = socket => {
  socket.on("new message", data => {
    let { username, message } = data;
    Chat.addMessage(username, message, true, socket);
  });
};
