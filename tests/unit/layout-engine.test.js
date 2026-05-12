const {
  PANEL_IDS,
  getPanelSelectorChain,
  queryFirst
} = require("../../content/layout-engine");

describe("layout engine selector chains", () => {
  test("defines selector chains for all Gmail panels", () => {
    expect(PANEL_IDS).toEqual([
      "panel-sidebar-left",
      "panel-inbox",
      "panel-reading-pane",
      "panel-search",
      "panel-compose",
      "panel-sidebar-right"
    ]);

    for (const panelId of PANEL_IDS) {
      expect(getPanelSelectorChain(panelId).length).toBeGreaterThanOrEqual(3);
    }
  });

  test("prioritizes semantic selectors before obfuscated classes", () => {
    expect(getPanelSelectorChain("panel-sidebar-left")[0]).toContain("nav");
    expect(getPanelSelectorChain("panel-search")[0]).toContain("header");
    expect(getPanelSelectorChain("panel-compose")[0]).toBe('[gh="cm"]');
  });

  test("returns the first selector match", () => {
    const matches = new Map([
      [".fallback", { id: "fallback" }],
      ["[role=\"main\"]", { id: "semantic" }]
    ]);
    const doc = {
      querySelector: jest.fn((selector) => matches.get(selector) || null)
    };

    expect(queryFirst(["[role=\"main\"]", ".fallback"], doc)).toEqual({
      element: { id: "semantic" },
      selector: "[role=\"main\"]"
    });
    expect(doc.querySelector).toHaveBeenCalledTimes(1);
  });

  test("skips invalid selectors and continues searching", () => {
    const validElement = { id: "valid" };
    const doc = {
      querySelector: jest.fn((selector) => {
        if (selector === "bad") {
          throw new Error("invalid selector");
        }

        return selector === ".valid" ? validElement : null;
      })
    };

    expect(queryFirst(["bad", ".valid"], doc)).toEqual({
      element: validElement,
      selector: ".valid"
    });
  });
});
