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
  function apply() {
    return false;
  }

  /** Applies saved custom panel positions. */
  function applyCustom() {
    return false;
  }

  /** Re-applies the current active layout. */
  function reapply() {
    return false;
  }

  /** Clears Fluid layout overrides. */
  function reset() {
    return false;
  }

  /** Returns whether Fluid has an active layout. */
  function hasActiveLayout() {
    return false;
  }

  const api = {
    PANEL_IDS,
    PANEL_SELECTORS,
    getPanelSelectorChain,
    queryFirst,
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
