const STORAGE_KEYS = Object.freeze({
  activeLayout: "fluid_active_layout",
  customPositions: "fluid_custom_positions"
});

/** Returns the chrome.storage.local payload for an active layout id. */
function formatLayoutPayload(layoutId) {
  return { [STORAGE_KEYS.activeLayout]: layoutId || null };
}

/** Returns the chrome.storage.local payload for custom panel positions. */
function formatCustomPositionsPayload(positions) {
  return { [STORAGE_KEYS.customPositions]: positions || null };
}

/** Returns whether a value is a valid custom positions object. */
function isCustomPositionsShape(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((position) => {
    return position
      && typeof position === "object"
      && ["x", "y", "width", "height"].every((key) => Number.isFinite(position[key]));
  });
}

module.exports = {
  STORAGE_KEYS,
  formatLayoutPayload,
  formatCustomPositionsPayload,
  isCustomPositionsShape
};
