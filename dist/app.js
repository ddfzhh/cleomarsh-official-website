'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const works=[{"name": "SECOND BLOOM", "tag": "ORIGINAL / ANIMATED SHORT DRAMA", "poster": "bloom-poster.webp"}, {"name": "THE MAGIC MAID", "tag": "ORIGINAL / LIVE-ACTION STYLE SHORT DRAMA", "poster": "maid-poster.webp"}];
const services=[["ORIGINAL SERIES", "AI short dramas we write, design and produce ourselves. Our own stories, built for audiences who binge.", "SEE OUR ORIGINALS ↗", "#work"], ["CHARACTERS & WORLDS", "Every series leaves behind a cast and a world we designed from scratch, ready for sequels, spin-offs and new formats.", "MEET THE CHARACTERS ↗", "#studio"], ["IP LICENSING & ADAPTATION", "License our originals, adapt them for new markets and languages, or co-develop the next season with us.", "LET’S DISCUSS ↗", "#contact"], ["BRAND COLLABORATIONS", "Brands step into our worlds: films and campaigns told through our characters and our storytelling.", "LET’S DISCUSS ↗", "#contact"]];
const cast=[['Cleo Marsh','The Magic Maid','cleo-bunny-alpha.webp'],['Captain Hatcher','The Magic Maid','hatcher-ensemble.webp'],['Kane','The Magic Maid','kane-ensemble.webp'],['Mio','Second Bloom','mio-home-alpha.webp'],['Julian','The Magic Maid','julian-ensemble.webp'],['Ren','Second Bloom','ren-ensemble.webp'],['Remy Vance','The Magic Maid','remy-ensemble.webp']];
$('#projects').innerHTML=works.map(w=>`<article class="project"><div class="project-image"><img src="assets/${w.poster}" loading="lazy" alt="${w.name} poster" width="424" height="565"></div><h3>${w.name}</h3><p>${w.tag}</p></article>`).join('');
$('#services').innerHTML=services.map(([n,d,cta,href],i)=>`<div class="service"><span class="service-number">0${i+1}</span><h3>${n}</h3><p>${d}</p><a href="${href}">${cta}</a></div>`).join('');
$('#year').textContent=new Date().getFullYear();
$('.menu-toggle').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',open)});
$$('#navigation a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}));

const castDialog=$('#cast-dialog');
function sectionFromHash(){const id=location.hash.slice(1);return id&&!id.includes('/')?document.getElementById(id):null}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const target=document.getElementById(a.hash.slice(1));if(!target)return;e.preventDefault();history.pushState(null,'',a.hash);target.scrollIntoView({behavior:'instant',block:'start'})});
window.addEventListener('load',()=>{sectionFromHash()?.scrollIntoView({behavior:'instant',block:'start'})});
window.addEventListener('popstate',()=>{sectionFromHash()?.scrollIntoView({behavior:'instant',block:'start'})});
$('.close',castDialog).addEventListener('click',()=>castDialog.close());
castDialog.addEventListener('click',e=>{if(e.target===castDialog){const r=castDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)castDialog.close()}});
castDialog.addEventListener('close',()=>{document.body.classList.remove('locked');$('#explore-cast').focus({preventScroll:true})});
let castIndex=0;function renderCast(){const [name,series,file]=cast[castIndex];$('#cast-title').textContent=name;$('#cast-series').textContent=series;$('#cast-image').src='assets/'+file;$('#cast-image').alt=name+' character artwork';$('#cast-number').textContent=series;$$('#cast-select button').forEach((b,i)=>b.setAttribute('aria-pressed',i===castIndex))}
$('#cast-select').innerHTML=cast.map(([name],i)=>`<button data-index="${i}" aria-pressed="false">${name}</button>`).join('');
$$('#cast-select button').forEach(b=>b.addEventListener('click',()=>{castIndex=+b.dataset.index;renderCast()}));
$('#explore-cast').addEventListener('click',()=>{renderCast();castDialog.showModal();document.body.classList.add('locked')});
$('#cast-prev').addEventListener('click',()=>{castIndex=(castIndex+cast.length-1)%cast.length;renderCast()});$('#cast-next').addEventListener('click',()=>{castIndex=(castIndex+1)%cast.length;renderCast()});
castDialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('#cast-prev').click();if(e.key==='ArrowRight')$('#cast-next').click()});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
$('.hero').addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const x=(e.clientX/innerWidth-.5)*9,y=(e.clientY/900-.5)*6;$('.hero-art').style.setProperty('--move-x',x+'px');$('.hero-art').style.setProperty('--move-y',y+'px')});$('.hero').addEventListener('pointerleave',()=>{$('.hero-art').style.setProperty('--move-x','0px');$('.hero-art').style.setProperty('--move-y','0px')});

