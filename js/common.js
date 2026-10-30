import { supabase } from './supabase.js';
import { ICONS } from './icons.js';
import { initI18n, getLang, setLang, t } from './i18n.js';
export { supabase, t };

export const TZ = 'Asia/Jerusalem';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function icon(name, size = 22) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;
}

/* ---------- זמן (שעון ישראל) ---------- */
function ilParts(date) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const o = {};
  for (const p of f.formatToParts(date)) o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour, mi: +o.minute, s: +o.second };
}
export const ilDate = (date) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(date);
export const ilTime = (date) => { const p = ilParts(date); return String(p.h).padStart(2, '0') + ':' + String(p.mi).padStart(2, '0'); };
export function dow(dateStr) { const [y, m, d] = dateStr.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); }
export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}
// תאריך ושעה מקומיים בישראל -> רגע מוחלט (Date)
export function toIsraelDate(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const target = Date.UTC(y, m - 1, d, h, mi);
  let guess = target;
  for (let i = 0; i < 2; i++) {
    const p = ilParts(new Date(guess));
    const offset = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - guess;
    guess = target - offset;
  }
  return new Date(guess);
}
// תחילת השבוע: יום שישי 12:00 האחרון (שעון ישראל)
export function weekStart(now = new Date()) {
  const today = ilDate(now);
  let back = (dow(today) - 5 + 7) % 7;
  let dateStr = addDays(today, -back);
  let start = toIsraelDate(dateStr, '12:00');
  if (start > now) { dateStr = addDays(dateStr, -7); start = toIsraelDate(dateStr, '12:00'); }
  return { dateStr, start, end: toIsraelDate(addDays(dateStr, 7), '12:00') };
}

/* ---------- סטטוס נגזר ---------- */
export const STATUS = {
  waiting:  { label: 'ממתין',  cls: 's-waiting',  icon: 'clock' },
  progress: { label: 'בתהליך', cls: 's-progress', icon: 'clock' },
  done:     { label: 'בוצע',   cls: 's-done',     icon: 'check' },
  overdue:  { label: 'באיחור', cls: 's-overdue',  icon: 'triangle-alert' }
};
export function deriveStatus(task, reportCount, now = new Date()) {
  if (reportCount >= (task.times_required || 1)) return 'done';
  const pending = (task.slots || []).slice(reportCount);
  if (pending.some(s => s.due_at && new Date(s.due_at) < now)) return 'overdue';
  return reportCount > 0 ? 'progress' : 'waiting';
}
export const nextSlot = (task, reportCount) => (task.slots || [])[reportCount] || null;

export async function reportCounts(taskIds) {
  const map = {};
  if (!taskIds.length) return map;
  const { data } = await supabase.from('feed').select('task_id').eq('type', 'report').in('task_id', taskIds);
  for (const r of data || []) map[r.task_id] = (map[r.task_id] || 0) + 1;
  return map;
}

// כל הדיווחים של משימות (מהישן לחדש)
export async function loadReports(taskIds) {
  if (!taskIds.length) return [];
  const { data } = await supabase.from('feed').select('*').eq('type', 'report').in('task_id', taskIds).order('created_at', { ascending: true });
  return data || [];
}

