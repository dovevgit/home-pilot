(function(){
'use strict';
/* הכלב שיצו של הבית (רק בבית של הבעלים): מחליף את הדמות במסך הבית.
   הולך על קצה מלבן ההודעה, יושב, צונח עם מצנח בגלילה למטה, מטפס חזרה בגלילה למעלה,
   נובח ומתעצבן כשלוחצים עליו, ועושה קקי בלחיצה ארוכה. */
var OWNER='40f12cb3-3fa9-4f99-a7fd-ad5a10e00b80';
function famReady(cb){var n=0;(function w(){var f=null;try{f=localStorage.getItem('myFam')}catch(_){}if(f||n++>20)cb(f);else setTimeout(w,150)})()} /* מחכים עד שנודע לאיזה בית שייכים (נשמר אחרי טעינת הפרופיל) */
famReady(function(f){ if(f===OWNER)main(); });
function main(){
if(document.getElementById('dg'))return;
var BASE='icons/dog/';
/* דשא בתחתית הדף (מתחת לכלב ולמה שהוא משאיר: שכבה 1 מול 7 ו-8) */
var gr=document.createElement('div'); gr.setAttribute('aria-hidden','true');
gr.style.cssText='position:relative;z-index:1;height:36px;pointer-events:none;margin-top:8px';
var gim=document.createElement('div');
gim.style.cssText='position:absolute;left:0;right:0;bottom:-20px;height:56px;background:url(icons/grass.webp) repeat-x center bottom/auto 56px';
gr.appendChild(gim); document.body.appendChild(gr);
var SZ={walk:[95.7,96.9],face:[86,104.7],glide:[104,108.8],climb:[71.1,106],poop:[114.7,100.8],pee:[134.4,99.8]};
var N={walk:6,face:4,glide:2,climb:3,poop:4,pee:3};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

var css='#dg{position:fixed;left:0;top:0;width:110px;height:110px;z-index:8;pointer-events:none;will-change:transform;direction:ltr;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}'
+'#dgs{position:absolute;inset:0;transform-origin:55px 110px}'
+'#dgi{position:absolute;inset:0;transform-origin:50% 100%}'
+'#dgshadow{position:absolute;left:50%;bottom:-3px;width:70px;height:10px;margin-left:-35px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(40,25,10,.35),rgba(40,25,10,0) 70%)}'
+'#dg .dp{position:absolute;left:50%;bottom:0;transform:translateX(-50%);display:none;pointer-events:auto;cursor:pointer;touch-action:none}'
+'#dg .dp.show{display:block}'
+'#dg .dp img{position:absolute;left:0;top:0;width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none}'
+'#dp-pee{margin-left:-6px}#dp-pee.flip{margin-left:6px}'
+'#dg .dp.cyc img{display:none}#dg .dp.cyc img.cur{display:block}'
+'#dg .dp.flip img{transform:scaleX(-1)}'
+'#dg .dp .tail{animation:dgwag var(--wag,.46s) ease-in-out infinite alternate}'
+'@keyframes dgwag{from{transform:rotate(calc(var(--amp,11deg)*-1))}to{transform:rotate(var(--amp,11deg))}}'
+'#dg.sitting #dgi{animation:dgbreathe 2.6s ease-in-out infinite}'
+'@keyframes dgbreathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.012,.99)}}'
+'#dg.angry #dgi{filter:saturate(1.35) brightness(.94) drop-shadow(0 0 5px rgba(220,30,20,.7));animation:dgshake .08s linear infinite}'
+'@keyframes dgshake{0%{transform:scale(1.12) translate(-2px,0) rotate(-3deg)}50%{transform:scale(1.12) translate(2px,-1px) rotate(3deg)}100%{transform:scale(1.12) translate(-2px,0) rotate(-3deg)}}'
+'#dg.barking #dgi{animation:dgbark .32s cubic-bezier(.2,.9,.3,1) 1}'
+'@keyframes dgbark{0%{transform:scale(1)}25%{transform:scale(1.16,.9) translateY(2px)}55%{transform:scale(1.12,1.12) translateY(-9px) rotate(-3deg)}100%{transform:scale(1)}}'
+'#dg.strain #dgi{animation:dgstrain .12s linear infinite}'
+'@keyframes dgstrain{0%{transform:translateX(-.8px)}50%{transform:translateX(.8px) translateY(.6px)}100%{transform:translateX(-.8px)}}'
+'#dg.slink #dgi{animation:dgslink .5s ease-in-out infinite}'
+'@keyframes dgslink{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}'
+'#dgchute{position:absolute;left:-6px;top:-80px;width:122px;height:150px;display:none;pointer-events:none;overflow:visible}'
+'#dg.gliding #dgchute{display:block}'
+'#dg.flying #dgshadow{display:none}'
+'.dgpoo{position:absolute;width:30px;height:28px;pointer-events:none;z-index:7;transform-origin:50% 100%;animation:dgpooin .35s cubic-bezier(.2,1.6,.4,1) both;transition:opacity 1s}'
+'.dgpoo.out{opacity:0}'
+'@keyframes dgpooin{from{transform:scale(.2,.1)}to{transform:scale(1)}}'
+'.dgfly{position:absolute;width:12px;height:10px;pointer-events:none;z-index:7;animation:dgflya var(--d,2.4s) linear infinite}'
+'.dgfly.away{animation:dgflyaway 1s ease-in forwards}'
+'.dgfly svg{display:block;overflow:visible}'
+'.dgfly .w{transform-origin:6px 5px;animation:dgwing .07s linear infinite alternate}'
+'@keyframes dgwing{from{transform:scaleY(1)}to{transform:scaleY(.25)}}'
+'@keyframes dgflya{0%{transform:translate(-18px,-6px)}12%{transform:translate(2px,-20px)}25%{transform:translate(20px,-8px)}38%{transform:translate(8px,-26px)}52%{transform:translate(-14px,-18px)}66%{transform:translate(-4px,-4px)}80%{transform:translate(16px,-22px)}100%{transform:translate(-18px,-6px)}}'
+'@keyframes dgflyaway{to{transform:translate(var(--ax,30px),-90px);opacity:0}}'
+'.dgstream{position:absolute;pointer-events:none;overflow:visible;z-index:7}'
+'.dgstream .s1{fill:none;stroke:#F2CC3A;stroke-width:3.4;stroke-linecap:round}'
+'.dgstream .s2{fill:none;stroke:#FFF2A6;stroke-width:1.4;stroke-linecap:round;stroke-dasharray:5 6;animation:dgsflow .35s linear infinite}'
+'@keyframes dgsflow{to{stroke-dashoffset:-11}}'
+'.dgpuddle{position:absolute;pointer-events:none;z-index:7;border-radius:50%;background:radial-gradient(ellipse at 40% 35%,#FFF0A0 0,#F2CC3A 55%,#E0B52A 100%);border:1.5px solid #C99A1C;opacity:.9;transform:scale(0);transition:transform 3s ease-out,opacity 1s}'
+'.dgpuddle.go{transform:scale(1)}.dgpuddle.out{opacity:0}'
+'@media print{#dg,.dgpoo,.dgfly,.dgstream,.dgpuddle{display:none!important}}'
+'@media (prefers-reduced-motion:reduce){.dgstream .s2,#dg .tail,#dg.sitting #dgi,#dg.strain #dgi,#dg.slink #dgi,.dgfly,.dgfly .w{animation:none!important}}';
var stl=document.createElement('style'); stl.textContent=css; document.head.appendChild(stl);

var h='<div id="dgs"><svg id="dgchute" viewBox="0 0 122 150" aria-hidden="true">'
+'<path d="M4 56 C6 14 34 2 61 2 C88 2 116 14 118 56 C108 46 98 46 90 56 C82 46 70 46 61 56 C52 46 40 46 32 56 C24 46 14 46 4 56 Z" fill="#F97316" stroke="#7A3B0A" stroke-width="2.4" stroke-linejoin="round"/>'
+'<path d="M61 2 C52 16 45 34 47 54 M61 2 C70 16 77 34 75 54" fill="none" stroke="#fff" stroke-width="2.4" opacity=".75"/>'
+'<path d="M6 56 L40 134 M116 56 L82 134 M61 56 L61 128" fill="none" stroke="#7A3B0A" stroke-width="1.5" stroke-linecap="round"/></svg>'
+'<div id="dgshadow"></div><div id="dgi">';
['walk','face','glide','climb','poop','pee'].forEach(function(k){
  h+='<div class="dp cyc" id="dp-'+k+'" style="width:'+SZ[k][0]+'px;height:'+SZ[k][1]+'px">';
  for(var i=0;i<N[k];i++)h+='<img alt="" draggable="false" src="'+BASE+k+i+'.webp">';
  h+='</div>';
});
h+='<div class="dp" id="dp-sit" style="width:73px;height:93px;--wag:.62s;--amp:8deg"><img alt="" draggable="false" src="'+BASE+'sit_body.webp"><img class="tail" alt="" draggable="false" src="'+BASE+'sit_tail.webp" style="transform-origin:20px 79.6px"></div>';
h+='</div></div>';
var dog=document.createElement('div'); dog.id='dg'; dog.setAttribute('role','img'); dog.setAttribute('aria-label','כלב שיצו'); dog.innerHTML=h; document.body.appendChild(dog);
var dgs=document.getElementById('dgs');
var poses={};['walk','face','glide','climb','poop','pee','sit'].forEach(function(k){poses[k]=document.getElementById('dp-'+k)});
var imgs={};['walk','face','glide','climb','poop','pee'].forEach(function(k){imgs[k]=poses[k].querySelectorAll('img')});
dog.addEventListener('contextmenu',function(e){e.preventDefault()});

var S={mode:'walk',x:0,y:0,face:1,tx:0,until:0,t0:0,dur:0,from:null,rot:0,dist:0,init:false,homeBar:true,stage:0,hold:'walk',prev:'walk',nextBark:0};
var curCls='';
function setFrame(k,n){ var l=imgs[k]; for(var i=0;i<l.length;i++)l[i].classList.toggle('cur',i===n); }
function show(name,cls){
  for(var k in poses)poses[k].classList.toggle('show',k===name);
  curCls=cls||''; dog.className=curCls;
}
function scaleNow(){ var m=Math.max(72,Math.min(96,innerWidth*.2))/96; dgs.style.transform='scale('+m.toFixed(3)+')'; }
function place(){
  dog.style.transformOrigin=(S.mode==='glide'?'55px -50px':'55px 110px');
  dog.style.transform='translate('+(S.x-55).toFixed(1)+'px,'+(S.y-110).toFixed(1)+'px)'+(S.rot?' rotate('+S.rot.toFixed(1)+'deg)':'');
}
/* הקו עליו הכלב עומד: קצה מלבן ההודעה, או מעל התפריט התחתון כשגוללים למטה */
function ground(){
  var card=document.querySelector('#announce .announce');
  if(card){
    var r=card.getBoundingClientRect();
    if(scrollY<5)S.restTop=r.top;
    var lim=scrollY<5?50:Math.min(110,Math.max(50,(S.restTop||110)-30));
    if(r.width>150&&r.top>lim&&r.top<innerHeight-40){
      var l=r.left+14+46,rr=r.right-14-46;
      return{y:r.top+3,bar:true,l:l,r:Math.max(l+50,rr),cx:(r.left+r.right)/2};
    }
  }
  var y=innerHeight-6,tb=document.querySelector('.tabbar');
  if(tb&&getComputedStyle(tb).display!=='none'){var rc=tb.getBoundingClientRect();if(rc.height)y=rc.top+1}
  return{y:y,bar:false,l:58,r:Math.max(100,innerWidth-58),cx:innerWidth/2};
}
function clamp(v,a,b){return Math.min(Math.max(v,a),b)}
function avoid(x,g){
  if(g.bar&&Math.abs(x-g.cx)<86)x=x<g.cx?g.cx-88:g.cx+88;
  return clamp(x,g.l,g.r);
}
function rnd(g){return avoid(g.l+Math.random()*(g.r-g.l),g)}

function setStep(d){ var n=Math.floor(d/5.2)%6; if(n!==S.curStep){ S.curStep=n; setFrame('walk',n); } }
function startWalk(){
  var g=ground(); S.mode='walk'; S.y=g.y; S.rot=0;
  var tx=rnd(g); if(Math.abs(tx-S.x)<60)tx=avoid(S.x<g.cx?S.x+90:S.x-90,g);
  S.tx=tx; S.face=tx>S.x?1:-1; S.dist=0; S.curStep=-1;
  poses.walk.classList.toggle('flip',S.face>0); show('walk',''); setStep(0); place();
}
function startSit(ms){ S.mode='sit'; S.rot=0; S.y=ground().y; S.until=performance.now()+(ms||3500); show('sit','sitting'); place(); }
function startGlide(){
  if(S.mode==='glide')return; var g=ground();
  S.from={x:S.x,y:S.y}; S.mode='glide'; S.t0=performance.now();
  var dist=Math.hypot(clamp(S.x,g.l,g.r)-S.x,g.y-S.y); S.dur=Math.min(8000,Math.max(3200,dist/.12)); S.rot=0;
  show('glide','gliding'); S.curG=-1; place();
}
function startFly(){
  if(S.mode==='fly')return; var g=ground();
  S.mode='fly'; S.from={x:S.x,y:S.y}; S.t0=performance.now(); S.rot=0;
  S.dur=Math.min(8000,Math.max(3500,Math.hypot(clamp(S.x,g.l,g.r)-S.x,g.y-S.y)/.1));
  show('climb','flying'); S.curC=-1; place();
}
function startAngry(){ if(S.mode==='chase'||S.mode==='pee'||S.mode==='glide'||S.mode==='fly'||S.mode==='poop'||S.mode==='slink')return; S.mode='angry'; S.until=performance.now()+3000; S.nextBark=0; S.rot=0; show('face','angry'); setFrame('face',2); place(); }
function hop(){
  if(S.mode==='chase'||S.mode==='pee'||S.mode==='glide'||S.mode==='fly'||S.mode==='angry'||S.mode==='poop'||S.mode==='slink')return;
  S.prev=S.mode==='hop'?S.prev:S.mode; S.mode='hop'; S.until=performance.now()+900; S.rot=0; show('face',''); setFrame('face',0); place(); barkOnce(false);
}
function barkOnce(big){
  setFrame('face',big?3:1); clearTimeout(S.fT); S.fT=setTimeout(function(){setFrame('face',big?2:0)},260);
  dog.classList.remove('barking'); void dog.offsetWidth; dog.classList.add('barking');
  if(navigator.vibrate)try{navigator.vibrate(big?[40,30,60]:30)}catch(e){}
}

/* ---- קקי ---- */
var POO='<svg viewBox="0 0 30 28" width="30" height="28" aria-hidden="true"><path d="M3 26 C0 26 0 19 6 18 C4 13 9 10 13 11 C12 6 18 3 20 7 C23 6 25 9 24 12 C28 13 29 20 27 24 C27 26 24 26 24 26 Z" fill="#7A4A21" stroke="#4A2A10" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 20 C12 18 18 18 22 20 M11 14 C14 12.5 18 12.5 20 14" fill="none" stroke="#A8672F" stroke-width="2" stroke-linecap="round"/><path d="M13 7 C14 5 17 4.5 18 6" fill="none" stroke="#B8793C" stroke-width="1.6" stroke-linecap="round"/></svg>';
var FLY='<svg viewBox="0 0 12 10" width="12" height="10" aria-hidden="true"><g class="w"><ellipse cx="3.5" cy="2.5" rx="3" ry="1.7" fill="#fff" fill-opacity=".85" stroke="#8aa" stroke-width=".5"/><ellipse cx="8.5" cy="2.5" rx="3" ry="1.7" fill="#fff" fill-opacity=".85" stroke="#8aa" stroke-width=".5"/></g><ellipse cx="6" cy="6" rx="2.6" ry="2.4" fill="#222"/><circle cx="6" cy="4" r="1.3" fill="#222"/><circle cx="5.3" cy="3.6" r=".45" fill="#d33"/><circle cx="6.7" cy="3.6" r=".45" fill="#d33"/></svg>';
function dropPoop(){
  /* הגוש נשאר במקום בדף (גולל איתו), ונעלם אחרי 10 שניות */
  var m=Math.max(72,Math.min(96,innerWidth*.2))/96;
  var x=S.x-S.face*44*m+scrollX, y=S.y+scrollY;
  var p=document.createElement('div'); p.className='dgpoo'; p.style.left=(x-15)+'px'; p.style.top=(y-26)+'px'; p.innerHTML=POO; document.body.appendChild(p);
  var flies=[];
  setTimeout(function(){ for(var k=0;k<4;k++){ var f=document.createElement('div'); f.className='dgfly'; f.style.left=(x-6+(k-1.5)*6)+'px'; f.style.top=(y-34)+'px'; f.style.setProperty('--d',(1.8+k*.45)+'s'); f.style.setProperty('--ax',((k%2?1:-1)*(20+k*10))+'px'); f.style.animationDelay=(-k*.6)+'s'; f.innerHTML=FLY; document.body.appendChild(f); flies.push(f); } },700);
  setTimeout(function(){ flies.forEach(function(f){f.classList.add('away')}); p.classList.add('out'); },9000);
  setTimeout(function(){ flies.forEach(function(f){f.remove()}); p.remove(); },10300);
}
function startPoop(){
  if(S.mode==='chase'||S.mode==='pee'||S.mode==='glide'||S.mode==='fly'||S.mode==='poop'||S.mode==='slink')return;
  S.mode='poop'; S.rot=0; S.y=ground().y; S.t0=performance.now(); S.stage=0;
  poses.poop.classList.toggle('flip',S.face>0); show('poop','strain'); setFrame('poop',0); place();
}
function startSlink(){
  var g=ground(); S.mode='slink'; S.t0=performance.now();
  var tx=avoid(S.x+S.face*110,g); if(Math.abs(tx-S.x)<50){ S.face=-S.face; tx=avoid(S.x+S.face*110,g); }
  S.tx=tx; S.face=tx>S.x?1:-1; poses.poop.classList.toggle('flip',S.face>0); show('poop','slink'); setFrame('poop',3); place();
}


/* ---- פיפי: החלקה של האצבע על הכלב ---- */
var peeT=0;
function startPee(){
  if(!(S.mode==='walk'||S.mode==='sit'||S.mode==='hop'))return;
  S.mode='pee'; S.rot=0; S.y=ground().y; S.t0=performance.now(); S.stage=0;
  poses.pee.classList.toggle('flip',S.face>0); show('pee',''); setFrame('pee',0); place();
}
function pour(){
  var m=Math.max(72,Math.min(96,innerWidth*.2))/96, d=-S.face;
  var sx=S.x+d*43.7*m+scrollX, sy=S.y-32.8*m+scrollY, ex=S.x+d*70*m+scrollX, ey=S.y+scrollY;
  var NS='http://www.w3.org/2000/svg', svg=document.createElementNS(NS,'svg'); svg.setAttribute('class','dgstream');
  svg.style.left='0px'; svg.style.top='0px'; svg.setAttribute('width','1'); svg.setAttribute('height','1');
  var dd='M'+sx+' '+sy+' Q'+(sx+d*20*m)+' '+(sy-14*m)+' '+ex+' '+ey;
  var p1=document.createElementNS(NS,'path'); p1.setAttribute('class','s1'); p1.setAttribute('d',dd);
  var p2=document.createElementNS(NS,'path'); p2.setAttribute('class','s2'); p2.setAttribute('d',dd);
  svg.appendChild(p1); svg.appendChild(p2); document.body.appendChild(svg);
  var L=p1.getTotalLength(); p1.style.strokeDasharray=L; p1.style.strokeDashoffset=L; p1.style.transition='stroke-dashoffset .3s ease-out';
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ p1.style.strokeDashoffset=0; }) });
  var pd=document.createElement('div'); pd.className='dgpuddle'; pd.style.left=(ex-26*m)+'px'; pd.style.top=(ey-6*m)+'px'; pd.style.width=(52*m)+'px'; pd.style.height=(11*m)+'px'; document.body.appendChild(pd);
  setTimeout(function(){ pd.classList.add('go') },300);
  setTimeout(function(){ p1.style.transition='stroke-dashoffset .35s ease-in'; p1.style.strokeDashoffset=-L; p2.style.opacity=0; },3000);
  setTimeout(function(){ svg.remove() },3500);
  setTimeout(function(){ pd.classList.add('out') },8500);
  setTimeout(function(){ pd.remove() },9700);
}

