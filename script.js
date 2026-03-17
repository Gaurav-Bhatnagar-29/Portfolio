/* ============================================================
   GAURAV BHATNAGAR PORTFOLIO – script.js
   ============================================================ */

// ---- Init Lucide Icons ----
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  initTheme();
  initNavbar();
  initTyped();
  initReveal();
  initContactForm();
  initBackToTop();
  fetchGitHub();
});

// ---- Theme Toggle ----
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
}

// ---- Sticky Navbar ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    // Re-init lucide icons for newly visible elements
    if (window.lucide) lucide.createIcons();
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
}

// ---- Typewriter Effect ----
function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'CSE Student',
    'Data Science Enthusiast',
    'Machine Learning Explorer',
    'Software Developer',
    'Problem Solver',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; requestAnimationFrame(tick); }, 2000);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    if (!pause) requestAnimationFrame(tick);
  }

  let last = 0;
  function tick(ts) {
    const speed = deleting ? 60 : 110;
    if (ts - last > speed) { last = ts; type(); }
    else requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---- Scroll Reveal ----
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ---- Contact Form ----
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = document.getElementById('formNote');
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      note.textContent = '✅ Thanks! Your message was sent successfully.';
      note.style.color = 'var(--green)';
      form.reset();
      btn.innerHTML = '<svg data-lucide="send" style="width:16px;height:16px"></svg> Send Message';
      btn.disabled = false;
      if (window.lucide) lucide.createIcons();
      setTimeout(() => note.textContent = '', 5000);
    }, 1500);
  });
}

// ---- Back to Top ----
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- GitHub Stats ----
async function fetchGitHub() {
  const username = 'Gaurav-Bhatnagar-29';
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) return;
    const data = await res.json();

    document.getElementById('repoCount').textContent = data.public_repos ?? '—';
    document.getElementById('followerCount').textContent = data.followers ?? '—';

    // Fetch repos for star count
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (reposRes.ok) {
      const repos = await reposRes.json();
      const stars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      document.getElementById('starCount').textContent = stars;

      // Show top repos
      const top = repos
        .filter(r => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 4);

      if (top.length > 0) {
        const container = document.getElementById('ghRepos');
        container.innerHTML = `<div class="gh-repos-grid">${top.map(repo => `
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="gh-repo-card">
            <div class="gh-repo-header">
              <div class="gh-repo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </div>
              <span class="gh-repo-name">${repo.name}</span>
            </div>
            <p class="gh-repo-desc">${repo.description || 'No description available.'}</p>
            <div class="gh-repo-meta">
              ${repo.language ? `<span class="gh-repo-lang"><span class="lang-dot"></span>${repo.language}</span>` : ''}
              <span class="gh-repo-stars">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ${repo.stargazers_count}
              </span>
            </div>
          </a>`).join('')}
        </div>`;
      }
    }
  } catch (err) {
    // Silently fail — show placeholder
    console.log('GitHub API unavailable:', err.message);
  }
}
