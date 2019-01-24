
export const addMessage = (name, message, broadcast = false, socket) => {
  if (socket.user.getUsername() === "") console.warn("Chat.addMessage(): empty username");
  if (name === "") console.warn("Chat.addMessage(): empty name");
  if (message === "") console.warn("Chat.addMessage(): empty message");
  const chatContainer = document.querySelector(".chat-container");
  const div = document.createElement("DIV");
  const span = document.createElement("SPAN");
  const text = document.createTextNode(message);
  span.textContent = name + " ";
  span.className = name === socket.user.getUsername() && !broadcast ? "blue-text" : "red-text";
  if (name === "@") span.className = "grey-text";
  div.appendChild(span);
  div.appendChild(text);
  div.className = "animated fadeIn fastest chat-message";
  chatContainer.appendChild(div);
  chatContainer.scrollTop += 1000;
};

export const clearChat = () => {
  const chatContainer = document.querySelector(".chat-container");
  while (chatContainer.firstChild) {
    chatContainer.removeChild(chatContainer.firstChild);
  }
}

// clearChat()