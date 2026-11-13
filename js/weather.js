// כרטיס מזג אוויר בדף הבית: מזג אוויר, רוח, ים וגלים מ-Open-Meteo (חינמי, בלי מפתח).
// המיקום שנבחר נשמר רק במכשיר (localStorage), לא במסד הנתונים.
import { esc, icon } from './common.js';
import { findCountry } from './countries.js';

const CITIES = {
  'חיפה':     { lat: 32.82, lon: 34.98, mlat: 32.83, mlon: 34.90, sea: true },
  'תל אביב':  { lat: 32.08, lon: 34.77, mlat: 32.08, mlon: 34.70, sea: true },
  'נתניה':    { lat: 32.33, lon: 34.85, mlat: 32.33, mlon: 34.78, sea: true },
  'אשדוד':    { lat: 31.80, lon: 34.64, mlat: 31.80, mlon: 34.55, sea: true },
  'אילת':     { lat: 29.55, lon: 34.95, mlat: 29.52, mlon: 34.95, sea: true },
  'ירושלים':  { lat: 31.77, lon: 35.21, sea: false },
  'באר שבע':  { lat: 31.25, lon: 34.79, sea: false }
};
const KEY = 'wxLoc';
const DEFAULT_LOC = { type: 'city', name: 'חיפה' };
const MAX_AGE = 15 * 60 * 1000;

const getLoc = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (v?.type === 'city' && CITIES[v.name]) return v;
    if (v?.type === 'gps' && isFinite(v.lat) && isFinite(v.lon)) return v;
    if (v?.type === 'place' && isFinite(v.lat) && isFinite(v.lon) && v.name) return v;
  } catch (_) {}
  return DEFAULT_LOC;
};
const saveLoc = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (_) {} };
const coordsOf = l => l.type === 'city' ? CITIES[l.name] : { lat: l.lat, lon: l.lon, mlat: l.lat, mlon: l.lon, sea: true };
const placeLabel = l => (l.he && uiLang() === 'he') ? l.he : (l.en && uiLang() === 'en') ? l.en : l.name;

async function fetchJson(url) {
  const c = new AbortController(); const id = setTimeout(() => c.abort(), 10000);
  try { const r = await fetch(url, { signal: c.signal }); if (!r.ok) throw new Error('http ' + r.status); return await r.json(); }
  finally { clearTimeout(id); }
}

// שם המקום לפי קואורדינטות (BigDataCloud, חינמי ובלי מפתח). נקרא רק אחרי לחיצה על "המיקום שלי".
const uiLang = () => { try { return localStorage.getItem('lang') === 'en' ? 'en' : 'he'; } catch (_) { return 'he'; } };
async function findPlace(lat, lon) {
  const j = await fetchJson(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${uiLang()}`);
  return String(j.city || j.locality || j.principalSubdivision || j.countryName || '').trim().slice(0, 40);
}

// חיפוש עיר בעולם (Open-Meteo, חינמי ובלי מפתח). נשלח רק הטקסט שהוקלד בשדה החיפוש.
async function searchPlaces(q) {
  const ctry = findCountry(q);
  if (ctry) return { country: uiLang() === 'en' ? ctry.en : ctry.he, list: ctry.cities.map(c => ({ name: uiLang() === 'en' ? c.en : c.he, he: c.he, en: c.en, sub: uiLang() === 'en' ? ctry.en : ctry.he, lat: c.lat, lon: c.lon })) };
  const j = await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=${uiLang()}&format=json`);
  return { country: '', list: (j.results || []).map(r => ({ name: String(r.name || '').slice(0, 40), sub: [r.admin1, r.country].filter(Boolean).join(', ').slice(0, 60), lat: +(+r.latitude).toFixed(2), lon: +(+r.longitude).toFixed(2) })).filter(r => r.name && isFinite(r.lat) && isFinite(r.lon)) };
}

