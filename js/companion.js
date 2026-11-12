(function(){
'use strict';
function famReady(cb){var n=0;(function w(){var f=null;try{f=localStorage.getItem('myFam')}catch(_){}if(f||n++>20)cb(f);else setTimeout(w,150)})()} /* מחכים עד שנודע לאיזה בית שייכים (נשמר אחרי טעינת הפרופיל) */
famReady(function(f){ if(f==='40f12cb3-3fa9-4f99-a7fd-ad5a10e00b80')return; main(); }); /* בבית של הבעלים הדמות היא הכלב (js/dog.js) */
function main(){
if(document.querySelector('#ch'))return;
/* הדמות של האתר (dovev-offers), בגרסה לאפליקציה: הולכת על קו מעל התפריט התחתון. */
var SVG_SRC='<svg id="ch" style="position:fixed;left:0;top:0;z-index:8;pointer-events:none;overflow:visible;will-change:transform;direction:ltr" viewBox="0 0 140 160" width="112" height="128" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="chbg" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#7cf0ff"/><stop offset=".55" stop-color="#22c8e2"/><stop offset="1" stop-color="#0f9bb8"/></radialGradient></defs><g id="rot"> <g id="legs"></g> <g id="bodyg">  <ellipse cx="70" cy="88" rx="35" ry="33" fill="url(#chbg)" stroke="#0a5d72" stroke-width="3.2"/>  <ellipse cx="70" cy="99" rx="21" ry="17" fill="#c9fbff" opacity=".55"/>  <path d="M62 56 q-3 -12 -10 -15 M70 55 q0 -14 -1 -19 M78 56 q4 -11 11 -13" fill="none" stroke="#0a5d72" stroke-width="3.2" stroke-linecap="round"/>  <ellipse cx="44" cy="92" rx="6" ry="4" fill="#ff8fa3" opacity=".75"/><ellipse cx="96" cy="92" rx="6" ry="4" fill="#ff8fa3" opacity=".75"/>  <g id="eyes">   <ellipse cx="55" cy="76" rx="11.5" ry="13.5" fill="#fff" stroke="#0a5d72" stroke-width="2.6"/>   <ellipse cx="86" cy="78" rx="9" ry="10.5" fill="#fff" stroke="#0a5d72" stroke-width="2.6"/>   <g id="pl"><circle cx="55" cy="78" r="5.6" fill="#10202c"/><circle cx="53" cy="75.5" r="1.9" fill="#fff"/></g>   <g id="pr"><circle cx="86" cy="79" r="4.6" fill="#10202c"/><circle cx="84.5" cy="76.8" r="1.6" fill="#fff"/></g>   <rect id="lidl" x="42" y="62" width="26" height="0" fill="#22c8e2"/><rect id="lidr" x="75" y="66" width="22" height="0" fill="#22c8e2"/>   <path id="brow" d="M76 62 q10 -7 20 -1" fill="none" stroke="#0a5d72" stroke-width="3.2" stroke-linecap="round"/>  </g>  <g id="mouth"></g><path id="sweat" d="M100 56 q-5 9 0 12 q5 -3 0 -12 z" fill="#bfefff" stroke="#0a5d72" stroke-width="1.6" opacity="0"/> </g> <g id="arms"></g></g></svg>';
var ch0=document.importNode(new DOMParser().parseFromString(SVG_SRC,'image/svg+xml').documentElement,true);ch0.setAttribute('aria-hidden','true');document.body.appendChild(ch0);
const SVGNS='http://www.w3.org/2000/svg';
const ch=document.getElementById('ch'),legsG=document.getElementById('legs'),armsG=document.getElementById('arms'),mouth=document.getElementById('mouth'),bodyg=document.getElementById('bodyg');
let SC=1, DARK='#0a5d72', TEAL='#22c8e2';
const mk=(t,a,p)=>{const e=document.createElementNS(SVGNS,t);for(const k in a)e.setAttribute(k,a[k]);(p||document.getElementById('ch')).appendChild(e);return e};
function limb(parent){const o=mk('path',{fill:'none',stroke:DARK,'stroke-width':9.5,'stroke-linecap':'round'},parent),i=mk('path',{fill:'none',stroke:TEAL,'stroke-width':5.4,'stroke-linecap':'round'},parent);return{o,i}}
const armL=limb(armsG),armR=limb(armsG),legL=limb(legsG),legR=limb(legsG);
function mkHand(side){const g=mk('g',{},armsG);
 [[-38,9],[-13,10.5],[13,10.5],[38,9],[side*92,7]].forEach(f=>{const a=f[0]*Math.PI/180,x=Math.cos(a)*f[1],y=Math.sin(a)*f[1];
  mk('line',{x1:0,y1:0,x2:x,y2:y,stroke:DARK,'stroke-width':6.4,'stroke-linecap':'round'},g);});
 [[-38,9],[-13,10.5],[13,10.5],[38,9],[side*92,7]].forEach(f=>{const a=f[0]*Math.PI/180,x=Math.cos(a)*f[1],y=Math.sin(a)*f[1];
  mk('line',{x1:0,y1:0,x2:x,y2:y,stroke:'#7cf0ff','stroke-width':3.4,'stroke-linecap':'round'},g);});
 mk('circle',{r:6.8,fill:'#7cf0ff',stroke:DARK,'stroke-width':2.8},g);return g}
const handL=mkHand(1),handR=mkHand(-1);
function setHand(g,x,y,sx,sy){const ang=Math.atan2(y-sy,x-sx)*180/Math.PI;g.setAttribute('transform','translate('+x+' '+y+') rotate('+ang+')')}
const footL=mk('ellipse',{rx:10,ry:5.6,fill:'#0f9bb8',stroke:DARK,'stroke-width':2.8},legsG),footR=mk('ellipse',{rx:10,ry:5.6,fill:'#0f9bb8',stroke:DARK,'stroke-width':2.8},legsG);
function setLimb(l,a,b,bend){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;const cx=mx-dy/len*bend,cy=my+dx/len*bend;const d='M'+a[0]+' '+a[1]+' Q'+cx+' '+cy+' '+b[0]+' '+b[1];l.o.setAttribute('d',d);l.i.setAttribute('d',d)}
const MOUTHS={
 smile:'<path d="M54 100 q16 17 32 0" fill="#10202c" stroke="#0a5d72" stroke-width="2.6" stroke-linejoin="round"/><rect x="66" y="100" width="6" height="5" rx="1.4" fill="#fff"/>',
 open:'<path d="M54 98 q16 26 32 0 z" fill="#10202c" stroke="#0a5d72" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="70" cy="108" rx="7" ry="4.2" fill="#ff7f93"/>',
 tongue:'<path d="M54 99 q16 14 32 0" fill="#10202c" stroke="#0a5d72" stroke-width="2.6" stroke-linejoin="round"/><path d="M63 105 q7 14 14 0 z" fill="#ff7f93" stroke="#0a5d72" stroke-width="2"/>',
 grit:'<path d="M53 98 q17 6 34 0 l-2 12 q-15 5 -30 0 z" fill="#fff" stroke="#0a5d72" stroke-width="2.6" stroke-linejoin="round"/><path d="M61 100 v10 M70 101 v10 M79 100 v10" stroke="#0a5d72" stroke-width="1.8"/>',
 fangs:'<path d="M48 95 q22 36 44 0 z" fill="#3b0707" stroke="#0a5d72" stroke-width="2.6" stroke-linejoin="round"/><path d="M50 96 L57 112 L64 97 L70 114 L76 97 L83 112 L90 96 Z" fill="#fff" stroke="#0a5d72" stroke-width="1.6" stroke-linejoin="round"/><path d="M58 117 L63 104 L68 119 M72 119 L77 104 L82 117" fill="#fff" stroke="#0a5d72" stroke-width="1.6" stroke-linejoin="round"/>',
 ooh:'<ellipse cx="70" cy="104" rx="6" ry="8" fill="#10202c" stroke="#0a5d72" stroke-width="2.6"/>'
};
const eyesG=document.getElementById('eyes');
const LEAVE=false; /* true = כשנוגעים בה היא כועסת, ממריאה ונעלמת עד רענון הדף; false = קופצת למקום אחר */
const FLY=true; /* true = חוזרת למעלה בעזרת כנפיים; false = טיפוס כמו קודם */
const WING='M42 84 C20 62 0 56 -8 64 C-2 73 6 77 15 77 C8 83 13 90 24 90 C22 95 31 97 41 93 Z';
const wingL=mk('g',{opacity:0},bodyg),wingRo=mk('g',{transform:'translate(140 0) scale(-1 1)',opacity:0},bodyg);
const wingRi=mk('g',{},wingRo);
[[wingL,wingL],[wingRi,wingRi]].forEach(([g])=>{mk('path',{d:WING,fill:'#e9fcff',stroke:DARK,'stroke-width':2.6,'stroke-linejoin':'round'},g);mk('path',{d:'M38 84 C24 72 10 66 2 66 M36 89 C24 84 14 82 8 82',fill:'none',stroke:'#9ee6f2','stroke-width':2,'stroke-linecap':'round'},g)});
bodyg.insertBefore(wingRo,bodyg.firstChild);bodyg.insertBefore(wingL,bodyg.firstChild);
function wingsSet(on,t,k){k=k||0;const a=on?(Math.sin(t*(20-8*k))*34-8)*(1-.6*k):0;wingL.setAttribute('transform','rotate('+a+' 40 84)');wingRi.setAttribute('transform','rotate('+a+' 40 84)');const o=on?(k>.6?1-(k-.6)/.4:1):0;if(wingL.getAttribute('opacity')!=o){wingL.setAttribute('opacity',o);wingRo.setAttribute('opacity',o)}}
function flyPose(t,u){const f=Math.sin(t*9);return {dy:f*3,sx:1,sy:1,lean:Math.sin(u*Math.PI*4)*4,aL:[20,66+f*3],aR:[120,66-f*3],fL:[60,134+f*3],fR:[80,134-f*3],bendA:-5,bendL:4,mouth:'smile',look:[0,-.6],blink:0,brow:-2}}
const defs=ch.querySelector('defs');
const cpL=mk('clipPath',{id:'cpL'},defs),cpR=mk('clipPath',{id:'cpR'},defs);mk('ellipse',{cx:55,cy:76,rx:11.5,ry:13.5},cpL);mk('ellipse',{cx:86,cy:78,rx:9,ry:10.5},cpR);
document.getElementById('lidl').setAttribute('clip-path','url(#cpL)');document.getElementById('lidr').setAttribute('clip-path','url(#cpR)');
const hair=bodyg.querySelector('path[d^="M62 56"]'),HAIR0=hair.getAttribute('d'),HAIR1='M58 58 q-8 -10 -22 -10 M62 56 q-9 -14 -18 -26 M67 55 q-3 -18 -8 -32 M73 55 q3 -18 8 -32 M78 56 q9 -14 18 -26 M82 58 q8 -10 22 -10';
function rageAmt(){const now=performance.now(),t=(now-st.rageT0)/1000;if(!st.rageT0||t<0||t>4.2)return 0;if(t<.5){const x=t/.5,c=1.9;return Math.min(1.12,1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2))}if(t<3.4)return 1;const x=(t-3.4)/.8,e=x*x*(3-2*x);return 1-e}
const flush=mk('ellipse',{cx:70,cy:88,rx:35,ry:33,fill:'#ff4a3d',opacity:0},bodyg);bodyg.insertBefore(flush,eyesG);
const abL=mk('path',{d:'M40 60 L68 71',fill:'none',stroke:DARK,'stroke-width':4.6,'stroke-linecap':'round',opacity:0},eyesG),abR=mk('path',{d:'M100 64 L75 73',fill:'none',stroke:DARK,'stroke-width':4.6,'stroke-linecap':'round',opacity:0},eyesG);
const vein=mk('path',{d:'M99 44 q7 0 7 7 M115 44 q-7 0 -7 7 M99 60 q7 0 7 -7 M115 60 q-7 0 -7 -7',fill:'none',stroke:'#ff3b30','stroke-width':3.4,'stroke-linecap':'round',opacity:0},bodyg);
const chuteG=mk('g',{opacity:0},document.getElementById('rot'));
document.getElementById('rot').insertBefore(chuteG,document.getElementById('rot').firstChild);
mk('path',{d:'M8 -20 L36 50 M70 -20 L70 40 M132 -20 L104 50',fill:'none',stroke:DARK,'stroke-width':1.8,'stroke-linecap':'round'},chuteG);
mk('path',{d:'M6 -20 C8 -70 40 -88 70 -88 C100 -88 132 -70 134 -20 C122 -32 110 -32 102 -20 C94 -32 80 -32 70 -20 C60 -32 46 -32 38 -20 C30 -32 18 -32 6 -20 Z',fill:'#F97316',stroke:DARK,'stroke-width':2.6,'stroke-linejoin':'round'},chuteG);
mk('path',{d:'M70 -88 C60 -70 52 -50 54 -22 M70 -88 C80 -70 88 -50 86 -22',fill:'none',stroke:'#fff','stroke-width':2.6,opacity:.75},chuteG);
function chuteShow(u){const k=Math.min(1,.15+u*9);chuteG.setAttribute('transform','translate(70 -20) scale('+k+') translate(-70 20)');chuteG.setAttribute('opacity',1)}
function chuteHide(){if(chuteG.getAttribute('opacity')!=='0')chuteG.setAttribute('opacity',0)}
function chutePose(t){const w=Math.sin(t*4);return{dy:0,sx:1,sy:1.02,lean:Math.sin(t*3)*3,aL:[36,50],aR:[104,50],fL:[58,132+w*3],fR:[82,132-w*3],bendA:-4,bendL:4,mouth:'open',look:[0,-.5],blink:0,brow:-2}}
const notes=[0,1,2].map(i=>{const e=mk('text',{'font-size':22,'font-weight':700,fill:i===1?'#F97316':DARK,opacity:0,'text-anchor':'middle'},document.getElementById('rot'));e.textContent=i===1?'\u266B':'\u266A';return e});
function danceNotes(e,on){notes.forEach((n,i)=>{if(!on){n.setAttribute('opacity',0);return}const k=((e*.55+i/3)%1);n.setAttribute('x',[-6,146,2][i]+Math.sin(e*3+i)*6);n.setAttribute('y',84-k*50);n.setAttribute('opacity',Math.min(1,k*6,(1-k)*2.5))})}
const hearts=[];let heartAcc=0;
function updateHearts(dt,on){
  if(on){heartAcc+=dt*8;
    while(heartAcc>=1){heartAcc-=1;
      const e=mk('path',{d:'M0 5 C-10 -3 -7 -10 0 -5 C7 -10 10 -3 0 5 Z',fill:Math.random()<.5?'#ff5a7a':'#ff8fa3',stroke:'#c0284a','stroke-width':1.2,'stroke-linejoin':'round',opacity:0},document.getElementById('rot'));
      const side=Math.random()<.5?-1:1;
      hearts.push({e,x:70+side*(10+Math.random()*26),y:62+Math.random()*16,vx:side*(8+Math.random()*34),vy:-(42+Math.random()*50),life:0,max:1+Math.random()*.7,s:.7+Math.random()*.7,ph:Math.random()*6})}}
  for(let i=hearts.length-1;i>=0;i--){const h=hearts[i];
    if(!on&&h.life<9){h.life=Math.max(h.life,h.max-.25)}
    h.life+=dt;
    if(h.life>=h.max){h.e.remove();hearts.splice(i,1);continue}
    h.x+=(h.vx+Math.sin(h.life*6+h.ph)*18)*dt;h.y+=h.vy*dt;
    const k=h.life/h.max;
    h.e.setAttribute('transform','translate('+h.x+' '+h.y+') rotate('+Math.sin(h.life*5+h.ph)*18+') scale('+(h.s*(.6+.5*Math.min(1,k*4)))+')');
    h.e.setAttribute('opacity',Math.min(1,k*8,(1-k)*2.5))}
}
function dancePose(e){
  const b=e*7.2,s=Math.sin(b),m=Math.floor(e/1.5)%3,bounce=Math.abs(s)*10;
  let p={dy:-bounce,sx:1+Math.sin(b*2)*.02,sy:1-Math.sin(b*2)*.02,lean:0,mouth:'open',look:[Math.sin(b*.5)*.8,.2],blink:0,brow:-2,bendA:-9,bendL:6};
  if(m===0){p.aL=[20,s>0?28:104];p.aR=[120,s>0?104:28];p.fL=[52,137-Math.max(0,s)*12];p.fR=[88,137-Math.max(0,-s)*12];p.lean=s*8}
  else if(m===1){p.aL=[16,34+Math.sin(b*2)*10];p.aR=[124,34-Math.sin(b*2)*10];p.fL=[42,137-bounce*.5];p.fR=[98,137-bounce*.5];p.mouth='tongue';p.lean=0}
  else{p.aL=[6,80+s*22];p.aR=[134,80-s*22];p.fL=[52+s*14,137-Math.max(0,s)*8];p.fR=[88+s*14,137-Math.max(0,-s)*8];p.lean=Math.sin(b*.5)*14}
  return p;
}
const MOUTH_NODES={};for(const k in MOUTHS){MOUTH_NODES[k]=[...new DOMParser().parseFromString('<svg xmlns="'+SVGNS+'">'+MOUTHS[k]+'</svg>','image/svg+xml').documentElement.childNodes].map(n=>document.importNode(n,true))}
let curMouth='';function setMouth(m){if(m!==curMouth){mouth.replaceChildren(...MOUTH_NODES[m].map(n=>n.cloneNode(true)));curMouth=m}}
const pl=document.getElementById('pl'),pr=document.getElementById('pr'),lidl=document.getElementById('lidl'),lidr=document.getElementById('lidr');


/* ---- עולם: קו קבוע מעל התפריט התחתון (בטלפון) או תחתית המסך (במחשב) ---- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const st={mode:'walk',x:0,dir:1,phase:0,angryUntil:0,rageT0:0,idleUntil:0,idleKind:'',init:false,lastTap:0,sitK:0,sitUntil:0};
function applySC(sc){if(Math.abs(sc-SC)>.002){SC=sc;const w=140*sc;ch.setAttribute('width',w);ch.setAttribute('height',w*160/140)}}
/* הבית של הדמות: הקצה העליון של הכרטיס "מה עושים עכשיו" בדשבורד (בגודל מלא, ומדי פעם יושבת עליו עם רגליים משתלשלות קדימה).
   בכל מקום אחר, או כשהכרטיס לא נראה עם מקום לדמות מעליו: על התפריט התחתון או בתחתית המסך. */
function groundLine(){
  const card=document.querySelector('#announce .announce'); /* מלבן ההודעה עם הגביע (צברתם ... נקודות) */
  if(card){
    const r=card.getBoundingClientRect();
    if(scrollY<5)st.restTop=r.top;
    const lim=scrollY<5?50:Math.min(110,Math.max(50,(st.restTop||110)-30)); /* כשגוללים למטה והכרטיס עולה, היא עוזבת אותו */
    if(r.width>150&&r.top>lim&&r.top<innerHeight-40){
      /* גודל מלא אם יש מקום מעל הכרטיס, אחרת קצת קטנה כדי שלא תיחתך בראש המסך */
      const sc=Math.min(Math.max(72,Math.min(96,innerWidth*.2))/140,(r.top+10)/118),half=70*sc*.8;
      const l=r.left+14+half,rr=r.right-14-half;
      return{y:r.top+1,edge:r.top,l:l,r:Math.max(l+50,rr),bar:true,sc:sc,cx:(r.left+r.right)/2};
    }
  }
  let y=innerHeight-6;
  const tb=document.querySelector('.tabbar');
  if(tb&&getComputedStyle(tb).display!=='none'){const r=tb.getBoundingClientRect();if(r.height)y=r.top+1}
  const sc=Math.max(72,Math.min(96,innerWidth*.2))/140,half=70*sc*.8;
  return{y:y,edge:y,l:12+half,r:Math.max(12+half+40,innerWidth-12-half),bar:false,sc:sc};
}
function setHidden(h){ch.style.display=h?'none':''}
function place(ax,ay,lax,lay,rot,ox0,oy0){rot+=angerAmt()*Math.sin(performance.now()/22)*(st.mode==='jump'?2:3.5);ch.style.transformOrigin=(lax*SC)+'px '+(lay*SC)+'px';ch.style.transform='translate('+(ax-lax*SC)+'px,'+(ay-lay*SC)+'px) rotate('+rot+'deg) scale('+(1+1.05*rageAmt())+')'}

function angerAmt(){const n=performance.now();return Math.min(1,Math.max(0,(st.angryUntil-n)/250))}
function pose(p){ // p: {dy,sx,sy,lean,aL,aR,fL,fR,mouth,look:[x,y],blink,brow}
  const A=angerAmt();
  if(A>0){const n=performance.now()/1000,sh=Math.sin(n*38)*3,bm=st.mode==='leave'?st.leaveFrom:st.mode,sw=bm==='walk';
    p=Object.assign({},p,{mouth:'grit',blink:.5,look:[0,.4],brow:0});
    if(st.mode!=='jump'&&!(st.mode==='leave'&&performance.now()-st.lv.t0>=1100)&&(sw||bm==='hang')){p.aL=[24+sh,24+Math.abs(sh)];p.aR=[116-sh,24+Math.abs(sh)];p.lean=Math.sin(n*30)*3}
    if(sw){const k=Math.sin(n*14)*5;p.fL=[p.fL[0],p.fL[1]-Math.max(0,k)];p.fR=[p.fR[0],p.fR[1]-Math.max(0,-k)]}}
  const lc=A>.5?'#b87272':'#22c8e2';lidl.setAttribute('fill',lc);lidr.setAttribute('fill',lc);
  const RG=rageAmt();
  if(RG>0){const n=performance.now()/1000;p=Object.assign({},p,{mouth:'fangs',lean:Math.sin(n*40)*4*RG,dy:(p.dy||0)-Math.abs(Math.sin(n*17))*3*RG});
    p.aL=[8+Math.sin(n*21)*16,28+Math.cos(n*17)*38];p.aR=[132-Math.sin(n*23)*16,28+Math.cos(n*19)*38];
    hair.setAttribute('d',HAIR1);hair.setAttribute('transform','rotate('+(Math.sin(n*30)*5*RG)+' 70 56)');hair.setAttribute('stroke-width',3.8);flush.setAttribute('fill','#e61e14')}
  else if(hair.getAttribute('d')!==HAIR0){hair.setAttribute('d',HAIR0);hair.removeAttribute('transform');hair.setAttribute('stroke-width',3.2);flush.setAttribute('fill','#ff4a3d')}
  flush.setAttribute('opacity',Math.max(A*(.68+Math.sin(performance.now()/90)*.08),RG>0?.92*Math.min(1,RG):0));abL.setAttribute('opacity',A);abR.setAttribute('opacity',A);
  vein.setAttribute('opacity',A);vein.setAttribute('transform','scale('+(1+Math.sin(performance.now()/70)*.12*A)+')');vein.style.transformOrigin='107px 52px';
  document.getElementById('brow').style.opacity=A>.5?0:1;
  bodyg.setAttribute('transform','translate(70 120) rotate('+(p.lean||0)+') scale('+(p.sx||1)+' '+(p.sy||1)+') translate(-70 -120) translate(0 '+(p.dy||0)+')');
  const dy=p.dy||0;
  setLimb(armL,[39,90+dy],p.aL,p.bendA||-9);setLimb(armR,[101,90+dy],p.aR,-(p.bendA||-9));
  setHand(handL,p.aL[0],p.aL[1],39,90+dy);setHand(handR,p.aR[0],p.aR[1],101,90+dy);
  setLimb(legL,[56,114+dy],p.fL,p.bendL||6);setLimb(legR,[84,114+dy],p.fR,-(p.bendL||6));
  footL.setAttribute('cx',p.fL[0]);footL.setAttribute('cy',p.fL[1]+2);footR.setAttribute('cx',p.fR[0]);footR.setAttribute('cy',p.fR[1]+2);
  const lx=(p.look||[0,0])[0],ly=(p.look||[0,0])[1];
  pl.setAttribute('transform','translate('+lx*5+' '+ly*5+')');pr.setAttribute('transform','translate('+lx*4+' '+ly*4+')');
  const b=p.blink||0;lidl.setAttribute('height',b*26);lidr.setAttribute('height',b*22);
  document.getElementById('brow').setAttribute('transform','translate(0 '+(p.brow||0)+')');
  setMouth(p.mouth||'smile');
}
const REST={aL:[26,104],aR:[114,104],fL:[52,137],fR:[88,137]};

function walkPose(t,moving,idle){
  const ph=st.phase,s=Math.sin(ph),c=Math.cos(ph);
  const p={dy:moving?-Math.abs(s)*3.6:Math.sin(t*2.4)*1.2,sx:1,sy:1+(moving?Math.abs(s)*.02:Math.sin(t*2.4)*.012),lean:moving?st.dir*5:0,
    aL:[26,104+(moving?s*7:0)],aR:[114,104-(moving?s*7:0)],fL:[52+(moving?s*9:0),137-(moving?Math.max(0,c)*8:0)],fR:[88-(moving?s*9:0),137-(moving?Math.max(0,-c)*8:0)],
    mouth:'smile',look:[moving?st.dir*.9:0,.1],blink:0,brow:Math.sin(t*3)>.6?-2:0};
  if(idle==='wave'){p.aR=[120,38+Math.sin(t*9)*8];p.mouth='open';p.look=[0,0];p.lean=-3}
  if(idle==='tongue'){p.mouth='tongue';p.look=[0,0];p.brow=-3;p.dy=Math.sin(t*8)*1.6}
  if(idle==='shrug'){p.aL=[20,86];p.aR=[120,86];p.mouth='ooh';p.look=[0,-.4];p.dy=-1.5}
  return p;
}
function scaredPose(u){
  const f=Math.sin(u*Math.PI*6)*3;
  return {dy:-4,sx:.92,sy:1.14,lean:f,aL:[18,30+f],aR:[122,30-f],fL:[58,124+f],fR:[82,124-f],bendA:-6,mouth:'ooh',look:[0,-1],blink:0,brow:-5};
}
function jumpPose(u){
  return {dy:-4,sx:.94,sy:1.1,lean:0,aL:[28,34],aR:[112,34],fL:[60,126],fR:[80,126],bendA:-6,mouth:'open',look:[0,-.8],blink:0,brow:-3};
}


let last=performance.now();
function sitPose(t){const w=Math.sin(t*3);return{aL:[32,114],aR:[108,114],fL:[48+w*5,146+Math.max(0,w)*3],fR:[92-w*5,146+Math.max(0,-w)*3],look:[Math.sin(t*.7)*.6,.2],blink:Math.sin(t*.9)>.97?1:0}}
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
  const g=groundLine();applySC(g.sc);
  if(hearts.length&&st.mode!=='dance')updateHearts(dt,false);
  if(rageAmt()>0&&st.mode==='walk'){st.idleUntil=now+300;st.sitUntil=0}
  if(st.mode==='walk'&&st.init&&g.bar!==st.homeBar){ /* עברנו בין הכרטיס לרצפה: צנחנית למטה, מתעופפת בחזרה למעלה */
    st.homeBar=g.bar;st.from={x:st.pcx,y:st.pcy};st.t0=now;st.sitUntil=0;st.sitK=0;
    const Bx0=Math.min(Math.max(st.pcx,g.l),g.r),By0=g.y-60*SC,dist=Math.hypot(Bx0-st.pcx,By0-st.pcy);
    st.dur=g.bar?Math.min(4500,Math.max(1800,dist/.25)):Math.min(8000,Math.max(3200,dist/.12));
    st.mode=g.bar?'flyup':'chute';
  }
  if(st.mode==='walk'){
    if(!st.init){st.x=(g.l+g.r)/2;st.init=true;st.homeBar=g.bar}
    if(!g.bar)st.sitUntil=0;
    const sitting=now<st.sitUntil;
    st.sitK+=((sitting?1:0)-st.sitK)*Math.min(1,dt*7);
    const k=st.sitK<.02?0:st.sitK;
    const idleNow=now<st.idleUntil&&!sitting&&k===0;
    const moving=!idleNow&&!sitting&&k===0;
    if(moving){
      st.x+=st.dir*70*dt;st.phase+=dt*10;
      if(st.x>g.r){st.dir=-1;st.x=g.r}
      if(st.x<g.l){st.dir=1;st.x=g.l}
      if(g.bar&&Math.abs(st.x-g.cx)>70&&Math.random()<dt*.06)st.sitUntil=now+5000+Math.random()*4000; /* מדי פעם מתיישבת לנוח על קצה הכרטיס */
      else if(Math.random()<dt*.1){st.idleKind=['wave','tongue','shrug'][Math.floor(Math.random()*3)];st.idleUntil=now+1700}
    }
    st.x=Math.min(Math.max(st.x,g.l),g.r);
    if(rageAmt()>0){const ex=70*SC*2.1+8,lo=ex,hi=Math.max(ex,innerWidth-ex),tx=Math.min(Math.max(st.x,lo),hi);st.x+=(tx-st.x)*Math.min(1,dt*8)} /* בזמן זעם היא גדלה, אז מרחיקים אותה מהקצה */
    const p=walkPose(t,moving,idleNow?st.idleKind:'');
    if(k>0){
      const S=sitPose(t),lv=(a,b)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];
      p.aL=lv(p.aL,S.aL);p.aR=lv(p.aR,S.aR);p.fL=lv(p.fL,S.fL);p.fR=lv(p.fR,S.fR);
      p.dy=(p.dy||0)*(1-k);p.lean=(p.lean||0)*(1-k);p.bendA=-6;p.bendL=5;
      if(k>.5){p.look=S.look;p.blink=S.blink;p.mouth='smile';p.brow=0}
    }
    pose(p);
    const ay=g.y+(g.edge-g.y)*k,lay=142-21*k;
    place(st.x,ay,70,lay,st.dir*(moving?1.5:0)*(1-k));
    st.pcx=st.x;st.pcy=ay-(lay-82)*SC;chuteHide();
  }else if(st.mode==='jump'){
    const u=Math.min(1,(now-st.t0)/st.dur),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
    const cx=st.fromX+(st.toX-st.fromX)*e,cy=g.y-60*SC-Math.sin(u*Math.PI)*Math.max(80,Math.abs(st.toX-st.fromX)*.25)*SC;
    pose(scaredPose(u));place(cx,cy,70,82,(st.toX>st.fromX?1:-1)*Math.sin(u*Math.PI)*24);
    st.pcx=cx;st.pcy=cy;
    if(u>=1){st.mode='walk';st.x=st.toX;st.dir=st.toX>st.fromX?-1:1;st.idleUntil=now+2000;st.idleKind='shrug'}
  }else if(st.mode==='dance'){
    const e=(now-st.t0)/1000,u=Math.min(1,e/st.dur);
    pose(dancePose(e));place(st.x,g.y,70,142,Math.sin(e*3.6)*3);danceNotes(e,true);updateHearts(dt,u<.93);
    st.pcx=st.x;st.pcy=g.y-60*SC;
    if(u>=1){st.mode='walk';st.idleUntil=now+1200;st.idleKind='wave';danceNotes(0,false);updateHearts(dt,false)}
  }else if(st.mode==='chute'||st.mode==='flyup'){
    let up=st.mode==='flyup';
    if(g.bar!==up){ /* היעד התהפך באמצע (גללו חזרה): ממשיכים מהמקום הנוכחי לכיוון השני */
      st.homeBar=g.bar;st.from={x:st.pcx,y:st.pcy};st.t0=now;st.dur=1800;up=g.bar;st.mode=up?'flyup':'chute';
    }
    const A=st.from,Bx=Math.min(Math.max(A.x,g.l),g.r),By=g.y-60*SC;
    const u=Math.min(1,Math.max(0,(now-st.t0)/st.dur));
    let cx,cy;
    if(up){
      const f=u*u*(3-2*u),sw=Math.sin(u*Math.PI*4)*14*Math.sin(u*Math.PI);
      cx=A.x+(Bx-A.x)*f+sw;cy=A.y+(By-A.y)*f+Math.sin(t*9)*3;
      chuteHide();pose(flyPose(t,u));wingsSet(true,t,0);place(cx,cy,70,82,Math.sin(u*Math.PI*4)*5);
    }else{
      /* צניחה איטית: דואה ימינה ושמאלה כמו מצנח אמיתי, והגוף מתנדנד מתחת לחופה */
      const e=(now-st.t0)/1000,env=Math.min(1,(1-u)*4,u*5+.25),drift=Math.sin(e*.95)*70*env,tilt=Math.cos(e*.95)*11*env+Math.sin(e*2.3)*2.5*env;
      const f=u;
      cx=Math.min(Math.max(A.x+(Bx-A.x)*f+drift,50),innerWidth-50);cy=A.y+(By-A.y)*f;
      wingsSet(false,t);chuteShow(u);pose(chutePose(t));
      place(cx,cy-142*SC,70,-60,tilt); /* מסובבים סביב קודקוד החופה, כך שהגוף מתנדנד */
    }
    st.pcx=cx;st.pcy=cy;
    if(u>=1){st.mode='walk';st.x=Bx;st.dir=1;st.idleUntil=now+1200;st.idleKind='wave';wingsSet(false,t);chuteHide()}
  }
  requestAnimationFrame(frame);
}
function scare(){
  if(st.mode!=='walk')return;
  st.sitUntil=0;st.sitK=0;
  const now=performance.now(),g=groundLine();
  st.fromX=st.x;st.toX=st.x<(g.l+g.r)/2?g.r:g.l;
  st.t0=now;st.dur=520;st.angryUntil=now+520+1900;st.mode='jump';
}
const stl=document.createElement('style');stl.textContent='#ch,#ch *{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;outline:none!important}@media print{#ch{display:none!important}}';document.head.appendChild(stl);
const rotG=document.getElementById('rot');rotG.style.pointerEvents='visiblePainted';rotG.style.cursor='pointer';
function startDance(){
  if(st.mode!=='walk'||(st.rageT0&&performance.now()-st.rageT0<4400))return false;
  st.sitUntil=0;st.sitK=0;st.angryUntil=0;st.t0=performance.now();st.dur=5.5;st.mode='dance';return true;
}
let lpTimer=0,lpDone=false;
rotG.addEventListener('pointerdown',function(){if(st.mode==='walk'){st.idleUntil=Math.max(st.idleUntil,performance.now()+800);st.idleKind=''} /* עומדת במקום בזמן לחיצה ארוכה */
  lpDone=false;clearTimeout(lpTimer);lpTimer=setTimeout(function(){if(startDance())lpDone=true},550)});
['pointerup','pointercancel','pointerleave'].forEach(ev=>rotG.addEventListener(ev,function(){clearTimeout(lpTimer)}));
rotG.addEventListener('contextmenu',function(e){e.preventDefault()});
let taps=0;
rotG.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
  if(lpDone){lpDone=false;return} /* אחרי לחיצה ארוכה (ריקוד) לא סופרים לחיצה */
  const n=performance.now();if(st.rageT0&&n-st.rageT0<4400)return;
  if(n-st.lastTap>2500)taps=0;
  st.lastTap=n;taps++;
  if(taps>=3){taps=0;st.rageT0=n;st.angryUntil=n+4400;if(st.mode==='walk')st.idleUntil=n+4400;return}
  scare()});
if(reduce){const g=groundLine();applySC(g.sc);pose(walkPose(0,false,''));place((g.l+g.r)/2,g.y,70,142,0)}
else requestAnimationFrame(frame);
}
})();
