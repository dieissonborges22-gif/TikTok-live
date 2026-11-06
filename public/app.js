const socket = io();
const character = document.getElementById("character");
const bubble = document.getElementById("bubble");
const mouth = document.getElementById("mouth");
const voiceBtn = document.getElementById("voiceBtn");
let voiceEnabled = true;
let speechTimer;

function speak(message) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "pt-BR";
  utterance.rate = 1;
  utterance.pitch = 1.12;
  const voices = window.speechSynthesis.getVoices();
  const portugueseVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt-br"))
    || voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt"));
  if (portugueseVoice) utterance.voice = portugueseVoice;
  utterance.onstart = () => mouth.classList.add("talking");
  utterance.onend = () => mouth.classList.remove("talking");
  utterance.onerror = () => mouth.classList.remove("talking");
  window.speechSynthesis.speak(utterance);
}

function react(type, message) {
  character.classList.remove("react-like", "react-gift");
  void character.offsetWidth;
  character.classList.add(type === "gift" ? "react-gift" : "react-like");
  bubble.textContent = message;
  speak(message);
}

socket.on("character-reaction", event => {
  react(event.type, event.message);
});

document.getElementById("likeBtn").addEventListener("click", () => {
  socket.emit("test-like");
});
document.getElementById("giftBtn").addEventListener("click", () => {
  socket.emit("test-gift");
});

voiceBtn.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  if (!voiceEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
  voiceBtn.textContent = voiceEnabled ? "🔊 Voz ativada" : "🔇 Voz desligada";
  voiceBtn.classList.toggle("muted", !voiceEnabled);
  voiceBtn.setAttribute("aria-pressed", String(voiceEnabled));
  if (voiceEnabled) speak("Minha voz está ativada!");
});

if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
