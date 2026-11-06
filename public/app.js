const socket = io();
const character = document.getElementById("character");
const bubble = document.getElementById("bubble");

function react(type, message) {
  character.classList.remove("react-like", "react-gift");
  void character.offsetWidth;
  character.classList.add(type === "gift" ? "react-gift" : "react-like");
  bubble.textContent = message;
}

socket.on("character-reaction", (event) => {
  react(event.type, event.message);
});

document.getElementById("likeBtn").addEventListener("click", () => {
  socket.emit("test-like");
});

document.getElementById("giftBtn").addEventListener("click", () => {
  socket.emit("test-gift");
});
