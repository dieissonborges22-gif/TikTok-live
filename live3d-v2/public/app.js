const socket=io();
const $=id=>document.getElementById(id);
let currentAudio=null;
async function speak(text){$("speech").textContent=text;try{const r=await fetch("/api/voice",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});if(!r.ok){const e=await r.json().catch(()=>({}));throw Error(e.error||"Falha na voz");}const blob=await r.blob(),url=URL.createObjectURL(blob),audio=$("player");if(currentAudio){URL.revokeObjectURL(currentAudio);currentAudio=null;}currentAudio=url;audio.src=url;$("mouth").classList.add("talking");audio.onended=()=>{$("mouth").classList.remove("talking");URL.revokeObjectURL(url);currentAudio=null;};audio.onerror=()=>{$("mouth").classList.remove("talking");};await audio.play();}catch(e){$("feedback").textContent="Voz: "+e.message;}}
socket.on("say",e=>speak(e.text));
socket.on("status",s=>{$("connection").textContent=s.error|| (s.connected?"Conectado: @"+s.username:"Desconectado");$("feedback").textContent=s.error|| (s.connected?"LIVE conectada.":"Aguardando conexão.");});
socket.on("auto-reply",v=>$("auto").checked=v);
$("connect").onclick=()=>{const name=$("username").value.trim();$("feedback").textContent="Conectando...";socket.emit("connect-tiktok",name);};
$("disconnect").onclick=()=>socket.emit("disconnect-tiktok");
$("auto").onchange=e=>socket.emit("auto-reply",e.target.checked);
$("testAI").onclick=async()=>{const b=$("testAI");b.disabled=true;b.textContent="Testando...";try{const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({comment:"Diga oi para o chat e dê boas-vindas à live."})});const j=await r.json();if(!r.ok)throw Error(j.error||"Erro");await speak(j.text);$("feedback").textContent="Ollama respondeu: "+j.text;}catch(e){$("feedback").textContent=e.message;}finally{b.disabled=false;b.textContent="Testar IA";}};
$("testVoice").onclick=()=>speak("Oi, pessoal! Sejam muito bem-vindos à nossa live! Estou feliz por ter vocês aqui!");
socket.on("comment",c=>{const p=document.createElement("p");p.textContent="@"+c.nickname+": "+c.comment;const box=$("comments");if(box.textContent.includes("Os comentários"))box.textContent="";box.prepend(p);while(box.children.length>12)box.lastChild.remove();});
fetch("/api/status").then(r=>r.json()).then(s=>{$("aiModel").textContent=s.aiModel;$("voiceModel").textContent=s.voiceModel;}).catch(()=>{$("feedback").textContent="Não foi possível carregar as configurações.";});
