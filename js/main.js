const HEADER_SCROLL_THRESHOLD = 60;
const SCROLL_TOP_THRESHOLD = 300;
const REVEAL_THRESHOLD = 0.2;

const siteHeader = document.querySelector('#site-header');
const menuToggle = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopButton = document.querySelector('#scroll-top');
const revealElements = document.querySelectorAll('.reveal');

const syncMenuToggleUi = (isOpen) => {
  if (!menuToggle) return;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
};

const closeMobileMenu = () => {
  if (!navMenu) return;
  navMenu.classList.remove('active');
  syncMenuToggleUi(false);
};

const toggleMobileMenu = () => {
  if (!menuToggle || !navMenu) return;

  const isOpen = navMenu.classList.toggle('active');
  syncMenuToggleUi(isOpen);
};

const handleNavLinkClick = (event) => {
  event.preventDefault();

  const targetSelector = event.currentTarget?.getAttribute('href');
  if (!targetSelector || !targetSelector.startsWith('#')) return;

  const target = document.querySelector(targetSelector);
  if (!target) return;

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  closeMobileMenu();
};

const handleScroll = () => {
  const y = window.scrollY;

  if (siteHeader) {
    if (y >= HEADER_SCROLL_THRESHOLD) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  if (scrollTopButton) {
    if (y >= SCROLL_TOP_THRESHOLD) {
      scrollTopButton.classList.add('visible');
    } else {
      scrollTopButton.classList.remove('visible');
    }
  }
};

const initRevealObserver = () => {
  if (revealElements.length === 0) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: REVEAL_THRESHOLD,
    }
  );

  revealElements.forEach((item) => observer.observe(item));
};

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMobileMenu);
}

if (navLinks.length > 0) {
  navLinks.forEach((link) => {
    link.addEventListener('click', handleNavLinkClick);
  });
}

if (scrollTopButton) {
  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

window.addEventListener('scroll', handleScroll);

initRevealObserver();
handleScroll();
