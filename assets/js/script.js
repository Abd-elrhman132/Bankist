'use strict';

/**
 * ==========================================================================
 * LOADING SCREEN
 * ==========================================================================
 */
window.addEventListener('load', () => {
  const loadingScreen = document.querySelector('#loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 2000);
  }
});

/**
 * ==========================================================================
 * BACKGROUND EFFECTS & ANIMATIONS
 * ==========================================================================
 */
const createParticles = () => {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = 20 + Math.random() * 10 + 's';
    particlesContainer.appendChild(particle);
  }
};

const initScrollAnimations = () => {
  const sections = document.querySelectorAll('.section');
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
};

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initScrollAnimations();
});

/**
 * ==========================================================================
 * UI ELEMENTS & UTILITIES
 * ==========================================================================
 */
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const darkModeToggle = document.querySelector('#dark-mode-toggle');
const toast = document.querySelector('#toast');
const statsNumbers = document.querySelectorAll('.stat__number');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const images = document.querySelectorAll('.feature__img');
const scrollProgress = document.querySelector('#scroll-progress');
const backToTopBtn = document.querySelector('#back-to-top');
const newsletterForm = document.querySelector('#newsletter-form');
const newsletterEmail = document.querySelector('#newsletter-email');
const newsletterHint = document.querySelector('.newsletter__hint');

const showToast = (message, type = 'success') => {
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
};

/**
 * ==========================================================================
 * NAVIGATION & DARK MODE
 * ==========================================================================
 */
const toggleDarkMode = () => {
  const darkModeBtn = document.querySelector('.dark-mode-btn');
  if (darkModeBtn) {
    darkModeBtn.classList.add('animating');
    setTimeout(() => darkModeBtn.classList.remove('animating'), 500);
  }
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark);
  showToast(`Switched to ${isDark ? 'dark' : 'light'} mode`);
};

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Sync across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'darkMode') {
    if (e.newValue === 'true') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }
});

darkModeToggle?.addEventListener('click', toggleDarkMode);

// Mobile Nav Logic
document.addEventListener('DOMContentLoaded', () => {
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', !isExpanded);
    document.body.classList.toggle('nav-open');
  });

  document.querySelectorAll('.nav__link').forEach((link, index) => {
    link.style.setProperty('--index', index);
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
});

// Smooth Scrolling
navLinks?.addEventListener('click', e => {
  const link = e.target.closest('.nav__link');
  if (link && !link.classList.contains('nav__link--btn')) {
    e.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }
});

document.querySelector('.btn--scroll-to')?.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
});

/**
 * ==========================================================================
 * INTERSECTION OBSERVERS
 * ==========================================================================
 */

// Sticky Nav
const header = document.querySelector('.header');
if (header) {
  const navHeight = nav.getBoundingClientRect().height;
  const stickyNav = entries => {
    const [entry] = entries;
    nav.classList.toggle('sticky', !entry.isIntersecting);
  };
  new IntersectionObserver(stickyNav, { root: null, threshold: 0, rootMargin: `-${navHeight}px` }).observe(header);
}

// Reveal Sections
const revealSection = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.15 });
document.querySelectorAll('.section').forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading Images
const loadImg = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(loadImg, { root: null, threshold: 0.1 });
images.forEach(img => imgObserver.observe(img));

/**
 * ==========================================================================
 * INTERACTIVE COMPONENTS
 * ==========================================================================
 */

// Animated Counters
const animateCounters = () => {
  statsNumbers.forEach(stat => {
    const target = +stat.dataset.target;
    let count = 0;
    const increment = target / 100;
    const updateCount = () => {
      count += increment;
      if (count < target) {
        stat.textContent = Math.round(count).toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        stat.textContent = target.toLocaleString();
      }
    };
    updateCount();
  });
};

const statsSection = document.querySelector('.stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entries[0].target);
    }
  }, { root: null, threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// Tabbed Component
tabsContainer?.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
    t.setAttribute('aria-selected', 'false');
  });
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  clicked.setAttribute('aria-selected', 'true');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)?.classList.add('operations__content--active');
});

/**
 * ==========================================================================
 * CARD STACK SLIDER
 * ==========================================================================
 */
const initCardStack = () => {
  const cards = document.querySelectorAll('.card');
  const prevBtn = document.querySelector('.card-btn--prev');
  const nextBtn = document.querySelector('.card-btn--next');
  const indicators = document.querySelectorAll('.indicator');
  const cardStack = document.querySelector('.card-stack');

  if (!cardStack) return;

  let currentCard = 0;
  const maxCards = cards.length;
  let isAnimating = false;

  const updateUI = () => {
    cards.forEach((card, index) => {
      card.classList.remove('active', 'prev', 'next', 'hidden');
      if (index === currentCard) card.classList.add('active');
      else if (index === (currentCard + 1) % maxCards) card.classList.add('next');
      else if (index === (currentCard - 1 + maxCards) % maxCards) card.classList.add('prev');
      else card.classList.add('hidden');
    });
    indicators.forEach((ind, index) => ind.classList.toggle('active', index === currentCard));
  };

  const nextCard = () => {
    if (isAnimating) return;
    isAnimating = true;
    currentCard = (currentCard + 1) % maxCards;
    updateUI();
    setTimeout(() => isAnimating = false, 600);
  };

  const prevCard = () => {
    if (isAnimating) return;
    isAnimating = true;
    currentCard = (currentCard - 1 + maxCards) % maxCards;
    updateUI();
    setTimeout(() => isAnimating = false, 600);
  };

  nextBtn?.addEventListener('click', nextCard);
  prevBtn?.addEventListener('click', prevCard);
  indicators.forEach((ind, index) => ind.addEventListener('click', () => {
    currentCard = index;
    updateUI();
  }));

  let autoSlide = setInterval(nextCard, 5000);
  cardStack.addEventListener('mouseenter', () => clearInterval(autoSlide));
  cardStack.addEventListener('mouseleave', () => autoSlide = setInterval(nextCard, 5000));

  updateUI();
};

initCardStack();

/**
 * ==========================================================================
 * SCROLL PROGRESS & NEWSLETTER
 * ==========================================================================
 */
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollProgress) scrollProgress.style.width = `${(scrollTop / docHeight) * 100}%`;
  if (backToTopBtn) backToTopBtn.classList.toggle('show', scrollTop > 600);
}, { passive: true });

backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

newsletterForm?.addEventListener('submit', e => {
  e.preventDefault();
  const email = newsletterEmail.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newsletterHint.textContent = 'Please enter a valid email address.';
    newsletterHint.style.color = '#fecaca';
    return;
  }
  newsletterHint.textContent = 'Subscribing...';
  newsletterHint.style.color = '#cbd5e1';
  setTimeout(() => {
    newsletterHint.textContent = 'You are subscribed! Check your inbox.';
    newsletterHint.style.color = '#bbf7d0';
    showToast('Subscribed successfully');
    newsletterForm.reset();
  }, 900);
});
