const root = document.documentElement;

// ---------- 1) اللغة (English / عربي) ----------
// كل عنصر عليه data-ar: نحفظ نصه الإنجليزي الأصلي أولاً، وبعدها نبدّل بين النصين.
const texts = document.querySelectorAll('[data-ar]');
texts.forEach(el => el.dataset.en = el.innerHTML);

const typingWords = {
  en: ['things with AI', 'secure systems', 'desktop apps in C#'],
  ar: ['حلولاً بالذكاء الاصطناعي', 'أنظمة آمنة', 'تطبيقات سطح مكتب بلغة C#']
};
let lang = localStorage.getItem('lang') || 'en';

function setLang(newLang) {
  lang = newLang;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  texts.forEach(el => el.innerHTML = el.dataset[lang]);
  langBtn.textContent = lang === 'ar' ? 'English' : 'عربي';
  updateThemeBtn();
  startTyping();
  localStorage.setItem('lang', lang);
}

const langBtn = document.getElementById('langBtn');
langBtn.addEventListener('click', () => setLang(lang === 'en' ? 'ar' : 'en'));

// ---------- 2) الوضع الداكن / الفاتح ----------
const themeBtn = document.getElementById('themeBtn');

function updateThemeBtn() {
  const dark = root.dataset.theme === 'dark';
  themeBtn.textContent = lang === 'ar' ? (dark ? 'فاتح' : 'داكن') : (dark ? 'Light' : 'Dark');
}
function setTheme(theme) {
  root.dataset.theme = theme;
  updateThemeBtn();
  localStorage.setItem('theme', theme);
}
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

// ---------- 3) قائمة الموبايل ----------
const menu = document.getElementById('menu');
document.getElementById('menuBtn').addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// ---------- 4) الكتابة المتحركة ----------
const typed = document.getElementById('typed');
let wordIndex = 0, charIndex = 0, deleting = false, timer;

function type() {
  const word = typingWords[lang][wordIndex];
  typed.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex === word.length) {   // خلصت الكلمة: استنى شوية ثم امسح
    deleting = true;
    timer = setTimeout(type, 1400);
    return;
  }
  if (deleting && charIndex === 0) {              // اتمسحت: روح للكلمة اللي بعدها
    deleting = false;
    wordIndex = (wordIndex + 1) % typingWords[lang].length;
  }
  charIndex += deleting ? -1 : 1;
  timer = setTimeout(type, deleting ? 40 : 80);
}
function startTyping() {
  clearTimeout(timer);
  wordIndex = 0; charIndex = 0; deleting = false;
  type();
}

// ---------- 5) الفورم (يفتح برنامج الإيميل) ----------
// المتصفح نفسه بيتأكد إن الحقول مليانة وإن الإيميل صحيح بسبب required و type="email"
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

// ---------- 6) السنة في الفوتر ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- تشغيل أولي ----------
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light'));
setLang(lang);
