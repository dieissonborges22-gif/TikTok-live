import * as THREE from "three";

const mount=document.getElementById("avatar");
const bubble=document.getElementById("speech");
const fallback=document.getElementById("fallback");
const socket=io();
let voiceName="",voiceRate=1,voiceVolume=.9,voiceEnabled=true;
let voices=[],speaking=false,queue=[],activeUtterance=null,bubbleTimer=0;
let mood="idle",moodUntil=0,blink=0,nextBlink=performance.now()+2400;
let mouthTarget=0,mouthValue=0;
const clock=new THREE.Clock();
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(31,1,.1,100);
camera.position.set(0,2.45,8.2);
camera.lookAt(0,2.35,0);
let renderer;
try{
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
 renderer.setClearColor(0x000000,0);
 renderer.setSize(mount.clientWidth,mount.clientHeight);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.15;
 renderer.shadowMap.enabled=true;
 renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 mount.appendChild(renderer.domElement);
}catch(error){fallback.style.display="block";throw error;}
scene.add(new THREE.HemisphereLight(0xffe9ff,0x35204f,2.0));
const key=new THREE.DirectionalLight(0xffd9f4,3.0);key.position.set(-3,6,5);key.castShadow=true;scene.add(key);
const rim=new THREE.PointLight(0xa76cff,24,12);rim.position.set(3,3,1);scene.add(rim);
const pinkLight=new THREE.PointLight(0xff65ce,18,10);pinkLight.position.set(-3,2,-1);scene.add(pinkLight);
const mat=(color,roughness=.55,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const skin=mat(0xc98770,.82),skinLight=mat(0xe0a087,.78),hair=mat(0x40204f,.34),hairHi=mat(0x8b3d9e,.38),hairPink=mat(0xe75bbd,.35),dark=mat(0x21152f,.42),white=mat(0xfff6fb,.32),iris=mat(0x9e4fc8,.24),black=mat(0x25152d,.28),pink=mat(0xff75d2,.32,.08),lavender=mat(0x9b75f2,.35,.1),gold=mat(0xffd88c,.25,.7);
function mesh(geometry,material,parent,x=0,y=0,z=0,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function sphere(parent,material,pos,scale){return mesh(new THREE.SphereGeometry(1,24,18),material,parent,...pos,...scale);}
function cylinder(parent,material,pos,r1,r2,h,segments=16){return mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material,parent,...pos);}
const avatar=new THREE.Group();avatar.scale.setScalar(.9);scene.add(avatar);
const eyeWhites=[];
const hips=new THREE.Group();hips.position.y=1.45;avatar.add(hips);
// legs and shoes
for(const side of [-1,1]){
 const leg=sphere(hips,skinLight,[side*.25,-.52,0],[.19,.68,.22]);
 const sock=cylinder(hips,white,[side*.25,-.92,.01],.18,.19,.23,14);
 const shoe=sphere(hips,lavender,[side*.25,-1.13,.12],[.27,.15,.42]);
 const sole=mesh(new THREE.BoxGeometry(.49,.07,.68),dark,hips,side*.25,-1.23,.1);
 const lace=mesh(new THREE.BoxGeometry(.18,.025,.08),pink,hips,side*.25,-1.06,.36);
}
// torso
const torso=new THREE.Group();torso.position.y=1.75;avatar.add(torso);
sphere(torso,skin,[0,.15,0],[.23,.35,.23]);
const body=mesh(new THREE.CylinderGeometry(.43,.56,.98,24,1),lavender,torso,0,-.35,0);
const top=mesh(new THREE.CylinderGeometry(.39,.47,.58,24,1),pink,torso,0,-.25,.025);
const collar=mesh(new THREE.TorusGeometry(.22,.055,8,24),gold,torso,0,.04,.02);collar.rotation.x=Math.PI/2;
const heart=sphere(torso,pink,[0,-.31,.43],[.11,.1,.035]);
// sleeves and articulated arms
const armPivots=[];
for(const side of [-1,1]){
 const pivot=new THREE.Group();pivot.position.set(side*.43,.0,0);torso.add(pivot);armPivots.push({pivot,side});
 const sleeve=cylinder(pivot,lavender,[side*.02,-.25,0],.17,.15,.48,16);sleeve.rotation.z=side*-.2;
 const fore=cylinder(pivot,skinLight,[side*.08,-.68,.02],.105,.12,.43,14);fore.rotation.z=side*-.08;
 sphere(pivot,skin,[side*.09,-.92,.06],[.13,.14,.13]);
 for(let i=0;i<3;i++)sphere(pivot,skinLight,[side*(.03+i*.035),-1.02,.1],[.035,.08,.035]);
}
// neck and head
const headRig=new THREE.Group();headRig.position.set(0,3.12,0);avatar.add(headRig);
cylinder(headRig,skin,[0,-.14,0],.22,.25,.42,18);
sphere(headRig,skinLight,[0,.55,0],[.72,.87,.59]);
// long hair behind head, twin side locks
sphere(headRig,hair,[0,.6,-.19],[.77,.97,.63]);
for(const side of [-1,1]){
 sphere(headRig,hairHi,[side*.58,.05,-.05],[.22,.95,.34]);
 sphere(headRig,hairPink,[side*.58,-.45,.02],[.15,.55,.22]);
}
// fringe cap and bangs
sphere(headRig,hair,[0,1.05,-.02],[.76,.48,.64]);
for(let i=0;i<5;i++){
 const x=-.5+i*.25;
 const bang=mesh(new THREE.ConeGeometry(.22,.7,9),i%2?hair:hairHi,headRig,x,.78,.48);
 bang.rotation.z=(x*-.55);
 bang.rotation.x=-.13;
}
sphere(headRig,hairPink,[-.48,.9,.42],[.07,.42,.07]);
sphere(headRig,hairHi,[.48,.9,.42],[.07,.42,.07]);
// ears and headset
for(const side of [-1,1]){
 const ear=mesh(new THREE.ConeGeometry(.23,.48,8),dark,headRig,side*.52,1.53,-.02);ear.rotation.z=side*-.25;
 const inner=mesh(new THREE.ConeGeometry(.12,.28,8),pink,headRig,side*.52,1.54,.16);inner.rotation.z=side*-.25;
 const cup=sphere(headRig,dark,[side*.72,.55,.02],[.17,.31,.19]);
 sphere(headRig,pink,[side*.82,.55,.13],[.045,.19,.13]);
}
const band=mesh(new THREE.TorusGeometry(.72,.075,10,40,Math.PI),lavender,headRig,0,.68,-.12);band.rotation.z=Math.PI;
// face details
for(const side of [-1,1]){
 eyeWhites.push(sphere(headRig,white,[side*.27,.49,.52],[.17,.21,.08]));
 sphere(headRig,iris,[side*.27,.47,.59],[.095,.14,.045]);
 sphere(headRig,black,[side*.27,.47,.625],[.047,.085,.025]);
 sphere(headRig,white,[side*.30,.54,.65],[.035,.04,.02]);
 const brow=mesh(new THREE.CapsuleGeometry(.035,.23,4,8),hair,headRig,side*.27,.77,.53);brow.rotation.z=side*.1;
 sphere(headRig,pink,[side*.43,.16,.51],[.14,.065,.025]);
}
sphere(headRig,skin,[0,.3,.57],[.06,.045,.045]);
const mouth=mesh(new THREE.SphereGeometry(1,16,12),black,headRig,0,.08,.58,.095,.022,.025);
const mouthInside=sphere(headRig,pink,[0,.065,.606],[.045,.008,.012]);
// little hairpin
sphere(headRig,gold,[-.5,1.05,.48],[.07,.12,.045]);
sphere(headRig,pink,[-.5,1.05,.53],[.035,.08,.025]);
// shoulder accessory
const charm=sphere(torso,gold,[.28,.01,.23],[.065,.065,.065]);
// ground glow only for preview; remains subtle in transparent overlay
const halo=mesh(new THREE.TorusGeometry(1.25,.018,8,64),pink,avatar,0,.13,-.35);halo.rotation.x=Math.PI/2;halo.material.transparent=true;halo.material.opacity=.38;

function resize(){const w=mount.clientWidth||window.innerWidth,h=mount.clientHeight||window.innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));}
window.addEventListener("resize",resize);resize();
function setMood(type){mood=type;moodUntil=performance.now()+ (type==="gift"?1800:type==="join"?1200:900);avatar.scale.setScalar(type==="gift"?1.035:1);}
function showMessage(message){bubble.textContent=message;bubble.classList.add("show");clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>bubble.classList.remove("show"),6500);}
function refreshVoices(){voices=speechSynthesis?.getVoices?.()||[];}
function speakNext(){
 if(speaking||!queue.length||!voiceEnabled||!("speechSynthesis"in window))return;
 const text=queue.shift();const utterance=new SpeechSynthesisUtterance(text);
 const voice=voices.find(v=>v.name===voiceName)||voices.find(v=>(v.lang||"").toLowerCase()==="pt-br")||voices.find(v=>(v.lang||"").toLowerCase().startsWith("pt"));
 if(voice){utterance.voice=voice;utterance.lang=voice.lang;}else utterance.lang="pt-BR";
 utterance.rate=voiceRate;utterance.pitch=1.12;utterance.volume=voiceVolume;
 utterance.onstart=()=>{speaking=true;mouthTarget=.6;};
 utterance.onboundary=()=>{mouthTarget=.85;};
 utterance.onend=utterance.onerror=()=>{speaking=false;mouthTarget=0;activeUtterance=null;speakNext();};
 activeUtterance=utterance;speechSynthesis.speak(utterance);
}
function say(text,priority=false){
 if(!voiceEnabled)return;
 if(priority&&speaking){speechSynthesis.cancel();speaking=false;activeUtterance=null;queue=[];}
 queue.push(text);
 if(queue.length>4)queue=queue.slice(-4);
 speakNext();
}
socket.on("character-reaction",event=>{
 showMessage(event.message||"Oi, chat!");
 setMood(event.type||"idle");
 if(event.type==="gift"){say(event.message,true);}
 else if(event.type==="chat"||event.type==="follow"||event.type==="join"||event.type==="share"){say(event.message);}
 else if(event.type==="like"&&Math.random()>.35){say(event.message);}
});
socket.on("voice-config",cfg=>{
 voiceName=cfg.voiceName||voiceName;voiceRate=cfg.rate||1;voiceVolume=cfg.volume??.9;voiceEnabled=cfg.enabled!==false;
 if(!voiceEnabled&&"speechSynthesis"in window){speechSynthesis.cancel();queue=[];speaking=false;mouthTarget=0;}
});
socket.on("connect",()=>{socket.emit("voice-config",{voiceName,rate:voiceRate,volume:voiceVolume,enabled:voiceEnabled});});
if("speechSynthesis"in window){refreshVoices();speechSynthesis.onvoiceschanged=refreshVoices;}
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function animate(now){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.04),t=now*.001;
 avatar.position.y=.04+Math.sin(t*1.65)*.045;
 avatar.rotation.y=Math.sin(t*.48)*.075;
 headRig.rotation.z=Math.sin(t*.9)*.025;
 headRig.rotation.x=Math.sin(t*.75)*.018;
 torso.scale.y=1+Math.sin(t*1.7)*.012;
 if(now>moodUntil){mood="idle";avatar.scale.lerp(new THREE.Vector3(1,1,1),.08);}
 if(mood==="gift"){avatar.rotation.z=Math.sin(t*15)*.07;armPivots.forEach(a=>a.pivot.rotation.z=Math.sin(t*13)*.28*a.side);}
 else if(mood==="join"){armPivots.forEach(a=>a.pivot.rotation.z=Math.sin(t*11)*.42*a.side);}
 else if(mood==="like"){avatar.position.y+=Math.abs(Math.sin(t*8))*.12;}
 if(speaking){mouthTarget=Math.max(mouthTarget,.18+Math.abs(Math.sin(t*15))*.48);if(Math.random()>.78)mouthTarget=.12;}
 else mouthTarget=0;
 mouthValue+=(mouthTarget-mouthValue)*Math.min(1,dt*18);
 mouth.scale.y=.022+mouthValue*.13;
 mouth.position.y=.08-mouthValue*.025;
 mouthInside.scale.y=.008+mouthValue*.04;
 if(now>nextBlink){blink=.15;nextBlink=now+2200+Math.random()*3200;}
 blink=Math.max(0,blink-dt*5);
 eyeWhites.forEach(eye=>{eye.scale.y=.21*(1-blink);});
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
