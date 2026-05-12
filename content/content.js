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

  window.fluidStorage = {
    STORAGE_KEYS,
    saveLayout,
    loadLayout,
    saveCustomPositions,
    loadCustomPositions
  };
}());
