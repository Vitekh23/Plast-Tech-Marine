const headerEl = document.getElementById("header");

window.addEventListener("scroll", function () {
  const scrollPos = window.scrollY;

  if (scrollPos > 90) {
    headerEl.classList.add("header_mini");
  } else {
    headerEl.classList.remove("header_mini");
  }
});

class LanguagePopover {
  constructor() {
    this.trigger = document.querySelector("[data-popover-trigger]");
    this.popover = document.querySelector("[data-popover]");
    this.headerBack = this.popover.querySelector(".language-popover__header");
    this.init();
  }

  init() {
    this.trigger.addEventListener("click", (e) => this.openPopover(e));
    this.headerBack.addEventListener("click", () => this.closePopover());

    document.addEventListener("click", (e) => this.closeOnOutsideClick(e));
    document.addEventListener("keydown", (e) => this.closeOnEscape(e));

    document.querySelectorAll(".language-option").forEach((option) => {
      option.addEventListener("click", (e) => this.selectLanguage(e));
    });
  }

  openPopover(e) {
    e.stopPropagation();
    this.trigger.classList.add("hidden");
    this.popover.classList.add("active");
  }

  closePopover() {
    this.popover.classList.remove("active");
    this.trigger.classList.remove("hidden");
  }

  closeOnOutsideClick(e) {
    if (!e.target.closest("[data-popover]") && !e.target.closest("[data-popover-trigger]")) {
      this.closePopover();
    }
  }

  closeOnEscape(e) {
    if (e.key === "Escape") {
      this.closePopover();
    }
  }

  selectLanguage(e) {
    const option = e.currentTarget;
    const lang = option.getAttribute("data-lang");

    document.querySelectorAll(".language-option").forEach((opt) =>
      opt.classList.remove("language-option--active")
    );
    option.classList.add("language-option--active");

    this.trigger.querySelector(".header__button__lang").textContent = lang.toUpperCase();
    document.querySelector(".language-popover__current").textContent = lang.toUpperCase();

    this.closePopover();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LanguagePopover();
});
