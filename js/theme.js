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
  themeState.current = VALID_THEMES.includes(theme) ? theme : 'light';
  localStorage.setItem(THEME_STORAGE_KEY, themeState.current);
  renderTheme();
};

const initializeTheme = () => {
  const savedTheme = getSavedTheme();
  themeState.current = savedTheme || 'light';
  renderTheme();
};

themeToggleButton?.addEventListener('click', () => {
  const nextTheme = themeState.current === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

initializeTheme();
