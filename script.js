/**
 * VIJAY KUMAR SAW - PORTFOLIO INTERACTIVITY & ANIMATIONS
 * Includes: Scroll Progress, Sticky Navbar, ScrollSpy, Typed.js,
 * IntersectionObserver Reveals, Skill Bars Fill, Project Filtering,
 * VanillaTilt 3D Cards, Toast Notifications & Contact Handler.
 */

let lenis = null;

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initScrollProgress();
  initNavbar();
  initSmoothAnchorScroll();
  initTypewriter();
  initScrollSpy();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initTilt();
  initEmailCopy();
  initContactForm();
});

/* ------------------- 0. LENIS MOMENTUM SMOOTH SCROLL ------------------- */
function initLenis() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

/* ------------------- SMOOTH ANCHOR SCROLLING ------------------- */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      if (lenis) {
        lenis.scrollTo(targetElement, {
          offset: -65,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        const navHeight = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/* ------------------- 1. SCROLL PROGRESS BAR ------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress);
  if (lenis) {
    lenis.on('scroll', updateProgress);
  }
}

/* ------------------- 2. NAVBAR SCROLL & MOBILE MENU ------------------- */
function initNavbar() {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow and blur
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }
  });

  const closeMenu = () => {
    menuToggle?.classList.remove('open');
    navMenu?.classList.remove('open');
    menuOverlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (lenis) lenis.start();
  };

  const openMenu = () => {
    menuToggle?.classList.add('open');
    navMenu?.classList.add('open');
    menuOverlay?.classList.add('active');
    document.body.classList.add('menu-open');
    if (lenis) lenis.stop();
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    // Close mobile menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close mobile menu on Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }
}

/* ------------------- 3. DYNAMIC TYPEWRITER EFFECT ------------------- */
function initTypewriter() {
  const typedTarget = document.querySelector('.typed-text');
  if (!typedTarget) return;

  if (typeof Typed !== 'undefined') {
    new Typed('.typed-text', {
      strings: [
        'Frontend Developer',
        'Problem Solver',
        'UI Enthusiast',
        'Lifelong Learner'
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 2000,
      loop: true,
      smartBackspace: true,
      cursorChar: '|'
    });
  } else {
    // Fallback if CDN is unavailable
    typedTarget.textContent = 'Frontend Developer';
  }
}

/* ------------------- 4. SCROLLSPY (ACTIVE NAV HIGHLIGHT) ------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    if (!current && window.scrollY < 100) {
      current = 'home';
    }

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ------------------- 5. SCROLL REVEAL (INTERSECTION OBSERVER) ------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ------------------- 6. ANIMATED SKILL PROGRESS BARS ------------------- */
function initSkillBars() {
  const progressFills = document.querySelectorAll('.progress-fill');
  if (!progressFills.length) return;

  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-progress') || '0';
          fill.style.width = `${targetWidth}%`;
          obs.unobserve(fill);
        }
      });
    },
    { threshold: 0.25 }
  );

  progressFills.forEach((fill) => skillObserver.observe(fill));
}

/* ------------------- 7. PROJECT CATEGORY FILTERING ------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ------------------- 8. 3D TILT EFFECT ------------------- */
function initTilt() {
  // Only enable 3D tilt on devices that support hover to avoid interfering with mobile touch scroll
  if (
    typeof VanillaTilt !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      scale: 1.02
    });
  }
}

/* ------------------- 9. EMAIL COPY TO CLIPBOARD ------------------- */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'kumarvijay90060@gmail.com';
    navigator.clipboard
      .writeText(email)
      .then(() => {
        showToast('Email address copied to clipboard!', 'success');
      })
      .catch(() => {
        showToast('Failed to copy. Email: ' + email, 'error');
      });
  });
}

/* ------------------- 10. CONTACT FORM SUBMISSION ------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const senderName = nameInput ? nameInput.value.trim() : 'friend';
    const originalContent = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

    const formData = new FormData(form);

    try {
      const response = await fetch('https://formsubmit.co/ajax/kumarvijay90060@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        form.reset();
        showToast(`Thank you, ${senderName}! Your message was sent directly to Vijay's email.`, 'success');
      } else {
        const data = await response.json().catch(() => ({}));
        showToast(data.message || 'Something went wrong. Please email directly to kumarvijay90060@gmail.com', 'error');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      showToast('Network error. You can email directly at kumarvijay90060@gmail.com', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
    }
  });
}

/* ------------------- 11. TOAST NOTIFICATION UTILITY ------------------- */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');

  if (toastMessage) toastMessage.textContent = message;

  if (toastIcon) {
    if (type === 'success') {
      toastIcon.className = 'toast-icon fa-solid fa-circle-check';
      toastIcon.style.color = '#00f2fe';
    } else {
      toastIcon.className = 'toast-icon fa-solid fa-circle-exclamation';
      toastIcon.style.color = '#ef4444';
    }
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}
