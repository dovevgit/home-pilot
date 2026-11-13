// כרטיס מזג אוויר בדף הבית: מזג אוויר, רוח, ים וגלים מ-Open-Meteo (חינמי, בלי מפתח).
// המיקום שנבחר נשמר רק במכשיר (localStorage), לא במסד הנתונים.
import { esc, icon } from './common.js';

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
  } catch (_) {}
  return DEFAULT_LOC;
};
const saveLoc = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (_) {} };
const coordsOf = l => l.type === 'city' ? CITIES[l.name] : { lat: l.lat, lon: l.lon, mlat: l.lat, mlon: l.lon, sea: true };

async function fetchJson(url) {
  const c = new AbortController(); const id = setTimeout(() => c.abort(), 10000);
  try { const r = await fetch(url, { signal: c.signal }); if (!r.ok) throw new Error('http ' + r.status); return await r.json(); }
  finally { clearTimeout(id); }
}

async function loadData(loc, force = false) {
  const c = coordsOf(loc);
  const ck = `wxCache:${c.lat.toFixed(2)},${c.lon.toFixed(2)}`;
  if (!force) { try { const v = JSON.parse(sessionStorage.getItem(ck)); if (v && Date.now() - v.t < MAX_AGE) return v.d; } catch (_) {} }
  const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&wind_speed_unit=kmh&timezone=auto&forecast_days=1`;
  const mUrl = c.sea ? `https://marine-api.open-meteo.com/v1/marine?latitude=${c.mlat}&longitude=${c.mlon}&current=wave_height,wave_direction,wave_period,sea_surface_temperature&timezone=auto` : null;
  const [w, m] = await Promise.all([fetchJson(wUrl), mUrl ? fetchJson(mUrl).catch(() => null) : Promise.resolve(null)]);
  const sc = m?.current;
  const sea = sc && (sc.wave_height != null || sc.sea_surface_temperature != null) ? sc : null;
  const d = { w, sea };
  try { sessionStorage.setItem(ck, JSON.stringify({ t: Date.now(), d })); } catch (_) {}
  return d;
}

const wcode = c => {
  if (c === 0) return ['☀️', 'שמיים בהירים'];
  if (c === 1) return ['🌤️', 'בהיר ברובו'];
  if (c === 2) return ['⛅', 'מעונן חלקית'];
  if (c === 3) return ['☁️', 'מעונן'];
  if (c === 45 || c === 48) return ['🌫️', 'ערפל'];
  if (c >= 51 && c <= 57) return ['🌦️', 'טפטוף'];
  if ((c >= 61 && c <= 67)) return ['🌧️', 'גשם'];
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) return ['🌨️', 'שלג'];
  if (c >= 80 && c <= 82) return ['🌦️', 'ממטרים'];
  if (c >= 95) return ['⛈️', 'סופת רעמים'];
  return ['⛅', 'מזג אוויר משתנה'];
};
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

