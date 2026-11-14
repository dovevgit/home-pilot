(function(){
'use strict';
/* התוכי של הצ'אט: עומד על הקצה העליון של שדה הכתיבה.
   מנקה נוצות, מצייץ, מסתובב לאורך הקצה ומנפנף בכנפיים.
   לחיצה = ציוץ וכנפיים. לחיצה ארוכה = קערת גרגירים והוא אוכל. שליחת הודעה = הוא מנפנף.
   לא חוסם את שדה הכתיבה והכפתורים (הוא עומד מעליהם). */
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var form=document.getElementById('form'); if(!form)return;
var CW=100.65, CH=75.9;   /* תא אחד בגיליון (183x138 פיקסלים) בגודל CSS */
var st=document.createElement('style');
st.textContent='#pk{position:absolute;left:0;bottom:100%;margin-bottom:-4px;width:'+CW+'px;height:'+CH+'px;pointer-events:none;direction:ltr;z-index:2;will-change:transform;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}'
+'#pk .sp{position:absolute;inset:0;background:url(icons/parrot/parrot.webp) no-repeat;background-size:'+(CW*6)+'px '+(CH*4)+'px;background-position:0 0}'
+'#pk.r .sp{transform:scaleX(-1)}'
+'#pk .hit{position:absolute;left:20%;right:14%;top:16%;bottom:0;pointer-events:auto;touch-action:manipulation;cursor:pointer;-webkit-tap-highlight-color:transparent}'
+'#pk.walk .sp{background-position-y:'+(-CH)+'px;animation:pkw .75s steps(6,end) infinite}'
+'@keyframes pkw{from{background-position-x:0}to{background-position-x:'+(-CW*6)+'px}}'
+'@media print{#pk{display:none!important}}';
document.head.appendChild(st);
var pk=document.createElement('div'); pk.id='pk'; pk.setAttribute('aria-hidden','true');
pk.innerHTML='<div class="sp"></div><div class="hit"></div>';
form.appendChild(pk);
var sp=pk.firstChild, hit=pk.lastChild;
var X=14, T=0, busy=false, eating=false, seq=0, walkT=0;
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
function end(){ busy=false; eating=false; next(rnd(2500,7000)); }
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
function walk(){
  busy=true;
  var min=6,max=Math.max(min+40,form.clientWidth-CW-6),tx=rnd(min,max);
  if(Math.abs(tx-X)<50)tx=X<(min+max)/2?Math.min(max,X+90):Math.max(min,X-90);
  var dist=Math.abs(tx-X); if(dist<10){ end(); return; }
  var ms=dist/32*1000;
  pk.classList.toggle('r',tx>X); sp.style.backgroundPosition='';
  pk.classList.add('walk'); void pk.offsetWidth; setX(tx,ms);
  walkT=setTimeout(function(){ pk.classList.remove('walk'); stand(); end(); },ms+30);
}
function tick(){
  if(document.visibilityState!=='visible'||!form.getClientRects().length||busy){ next(3000); return; }
  var r=Math.random();
  if(r<.3)chirp(); else if(r<.45)wink(); else if(r<.6)preen(); else if(r<.85)walk(); else flap();
}
function next(ms){ clearTimeout(T); T=setTimeout(tick,ms); }
/* לחיצה = ציוץ וכנפיים, לחיצה ארוכה = אוכל */
var lp=0,lpDone=false;
hit.addEventListener('pointerdown',function(e){
  e.preventDefault(); e.stopPropagation(); lpDone=false; clearTimeout(lp);
  lp=setTimeout(function(){ lpDone=true; eat(); },600);
});
hit.addEventListener('pointerup',function(e){
  e.stopPropagation(); clearTimeout(lp);
  if(lpDone||eating)return;
  stopWalk(); flap(); if(navigator.vibrate)try{navigator.vibrate(15)}catch(_){}
});
hit.addEventListener('pointercancel',function(){ clearTimeout(lp); lpDone=true; });
hit.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); });
hit.addEventListener('contextmenu',function(e){ e.preventDefault(); });
/* שליחת הודעה: הוא מנפנף */
form.addEventListener('submit',function(){
  var t=document.getElementById('text');
  if(t&&t.value.trim()&&!eating){ stopWalk(); flap(); }
},true);
setX(X,0); stand(); next(rnd(2000,4000));
})();
