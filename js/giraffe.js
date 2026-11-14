(function(){
'use strict';
/* הג'ירפה: נכנסת מצד אחד של הדשא במסך הבית, צועדת לאט עד הצד השני ויוצאת, מדי פעם.
   גבוהה כמו מרחק הקפיצה של החתול: הראש מגיע עד שדה "כתבו הודעה למשפחה".
   לא נוגעת בלחיצות. רצה רק כשהדשא על המסך. */
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var N=6, RATIO=240/300, SPEED=44, DEF_H=140;
var gr=null,wrap=null,box=null,anim=null,timer=0;
function find(n){ gr=document.getElementById('dgGrass'); if(gr)build(); else if(n<30)setTimeout(function(){find(n+1)},300); }
function build(){
  var st=document.createElement('style');
  st.textContent='#gfw{position:absolute;left:0;right:0;top:-260px;bottom:-30px;overflow:hidden;z-index:1;pointer-events:none;direction:ltr;contain:paint}'
  +'#gf{position:absolute;left:0;bottom:16px;display:none;will-change:transform;pointer-events:none;-webkit-user-select:none;user-select:none}'
  +'#gf .gfi{position:absolute;inset:0;overflow:hidden}#gf.r .gfi{transform:scaleX(-1)}'
  +'#gf img{position:absolute;left:0;top:0;height:100%;width:'+(N*100)+'%;max-width:none;-webkit-user-drag:none;animation:gfstep .95s steps('+N+',end) infinite}'
  +'@keyframes gfstep{from{transform:translateX(0)}to{transform:translateX(-100%)}}'
  +'@media print{#gfw{display:none!important}}';
  document.head.appendChild(st);
  wrap=document.createElement('div'); wrap.id='gfw'; wrap.setAttribute('aria-hidden','true');
  box=document.createElement('div'); box.id='gf';
  box.innerHTML='<div class="gfi"><img alt="" draggable="false" src="icons/giraffe/walk.webp"></div>';
  wrap.appendChild(box); gr.appendChild(wrap);
  document.addEventListener('visibilitychange',function(){ if(!anim)return; if(document.visibilityState==='visible')anim.play(); else anim.pause(); });
  next(5000+Math.random()*5000);
}
/* גובה הג'ירפה: מהדשא עד קצה העליון של שדה ההודעה (כמו קפיצת החתול). בלי שדה: גובה רגיל */
function height(){
  var q=document.getElementById('qtext'),h=DEF_H;
  if(q){
    var r=q.getBoundingClientRect(),base=wrap.getBoundingClientRect().bottom-16,lift=base-r.top;
    if(r.width>=150&&r.height>=20&&lift>=60&&lift<=230&&r.top>=40&&r.top<=innerHeight-10)h=Math.round(lift+2);
  }
  return h;
}
function onScreen(){ var r=gr.getBoundingClientRect(); return document.visibilityState==='visible'&&r.bottom>30&&r.top<innerHeight; }
function next(ms){ clearTimeout(timer); timer=setTimeout(go,ms); }
function go(){
  if(!onScreen()){ next(5000); return; }
  var H=height(),W=Math.round(H*RATIO),GW=gr.clientWidth,fromLeft=Math.random()<.5;
  box.style.width=W+'px'; box.style.height=H+'px';
  box.classList.toggle('r',fromLeft); /* הדמות מביטה שמאלה; בהליכה ימינה הופכים אותה */
  var xs=fromLeft?-W-12:GW+12,xe=fromLeft?GW+12:-W-12;
  box.style.display='block';
  anim=box.animate([{transform:'translateX('+xs+'px)'},{transform:'translateX('+xe+'px)'}],{duration:Math.abs(xe-xs)/SPEED*1000,easing:'linear',fill:'forwards'});
  anim.onfinish=anim.oncancel=function(){ box.style.display='none'; anim=null; next(25000+Math.random()*35000); };
}
find(0);
})();