async function loadData(loc, force = false) {
  const c = coordsOf(loc);
  const ck = `wxCache:${c.lat.toFixed(2)},${c.lon.toFixed(2)}`;
  if (!force) { try { const v = JSON.parse(sessionStorage.getItem(ck)); if (v && Date.now() - v.t < MAX_AGE) return v.d; } catch (_) {} }
  const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_probability_max&wind_speed_unit=kmh&timezone=auto&forecast_days=1`;
  const mUrl = c.sea ? `https://marine-api.open-meteo.com/v1/marine?latitude=${c.mlat}&longitude=${c.mlon}&current=wave_height,wave_direction,wave_period,sea_surface_temperature&timezone=auto` : null;
  const [w, m] = await Promise.all([fetchJson(wUrl), mUrl ? fetchJson(mUrl).catch(() => null) : Promise.resolve(null)]);
  const sc = m?.current;
  const sea = sc && (sc.wave_height != null || sc.sea_surface_temperature != null) ? sc : null;
  const d = { w, sea };
  try { sessionStorage.setItem(ck, JSON.stringify({ t: Date.now(), d })); } catch (_) {}
  return d;
}

const wcode = c => {
  if (c === 0 || c === 1) return ['sun', c === 0 ? 'שמיים בהירים' : 'בהיר ברובו'];
  if (c === 2) return ['partly', 'מעונן חלקית'];
  if (c === 3) return ['cloud', 'מעונן'];
  if (c === 45 || c === 48) return ['fog', 'ערפל'];
  if (c >= 51 && c <= 57) return ['rain', 'טפטוף'];
  if (c >= 61 && c <= 67) return ['rain', 'גשם'];
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) return ['snow', 'שלג'];
  if (c >= 80 && c <= 82) return ['rain', 'ממטרים'];
  if (c >= 95) return ['storm', 'סופת רעמים'];
  return ['partly', 'מזג אוויר משתנה'];
};
const wimg = (name, size) => `<img class="wximg" src="icons/weather/${name}.webp" alt="" width="${size}" height="${size}" decoding="async">`;
// ביום שמשי (שמיים בהירים ובהירים ברובו, בשעות היום) מציגים שמיים יפים וציפורים
// איזה שמיים ואייקון מציגים: לפי סוג מזג האוויר, ובשמיים בהירים או מעונן חלקית גם לפי יום או לילה
// שלב ביממה לפי זריחה ושקיעה במקום עצמו: dawn סביב הזריחה, dusk סביב השקיעה, אחרת day או night
function phaseOf(cur, day) {
  const t = Date.parse(cur.time), sr = Date.parse(day.sunrise?.[0]), ss = Date.parse(day.sunset?.[0]), M = 60000;
  if (isFinite(t) && isFinite(sr) && isFinite(ss)) {
    if (t >= sr - 30 * M && t <= sr + 45 * M) return 'dawn';
    if (t >= ss - 45 * M && t <= ss + 30 * M) return 'dusk';
  }
  return cur.is_day === 0 ? 'night' : 'day';
}
// איזה שמיים ואייקון מציגים: לפי סוג מזג האוויר, ובשמיים בהירים או מעונן חלקית גם לפי שעה ביממה
function look(cur, day = {}) {
  const c = cur.weather_code, night = cur.is_day === 0, phase = phaseOf(cur, day);
  const [icon0, desc] = wcode(c);
  const twi = phase === 'dawn' || phase === 'dusk';
  let icon = icon0, sky;
  if (c === 0 || c === 1) { sky = twi ? phase : night ? 'night' : 'sun'; if (night) icon = 'moon'; }
  else if (c === 2) { sky = twi ? phase : night ? 'night' : 'partly'; if (night) icon = 'moon-cloud'; }
  else if (c === 3) sky = 'cloud';
  else if (c === 45 || c === 48) sky = 'fog';
  else if (icon0 === 'rain') sky = 'rain';
  else if (icon0 === 'snow') sky = 'snow';
  else if (icon0 === 'storm') sky = 'storm';
  else sky = twi ? phase : night ? 'night' : 'partly';
  return { icon, desc, sky, phase, dark: ['rain', 'storm', 'night', 'dawn', 'dusk'].includes(sky), glow: icon === 'sun' || icon === 'moon', birds: sky === 'sun' };
}
const skyHtml = sky => `<span class="wxsky s-${sky}" aria-hidden="true"></span>`;
const bird = (t, size, dur, delay, x) => `<span class="wxbird" style="--t:${t}%;--s:${size}px;--d:${dur}s;--w:${delay}s;--x:${x}%"><span class="wxbob"><img class="ba" src="icons/weather/bird1.webp" alt="" width="${size}" height="${size}" decoding="async"><img class="bb" src="icons/weather/bird2.webp" alt="" width="${size}" height="${size}" decoding="async"></span></span>`;
const birdsHtml = () => '<span class="wxbirds" aria-hidden="true">' + [bird(3, 60, 9, 0.1, 62), bird(14, 46, 11, 0.8, 30), bird(24, 36, 12, 1.5, 78), bird(6, 52, 10, 2.3, 12), bird(28, 32, 13, 3.2, 48)].join('') + '</span>';
const isRainy = c => (c >= 51 && c <= 67) || (c >= 80 && c <= 82) || c >= 95;

