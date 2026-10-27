/* לוח שנה אחיד לכל הדפדפנים: תאריך נבחר, חיצים לחודשים, בחירת שנה, ועיפרון להקלדה */
const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const DAYS = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
const pad = n => String(n).padStart(2, '0');

export function openDatePicker({ value, onPick, onType, minYear = 1920 }) {
  const now = new Date();
  const maxYear = now.getFullYear();
  let sel = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
  let y = sel ? +sel.slice(0, 4) : maxYear - 30, m = sel ? +sel.slice(5, 7) - 1 : now.getMonth();
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(15,30,60,.55);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px';
  const card = document.createElement('div');
  card.dir = 'rtl';
  card.style.cssText = 'background:#fff;border-radius:22px;padding:18px 16px 12px;width:100%;max-width:380px;max-height:92vh;overflow:auto;color:#1f2937;font-size:18px';
  ov.appendChild(card);
  const close = () => ov.remove();
  ov.addEventListener('click', e => { if (e.target === ov) close(); });

  function head() {
    const t = sel ? sel.split('-').reverse().join('/') : 'בחרו תאריך';
    return `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <b style="font-size:26px" dir="ltr">${t}</b>
      <button type="button" data-a="type" aria-label="הקלדה" style="width:44px;height:44px;border:0;background:#EAF2FF;border-radius:50%;font-size:22px;cursor:pointer">✏️</button></div>`;
  }
  function render() {
    const first = new Date(Date.UTC(y, m, 1)).getUTCDay(), count = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    let cells = '';
    for (let i = 0; i < first; i++) cells += '<span></span>';
    for (let d = 1; d <= count; d++) {
      const iso = `${y}-${pad(m + 1)}-${pad(d)}`, on = iso === sel, future = new Date(Date.UTC(y, m, d)) > now;
      cells += `<button type="button" data-d="${iso}" ${future ? 'disabled' : ''} style="height:42px;border:0;border-radius:50%;font:inherit;font-size:17px;cursor:pointer;background:${on ? '#2F6BFF' : 'transparent'};color:${on ? '#fff' : future ? '#c3c8d0' : '#1f2937'}">${d}</button>`;
    }
    let ys = '';
    for (let k = maxYear; k >= minYear; k--) ys += `<option value="${k}" ${k === y ? 'selected' : ''}>${k}</option>`;
    card.innerHTML = `${head()}
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <button type="button" data-a="prev" aria-label="חודש קודם" style="width:40px;height:40px;border:0;background:#F3F8FF;border-radius:50%;font-size:20px;cursor:pointer">›</button>
        <select data-a="m" style="flex:1;height:42px;border-radius:12px;border:1px solid #cfd8e6;font:inherit;font-size:17px;background:#fff">${MONTHS.map((n, i) => `<option value="${i}" ${i === m ? 'selected' : ''}>${n}</option>`).join('')}</select>
        <select data-a="y" style="width:96px;height:42px;border-radius:12px;border:1px solid #cfd8e6;font:inherit;font-size:17px;background:#fff" dir="ltr">${ys}</select>
        <button type="button" data-a="next" aria-label="חודש הבא" style="width:40px;height:40px;border:0;background:#F3F8FF;border-radius:50%;font-size:20px;cursor:pointer">‹</button></div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;color:#6b7280;font-size:15px;margin-bottom:4px">${DAYS.map(d => `<span>${d}</span>`).join('')}</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;gap:2px">${cells}</div>
      <div style="display:flex;gap:10px;justify-content:flex-start;margin-top:12px">
        <button type="button" data-a="ok" style="border:0;background:none;color:#2F6BFF;font:inherit;font-weight:800;font-size:18px;padding:10px 14px;cursor:pointer">אישור</button>
        <button type="button" data-a="cancel" style="border:0;background:none;color:#2F6BFF;font:inherit;font-size:18px;padding:10px 14px;cursor:pointer">ביטול</button>
        <button type="button" data-a="clear" style="border:0;background:none;color:#6b7280;font:inherit;font-size:16px;padding:10px 14px;cursor:pointer;margin-inline-start:auto">ניקוי</button></div>`;
  }
  card.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.d) { sel = b.dataset.d; render(); return; }
    const a = b.dataset.a;
    if (a === 'prev') { m--; if (m < 0) { m = 11; y--; } if (y < minYear) { y = minYear; m = 0; } render(); }
    else if (a === 'next') { m++; if (m > 11) { m = 0; y++; } if (y > maxYear) { y = maxYear; m = now.getMonth(); } render(); }
    else if (a === 'ok') { close(); onPick(sel); }
    else if (a === 'clear') { close(); onPick(null); }
    else if (a === 'cancel') close();
    else if (a === 'type') { close(); onType && onType(); }
  });
  card.addEventListener('change', e => {
    const a = e.target.dataset.a;
    if (a === 'm') { m = +e.target.value; render(); }
    else if (a === 'y') { y = +e.target.value; render(); }
  });
  render();
  document.body.appendChild(ov);
}
