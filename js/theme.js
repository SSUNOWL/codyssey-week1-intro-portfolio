const THEME_STORAGE_KEY = 'portfolio-theme';
const VALID_THEMES = ['light', 'dark'];

const themeState = {
  current: 'light',
};

const themeToggleButton = document.querySelector('#theme-toggle');

const getSavedTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return VALID_THEMES.includes(savedTheme) ? savedTheme : null;
};

const renderTheme = () => {
  // 현재 상태를 화면에 반영한다. 색상은 CSS 변수가 담당하므로 루트 속성만 바꾼다.
  document.documentElement.dataset.theme = themeState.current;

  if (!themeToggleButton) return;

  const isDark = themeState.current === 'dark';
  themeToggleButton.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  themeToggleButton.setAttribute(
    'aria-label',
    isDark ? '라이트 모드로 전환' : '다크 모드로 전환'
  );
};

const setTheme = (theme) => {
  // 클릭 흐름: 상태 변경 -> 저장 -> 화면 렌더링.
  themeState.current = VALID_THEMES.includes(theme) ? theme : 'light';
  localStorage.setItem(THEME_STORAGE_KEY, themeState.current);
  renderTheme();
};

const initializeTheme = () => {
  // 새로고침 시 저장값을 읽되, 허용되지 않은 값은 기본 라이트 모드로 돌린다.
  const savedTheme = getSavedTheme();
  themeState.current = savedTheme || 'light';
  renderTheme();
};

themeToggleButton?.addEventListener('click', () => {
  const nextTheme = themeState.current === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

initializeTheme();