/* ---------- צבעי כרטיס לפי קטגוריה ---------- */
export const CARD_COLORS = {
  yellow: { bg: '#FFE9B0', fg: '#B45309', tint: '#FFF8E6', name: 'צהוב (הכלב)' },
  blue:   { bg: '#CFE6FF', fg: '#0A58CA', tint: '#EEF6FF', name: 'כחול (כלים, פח)' },
  purple: { bg: '#E3D8FF', fg: '#5B2FC9', tint: '#F4EFFF', name: 'סגול (חדרים)' },
  orange: { bg: '#FFD9BF', fg: '#B23C00', tint: '#FFF1E8', name: 'כתום (ניקיון)' },
  green:  { bg: '#CDEFD2', fg: '#166534', tint: '#EEFAF0', name: 'ירוק (לימודים)' }
};
export const tintOf = (task) => (CARD_COLORS[task.color] || CARD_COLORS.blue).tint;
// חדר: 'parents' או 'kid:<מזהה פרופיל>'. אין תמונות חדר בגרסת הניסוי - החדר רק מגביל מי יכול לבצע.
export const roomLabel = (room, profiles = []) => {
  if (room === 'parents') return 'חדר ההורים';
  if (room && room.startsWith('kid:')) { const p = profiles.find(x => x.id === room.slice(4)); return p ? 'החדר של ' + p.name : ''; }
  return '';
};
export const roomOptions = (profiles = []) => [['parents', 'חדר ההורים'], ...profiles.filter(p => p.role !== 'admin' && p.active !== false).map(p => ['kid:' + p.id, 'החדר של ' + p.name])];
export const ART = new Set(["paw-print", "dog", "utensils", "trash-2", "bed-double", "brush-cleaning", "broom", "book-open", "bath", "footprints", "shirt", "washing-machine", "shopping-cart", "cooking-pot", "recycle", "leaf", "dishwasher", "car", "flower", "droplet", "cat", "graduation-cap", "dumbbell", "wrench", "package", "shopping-bag", "mail", "heart", "music", "barbell", "kettlebell", "soccer", "judo", "sneaker", "basketball", "bicycle", "boxing-glove", "trophy", "yoga-mat", "swim-goggles", "stopwatch", "guitar", "drums", "piano", "violin", "trumpet", "microphone"]);
// כל האחראים על חזרה (משימה משותפת). assignee_id הוא הראשון, assignees הרשימה המלאה.
export const slotUsers = (slot) => !slot ? [] : (Array.isArray(slot.assignees) && slot.assignees.length ? slot.assignees : (slot.assignee_id ? [slot.assignee_id] : []));
export function iconBox(task, size = 46) {
  const c = CARD_COLORS[task.color] || CARD_COLORS.blue;
  if (typeof task.icon === 'string' && task.icon.startsWith('img:')) return `<span class="ibox art" style="width:${size}px;height:${size}px;background:${c.bg};overflow:hidden;border-radius:50%"><img src="${task.icon.slice(4)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></span>`;
  if (ART.has(task.icon)) return `<span class="ibox art" style="width:${size}px;height:${size}px;background:${c.bg}"><img src="task/${task.icon}.png" alt="" onerror="this.onerror=null;this.src='icons/task/${task.icon}.png'"></span>`;
  return `<span class="ibox" style="width:${size}px;height:${size}px;background:${c.bg};color:${c.fg}">${icon(task.icon || 'sparkles', Math.round(size * 0.52))}</span>`;
}

export function avatarGroup(byId, ids, size = 36) {
  const l = (ids || []).filter(Boolean);
  if (l.length < 2) return avatar(byId[l[0]], size);
  return `<span style="display:inline-flex">${l.map((id, i) => `<span style="${i ? 'margin-inline-start:-' + Math.round(size * 0.3) + 'px' : ''}">${avatar(byId[id], size)}</span>`).join('')}</span>`;
}
/* ---------- תמונות בני משפחה (בינתיים: ראשי תיבות) ---------- */
export function avatar(p, size = 36) {
  if (!p) return `<span class="avatar" style="width:${size}px;height:${size}px"></span>`;
  const border = p.color || '#3AB5FF';
  const inner = p.avatar_url ? `<img src="${esc(p.avatar_url)}" alt="${esc(p.name)}">` : esc((p.name || '?').trim().slice(0, 1));
  return `<span class="avatar" title="${esc(p.name)}" style="width:${size}px;height:${size}px;border-color:${border};font-size:${Math.round(size * 0.46)}px">${inner}</span>`;
}

/* צליל התראה בתוך האפליקציה (נוצר בקוד, בלי קובץ). דפדפנים דורשים נגיעה אחת במסך כדי לאפשר צליל */
let _ac = null;
const acOf = () => { try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; _ac = _ac || new AC(); if (_ac.state === 'suspended') _ac.resume(); return _ac; } catch (_) { return null; } };
export function playChime() {
  try { if (localStorage.getItem('soundOff') === '1') return; } catch (_) {}
  const ac = acOf(); if (!ac) return;
  const t = ac.currentTime;
  [[880, 0], [1175, 0.17]].forEach(([f, d]) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.35, t + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.4);
    o.connect(g); g.connect(ac.destination); o.start(t + d); o.stop(t + d + 0.45);
  });
}
['pointerdown', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, () => acOf(), { once: true, passive: true }));

