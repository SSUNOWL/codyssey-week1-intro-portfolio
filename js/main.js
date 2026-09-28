// 공통 UI: 메뉴, 섹션 이동, 스크롤 표시, 화면 진입 애니메이션을 담당한다.
// 스크롤 기준값은 README에 기록한 값과 맞춘다.
const HEADER_SCROLL_THRESHOLD = 60;
const SCROLL_TOP_THRESHOLD = 300;
const REVEAL_THRESHOLD = 0.2;

const siteHeader = document.querySelector('#site-header');
const menuToggle = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopButton = document.querySelector('#scroll-top');
const revealElements = document.querySelectorAll('.reveal');
// 링크와 실제 섹션을 짝지어 두고, 스크롤할 때 현재 위치를 표시한다.
const navSections = Array.from(navLinks)
  .map((link) => ({
    link,
    section: document.getElementById(link.getAttribute('href')?.slice(1) ?? ''),
  }))
  .filter(({ section }) => section);

const syncMenuToggleUi = (isOpen) => {
  // 보이는 메뉴 상태와 보조 기술이 읽는 버튼 상태를 항상 함께 바꾼다.
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

const updateCurrentNavLink = () => {
  // 헤더 바로 아래까지 올라온 마지막 섹션을 현재 위치로 본다.
  const headerHeight = siteHeader?.offsetHeight ?? 0;
  const current = navSections.reduce(
    (active, entry) =>
      entry.section.getBoundingClientRect().top <= headerHeight + 24
        ? entry
        : active,
    navSections[0]
  );

  navSections.forEach(({ link }) => {
    if (link === current?.link) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const handleNavLinkClick = (event) => {
  // 기본 앵커 점프를 막고 대상이 실제로 있을 때만 부드럽게 이동한다.
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

  updateCurrentNavLink();

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
    // API가 없는 브라우저에서도 콘텐츠가 숨겨진 채 남지 않게 한다.
    revealElements.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // 첫 진입에만 나타나게 하고 관찰을 끝낸다.
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

if (menuToggle && navMenu) {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !navMenu.classList.contains('active')) return;
    // 키보드 사용자가 닫힌 메뉴에서 길을 잃지 않도록 버튼으로 돌아간다.
    closeMobileMenu();
    menuToggle.focus();
  });
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
