// Tiny JS: nav toggle + theme switch + current year
(() => {
  const nav = document.querySelector('.nav');
  const btn = document.getElementById('navToggle');
  const list = document.getElementById('nav-list');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const exp = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', (!exp).toString());
      btn.setAttribute('aria-expanded', (!exp).toString());
    });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear().toString();

  // theme toggle
  const themeBtn = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = (t) => document.documentElement.style.colorScheme = t;
  const saved = localStorage.getItem('theme');
  if (saved) apply(saved);
  themeBtn?.addEventListener('click', () => {
    const current = getComputedStyle(document.documentElement).colorScheme || (prefersDark.matches ? 'dark' : 'light');
    const next = current.includes('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', next); apply(next);
  });
})();