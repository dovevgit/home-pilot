(function(){
'use strict';
/* התוכי של הצ'אט: עומד על הקצה העליון של שדה הכתיבה.
   מנקה נוצות, מצייץ, מסתובב לאורך הקצה ומנפנף בכנפיים.
   לחיצה = ציוץ וכנפיים. לחיצה ארוכה = קערת גרגירים והוא אוכל. החלקה עליו = הוא עף ברחבי המסך ונוחת חזרה. שליחת הודעה = הוא מנפנף.
   לא חוסם את שדה הכתיבה והכפתורים (הוא עומד מעליהם). */
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var form=document.getElementById('form'); if(!form)return;
var CW=100.65, CH=75.9;   /* תא אחד בגיליון (183x138 פיקסלים) בגודל CSS */
var st=document.createElement('style');
st.textContent='#pk{position:absolute;left:0;bottom:100%;margin-bottom:-4px;width:'+CW+'px;height:'+CH+'px;pointer-events:none;direction:ltr;z-index:2;will-change:transform;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}'
+'#pk .sp{position:absolute;inset:0;background:url(icons/parrot/parrot.webp) no-repeat;background-size:'+(CW*6)+'px '+(CH*4)+'px;background-position:0 0}'
+'#pk.r .sp{transform:scaleX(-1)}'
+'#pk.fly{position:fixed;left:0;top:0;bottom:auto;margin:0;z-index:40}#pk.fly .hit{pointer-events:none}'
+'#pk .hit{position:absolute;left:20%;right:14%;top:16%;bottom:0;pointer-events:auto;touch-action:none;cursor:pointer;-webkit-tap-highlight-color:transparent}'
+'#pk.walk .sp{background-position-y:'+(-CH)+'px;animation:pkw .72s steps(6,end) infinite}'
+'@keyframes pkw{from{background-position-x:0}to{background-position-x:'+(-CW*6)+'px}}'
+'@media print{#pk{display:none!important}}';
document.head.appendChild(st);
var pk=document.createElement('div'); pk.id='pk'; pk.setAttribute('aria-hidden','true');
pk.innerHTML='<div class="sp"></div><div class="hit"></div>';
form.appendChild(pk);
var sp=pk.firstChild, hit=pk.lastChild;
var X=14, T=0, busy=false, eating=false, flying=false, seq=0, walkT=0;
function rnd(a,b){ return a+Math.random()*(b-a); }
function setX(x,ms){ X=x; pk.style.transition=ms?'transform '+ms+'ms linear':'none'; pk.style.transform='translateX('+x.toFixed(1)+'px)'; }
function frame(r,c){ pk.classList.remove('walk'); sp.style.backgroundPosition=(-c*CW).toFixed(2)+'px '+(-r*CH).toFixed(2)+'px'; }
function stand(){ frame(0,0); }
/* מריץ רצף פריימים: [שורה, עמודה, משך במילישניות] */
function play(steps,done){
  var my=++seq,i=0;
  (function go(){
    if(my!==seq)return;
    if(i>=steps.length){ stand(); if(done)done(); return; }
    var s=steps[i++]; frame(s[0],s[1]); setTimeout(go,s[2]);
  })();
}
function end(){ busy=false; eating=false; next(rnd(800,2500)); }
function chirp(){ busy=true; play([[0,1,230],[0,3,230],[0,1,230],[0,3,230],[0,0,200]],end); }
function wink(){ busy=true; play([[0,2,1000]],end); }
function preen(){ busy=true; play([[0,5,1500]],end); }
function flap(){ busy=true; play([[2,0,120],[2,1,120],[2,2,120],[2,3,120],[2,2,120],[2,3,120],[2,2,120],[2,3,120],[2,4,130],[2,5,160]],end); }
function eat(){
  if(eating)return; stopWalk(); busy=true; eating=true;
  var s=[[3,0,700]]; for(var k=0;k<4;k++){ s.push([3,1,330]); s.push([3,2,330]); }
  s.push([3,3,750],[3,4,650],[3,5,900]);
  play(s,end);
  if(navigator.vibrate)try{navigator.vibrate(20)}catch(_){}
}
function stopWalk(){
  clearTimeout(walkT);
  if(pk.classList.contains('walk')){
    var fx=form.getBoundingClientRect().left, nx=pk.getBoundingClientRect().left-fx;
    pk.classList.remove('walk'); setX(nx,0); stand();
  }
}
function walkTo(tx,after){
  busy=true;
  var dist=Math.abs(tx-X); if(dist<10){ after(); return; }
  var ms=dist/36*1000;
  pk.classList.toggle('r',tx>X); sp.style.backgroundPosition='';
  pk.classList.add('walk'); void pk.offsetWidth; setX(tx,ms);
  walkT=setTimeout(function(){ pk.classList.remove('walk'); stand(); after(); },ms+30);
}
/* סיור: הולך לקצה השני של המסך, לפעמים עוצר באמצע הדרך, ושם מנוח */
function patrol(){
  var min=6,max=Math.max(min+40,form.clientWidth-CW-6),far=X<(min+max)/2?rnd(max-50,max):rnd(min,min+50);
  var mid=Math.random()<.3, tx=mid?X+(far-X)*rnd(.35,.7):far;
  walkTo(tx,function(){ busy=false; next(mid?rnd(300,900):rnd(600,1800)); });
}
/* מנוחה: עומד בשקט או מצייץ, קורץ ומנקה נוצות */
function rest(){
  busy=true; var r=Math.random();
  if(r<.35){ stand(); var my=seq; setTimeout(function(){ if(my===seq&&!flying&&!eating)end(); },rnd(3500,7000)); }
  else if(r<.6)chirp(); else if(r<.8)wink(); else preen();
}
/* טיסה: מהקצה של שדה הכתיבה, דרך כמה נקודות במסך, ונחיתה חזרה על הקצה */
var FL=[2,3,2,3,4,3];
function fly(vx,vy){
  if(eating||flying)return;
  stopWalk(); ++seq; busy=true; flying=true;
  var r=pk.getBoundingClientRect(),fr=form.getBoundingClientRect(),W=innerWidth;
  var minX=8,maxX=Math.max(minX+20,W-CW-8),minY=Math.min(90,Math.max(8,fr.top-CH-60)),maxY=Math.max(minY+20,fr.top-CH-12);
  function cl(x,y){ return {x:Math.min(maxX,Math.max(minX,x)),y:Math.min(maxY,Math.max(minY,y))}; }
  var len=Math.hypot(vx,vy)||1,pts=[cl(r.left+vx/len*rnd(160,240),r.top+vy/len*rnd(120,200)-40)];
  for(var i=0;i<3;i++)pts.push(cl(rnd(minX,maxX),rnd(minY,maxY)));
  var land={x:rnd(6,Math.max(10,fr.width-CW-6))+fr.left,y:fr.top+5-CH}; pts.push(land);
  document.body.appendChild(pk); pk.classList.remove('walk'); pk.classList.add('fly');
  var cur={x:r.left,y:r.top},seg=0,k=0;
  function tr(p){ return 'translate('+p.x.toFixed(1)+'px,'+p.y.toFixed(1)+'px)'; }
  pk.style.transition='none'; pk.style.transform=tr(cur);
  var fi=setInterval(function(){ frame(2,FL[k++%FL.length]); },110); frame(2,2);
  function step(){
    if(seg>=pts.length){ finish(); return; }
    var p=pts[seg++],d=Math.hypot(p.x-cur.x,p.y-cur.y),ms=Math.max(550,d/230*1000);
    if(Math.abs(p.x-cur.x)>4)pk.classList.toggle('r',p.x>cur.x);
    var a=pk.animate([{transform:tr(cur)},{transform:tr(p)}],{duration:ms,easing:'ease-in-out',fill:'forwards'});
    a.onfinish=function(){ pk.style.transform=tr(p); a.cancel(); cur=p; step(); };
  }
  function finish(){
    clearInterval(fi);
    var f2=form.getBoundingClientRect();
    form.appendChild(pk); pk.classList.remove('fly'); flying=false;
    setX(cur.x-f2.left,0);
    play([[2,4,140],[2,5,180]],end);
  }
  step();
}
function tick(){
  if(document.visibilityState!=='visible'||!form.getClientRects().length||busy){ next(3000); return; }
  var r=Math.random();
  if(r<.08)flap(); else if(r<.30)rest(); else patrol();
}
function next(ms){ clearTimeout(T); T=setTimeout(tick,ms); }
/* לחיצה = ציוץ וכנפיים, לחיצה ארוכה = אוכל */
var lp=0,lpDone=false,swiped=false,down=false,px=0,py=0;
hit.addEventListener('pointerdown',function(e){
  e.preventDefault(); e.stopPropagation(); lpDone=false; swiped=false; down=true; px=e.clientX; py=e.clientY; clearTimeout(lp);
  lp=setTimeout(function(){ lpDone=true; eat(); },600);
});
hit.addEventListener('pointermove',function(e){
  if(!down||swiped||lpDone)return;
  var dx=e.clientX-px,dy=e.clientY-py;
  if(Math.hypot(dx,dy)>28){ swiped=true; clearTimeout(lp); fly(dx,dy); }
});
hit.addEventListener('pointerup',function(e){
  e.stopPropagation(); clearTimeout(lp); down=false;
  if(lpDone||swiped||eating||flying)return;
  stopWalk(); flap(); if(navigator.vibrate)try{navigator.vibrate(15)}catch(_){}
});
hit.addEventListener('pointercancel',function(){ clearTimeout(lp); lpDone=true; down=false; });
hit.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); });
hit.addEventListener('contextmenu',function(e){ e.preventDefault(); });
/* שליחת הודעה: הוא מנפנף */
form.addEventListener('submit',function(){
  var t=document.getElementById('text');
  if(t&&t.value.trim()&&!eating&&!flying){ stopWalk(); flap(); }
},true);
setX(X,0); stand(); next(rnd(1500,3000));
})();
