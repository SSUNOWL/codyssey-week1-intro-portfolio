const GITHUB_USERNAME = '{{GITHUB_USERNAME}}';
const projectState = {
  status: 'idle',
  repositories: [],
  error: null,
};

const projectStatus = document.querySelector('#project-status');
const projectList = document.querySelector('#project-list');

const escapeHTML = (value) => {
  const text = String(value ?? '');
  const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => replacements[char]);
};

const setProjectState = (nextState) => {
  projectState.status = nextState.status ?? projectState.status;
  projectState.repositories = nextState.repositories ?? projectState.repositories;
  projectState.error = nextState.error ?? null;
};

const renderProjects = () => {
  if (!projectStatus || !projectList) {
    return;
  }

  projectStatus.className = `project-status ${projectState.status}`;
  projectStatus.innerHTML = '';

  if (projectState.status === 'loading') {
    projectStatus.innerHTML = `
      <div class="loading">
        <div class="spinner" aria-hidden="true"></div>
        <p>프로젝트를 불러오는 중...</p>
      </div>
    `;
    projectList.innerHTML = '';
    return;
  }

  if (projectState.status === 'empty') {
    projectStatus.innerHTML = `<p class="empty">표시할 프로젝트가 없습니다.</p>`;
    projectList.innerHTML = '';
    return;
  }

  if (projectState.status === 'error') {
    projectStatus.innerHTML = `
      <p class="error">프로젝트를 불러올 수 없습니다.</p>
      <p class="error">${escapeHTML(projectState.error || '요청에 실패했습니다.')}</p>
      <button id="retry-projects" class="retry-button" type="button">다시 시도</button>
    `;
    projectList.innerHTML = '';

    const retryButton = projectStatus.querySelector('#retry-projects');
    if (retryButton) {
      retryButton.addEventListener('click', fetchProjects);
    }
    return;
  }

  if (projectState.status === 'success') {
    const cards = projectState.repositories
      .map((repository) => {
        const {
          name = 'untitled',
          description = '설명이 없습니다.',
          html_url = '#',
          language = '언어 미지정',
          stargazers_count = 0,
          forks_count = 0,
        } = repository;
        const projectUrl =
          typeof html_url === 'string' && html_url.startsWith('http')
            ? html_url
            : '#';

        return `
          <article class="project-card">
            <h3>${escapeHTML(name)}</h3>
            <p>${escapeHTML(description)}</p>
            <p>언어: ${escapeHTML(language)}</p>
            <p>Stars: ${Number(stargazers_count)}</p>
            <p>Forks: ${Number(forks_count)}</p>
            <a href="${escapeHTML(projectUrl)}" target="_blank" rel="noopener noreferrer">GitHub에서 보기</a>
          </article>
        `;
      })
      .join('');

    projectList.innerHTML = cards;
    return;
  }

  projectStatus.innerHTML = '';
  projectList.innerHTML = '';
};

const sanitizeErrorMessage = (status) => {
  if (status === 403 || status === 429) {
    return 'GitHub API 요청 한도에 도달했을 수 있습니다. 잠시 후 다시 시도해주세요.';
  }

  return '프로젝트를 불러오는 중 문제가 발생했습니다.';
};

const fetchProjects = async () => {
  if (GITHUB_USERNAME.includes('{{')) {
    setProjectState({
      status: 'error',
      repositories: [],
      error: 'GITHUB 사용자 이름이 설정되지 않았습니다. {{GITHUB_USERNAME}}를 실제 계정명으로 바꿔주세요.',
    });
    renderProjects();
    return;
  }

  setProjectState({
    status: 'loading',
    repositories: [],
    error: null,
  });
  renderProjects();

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`
    );

    if (!response.ok) {
      throw new Error(sanitizeErrorMessage(response.status));
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('프로젝트 응답 형식이 유효하지 않습니다.');
    }

    const repositories = data
      .filter((repo) => repo && repo.name)
      .map(({ name, description, html_url, language, stargazers_count, forks_count }) => ({
        name,
        description,
        html_url,
        language,
        stargazers_count,
        forks_count,
      }));

    if (repositories.length === 0) {
      setProjectState({
        status: 'empty',
        repositories: [],
        error: null,
      });
      renderProjects();
      return;
    }

    setProjectState({
      status: 'success',
      repositories,
      error: null,
    });
    renderProjects();
  } catch (error) {
    setProjectState({
      status: 'error',
      repositories: [],
      error: error instanceof Error ? error.message : '네트워크 연결을 확인해 주세요.',
    });
    renderProjects();
  }
};

if (projectStatus && projectList) {
  fetchProjects();
}
