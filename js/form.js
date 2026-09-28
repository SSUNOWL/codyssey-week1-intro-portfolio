// 입력값(values)과 오류(errors)를 분리해 입력 이벤트마다 화면을 다시 그린다.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formState = {
  values: {
    name: '',
    email: '',
    message: '',
  },
  errors: {
    name: '',
    email: '',
    message: '',
  },
};

const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');
const messageError = document.querySelector('#message-error');
const formStatus = document.querySelector('#form-status');
const formInputs = document.querySelectorAll('#name, #email, #message');

const fieldStateMap = {
  name: {
    input: nameInput,
    errorElement: nameError,
  },
  email: {
    input: emailInput,
    errorElement: emailError,
  },
  message: {
    input: messageInput,
    errorElement: messageError,
  },
};

const validateField = (fieldName, value) => {
  const valueTrimmed = value.trim();

  if (fieldName === 'name') {
    return valueTrimmed ? '' : '이름을 입력해주세요.';
  }

  if (fieldName === 'email') {
    if (!valueTrimmed) {
      return '이메일을 입력해주세요.';
    }
    return EMAIL_PATTERN.test(valueTrimmed) ? '' : '올바른 이메일 형식을 입력해주세요.';
  }

  if (fieldName === 'message') {
    return valueTrimmed ? '' : '메시지를 입력해주세요.';
  }

  return '';
};

const setFieldError = (fieldName, message) => {
  // 오류 문구, 시각적 테두리, aria-invalid를 같은 결과로 동기화한다.
  const state = fieldStateMap[fieldName];
  if (!state?.input || !state?.errorElement) return;

  state.errorElement.textContent = message;
  if (message) {
    state.input.classList.add('is-invalid');
    state.input.setAttribute('aria-invalid', 'true');
  } else {
    state.input.classList.remove('is-invalid');
    state.input.setAttribute('aria-invalid', 'false');
  }
};

const renderErrors = () => {
  Object.keys(formState.errors).forEach((fieldName) => {
    setFieldError(fieldName, formState.errors[fieldName]);
  });
};

const validateAll = () => {
  let hasError = false;

  Object.keys(formState.values).forEach((fieldName) => {
    formState.errors[fieldName] = validateField(
      fieldName,
      formState.values[fieldName]
    );
    if (formState.errors[fieldName]) {
      hasError = true;
    }
  });

  return hasError;
};

const syncValuesAndValidateField = (fieldName, value) => {
  // 입력 -> values 갱신 -> 검증 -> errors 갱신 -> 오류 화면 렌더링.
  formState.values[fieldName] = value;
  formState.errors[fieldName] = validateField(fieldName, value);
  renderErrors();
};

const syncFormStateFromDOM = () => {
  if (nameInput) {
    formState.values.name = nameInput.value;
  }
  if (emailInput) {
    formState.values.email = emailInput.value;
  }
  if (messageInput) {
    formState.values.message = messageInput.value;
  }
};

const resetFormState = () => {
  // 폼을 지울 때 state도 같이 비워 DOM과 값이 어긋나지 않게 한다.
  formState.values = {
    name: '',
    email: '',
    message: '',
  };
  formState.errors = {
    name: '',
    email: '',
    message: '',
  };
};

const resetFormUI = () => {
  if (!contactForm) return;

  contactForm.reset();
  Object.keys(fieldStateMap).forEach((fieldName) => {
    setFieldError(fieldName, '');
  });
};

const handleFieldInput = (fieldName) => (event) => {
  const value = event.target?.value ?? '';
  syncValuesAndValidateField(fieldName, value);
};

const handleSubmit = (event) => {
  // 실제 서버 전송이 없는 검증 데모이므로 브라우저의 기본 제출을 막는다.
  event.preventDefault();

  syncFormStateFromDOM();
  const hasError = validateAll();
  renderErrors();

  if (hasError) {
    if (formStatus) {
      formStatus.textContent = '입력 내용을 확인해주세요.';
    }

    const firstInvalidField = Object.keys(formState.errors).find(
      (fieldName) => formState.errors[fieldName]
    );
    const firstInvalidInput = firstInvalidField
      ? fieldStateMap[firstInvalidField]?.input
      : null;
    if (firstInvalidInput && typeof firstInvalidInput.focus === 'function') {
      firstInvalidInput.focus();
    }
    return;
  }

  if (formStatus) {
    formStatus.textContent = '메시지가 정상적으로 작성되었습니다.';
  }

  resetFormState();
  resetFormUI();
};

formInputs.forEach((input) => {
  if (!input) return;
  input.addEventListener('input', handleFieldInput(input.id));
});

if (contactForm) {
  contactForm.addEventListener('submit', handleSubmit);
}
