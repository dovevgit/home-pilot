/* הדמות הכחולה של הבית: צונחת כשגוללים למטה, מתעופפת כשגוללים למעלה, ומתעצבנת כשמציקים לה. לא קשורה למשימות. */
const POSES = ['idle', 'wave', 'tongue', 'look', 'fly', 'stretch', 'fall', 'angry'];
const BASE = new URL('../icons/mascot/', import.meta.url).href;
POSES.forEach(p => { const i = new Image(); i.src = `${BASE}${p}.png`; });

const css = document.createElement('style');
css.textContent = `
#mascot{position:fixed;inset-inline-end:8px;bottom:calc(82px + env(safe-area-inset-bottom));width:88px;height:88px;z-index:15;
  -webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation;cursor:pointer;-webkit-tap-highlight-color:transparent}
#mascot img{width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none;transform-origin:50% 90%;
  transition:transform .22s ease-out;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18))}
#mascot.m-idle img{animation:m-bob 2.6s ease-in-out infinite}
#mascot.m-flair img{animation:m-hop .5s ease-out 2}
#mascot.m-fall img{transform:translateY(14px) rotate(-9deg);transition:transform .16s ease-in}
#mascot.m-fly img{animation:m-fly .38s ease-in-out infinite;transition:transform .2s ease-out}
#mascot.m-land img{animation:m-land .45s ease-out 1}
#mascot.m-angry img{animation:m-shake .09s linear infinite}
@keyframes m-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes m-hop{0%,100%{transform:translateY(0)}45%{transform:translateY(-10px) rotate(4deg)}}
@keyframes m-fly{0%,100%{transform:translateY(-20px) rotate(-3deg)}50%{transform:translateY(-30px) rotate(3deg)}}
@keyframes m-land{0%{transform:translateY(10px) scale(1.08,.88)}60%{transform:translateY(-5px)}100%{transform:translateY(0)}}
@keyframes m-shake{0%{transform:translateX(-3px) rotate(-3deg)}50%{transform:translateX(3px) rotate(3deg)}100%{transform:translateX(-3px) rotate(-3deg)}}
@media (prefers-reduced-motion:reduce){#mascot img{animation:none!important;transition:none!important}}
`;
document.head.appendChild(css);

const box = document.createElement('div');
box.id = 'mascot'; box.setAttribute('aria-hidden', 'true');
const img = document.createElement('img');
img.alt = ''; img.draggable = false;
box.appendChild(img);
document.body.appendChild(box);

let pose = '', cls = '';
function show(p, c) {
  if (p !== pose) { pose = p; img.src = `${BASE}${p}.png`; }
  if (c !== cls) { box.classList.remove('m-idle', 'm-flair', 'm-fall', 'm-fly', 'm-land', 'm-angry'); void box.offsetWidth; box.classList.add(c); cls = c; }
}

let angryUntil = 0, scrollMode = '', flairUntil = 0, flairPose = 'wave', landUntil = 0;
function render() {
  const now = Date.now();
  if (now < angryUntil) return show('angry', 'm-angry');
  if (scrollMode === 'down') return show('fall', 'm-fall');
  if (scrollMode === 'up') return show('fly', 'm-fly');
  if (now < landUntil) return show('idle', 'm-land');
  if (now < flairUntil) return show(flairPose, 'm-flair');
  show('idle', 'm-idle');
}

/* גלילה */
let lastY = window.scrollY, stopTimer = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY, d = y - lastY;
  if (Math.abs(d) >= 4) { scrollMode = d > 0 ? 'down' : 'up'; lastY = y; render(); }
  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => {
    if (scrollMode) { scrollMode = ''; landUntil = Date.now() + 450; render(); setTimeout(render, 460); }
    lastY = window.scrollY;
  }, 160);
}, { passive: true });

/* הצקות: נגיעה ראשונה מצחיקה אותה, שנייה מבלבלת אותה, שלישית ואילך מעצבנת */
let taps = 0, tapTimer = 0;
box.addEventListener('pointerdown', e => {
  e.preventDefault();
  taps++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { taps = 0; }, 2500);
  const now = Date.now();
  if (taps >= 3) {
    angryUntil = now + 2600;
    setTimeout(() => { render(); }, 2650);
  } else {
    flairPose = taps === 1 ? 'tongue' : 'look';
    flairUntil = now + 1100;
    setTimeout(render, 1150);
  }
  render();
});

/* מדי פעם מנופפת, מוציאה לשון או מתמתחת */
const FLAIR = ['wave', 'tongue', 'look', 'stretch'];
(function idleLoop() {
  setTimeout(() => {
    const now = Date.now();
    if (!scrollMode && now > angryUntil && now > flairUntil) {
      flairPose = FLAIR[Math.floor(Math.random() * FLAIR.length)];
      flairUntil = now + 1700;
      render(); setTimeout(render, 1750);
    }
    idleLoop();
  }, 7000 + Math.random() * 5000);
})();

render();
