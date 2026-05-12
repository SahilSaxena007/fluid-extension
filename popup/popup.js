(function () {
  /** Initializes the static popup shell. */
  function initPopup() {
    document.documentElement.classList.add("fluid-popup-ready");
  }

  document.addEventListener("DOMContentLoaded", initPopup);
}());
