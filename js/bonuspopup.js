// חלון קופץ להורים: דיווח חדש על משימת בונוס/העשרה שמחכה לאישור. אפשר לאשר או לדחות ישר מהחלון.
import { supabase, esc, avatar, signedUrls, showToast, playChime } from './common.js';

const CSS = `
.bpov{position:fixed;inset:0;z-index:450;background:rgba(40,25,0,.55);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;padding:14px;animation:bpf .25s ease}
@keyframes bpf{from{opacity:0}to{opacity:1}}
.bpbox{width:100%;max-width:480px;max-height:92vh;display:flex;flex-direction:column;background:#FFFBEB;border:5px solid #F5B301;border-radius:26px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.35)}
.bphead{flex:none;padding:14px;text-align:center;font-size:22px;font-weight:800;color:#5A3A00;background:linear-gradient(135deg,#FFE27A,#FFB300)}
.bpbody{overflow:auto;padding:12px;display:flex;flex-direction:column;gap:12px}
.bpcard{background:#fff;border:3px solid #FFD36B;border-radius:20px;padding:12px;text-align:center}
.bpwho{display:flex;align-items:center;gap:10px;justify-content:center}
.bpwho b{font-size:21px;color:#7A4B00}
.bptitle{font-size:20px;font-weight:800;margin:8px 0 2px;color:#1F2937}
.bppts{display:inline-block;background:#FFE27A;border-radius:999px;padding:4px 14px;font-weight:800;color:#5A3A00;margin:4px 0}
.bpimg{display:block;max-width:100%;max-height:260px;margin:8px auto;border-radius:14px;cursor:zoom-in}
.bpact{display:flex;gap:8px;margin-top:8px}
.bpact button{flex:1;border:0;border-radius:14px;padding:13px;font:inherit;font-size:18px;font-weight:800;cursor:pointer}
.bpok{background:linear-gradient(135deg,#34C759,#16A34A);color:#fff}
.bpno{background:#fff;color:#B91C1C;border:3px solid #EF4444!important}
.bpact button:disabled{opacity:.6}
.bplater{flex:none;border:0;background:none;color:#7A4B00;font:inherit;font-weight:700;padding:12px;cursor:pointer;text-decoration:underline}
.bpzoom{position:fixed;inset:0;z-index:460;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;padding:10px}
.bpzoom img{max-width:100%;max-height:100%;border-radius:12px}`;

export function startBonusPopup(me, profiles) {
  if (me?.role !== 'admin') return;
  if (/bonus\.html$/.test(location.pathname)) return;
  const byId = Object.fromEntries((profiles || []).map(p => [p.id, p]));
  const st = document.createElement('style'); st.textContent = CSS; document.head.append(st);
  let ov = null, busy = false;
  const known = new Set();
  let seen = new Set(); try { seen = new Set(JSON.parse(sessionStorage.getItem('bpSeen') || '[]')); } catch (_) {}
  const saveSeen = () => { try { sessionStorage.setItem('bpSeen', JSON.stringify([...seen])); } catch (_) {} };
  const close = () => { if (ov) { ov.remove(); ov = null; document.body.style.overflow = ''; } };

  async function draw(list) {
    let urls = {}; try { urls = await signedUrls(list.map(c => c.photo_path)); } catch (_) {}
    if (!ov) { ov = document.createElement('div'); ov.className = 'bpov'; document.body.append(ov); document.body.style.overflow = 'hidden'; }
    ov.innerHTML = `<div class="bpbox"><div class="bphead">🏆 ${list.length > 1 ? 'דיווחים ממתינים לאישור' : 'דיווח ממתין לאישור'}</div>
      <div class="bpbody">${list.map(c => `<div class="bpcard" data-c="${c.id}">
        <div class="bpwho">${avatar(byId[c.user_id], 52)}<b>${esc(byId[c.user_id]?.name || 'מישהו')}</b></div>
        <div class="bptitle">${esc(c.title)}</div><span class="bppts" dir="ltr">⭐ +${c.points}</span>
        ${c.photo_path && urls[c.photo_path] ? `<img class="bpimg" src="${urls[c.photo_path]}" alt="תמונת הוכחה" data-z="${urls[c.photo_path]}">` : ''}
        <div class="bpact"><button class="bpok" data-ok="${c.id}" type="button">אישור</button><button class="bpno" data-no="${c.id}" type="button">דחייה</button></div></div>`).join('')}</div>
      <button class="bplater" type="button" id="bpLater">לא עכשיו</button></div>`;
    ov.querySelector('#bpLater').onclick = () => { list.forEach(c => seen.add(c.id)); saveSeen(); close(); };
    ov.querySelectorAll('[data-z]').forEach(i => i.onclick = () => { const z = document.createElement('div'); z.className = 'bpzoom'; z.innerHTML = `<img src="${i.dataset.z}" alt="">`; z.onclick = () => z.remove(); document.body.append(z); });
    ov.querySelectorAll('[data-ok],[data-no]').forEach(b => b.onclick = async () => {
      if (busy) return; busy = true; b.parentElement.querySelectorAll('button').forEach(x => x.disabled = true);
      const ok = !!b.dataset.ok, id = b.dataset.ok || b.dataset.no;
      const { error } = await supabase.rpc('decide_bonus_claim', { p_claim: id, p_ok: ok });
      busy = false;
      if (error) { showToast('הפעולה נכשלה, נסו שוב', true); b.parentElement.querySelectorAll('button').forEach(x => x.disabled = false); return; }
      showToast(ok ? 'אושר. הנקודות נוספו' : 'הדיווח נדחה');
      check();
    });
  }

  async function check() {
    if (busy) return;
    const { data, error } = await supabase.from('bonus_claims').select('*').eq('status', 'pending').neq('user_id', me.id).order('created_at');
    if (error) return;
    const list = data || [];
    const fresh = list.filter(c => !known.has(c.id)); list.forEach(c => known.add(c.id));
    if (fresh.length && known.size > fresh.length) playChime();
    const show = list.filter(c => !seen.has(c.id));
    if (!show.length) { close(); return; }
    draw(list);
  }
  check();
  setInterval(() => { if (!document.hidden) check(); }, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
}
