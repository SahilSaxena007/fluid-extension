(function (root) {
  const PANEL_IDS = [
    "panel-sidebar-left",
    "panel-inbox",
    "panel-reading-pane",
    "panel-search",
    "panel-compose",
    "panel-sidebar-right"
  ];

  const PANEL_SELECTORS = Object.freeze({
    "panel-sidebar-left": [
      'nav[aria-label="Main Menu"]',
      'nav[aria-label*="Main"]',
      '[role="navigation"][aria-label*="Main"]',
      '.GB',
      'div[gh="tl"]'
    ],
    "panel-inbox": [
      'div[role="main"] [role="grid"]',
      'div[role="main"] table[role="grid"]',
      'div[role="main"] .AO',
      '.AO',
      '[role="main"] > div:nth-child(2)'
    ],
    "panel-reading-pane": [
      'div[role="main"] [role="main"]',
      'div[role="main"] .Bs',
      '.nH .if',
      '.if',
      '[role="main"] .aia'
    ],
    "panel-search": [
      'header[role="banner"] form[role="search"]',
      'header[role="banner"]',
      'form[role="search"]',
      '[aria-label="Search mail"]',
      '.gb_Fd'
    ],
    "panel-compose": [
      '[gh="cm"]',
      '[role="button"][gh="cm"]',
      '.T-I.J-J5-Ji.T-I-KE',
      '[aria-label^="Compose"]',
      'div[role="button"][data-tooltip*="Compose"]'
    ],
    "panel-sidebar-right": [
      '[role="complementary"]',
      '[aria-label*="Side panel"]',
      '.bq9',
      '.brC-brG',
      'div[style*="right: 0"]'
    ]
  });

  const PRESETS = Object.freeze({
    "task-first": {
      id: "task-first",
      name: "Task First",
      panels: {
        "panel-sidebar-left": { position: "fixed", top: "72px", left: "0", width: "280px", height: "calc(100vh - 72px)", zIndex: 20 },
        "panel-inbox": { position: "fixed", top: "72px", left: "280px", right: "220px", height: "52vh", zIndex: 10 },
        "panel-reading-pane": { position: "fixed", left: "280px", right: "220px", bottom: "0", height: "calc(48vh - 72px)", zIndex: 10 },
        "panel-search": { position: "sticky", top: "0", zIndex: 50 },
        "panel-compose": { position: "fixed", right: "244px", bottom: "24px", zIndex: 80 },
        "panel-sidebar-right": { position: "fixed", top: "72px", right: "0", width: "220px", height: "calc(100vh - 72px)", zIndex: 25 }
      }
    },
    executive: {
      id: "executive",
      name: "Executive",
      panels: {
        "panel-sidebar-left": { position: "fixed", top: "112px", left: "0", width: "220px", height: "calc(100vh - 112px)", zIndex: 20 },
        "panel-inbox": { position: "fixed", top: "112px", left: "220px", right: "56px", height: "42vh", zIndex: 10 },
        "panel-reading-pane": { position: "fixed", left: "220px", right: "56px", bottom: "0", height: "calc(58vh - 112px)", zIndex: 10 },
        "panel-search": { position: "sticky", top: "0", zIndex: 50 },
        "panel-compose": { position: "fixed", right: "80px", bottom: "24px", zIndex: 80 },
        "panel-sidebar-right": { position: "fixed", top: "112px", right: "0", width: "56px", height: "calc(100vh - 112px)", zIndex: 25 }
      },
      summary: true
    },
    focus: {
      id: "focus",
      name: "Focus Mode",
      panels: {
        "panel-sidebar-left": { position: "fixed", top: "64px", left: "0", width: "48px", height: "calc(100vh - 64px)", overflow: "hidden", zIndex: 20 },
        "panel-inbox": { position: "fixed", top: "64px", left: "48px", right: "0", height: "50vh", zIndex: 10 },
        "panel-reading-pane": { position: "fixed", left: "48px", right: "0", bottom: "0", height: "calc(50vh - 64px)", zIndex: 10 },
        "panel-search": { opacity: "0.38", transition: "opacity 300ms ease", zIndex: 50 },
        "panel-compose": { position: "fixed", right: "24px", bottom: "24px", zIndex: 80 },
        "panel-sidebar-right": { width: "0", opacity: "0", overflow: "hidden", pointerEvents: "none", zIndex: 1 }
      },
      extraCss: '[data-fluid-panel="panel-search"]:hover { opacity: 1 !important; }'
    },
    checklist: {
      id: "checklist",
      name: "Checklist",
      panels: {
        "panel-sidebar-left": { position: "fixed", top: "64px", left: "0", width: "180px", height: "calc(100vh - 64px)", zIndex: 20 },
        "panel-inbox": { position: "fixed", top: "64px", left: "180px", right: "0", bottom: "0", zIndex: 10 },
        "panel-reading-pane": { position: "fixed", top: "96px", right: "32px", width: "min(720px, calc(100vw - 240px))", height: "calc(100vh - 128px)", zIndex: 70, boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)" },
        "panel-search": { position: "sticky", top: "0", zIndex: 50 },
        "panel-compose": { position: "fixed", right: "24px", bottom: "24px", zIndex: 80 },
        "panel-sidebar-right": { width: "48px", overflow: "hidden", zIndex: 20 }
      },
      checklist: true
    }
  });

  let activeLayoutId = null;
  let activeCustomPositions = null;

  /** Removes Fluid preset decoration nodes and classes. */
  function clearDecorations() {
    if (!root.document) {
      return;
    }

    root.document.querySelector(".fluid-summary-bar")?.remove();
    root.document.querySelectorAll(".fluid-checklist-checkbox").forEach((checkbox) => checkbox.remove());
    root.document.querySelectorAll(".fluid-checklist-row").forEach((row) => row.classList.remove("fluid-checklist-row"));
  }

  /** Adds a summary bar for the Executive preset. */
  function injectSummaryBar() {
    if (!root.document || root.document.querySelector(".fluid-summary-bar")) {
      return;
    }

    const unreadRows = root.document.querySelectorAll("tr.zA.zE, [role='row'].zE").length;
    const totalRows = root.document.querySelectorAll("tr.zA, [role='row']").length;
    const summary = root.document.createElement("div");
    summary.className = "fluid-summary-bar";
    summary.textContent = `${unreadRows} unread / ${totalRows} visible`;
    root.document.body.prepend(summary);
  }

  /** Adds checklist controls to visible inbox rows. */
  function injectChecklistRows() {
    if (!root.document) {
      return;
    }

    root.document.querySelectorAll("tr.zA, [role='row']").forEach((row) => {
      if (row.querySelector(".fluid-checklist-checkbox")) {
        return;
      }

      row.classList.add("fluid-checklist-row");
      const checkbox = root.document.createElement("input");
      checkbox.className = "fluid-checklist-checkbox";
      checkbox.type = "checkbox";
      checkbox.setAttribute("aria-label", "Mark email as done");
      row.prepend(checkbox);
    });
  }

  /** Applies any DOM decoration needed for a preset. */
  function decoratePreset(layoutId) {
    clearDecorations();

    if (layoutId === "executive") {
      injectSummaryBar();
    }

    if (layoutId === "checklist") {
      injectChecklistRows();
    }
  }

  /** Returns the selector chain for a panel id. */
  function getPanelSelectorChain(panelId) {
    return PANEL_SELECTORS[panelId] ? [...PANEL_SELECTORS[panelId]] : [];
  }

  /** Queries the document for the first selector that resolves. */
  function queryFirst(selectors, doc) {
    const targetDocument = doc || root.document;

    if (!targetDocument) {
      return null;
    }

    for (const selector of selectors) {
      try {
        const element = targetDocument.querySelector(selector);

        if (element) {
          return { element, selector };
        }
      } catch (error) {
        console.warn("[Fluid] Invalid selector skipped", selector, error);
      }
    }

    return null;
  }

  /** Converts camelCase style keys to kebab-case CSS property names. */
  function toCssProperty(property) {
    return property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  /** Converts a panel style object to a CSS declaration block. */
  function declarationsToCss(declarations) {
    return Object.entries(declarations)
      .map(([property, value]) => `  ${toCssProperty(property)}: ${value} !important;`)
      .join("\n");
  }

  /** Adds data attributes to found panel elements for stable CSS targeting. */
  function markPanels(panels) {
    Object.entries(panels).forEach(([panelId, element]) => {
      if (element) {
        element.dataset.fluidPanel = panelId;
      }
    });
  }

  /** Creates or updates Fluid's layout style tag. */
  function injectLayoutStyles(css) {
    let tag = root.document && root.document.getElementById("fluid-layout-styles");

    if (!tag && root.document) {
      tag = root.document.createElement("style");
      tag.id = "fluid-layout-styles";
      root.document.head.appendChild(tag);
    }

    if (tag) {
      tag.textContent = css;
    }

    return tag;
  }

  /** Generates CSS for a preset layout id. */
  function generateCSS(layoutId) {
    const preset = PRESETS[layoutId];

    if (!preset) {
      return "";
    }

    const panelCss = Object.entries(preset.panels).map(([panelId, declarations]) => {
      return `[data-fluid-panel="${panelId}"] {\n${declarationsToCss({
        ...declarations,
        transition: declarations.transition || "all 300ms ease"
      })}\n}`;
    });

    const baseCss = [
      "body.fluid-layout-active [data-fluid-panel] {",
      "  box-sizing: border-box !important;",
      "}",
      ...panelCss
    ];

    if (preset.extraCss) {
      baseCss.push(preset.extraCss);
    }

    return baseCss.join("\n\n");
  }

  /** Finds a Gmail panel by Fluid panel id. */
  function findPanel(panelId, doc) {
    const selectors = getPanelSelectorChain(panelId);
    const match = queryFirst(selectors, doc);

    if (match) {
      console.info(`[Fluid] Found panel: ${panelId} via ${match.selector}`);
      return match.element;
    }

    console.warn(`[Fluid] Could not find panel: ${panelId}`);
    return null;
  }

  /** Finds every Gmail panel known to Fluid. */
  function findAllPanels(doc) {
    return PANEL_IDS.reduce((panels, panelId) => {
      panels[panelId] = findPanel(panelId, doc);
      return panels;
    }, {});
  }

  /** Applies a preset layout by id. */
  function apply(layoutId) {
    const panels = findAllPanels();
    const css = generateCSS(layoutId);

    if (!css) {
      console.warn(`[Fluid] Unknown layout: ${layoutId}`);
      return false;
    }

    markPanels(panels);
    injectLayoutStyles(css);
    decoratePreset(layoutId);
    activeLayoutId = layoutId;
    activeCustomPositions = null;

    if (root.document && root.document.body) {
      root.document.body.classList.add("fluid-layout-active", `fluid-layout-${layoutId}`);
    }

    return true;
  }

  /** Applies saved custom panel positions. */
  function applyCustom(positions) {
    const panels = findAllPanels();
    markPanels(panels);

    const css = Object.entries(positions || {}).map(([panelId, position]) => {
      return `[data-fluid-panel="${panelId}"] {\n${declarationsToCss({
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        zIndex: 60,
        transition: "all 300ms ease"
      })}\n}`;
    }).join("\n\n");

    injectLayoutStyles(css);
    activeCustomPositions = positions || null;

    if (root.document && root.document.body) {
      root.document.body.classList.add("fluid-layout-active", "fluid-layout-custom");
    }

    return true;
  }

  /** Re-applies the current active layout. */
  function reapply() {
    if (activeCustomPositions) {
      return applyCustom(activeCustomPositions);
    }

    if (activeLayoutId) {
      return apply(activeLayoutId);
    }

    return false;
  }

  /** Clears Fluid layout overrides. */
  function reset() {
    injectLayoutStyles("");
    clearDecorations();
    activeLayoutId = null;
    activeCustomPositions = null;

    if (root.document && root.document.body) {
      root.document.body.classList.remove(
        "fluid-layout-active",
        "fluid-layout-custom",
        ...Object.keys(PRESETS).map((layoutId) => `fluid-layout-${layoutId}`)
      );
    }

    return true;
  }

  /** Returns whether Fluid has an active layout. */
  function hasActiveLayout() {
    return Boolean(activeLayoutId || activeCustomPositions);
  }

  const api = {
    PANEL_IDS,
    PANEL_SELECTORS,
    PRESETS,
    getPanelSelectorChain,
    queryFirst,
    toCssProperty,
    declarationsToCss,
    injectLayoutStyles,
    generateCSS,
    findPanel,
    findAllPanels,
    apply,
    applyCustom,
    reapply,
    reset,
    hasActiveLayout
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (root.window) {
    root.window.fluidLayoutEngine = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this));