export async function mountWeather(host) {
  if (!host) return;
  let loc = getLoc(), data = null, failed = false, msg = '';
  const modal = document.createElement('div');
  modal.className = 'modal hidden'; modal.id = 'wxmodal';
  modal.innerHTML = '<div class="modal-card" id="wxcard2" role="dialog" aria-modal="true"></div>';
  document.body.append(modal);
  const mc = modal.querySelector('#wxcard2');
  const locName = () => loc.type === 'city' ? loc.name : 'המיקום שלי';

  function renderCard() {
    if (failed || !data) {
      host.innerHTML = `<button type="button" class="card wxcard" id="wxRetry"><span class="wxemo" aria-hidden="true">🌤️</span><span class="wxmain"><span class="wxdesc">${failed ? 'לא הצלחנו לטעון את מזג האוויר' : 'טוען מזג אוויר...'}</span></span>${failed ? '<span class="wxmore">לחצו לנסות שוב</span>' : ''}</button>`;
      host.querySelector('#wxRetry').onclick = () => { if (failed) refresh(true); };
      return;
    }
    const cur = data.w.current, day = data.w.daily || {};
    const [emo, desc] = wcode(cur.weather_code);
    const tp = tips(cur.apparent_temperature, day.precipitation_probability_max?.[0], cur.weather_code, cur.wind_gusts_10m);
    host.innerHTML = `<button type="button" class="card wxcard" id="wxOpen" aria-haspopup="dialog">
      <span class="wxemo" aria-hidden="true">${emo}</span>
      <span class="wxmain"><span class="wxtemp" dir="ltr">${n0(cur.temperature_2m)}°</span><span class="wxdesc">${desc}</span><span class="wxplace">${esc(locName())}</span></span>
      <span class="wxtips">${tp.map(x => `<span>${x}</span>`).join('')}</span>
      <span class="wxmore">למידע נוסף</span></button>`;
    host.querySelector('#wxOpen').onclick = openModal;
  }

  function renderModal() {
    if (!data) return;
    const cur = data.w.current, day = data.w.daily || {}, sea = data.sea;
    const [emo, desc] = wcode(cur.weather_code);
    const opts = Object.keys(CITIES).map(n => `<option value="${esc(n)}"${loc.type === 'city' && loc.name === n ? ' selected' : ''}>${esc(n)}</option>`).join('');
    const seaHtml = sea ? `
      <div class="wxsec">הים</div>
      ${sea.wave_height != null ? row('מצב הים', `<b>${seaState(sea.wave_height)}</b>`) : ''}
      ${row('טמפרטורת המים', val(n1(sea.sea_surface_temperature) + ' °C'))}
      ${row('גובה הגלים', val(n1(sea.wave_height) + ' m'))}
      ${sea.wave_period != null ? row('זמן בין גלים', val(n0(sea.wave_period) + ' s')) : ''}
      ${sea.wave_direction != null ? row('הגלים מגיעים מכיוון', `<b>${compass(sea.wave_direction)}</b>`) : ''}
      <p class="wxnote">נתוני הים הם הערכה של מודל ולא מדידה בחוף. לפני כניסה למים כדאי להסתכל גם על הים עצמו.</p>`
      : '<p class="wxnote">אין נתוני ים למקום הזה.</p>';
    mc.innerHTML = `<button type="button" class="modal-x" id="wxX" aria-label="סגירה">${icon('x', 20)}</button>
      <div class="wxhead"><span class="wxemo" aria-hidden="true">${emo}</span><div><div class="wxtemp" dir="ltr">${n0(cur.temperature_2m)}°</div><div class="wxdesc">${desc}</div></div></div>
      <div class="wxloc"><label for="wxSel">מיקום</label>
        <select id="wxSel">${loc.type === 'gps' ? '<option value="gps" selected>המיקום שלי</option>' : ''}${opts}</select>
        <button class="btn secondary" id="wxGps" type="button">📍 המיקום שלי</button>
        <p class="error" id="wxMsg" role="alert">${esc(msg)}</p></div>
      <div class="wxsec">מזג אוויר</div>
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
    mc.querySelector('#wxSel').onchange = e => { if (e.target.value === 'gps') return; msg = ''; setLoc({ type: 'city', name: e.target.value }); };
    mc.querySelector('#wxGps').onclick = useGps;
  }

  const openModal = () => { msg = ''; renderModal(); modal.classList.remove('hidden'); };
  const closeModal = () => modal.classList.add('hidden');
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  async function refresh(force = false) {
    failed = false; if (!data) renderCard();
    try { data = await loadData(loc, force); } catch (_) { failed = true; if (!data) data = null; }
    renderCard(); if (!modal.classList.contains('hidden')) renderModal();
  }
  function setLoc(l) { loc = l; saveLoc(l); data = null; renderCard(); refresh(); }

  function useGps() {
    if (!navigator.geolocation) { msg = 'המכשיר לא מאפשר לקבל מיקום. אפשר לבחור עיר מהרשימה.'; renderModal(); return; }
    mc.querySelector('#wxMsg').textContent = '';
    navigator.geolocation.getCurrentPosition(
      p => { msg = ''; setLoc({ type: 'gps', lat: +p.coords.latitude.toFixed(2), lon: +p.coords.longitude.toFixed(2) }); },
      () => { msg = 'לא הצלחנו לקבל מיקום. אפשר לאשר גישה למיקום או לבחור עיר מהרשימה.'; renderModal(); },
      { timeout: 10000, maximumAge: 600000 });
  }

  await refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, MAX_AGE);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
