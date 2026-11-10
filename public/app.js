const socket = io();
const $ = id => document.getElementById(id);
let voices = [];
let voiceEnabled = true;
function loadVoices(){
  if(!("speechSynthesis" in window)) return;
  voices = speechSynthesis.getVoices();
  const select=$("voiceSelect"); select.innerHTML="";
  const pt=voices.filter(v=>(v.lang||"").toLowerCase().startsWith("pt"));
  const list=pt.length?pt:voices;
  list.forEach(v=>{const op=document.createElement("option");op.value=v.name;op.textContent=v.name+" · "+v.lang;select.appendChild(op);});
  const preferred=pt.find(v=>/francisca|luciana|camila|maria|fernanda|bruna|female|woman|vitoria|leticia/i.test(v.name))||pt[0]||voices[0];
  if(preferred) select.value=preferred.name;
  sendVoiceConfig();
}
function sendVoiceConfig(){
  socket.emit("voice-config",{voiceName:$("voiceSelect").value,rate:Number($("rateInput").value),volume:Number($("volumeInput").value),enabled:voiceEnabled});
}
function fmt(n){return Number(n||0).toLocaleString("pt-BR");}
document.querySelectorAll("[data-test]").forEach(btn=>btn.addEventListener("click",()=>socket.emit("test-reaction",{type:btn.dataset.test})));
$("connectBtn").onclick=()=>{ $("connectionStatus").textContent="Conectando…";socket.emit("connect-live",$("usernameInput").value); };
$("disconnectBtn").onclick=()=>socket.emit("disconnect-live");
$("autoReplyToggle").onchange=e=>socket.emit("toggle-auto-reply",e.target.checked);
$("aiToggle").onchange=e=>socket.emit("toggle-ai",e.target.checked);
$("savePersonality").onclick=()=>{
  socket.emit("host-settings",{personality:$("personalityInput").value,streamTopic:$("topicInput").value,forbiddenTopics:$("forbiddenInput").value,replyMode:$("replyMode").value});
  $("savePersonality").textContent="Salvo ✓";setTimeout(()=>$("savePersonality").textContent="Salvar configurações da host",1300);
};
$("topicTalkBtn").onclick=()=>{socket.emit("host-topic",$("topicTalkInput").value);$("topicTalkInput").value="";};
$("topicTalkInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("topicTalkBtn").click();});
$("testChatBtn").onclick=()=>{socket.emit("test-chat",$("testComment").value);$("testComment").value="";};
$("testComment").addEventListener("keydown",e=>{if(e.key==="Enter")$("testChatBtn").click();});
$("voiceSelect").onchange=sendVoiceConfig;
$("rateInput").oninput=e=>{$("rateValue").textContent=Number(e.target.value).toFixed(2).replace(".",",")+"×";sendVoiceConfig();};
$("volumeInput").oninput=e=>{$("volumeValue").textContent=Math.round(Number(e.target.value)*100)+"%";sendVoiceConfig();};
$("voiceTestBtn").onclick=()=>socket.emit("test-chat","Oi! Essa é minha voz. Estou pronta para conversar com vocês na live!");
socket.on("live-status",s=>{
  $("connectionLabel").textContent=s.connected?"Conectado · @"+s.username:s.connecting?"Conectando…":"Desconectado";
  $("connectionStatus").textContent=s.error||s.message||(s.connected?"Conectado à LIVE de @"+s.username:s.connecting?"Aguardando conexão com o TikTok…":"Digite o @ público de quem está ao vivo. Não use senha ou cookies.");
  $("statusDot").classList.toggle("connected",!!s.connected);
  $("connectBtn").disabled=!!s.connected||!!s.connecting;
  $("connectBtn").textContent=s.connecting?"Aguarde…":s.connected?"Conectado":"Conectar";
});
socket.on("live-stats",s=>{const map={likes:"statLikes",comments:"statComments",gifts:"statGifts",followers:"statFollowers",shares:"statShares",viewers:"statViewers"};Object.entries(map).forEach(([k,id])=>$(id).textContent=fmt(s[k]));});
socket.on("settings-state",s=>{
  $("autoReplyToggle").checked=!!s.autoReply;$("aiToggle").checked=!!s.aiEnabled;
  $("aiToggle").disabled=!s.aiConfigured;
  $("aiDescription").textContent=s.aiConfigured?"IA pronta; resposta local é o fallback":"Sem chave Gemini: respostas locais instantâneas";
  if(s.personality)$("personalityInput").value=s.personality;
  if(s.streamTopic)$("topicInput").value=s.streamTopic;
  if(s.forbiddenTopics!==undefined)$("forbiddenInput").value=s.forbiddenTopics;
  if(s.replyMode)$("replyMode").value=s.replyMode;
});
socket.on("chat-comment",m=>{
  const feed=$("chatFeed");if(feed.querySelector(".empty-chat"))feed.innerHTML="";
  const item=document.createElement("div");item.className="chat-item";
  const name=document.createElement("b");name.textContent="@"+m.nickname;
  const text=document.createElement("span");text.textContent=m.comment;
  const answer=document.createElement("button");answer.className="answer-comment";answer.textContent="Responder";
  answer.onclick=()=>{socket.emit("answer-comment",m.id);answer.textContent="Enviado ✓";answer.disabled=true;};
  item.append(name,text,answer);feed.appendChild(item);
  while(feed.children.length>35)feed.removeChild(feed.firstChild);
  feed.scrollTop=feed.scrollHeight;
  $("chatCount").textContent=feed.children.length+" mensagens";
});
socket.on("system-notice",n=>{$("connectionStatus").textContent=n.message;});
if("speechSynthesis" in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;setTimeout(loadVoices,500);}
