/* עכביש שחור קטן: נכנס מתחתית המסך, רץ למעלה לאורך כל הגובה ונעלם בקצה העליון. פעם אחת בכל כניסה לעמוד ההיסטוריה והדיווחים. */
(function () {
  'use strict';
  if (document.getElementById('spiderFx')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var NS = 'http://www.w3.org/2000/svg', INK = '#0b0b0f';
  var sp = document.createElementNS(NS, 'svg');
  sp.setAttribute('id', 'spiderFx'); sp.setAttribute('viewBox', '-32 -32 64 64'); sp.setAttribute('aria-hidden', 'true');
  sp.style.cssText = 'position:fixed;left:0;top:0;width:64px;height:64px;margin:-32px 0 0 -32px;z-index:8;pointer-events:none;display:none;will-change:transform;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))';
  var st = document.createElement('style'); st.textContent = '@media print{#spiderFx{display:none!important}}'; document.head.appendChild(st);
  function mk(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); sp.appendChild(e); return e; }
  var legs = [], REST = [38, 68, 108, 148], BASEY = [-9, -6.5, -4, -1.5];
  [-1, 1].forEach(function (side) {
    REST.forEach(function (a, i) {
      legs.push({ el: mk('polyline', { fill: 'none', stroke: INK, 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), side: side, i: i, rest: a });
    });
  });
  mk('ellipse', { cx: 0, cy: 9, rx: 8, ry: 10.5, fill: INK });
  mk('ellipse', { cx: -2.6, cy: 5, rx: 2.2, ry: 3.4, fill: '#2a2a33', opacity: .8 });
  mk('circle', { cx: 0, cy: -5, r: 5.6, fill: INK });
  mk('circle', { cx: -2, cy: -8, r: 1.25, fill: '#fff' }); mk('circle', { cx: 2, cy: -8, r: 1.25, fill: '#fff' });
  mk('circle', { cx: -1.8, cy: -8.2, r: .5, fill: INK }); mk('circle', { cx: 2.2, cy: -8.2, r: .5, fill: INK });
  document.body.appendChild(sp);
  function setLegs(ph) {
    legs.forEach(function (L) {
      var alt = ((L.i + (L.side > 0 ? 1 : 0)) % 2) ? Math.PI : 0, a = (L.rest + Math.sin(ph + alt) * 15) * Math.PI / 180;
      var bx = L.side * 3.6, by = BASEY[L.i];
      var kx = bx + L.side * Math.sin(a) * 12, ky = by - Math.cos(a) * 12 - 3;
      var fx = bx + L.side * Math.sin(a + .2) * 25, fy = by - Math.cos(a + .2) * 20 + 6 * Math.abs(Math.cos(a));
      L.el.setAttribute('points', bx + ',' + by + ' ' + kx + ',' + ky + ' ' + fx + ',' + fy);
    });
  }
  var raf = 0, run = 0;
  function go() {
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
      setLegs(ph);
      sp.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + hd.toFixed(1) + 'deg)';
      if (y > -40) raf = requestAnimationFrame(step); else sp.style.display = 'none';
    }
    raf = requestAnimationFrame(step);
  }
  setLegs(0);
  setTimeout(go, 400);
  addEventListener('pageshow', function (e) { if (e.persisted) go(); });
})();
