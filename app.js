(() => {
  'use strict';

  /* ───────── EDIT ME ───────── */
  const CONFIG = {
    // YOUR WhatsApp number: country code + number, digits only, no + and no leading 0.
    // Bangladesh example: 01712345678  ->  '8801712345678'
    whatsappNumber: '',
    year: 2026,
    month: 10 // 0-based → 10 = November
  };
  /* ─────────────────────────── */

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const state = { dayLabel: null, time: null, vibeIcon: '💗', vibe: null, noTries: 0, spicyTries: 0 };
  const order = ['welcome', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'done'];

  /* ───────── navigation ───────── */
  function go(id) {
    $$('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
    document.body.dataset.screen = id;
    const idx = order.indexOf(id);
    $$('#progress i').forEach((dot, i) => dot.classList.toggle('on', i + 1 <= idx));
    window.scrollTo(0, 0);
    if (id === 'q6') fillSummary();
    if (id === 'done') { fillDone(); confetti(); }
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-next]');
    if (b && !b.disabled) go(b.dataset.next);
  });

  /* ───────── runaway buttons (the meme) ───────── */
  function makeDodger(el, opts = {}) {
    const { avoid = [], labels = [], hints = [], hintEl = null, fixWidth = false, dashed = false, counter = null } = opts;
    const M = 12;
    let fleeing = false;
    let count = 0;

    function start() {
      const r = el.getBoundingClientRect();
      const ph = document.createElement('span');
      ph.className = 'ph' + (dashed ? ' dashed' : '');
      ph.style.width = r.width + 'px';
      ph.style.height = r.height + 'px';
      el.parentNode.insertBefore(ph, el);
      if (fixWidth) el.style.width = r.width + 'px';
      el.style.left = r.left + 'px';
      el.style.top = r.top + 'px';
      el.classList.add('flee');
      fleeing = true;
      void el.offsetWidth; // commit start position so the first jump animates
    }

    function dodge(e) {
      if (!fleeing) start();
      count++;
      if (counter) state[counter]++;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxX = Math.max(M, vw - w - M);
      const maxY = Math.max(M + 30, vh - h - M);

      let px = -9999, py = -9999;
      if (e) {
        const p = (e.touches && e.touches[0]) || e;
        if (typeof p.clientX === 'number') { px = p.clientX; py = p.clientY; }
      }
      const rects = avoid.map((a) => a.getBoundingClientRect());

      let spot = null;
      for (let i = 0; i < 60 && !spot; i++) {
        const x = rand(M, maxX);
        const y = rand(M + 30, maxY);
        const far = Math.hypot(x + w / 2 - px, y + h / 2 - py) > Math.min(180, vw / 2);
        const clear = rects.every((r) =>
          x > r.right + 16 || x + w < r.left - 16 || y > r.bottom + 16 || y + h < r.top - 16);
        if (far && clear) spot = { x, y };
      }
      if (!spot) spot = { x: rand(M, maxX), y: rand(M + 30, maxY) };

      el.style.left = spot.x + 'px';
      el.style.top = spot.y + 'px';
      if (labels.length) el.textContent = labels[count % labels.length];
      if (hintEl && hints.length) hintEl.textContent = pick(hints);
    }

    ['pointerenter', 'pointerdown', 'focus'].forEach((t) => el.addEventListener(t, dodge));
    el.addEventListener('touchstart', dodge, { passive: true });
    el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); dodge(e); });
    window.addEventListener('resize', () => {
      if (!fleeing) return;
      const maxX = Math.max(M, window.innerWidth - el.offsetWidth - M);
      const maxY = Math.max(M, window.innerHeight - el.offsetHeight - M);
      el.style.left = Math.min(parseFloat(el.style.left) || M, maxX) + 'px';
      el.style.top = Math.min(parseFloat(el.style.top) || M, maxY) + 'px';
    });
  }

  const noLabels = ['No', 'Nope 🙈', 'Nice try 😜', 'Too slow! 💨', 'Missed me 🏃', 'Yes is right there 👉', 'Try again 😏', "Can't catch me 😝"];
  const noHints = [
    'The No button is shy today 🙈',
    "Only Yes works here, sorry 💅",
    'Not clickable. Not today. 😌',
    'Have you tried… Yes? 🥰',
    'That button has commitment issues 😂',
    'Aww, you tried 🫶'
  ];

  makeDodger($('#no1'), { avoid: [$('#yes1')], labels: noLabels, hints: noHints, hintEl: $('#hint1'), counter: 'noTries' });
  makeDodger($('#no2'), { avoid: [$('#yes2')], labels: noLabels, hints: noHints, hintEl: $('#hint2'), counter: 'noTries' });

  /* ───────── welcome envelope ───────── */
  $('#envelope').addEventListener('click', function () {
    if (this.classList.contains('open')) return;
    this.classList.add('open');
    setTimeout(() => go('q1'), 1100);
  });

  /* ───────── calendar (Nov 2026 only) ───────── */
  const longDate = (d) =>
    d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  function updatePickInfo() {
    const info = $('#pickInfo');
    if (state.dayLabel && state.time) info.textContent = `${state.dayLabel} · ${state.time} 💕`;
    else if (state.dayLabel) info.textContent = `${state.dayLabel} · now pick a time ⏰`;
    else if (state.time) info.textContent = `${state.time} · now pick a day 📅`;
    else info.textContent = 'Pick a day and a time 💕';
    $('#setDate').disabled = !(state.dayLabel && state.time);
  }

  function buildCalendar() {
    const grid = $('#cal');
    grid.innerHTML = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d) => {
      const s = document.createElement('span');
      s.className = 'dow';
      s.textContent = d;
      grid.appendChild(s);
    });
    const first = new Date(CONFIG.year, CONFIG.month, 1).getDay();
    const days = new Date(CONFIG.year, CONFIG.month + 1, 0).getDate();
    for (let i = 0; i < first; i++) grid.appendChild(document.createElement('span'));

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthEnd = new Date(CONFIG.year, CONFIG.month, days);
    const lockPast = todayStart <= monthEnd; // if the month is already over, don't lock everything

    for (let d = 1; d <= days; d++) {
      const date = new Date(CONFIG.year, CONFIG.month, d);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'day';
      b.textContent = d;
      if (date.getTime() === todayStart.getTime()) b.classList.add('today');
      if (lockPast && date < todayStart) b.disabled = true;
      b.addEventListener('click', () => {
        $$('.day.sel', grid).forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
        state.dayLabel = longDate(date);
        updatePickInfo();
      });
      grid.appendChild(b);
    }
  }

  function buildTimes() {
    const wrap = $('#times');
    ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
     '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'].forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = t;
      b.addEventListener('click', () => {
        $$('.chip.sel', wrap).forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
        state.time = t;
        updatePickInfo();
      });
      wrap.appendChild(b);
    });
  }

  $('#setDate').addEventListener('click', () => {
    if (!state.dayLabel || !state.time) return;
    toast('Date locked in 🔒💗');
    go('q5');
  });

  /* ───────── vibes ───────── */
  $$('.vibe[data-label]').forEach((b) => {
    b.addEventListener('click', () => {
      $$('.vibe.sel').forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel');
      state.vibe = b.dataset.label;
      state.vibeIcon = b.dataset.icon;
      setTimeout(() => go('q6'), 450);
    });
  });

  makeDodger($('#vibeNo'), {
    fixWidth: true,
    dashed: true,
    counter: 'spicyTries',
    avoid: $$('.vibe[data-label]'),
    hintEl: $('#hint5'),
    hints: [
      'Sir, this is a date 😤',
      'Eyes up here 👀',
      'That option ran away, shy boy 🙈',
      'Patience, baby 😌',
      'Not on the menu today 🍽️',
      "Nice try, mister 😏"
    ]
  });

  /* ───────── summary / finish ───────── */
  function fillSummary() {
    $('#sumTime').textContent = state.time || '—';
    $('#sumDay').textContent = state.dayLabel || '—';
    $('#sumVibe').textContent = `${state.vibeIcon} ${state.vibe || '—'}`;
  }

  function fillDone() {
    $('#doneDay').textContent = state.dayLabel || '—';
    $('#doneTime').textContent = state.time || '—';
    $('#doneIco').textContent = state.vibeIcon;
    $('#doneVibe').textContent = state.vibe || '—';
  }

  $('#yesFinal').addEventListener('click', () => go('done'));

  $('#back').addEventListener('click', () => {
    const card = $('#card7');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    toast('Ohh, you dare?! 😳');
    setTimeout(() => go('q6'), 1000);
  });

  async function shareDetails() {
    const noLine = state.noTries ? `\n😂 I tried to click "No" ${state.noTries} time(s)` : '';
    const spicyLine = state.spicyTries ? `\n🙈 I chased the runaway option ${state.spicyTries} time(s)` : '';
    const text =
      `It's a date! 💌\n📅 ${state.dayLabel}\n⏰ ${state.time}\n${state.vibeIcon} ${state.vibe}${noLine}${spicyLine}\n` +
      `🚕 Uber's on you 😏\nYES, I'M YOURS 💗`;
    if (CONFIG.whatsappNumber) {
      window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      return;
    }
    if (navigator.share) {
      try { await navigator.share({ text }); } catch (_) { /* cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied! Paste it to me 💌');
    } catch (_) {
      toast('Screenshot this & send it to me 📸');
    }
  }
  $('#shareBtn').addEventListener('click', shareDetails);

  /* ───────── decoration ───────── */
  function spawnHeart() {
    if (document.hidden) return;
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = pick(['💗', '💖', '💕', '🌻', '✨', '🌸']);
    h.style.left = rand(0, 100) + 'vw';
    h.style.fontSize = rand(14, 34) + 'px';
    h.style.animationDuration = rand(7, 12) + 's';
    $('#hearts').appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
  setInterval(spawnHeart, 700);
  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 250);

  function confetti() {
    const c = $('#confetti');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const ctx = c.getContext('2d');
    const colors = ['#ff8fb1', '#e0457b', '#ffc83d', '#ffffff', '#ffb3cb'];
    const ps = Array.from({ length: 150 }, () => ({
      x: rand(0, c.width), y: rand(-c.height, 0), r: rand(4, 9),
      vx: rand(-1.2, 1.2), vy: rand(2, 5), rot: rand(0, 6.28), vr: rand(-0.12, 0.12), col: pick(colors)
    }));
    let frames = 0;
    (function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      });
      if (++frames < 280) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, c.width, c.height);
    })();
  }

  /* ───────── init ───────── */
  buildCalendar();
  buildTimes();
  updatePickInfo();
  go('welcome');
})();
