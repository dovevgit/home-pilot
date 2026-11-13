(function(){
'use strict';
/* הציפור של הבית: מדי פעם חוצה את מסך הבית מצד לצד. רק בבית של הבעלים. לא נוגעת בלחיצות ולא מפריעה לחלונות */
var OWNER='40f12cb3-3fa9-4f99-a7fd-ad5a10e00b80';
function famReady(cb){var n=0;(function w(){var f=null;try{f=localStorage.getItem('myFam')}catch(_){}if(f||n++>20)cb(f);else setTimeout(w,150)})()}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)start(); /* עכשיו לכל הבתים */
function start(){
var st=document.createElement('style');
st.textContent='.fbird{position:fixed;left:0;top:0;z-index:6;pointer-events:none;will-change:transform;direction:ltr}'
+'.fbird .fb{position:relative;display:block;animation:fbbob 1.6s ease-in-out infinite alternate;filter:drop-shadow(0 3px 3px rgba(20,60,110,.22))}'
+'.fbird.l .fb img{transform:scaleX(-1)}'
+'.fbird img{position:absolute;inset:0;width:100%;height:100%;-webkit-user-drag:none}'
+'.fbird .b2{opacity:0;animation:fbB .36s steps(1,end) infinite}.fbird .b1{animation:fbA .36s steps(1,end) infinite}'
+'@keyframes fbA{0%{opacity:1}50%{opacity:0}}@keyframes fbB{0%{opacity:0}50%{opacity:1}}'
+'@keyframes fbbob{from{transform:translateY(-5px)}to{transform:translateY(6px)}}'
+'@media print{.fbird{display:none!important}}';
document.head.appendChild(st);
function ok(){ return document.visibilityState==='visible'&&!document.querySelector('.modal:not(.hidden)'); }
function fly(dx){
  var s=Math.round(54+Math.random()*22),left=Math.random()<.5,W=innerWidth,H=innerHeight;
  var y0=90+Math.random()*Math.max(60,H*.5-90),y1=y0+(Math.random()-.5)*90,ym=(y0+y1)/2-30-Math.random()*40;
  var xs=left?W+s:-s*1.3,xe=left?-s*1.3:W+s,xm=(xs+xe)/2;
  var el=document.createElement('div'); el.className='fbird'+(left?' l':''); el.setAttribute('aria-hidden','true');
  el.innerHTML='<span class="fb" style="width:'+s+'px;height:'+s+'px"><img class="b1" alt="" draggable="false" src="icons/weather/bird1.webp"><img class="b2" alt="" draggable="false" src="icons/weather/bird2.webp"></span>';
  document.body.appendChild(el);
  var d=6500+Math.random()*2500+(dx||0);
  var a=el.animate([{transform:'translate('+xs+'px,'+y0+'px)'},{transform:'translate('+xm+'px,'+ym+'px)',offset:.5},{transform:'translate('+xe+'px,'+y1+'px)'}],{duration:d,easing:'linear',fill:'forwards'});
  a.onfinish=a.oncancel=function(){ el.remove(); };
}
function next(ms){
  setTimeout(function(){
    if(!ok()){ next(8000); return; }
    fly(0); if(Math.random()<.25)setTimeout(function(){ if(ok())fly(900); },700+Math.random()*700);
    next(30000+Math.random()*60000);
  },ms);
}
next(window.BIRD_FIRST!=null?window.BIRD_FIRST:12000+Math.random()*13000); /* בהיסטוריה: מיד בכניסה */
}
})();
