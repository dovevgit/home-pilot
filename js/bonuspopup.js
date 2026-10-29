// חלונות קופצים של משימות בונוס/העשרה.
// להורים: בקשה לבצע בונוס, או דיווח "ביצעתי", שמחכים לאישור (אישור/דחייה ישר מהחלון).
// למי שביקש: "המשימה אושרה" עם כל הפרטים ואז מעבר למסך "ביצעתי", או הודעה שהבקשה/הדיווח לא אושרו.
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
.bpk{position:fixed;inset:0;z-index:455;background:rgba(20,40,20,.6);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;padding:14px;animation:bpf .25s ease}
.bpkbox{width:100%;max-width:440px;background:#F0FDF4;border:5px solid #22C55E;border-radius:26px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.35);text-align:center}
.bpkbox.no{background:#FEF2F2;border-color:#EF4444}
.bpkhead{padding:14px;font-size:24px;font-weight:800;color:#14532D;background:linear-gradient(135deg,#86EFAC,#22C55E)}
.bpkbox.no .bpkhead{color:#7F1D1D;background:linear-gradient(135deg,#FECACA,#F87171)}
.bpkbody{padding:16px}
.bpkbody img.ic{width:96px;height:96px;object-fit:contain}
.bpkdesc{color:#374151;margin:4px 0 8px;font-size:17px}
.bpkphoto{display:inline-block;background:#E0F2FE;color:#075985;border-radius:999px;padding:4px 12px;font-weight:700;margin:4px 0}
.bpkok{display:block;width:calc(100% - 28px);margin:0 14px 14px;border:0;border-radius:16px;padding:14px;font:inherit;font-size:19px;font-weight:800;color:#fff;background:linear-gradient(135deg,#34C759,#16A34A);cursor:pointer}
.bpzoom{position:fixed;inset:0;z-index:460;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;padding:10px}
.bpzoom img{max-width:100%;max-height:100%;border-radius:12px}`;

export function startBonusPopup(me, profiles) {
  const parentMode = me?.role === 'admin' && !/bonus\.html$/.test(location.pathname);
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
    ov.innerHTML = `<div class="bpbox"><div class="bphead">🏆 ${list.length > 1 ? 'ממתינים לאישור שלך' : 'ממתין לאישור שלך'}</div>
      <div class="bpbody">${list.map(c => `<div class="bpcard" data-c="${c.id}">
        <div class="bpwho">${avatar(byId[c.user_id], 52)}<b>${esc(byId[c.user_id]?.name || 'מישהו')}</b></div>
        <div class="bptitle">${c.status === 'requested' ? 'מבקש/ת לבצע: ' : 'ביצע/ה: '}${esc(c.title)}</div><span class="bppts" dir="ltr">⭐ +${c.points}</span>
        ${c.photo_path && urls[c.photo_path] ? `<img class="bpimg" src="${urls[c.photo_path]}" alt="תמונת הוכחה" data-z="${urls[c.photo_path]}">` : ''}
        <div class="bpact">${c.status === 'requested' ? `<button class="bpok" data-rok="${c.id}" type="button">אישור לבצע</button><button class="bpno" data-rno="${c.id}" type="button">דחייה</button>` : `<button class="bpok" data-ok="${c.id}" type="button">אישור</button><button class="bpno" data-no="${c.id}" type="button">דחייה</button>`}</div></div>`).join('')}</div>
      <button class="bplater" type="button" id="bpLater">לא עכשיו</button></div>`;
    ov.querySelector('#bpLater').onclick = () => { list.forEach(c => seen.add(c.id)); saveSeen(); close(); };
    ov.querySelectorAll('[data-z]').forEach(i => i.onclick = () => { const z = document.createElement('div'); z.className = 'bpzoom'; z.innerHTML = `<img src="${i.dataset.z}" alt="">`; z.onclick = () => z.remove(); document.body.append(z); });
    ov.querySelectorAll('[data-ok],[data-no],[data-rok],[data-rno]').forEach(b => b.onclick = async () => {
      if (busy) return; busy = true; b.parentElement.querySelectorAll('button').forEach(x => x.disabled = true);
      const isReq = !!(b.dataset.rok || b.dataset.rno);
      const ok = !!(b.dataset.ok || b.dataset.rok), id = b.dataset.ok || b.dataset.no || b.dataset.rok || b.dataset.rno;
      const { error } = await supabase.rpc(isReq ? 'decide_bonus_request' : 'decide_bonus_claim', { p_claim: id, p_ok: ok });
      busy = false;
      if (error) { showToast('הפעולה נכשלה, נסו שוב', true); b.parentElement.querySelectorAll('button').forEach(x => x.disabled = false); return; }
      showToast(isReq ? (ok ? 'אושר. הילד יקבל הודעה' : 'הבקשה נדחתה') : (ok ? 'אושר. הנקודות נוספו' : 'הדיווח נדחה'));
      check();
    });
  }

  async function check() {
    if (busy) return;
    const { data, error } = await supabase.from('bonus_claims').select('*').in('status', ['requested', 'pending']).neq('user_id', me.id).order('created_at');
    if (error) return;
    const list = data || [];
    const fresh = list.filter(c => !known.has(c.id)); list.forEach(c => known.add(c.id));
    if (fresh.length && known.size > fresh.length) playChime();
    const show = list.filter(c => !seen.has(c.id));
    if (!show.length) { close(); return; }
    draw(list);
  }
  // ===== למי שביקש/דיווח: תשובה מההורים =====
  let kov = null, kseen = new Set(); try { kseen = new Set(JSON.parse(localStorage.getItem('bpKidSeen') || '[]')); } catch (_) {}
  const ksave = () => { try { localStorage.setItem('bpKidSeen', JSON.stringify([...kseen].slice(-200))); } catch (_) {} };
  async function kidCheck() {
    if (kov) return;
    const since = new Date(Date.now() - 7 * 864e5).toISOString();
    const { data, error } = await supabase.from('bonus_claims').select('*').eq('user_id', me.id).in('status', ['ready', 'rejected']).gte('decided_at', since).order('decided_at');
    if (error) return;
    const c = (data || []).find(x => (x.status === 'ready' || x.status === 'rejected') && !kseen.has(x.id + ':' + x.status));
    if (!c) return;
    let t = null;
    if (c.status === 'ready') { const r = await supabase.from('bonus_tasks').select('*').eq('id', c.task_id).maybeSingle(); t = r.data; }
    if (kov) return;
    const done = () => { kseen.add(c.id + ':' + c.status); ksave(); kov.remove(); kov = null; };
    kov = document.createElement('div'); kov.className = 'bpk';
    if (c.status === 'ready') {
      kov.innerHTML = `<div class="bpkbox"><div class="bpkhead">🎉 המשימה אושרה!</div><div class="bpkbody"><img class="ic" src="icons/task/${esc(t?.icon || 'trophy')}.png" alt=""><div class="bptitle">${esc(c.title)}</div>${t?.description ? `<div class="bpkdesc">${esc(t.description)}</div>` : ''}<span class="bppts" dir="ltr">⭐ +${c.points}</span>${t?.requires_photo ? '<div><span class="bpkphoto">📷 צריך צילום להוכחה</span></div>' : ''}</div><button class="bpkok" type="button">הבנתי, מתחילים</button></div>`;
      document.body.append(kov);
      playChime();
      kov.querySelector('.bpkok').onclick = () => {
        done();
        if (/bonus\.html$/.test(location.pathname)) window.dispatchEvent(new CustomEvent('bonus-open-do', { detail: c.task_id }));
        else location.href = 'bonus.html#do=' + c.task_id;
      };
    } else {
      kov.innerHTML = `<div class="bpkbox no"><div class="bpkhead">${c.reported_at ? 'הדיווח לא אושר' : 'הבקשה לא אושרה'}</div><div class="bpkbody"><div class="bptitle">${esc(c.title)}</div><div class="bpkdesc">${c.reported_at ? 'ההורים לא אישרו את הדיווח הפעם.' : 'ההורים לא אישרו את המשימה הפעם.'}</div></div><button class="bpkok" type="button" style="background:#B91C1C">הבנתי</button></div>`;
      document.body.append(kov);
      kov.querySelector('.bpkok').onclick = () => { done(); if (/bonus\.html$/.test(location.pathname)) window.dispatchEvent(new CustomEvent('bonus-reload')); };
    }
  }
  const tick = () => { if (parentMode) check(); kidCheck(); };
  tick();
  setInterval(() => { if (!document.hidden) tick(); }, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
}
