// כניסה לפי קוד בית, והרשמה/ניהול בני משפחה דרך הפונקציה family בשרת.
import { supabase } from './supabase.js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

// אימייל פנימי (Supabase דורש אימייל). חייב להיות זהה לחישוב בשרת (supabase/functions/family).
export function internalEmail(code, username) {
  const raw = code.trim().normalize('NFC').toUpperCase() + ':' + username.trim().normalize('NFC').toLowerCase();
  const hex = Array.from(new TextEncoder().encode(raw)).map(b => b.toString(16).padStart(2, '0')).join('');
  return 'u' + hex + '@habayit.app';
}

export const savedCode = () => { try { return localStorage.getItem('familyCode') || ''; } catch (_) { return ''; } };
export const saveCode = (c) => { try { localStorage.setItem('familyCode', c.trim().toUpperCase()); } catch (_) {} };

const MSG = {
  bad_signup_code: 'קוד ההצטרפות לניסוי לא נכון',
  bad_name: 'השם לא תקין (עד 20 תווים)',
  bad_username: 'שם משתמש: 2 עד 20 תווים, אותיות, ספרות, נקודה, קו תחתון או מקף',
  bad_password: 'הסיסמה צריכה להיות לפחות 6 תווים',
  username_taken: 'שם המשתמש הזה כבר קיים בבית',
  family_full: 'הבית מלא (עד 12 בני משפחה)',
  forbidden: 'רק הורים יכולים לעשות את זה',
  unauthorized: 'צריך להתחבר מחדש',
  cannot_remove_self: 'אי אפשר להסיר את עצמך',
  cannot_demote_self: 'אי אפשר להוריד את עצמך מהורה',
  bad_confirm: 'קוד הבית שהוקלד לא תואם',
  bad_avatar: 'התמונה לא תקינה',
  avatar_too_big: 'התמונה גדולה מדי',
  no_login: 'לדמות אין כניסה',
  not_found: 'לא נמצא'
};

export async function callFamily(action, body = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/family`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: 'Bearer ' + (session?.access_token || SUPABASE_PUBLISHABLE_KEY) },
    body: JSON.stringify({ action, ...body })
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || out.error) { const e = new Error(MSG[out.error] || 'הפעולה נכשלה, נסו שוב'); e.code = out.error; throw e; }
  return out;
}

export async function signIn(code, username, password) {
  return supabase.auth.signInWithPassword({ email: internalEmail(code, username), password });
}

// תמונה מקובץ/מצלמה -> JPEG קטן (data URL)
export function imageToDataUrl(file, max = 400) {
  return new Promise((resolve, reject) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('התמונה לא נטענה')); };
    img.src = url;
  });
}

// צילום פנים בעיגול: מצלמה בתוך האפליקציה, חיתוך ריבוע מהאזור שבתוך העיגול. מחזיר data URL (JPEG 400x400) או null.
export function captureFace() {
  return new Promise((resolve) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { resolve('unsupported'); return; }
    let stream = null, facing = 'user';
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#0b1220;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px';
    ov.innerHTML = '<div style="color:#fff;font-weight:700;font-size:18px;text-align:center">מקמו את הפנים בתוך העיגול</div>' +
      '<div id="cfStage" style="position:relative;width:min(92vw,420px);aspect-ratio:1;overflow:hidden;border-radius:16px;background:#000">' +
      '<video id="cfVid" playsinline autoplay muted style="width:100%;height:100%;object-fit:cover"></video>' +
      '<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at center,transparent 0,transparent 39.5%,rgba(0,0,0,.6) 40.5%)"></div>' +
      '<div style="position:absolute;left:10%;top:10%;width:80%;height:80%;border:3px solid #fff;border-radius:50%;pointer-events:none"></div></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
      '<button id="cfShot" type="button" class="btn" style="margin:0;min-width:130px">צילום</button>' +
      '<button id="cfFlip" type="button" class="btn secondary" style="margin:0">החלפת מצלמה</button>' +
      '<button id="cfCancel" type="button" class="btn secondary" style="margin:0">ביטול</button></div>' +
      '<div id="cfMsg" style="color:#fca5a5;min-height:20px;text-align:center"></div>';
    document.body.append(ov);
    const vid = ov.querySelector('#cfVid'), msg = ov.querySelector('#cfMsg');
    const stop = () => { try { stream && stream.getTracks().forEach(t => t.stop()); } catch (_) {} };
    const close = (v) => { stop(); ov.remove(); resolve(v); };
    const start = async () => {
      stop(); msg.textContent = '';
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
        vid.srcObject = stream; vid.style.transform = facing === 'user' ? 'scaleX(-1)' : 'none';
      } catch (e) { msg.textContent = 'אין גישה למצלמה. אפשר לאשר מצלמה בהגדרות הדפדפן.'; }
    };
    ov.querySelector('#cfCancel').onclick = () => close(null);
    ov.querySelector('#cfFlip').onclick = () => { facing = facing === 'user' ? 'environment' : 'user'; start(); };
    ov.querySelector('#cfShot').onclick = () => {
      const w = vid.videoWidth, h = vid.videoHeight; if (!w || !h) { msg.textContent = 'המצלמה עוד לא מוכנה'; return; }
      const side = Math.min(w, h), crop = side * 0.8, sx = (w - crop) / 2, sy = (h - crop) / 2;
      const c = document.createElement('canvas'); c.width = c.height = 400;
      c.getContext('2d').drawImage(vid, sx, sy, crop, crop, 0, 0, 400, 400);
      close(c.toDataURL('image/jpeg', 0.85));
    };
    start();
  });
}
