(function (root) {
  const HANDLE_CLASS = "fluid-drag-handle";
  const OVERLAY_CLASS = "fluid-edit-overlay";
  const TOOLBAR_CLASS = "fluid-edit-toolbar";
  const positions = {};
  let active = false;

  /** Snaps a number to a grid size. */
  function snapValue(value, gridSize) {
    return Math.round(value / gridSize) * gridSize;
  }

  /** Returns the current 12-column grid size for snapping. */
  function getGridSize() {
    return Math.max(10, Math.round(root.innerWidth / 12));
  }

  /** Records a panel's current viewport position. */
  function recordPanelPosition(panelId, element) {
    const rect = element.getBoundingClientRect();
    positions[panelId] = {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }

  /** Adds a dark overlay behind editable panels. */
  function addOverlay() {
    const overlay = root.document.createElement("div");
    overlay.className = OVERLAY_CLASS;
    root.document.body.appendChild(overlay);
  }

  /** Adds the edit-mode floating toolbar. */
  function addToolbar() {
    const toolbar = root.document.createElement("div");
    toolbar.className = TOOLBAR_CLASS;
    toolbar.innerHTML = '<button class="fluid-save-btn" type="button">Save Layout</button><button class="fluid-cancel-btn" type="button">Cancel</button>';
    toolbar.querySelector(".fluid-save-btn").addEventListener("click", () => deactivate(true));
    toolbar.querySelector(".fluid-cancel-btn").addEventListener("click", () => deactivate(false));
    root.document.body.appendChild(toolbar);
  }

  /** Handles live drag movement for a Fluid panel. */
  function onDragMove(event) {
    const panel = event.target.closest("[data-fluid-panel]");
    const panelId = panel.dataset.fluidPanel;
    const current = positions[panelId] || {
      x: panel.getBoundingClientRect().left,
      y: panel.getBoundingClientRect().top,
      width: panel.getBoundingClientRect().width,
      height: panel.getBoundingClientRect().height
    };

    const gridSize = getGridSize();
    const nextX = snapValue(current.x + event.dx, 10);
    const nextY = snapValue(current.y + event.dy, 10);
    positions[panelId] = {
      ...current,
      x: snapValue(nextX, Math.min(gridSize, 120)),
      y: nextY
    };

    panel.style.transform = `translate(${positions[panelId].x - current.x}px, ${positions[panelId].y - current.y}px)`;
  }

  /** Records the final panel position after dragging. */
  function onDragEnd(event) {
    const panel = event.target.closest("[data-fluid-panel]");
    const panelId = panel.dataset.fluidPanel;
    const rect = panel.getBoundingClientRect();

    positions[panelId] = {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
    panel.style.transform = "";
  }

  /** Adds a drag handle to a panel element. */
  function addHandle(panelId, element) {
    element.dataset.fluidPanel = panelId;
    element.classList.add("fluid-edit-panel");
    recordPanelPosition(panelId, element);

    const handle = root.document.createElement("button");
    handle.className = HANDLE_CLASS;
    handle.type = "button";
    handle.setAttribute("aria-label", `Drag ${panelId}`);
    handle.textContent = "Move";
    element.appendChild(handle);

    if (root.interact) {
      root.interact(handle).draggable({
        listeners: {
          move: onDragMove,
          end: onDragEnd
        }
      });
    }
  }

  /** Activates Fluid edit mode. */
  function activate() {
    if (active || !root.document || !root.fluidLayoutEngine) {
      return false;
    }

    const panels = root.fluidLayoutEngine.findAllPanels();
    const foundPanels = Object.entries(panels).filter((entry) => entry[1]);

    if (!foundPanels.length) {
      return false;
    }

    active = true;
    root.document.body.classList.add("fluid-edit-mode");
    addOverlay();
    addToolbar();
    foundPanels.forEach(([panelId, element]) => addHandle(panelId, element));
    return true;
  }

  /** Deactivates Fluid edit mode. */
  async function deactivate(save) {
    if (!active || !root.document) {
      return false;
    }

    root.document.querySelectorAll(`.${HANDLE_CLASS}`).forEach((handle) => handle.remove());
    root.document.querySelectorAll(".fluid-edit-panel").forEach((panel) => panel.classList.remove("fluid-edit-panel"));
    root.document.querySelector(`.${OVERLAY_CLASS}`)?.remove();
    root.document.querySelector(`.${TOOLBAR_CLASS}`)?.remove();
    root.document.body.classList.remove("fluid-edit-mode");
    active = false;

    if (save) {
      await root.fluidStorage.saveCustomPositions({ ...positions });
      root.fluidLayoutEngine.applyCustom({ ...positions });
      return true;
    }

    root.fluidLayoutEngine.reset();
    const layoutId = await root.fluidStorage.loadLayout();
    if (layoutId) {
      root.fluidLayoutEngine.apply(layoutId);
    }
    return true;
  }

  const api = {
    snapValue,
    getGridSize,
    recordPanelPosition,
    onDragMove,
    onDragEnd,
    activate,
    deactivate
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (root.window) {
    root.window.fluidDragEditor = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this));
