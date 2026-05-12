(function () {
  const STORAGE_KEYS = Object.freeze({
    activeLayout: "fluid_active_layout",
    customPositions: "fluid_custom_positions"
  });

  /** Reads a key from chrome.storage.local with graceful error handling. */
  async function readStorageKey(key, fallbackValue) {
    try {
      const result = await chrome.storage.local.get(key);
      return Object.prototype.hasOwnProperty.call(result, key) ? result[key] : fallbackValue;
    } catch (error) {
      console.warn("[Fluid] Storage read failed", error);
      return fallbackValue;
    }
  }

  /** Writes values to chrome.storage.local with graceful error handling. */
  async function writeStorageValues(values) {
    try {
      await chrome.storage.local.set(values);
      return true;
    } catch (error) {
      console.warn("[Fluid] Storage write failed", error);
      return false;
    }
  }

  /** Saves the active layout id. */
  async function saveLayout(layoutId) {
    return writeStorageValues({ [STORAGE_KEYS.activeLayout]: layoutId || null });
  }

  /** Loads the active layout id. */
  async function loadLayout() {
    return readStorageKey(STORAGE_KEYS.activeLayout, null);
  }

  /** Saves custom panel positions. */
  async function saveCustomPositions(positions) {
    return writeStorageValues({ [STORAGE_KEYS.customPositions]: positions || null });
  }

  /** Loads custom panel positions. */
  async function loadCustomPositions() {
    return readStorageKey(STORAGE_KEYS.customPositions, null);
  }

  let observer = null;
  let reapplyTimer = null;
  let isReapplying = false;

  /** Debounces a function by the provided delay. */
  function debounce(callback, delay) {
    return function debouncedCallback() {
      window.clearTimeout(reapplyTimer);
      reapplyTimer = window.setTimeout(callback, delay);
    };
  }

  /** Applies the saved Fluid layout state from storage. */
  async function applySavedLayout() {
    const [layoutId, customPositions] = await Promise.all([
      loadLayout(),
      loadCustomPositions()
    ]);

    if (customPositions && window.fluidLayoutEngine) {
      window.fluidLayoutEngine.applyCustom(customPositions);
      return;
    }

    if (layoutId && window.fluidLayoutEngine) {
      window.fluidLayoutEngine.apply(layoutId);
    }
  }

  /** Re-applies the active layout after Gmail SPA mutations. */
  function reapplyAfterMutation() {
    if (isReapplying || !window.fluidLayoutEngine || !window.fluidLayoutEngine.hasActiveLayout()) {
      return;
    }

    isReapplying = true;
    window.fluidLayoutEngine.reapply();
    window.setTimeout(() => {
      isReapplying = false;
    }, 0);
  }

  /** Starts watching Gmail DOM mutations. */
  function startObserver() {
    if (observer || !document.body) {
      return;
    }

    observer = new MutationObserver(debounce(reapplyAfterMutation, 300));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /** Handles popup messages. */
  function handleMessage(message, sender, sendResponse) {
    void sender;

    (async () => {
      if (message.action === "getActiveLayout") {
        sendResponse({ layoutId: await loadLayout() });
        return;
      }

      if (message.action === "applyLayout") {
        const applied = window.fluidLayoutEngine.apply(message.layoutId);
        await saveLayout(message.layoutId);
        await saveCustomPositions(null);
        sendResponse({ ok: applied });
        return;
      }

      if (message.action === "enterEditMode") {
        const activated = window.fluidDragEditor.activate();
        sendResponse({ ok: activated });
        return;
      }

      if (message.action === "reset") {
        const reset = window.fluidLayoutEngine.reset();
        await saveLayout(null);
        await saveCustomPositions(null);
        sendResponse({ ok: reset });
        return;
      }

      sendResponse({ ok: false, error: "Unknown action" });
    })();

    return true;
  }

  /** Initializes Fluid on Gmail. */
  async function initFluid() {
    await applySavedLayout();
    startObserver();
  }

  window.fluidStorage = {
    STORAGE_KEYS,
    saveLayout,
    loadLayout,
    saveCustomPositions,
    loadCustomPositions
  };

  window.fluidContent = {
    applySavedLayout,
    startObserver,
    reapplyAfterMutation,
    get isReapplying() {
      return isReapplying;
    }
  };

  chrome.runtime.onMessage.addListener(handleMessage);

  void initFluid();
}());