/* כתובות חתומות יציבות: נשמרות במכשיר עד 6 ימים, כך שהדפדפן לא מוריד שוב ושוב את אותה תמונה */
export async function signedUrls(paths) {
  const out = {}; const now = Date.now(); let cache = {};
  try { cache = JSON.parse(localStorage.getItem('sgnCache') || '{}'); } catch (_) {}
  const need = [];
  [...new Set((paths || []).filter(Boolean))].forEach(p => { const c = cache[p]; if (c && c[1] > now) out[p] = c[0]; else need.push(p); });
  if (need.length) {
    const { data } = await supabase.storage.from('photos').createSignedUrls(need, 604800);
    (data || []).forEach(sg => { if (sg.path && sg.signedUrl) { out[sg.path] = sg.signedUrl; cache[sg.path] = [sg.signedUrl, now + 6 * 864e5]; } });
    Object.keys(cache).forEach(k => { if (cache[k][1] < now) delete cache[k]; });
    try { localStorage.setItem('sgnCache', JSON.stringify(cache)); } catch (_) {}
  }
  return out;
}

/* ---------- מעטפת העמוד: כותרת, תפריט תחתון, מגירה ---------- */
export async function initPage({ active = '', title = '', back = null, menu = true } = {}) {
  const EN = initI18n(active);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { location.replace('login.html'); await new Promise(() => {}); }
  const { data: profiles } = await supabase.from('profiles').select('*').eq('active', true).order('created_at');
  (profiles || []).forEach(p => { if (p.avatar_path && p.avatar_path.startsWith('static/')) p.avatar_url = 'icons/avatars/' + p.avatar_path.slice(7); });
  const withPhoto = (profiles || []).filter(p => p.avatar_path && !p.avatar_path.startsWith('static/'));
  if (withPhoto.length) {
    const u = await signedUrls(withPhoto.map(p => p.avatar_path));
    withPhoto.forEach(p => { if (u[p.avatar_path]) p.avatar_url = u[p.avatar_path]; });
  }
  const me = (profiles || []).find(p => p.id === session.user.id) || null;
  const isAdmin = me?.role === 'admin';
  try { if (me?.name) localStorage.setItem('myName', me.name); if (me?.family_id) localStorage.setItem('myFam', me.family_id); } catch (_) {}

  // יצירה אוטומטית של משימות חוזרות: כשהורה פותח את האפליקציה (לכל היותר פעם ב-30 דקות במכשיר)
  if (isAdmin) {
    try {
      const last = Number(localStorage.getItem('genAt2') || 0);
      if (Date.now() - last > 30 * 60 * 1000) {
        localStorage.setItem('genAt2', String(Date.now()));
        import('./generate.js').then(async G => {
          const r = await G.generateOccurrences(session.user.id);
          if (r && r.created > 0 && !sessionStorage.getItem('genReload')) { sessionStorage.setItem('genReload', '1'); location.reload(); }
        }).catch(() => {});
      }
    } catch (_) {}
  }

  const header = document.createElement('header');
  header.className = 'bar';
  header.innerHTML = back
    ? `<a class="iconbtn" href="${back}" aria-label="חזרה">${icon('arrow-right', 24)}</a><h1>${esc(title)}</h1>${menu ? `<button class="iconbtn" id="menuBtn" aria-label="תפריט">${icon('menu', 24)}</button>` : '<span class="iconbtn ghost"></span>'}`
    : `<span class="iconbtn ghost"></span><h1>${title === 'הבית שלנו' && !EN ? '<img class="brand" src="logo-text.png" alt="הבית שלנו">' : esc(title)}</h1>${menu ? `<button class="iconbtn" id="menuBtn" aria-label="תפריט">${icon('menu', 24)}</button>` : ''}`;
  document.body.prepend(header);

  if (menu) {
    const drawer = document.createElement('div');
    drawer.className = 'drawer hidden';
    drawer.innerHTML = `<div class="drawer-bg"></div><nav class="drawer-panel">
      ${isAdmin ? `<a href="admin.html" class="admin-link">${icon('settings')} ניהול</a><hr class="drawer-sep">` : ''}
      <a href="index.html">${icon('house')} בית</a>
      <a href="tasks.html?me=1">${icon('list-checks')} המשימות שלי</a>
      <a href="status.html">${icon('list-checks')} דוח סטטוס</a>
      <a href="calendar.html">${icon('calendar-days')} לוח שנה</a>
      <a href="history.html">${icon('chart-column')} היסטוריה ודיווחים</a>
      <a href="shop.html">${icon('gift')} חנות</a>
      <a href="meds.html">${icon('pill')} תרופות</a>
      <a href="requests.html">${icon('hand-heart')} בקשות מיוחדות</a>
      <a href="bonus.html">${icon('star')} משימות בונוס</a>
      <a href="important.html" class="imp-link">${icon('bell')} הודעה חשובה</a>
      <a href="games.html">${icon('star')} משחקים</a>
      <a href="chat.html">${icon('message-circle')} הודעות משפחתיות</a>
      ${(() => { try { return localStorage.getItem('myFam') === '40f12cb3-3fa9-4f99-a7fd-ad5a10e00b80'; } catch (_) { return false; } })() ? `<a href="ai.html#chef">${icon('utensils')} השף של הבית</a>` : ''}
      ${isAdmin && (() => { try { return localStorage.getItem('myFam') === '40f12cb3-3fa9-4f99-a7fd-ad5a10e00b80'; } catch (_) { return false; } })() ? `<a href="lessons.html">${icon('graduation-cap')} שיעורי אנגלית</a>` : ''}
      <a href="fridge.html">${icon('sticky-note')} פתקים על המקרר</a>
      <a href="outing.html">${icon('house')} היעדרויות</a>
      <a href="info.html">${icon('info')} מידע משפחתי</a>
      <a href="guide.html">${icon('info')} הוראות שימוש</a>
      <a href="feedback.html">${icon('message-circle')} ספרו לנו</a>
      <button id="pushBtn" type="button" style="display:none">${icon('bell')} <span>התראות</span></button>
      <button id="refreshBtn" type="button">🔄 <span>רענון האפליקציה</span></button>
      <div id="verTxt" class="note" style="text-align:center;margin:6px 0 0"></div>
      <button id="langBtn" type="button">🌐 <span>${getLang() === 'en' ? 'עברית' : 'English'}</span></button>
      <button id="logout" type="button">${icon('log-out')} התנתקות</button></nav>`;
    drawer.querySelector('#langBtn').addEventListener('click', () => { setLang(getLang() === 'en' ? 'he' : 'en'); location.reload(); });
    document.body.append(drawer);
    try { caches.keys().then(k => { const v = (k.find(x => x.startsWith('habayit-')) || '').replace('habayit-', ''); if (v) drawer.querySelector('#verTxt').textContent = 'גרסה ' + v; }); } catch (_) {}
    drawer.querySelector('#refreshBtn').addEventListener('click', async () => {
      try { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.unregister())); } catch (_) {}
      try { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); } catch (_) {}
      location.reload();
    });
    document.getElementById('menuBtn')?.addEventListener('click', () => drawer.classList.remove('hidden'));
    drawer.querySelector('.drawer-bg').addEventListener('click', () => drawer.classList.add('hidden'));
    import('./push.js').then(async P => {
      const b = drawer.querySelector('#pushBtn'), lab = b.querySelector('span');
      const draw = async () => {
        const st = await P.pushState();
        b.style.display = '';
        lab.textContent = st === 'on' ? 'התראות פעילות ✓' : st === 'denied' ? 'התראות חסומות (בהגדרות הטלפון)' : st === 'unsupported' ? (P.isIOS() && !P.isStandalone() ? 'התראות: פתחו מהאייקון במסך הבית' : 'התראות לא נתמכות כאן') : 'הפעל התראות';
        b.dataset.st = st;
        if (st === 'on' && sessionStorage.getItem('pushSynced') !== '1') { try { await P.syncPush(session.user.id); sessionStorage.setItem('pushSynced', '1'); } catch (_) {} }
      };
      b.addEventListener('click', async () => {
        if (b.dataset.st === 'on') { try { await P.syncPush(session.user.id); const r = await P.sendTestPush(); showToast(r && r.sent ? 'נשלחה התראת בדיקה ✓' : 'המכשיר עודכן, אך לא נשלחה התראה (' + ((r && r.devices) || 0) + ' מכשירים)', !(r && r.sent)); } catch (e) { showToast('הבדיקה נכשלה: ' + e.message, true); } return; }
        if (b.dataset.st !== 'off') return;
        try { await P.enablePush(session.user.id); showToast('ההתראות הופעלו במכשיר הזה'); } catch (e) { showToast((e.message === 'denied' ? 'לא אושרו התראות' : 'ההפעלה נכשלה') + (e.detail ? ': ' + e.detail : ''), true); }
        draw();
      });
      draw();
    }).catch(() => {});
    drawer.querySelector('#logout').addEventListener('click', async () => { try { await supabase.auth.signOut({ scope: 'local' }); } catch (_) {} try { Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.includes('pabwxpounvashuoyhwte')).forEach(k => localStorage.removeItem(k)); sessionStorage.clear(); localStorage.removeItem('myName'); localStorage.removeItem('myFam'); } catch (_) {} location.replace('login.html'); });

  }
  if (!back) {
    const nav = document.createElement('nav');
    nav.className = 'tabbar';
    nav.innerHTML = `
      <a href="index.html" class="${active === 'home' ? 'on' : ''}">${icon('house', 26)}<span>בית</span></a>
      <a href="tasks.html" class="${active === 'tasks' ? 'on' : ''}">${icon('list-checks', 26)}<span>משימות</span></a>
      <a href="calendar.html" class="${active === 'calendar' ? 'on' : ''}">${icon('calendar-days', 26)}<span>לוח שנה</span></a>
      <a href="history.html" class="${active === 'history' ? 'on' : ''}">${icon('chart-column', 26)}<span>היסטוריה</span></a>`;
    document.body.append(nav);
  }
  if (menu) {
    // מעבר בין לשוניות ותפריט לא מוסיף להיסטוריה: חץ אחורה מהבית יוצא מהאפליקציה
    document.querySelectorAll('.tabbar a, .drawer-panel a').forEach(a => a.addEventListener('click', ev => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
      ev.preventDefault(); location.replace(a.getAttribute('href'));
    }));
  }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
  if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', ev => { const g = ev.data && ev.data.goto; if (g && g !== location.href) location.href = g; });
  showPendingToast();
  if (me) import('./game.js').then(m => m.startGame(me, profiles || [])).catch(() => {});
  if (me) import('./bonus.js').then(m => m.startBonus(me, profiles || [])).catch(() => {});
  if (me) import('./bonuspopup.js').then(m => m.startBonusPopup(me, profiles || [])).catch(() => {});
  if (me) import('./important.js').then(m => m.startImportant(me, profiles || [])).catch(() => {});
  return { session, me, profiles: profiles || [], isAdmin };
}

