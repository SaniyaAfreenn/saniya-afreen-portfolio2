document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Soft Magnetic Cursor Follower (Lusion Studio Style)
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let dotX = mouseX;
    let dotY = mouseY;

    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      // Smooth lerp movement
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;

      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(renderCursor);
    }

    requestAnimationFrame(renderCursor);

    // Magnetic Hover Reaction
    const interactiveElements = document.querySelectorAll('a, button, .skill-pill, .cert-card, .contact-card, .timeline-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
    });
  }

  // 2. Lusion-Inspired Side-Sliding Navigation Drawer
  const menuTrigger = document.getElementById('menuTrigger');
  const sideDrawer = document.getElementById('sideDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    if (sideDrawer && drawerBackdrop) {
      sideDrawer.classList.add('is-open');
      drawerBackdrop.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (sideDrawer && drawerBackdrop) {
      sideDrawer.classList.remove('is-open');
      drawerBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (menuTrigger) menuTrigger.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  const drawerNavItems = document.querySelectorAll('.drawer-nav-item');
  drawerNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');
      const target = document.getElementById(sectionId);
      closeDrawer();
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    });
  });

  // 3. Scroll-Driven Reveal Motion (IntersectionObserver)
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
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4. Scroll Progress Indicator
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

  // 5. Brand Scroll to Top
  const brandBtn = document.getElementById('brandBtn');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Certificate Lightbox Modal
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
    modalCloseBtn.addEventListener('click', () => certModal.classList.remove('is-active'));
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) certModal.classList.remove('is-active');
    });
  }

  // Close modals & drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (certModal && certModal.classList.contains('is-active')) {
        certModal.classList.remove('is-active');
      }
      closeDrawer();
    }
  });
});
