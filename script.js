const root = document.documentElement;

// localStorage can be blocked (private mode), so every access is wrapped
const store = {
  get: k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }
};

// ---------- Theme (light / dark) ----------
const themeBtn = document.getElementById('themeBtn');
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeBtn.textContent = theme === 'dark' ? 'Light' : 'Dark';
}
applyTheme(root.dataset.theme || 'light');   // the <head> script already picked it
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  store.set('theme', next);
});

// ---------- Mobile menu ----------
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');
function toggleMenu(open) {
  menu.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
}
menuBtn.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// ---------- Contact form (opens the visitor's email app) ----------
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent('Portfolio message from ' + name);
  const body = encodeURIComponent(message + '\n\n' + name + ' (' + email + ')');
  window.location.href = `mailto:my940771@gmail.com?subject=${subject}&body=${body}`;
  e.target.reset();
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Sections fade in while scrolling ----------
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}