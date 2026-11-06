const socket = io();
const character = document.getElementById("character");
const bubble = document.getElementById("bubble");
const mouth = document.getElementById("mouth");
const voiceBtn = document.getElementById("voiceBtn");
const voiceSelect = document.getElementById("voiceSelect");
const voiceStatus = document.getElementById("voiceStatus");
let voiceEnabled = true;
let voices = [];

const isPortuguese = voice => (voice.lang || "").toLowerCase().startsWith("pt");
const seemsFemale = voice => /female|woman|francisca|thalita|luciana|camila|maria|fernanda|bruna|vitoria|leticia|helena|sofia|gabriela/i.test(voice.name || "");

function loadVoices() {
  if (!("speechSynthesis" in window)) {
    voiceStatus.textContent = "Este navegador não oferece voz sintetizada.";
    return;
  }
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  const portuguese = voices.filter(isPortuguese);
  (portuguese.length ? portuguese : voices).forEach(voice => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = voice.name + (isPortuguese(voice) ? " (PT)" : "");
    voiceSelect.appendChild(option);
  });
  const preferred = portuguese.find(seemsFemale) || portuguese[0] || voices.find(seemsFemale) || voices[0];
  if (preferred) voiceSelect.value = preferred.name;
  voiceStatus.textContent = preferred ? "Voz selecionada: " + preferred.name : "Instale/ative uma voz no Windows para ouvir o personagem.";
}

function speak(message) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  const selected = voices.find(voice => voice.name === voiceSelect.value);
  if (selected) { utterance.voice = selected; utterance.lang = selected.lang; }
  else utterance.lang = "pt-BR";
  utterance.rate = 0.96;
  utterance.pitch = 1.18;
  utterance.onstart = () => mouth.classList.add("talking");
  utterance.onend = utterance.onerror = () => mouth.classList.remove("talking");
  speechSynthesis.speak(utterance);
}

function react(type, message) {
  character.classList.remove("react-like", "react-gift", "react-join");
  void character.offsetWidth;
  character.classList.add(type === "gift" ? "react-gift" : type === "join" ? "react-join" : "react-like");
  bubble.textContent = message;
  speak(message);
}

socket.on("character-reaction", event => react(event.type, event.message));
socket.on("live-stats", stats => {
  const fields = { likes: "statLikes", comments: "statComments", gifts: "statGifts", followers: "statFollowers", shares: "statShares", viewers: "statViewers" };
  Object.entries(fields).forEach(([key, id]) => { document.getElementById(id).textContent = Number(stats[key] || 0).toLocaleString("pt-BR"); });
});

document.getElementById("likeBtn").onclick = () => socket.emit("test-like");
document.getElementById("giftBtn").onclick = () => socket.emit("test-gift");
document.getElementById("joinBtn").onclick = () => socket.emit("test-join");
document.getElementById("testChatBtn").onclick = () => socket.emit("test-chat", document.getElementById("testComment").value || "Oi, tudo bem?");
document.getElementById("testComment").addEventListener("keydown", event => { if (event.key === "Enter") document.getElementById("testChatBtn").click(); });

voiceBtn.onclick = () => {
  voiceEnabled = !voiceEnabled;
  if (!voiceEnabled && "speechSynthesis" in window) speechSynthesis.cancel();
  voiceBtn.textContent = voiceEnabled ? "🔊 Voz ativada" : "🔇 Voz desligada";
  if (voiceEnabled) speak("Oii, chat!");
};
voiceSelect.onchange = () => speak("Oi! Essa é minha voz.");
document.getElementById("connectBtn").onclick = () => {
  document.getElementById("connectionStatus").textContent = "Conectando...";
  socket.emit("connect-live", document.getElementById("usernameInput").value);
};
document.getElementById("disconnectBtn").onclick = () => socket.emit("disconnect-live");
document.getElementById("autoReplyToggle").onchange = event => socket.emit("toggle-auto-reply", event.target.checked);
document.getElementById("aiToggle").onchange = event => socket.emit("toggle-ai", event.target.checked);
socket.on("ai-status", status => {
  document.getElementById("aiToggle").checked = status.enabled;
  document.getElementById("aiStatus").textContent = status.configured
    ? "Gemini configurado. A IA será usada quando estiver ativada."
    : "Sem chave Gemini: respostas locais gratuitas continuam funcionando.";
});
socket.on("live-status", status => {
  document.getElementById("connectionStatus").textContent = status.error || (status.connected ? "Conectado à LIVE de @" + status.username : "Desconectado");
  document.getElementById("connectBtn").disabled = Boolean(status.connected);
});
socket.on("auto-reply-status", enabled => { document.getElementById("autoReplyToggle").checked = enabled; });
socket.on("chat-comment", comment => {
  const line = document.createElement("p");
  line.textContent = "@" + comment.nickname + ": " + comment.comment;
  const feed = document.getElementById("chatFeed");
  if (feed.textContent.includes("Os comentários aparecerão")) feed.textContent = "";
  feed.prepend(line);
  while (feed.children.length > 6) feed.lastChild.remove();
});

if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
  setTimeout(loadVoices, 700);
}