/* ---- החתול: חי רק על הדשא. הכלב מגרש אותו כשהוא למטה ---- */
var ct=null,cEl={},C={st:'away',x:0,dir:-1,fdir:1,tx:0,until:0,dist:0,cur:'',nextChase:0};
function catInit(){
  if(reduce)return;
  var st2=document.createElement('style');
  st2.textContent='#ctw{position:absolute;left:0;right:0;top:-50px;bottom:-30px;overflow:hidden;z-index:2;pointer-events:none;direction:ltr;contain:paint}#ct{position:absolute;left:0;bottom:16px;width:0;height:0;z-index:2;pointer-events:none;will-change:transform;display:none}#ct.on{display:block}#ct img{position:absolute;left:0;bottom:0;display:none;pointer-events:none;-webkit-user-drag:none;transform:translateX(-50%)}#ct img.cur{display:block}#ct.flip img{transform:translateX(-50%) scaleX(-1)}@media print{#ct{display:none!important}}';
  document.head.appendChild(st2);
  ct=document.createElement('div'); ct.id='ct';
  var L=[['w',6,80,57],['r',6,80,57],['sit',0,52,61],['scare',0,64,65]],ih='';
  L.forEach(function(a){ if(a[1]){ for(var i=0;i<a[1];i++)ih+='<img alt="" draggable="false" data-k="'+a[0]+i+'" width="'+a[2]+'" height="'+a[3]+'" src="icons/cat/'+a[0]+i+'.webp">'; } else ih+='<img alt="" draggable="false" data-k="'+a[0]+'" width="'+a[2]+'" height="'+a[3]+'" src="icons/cat/'+a[0]+'.webp">'; });
  ct.innerHTML=ih; var ctw=document.createElement('div'); ctw.id='ctw'; ctw.appendChild(ct); gr.appendChild(ctw);
  [].forEach.call(ct.children,function(e){cEl[e.getAttribute('data-k')]=e});
  var fr=document.createElement('div'); fr.style.cssText='position:absolute;left:0;right:0;bottom:-20px;height:12px;z-index:3;background:url(icons/grass.webp) repeat-x center bottom/auto 56px'; gr.appendChild(fr);
  C.x=60+Math.random()*Math.max(60,gr.clientWidth-120); C.st='sit'; C.until=performance.now()+2000; C.dir=Math.random()<.5?-1:1; C.nextChase=performance.now()+8000;
  cShow('sit'); ct.classList.add('on');
}
function cShow(k){ if(C.cur===k)return; if(cEl[C.cur])cEl[C.cur].classList.remove('cur'); C.cur=k; if(cEl[k])cEl[k].classList.add('cur'); }
function cPlace(){ ct.style.transform='translateX('+C.x.toFixed(1)+'px)'; ct.classList.toggle('flip',C.dir>0); }
function cWalk(){ var GW=gr.clientWidth,tx=40+Math.random()*Math.max(40,GW-80); if(Math.abs(tx-C.x)<50)tx=C.x<GW/2?C.x+90:C.x-90; C.tx=Math.min(Math.max(tx,30),GW-30); C.dir=C.tx>C.x?1:-1; C.st='walk'; C.dist=0; }
function cVisible(){ var r=gr.getBoundingClientRect(); return r.bottom>30&&r.top<innerHeight&&C.x>-10&&C.x<innerWidth+10; }
function cUpdate(ts,dt){
  if(!ct)return; var GW=gr.clientWidth;
  if(C.st==='away'){ if(ts>C.until){ var left=Math.random()<.5; C.x=left?-50:GW+50; C.tx=40+Math.random()*(GW-80); C.dir=C.tx>C.x?1:-1; C.st='walk'; C.dist=0; C.nextChase=ts+8000; cShow('w0'); cPlace(); } return; }
  if(C.st==='walk'){
    var dx=C.tx-C.x,stp=34*dt;
    if(Math.abs(dx)<=stp){ C.x=C.tx; C.st='sit'; C.until=ts+2500+Math.random()*3500; cShow('sit'); }
    else { C.x+=Math.sign(dx)*stp; C.dist+=stp; cShow('w'+(Math.floor(C.dist/4.5)%6)); }
    cPlace();
  }else if(C.st==='sit'){
    if(ts>C.until)cWalk(); cPlace();
  }else if(C.st==='scare'){
    cPlace(); if(ts>C.until){ C.st='flee'; C.dir=C.fdir; C.dist=0; }
  }else if(C.st==='flee'){
    C.x+=C.fdir*240*dt; C.dist+=240*dt; cShow('r'+(Math.floor(C.dist/15)%6)); cPlace();
    if(C.x<-70||C.x>GW+70){ C.st='away'; C.until=ts+40000+Math.random()*50000; }
  }
}
function canChase(ts){ return ct&&(C.st==='walk'||C.st==='sit')&&ts>C.nextChase&&ts>(S.noChaseUntil||0)&&cVisible()&&Math.abs(C.x-S.x)>30; }
function startChase(ts){
  S.mode='chase'; S.stage=0; S.t0=ts; S.rot=0; S.y=ground().y;
  S.face=C.x>S.x?1:-1; C.fdir=S.face; C.dir=-S.face; C.st='scare'; C.until=ts+560; cShow('scare');
  show('face',''); setFrame('face',3); barkOnce(true); place();
}