function tips(feels, rainP, code, gust) {
  const o = [];
  if (feels <= 12) o.push('קר, כדאי מעיל חם וכובע');
  else if (feels <= 17) o.push('קריר, כדאי מעיל או סווטשירט');
  else if (feels <= 22) o.push('נעים, חולצה ארוכה או שכבה קלה');
  else if (feels <= 27) o.push('חם, חולצה קצרה');
  else o.push('חם מאוד, בגדים קלים ובקבוק מים');
  if ((rainP ?? 0) >= 50 || isRainy(code)) o.push('צפוי גשם, קחו מטרייה או מעיל גשם');
  else if ((gust ?? 0) >= 40) o.push('רוח חזקה, כדאי שכבה נוספת');
  return o;
}

const COMPASS = ['צפון', 'צפון-מזרח', 'מזרח', 'דרום-מזרח', 'דרום', 'דרום-מערב', 'מערב', 'צפון-מערב'];
const compass = deg => deg == null ? '' : COMPASS[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
const seaState = h => h == null ? '' : h < 0.5 ? 'ים רגוע' : h < 1 ? 'גלים קטנים' : h < 1.5 ? 'גלים בינוניים' : h < 2.5 ? 'ים גבוה' : 'ים סוער';

const n0 = x => x == null ? '–' : String(Math.round(x));
const n1 = x => x == null ? '–' : Number(x).toFixed(1);
const val = s => `<b dir="ltr">${s}</b>`;
const row = (label, v) => `<div class="wxrow"><span>${label}</span>${v}</div>`;

// חלון ים: רקע, גולשת וגלים נעים. כשהגלים נמוכים היא יושבת על הלוח, וכשהם גבוהים היא עומדת ורוכבת
function seaScene(sea, phase) {
  const h = Number(sea.wave_height) || 0, ride = h >= 0.5;
  const sp = ride ? Math.max(1.2, Math.min(2.4, 2.8 - h)) : 4;
  const wv = Math.max(7, 16 - h * 6);
  const girl = ride
    ? `<span class="wxgirl"><img class="ba" src="icons/weather/surf1.webp" alt=""><img class="bb" src="icons/weather/surf2.webp" alt=""></span>`
    : `<span class="wxgirl wxsit"><img src="icons/weather/sit.webp" alt=""></span>`;
  return `<div class="wxsea ws-${phase}" style="--sp:${sp}s;--wv:${wv}s" aria-hidden="true">${girl}<span class="wxwaves"></span></div>`;
}
export async function mountWeather(host) {
  if (!host) return;
  let loc = getLoc(), data = null, failed = false, msg = '';
  const modal = document.createElement('div');
  modal.className = 'modal hidden'; modal.id = 'wxmodal';
  modal.innerHTML = '<div class="modal-card" id="wxcard2" role="dialog" aria-modal="true"></div>';
  document.body.append(modal);
  const mc = modal.querySelector('#wxcard2');
  const locName = () => loc.type === 'city' ? loc.name : loc.type === 'place' ? placeLabel(loc) : 'המיקום שלי';
  const placeNow = () => loc.type === 'gps' && loc.place && loc.placeLang === uiLang() ? loc.place : '';
  let placeTried = '', qText = '', results = null, resCountry = '', resNote = '', searching = false;
  let placeBusy = false, placeRetry = 0, gpsBusy = false;
  async function resolvePlace() {
    if (loc.type !== 'gps' || placeNow()) return;
    const key = `${loc.lat},${loc.lon},${uiLang()}`; if (placeTried === key) return; placeTried = key;
    const at = loc; placeBusy = true; renderCard();
    let name = '';
    try { name = await findPlace(at.lat, at.lon); } catch (_) {}
    if (loc !== at) return;
    if (!name) {
      // לא הצלחנו: מנקים כדי שרענון או ניסיון נוסף יבדקו שוב, ומנסים שוב עוד רגע (עד 3 פעמים)
      placeTried = '';
      const again = placeRetry++ < 3;
      placeBusy = again;
      renderCard(); if (!modal.classList.contains('hidden')) renderModal();
      if (again) setTimeout(() => { if (loc === at) resolvePlace(); }, 2500 * placeRetry);
      return;
    }
    placeBusy = false; placeRetry = 0;
    loc = { ...at, place: name, placeLang: uiLang() }; saveLoc(loc);
    renderCard(); if (!modal.classList.contains('hidden')) renderModal();
  }

  function renderCard() {
    if (failed || !data) {
      host.innerHTML = `<button type="button" class="card wxcard" id="wxRetry"><span class="wxemo" aria-hidden="true">${wimg('partly', 88)}</span><span class="wxmain"><span class="wxdesc">${failed ? 'לא הצלחנו לטעון את מזג האוויר' : 'טוען מזג אוויר...'}</span></span>${failed ? '<span class="wxmore">לחצו לנסות שוב</span>' : ''}</button>`;
      host.querySelector('#wxRetry').onclick = () => { if (failed) refresh(true); };
      return;
    }
    const cur = data.w.current, day = data.w.daily || {};
    const lk = look(cur, day);
    const tp = tips(cur.apparent_temperature, day.precipitation_probability_max?.[0], cur.weather_code, cur.wind_gusts_10m);
    host.innerHTML = `<button type="button" class="card wxcard sk-${lk.sky}${lk.dark ? ' wxdark' : ''}${lk.glow ? ' wxglow' : ''}" id="wxOpen" aria-haspopup="dialog">${skyHtml(lk.sky)}
      <span class="wxemo" aria-hidden="true">${wimg(lk.icon, 88)}</span>
      <span class="wxmain"><span class="wxtemp" dir="ltr">${n0(cur.temperature_2m)}°</span><span class="wxdesc">${lk.desc}</span>${loc.type !== 'gps' ? `<span class="wxplace" dir="auto">${esc(locName())}</span>` : ''}</span>${loc.type === 'gps' ? `<span class="wxbadge"><span class="wxb1">המיקום שלי</span>${placeNow() ? `<b class="wxb2" dir="auto">${esc(placeNow())}</b>` : placeBusy ? '<b class="wxb2">מאתר עיר...</b>' : ''}</span>` : ''}
      <span class="wxtips">${tp.map(x => `<span>${x}</span>`).join('')}</span>
      <span class="wxmore">למידע נוסף</span></button>`;
    host.querySelector('#wxOpen').onclick = openModal;
  }

  function renderModal() {
    if (!data) return;
    const cur = data.w.current, day = data.w.daily || {}, sea = data.sea;
    const lk = look(cur, day);
    const opts = Object.keys(CITIES).map(n => `<option value="${esc(n)}"${loc.type === 'city' && loc.name === n ? ' selected' : ''}>${esc(n)}</option>`).join('');
    const seaHtml = sea ? `
      <div class="wxsec">הים</div>
      ${seaScene(sea, lk.phase)}
      ${sea.wave_height != null ? row('מצב הים', `<b>${seaState(sea.wave_height)}</b>`) : ''}
      ${row('טמפרטורת המים', val(n1(sea.sea_surface_temperature) + ' °C'))}
      ${row('גובה הגלים', val(n1(sea.wave_height) + ' m'))}
      ${sea.wave_period != null ? row('זמן בין גלים', val(n0(sea.wave_period) + ' s')) : ''}
      ${sea.wave_direction != null ? row('הגלים מגיעים מכיוון', `<b>${compass(sea.wave_direction)}</b>`) : ''}
      <p class="wxnote">נתוני הים הם הערכה של מודל ולא מדידה בחוף. לפני כניסה למים כדאי להסתכל גם על הים עצמו.</p>`
      : '<p class="wxnote">אין נתוני ים למקום הזה.</p>';
    mc.innerHTML = `<button type="button" class="modal-x" id="wxX" aria-label="סגירה">${icon('x', 20)}</button>
      <div class="wxscene sk-${lk.sky}${lk.dark ? ' wxdark' : ''}${lk.glow ? ' wxglow' : ''}">${skyHtml(lk.sky)}${lk.birds ? birdsHtml() : ''}<div class="wxscene-in"><span class="wxemo" aria-hidden="true">${wimg(lk.icon, 112)}</span><div><div class="wxtemp" dir="ltr">${n0(cur.temperature_2m)}°</div><div class="wxdesc">${lk.desc}</div></div></div></div>
      <div class="wxloc"><label for="wxSel">מיקום</label>
        <select id="wxSel">${loc.type === 'place' ? `<option value="place" selected>🌍 ${esc(placeLabel(loc))}</option>` : ''}${loc.type === 'gps' ? (placeNow() ? `<option value="gps" selected>📍 ${esc(placeNow())}</option>` : placeBusy ? '<option value="gps" selected>📍 מאתר עיר...</option>' : '<option value="gps" selected>המיקום שלי</option>') : gpsBusy ? '<option value="busy" selected>📍 מאתר מיקום...</option>' : ''}${opts}</select>
        <button class="btn secondary" id="wxGps" type="button"${gpsBusy ? ' disabled' : ''}>${gpsBusy ? 'מאתר מיקום...' : '📍 המיקום שלי'}</button>
        <form class="wxfind" id="wxFindF" autocomplete="off"><input type="search" id="wxQ" placeholder="חפשו עיר או מדינה בעולם" maxlength="40" value="${esc(qText)}" dir="auto"><button class="btn secondary" type="submit">חיפוש</button></form>
        <div class="wxres" id="wxRes">${resHtml()}</div>
        <p class="error" id="wxMsg" role="alert">${esc(msg)}</p></div>
      <div class="wxsec">מזג אוויר</div>
      ${cur.time ? row('השעה במקום', val(String(cur.time).slice(11, 16))) : ''}
      ${day.sunrise?.[0] ? row('זריחה', val(String(day.sunrise[0]).slice(11, 16))) : ''}
      ${day.sunset?.[0] ? row('שקיעה', val(String(day.sunset[0]).slice(11, 16))) : ''}
      ${row('מרגיש כמו', val(n0(cur.apparent_temperature) + ' °C'))}
      ${row('היום בין', val(`${n0(day.temperature_2m_min?.[0])} - ${n0(day.temperature_2m_max?.[0])} °C`))}
      ${day.precipitation_probability_max?.[0] != null ? row('סיכוי לגשם', val(n0(day.precipitation_probability_max[0]) + '%')) : ''}
      <div class="wxsec">רוח</div>
      ${row('מהירות הרוח', val(n0(cur.wind_speed_10m) + ' km/h'))}
      ${row('משבים', val(n0(cur.wind_gusts_10m) + ' km/h'))}
      ${cur.wind_direction_10m != null ? row('הרוח נושבת מכיוון', `<b>${compass(cur.wind_direction_10m)}</b>`) : ''}
      ${seaHtml}
      <p class="wxsrc">Open-Meteo</p>`;
    mc.querySelector('#wxX').onclick = closeModal;
    mc.querySelector('#wxSel').onchange = e => { if (['gps', 'place', 'busy'].includes(e.target.value)) return; msg = ''; setLoc({ type: 'city', name: e.target.value }); };
    mc.querySelector('#wxGps').onclick = useGps;
    mc.querySelector('#wxFindF').onsubmit = e => { e.preventDefault(); doSearch(mc.querySelector('#wxQ').value); };
    mc.querySelector('#wxRes').onclick = e => {
      const b = e.target.closest('[data-i]'); const r = results[+b?.dataset.i]; if (!r) return;
      msg = ''; qText = ''; results = null; resNote = '';
      setLoc({ type: 'place', name: r.name, he: r.he, en: r.en, sub: r.sub, lat: r.lat, lon: r.lon });
    };
  }
  function resHtml() {
    if (searching) return '<p class="wxnote">מחפש...</p>';
    if (resNote) return `<p class="wxnote">${esc(resNote)}</p>`;
    if (!results) return '';
    return (resCountry ? `<p class="wxnote">${esc(resCountry)}: ערים מרכזיות</p>` : '') + results.map((r, i) => `<button type="button" class="wxresb" data-i="${i}"><b dir="auto">${esc(r.name)}</b><span dir="auto">${esc(r.sub)}</span></button>`).join('');
  }
  async function doSearch(q) {
    q = String(q || '').trim().slice(0, 40); qText = q;
    if (q.length < 2) { results = null; resNote = 'כתבו לפחות שתי אותיות'; renderModal(); return; }
    searching = true; resNote = ''; renderModal();
    try {
      const r = await searchPlaces(q); results = r.list; resCountry = r.country;
      resNote = r.list.length ? '' : 'לא נמצאו תוצאות';
    } catch (_) { results = null; resNote = 'החיפוש לא הצליח. נסו שוב.'; }
    searching = false; renderModal();
    mc.querySelector('#wxQ')?.focus();
  }

  const openModal = () => { msg = ''; renderModal(); modal.classList.remove('hidden'); };
  const closeModal = () => modal.classList.add('hidden');
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  async function refresh(force = false) {
    failed = false; if (!data) renderCard();
    try { data = await loadData(loc, force); } catch (_) { failed = true; if (!data) data = null; }
    renderCard(); if (!modal.classList.contains('hidden')) renderModal();
    resolvePlace();
  }
  function setLoc(l) { loc = l; placeRetry = 0; placeBusy = false; saveLoc(l); data = null; renderCard(); refresh(); }

  function useGps() {
    if (gpsBusy) return;
    if (!navigator.geolocation) { msg = 'המכשיר לא מאפשר לקבל מיקום. אפשר לבחור עיר מהרשימה.'; renderModal(); return; }
    msg = ''; gpsBusy = true; renderModal();
    navigator.geolocation.getCurrentPosition(
      p => { gpsBusy = false; msg = ''; setLoc({ type: 'gps', lat: +p.coords.latitude.toFixed(2), lon: +p.coords.longitude.toFixed(2) }); },
      () => { gpsBusy = false; msg = 'לא הצלחנו לקבל מיקום. אפשר לאשר גישה למיקום או לבחור עיר מהרשימה.'; renderModal(); },
      { timeout: 10000, maximumAge: 600000 });
  }

  await refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, MAX_AGE);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
