const {
  STORAGE_KEYS,
  formatLayoutPayload,
  formatCustomPositionsPayload,
  getAccountScopeFromPath,
  getScopedStorageKey,
  isCustomPositionsShape
} = require("./storage-utils");

describe("storage payload helpers", () => {
  test("formats the active layout storage key", () => {
    expect(formatLayoutPayload("focus")).toEqual({
      [STORAGE_KEYS.activeLayout]: "focus"
    });
  });

  test("normalizes empty active layouts to null", () => {
    expect(formatLayoutPayload("")).toEqual({
      [STORAGE_KEYS.activeLayout]: null
    });
  });

  test("formats custom panel positions", () => {
    const positions = {
      "panel-inbox": { x: 320, y: 48, width: 680, height: 600 }
    };

    expect(formatCustomPositionsPayload(positions)).toEqual({
      [STORAGE_KEYS.customPositions]: positions
    });
  });

  test("validates custom positions shape", () => {
    expect(isCustomPositionsShape({
      "panel-inbox": { x: 1, y: 2, width: 3, height: 4 }
    })).toBe(true);
    expect(isCustomPositionsShape({
      "panel-inbox": { x: 1, y: 2, width: "3", height: 4 }
    })).toBe(false);
    expect(isCustomPositionsShape(null)).toBe(false);
  });

  test("formats Gmail account-scoped storage keys", () => {
    expect(getAccountScopeFromPath("/mail/u/0/")).toBe("u-0");
    expect(getAccountScopeFromPath("/mail/u/1/#inbox")).toBe("u-1");
    expect(getAccountScopeFromPath("/")).toBe("default");
    expect(getScopedStorageKey(STORAGE_KEYS.activeLayout, "/mail/u/1/")).toBe("fluid_active_layout:u-1");
  });
});