/* ---- לולאת האנימציה ---- */
var last=0;
function frame(ts){
  var dt=Math.min(.05,(ts-(last||ts))/1000); last=ts;
  var g=ground(); scaleNow();
  var m=S.mode;
  if(ct){ cUpdate(ts,dt); if(!g.bar&&S.init&&(m==='walk'||m==='sit')&&canChase(ts)){ startChase(ts); m=S.mode; } }
  if((m==='walk'||m==='sit')&&S.init&&g.bar!==S.homeBar){ S.homeBar=g.bar; if(g.bar)startFly(); else startGlide(); m=S.mode; }
  if(m==='walk'){
    S.y=g.y;
    var dx=S.tx-S.x,st=52*dt;
    if(Math.abs(dx)<=st){ S.x=S.tx; startSit(2800+Math.random()*2500); }
    else { S.x+=Math.sign(dx)*st; S.dist+=st; setStep(S.dist); place(); }
  }else if(m==='sit'){
    S.y=g.y; S.x=clamp(S.x,g.l,g.r); place(); if(ts>S.until)startWalk();
  }else if(m==='glide'){
    if(g.bar){ S.from={x:S.x,y:S.y}; S.t0=ts; S.dur=3500; S.homeBar=true; S.mode='fly'; show('climb','flying'); S.curC=-1; requestAnimationFrame(frame); return; }
    var A=S.from,Bx=clamp(A.x,g.l,g.r),By=g.y;
    var u=Math.min(1,(ts-S.t0)/S.dur),e=(ts-S.t0)/1000,env=Math.min(1,(1-u)*4,u*5+.25);
    var gi=Math.floor(e/.4)%2; if(gi!==S.curG){S.curG=gi;setFrame('glide',gi)}
    S.x=clamp(A.x+(Bx-A.x)*u+Math.sin(e*.95)*46*env,50,innerWidth-50); S.y=A.y+(By-A.y)*u;
    S.rot=Math.cos(e*.95)*10*env+Math.sin(e*2.3)*2.2*env;
    if(reduce||u>=1){ S.x=clamp(S.x,g.l,g.r); S.y=g.y; S.rot=0; S.homeBar=false; S.face=1; startSit(1800); } else place();
  }else if(m==='fly'){
    if(!g.bar){ S.from={x:S.x,y:S.y}; S.t0=ts; S.dur=1800; S.homeBar=false; S.mode='glide'; show('glide','gliding'); S.curG=-1; requestAnimationFrame(frame); return; }
    var A2=S.from,Bx2=clamp(A2.x,g.l,g.r),By2=g.y;
    var u2=Math.min(1,(ts-S.t0)/S.dur),k=1-Math.pow(1-u2,2);
    var ci=[0,1,2,1][Math.floor((ts-S.t0)/260)%4]; if(ci!==S.curC){S.curC=ci;setFrame('climb',ci)}
    S.x=A2.x+(Bx2-A2.x)*k+Math.sin(u2*9)*10*(1-u2); S.y=A2.y+(By2-A2.y)*k; S.rot=Math.sin(u2*9)*4*(1-u2);
    if(reduce||u2>=1){ S.x=Bx2; S.y=g.y; S.rot=0; S.homeBar=g.bar; startSit(2200); } else place();
  }else if(m==='angry'||m==='hop'){
    S.y=g.y;
    if(m==='angry'&&ts>S.nextBark){ S.nextBark=ts+520; barkOnce(true); }
    place();
    if(ts>S.until){ var back=m==='hop'?S.prev:S.hold; if(back==='sit')startSit(2200); else startWalk(); }
  }else if(m==='pee'){
    S.y=g.y; place();
    var qe=ts-S.t0;
    if(S.stage===0&&qe>1300){ S.stage=1; setFrame('pee',1); }
    else if(S.stage===1&&qe>1900){ S.stage=2; setFrame('pee',2); pour(); }
    else if(S.stage===2&&qe>5200){ S.stage=3; setFrame('pee',1); }
    else if(S.stage===3&&qe>5700){ startSit(1800); }
  }else if(m==='poop'){
    S.y=g.y; place();
    var pe=ts-S.t0;
    if(S.stage===0&&pe>1500){ S.stage=1; setFrame('poop',1); dog.className=''; dropPoop(); }
    else if(S.stage===1&&pe>2600){ S.stage=2; setFrame('poop',2); }
    else if(S.stage===2&&pe>4000){ startSlink(); }
  }else if(m==='chase'){
    S.y=g.y; var ce=ts-S.t0;
    if(g.bar){ S.mode='sit'; S.until=0; S.rot=0; S.noChaseUntil=ts+15000; requestAnimationFrame(frame); return; }
    if(S.stage===0){ place(); if(ce>650){ S.stage=1; S.dist=0; S.curStep=-1; poses.walk.classList.toggle('flip',S.face>0); show('walk',''); setStep(0); } }
    else{
      var stc=175*dt; S.x+=S.face*stc; S.dist+=stc; S.rot=Math.sin(S.dist*.22)*1.8;
      var nn=Math.floor(S.dist/9)%6; if(nn!==S.curStep){ S.curStep=nn; setFrame('walk',nn); }
      var edge=(S.face>0&&S.x>=g.r)||(S.face<0&&S.x<=g.l);
      S.x=clamp(S.x,g.l,g.r); place();
      if(C.st==='away'||edge||ce>8000){ S.rot=0; S.mode='walk'; S.prev='walk'; S.noChaseUntil=ts+12000; hop(); }
    }
  }else if(m==='slink'){
    S.y=g.y;
    var dx2=S.tx-S.x,st2=34*dt; setFrame('poop',Math.floor((ts-S.t0)/260)%2?2:3);
    if(Math.abs(dx2)<=st2){ S.x=S.tx; startSit(2200); } else { S.x+=Math.sign(dx2)*st2; place(); }
  }
  requestAnimationFrame(frame);
}

