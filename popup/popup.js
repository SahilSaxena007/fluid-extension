(function () {
  const LAYOUT_LABELS = Object.freeze({
    "task-first": "Task First",
    executive: "Executive",
    focus: "Focus Mode",
    checklist: "Checklist"
  });

  /** Returns the active Chrome tab. */
  async function getActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  }

  /** Sends a message to the active Gmail content script. */
  async function sendToActiveTab(message) {
    const tab = await getActiveTab();

    if (!tab || !tab.id) {
      return { ok: false, error: "No active tab" };
    }

    try {
      return await chrome.tabs.sendMessage(tab.id, message);
    } catch (error) {
      console.warn("[Fluid] Popup message failed", error);
      return { ok: false, error: String(error) };
    }
  }

  /** Updates the highlighted preset card. */
  function setActiveLayout(layoutId) {
    document.querySelectorAll(".fluid-preset-card").forEach((card) => {
      card.classList.toggle("fluid-active", card.dataset.layout === layoutId);
    });

    document.querySelector(".fluid-current-layout").textContent = LAYOUT_LABELS[layoutId] || "Default";
  }

  /** Binds preset card click handlers. */
  function bindPresetCards() {
    document.querySelectorAll(".fluid-preset-card").forEach((card) => {
      card.addEventListener("click", async () => {
        const layoutId = card.dataset.layout;
        const response = await sendToActiveTab({ action: "applyLayout", layoutId });

        if (response && response.ok) {
          setActiveLayout(layoutId);
        }
      });
    });
  }

  /** Binds edit and reset controls. */
  function bindControls() {
    document.querySelector(".fluid-customise-btn").addEventListener("click", async () => {
      await sendToActiveTab({ action: "enterEditMode" });
      window.close();
    });

    document.querySelector(".fluid-reset-btn").addEventListener("click", async () => {
      const response = await sendToActiveTab({ action: "reset" });

      if (response && response.ok) {
        setActiveLayout(null);
      }
    });
  }

  /** Initializes the static popup shell. */
  async function initPopup() {
    document.documentElement.classList.add("fluid-popup-ready");
    bindPresetCards();
    bindControls();

    const response = await sendToActiveTab({ action: "getActiveLayout" });
    setActiveLayout(response && response.layoutId);
  }

  document.addEventListener("DOMContentLoaded", initPopup);
}());