// Desktop progress follows scroll in both directions, fully revealed before the row reaches viewport center.
const processSection=document.querySelector('#team');
const processSteps=[...document.querySelectorAll('.process-step')];
const processTrack=document.querySelector('.process-track');
const processScroller=document.querySelector('.process-scroll');
const processWide=matchMedia('(min-width:1001px)');
let processFrame=0;
function updateProcessProgress(){
 processFrame=0;
 if(reduced.matches)return;
 const rect=processTrack.getBoundingClientRect();
 const start=innerHeight*.85;
 const end=innerHeight*.62;
 const progress=(start-rect.top)/Math.max(1,start-end);
 processSteps.forEach((step,i)=>{
  let p;
  if(innerWidth<=760){
   const previous=Number(step.style.getPropertyValue("--stage-progress")||0);
   const stageTop=step.getBoundingClientRect().top-(1-previous)*18;
   p=Math.min(1,Math.max(0,(innerHeight*.9-stageTop)/(innerHeight*.3)));
  }else if(processWide.matches){p=Math.min(1,Math.max(0,progress*4-i))}
  else{
   const box=step.getBoundingClientRect(),view=processScroller.getBoundingClientRect();
   const visibleWidth=Math.max(0,Math.min(box.right,view.right)-Math.max(box.left,view.left));
   p=Math.min(1,Math.max(0,progress))*Math.min(1,visibleWidth/(box.width*.5));
  }
  step.style.setProperty('--stage-progress',String(p));
 });
}
function scheduleProcessProgress(){if(!processFrame)processFrame=requestAnimationFrame(updateProcessProgress)}
function setProcessMode(){
 processSection.classList.add('process-ready','process-scrub');
 scheduleProcessProgress();
}
window.addEventListener('scroll',scheduleProcessProgress,{passive:true});
window.addEventListener('resize',scheduleProcessProgress,{passive:true});
processScroller.addEventListener('scroll',scheduleProcessProgress,{passive:true});
processWide.addEventListener('change',setProcessMode);
reduced.addEventListener('change',setProcessMode);
setProcessMode();

// Send enquiries directly; no visitor email application is required.
const contactForm=document.querySelector('#contact-form');
contactForm.addEventListener('submit',async event=>{
 event.preventDefault();
 if(contactForm.dataset.sending==='true'||!contactForm.reportValidity())return;
 const status=document.querySelector('#contact-status'),button=contactForm.querySelector('[type=submit]');
 const fields=Object.fromEntries(new FormData(contactForm));
 if(fields._honey)return;
 contactForm.dataset.sending='true';button.disabled=true;button.textContent='SENDING…';status.textContent='Sending your enquiry…';
 try{
  const response=await fetch('https://formsubmit.co/ajax/business@cleomarsh.com',{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify(fields),signal:AbortSignal.timeout(20000)
  });
  const result=await response.json();
  if(!response.ok||!(result.success===true||result.success==='true'))throw Error('Submission rejected');
  status.textContent='Thank you — your enquiry has been submitted. We will reply to the email you provided.';
  contactForm.reset();
 }catch{
  status.textContent='Your message could not be confirmed as sent. Please try again. Your details have been kept in the form.';
 }finally{
  contactForm.dataset.sending='false';button.disabled=false;button.innerHTML='SEND MESSAGE <span aria-hidden="true">→</span>';
 }
});
