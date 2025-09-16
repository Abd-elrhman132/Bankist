'use strict';

// Loading Screen
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

// Particle Effects
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

// Enhanced Scroll Animations
const initScrollAnimations = () => {
  const sections = document.querySelectorAll('.section');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
};

// Initialize effects
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initScrollAnimations();
});

// Elements
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const darkModeToggle = document.querySelector('#dark-mode-toggle');
const toast = document.querySelector('#toast');
const statsNumbers = document.querySelectorAll('.stat__number');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const images = document.querySelectorAll('.feature__img, .testimonial__img');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const scrollProgress = document.querySelector('#scroll-progress');
const backToTopBtn = document.querySelector('#back-to-top');
const newsletterForm = document.querySelector('#newsletter-form');
const newsletterEmail = document.querySelector('#newsletter-email');
const newsletterHint = document.querySelector('.newsletter__hint');

// Utility Functions
const showToast = (message, type = 'success') => {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
};

// Dark Mode Toggle
const toggleDarkMode = () => {
  const darkModeBtn = document.querySelector('.dark-mode-btn');
  if (darkModeBtn) {
    darkModeBtn.classList.add('animating');
    setTimeout(() => {
      darkModeBtn.classList.remove('animating');
    }, 500);
  }
  document.body.classList.toggle('dark-mode');
  localStorage.setItem(
    'darkMode',
    document.body.classList.contains('dark-mode') ? 'true' : 'false'
  );
  showToast(
    `Switched to ${
      document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    } mode`
  );
};

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', toggleDarkMode);

// Login Toast
document.querySelector('.nav__link--btn').addEventListener('click', e => {
  e.preventDefault();
  showToast('Redirecting to login...', 'success');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
});

// Hamburger Menu
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Smooth Scrolling
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    if (navLinks.classList.contains('active')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  }
});

document.querySelectorAll('.btn--scroll-to').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
  });
});

// Sticky Navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll('.section');
const revealSection = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
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

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.1,
});

images.forEach(img => imgObserver.observe(img));

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

const statsObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entries[0].target);
    }
  },
  { root: null, threshold: 0.5 }
);
statsObserver.observe(document.querySelector('.stats'));

