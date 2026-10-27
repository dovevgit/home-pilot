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
