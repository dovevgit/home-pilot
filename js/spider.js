/* עכביש שחור קטן: נכנס מתחתית המסך, רץ למעלה לאורך כל הגובה ונעלם בקצה העליון. פעם אחת בכל כניסה לעמוד ההיסטוריה והדיווחים.
   לוחצים עליו: הוא קופץ על המסך, גדל פי כמה ונראה מפחיד, ואז נעלם. */
(function () {
  'use strict';
  if (document.getElementById('spiderFx')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var NS = 'http://www.w3.org/2000/svg', INK = '#0b0b0f';
  var sp = document.createElementNS(NS, 'svg');
  sp.setAttribute('id', 'spiderFx'); sp.setAttribute('viewBox', '-32 -32 64 64'); sp.setAttribute('aria-hidden', 'true');
  sp.style.cssText = 'position:fixed;left:0;top:0;width:64px;height:64px;margin:-32px 0 0 -32px;z-index:8;pointer-events:none;display:none;touch-action:manipulation;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))';
  var st = document.createElement('style'); st.textContent = '@media print{#spiderFx,#spiderDim{display:none!important}}'; document.head.appendChild(st);
  function mk(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); sp.appendChild(e); return e; }
  var legs = [], REST = [38, 68, 108, 148], BASEY = [-9, -6.5, -4, -1.5];
  [-1, 1].forEach(function (side) {
    REST.forEach(function (a, i) {
      legs.push({ el: mk('polyline', { fill: 'none', stroke: INK, 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), side: side, i: i, rest: a });
    });
  });
  mk('ellipse', { cx: 0, cy: 9, rx: 8, ry: 10.5, fill: INK });
  mk('ellipse', { cx: -2.6, cy: 5, rx: 2.2, ry: 3.4, fill: '#2a2a33', opacity: .8 });
  var markA = mk('path', { d: 'M-3 4 L0 10 L3 4 L0 7 Z', fill: '#7a1010', opacity: 0 });   /* סימן אדום על הבטן, מופיע בקפיצה */
  mk('circle', { cx: 0, cy: -5, r: 5.6, fill: INK });
  var fangL = mk('path', { d: 'M-3.4 -1.2 L-1.2 -1.2 L-2.4 5.6 Z', fill: '#ece6d6', stroke: INK, 'stroke-width': .35, display: 'none' });
  var fangR = mk('path', { d: 'M1.2 -1.2 L3.4 -1.2 L2.4 5.6 Z', fill: '#ece6d6', stroke: INK, 'stroke-width': .35, display: 'none' });
  var eyeL = mk('circle', { cx: -2, cy: -8, r: 1.25, fill: '#fff' }), eyeR = mk('circle', { cx: 2, cy: -8, r: 1.25, fill: '#fff' });
  var pupL = mk('circle', { cx: -1.8, cy: -8.2, r: .5, fill: INK }), pupR = mk('circle', { cx: 2.2, cy: -8.2, r: .5, fill: INK });
  var hit = mk('circle', { cx: 0, cy: 0, r: 25, fill: 'transparent' }); hit.style.cssText = 'pointer-events:all;cursor:pointer';
  var dim = document.createElement('div'); dim.id = 'spiderDim';
  dim.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;opacity:0;display:none;background:radial-gradient(circle at 50% 50%,rgba(40,0,0,.35) 0,rgba(0,0,0,.92) 85%)';
  document.body.appendChild(sp); document.body.appendChild(dim);

  function setLegs(ph, amp, reach) {
    amp = amp || 15; reach = reach || 1;
    legs.forEach(function (L) {
      var alt = ((L.i + (L.side > 0 ? 1 : 0)) % 2) ? Math.PI : 0, a = (L.rest + Math.sin(ph + alt) * amp) * Math.PI / 180;
      var bx = L.side * 3.6, by = BASEY[L.i];
      var kx = bx + L.side * Math.sin(a) * 12 * reach, ky = by - Math.cos(a) * 12 * reach - 3;
      var fx = bx + L.side * Math.sin(a + .2) * 25 * reach, fy = by - Math.cos(a + .2) * 20 * reach + 6 * Math.abs(Math.cos(a));
      L.el.setAttribute('points', bx + ',' + by + ' ' + kx + ',' + ky + ' ' + fx + ',' + fy);
    });
  }
  var raf = 0, run = 0, scaring = false, sx = 0, sy = 0, shd = 0;
  /* הגדלה בשינוי גודל האלמנט עצמו (ולא scale) כדי שהווקטור יישאר חד גם כשהוא ענק */
  var tf = function (x, y, rot, s) {
    var z = (64 * s).toFixed(1);
    sp.style.width = z + 'px'; sp.style.height = z + 'px'; sp.style.margin = (-32 * s).toFixed(1) + 'px 0 0 ' + (-32 * s).toFixed(1) + 'px';
    sp.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
  };
  function go() {
    if (scaring) return;
    cancelAnimationFrame(raf); var id = ++run;
    var W = innerWidth, H = innerHeight, x0 = W * (.3 + Math.random() * .4), y = H + 34, t0 = 0, prev = 0, ph = 0, hd = 0, amp = Math.min(70, W * .2);
    sp.style.display = 'block';
    function step(ts) {
      if (id !== run) return;
      if (!t0) { t0 = ts; prev = ts; }
      var dt = Math.min(.05, (ts - prev) / 1000); prev = ts; var t = (ts - t0) / 1000;
      var v = 135 * (.45 + .55 * Math.abs(Math.sin(t * 2.4 + .6)));
      y -= v * dt; ph += v * dt * .34;
      var x = x0 + Math.sin(t * 1.25) * amp, dx = Math.cos(t * 1.25) * 1.25 * amp;
      hd += (Math.atan2(dx, v) * 57.3 * .9 - hd) * Math.min(1, dt * 8);
      setLegs(ph); sx = x; sy = y; shd = hd; tf(x, y, hd, 1);
      if (y > -40) raf = requestAnimationFrame(step); else sp.style.display = 'none';
    }
    raf = requestAnimationFrame(step);
  }

  /* הקפיצה: מתכווץ רגע, זינוק אל המסך, מתנשא ענק ורועד, ואז נסוג ונעלם */
  function scare(e) {
    if (e) e.preventDefault();
    if (scaring) return; scaring = true; cancelAnimationFrame(raf); run++;
    try { navigator.vibrate && navigator.vibrate([70, 40, 160]); } catch (_) {}
    var W = innerWidth, H = innerHeight, BIG = Math.min(16, Math.max(W, H) * .95 / 64);
    var x0 = sx, y0 = sy, h0 = shd, ph = 0, t0 = 0, prev = 0;
    sp.style.zIndex = 100000; sp.style.pointerEvents = 'none'; hit.style.pointerEvents = 'none';
    sp.style.filter = 'drop-shadow(0 0 10px rgba(255,0,0,.55))';
    dim.style.display = 'block';
    var ease = function (u) { return u * u * u; };
    function step(ts) {
      if (!t0) { t0 = ts; prev = ts; }
      var dt = Math.min(.05, (ts - prev) / 1000); prev = ts; var t = (ts - t0) / 1000;
      var x, y, rot, s, o = 0;
      if (t < .14) {                                   /* מתכווץ לפני הקפיצה */
        var c = t / .14; s = 1 - .22 * c; x = x0; y = y0 + 3 * c; rot = h0; ph += dt * 20; setLegs(ph, 12, .9);
      } else if (t < .5) {                             /* זינוק אל המסך */
        var u = ease((t - .14) / .36); s = .78 + (BIG - .78) * u; x = x0 + (W / 2 - x0) * u; y = y0 + (H * .5 - y0) * u; rot = h0 * (1 - u); o = u * .9;
        ph += dt * 30; setLegs(ph, 12 + 16 * u, 1 + .25 * u);
      } else if (t < 1.5) {                            /* ענק ורועד מול הפנים */
        s = BIG * (1 + .035 * Math.sin(t * 70)); x = W / 2 + Math.sin(t * 83) * 7; y = H * .5 + Math.cos(t * 97) * 7; rot = Math.sin(t * 55) * 2.5; o = .9;
        ph += dt * 45; setLegs(ph, 30, 1.25);
      } else {                                         /* נסוג במהירות ונעלם */
        var r = Math.min(1, (t - 1.5) / .4); s = BIG * (1 - r * r) + .001; x = W / 2; y = H * .5 - r * H * .25; rot = 0; o = .9 * (1 - r);
        ph += dt * 40; setLegs(ph, 30, 1.25);
      }
      if (t > .3) {                                    /* עיניים אדומות ושיניים */
        eyeL.setAttribute('fill', '#ff2a2a'); eyeR.setAttribute('fill', '#ff2a2a'); pupL.setAttribute('r', .25); pupR.setAttribute('r', .25);
        fangL.removeAttribute('display'); fangR.removeAttribute('display'); markA.setAttribute('opacity', .9);
      }
      tf(x, y, rot, s); dim.style.opacity = o;
      if (t < 1.9) { raf = requestAnimationFrame(step); return; }
      sp.style.display = 'none'; sp.style.zIndex = 8; sp.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,.35))'; hit.style.pointerEvents = 'all';
      dim.style.display = 'none'; dim.style.opacity = 0;
      eyeL.setAttribute('fill', '#fff'); eyeR.setAttribute('fill', '#fff'); pupL.setAttribute('r', .5); pupR.setAttribute('r', .5);
      fangL.setAttribute('display', 'none'); fangR.setAttribute('display', 'none'); markA.setAttribute('opacity', 0);
      scaring = false;
    }
    raf = requestAnimationFrame(step);
  }
  hit.addEventListener('pointerdown', scare);

  setLegs(0);
  setTimeout(go, 400);
  addEventListener('pageshow', function (e) { if (e.persisted) go(); });
})();
