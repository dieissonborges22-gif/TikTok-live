import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas=document.querySelector("#avatar3d");
if(canvas){
 const scene=new THREE.Scene(); scene.background=null;
 const camera=new THREE.PerspectiveCamera(34,1,.1,100); camera.position.set(0,2.15,8.8);
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping;
 scene.add(new THREE.HemisphereLight(0xdceaff,0x39202b,2.0));
 const key=new THREE.DirectionalLight(0xffe1b2,3.1);key.position.set(-3,6,6);scene.add(key);
 const rim=new THREE.DirectionalLight(0x6ba7ff,2.4);rim.position.set(4,3,-4);scene.add(rim);
 const gold=new THREE.PointLight(0xffc45d,18,12);gold.position.set(0,4,3);scene.add(gold);
 const root=new THREE.Group();scene.add(root);
 const mat=(color,rough=.65,metal=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
 const skin=mat(0xc98b68),skinLight=mat(0xe0a47f),hair=mat(0x171a20,.42),hairHi=mat(0x343a43,.5),red=mat(0xb91631,.48),red2=mat(0xe12a40,.48),green=mat(0x176848),goldMat=mat(0xe8c46e,.35,.5),navy=mat(0x172947),white=mat(0xf5f2e8),dark=mat(0x211b20),eyeMat=mat(0x17151a,.3);
 const sphere=(parent,x,y,z,sx,sy,sz,material)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
 const cyl=(parent,x,y,z,rt,rb,h,material,segments=24)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material);m.position.set(x,y,z);parent.add(m);return m;};
 const box=(parent,x,y,z,sx,sy,sz,material)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);m.position.set(x,y,z);parent.add(m);return m;};
 // torso, Portugal-inspired number 7 kit
 const torso=new THREE.Group();torso.position.y=1.42;root.add(torso);
 const shirt=sphere(torso,0,0,0,.82,.93,.42,red);shirt.scale.set(.82,.94,.43);
 sphere(torso,-.33,.03,.36,.36,.78,.08,red2);sphere(torso,.33,.03,.36,.36,.78,.08,red);
 // collar
 const collar=cyl(torso,0,.79,0,.23,.25,.13,green);collar.rotation.x=Math.PI/2;
 // jersey crest and number
 sphere(torso,.53,.42,.405,.12,.14,.035,goldMat);
 const crestCross=box(torso,.53,.42,.445,.035,.17,.015,green);
 const numberCanvas=document.createElement("canvas");numberCanvas.width=256;numberCanvas.height=256;
 const ctx=numberCanvas.getContext("2d");ctx.clearRect(0,0,256,256);ctx.fillStyle="#f5d77a";ctx.font="bold 190px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("7",128,132);
 const numTex=new THREE.CanvasTexture(numberCanvas);numTex.colorSpace=THREE.SRGBColorSpace;
 const number=new THREE.Mesh(new THREE.PlaneGeometry(.54,.76),new THREE.MeshBasicMaterial({map:numTex,transparent:true,side:THREE.DoubleSide}));number.position.set(-.08,.02,.435);torso.add(number);
 // neck and head
 cyl(root,0,2.42,0,.19,.22,.43,skin);
 const head=new THREE.Group();head.position.set(0,3.04,0);root.add(head);
 sphere(head,0,0,0,.49,.66,.43,skin);
 sphere(head,0,-.15,.29,.39,.39,.17,skinLight);
 // jaw/chin
 sphere(head,0,-.38,.25,.29,.17,.18,skin);
 // ears
 sphere(head,-.49,-.02,0,.105,.19,.12,skin);sphere(head,.49,-.02,0,.105,.19,.12,skin);
 // hair cap and styled front
 sphere(head,0,.42,-.02,.51,.34,.45,hair);
 sphere(head,0,.53,.19,.48,.19,.29,hairHi);
 const frontHair=sphere(head,0,.39,.34,.43,.12,.12,hair);frontHair.rotation.z=-.08;
 // eyebrows
 const browL=box(head,-.2,.12,.393,.19,.045,.045,hair);browL.rotation.z=.12;
 const browR=box(head,.2,.12,.393,.19,.045,.045,hair);browR.rotation.z=-.12;
 // eyes and pupils
 sphere(head,-.19,.035,.395,.09,.055,.035,white);sphere(head,.19,.035,.395,.09,.055,.035,white);
 sphere(head,-.19,.03,.429,.034,.043,.02,eyeMat);sphere(head,.19,.03,.429,.034,.043,.02,eyeMat);
 // nose
 sphere(head,0,-.07,.46,.07,.14,.09,skin);sphere(head,0,-.17,.48,.09,.045,.055,skinLight);
 // mouth mesh animated
 const mouth=sphere(head,0,-.29,.414,.115,.025,.025,dark);
 // subtle stubble
 const stubble=sphere(head,0,-.36,.30,.29,.09,.045,hairHi);
 // arms articulated
 function makeArm(side){const pivot=new THREE.Group();pivot.position.set(side*.77,2.02,0);root.add(pivot);const upper=cyl(pivot,0,-.37,0,.16,.19,.74,skin);upper.rotation.z=side*.12;const elbow=sphere(pivot,0,-.73,0,.16,.16,.16,skin);const fore=cyl(pivot,0,-1.04,.01,.13,.16,.62,skin);fore.rotation.z=-side*.08; sphere(pivot,0,-1.36,.05,.15,.17,.14,skin);return pivot;}
 const armL=makeArm(-1),armR=makeArm(1);
 // shorts and legs
 const shorts=sphere(root,0,.57,0,.67,.33,.39,navy);
 const legL=new THREE.Group();legL.position.set(-.32,.45,0);root.add(legL);
 const legR=new THREE.Group();legR.position.set(.32,.45,0);root.add(legR);
 function makeLeg(g){cyl(g,0,-.48,0,.21,.24,.92,skin);cyl(g,0,-1.13,.02,.19,.2,.48,white);const boot=sphere(g,0,-1.42,.18,.28,.13,.43,dark);boot.rotation.x=-.08;}
 makeLeg(legL);makeLeg(legR);
 // ground glow
 const disc=new THREE.Mesh(new THREE.CircleGeometry(1.25,64),new THREE.MeshBasicMaterial({color:0x3978c6,transparent:true,opacity:.15}));disc.rotation.x=-Math.PI/2;disc.position.y=-1.05;root.add(disc);
 // CR7 lettering as small chest plate
 const badge=sphere(torso,-.48,-.35,.39,.14,.07,.025,goldMat);
 const group=new THREE.Group();group.add(root);scene.add(group);group.position.y=-.08;
 let targetX=0,targetY=0,drag=false,lastX=0,lastY=0;
 canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener("pointermove",e=>{if(!drag)return;targetY+=(e.clientX-lastX)*.008;targetX+=(e.clientY-lastY)*.004;lastX=e.clientX;lastY=e.clientY;});
 canvas.addEventListener("pointerup",()=>drag=false);canvas.addEventListener("pointercancel",()=>drag=false);
 function resize(){const r=canvas.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(canvas);resize();
 let celebratingUntil=0,talkingUntil=0,likeUntil=0;
 window.CR7Avatar={celebrate(){celebratingUntil=performance.now()+1600;},talk(ms=5000){talkingUntil=performance.now()+ms;},like(){likeUntil=performance.now()+650;}};
 const clock=new THREE.Clock();
 function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime(),now=performance.now();root.position.y=Math.sin(t*1.8)*.045;root.rotation.y=Math.sin(t*.55)*.06+targetY;root.rotation.x=targetX;
 const celebrate=now<celebratingUntil,like=now<likeUntil,talking=now<talkingUntil;
 if(celebrate){const p=(now-(celebratingUntil-1600))/1600;root.position.y+=Math.sin(p*Math.PI)*.55;armL.rotation.z=-1.8;armR.rotation.z=1.8;armL.rotation.x=-.4;armR.rotation.x=-.4;}
 else{armL.rotation.z=THREE.MathUtils.lerp(armL.rotation.z,0,.08);armR.rotation.z=THREE.MathUtils.lerp(armR.rotation.z,0,.08);armL.rotation.x=THREE.MathUtils.lerp(armL.rotation.x,0,.08);armR.rotation.x=THREE.MathUtils.lerp(armR.rotation.x,0,.08);}
 if(like)root.position.y+=Math.abs(Math.sin(now*.018))*.22;
 mouth.scale.y=talking ? .13+Math.abs(Math.sin(now*.025))*.18 : .025;
 head.rotation.y=Math.sin(t*.7)*.045;head.rotation.x=Math.sin(t*.9)*.025;
 renderer.render(scene,camera);}
 animate();
}
