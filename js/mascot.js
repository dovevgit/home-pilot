/* הדמות הכחולה של הבית: יושבת על המלבן של ההודעה ליד הגביע ("צברתם ... נקודות"), מטיילת עליו מדי פעם,
   צונחת כשגוללים למטה, מתעופפת בחזרה כשגוללים למעלה, ומתעצבנת כשמציקים לה. לא קשורה למשימות. */
const POSES = ['idle', 'wave', 'tongue', 'look', 'fly', 'stretch', 'fall', 'angry'];
const BASE = new URL('../icons/mascot/', import.meta.url).href;
POSES.forEach(p => { const i = new Image(); i.src = `${BASE}${p}.png`; });

const S = 84;                 // גודל הדמות בפיקסלים
const FEET = S * 209 / 240;   // כמה פיקסלים מראש התמונה עד כפות הרגליים
const TROPHY = 42;            // חצי מרוחב הגביע
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const css = document.createElement('style');
css.textContent = `
#mascot{width:${S}px;height:${S}px;z-index:15;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation;cursor:pointer;-webkit-tap-highlight-color:transparent}
#mascot.m-home{position:absolute;top:${Math.round(2 - FEET)}px}
#mascot.m-air{position:fixed;top:0;left:0;will-change:transform}
#mascot img{width:100%;height:100%;display:block;pointer-events:none;-webkit-user-drag:none;transform-origin:50% 90%;
  transition:transform .22s ease-out;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18))}
#mascot.m-idle img{animation:m-bob 2.6s ease-in-out infinite}
#mascot.m-sit img{animation:m-sit 3.2s ease-in-out infinite}
#mascot.m-walk img{animation:m-step .26s ease-in-out infinite}
#mascot.m-flair img{animation:m-hop .5s ease-out 2}
#mascot.m-fall img{transform:rotate(-14deg);transition:transform .16s ease-in}
#mascot.m-fly img{animation:m-fly .38s ease-in-out infinite}
#mascot.m-land img{animation:m-land .45s ease-out 1}
#mascot.m-angry img{animation:m-shake .09s linear infinite}
@keyframes m-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes m-sit{0%,100%{transform:translateY(3px) scale(1,.93)}50%{transform:translateY(2px) scale(1,.96)}}
@keyframes m-step{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-4px) rotate(3deg)}}
@keyframes m-hop{0%,100%{transform:translateY(0)}45%{transform:translateY(-10px) rotate(4deg)}}
@keyframes m-fly{0%,100%{transform:translateY(-3px) rotate(-3deg)}50%{transform:translateY(5px) rotate(3deg)}}
@keyframes m-land{0%{transform:translateY(8px) scale(1.08,.88)}60%{transform:translateY(-5px)}100%{transform:translateY(0)}}
@keyframes m-shake{0%{transform:translateX(-3px) rotate(-3deg)}50%{transform:translateX(3px) rotate(3deg)}100%{transform:translateX(-3px) rotate(-3deg)}}
@media (prefers-reduced-motion:reduce){#mascot img{animation:none!important;transition:none!important}}
`;
document.head.appendChild(css);

const box = document.createElement('div');
box.id = 'mascot'; box.setAttribute('aria-hidden', 'true');
const img = document.createElement('img');
img.alt = ''; img.draggable = false;
box.appendChild(img);

/* המלבן שהדמות יושבת עליו: ההודעה עם הגביע. הוא נטען מהשרת, אז מחכים לו. עד שהוא מופיע (או אם אין הודעה) היא בפינה למטה */
let home = null;
const target = () => document.querySelector('#announce .announce');