/* ---- נגיעות: לחיצה קצרה = נביחה, שלוש מהירות = כעס, לחיצה ארוכה = קקי, החלקה = פיפי ---- */
var lpT=0,lpDone=false,taps=0,tapT=0;
var sx=0,sy=0,swiped=false;
dog.addEventListener('pointerdown',function(e){
  e.preventDefault(); lpDone=false; swiped=false; sx=e.clientX; sy=e.clientY; clearTimeout(lpT);
  lpT=setTimeout(function(){ lpDone=true; if(S.mode==='walk'||S.mode==='sit'||S.mode==='hop')startPoop(); },650);
});
dog.addEventListener('pointermove',function(e){
  if(swiped||lpDone||!e.buttons&&e.pointerType==='mouse')return;
  if(Math.hypot(e.clientX-sx,e.clientY-sy)>28){
    swiped=true; clearTimeout(lpT); taps=0; clearTimeout(tapT);
    if(S.mode==='walk'||S.mode==='sit'||S.mode==='hop')startPee();
  }
});
dog.addEventListener('pointerup',function(e){
  e.stopPropagation(); clearTimeout(lpT); if(lpDone||swiped)return;
  if(S.mode==='poop'||S.mode==='slink'||S.mode==='glide'||S.mode==='fly'||S.mode==='pee'||S.mode==='chase')return;
  taps++; clearTimeout(tapT); tapT=setTimeout(function(){taps=0},2500);
  if(taps>=3){ taps=0; clearTimeout(peeT); var p=S.mode==='hop'?S.prev:S.mode; S.hold=p==='sit'?'sit':'walk'; startAngry(); }
  else hop();
});
dog.addEventListener('pointercancel',function(){ clearTimeout(lpT); lpDone=true; });
dog.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); });

/* ---- התחלה ---- */
(function init(){
  var g=ground(); scaleNow();
  S.homeBar=g.bar; S.init=true; S.x=g.bar?clamp(g.cx+130,g.l,g.r):(g.l+g.r)/2; S.y=g.y;
  if(reduce){ S.face=-1; poses.walk.classList.remove('flip'); show('walk',''); setFrame('walk',0); place(); return; }
  catInit(); startWalk(); requestAnimationFrame(frame);
})();
}
})();
