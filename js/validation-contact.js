document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.querySelector(".phone-input");
  const emailInput = document.querySelector(".email-input");
  const nameInput = document.querySelector(".name-input");
  const messageTextarea = document.querySelector(".message-textarea");
  const modalButton = document.getElementById("modal-contacts-open");
  const privacyCheckbox = document.querySelector(".privacy-checkbox");
  const policyCheckbox = document.querySelector(".policy-checkbox");

  // Регулярные выражения для валидации
  const patterns = {
    phone: /^\+(?!0)[1-9]\d{7,14}$/, // +, НЕ 0, затем цифры от 1-9, и от 7 до 14 цифр
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    name: /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,50}$/,
    message: /^.{10,500}$/,
  };

  // Сообщения об ошибках
  const errorMessages = {
    phone: "Введите корректный номер телефона (например: +7 999 123-45-67)",
    email: "Введите корректный email адрес",
    name: "Имя должно содержать только буквы (2-50 символов)",
    message: "Сообщение должно содержать от 10 до 500 символов",
    required: "Это поле обязательно для заполнения",
    privacy: "Пожалуйста, согласитесь на обработку персональных данных",
    policy: "Пожалуйста, согласитесь с политикой конфиденциальности",
  };

  // Функция для форматирования номера телефона
  function formatPhoneNumber(phone) {
    // Удаляем все нецифровые символы
    let numbers = phone.replace(/\D/g, "");

    // Если первый символ 0 - удаляем его
    if (numbers.startsWith("0")) {
      numbers = numbers.slice(1);
    }

    // Ограничиваем длину до 15 цифр
    numbers = numbers.slice(0, 15);

    if (!numbers) return "";

    // Добавляем + в начало только если есть цифры
    return "+" + numbers;
  }

  // Функция для показа ошибки чекбокса
  function showCheckboxError(checkbox, message) {
    const checkboxLabel = checkbox.closest(".checkbox-label");
    const errorElement = checkboxLabel
      ? checkboxLabel.nextElementSibling
      : null;

    if (errorElement && errorElement.classList.contains("checkbox-error")) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }

    if (checkboxLabel) {
      checkboxLabel.classList.add("error");
    }
  }

  // Функция для скрытия ошибки чекбокса
  function hideCheckboxError(checkbox) {
    const checkboxLabel = checkbox.closest(".checkbox-label");
    const errorElement = checkboxLabel
      ? checkboxLabel.nextElementSibling
      : null;

    if (errorElement && errorElement.classList.contains("checkbox-error")) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }

    if (checkboxLabel) {
      checkboxLabel.classList.remove("error");
    }
  }

  // Функция валидации поля
  function validateField(input, pattern, errorMessage) {
    const value = input.value.trim();
    const errorElement = input.nextElementSibling;

    if (!value) {
      showError(input, errorMessages.required);
      return false;
    }

    if (!pattern.test(value)) {
      showError(input, errorMessage);
      return false;
    }

    hideError(input);
    return true;
  }

  // Показать ошибку
  function showError(input, message) {
    const errorElement = input.nextElementSibling;
    input.style.borderColor = "red";
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  // Скрыть ошибку
  function hideError(input) {
    const errorElement = input.nextElementSibling;
    input.style.borderColor = "";
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }

  // Основная функция валидации всей формы
  function validateForm() {
    let isValid = true;

    // Валидация всех полей
    const isNameValid = validateField(
      nameInput,
      patterns.name,
      errorMessages.name
    );
    const isEmailValid = validateField(
      emailInput,
      patterns.email,
      errorMessages.email
    );
    const isPhoneValid = validateField(
      phoneInput,
      patterns.phone,
      errorMessages.phone
    );
    const isMessageValid = validateField(
      messageTextarea,
      patterns.message,
      errorMessages.message
    );

    // Проверка чекбоксов
    hideCheckboxError(privacyCheckbox);
    hideCheckboxError(policyCheckbox);

    if (!privacyCheckbox.checked) {
      showCheckboxError(privacyCheckbox, errorMessages.privacy);
      isValid = false;
    }

    if (!policyCheckbox.checked) {
      showCheckboxError(policyCheckbox, errorMessages.policy);
      isValid = false;
    }

    // Если какое-то поле не валидно, форма не проходит проверку
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
      isValid = false;
    }

    return isValid;
  }

  // Обработчик для поля телефона
  phoneInput.addEventListener("input", function (e) {
    // Сохраняем позицию курсора и значение
    const cursorPosition = e.target.selectionStart;
    const originalValue = this.value;

    // Форматируем номер
    this.value = formatPhoneNumber(this.value);

    // Восстанавливаем позицию курсора
    let newCursorPosition = cursorPosition;
    if (originalValue.length > this.value.length) {
      newCursorPosition = Math.max(
        0,
        cursorPosition - (originalValue.length - this.value.length)
      );
    } else {
      newCursorPosition =
        cursorPosition + (this.value.length - originalValue.length);
    }

    this.setSelectionRange(newCursorPosition, newCursorPosition);
    validateField(this, patterns.phone, errorMessages.phone);
  });

  // Обработчик для backspace/delete
  phoneInput.addEventListener("keydown", function (e) {
    if (e.key === "Backspace" || e.key === "Delete") {
      setTimeout(() => {
        this.value = formatPhoneNumber(this.value);
        validateField(this, patterns.phone, errorMessages.phone);
      }, 0);
    }
  });

  // Запрещаем ввод нецифровых символов в поле телефона
  phoneInput.addEventListener("keydown", function (e) {
    if (
      [46, 8, 9, 27, 13].includes(e.keyCode) ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }

    if (
      (e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  });

  // Скрываем ошибки чекбоксов при их активации
  privacyCheckbox.addEventListener("change", function () {
    if (this.checked) {
      hideCheckboxError(this);
    }
  });

  policyCheckbox.addEventListener("change", function () {
    if (this.checked) {
      hideCheckboxError(this);
    }
  });

  // Валидация других полей
  emailInput.addEventListener("blur", function () {
    validateField(this, patterns.email, errorMessages.email);
  });

  nameInput.addEventListener("blur", function () {
    validateField(this, patterns.name, errorMessages.name);
  });

  messageTextarea.addEventListener("blur", function () {
    validateField(this, patterns.message, errorMessages.message);
  });

  // Убираем ошибку при начале ввода
  const inputs = document.querySelectorAll(
    ".form-group input, .form-group textarea"
  );
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value.trim()) {
        hideError(this);
      }
    });
  });

  // Обработчик для кнопки модального окна
  modalButton.onclick = null;
  modalButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (validateForm()) {
      document.getElementById("success_send_modal").classList.add("show");
    }
  });

  // Код для закрытия модального окна
  document
    .getElementById("modal-contacts-close")
    .addEventListener("click", function () {
      document.getElementById("success_send_modal").classList.remove("show");
    });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("success_send_modal").classList.remove("show");
    }
  });

  document
    .querySelector("#success_send_modal .modal")
    .addEventListener("click", (event) => {
      event._isClickWithInModal = true;
    });

  document
    .getElementById("success_send_modal")
    .addEventListener("click", (event) => {
      if (event._isClickWithInModal) return;
      event.currentTarget.classList.remove("show");
    });
});
