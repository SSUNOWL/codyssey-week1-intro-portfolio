# week1-intro-portfolio

## 1. Project Title

week1-intro-portfolio

## 2. 프로젝트 소개

이 프로젝트는 `순수 HTML/CSS/JavaScript`로 만든 반응형 개인 포트폴리오입니다.  
React/Vue 같은 프레임워크 없이 **시맨틱 마크업**, **DOM 선택/이벤트**, **상태 관리 패턴**, **비동기 API 연동**을 학습하기 위한 구성입니다.  
초기 과제 목표인 웹 기초/프론트엔드 학습 80시간 흐름에 맞춰 핵심 개념 위주로 구현했습니다.

## 3. 주요 기능

구현된 기능만 정리했습니다.

- Responsive Web
- Semantic HTML
- Hamburger Menu
- Smooth Scroll
- Scroll Top
- Header Scroll Effect
- Dark Mode
- localStorage
- IntersectionObserver
- Contact Form Validation
- GitHub REST API
- Loading State
- Success State
- Error State
- Empty State
- Retry
- GitHub Project Language Filter

## 4. 기술 스택

- HTML5
- CSS3
- JavaScript ES6+
- GitHub REST API
- GitHub Pages

React, Vue, Angular, jQuery 등은 사용하지 않았습니다.

CSS는 색상, 간격, 모서리, 전환 시간을 변수로 관리합니다. 변수 그룹의 용도는 `style.css` 주석에 적었으며, 컴포넌트가 같은 값을 참조하므로 디자인 변경과 테마 전환을 한곳에서 관리할 수 있습니다.

## 5. 프로젝트 구조

```
codyssey-week1-intro-portfolio/
├─ .gitignore
├─ MISSION_NOTES.txt
├─ README.md
├─ index.html
├─ css/
│  └─ style.css
├─ images/
│  └─ profile-placeholder.svg
└─ js/
   ├─ main.js
   ├─ theme.js
   ├─ github.js
   └─ form.js
```

각 스크립트는 공통 UI, 테마, 프로젝트 API, 폼을 따로 담당합니다. 일반 스크립트로 실행하므로 `themeState`, `projectState`, `formState`처럼 이름을 구분해 전역 선언 충돌을 피합니다. 현재는 기능별 이벤트와 상태 흐름을 쉽게 따라갈 수 있는 분리를 사용하며, 기능이 커지고 공유 코드가 생기면 ES 모듈로 추출할 수 있습니다.

## 6. Semantic HTML 설계

- `header`: 사이트 전체 상단 네비게이션과 테마/메뉴 조작권을 담는 영역.
- `nav`: 섹션 이동 링크를 묶고, 현재 위치에 해당하는 링크의 `aria-current="location"`을 시각적 밑줄과 화면 읽기 도구 안내에 함께 사용.
- `main`: 페이지 핵심 콘텐츠를 감싸는 주 영역.
- `section`: 홈/소개/기술/프로젝트/문의를 논리적으로 나누어 구획화.
- `article`: 소개 본문, 프로젝트 카드 내부 블록 같은 독립적 콘텐츠 단위를 표현.
- `footer`: 저작권, 소셜 링크 등 페이지 하단 메타 정보를 담는 영역.

상호작용은 실제 `<button>`과 `<a>`로 구현하고, 의미 있는 이미지에는 `alt`, 폼에는 연결된 `label`과 오류 설명을 제공합니다. 키보드 포커스는 `:focus-visible`로 표시합니다. 수동 확인 시에는 `Tab` 순서와 숨겨진 메뉴 링크의 포커스 진입 여부를 점검합니다.

다크모드는 밝은 버튼 배경에 어두운 글자색을 사용하고 오류색도 별도로 조정합니다. 색 대비는 일반 텍스트 4.5:1, 큰 텍스트 3:1을 목표로 하며, 라이트/다크 화면의 실제 대비비 측정값은 아직 기록하지 않았습니다.

## 7. Flexbox vs Grid

Navigation은 로고, 링크, 버튼을 한 방향으로 정렬하므로 `Flexbox`를 사용합니다.

Projects는 행과 열로 카드를 배치하므로 `CSS Grid`를 사용합니다. `auto-fit + minmax`로 가용 폭에 맞춰 열 수를 조정하고, 미디어쿼리에서는 카드의 최소 폭을 바꿉니다. 이 선택 이유는 해당 CSS 선언 옆에도 짧게 적었습니다.

## 8. 상태 관리 패턴

### Theme

Theme Toggle Click  
→ `themeState` 변경  
→ `localStorage` 저장  
→ `renderTheme()`  
→ `data-theme` 변경

테마 전환은 각 요소의 색을 JavaScript로 직접 바꾸지 않습니다. CSS 색상 변수만 루트 테마에 따라 바뀌고, 배경과 글자색은 짧게 전환됩니다. `prefers-reduced-motion`에서는 전환 시간을 사실상 없앱니다.

### Projects

`fetchProjects()`  
→ `loading`  
→ GitHub API 요청  
→ `success / empty / error`  
→ 언어 버튼 생성

`언어 필터 버튼 click`  
→ `selectedLanguage` 변경  
→ `repositories.filter()`  
→ `renderProjects()`

### Form

`input`  
→ `formState.values`  
→ validation  
→ `formState.errors`  
→ render (`renderErrors()`)

폼은 입력값과 오류를 따로 관리하고, 성공 후에는 DOM 입력값과 상태를 함께 초기화합니다. 핵심 상태 변경과 렌더링 지점에는 흐름을 설명하는 짧은 주석을 남겼습니다. 개발 중 상태 확인은 DevTools에서 할 수 있으며, 상시 상태 로깅은 넣지 않았습니다.

