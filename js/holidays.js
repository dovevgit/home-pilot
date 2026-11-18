/* חגים וימים לאומיים בישראל, מחושבים במכשיר לפי הלוח העברי (בלי רשת ובלי מסד נתונים).
   holidaysOn('2027-04-22') מחזיר מערך של שמות, למשל ['פסח']. */
const HF = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const cache = new Map();
// תאריך עברי של יום גרגוריאני: { m: 'Nisan', d: 15, w: 0..6 (ראשון=0) }
function heb(iso) {
  if (cache.has(iso)) return cache.get(iso);
  const [y, mo, dd] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, dd));
  const p = HF.formatToParts(dt);
  let m = p.find(x => x.type === 'month').value;
  if (m === 'Adar II') m = 'Adar';          // בשנה מעוברת פורים באדר ב׳
  else if (m === 'Adar I') m = 'AdarI';
  const r = { m, d: Number(p.find(x => x.type === 'day').value), w: dt.getUTCDay() };
  cache.set(iso, r); return r;
}
const addD = (iso, n) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); };
// היום בשבוע שבו נופל יום X בחודש הנוכחי (לפי היום הנבדק)
const wOf = (h, x) => ((h.w - (h.d - x)) % 7 + 7) % 7;

const FIXED = {
  Tishri: { 1: 'ראש השנה', 2: 'ראש השנה', 10: 'יום כיפור', 15: 'סוכות', 16: 'חול המועד סוכות', 17: 'חול המועד סוכות', 18: 'חול המועד סוכות', 19: 'חול המועד סוכות', 20: 'חול המועד סוכות', 21: 'הושענא רבה', 22: 'שמחת תורה' },
  Shevat: { 15: 'ט״ו בשבט' },
  Adar: { 14: 'פורים', 15: 'שושן פורים' },
  Nisan: { 15: 'פסח', 16: 'חול המועד פסח', 17: 'חול המועד פסח', 18: 'חול המועד פסח', 19: 'חול המועד פסח', 20: 'חול המועד פסח', 21: 'שביעי של פסח' },
  Iyar: { 18: 'ל״ג בעומר', 28: 'יום ירושלים' },
  Sivan: { 6: 'שבועות' },
};

export function holidaysOn(iso) {
  const h = heb(iso), out = [];
  const f = FIXED[h.m]?.[h.d]; if (f) out.push(f);
  // חנוכה: שמונה ימים מכ״ה בכסלו
  for (let k = 0; k < 8; k++) { const b = heb(addD(iso, -k)); if (b.m === 'Kislev' && b.d === 25) { out.push(`חנוכה · נר ${k + 1}`); break; } }
  // יום השואה: כ״ז בניסן; אם חל בשישי מקדימים לחמישי, אם בראשון דוחים לשני
  if (h.m === 'Nisan') { const w = wOf(h, 27), off = w === 5 ? -1 : w === 0 ? 1 : 0; if (h.d === 27 + off) out.push('יום השואה'); }
  // יום הזיכרון ויום העצמאות: ד׳–ה׳ באייר, עם הקדמה (שישי/שבת) או דחייה (שני)
  if (h.m === 'Iyar') { const w = wOf(h, 5), off = w === 5 ? -1 : w === 6 ? -2 : w === 1 ? 1 : 0;
    if (h.d === 4 + off) out.push('יום הזיכרון'); if (h.d === 5 + off) out.push('יום העצמאות'); }
  // תשעה באב: ט׳ באב, ואם חל בשבת נדחה ליום ראשון
  if (h.m === 'Av') { const w = wOf(h, 9); if (h.d === (w === 6 ? 10 : 9)) out.push('תשעה באב'); }
  return out;
}
