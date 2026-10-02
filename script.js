document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll-Driven Reveal Motion (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 2. Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // 3. Mobile Menu Drawer Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
    });
  }

  // 4. Smooth Navigation & Active Link Highlight
  const brandBtn = document.getElementById('brandBtn');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (navLinks) navLinks.classList.remove('is-open');
    });
  }

  const navButtons = document.querySelectorAll('.nav-links button[data-section]');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.getAttribute('data-section');
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        if (navLinks) navLinks.classList.remove('is-open');
      }
    });
  });

  const sections = document.querySelectorAll('section[id]');
  function highlightNavOnScroll() {
    let currentSection = 'about';
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navButtons.forEach(btn => {
      if (btn.getAttribute('data-section') === currentSection) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // 5. Certificate Lightbox Modal
  const certCards = document.querySelectorAll('.cert-card');
  const certModal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img') || card.querySelector('img')?.src;
      if (imgSrc && certModal && modalImg) {
        modalImg.src = imgSrc;
        certModal.classList.add('is-active');
      }
    });
  });

  if (modalCloseBtn && certModal) {
    modalCloseBtn.addEventListener('click', () => {
      certModal.classList.remove('is-active');
    });
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        certModal.classList.remove('is-active');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('is-active')) {
      certModal.classList.remove('is-active');
    }
  });
});