/* mode: home = יושבת על המלבן | falling = נופלת | floor = על הרצפה למטה | flying = עפה חזרה למלבן */
let mode = 'floor', x = 8, y = 0, vy = 0, homeX = 0;
const tabH = () => (document.querySelector('.tabbar')?.offsetHeight || 82);
const floorX = () => 8;
const floorY = () => innerHeight - tabH() - FEET - 4;
const homeW = () => (home ? home.clientWidth : 300);
const maxHomeX = () => Math.max(8, homeW() - S - 8);
/* לא לשבת על הגביע: אם יוצא עליו, זזים לצד הקרוב */
function avoidTrophy(px) {
  const c = homeW() / 2;
  if (px + S > c - TROPHY && px < c + TROPHY) px = px + S / 2 < c ? c - TROPHY - S - 6 : c + TROPHY + 6;
  return Math.min(Math.max(8, px), maxHomeX());
}
const restX = () => avoidTrophy(homeW() / 2 + TROPHY + 8);

function placeAir() { box.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`; }
function toAir(px, py) {
  x = px; y = py;
  box.classList.remove('m-home'); box.classList.add('m-air');
  box.style.left = ''; document.body.appendChild(box); placeAir();
}
function toHome(px) {
  homeX = avoidTrophy(px);
  box.classList.remove('m-air'); box.classList.add('m-home');
  box.style.transform = ''; box.style.left = homeX + 'px';
  home.appendChild(box);
}
function spot() {                     // היעד: ליד הגביע, על הקצה העליון של המלבן (קואורדינטות המסך)
  const r = home.getBoundingClientRect();
  return { cx: r.left + restX(), cy: r.top - FEET + 6, bottom: r.bottom, top: r.top };
}

/* תנוחה לפי המצב */
let pose = '', cls = '';
function show(p, c) {
  if (p !== pose) { pose = p; img.src = `${BASE}${p}.png`; }
  if (c !== cls) { box.classList.remove('m-idle', 'm-sit', 'm-walk', 'm-flair', 'm-fall', 'm-fly', 'm-land', 'm-angry'); void box.offsetWidth; box.classList.add(c); cls = c; }
}
let angryUntil = 0, scrollMode = '', flairUntil = 0, flairPose = 'wave', landUntil = 0, walking = false, stepFlip = false;
function render() {
  const now = Date.now();
  if (now < angryUntil) return show('angry', 'm-angry');
  if (mode === 'falling' || (mode === 'floor' && scrollMode === 'down')) return show('fall', 'm-fall');
  if (mode === 'flying') return show('fly', 'm-fly');
  if (now < landUntil) return show('idle', 'm-land');
  if (mode === 'home' && walking) return show(stepFlip ? 'look' : 'idle', 'm-walk');
  if (now < flairUntil) return show(flairPose, 'm-flair');
  show('idle', mode === 'home' ? 'm-sit' : 'm-idle');
}
const later = (fn, ms) => setTimeout(fn, ms);
const land = () => { landUntil = Date.now() + 450; render(); later(render, 470); };

/* תנועה: נפילה, עוף וטיול (רק כשצריך) */
let raf = 0, tPrev = 0, walkTo = null;
function frame(t) {
  raf = 0;
  const dt = Math.min(0.05, (t - (tPrev || t)) / 1000); tPrev = t;
  let active = false;
  if (mode === 'falling') {
    vy += 2200 * dt; y += vy * dt; x += (floorX() - x) * Math.min(1, dt * 5);
    const fy = floorY();
    if (REDUCED || y >= fy) { y = fy; x = floorX(); vy = 0; mode = 'floor'; placeAir(); land(); }
    else { placeAir(); active = true; }
  } else if (mode === 'flying' && home) {
    const c = spot();
    const offTop = c.bottom < 80;                      // המלבן עדיין למעלה, מחוץ למסך
    const tx = offTop ? floorX() + 20 : c.cx, ty = offTop ? 90 : c.cy;
    const dx = tx - x, dy = ty - y, dist = Math.hypot(dx, dy);
    if (!offTop && (REDUCED || dist < 6)) { toHome(restX()); mode = 'home'; land(); }
    else {
      const step = Math.min(dist, Math.max(200 * dt, dist * Math.min(1, dt * 5)));
      if (dist > 1) { x += dx / dist * step; y += dy / dist * step; }
      placeAir(); active = true;
    }
  } else if (mode === 'home' && walkTo !== null) {
    const dx = walkTo - homeX, step = 46 * dt;
    if (Math.abs(dx) <= step) { homeX = walkTo; walkTo = null; walking = false; box.style.left = homeX + 'px'; render(); }
    else { homeX += Math.sign(dx) * step; box.style.left = homeX + 'px'; active = true; }
  }
  if (active) raf = requestAnimationFrame(frame); else tPrev = 0;
}
const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

/* התחלה: על הרצפה, ועוברת למלבן ברגע שההודעה מופיעה */
function attach() {
  const el = target();
  if (!el || home === el) return !!el;
  home = el;
  if (mode === 'floor' && scrollY < 300) { toHome(restX()); mode = 'home'; render(); }
  return true;
}
document.body.appendChild(box); box.classList.add('m-air'); x = floorX(); y = floorY(); placeAir(); render();
const holder = document.getElementById('announce');
if (holder && !attach()) {
  const mo = new MutationObserver(() => { if (attach()) mo.disconnect(); });
  mo.observe(holder, { childList: true, subtree: true });
  later(() => mo.disconnect(), 15000);
}

/* גלילה */
let lastY = window.scrollY, stopTimer = 0;
window.addEventListener('scroll', () => {
  const sy = window.scrollY, d = sy - lastY;
  if (Math.abs(d) >= 5) {
    lastY = sy;
    const dir = d > 0 ? 'down' : 'up';
    if (dir === 'down') {
      if (mode === 'home') { const r = box.getBoundingClientRect(); walking = false; walkTo = null; toAir(r.left, Math.max(80, r.top + d)); mode = 'falling'; vy = 0; kick(); }
      else if (mode === 'flying') { mode = 'falling'; vy = 0; kick(); }
    } else if ((mode === 'floor' || mode === 'falling') && home) { mode = 'flying'; kick(); }
    scrollMode = dir; render();
  }
  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => { scrollMode = ''; lastY = window.scrollY; render(); }, 160);
}, { passive: true });
window.addEventListener('resize', () => {
  if (mode === 'floor') { x = floorX(); y = floorY(); placeAir(); }
  else if (mode === 'home') toHome(homeX);
});

/* הצקות: נגיעה ראשונה מצחיקה אותה, שנייה מבלבלת אותה, שלישית ואילך מעצבנת */
let taps = 0, tapTimer = 0;
box.addEventListener('pointerdown', e => {
  e.preventDefault();
  taps++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { taps = 0; }, 2500);
  const now = Date.now();
  if (taps >= 3) { angryUntil = now + 2600; later(render, 2650); }
  else { flairPose = taps === 1 ? 'tongue' : 'look'; flairUntil = now + 1100; later(render, 1150); }
  render();
});

/* מדי פעם: מנופפת / מוציאה לשון / מתמתחת, ואם יושבת על המלבן גם מטיילת עליו ומתיישבת שוב */
const FLAIR = ['wave', 'tongue', 'look', 'stretch'];
(function idleLoop() {
  later(() => {
    const now = Date.now();
    const calm = !scrollMode && now > angryUntil && now > flairUntil && mode !== 'falling' && mode !== 'flying';
    if (calm) {
      if (mode === 'home' && !walking && Math.random() < 0.6) {
        let to = avoidTrophy(8 + Math.random() * (maxHomeX() - 8));
        if (Math.abs(to - homeX) < 70) to = avoidTrophy(homeX < maxHomeX() / 2 ? maxHomeX() : 8);
        walkTo = to; walking = true; stepFlip = false;
        const steps = setInterval(() => { if (!walking) return clearInterval(steps); stepFlip = !stepFlip; render(); }, 260);
        render(); kick();
      } else {
        flairPose = FLAIR[Math.floor(Math.random() * FLAIR.length)];
        flairUntil = now + 1700; render(); later(render, 1750);
      }
    }
    idleLoop();
  }, 7000 + Math.random() * 5000);
})();
