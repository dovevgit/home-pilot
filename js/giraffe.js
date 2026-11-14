(function(){
'use strict';
/* הג'ירפה: נכנסת מצד אחד של הדשא במסך הבית, צועדת לאט עד הצד השני ויוצאת, מדי פעם.
   גבוהה כמו מרחק הקפיצה של החתול: הראש מגיע עד שדה "כתבו הודעה למשפחה".
   בצד שמאל של הדשא עומד עץ. בחלק מהכניסות היא צועדת עד העץ, אוכלת ממנו, ואז מסתובבת וממשיכה ללכת.
   לא נוגעת בלחיצות. רצה רק כשהדשא על המסך. */
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var N=6, RATIO=240/300, SPEED=44, DEF_H=140;
/* גיליון האכילה: 6 פריימים, כל אחד 388x297 (עץ + ג'ירפה). הג'ירפה בו בגובה 266, העץ מתחיל ב-51 משמאל, הפרסות 3 מעל התחתית */
var ECW=388, ECH=297, GHE=266, CANOPY=51, EBASE=3, EMID=279, EDGE=6, EAT_CYCLES=2;
var gr=null,wrap=null,box=null,tree=null,eat=null,eimg=null,anim=null,timer=0,H=DEF_H,busy=false;
function find(n){ gr=document.getElementById('dgGrass'); if(gr)build(); else if(n<30)setTimeout(function(){find(n+1)},300); }
function build(){
  var st=document.createElement('style');
  st.textContent='#gfw{position:absolute;left:0;right:0;top:-260px;bottom:-30px;overflow:hidden;z-index:1;pointer-events:none;direction:ltr;contain:paint}'
  +'#gfw.pz *{animation-play-state:paused!important}'
  +'#gf{position:absolute;left:0;bottom:16px;display:none;will-change:transform;pointer-events:none;-webkit-user-select:none;user-select:none;transition:opacity .25s}'
  +'#gf .gfi{position:absolute;inset:0;overflow:hidden}#gf.r .gfi{transform:scaleX(-1)}'
  +'#gf img{position:absolute;left:0;top:0;height:100%;width:'+(N*100)+'%;max-width:none;-webkit-user-drag:none;animation:gfstep .95s steps('+N+',end) infinite}'
  +'@keyframes gfstep{from{transform:translateX(0)}to{transform:translateX(-100%)}}'
  +'#gtr,#gea{position:absolute;pointer-events:none;-webkit-user-select:none;user-select:none}'
  +'#gtr img,#gea .gei img{display:block;-webkit-user-drag:none;max-width:none}'
  +'#gtr img{width:100%;height:100%}'
  +'#gea{display:none;opacity:0;transition:opacity .25s}#gea .gei{position:absolute;inset:0;overflow:hidden}'
  +'#gea .gei img{position:absolute;left:0;top:0;height:100%;width:'+(N*100)+'%}'
  +'#gea.eating .gei img{animation:geat 3.3s steps('+N+',end) '+EAT_CYCLES+'}'
  +'@keyframes geat{from{transform:translateX(0)}to{transform:translateX(-100%)}}'
  +'@media print{#gfw{display:none!important}}';
  document.head.appendChild(st);
  wrap=document.createElement('div'); wrap.id='gfw'; wrap.setAttribute('aria-hidden','true');
  tree=document.createElement('div'); tree.id='gtr'; tree.innerHTML='<img alt="" draggable="false" src="icons/giraffe/tree.webp">';
  eat=document.createElement('div'); eat.id='gea'; eat.innerHTML='<div class="gei"><img alt="" draggable="false" src="icons/giraffe/eat.webp"></div>'; eimg=eat.querySelector('img');
  box=document.createElement('div'); box.id='gf';
  box.innerHTML='<div class="gfi"><img alt="" draggable="false" src="icons/giraffe/walk.webp"></div>';
  wrap.appendChild(tree); wrap.appendChild(eat); wrap.appendChild(box); gr.appendChild(wrap);
  document.addEventListener('visibilitychange',function(){
    var vis=document.visibilityState==='visible'; wrap.classList.toggle('pz',!vis);
    if(anim){ if(vis)anim.play(); else anim.pause(); }
  });
  addEventListener('resize',function(){ if(!busy)layout(); });
  addEventListener('load',layout);
  layout(); setTimeout(layout,1200);
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
/* מגדיר גדלים ומיקומים לפי הגובה: העץ (קבוע בצד שמאל) והג'ירפה האוכלת */
function layout(){
  if(!wrap)return;
  H=height();
  var k=H/GHE;
  [tree,eat].forEach(function(e){
    e.style.width=Math.round(ECW*k)+'px'; e.style.height=Math.round(ECH*k)+'px';
    e.style.left=Math.round(EDGE-CANOPY*k)+'px'; e.style.bottom=(16-EBASE*k).toFixed(1)+'px';
  });
}
function onScreen(){ var r=gr.getBoundingClientRect(); return document.visibilityState==='visible'&&r.bottom>30&&r.top<innerHeight; }
function next(ms){ clearTimeout(timer); timer=setTimeout(go,ms); }
function walk(xs,xe,facingRight,done){
  var W=Math.round(H*RATIO);
  box.style.width=W+'px'; box.style.height=H+'px';
  box.classList.toggle('r',facingRight); /* הדמות מביטה שמאלה; בהליכה ימינה הופכים אותה */
  box.getAnimations().forEach(function(a){a.cancel()});
  box.style.opacity=1; box.style.display='block';
  anim=box.animate([{transform:'translateX('+xs+'px)'},{transform:'translateX('+xe+'px)'}],{duration:Math.abs(xe-xs)/SPEED*1000,easing:'linear',fill:'forwards'});
  anim.onfinish=function(){ anim=null; done(); };
}
function finish(){ box.style.display='none'; busy=false; next(25000+Math.random()*35000); }
function go(){
  if(!onScreen()){ next(5000); return; }
  layout(); busy=true;
  var W=Math.round(H*RATIO),GW=gr.clientWidth,k=H/GHE;
  var stopX=Math.round(EDGE+(EMID-CANOPY)*k-W/2);   /* מרכז הג'ירפה האוכלת, באותה נקודה בה הג'ירפה ההולכת עוצרת */
  var toTree=Math.random()<.5&&GW+12-stopX>120;
  if(!toTree){
    var fromLeft=Math.random()<.5;
    walk(fromLeft?-W-12:GW+12,fromLeft?GW+12:-W-12,fromLeft,finish);
    return;
  }
  /* צועדת מימין אל העץ, אוכלת, מסתובבת וממשיכה ימינה החוצה */
  walk(GW+12,stopX,false,function(){
    eat.style.display='block'; void eat.offsetWidth; eat.style.opacity=1; box.style.opacity=0;
    setTimeout(function(){
      tree.style.display='none'; box.style.display='none';
      eimg.addEventListener('animationend',depart,{once:true});
      eat.classList.remove('eating'); void eat.offsetWidth; eat.classList.add('eating');
    },270);
  });
  function depart(){
    eat.classList.remove('eating');
    tree.style.display='block';
    walk(stopX,GW+12,true,finish);
    box.style.opacity=0; void box.offsetWidth; box.style.opacity=1;
    eat.style.opacity=0;
    setTimeout(function(){ eat.style.display='none'; },270);
  }
}
find(0);
})();
