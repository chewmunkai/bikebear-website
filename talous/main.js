/* Talous — interactions: Lenis smooth scroll, GSAP scroll reveals,
   custom cursor, marquee duplication, animated counters, FAQ, nav. */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ---------- GSAP + ScrollTrigger ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on('scroll', ScrollTrigger.update);

    // generic reveal: [data-reveal] children rise + fade
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 26, opacity: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' },
      });
    });

    // staggered groups
    gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
      const items = group.querySelectorAll('[data-reveal-item]');
      gsap.from(items, {
        y: 30, opacity: 0, duration: 0.75, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 82%' },
      });
    });

    // manifesto word-by-word
    const manifesto = document.querySelector('[data-manifesto]');
    if (manifesto) {
      const words = manifesto.querySelectorAll('.word');
      gsap.to(words, {
        opacity: 1, ease: 'none', stagger: 0.5,
        scrollTrigger: { trigger: manifesto, start: 'top 70%', end: 'bottom 75%', scrub: 1 },
      });
    }

    // horizontal scroll for capabilities track
    const track = document.querySelector('[data-htrack]');
    if (track && !reduced) {
      const panel = track.parentElement;
      const scrollLen = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -scrollLen(), ease: 'none',
        scrollTrigger: {
          trigger: panel, start: 'top top', end: () => '+=' + scrollLen(),
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
    }

    // hero parallax on the floating panel
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      gsap.to(el, {
        yPercent: -speed * 100, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split('.')[1] || '').length;
    const dur = 1400; const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec);
    }
    requestAnimationFrame(step);
  }
  if (window.ScrollTrigger) {
    document.querySelectorAll('[data-count]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => animateCount(el) });
    });
  } else {
    document.querySelectorAll('[data-count]').forEach(animateCount);
  }

  /* ---------- custom cursor ---------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
    let rx = 0, ry = 0, dx = 0, dy = 0;
    window.addEventListener('pointermove', (e) => {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    function loop() { rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18; ring.style.transform = `translate(${rx}px, ${ry}px)`; requestAnimationFrame(loop); }
    loop();
    document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
      el.addEventListener('pointerenter', () => ring.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => ring.classList.remove('is-hover'));
    });
  } else {
    document.body.classList.add('no-custom-cursor');
  }

  /* ---------- marquee (duplicate content for seamless loop) ---------- */
  document.querySelectorAll('[data-marquee]').forEach((m) => {
    const inner = m.querySelector('.marquee__inner');
    if (inner) inner.innerHTML += inner.innerHTML;
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('[data-faq] .faq__item').forEach((item) => {
    const btn = item.querySelector('.faq__q');
    btn.addEventListener('click', () => {
      const open = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq__item.open').forEach((o) => {
        o.classList.remove('open');
        o.querySelector('.faq__a').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        const a = item.querySelector('.faq__a');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- nav scrolled state + mobile toggle ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.nav__links');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open'); menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      burger.classList.remove('open'); menu.classList.remove('open');
    }));
  }

  /* ---------- anchor smooth scroll via Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -80 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });
})();
