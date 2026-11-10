/* Character positions are controlled by the variables in composition.css. */
(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=n=>Math.max(0,Math.min(1,n));
class FrameCharacter{
 constructor(image,folder,kind){this.image=image;this.folder=folder;this.kind=kind;this.target=0;this.current=-1;this.cache=new Map();this.blobs=new Map();this.busy=false;this.ready=false;this.canvas=document.createElement('canvas');this.canvas.className=image.className+' motion-character motion-'+kind;this.canvas.setAttribute('aria-hidden','true');this.canvas.hidden=true;image.after(this.canvas);this.ctx=this.canvas.getContext('2d');}
 async init(prefetch=true){if(this.ready)return;try{const res=await fetch(this.folder+'/manifest.json');if(!res.ok)throw Error('Missing frames');this.meta=await res.json();this.canvas.width=this.meta.width;this.canvas.height=this.meta.height;this.ready=true;await this.draw();if(!prefetch)return;let next=0;const worker=async()=>{while(next<this.meta.count){const n=next++;if(!this.blobs.has(n)){const r=await fetch(this.url(n));if(r.ok)this.blobs.set(n,await r.blob())}}};Promise.all([worker(),worker(),worker()]).catch(()=>{});}catch{this.ready=false;this.canvas.hidden=true;this.image.style.visibility='';}}
 url(n){return this.folder+'/'+String(n).padStart(3,'0')+'.webp'}
 seek(progress){this.target=Math.round(clamp(progress)*((this.meta?.count||12)-1));if(this.ready&&!this.busy&&this.target!==this.current)this.draw()}
 async bitmap(n){if(this.cache.has(n)){const b=this.cache.get(n);this.cache.delete(n);this.cache.set(n,b);return b}let blob=this.blobs.get(n);if(!blob){const r=await fetch(this.url(n));if(!r.ok)throw Error('Missing frame');blob=await r.blob();this.blobs.set(n,blob)}let b;try{if(typeof createImageBitmap!=='function')throw Error('Image fallback');b=await createImageBitmap(blob)}catch{b=await new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(blob);img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Image decode'))};img.src=url})}this.cache.set(n,b);while(this.cache.size>10){const key=this.cache.keys().next().value;this.cache.get(key).close?.();this.cache.delete(key)}return b}
 async draw(){if(!this.ready||this.busy)return;this.busy=true;const n=this.target;try{const bitmap=await this.bitmap(n);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);const c=this.meta.crop;this.ctx.drawImage(bitmap,c[0],c[1],c[2]-c[0],c[3]-c[1],0,0,this.canvas.width,this.canvas.height);this.canvas.hidden=false;this.image.style.visibility='hidden';this.current=n;this.canvas.dataset.frame=n}catch{this.canvas.hidden=true;this.image.style.visibility=''}finally{this.busy=false;if(this.target!==n)requestAnimationFrame(()=>this.draw())}}
}
const hero=document.querySelector('#home'),studio=document.querySelector('#studio');
const card=new FrameCharacter(document.querySelector('.hero-cleo'),'assets/motion/card-keyed-v4','card');
const bunny=new FrameCharacter(document.querySelector('.ensemble .bunny'),'assets/motion/bunny-keyed-v4','bunny');
let cardProgress=0,bunnyProgress=0,bunnyTarget=0,animationId=0;
function scrollCard(){if(reduced.matches)return;const mobile=innerWidth<=760;const range=Math.min(mobile?180:240,innerHeight*.28);const top=mobile?card.canvas.getBoundingClientRect().top:hero.getBoundingClientRect().top;cardProgress=clamp((mobile?innerHeight*.6-top:-top)/range);card.seek(cardProgress)}
function tickBunny(){animationId=0;const delta=bunnyTarget-bunnyProgress;bunnyProgress+=delta*.16;if(Math.abs(delta)<.002)bunnyProgress=bunnyTarget;bunny.seek(bunnyProgress);if(bunnyProgress!==bunnyTarget)animationId=requestAnimationFrame(tickBunny)}
studio.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType==='touch')return;const r=studio.getBoundingClientRect();bunnyTarget=clamp((event.clientX-r.left)/r.width);if(!animationId)animationId=requestAnimationFrame(tickBunny)});
studio.addEventListener('pointerleave',event=>{if(tiltEnabled||event.pointerType==='touch')return;bunnyTarget=0;if(!animationId)animationId=requestAnimationFrame(tickBunny)});
let tiltEnabled=false,tiltNeutral=null;
const controls=document.createElement('div');controls.className='motion-controls';
controls.hidden=true;
controls.innerHTML='<button type="button" class="tilt-enable" aria-label="Enable tilt interaction">Enable tilt ↔</button><span class="tilt-status" role="status"></span>';
studio.append(controls);
const tiltButton=controls.querySelector('button'),tiltStatus=controls.querySelector('.tilt-status');
function setLook(p){if(reduced.matches)return;bunnyTarget=clamp(p);if(!bunny.ready)bunny.init();if(!animationId)animationId=requestAnimationFrame(tickBunny)}
function orient(event){
 if(!tiltEnabled||document.hidden||reduced.matches)return;
 const angle=screen.orientation?.angle??window.orientation??0;
 const value=Math.abs(angle)===90?(angle===90?-event.beta:event.beta):event.gamma;
 if(value==null||!Number.isFinite(value))return;
 if(tiltNeutral===null)tiltNeutral=value;
 tiltStatus.textContent='Tilt gently left or right';
 const r=studio.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
 setLook(.5+(value-tiltNeutral)/40);
}
window.addEventListener('deviceorientation',orient,{passive:true});
window.addEventListener('orientationchange',()=>{tiltNeutral=null});
const orientationApi=window.DeviceOrientationEvent;
const canTilt=Boolean(orientationApi&&window.isSecureContext);
const needsTiltPermission=canTilt&&typeof orientationApi.requestPermission==='function';
// Browsers without an authorization prompt can respond directly to tilt.
if(canTilt){
 if(needsTiltPermission)controls.hidden=false;
 else tiltEnabled=true;
}
tiltButton.addEventListener('click',async()=>{
 try{
  if(!canTilt)throw Error('Unavailable');
  if(needsTiltPermission&&await orientationApi.requestPermission()!=='granted')throw Error('Permission denied');
  tiltEnabled=true;tiltNeutral=null;controls.hidden=true;setLook(.5);
 }catch{
  tiltEnabled=false;tiltButton.textContent='Retry tilt ↔';
  tiltStatus.textContent='Motion access was not granted.';
 }
});
window.addEventListener('scroll',scrollCard,{passive:true});window.addEventListener('resize',scrollCard);
if(reduced.matches){card.init(false);bunny.init(false)}else{card.init().then(scrollCard);const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){bunny.init();io.disconnect()}},{rootMargin:'400px'});io.observe(studio)}
reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(animationId);animationId=0;card.seek(0);bunny.seek(0)}else{if(!card.ready)card.init();if(!bunny.ready)bunny.init();scrollCard()}});
})();
