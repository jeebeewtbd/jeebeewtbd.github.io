// Holy Mangrove - Interactive Functionality
// Combined main.js and navigation.js functionality

// Application data
const appData = {
  thoughts: [
    {
      date: "2025-07-12",
      title: "Beginnings",
      content: "First reflection on creating Holy Mangrove. Roots take hold in brackish water, teaching resilience. There's something profound about beginning a project like this - creating a space where thoughts and art can breathe together. The mangrove teaches us about resilience, about finding ways to thrive in challenging conditions, with roots that filter the salt and branches that reach toward the light."
    },
    {
      date: "2025-07-10", 
      title: "Roots and Branches",
      content: "Meditation on interconnectedness. Every line in my sketchbook echoes a submerged root seeking light. I've been thinking about how our creative work mirrors the natural world - how every stroke, every mark we make, is connected to something deeper. The mangrove's intricate root system reminds me that our art doesn't exist in isolation; it's part of a vast network of influence, inspiration, and connection."
    }
  ]
};

(function() {
  // Ensure initialization regardless of DOM readiness state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  // ----------------- Initialization -----------------
  function initializeApp() {
    setupNavigation();
    setupGallery();
    setupThoughts();
    setupScrollEffects();
    setupAccessibility();
    console.log('Holy Mangrove initialized');
  }

  // ----------------- Navigation -----------------
  function setupNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');
    let isMenuOpen = false;

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navToggle.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;

        if (isMenuOpen) {
          isMenuOpen = false;
          navToggle.classList.remove('active');
          navList.classList.remove('active');
          document.body.style.overflow = '';
        }

        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
      if (isMenuOpen && !navList.contains(e.target) && !navToggle.contains(e.target)) {
        isMenuOpen = false;
        navToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Accessibility: close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isMenuOpen) {
        isMenuOpen = false;
        navToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ----------------- Gallery -----------------
  function setupGallery() {
    if (typeof SimpleLightbox === 'undefined') return;
    new SimpleLightbox('.gallery__link', {
      captions: true,
      captionSelector: 'img',
      captionType: 'attr',
      captionsData: 'alt',
      captionDelay: 200,
      nav: true,
      navText: ['‹', '›'],
      closeText: '×',
      showCounter: true,
      animationSpeed: 250,
      loop: true
    });
  }

  // ----------------- Thoughts -----------------
  function setupThoughts() {
    const cards = document.querySelectorAll('.thought-card');
    if (!cards.length) return;

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'thought-modal';
    modal.innerHTML = `
      <div class="thought-modal__content" role="dialog" aria-modal="true" aria-labelledby="thought-title">
        <button class="thought-modal__close" aria-label="Close modal">&times;</button>
        <div class="thought-modal__date" id="thought-date"></div>
        <h3 class="thought-modal__title" id="thought-title"></h3>
        <div class="thought-modal__content-text" id="thought-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
    const closeBtn = modal.querySelector('.thought-modal__close');

    cards.forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.thought));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card.dataset.thought);
        }
      });
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
    });

    closeBtn.addEventListener('click', () => closeModal());
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    function openModal(index) {
      const data = appData.thoughts[index];
      if (!data) return;
      const dateEl = modal.querySelector('#thought-date');
      const titleEl = modal.querySelector('#thought-title');
      const contentEl = modal.querySelector('#thought-content');

      const dateObj = new Date(data.date);
      dateEl.textContent = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      titleEl.textContent = data.title;
      contentEl.textContent = data.content;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ----------------- Scroll Effects -----------------
  function setupScrollEffects() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      if (!header) return;
      const opacity = Math.min(0.95, 0.8 + window.scrollY * 0.001);
      header.style.backgroundColor = `rgba(245,245,243,${opacity})`;
    });
  }

  // ----------------- Accessibility -----------------
  function setupAccessibility() {
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = 'position:absolute;top:-40px;left:6px;background:#484E45;color:#F5F5F3;padding:8px;border-radius:4px;z-index:9999;transition:top .3s;';
    skipLink.addEventListener('focus', () => (skipLink.style.top = '6px'));
    skipLink.addEventListener('blur', () => (skipLink.style.top = '-40px'));
    document.body.prepend(skipLink);
    const hero = document.querySelector('#hero');
    if (hero) hero.setAttribute('tabindex', '-1');
  }
})();