// Tabbed Component
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
    t.setAttribute('aria-selected', 'false');
  });
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  clicked.setAttribute('aria-selected', 'true');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
// Card Stack Slider
const initCardStack = () => {
  const cards = document.querySelectorAll('.card');
  const prevBtn = document.querySelector('.card-btn--prev');
  const nextBtn = document.querySelector('.card-btn--next');
  const indicators = document.querySelectorAll('.indicator');
  const cardStack = document.querySelector('.card-stack');

  let currentCard = 0;
  const maxCards = cards.length;
  let isAnimating = false;
  let autoSlideInterval;

  // Initialize card positions
  const initCards = () => {
    cards.forEach((card, index) => {
      card.classList.remove('active', 'prev', 'next', 'hidden');

      if (index === currentCard) {
        card.classList.add('active');
      } else if (index === (currentCard + 1) % maxCards) {
        card.classList.add('next');
      } else if (index === (currentCard - 1 + maxCards) % maxCards) {
        card.classList.add('prev');
      } else {
        card.classList.add('hidden');
      }
    });

    updateIndicators();
  };

  // Update indicator states
  const updateIndicators = () => {
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentCard);
    });
  };

  // Animate card transitions
  const animateCards = () => {
    if (isAnimating) return;
    isAnimating = true;

    cards.forEach(card => {
      card.classList.remove('active', 'prev', 'next', 'hidden');
    });

    cards.forEach((card, index) => {
      const cardIndex = parseInt(card.dataset.card);

      if (cardIndex === currentCard) {
        card.classList.add('active');
      } else if (cardIndex === (currentCard + 1) % maxCards) {
        card.classList.add('next');
      } else if (cardIndex === (currentCard - 1 + maxCards) % maxCards) {
        card.classList.add('prev');
      } else {
        card.classList.add('hidden');
      }
    });

    updateIndicators();

    setTimeout(() => {
      isAnimating = false;
    }, 600);
  };

  // Go to specific card
  const goToCard = cardIndex => {
    if (isAnimating || cardIndex === currentCard) return;

    currentCard = cardIndex;
    animateCards();
  };

  // Next card
  const nextCard = () => {
    if (isAnimating) return;
    currentCard = (currentCard + 1) % maxCards;
    animateCards();
  };

  // Previous card
  const prevCard = () => {
    if (isAnimating) return;
    currentCard = (currentCard - 1 + maxCards) % maxCards;
    animateCards();
  };

  // Auto slide functionality (disabled on mobile)
  const startAutoSlide = () => {
    if (window.innerWidth > 768) {
      // Only auto-slide on non-mobile
      autoSlideInterval = setInterval(nextCard, 4000);
    }
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  // Touch/swipe support
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  const handleTouchStart = e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    stopAutoSlide();
  };

  const handleTouchMove = e => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = e => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    // Lower threshold for mobile swipe sensitivity
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      if (diffX > 0) {
        nextCard();
      } else {
        prevCard();
      }
    }

    startAutoSlide();
  };

  // Mouse drag support
  const handleMouseDown = e => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    stopAutoSlide();
    e.preventDefault();
  };

  const handleMouseMove = e => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = e => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.clientX;
    const endY = e.clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      if (diffX > 0) {
        nextCard();
      } else {
        prevCard();
      }
    }

    startAutoSlide();
  };

  // Event listeners
  prevBtn.addEventListener('click', prevCard);
  nextBtn.addEventListener('click', nextCard);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToCard(index));
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevCard();
    if (e.key === 'ArrowRight') nextCard();
  });

  // Touch events with passive option for better performance
  cardStack.addEventListener('touchstart', handleTouchStart, {
    passive: false,
  });
  cardStack.addEventListener('touchmove', handleTouchMove, { passive: false });
  cardStack.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Mouse events
  cardStack.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // Pause auto-slide on hover
  cardStack.addEventListener('mouseenter', stopAutoSlide);
  cardStack.addEventListener('mouseleave', startAutoSlide);

  // Initialize
  initCards();
  startAutoSlide();
};

// Initialize card stack if elements exist
const cardStack = document.querySelector('.card-stack');
if (cardStack) {
  initCardStack();
}

// Fallback to original slider if card stack doesn't exist
const initSlider = () => {
  let currentSlide = 0;
  const maxSlide = slides.length;

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}" aria-label="Slide ${
          i + 1
        }"></button>`
      );
    });
  };

  const activateDot = slide => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    const activeDot = document.querySelector(
      `.dots__dot[data-slide="${slide}"]`
    );
    if (activeDot) activeDot.classList.add('dots__dot--active');
  };

  const goToSlide = slide => {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === slide);
    });
    activateDot(slide);
  };

  const nextSlide = () => {
    currentSlide = currentSlide === maxSlide - 1 ? 0 : currentSlide + 1;
    goToSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = currentSlide === 0 ? maxSlide - 1 : currentSlide - 1;
    goToSlide(currentSlide);
  };

  const init = () => {
    createDots();
    goToSlide(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const slide = parseInt(e.target.dataset.slide);
      goToSlide(slide);
    }
  });

  let autoSlide = setInterval(nextSlide, 5000);
  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(nextSlide, 5000);
  });
};

if (slides.length > 0) {
  initSlider();
}

// Scroll Progress & Back-to-Top
const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
  if (backToTopBtn) {
    if (scrollTop > 600) backToTopBtn.classList.add('show');
    else backToTopBtn.classList.remove('show');
  }
};

window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Newsletter
const isValidEmail = value => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = newsletterEmail?.value.trim() || '';
    if (!isValidEmail(email)) {
      newsletterHint.textContent = 'Please enter a valid email address.';
      newsletterHint.style.color = '#fecaca';
      showToast('Invalid email address', 'error');
      return;
    }
    // Fake async submit
    newsletterHint.textContent = 'Subscribing...';
    newsletterHint.style.color = '#cbd5e1';
    setTimeout(() => {
      newsletterHint.textContent = 'You are subscribed! Check your inbox.';
      newsletterHint.style.color = '#bbf7d0';
      showToast('Subscribed successfully', 'success');
      newsletterEmail.value = '';
    }, 900);
  });
}