/* ---------- נקודות, דיווח והודעות ---------- */
// נקודות על דיווח: מלאות אם בזמן, חלק מהן (late_fraction) אם אחרי מועד החזרה
export function pointsFor(task, slot, at = new Date()) {
  const late = !!(slot?.due_at && new Date(slot.due_at) < at);
  return { late, points: late ? Math.round(task.points * Number(task.late_fraction ?? 0.5)) : task.points };
}
export function flashToast(msg, err = false) {
  try { sessionStorage.setItem('toast', JSON.stringify({ msg, err })); } catch (_) {}
}
export function showToast(msg, err = false) {
  const t = document.createElement('div');
  t.className = 'toast' + (err ? ' err' : ''); t.textContent = msg;
  document.body.append(t); setTimeout(() => t.remove(), 4000);
}
export function showPendingToast() {
  try {
    const raw = sessionStorage.getItem('toast'); if (!raw) return;
    sessionStorage.removeItem('toast');
    const { msg, err } = JSON.parse(raw); showToast(msg, err);
  } catch (_) {}
}
// שליחת דיווח: מוסיף שורה ל-feed. החזרה ה-n תופסת את הסלוט ה-n. ביצוע נוסף (מעבר למספר שהוגדר) מותר ומקבל נקודות מלאות.
export async function submitReport({ task, userId, note, photoPath }) {
  const done = (await reportCounts([task.id]))[task.id] || 0;
  const { error } = await supabase.from('feed').insert({
    type: 'report', user_id: userId, task_id: task.id, body: note || null, photo_path: photoPath || null,
    payload: { slot_n: done + 1 }
  });
  return { error, slot: (task.slots || [])[done] || null };
}
// הקטנת תמונה לרוחב/גובה מקסימלי של 1600 פיקסל, JPEG
export async function shrinkImage(file, max = 1600) {
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch (_) {
    bmp = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
  }
  const w = bmp.width || bmp.naturalWidth, h = bmp.height || bmp.naturalHeight;
  const k = Math.min(1, max / Math.max(w, h));
  const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return await new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error('blob')), 'image/jpeg', 0.8));
}
