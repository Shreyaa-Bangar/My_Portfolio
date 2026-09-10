/* =========================================================
   SHREYA.BUILD() — script.js
   ========================================================= */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- Theme toggle ---------- */
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'shreya-portfolio-theme';

  function applyTheme(theme){
    body.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const next = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------- Mobile nav ---------- */
  const navBurger = document.getElementById('navBurger');
  const navLinksEl = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function closeMenu(){
    navBurger.classList.remove('is-open');
    navLinksEl.classList.remove('is-open');
    navOverlay.classList.remove('is-open');
    navBurger.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu(){
    const open = navLinksEl.classList.toggle('is-open');
    navBurger.classList.toggle('is-open', open);
    navOverlay.classList.toggle('is-open', open);
    navBurger.setAttribute('aria-expanded', String(open));
  }

  navBurger.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);
  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Sticky nav + scroll progress + back-to-top ---------- */
  const nav = document.getElementById('siteNav');
  const scrollProgress = document.getElementById('scrollProgress');
  const toTopBtn = document.getElementById('toTop');

  function onScroll(){
    const scrollY = window.scrollY;
    nav.classList.toggle('is-scrolled', scrollY > 12);
    toTopBtn.classList.toggle('is-visible', scrollY > 480);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Active section highlighting ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkMap = new Map();
  document.querySelectorAll('.nav-link').forEach(link => {
    navLinkMap.set(link.dataset.section, link);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        navLinkMap.forEach(l => l.classList.remove('is-active'));
        const activeLink = navLinkMap.get(entry.target.id);
        if (activeLink) activeLink.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (prefersReducedMotion){
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Custom cursor ---------- */
  if (!isTouch && !prefersReducedMotion){
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    function animateRing(){
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveSelector = 'a, button, .trait-card, .skill-card, .project-card, .contact-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) ring.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) ring.classList.remove('is-active');
    });
  } else {
    document.getElementById('cursorDot')?.remove();
    document.getElementById('cursorRing')?.remove();
  }

  /* ---------- Hero parallax on mouse move ---------- */
  const workspace = document.getElementById('heroWorkspace');
  if (workspace && !isTouch && !prefersReducedMotion){
    window.addEventListener('mousemove', (e) => {
      const relX = (e.clientX / window.innerWidth) - 0.5;
      const relY = (e.clientY / window.innerHeight) - 0.5;
      workspace.style.transform = `translate(${relX * -14}px, ${relY * -10}px)`;
    });
  }

  /* ---------- Ambient background particles ---------- */
  const particleContainer = document.getElementById('bgParticles');
  if (particleContainer && !prefersReducedMotion){
    const count = window.innerWidth < 720 ? 16 : 34;
    for (let i = 0; i < count; i++){
      const p = document.createElement('span');
      const size = Math.random() * 2 + 1.5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = Math.random() * 100 + 'vh';
      p.style.opacity = (Math.random() * 0.4 + 0.15).toFixed(2);
      p.style.animationDuration = (Math.random() * 14 + 10) + 's';
      p.style.animationDelay = (Math.random() * -12) + 's';
      particleContainer.appendChild(p);
    }
  }

  /* ---------- Project filtering ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-tags]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = card.dataset.tags.split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

})();