/* ===================================================
   ENHANCEMENTS.JS — Versión Ejecutiva
   Animaciones sutiles, sin elementos llamativos
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1) Barra de progreso de scroll ---------- */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  /* ---------- 2) Botón "volver arriba" con SVG ---------- */
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Volver arriba');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(backToTop);

  /* ---------- 3) Nav y referencias ---------- */
  const nav = document.querySelector('nav');
  const sections = ['acto1', 'acto2', 'acto3', 'acto4']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-links a');

  /* ---------- 4) Listener de scroll unificado ---------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (scrolled / max) * 100 : 0;

        // Barra de progreso
        progressBar.style.width = pct + '%';

        // Botón volver arriba
        if (scrolled > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');

        // Nav scrolled state
        if (nav) {
          if (scrolled > 50) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
        }

        // Active nav link
        updateActiveNav();

        ticking = false;
      });
      ticking = true;
    }
  });

  function updateActiveNav() {
    if (!sections.length) return;
    const scrollPos = window.scrollY + 150;
    let currentId = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + currentId
      );
    });
  }

  /* ---------- 5) Conteo animado en KPIs del hero ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const text = entry.target.textContent.trim();
        const match = text.match(/^([\d.,]+)/);
        if (match) {
          const numStr = match[1].replace(',', '.');
          const num = parseFloat(numStr);
          if (!isNaN(num)) {
            entry.target.dataset.animated = 'true';
            const duration = 1400;
            const start = performance.now();
            const isDecimal = num % 1 !== 0;

            function tick(now) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              const v = num * eased;
              entry.target.textContent =
                (isDecimal ? v.toFixed(1) : Math.round(v)) +
                text.slice(match[1].length);
              if (p < 1) requestAnimationFrame(tick);
              else entry.target.textContent = text;
            }
            requestAnimationFrame(tick);
          }
        }
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObs.observe(el));

  /* ---------- 6) Smooth scroll con offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- 7) Atajo de teclado: "T" para top ---------- */
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 't' || e.key === 'T') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  /* ---------- 8) Firma discreta en consola ---------- */
  console.log(
    '%c AI CFO Analysis — FEMSA 1Q 2026 ',
    'background:#A100FF;color:#fff;padding:6px 14px;font-weight:600;font-family:Barlow,sans-serif;font-size:12px;letter-spacing:.05em;'
  );
  console.log(
    '%cAccenture · AI & Finance Intelligence Practice',
    'color:#A100FF;font-style:italic;font-size:11px;'
  );
});
