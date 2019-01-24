import * as Input from "../util/Input";
import * as Render from "../util/Render";
import * as Chat from "../util/Chat";

export const onLoginSubmit = (socket) => {
  document.querySelector("#login-form").addEventListener("submit", e => {
    e.preventDefault();
    let name = Input.clean(
      $("#l")
        .val()
        .trim()
    );
    if (!Input.isValid(name)) {
      alert(`Invalid username "${name}"`);
      return false;
    }
    $("#login-screen").hide();
    
    socket.user.login(name);

    Render.UI(socket);
    socket.emit("login", { username: name });
  });
};

export const onEnterRoomSubmit = (socket) => {
  document.querySelector("#enter-room-form").addEventListener("submit", e => {
    e.preventDefault();
    let username = socket.user.getUsername();
    let roomName = Input.clean(
      $("#er")
        .val()
        .trim()
    );
    if (Input.isValid(roomName)) {
      socket.emit("enter room", { username , roomName });
    }
    return false;
  })
}

export const onCreateRoomSubmit = (socket) => {
  document.querySelector("#create-room-form").addEventListener("submit", e => {
    e.preventDefault();
    let username = socket.user.getUsername();
    let roomName = Input.clean(
      $("#cr")
        .val()
        .trim()
    );
    if (Input.isValid(roomName)) {
      socket.emit("create room", { username, roomName });
    } else {
      alert("invalid room name");
    }
    return false;
  });
}

export const onLeaveRoom = (socket) => {
  document.querySelector("#leave-room").addEventListener("click", e => {
    let username = socket.user.getUsername();
    let room = socket.user.getRoom();
    if (room === "") return false;
    socket.emit("leave room", { username, room });
    socket.user.reset();
    $("#room-screen").show();
    Chat.clearChat();
    return false;
  });
}

export const onError = socket => {
  socket.on("invalid", e => alert(e.error));
  socket.on("disconnect", () => {
    alert("You have been disconnected.");
  });
  socket.on("reconnect", () => (window.location = "/"));
};

/*$("#login-form").submit(e => {
  e.preventDefault();
  let name = Input.clean(
    $("#l")
      .val()
      .trim()
  );
  if (!Input.isValid(name)) {
    return false;
  }
  $("#login-screen").hide();
  username = name;
  RENDER.UI();
  socket.emit("login", { username });
});

$("#enter-room-form").submit(e => {
  e.preventDefault();
  let roomName = Input.clean(
    $("#er")
      .val()
      .trim()
  );
  if (Input.isValid(roomName)) {
    socket.emit("enter room", { username, roomName });
    // SHOW SOME SPINNER
  }
  return false;
});

$("#create-room-form").submit(e => {
  e.preventDefault();
  let roomName = Input.clean(
    $("#cr")
      .val()
      .trim()
  );
  if (Input.isValid(roomName)) {
    // Creating room logic here
    socket.emit("create room", { username, roomName });
    // SHOW SOME SPINNER
  } else {
    alert("invalid room name");
  }
  return false;
});

socket.on("invalid", e => alert(e.error));
socket.on("disconnect", () => {
  alert("You have been disconnected.");
});
socket.on("reconnect", () => (window.location = "/"));*/