## 9. JavaScript 학습 요소

구현에서 사용된 핵심 문법/기법:

- `querySelector`
- `querySelectorAll`
- `addEventListener`
- `classList`
- `textContent`
- `innerHTML`
- arrow function
- destructuring
- template literal
- `map`
- `forEach`
- `fetch`
- `async/await`
- `try/catch`

이벤트는 각 기능 파일에서 `addEventListener`로 직접 등록합니다. 요소 수가 적어 공통 이벤트 바인더보다 기능의 시작점이 드러나는 구성을 택했습니다. 실제 중복이 늘어날 때 공통 유틸로 추출할 수 있습니다.

## 10. Interaction 기준값

- Header background 변경: `60px`
- Scroll Top button 표시: `300px`
- IntersectionObserver threshold: `0.2`
- Breakpoints: `768px`, `1024px`

모바일을 기본으로 작성하고 768px·1024px에서 레이아웃을 확장합니다. 각 미디어쿼리에는 변경 내용을 주석으로 적었습니다.

| 화면 폭 | 수동으로 확인할 동작 |
| --- | --- |
| 375px | 메뉴 버튼 표시, 카드와 폼의 한 열 배치 |
| 768px | 메뉴 버튼 숨김, 가로 내비게이션, About 2열 |
| 1024px | 넓어진 섹션 여백과 카드 최소 폭 |
| 1440px | 컨테이너 최대 폭과 카드 열 배치 |

모든 폭에서 가로 스크롤, 이미지 넘침, CTA 겹침도 확인합니다. 메뉴 버튼은 `Enter`/`Space`로 조작하고, 열린 메뉴에서 `Escape`를 누르면 메뉴를 닫고 버튼으로 포커스를 돌립니다. `aria-expanded`와 `aria-label`은 메뉴의 열림 상태에 맞춰 갱신합니다.

## 11. GitHub API

요청 URL:
`https://api.github.com/users/SSUNOWL/repos`

적용 내용:

- `fetch` + `async/await`로 데이터 요청 처리
- `try/catch`로 성공/실패 흐름 분리
- 상태 분기:
  - loading
  - success
  - empty
  - error
- 실패 시 `Retry` 버튼으로 재시도 가능
- 인증 토큰은 클라이언트-side에 저장하지 않음
- 미인증 요청의 GitHub rate limit 대응:
  - `403`/`429`에서 메시지 안내

`403`/`429` 응답에서는 요청 한도 가능성을 알립니다. 한도가 풀리기 전에 반복 요청하지 않도록 자동 재시도 대신 사용자가 기다렸다가 누르는 `다시 시도` 버튼을 제공합니다. 자동 재시도를 추가한다면 횟수 상한, 점진적 대기, 서버의 재시도 안내를 함께 고려해야 합니다.

현재는 최신 저장소 최대 12개를 가져오므로 `filter`와 `map`으로 목록을 처리합니다. 전체 저장소를 보여줄 때는 API 페이지네이션이 필요하며, 많은 카드를 동시에 표시할 때 가상화를 검토할 수 있습니다. 자동 백오프, 페이지네이션, 가상화는 현재 구현 범위에 포함하지 않습니다.

## 12. Form Validation

- name required
- email required
- email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- message required
- input 실시간 검증
- submit `preventDefault`
- field error UI
- success UI

현재 제출은 **client-side validation demo**이며 실제 이메일 전송 기능은 포함하지 않습니다.
(Formspree, EmailJS, 서버 전송 로직 없음)

실제 전송을 추가한다면 입력 검증 이후 `loading` 상태로 중복 제출을 막고, 서버 응답에 따라 성공 또는 오류를 표시해야 합니다. 서버에서도 입력을 다시 검증해야 합니다.

오류가 있으면 문구, `.is-invalid`, `aria-invalid`를 함께 갱신하고 첫 오류 필드에 포커스를 줍니다. 성공 문구는 실제 전송이 아닌 입력 검증 성공을 뜻합니다.

## 13. 실행 방법

1. repository를 열기 (클론이 필요할 경우 로컬에 복사)
2. VS Code로 프로젝트 폴더 열기
3. `index.html`을 열고
4. `Open with Live Server` 실행

빌드 과정은 없습니다.

## 14. GitHub Pages 배포 방법

1. GitHub Repository
2. Settings
3. Pages
4. Build and deployment
5. Source: Deploy from a branch
6. Branch: `main`
7. Folder: `/(root)`
8. Save

이 프로젝트는 정적 웹사이트이므로 별도 build action은 필요 없습니다.

## 15. Deployment URL

현재 환경의 Git origin은 아래와 같아, 실제 배포 URL은 아래와 같이 확인됩니다.

`https://SSUNOWL.github.io/codyssey-week1-intro-portfolio/`

## 16. Screenshots
### Desktop

![Desktop Screenshot](./images/screenshot-desktop.png)

### Mobile

![Mobile Screenshot](./images/screenshot-mobile.png)

### Dark Mode

![Dark Mode Screenshot](./images/screenshot-dark.png)


## 17. 배운 점

- Semantic HTML 구조를 통해 접근성과 유지보수성을 높이는 방법
- Flexbox와 Grid의 역할 분리를 통해 네비게이션/카드 레이아웃 구성
- DOM selection과 이벤트 등록 흐름 정리
- State → Render 패턴으로 UI 갱신 분리
- Async API 처리(요청 상태, 예외 처리, 재시도) 경험

## 완료 상태

- 과제 요구사항, 필수 기능, 보너스 기능, README 문서가 완료되었습니다.
- README의 배포 URL 및 스크린샷 링크 정합성을 맞췄습니다.
