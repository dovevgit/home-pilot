// בדיקת התנגשות בין שיבוץ משימה לבין פעילויות בלוח השנה.
import { supabase, ilDate, addDays, dow } from './common.js';

export const WEEKDAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
export const hm = t => String(t || '').slice(0, 5);

// האם פעילות e מתנגשת עם שיבוץ לפי סוג החזרה. מחזיר טקסט של היום (למשל "יום שלישי") או null.
function hitDay(e, { repeat, weekday, date }, today, horizon) {
  if (e.repeat === 'weekly') {
    if (repeat === 'once' ? dow(date) === e.weekday : repeat === 'weekly' ? weekday === e.weekday : true) return `יום ${WEEKDAYS[e.weekday]}`;
    return null;
  }
  if (e.event_date >= today) {
    const ok = repeat === 'once' ? e.event_date === date
      : repeat === 'weekly' ? dow(e.event_date) === weekday && e.event_date <= addDays(today, 14)
      : e.event_date <= horizon;
    if (ok) return e.event_date.split('-').reverse().join('.');
  }
  return null;
}

export async function loadEvents() {
  const { data, error } = await supabase.from('events').select('*');
  return error || !data ? [] : data;
}

// מי פנוי בשעה מסוימת: מחזיר {userId: null | {title, day, from, to}}
export function availability(events, { repeat, weekday, date }, time, userIds) {
  const today = ilDate(new Date()), horizon = addDays(today, 7), out = {};
  for (const id of userIds) {
    out[id] = null;
    for (const e of events.filter(x => x.user_id === id)) {
      if (!(hm(e.start_time) <= time && time < hm(e.end_time))) continue;
      const day = hitDay(e, { repeat, weekday, date }, today, horizon);
      if (day) { out[id] = { title: e.title, day, from: hm(e.start_time), to: hm(e.end_time) }; break; }
    }
  }
  return out;
}

// repeat: 'once' | 'weekly' | 'daily'. slots: [{assignee_id, time:'HH:MM'}]. מחזיר מערך הודעות (ריק = אין התנגשות).
export async function findConflicts({ repeat, weekday, date, slots }, profiles) {
  // בונה רשימת בדיקות {uid, time, wd}. במשימה יומית כל יום בשבוע נבדק לפי מה שנקבע לו (מחליף/שעה שונה ביום מסוים).
  const checks = [];
  for (const s of slots) {
    if (repeat === 'daily') {
      for (let wd = 0; wd < 7; wd++) { const p = normExc(s.exc?.[wd]); checks.push({ uid: p?.u || s.assignee_id, time: p?.t || s.time, wd }); }
    } else checks.push({ uid: s.assignee_id, time: s.time, wd: null });
  }
  const ids = [...new Set(checks.map(c => c.uid))];
  const { data, error } = await supabase.from('events').select('*').in('user_id', ids);
  if (error || !data) return [];
  const today = ilDate(new Date()), horizon = addDays(today, 7);
  const name = id => profiles.find(p => p.id === id)?.name || '';
  const out = new Set();
  for (const c of checks) {
    for (const e of data.filter(x => x.user_id === c.uid)) {
      if (!(hm(e.start_time) <= c.time && c.time < hm(e.end_time))) continue;
      let day = null;
      if (c.wd === null) day = hitDay(e, { repeat, weekday, date }, today, horizon);
      else if (e.repeat === 'weekly') day = e.weekday === c.wd ? `יום ${WEEKDAYS[c.wd]}` : null;
      else if (e.event_date >= today && e.event_date <= horizon && dow(e.event_date) === c.wd) day = e.event_date.split('-').reverse().join('.');
      if (day) out.add(`${name(c.uid)} בפעילות "${e.title}" (${day}, ${hm(e.start_time)}–${hm(e.end_time)}), והמשימה נקבעה ל-${c.time}`);
    }
  }
  return [...out];
}

// exc / מחליף: מחרוזת (מזהה משתמש) או {u, t} (משתמש ושעה). מחזיר {u, t} או null.
export function normExc(v) { return !v ? null : typeof v === 'string' ? { u: v, t: null } : { u: v.u || null, t: v.t || null }; }

// כשאין מי שפנוי בשעה: מציע לכל משתמש את השעה הקרובה ביותר שבה הוא פנוי באותו יום.
// busyFn(userId, 'HH:MM') מחזיר null אם פנוי. מחזיר [{u, t, d}] לפי מרחק מהשעה המקורית.
export function suggestTimes(users, time, busyFn, { step = 15, from = '06:00', to = '22:00', limit = 4 } = {}) {
  const toMin = x => { const [h, m] = x.split(':').map(Number); return h * 60 + m; };
  const fmt = n => String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');
  const base = toMin(time), lo = toMin(from), hi = toMin(to), out = [];
  for (const u of users) {
    let best = null;
    for (let d = step; d <= 16 * 60 && !best; d += step) {
      for (const m of [base - d, base + d]) if (m >= lo && m <= hi && !busyFn(u, fmt(m)) && (!best || Math.abs(m - base) < Math.abs(best - base))) best = m;
    }
    if (best != null) out.push({ u, t: fmt(best), d: Math.abs(best - base) });
  }
  return out.sort((a, b) => a.d - b.d).slice(0, limit);
}
