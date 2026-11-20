// Service worker: קבצי האפליקציה ותמונות נפתחים מהטלפון לפתיחה מהירה. נתונים (Supabase) תמיד מהרשת.
const CACHE = 'habayit-p254';
// תמונות נשמרות בנפרד ולא נמחקות בכל עדכון. מחליפים תמונה קיימת באותו שם? מגדילים את IMG (img-habayit-1 ל-img-habayit-2)
const IMG = 'img-habayit-1';
const isImg = u => /\.(webp|png|jpe?g)$/i.test(new URL(u, self.location.href).pathname);
const SHELL = ['./js/companion.js','./js/dog.js','./js/giraffe.js','./js/parrot.js','./icons/parrot/parrot.webp','./icons/giraffe/walk.webp','./icons/giraffe/run.webp','./icons/giraffe/runback.webp','./js/bird.js','./js/spider.js','./','./index.html','./login.html','./signup.html','./google-setup.html','./privacy.html','./terms.html','./js/family.js','./css/style.css','./js/splash.js','./splash.jpg','./splash-en.jpg','./splash-family.jpg','./splash.jpg','./js/config.js','./js/supabase.js','./js/common.js','./js/icons.js','./js/generate.js','./js/points.js','./tasks.html','./task.html','./admin.html','./report.html','./history.html','./chat.html','./ai.html','./lessons.html','./chef-splash.jpg','./teacher-splash.jpg','./calendar.html','./requests.html','./meds.html','./info.html','./feedback.html','./guide.html','./status.html','./bonus.html','./js/gamesplash.js','./js/bonuspopup.js','./bonus-splash.jpg','./bonus-splash-en.jpg','./fridge.html','./food.html','./fridge-food.jpg','./shop.html','./outing.html','./js/outings.js', './important.html', './js/important.js', './js/push.js','./js/bonus.js','./game.html','./games.html','./checkers.html','./battleship.html','./poker.html','./backgammon.html','./blackjack.html','./stratego.html','./tetris.html','./aquarium.html','./icons/aquarium/crab.webp','./conflicts.html','./tetris-bg.jpg','./tetris-splash.jpg','./js/strategopage.js','./stratego-bg.jpg','./stratego-water.jpg','./stratego-splash.jpg','./js/bjpage.js','./js/bgpage.js','./js/pokerpage.js','./js/bspage.js','./js/checkerspage.js','./js/guest.js','./js/checkers-rules.js','./js/gamepage.js','./js/game.js','./game-bg.jpg','./js/events.js','./js/holidays.js','./js/weather.js','./js/countries.js','./icons/weather/sun.webp','./icons/weather/partly.webp','./icons/weather/cloud.webp','./icons/weather/rain.webp','./icons/weather/storm.webp','./icons/weather/fog.webp','./icons/weather/snow.webp','./icons/weather/bird1.webp','./icons/weather/bird2.webp','./icons/weather/sky-sun.webp','./icons/weather/sky-partly.webp','./icons/weather/sky-cloud.webp','./icons/weather/sky-rain.webp','./icons/weather/sky-storm.webp','./icons/weather/sky-fog.webp','./icons/weather/sky-snow.webp','./icons/weather/sky-night.webp','./icons/weather/moon.webp','./icons/weather/moon-cloud.webp','./icons/weather/sea-bg.webp','./icons/weather/sea-waves.webp','./icons/weather/surf1.webp','./icons/weather/surf2.webp','./icons/weather/surfm1.webp','./icons/weather/surfm2.webp','./icons/weather/surfm3.webp','./icons/weather/surfm4.webp','./icons/weather/surfm5.webp','./icons/weather/surfm6.webp','./icons/weather/surfm7.webp','./icons/weather/surfm8.webp','./icons/weather/sit.webp','./icons/weather/sky-dawn.webp','./icons/weather/sky-dusk.webp','./icons/weather/sea-night.webp','./icons/weather/sea-dusk.webp','./js/i18n.js','./manifest.webmanifest','./logo.png','./login-bg.jpg','./logo-text.png'];
// כל קובץ נשמר בנפרד וללא כפילויות: קובץ חסר או כפול לא מפיל את ההתקנה של ה-Service Worker
// התקנה: קבצי הקוד נטענים טריים מהרשת (לא מהזיכרון של הדפדפן). תמונות: רק מה שעוד לא שמור בטלפון.
self.addEventListener('install', e => {
  e.waitUntil(Promise.all([caches.open(CACHE), caches.open(IMG)]).then(([c, ic]) => Promise.allSettled([...new Set(SHELL)].map(async u => {
    if (isImg(u)) { if (!(await ic.match(u))) await ic.add(u); return; }
    const r = await fetch(new Request(u, { cache: 'reload' }));
    if (r.ok) await c.put(u, r);
  }))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== IMG && k !== 'habayit-goto').map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // Supabase וגופנים: ישר לרשת
  // שמע ווידאו (למשל המוזיקה של האקווריום): ישר לרשת, כי ספארי מבקש אותם בחלקים
  if (e.request.headers.has('range') || /\.(mp3|m4a|wav|ogg|mp4|webm)$/i.test(url.pathname)) return;
  // תמונות של האפליקציה (דמויות, רקעים, מדבקות): מהטלפון, ונשמרות גם אחרי עדכונים. (קובצי שמע לא כאן: ספארי דורש תשובות חלקיות)
  if (isImg(url.href)) {
    // אם ההורדה נכשלה (רשת רגעית), מנסים שוב אחרי שנייה
    const get = () => fetch(e.request).catch(() => new Promise(ok => setTimeout(ok, 1000)).then(() => fetch(e.request)));
    e.respondWith(caches.match(e.request).then(hit => hit || get().then(r => {
      if (r.ok && r.status === 200) { const copy = r.clone(); caches.open(IMG).then(c => c.put(e.request, copy)); }
      return r;
    })));
    return;
  }
  // קבצי הקוד והעמודים: קודם מהטלפון (מהגרסה הנוכחית), כך שהפתיחה לא מחכה לאינטרנט.
  // גרסה חדשה מגיעה כשמעלים עדכון (CACHE גדל): היא נטענת ברקע ומופיעה בפתיחה הבאה.
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: e.request.mode === 'navigate' })).then(hit => hit ||
    fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok && r.status === 200) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))));
});

// התראות Push: חייבים להציג התראה על כל push (דרישה של אייפון)
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'הבית שלנו', {
    body: d.body || '', icon: 'icons/home-192.png', badge: 'icons/home-192.png', tag: d.tag || undefined, lang: 'he', dir: 'rtl',
    data: { url: d.url || './index.html' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './index.html', self.registration.scope).href;
  e.waitUntil((async () => {
    // שומרים את היעד לשנייה: אם האפליקציה נפתחת במסך הראשי, העמוד יעביר אותנו לכתובת הנכונה
    try { const gc = await caches.open('habayit-goto'); await gc.put('./__goto', new Response(JSON.stringify({ url, t: Date.now() }))); } catch (_) {}
    const list = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) {
      try {
        if ('navigate' in c) { const n = await c.navigate(url); if (n) { await n.focus(); return; } }
      } catch (_) {}
    }
    // לא הצלחנו לנווט בחלון קיים: פותחים חלון חדש בכתובת הנכונה
    try { const w = await clients.openWindow(url); if (w) return; } catch (_) {}
    if (list[0]) { try { list[0].postMessage({ goto: url }); await list[0].focus(); } catch (_) {} }
  })());
});
