/* Happy Birthday, Astha! — interactions. Plain JavaScript, no dependencies. */
(function () {
  'use strict';

  var VIDEO_ID = 'oQaWXlsSW2c';
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isSmall = window.matchMedia('(max-width: 640px)');
  var prefersReduced = function () { return reduceQuery.matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Reusable reveal-on-scroll ---------- */
  function initReveal() {
    var items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || prefersReduced()) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Floating sparkles ---------- */
  function initSparkles() {
    var wrap = $('#sparkles');
    if (!wrap || prefersReduced()) return;
    var count = isSmall.matches ? 7 : 16;
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      s.className = 'sparkle';
      s.style.left = (Math.random() * 100) + '%';
      s.style.setProperty('--sz', (7 + Math.random() * 11).toFixed(1) + 'px');
      s.style.setProperty('--dur', (14 + Math.random() * 16).toFixed(1) + 's');
      s.style.setProperty('--delay', (-Math.random() * 24).toFixed(1) + 's');
      s.style.setProperty('--dx', ((Math.random() - .5) * 140).toFixed(0) + 'px');
      wrap.appendChild(s);
    }
  }

  /* ---------- Confetti & heart burst (canvas) ---------- */
  var canvas = $('#confetti');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var particles = [];
  var raf = 0;
  var COLORS = ['#8db6e6', '#bcd7f1', '#ffffff', '#c5cfdb', '#3b6aa3', '#fbf6ea', '#f2a8c0'];

  function resizeCanvas() {
    if (!canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawHeart(c, size) {
    c.beginPath();
    c.moveTo(0, size * .35);
    c.bezierCurveTo(0, -size * .1, -size * .75, -size * .1, -size * .75, size * .3);
    c.bezierCurveTo(-size * .75, size * .7, 0, size * .95, 0, size * 1.15);
    c.bezierCurveTo(0, size * .95, size * .75, size * .7, size * .75, size * .3);
    c.bezierCurveTo(size * .75, -size * .1, 0, -size * .1, 0, size * .35);
    c.fill();
  }
  function drawStar(c, size) {
    c.beginPath();
    for (var i = 0; i < 8; i++) {
      var r = i % 2 === 0 ? size : size * .38;
      var a = (Math.PI / 4) * i - Math.PI / 2;
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    c.closePath(); c.fill();
  }

  function burst(x, y) {
    if (!ctx || prefersReduced()) return;
    resizeCanvas();
    var n = isSmall.matches ? 55 : 95;
    for (var i = 0; i < n; i++) {
      var angle = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.25;
      var speed = 5 + Math.random() * 9;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        g: .22 + Math.random() * .1,
        size: 5 + Math.random() * 7,
        rot: Math.random() * 6.28, vr: (Math.random() - .5) * .3,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: ['heart', 'star', 'rect', 'dot'][(Math.random() * 4) | 0],
        life: 0, max: 110 + Math.random() * 70
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter(function (p) { return p.life < p.max && p.y < window.innerHeight + 40; });
    particles.forEach(function (p) {
      p.life++; p.vy += p.g; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - Math.pow(p.life / p.max, 3));
      ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
      if (p.shape === 'heart') drawHeart(ctx, p.size * .9);
      else if (p.shape === 'star') drawStar(ctx, p.size);
      else if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else { ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, 6.28); ctx.fill(); }
      ctx.restore();
    });
    if (particles.length) { raf = requestAnimationFrame(tick); }
    else { raf = 0; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }
  window.addEventListener('resize', function () { if (!raf) resizeCanvas(); });

  /* ---------- Open My Note ---------- */
  function initOpen() {
    var btn = $('#open-note'), note = $('#note'), title = $('#note-title');
    if (!btn || !note) return;
    btn.addEventListener('click', function () {
      var r = btn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
      note.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
      // Move focus to the note for keyboard / screen-reader users once we've arrived.
      setTimeout(function () { if (title) title.focus({ preventScroll: true }); }, prefersReduced() ? 0 : 700);
      // second, softer burst once the note is on screen
      setTimeout(function () { burst(window.innerWidth * .5, window.innerHeight * .75); }, prefersReduced() ? 0 : 650);
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var box = $('#lightbox'); if (!box) return;
    var img = $('#lb-img'), cap = $('#lb-cap'), count = $('#lb-count');
    var closeBtn = $('.lb-close', box), prev = $('.lb-prev', box), next = $('.lb-next', box);
    var triggers = $$('.polaroid__btn');
    var current = 0, opener = null, startX = null;

    function show(i) {
      current = (i + triggers.length) % triggers.length;
      var t = triggers[current], src = $('img', t);
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      cap.textContent = $('.polaroid__cap', t).textContent;
      count.textContent = 'Photo ' + (current + 1) + ' of ' + triggers.length;
    }
    function open(i, from) {
      opener = from; show(i);
      box.hidden = false; document.body.classList.add('lb-open');
      closeBtn.focus();
    }
    function close() {
      box.hidden = true; document.body.classList.remove('lb-open');
      img.removeAttribute('src');
      if (opener) opener.focus();
    }

    triggers.forEach(function (t, i) { t.addEventListener('click', function () { open(i, t); }); });
    $$('[data-close]', box).forEach(function (el) { el.addEventListener('click', close); });
    prev.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') { show(current - 1); }
      else if (e.key === 'ArrowRight') { show(current + 1); }
      else if (e.key === 'Tab') { // simple focus trap
        var f = [closeBtn, prev, next];
        var idx = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    box.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX; startX = null;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- Music (YouTube IFrame API, never autoplays) ---------- */
  function initMusic() {
    var btn = $('#music-btn'), label = $('#music-label'), panel = $('#music-panel');
    var hide = $('#music-hide'), note = $('#music-note');
    if (!btn) return;
    var player = null, ready = false, playing = false;
    var LINK = '<a href="https://youtu.be/' + VIDEO_ID + '" target="_blank" rel="noopener noreferrer">Open on YouTube</a>';

    function setPanel(open) { panel.setAttribute('aria-hidden', open ? 'false' : 'true'); }
    function setPlaying(p) {
      playing = p;
      btn.setAttribute('aria-pressed', p ? 'true' : 'false');
      label.textContent = p ? 'Pause our song' : 'Play our song';
    }
    function problem(msg) { note.innerHTML = msg + ' ' + LINK; }

    function build() {
      if (player || !window.YT || !window.YT.Player) return;
      var vars = { rel: 0, playsinline: 1, modestbranding: 1, autoplay: 0 };
      if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
      player = new window.YT.Player('yt-player', {
        videoId: VIDEO_ID, host: 'https://www.youtube-nocookie.com', playerVars: vars,
        events: {
          onReady: function () {
            ready = true;
            var f = $('iframe', panel);
            if (f) { f.setAttribute('title', 'Birthday song (YouTube player)'); f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); }
          },
          onStateChange: function (e) { setPlaying(e.data === 1 || e.data === 3); },
          onError: function () { problem('The player can’t load here (this can happen when the page is opened as a local file).'); setPanel(true); }
        }
      });
    }
    window.onYouTubeIframeAPIReady = build;
    function loadApi() {
      if (window.YT && window.YT.Player) { build(); return; }
      if (document.getElementById('yt-api')) return;
      var s = document.createElement('script');
      s.id = 'yt-api'; s.src = 'https://www.youtube.com/iframe_api'; s.async = true;
      s.onerror = function () { problem('Couldn’t reach YouTube.'); };
      document.head.appendChild(s);
    }
    // Load quietly after the page is idle so a tap on the button can start playback instantly.
    window.addEventListener('load', function () { setTimeout(loadApi, 600); });

    btn.addEventListener('click', function () {
      setPanel(true);
      if (!ready) { loadApi(); problem('Getting the player ready… tap again in a moment.'); return; }
      if (playing) player.pauseVideo(); else player.playVideo();
    });
    hide.addEventListener('click', function () { setPanel(false); btn.focus(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false' && $('#lightbox').hidden) { setPanel(false); }
    });
  }

  /* ---------- Go ---------- */
  initReveal();
  initSparkles();
  initOpen();
  initLightbox();
  initMusic();
  reduceQuery.addEventListener && reduceQuery.addEventListener('change', function () {
    if (prefersReduced()) $$('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
  });
})();
