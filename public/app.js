const socket = io();
const character = document.getElementById("character");
const bubble = document.getElementById("bubble");
const mouth = document.getElementById("mouth");
const voiceBtn = document.getElementById("voiceBtn");
const voiceSelect = document.getElementById("voiceSelect");
const voiceStatus = document.getElementById("voiceStatus");
let voiceEnabled = true;
let availableVoices = [];

function isPortuguese(voice) {
  return (voice.lang || "").toLowerCase().startsWith("pt");
}
function isLikelyFemale(voice) {
  const name = (voice.name || "").toLowerCase();
  return /female|woman|mulher|francisca|thalita|luciana|camila|maria|fernanda|bruna|vit[oó]ria|let[ií]cia|helena|sofia|sofia|gabriela/.test(name);
}
function loadVoices() {
  if (!("speechSynthesis" in window)) {
    voiceStatus.textContent = "Este navegador não oferece voz automática.";
    return;
  }
  availableVoices = window.speechSynthesis.getVoices();
  const previous = voiceSelect.value;
  voiceSelect.innerHTML = "";
  const ptVoices = availableVoices.filter(isPortuguese);
  const choices = ptVoices.length ? ptVoices : availableVoices;
  choices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = voice.name + (isLikelyFemale(voice) ? " • provável feminina" : "");
    voiceSelect.appendChild(option);
  });
  const preferred = choices.find(v => isPortuguese(v) && isLikelyFemale(v))
    || choices.find(v => isPortuguese(v))
    || choices.find(isLikelyFemale)
    || choices[0];
  if (preferred) voiceSelect.value = choices.some(v => v.name === previous) ? previous : preferred.name;
  const selected = choices.find(v => v.name === voiceSelect.value);
  voiceStatus.textContent = selected
    ? (isLikelyFemale(selected) ? "Voz feminina selecionada: " : "Voz disponível selecionada: ") + selected.name
    : "Nenhuma voz foi encontrada. Verifique as vozes instaladas no Windows.";
}
function speak(message) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  const selectedVoice = availableVoices.find(v => v.name === voiceSelect.value);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang || "pt-BR";
  } else {
    utterance.lang = "pt-BR";
  }
  utterance.rate = 0.96;
  utterance.pitch = 1.28;
  utterance.volume = 1;
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
socket.on("character-reaction", event => react(event.type, event.message));
document.getElementById("likeBtn").addEventListener("click", () => socket.emit("test-like"));
document.getElementById("giftBtn").addEventListener("click", () => socket.emit("test-gift"));
voiceBtn.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  if (!voiceEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
  voiceBtn.textContent = voiceEnabled ? "🔊 Voz ativada" : "🔇 Voz desligada";
  voiceBtn.classList.toggle("muted", !voiceEnabled);
  voiceBtn.setAttribute("aria-pressed", String(voiceEnabled));
  if (voiceEnabled) speak("Oii! Minha voz está ativada, obrigada por estarem aqui!");
});
voiceSelect.addEventListener("change", () => {
  const voice = availableVoices.find(v => v.name === voiceSelect.value);
  voiceStatus.textContent = voice ? "Voz selecionada: " + voice.name : "Voz selecionada.";
  speak("Oi, chat! Essa é a minha voz.");
});
if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  setTimeout(loadVoices, 700);
}
