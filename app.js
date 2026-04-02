
document.addEventListener("DOMContentLoaded", () => {
  const BOARD_SIZE = 45;
  const GROUP_SIZE = 45;
  const STORAGE_KEY = getWeekKey();

  let state = {
    tiles: [],
    selected: [],
  };

  const CATEGORY_BANK = window.buildCategoryBank();

  init();

  function init() {
    const saved = load();
    if (saved && isValidState(saved) && boardHasNoDuplicateSingles(saved.tiles)) {
      state = saved;
      render();
      return;
    }

    newWeeklyBoard();
    save();
    render();
  }

  function newWeeklyBoard() {
    const weeklyCategories = buildWeeklyCategories();
    const tiles = [];

    weeklyCategories.forEach((category, groupIndex) => {
      category.items.forEach((item) => {
        tiles.push({
          id: makeId(),
          text: item,
          items: [item],
          group: groupIndex,
          locked: false,
        });
      });
    });

    state.tiles = shuffle(tiles, seededRandom(getWeekSeed() + 101));
    state.selected = [];
  }

  function buildWeeklyCategories() {
    const rng = seededRandom(getWeekSeed());
    const weighted = [...CATEGORY_BANK].sort((a, b) => a.priority - b.priority);
    const buckets = [
      shuffle(weighted.filter((cat) => cat.priority === 1), rng),
      shuffle(weighted.filter((cat) => cat.priority === 2), rng),
      shuffle(weighted.filter((cat) => cat.priority === 3), rng),
    ];
    const shuffled = buckets.flat();
    const chosen = [];
    const usedTexts = new Set();

    for (const cat of shuffled) {
      if (chosen.length === BOARD_SIZE) break;
      if (!categoryFits(cat, usedTexts)) continue;
      chosen.push(cat);
      cat.items.forEach((item) => usedTexts.add(item));
    }

    if (chosen.length < BOARD_SIZE) {
      throw new Error("Not enough non-overlapping categories to build the weekly board.");
    }

    return chosen;
  }

  function categoryFits(category, usedTexts) {
    if (!category || !Array.isArray(category.items) || category.items.length !== GROUP_SIZE) {
      return false;
    }
    for (const item of category.items) {
      if (usedTexts.has(item)) return false;
    }
    return true;
  }

  function handleClick(id) {
    const idx = state.tiles.findIndex((t) => t.id === id);
    if (idx === -1) return;

    const tile = state.tiles[idx];
    if (!tile || tile.locked) return;

    if (state.selected.length === 0) {
      state.selected = [idx];
      save();
      render();
      return;
    }

    const firstIdx = state.selected[0];

    if (firstIdx === idx) {
      state.selected = [];
      save();
      render();
      return;
    }

    const firstTile = state.tiles[firstIdx];
    if (!firstTile) {
      state.selected = [];
      save();
      render();
      return;
    }

    if (firstTile.group !== tile.group) {
      const shakeIds = [firstTile.id, tile.id];
      state.selected = [];
      render(shakeIds);
      setTimeout(() => render(), 320);
      return;
    }

    mergeTiles(firstIdx, idx);
    state.selected = [];
    save();
    render();
  }

  function mergeTiles(i1, i2) {
    if (i1 === i2) return;

    const t1 = state.tiles[i1];
    const t2 = state.tiles[i2];
    if (!t1 || !t2) return;
    if (t1.group !== t2.group) return;
    if (t1.locked || t2.locked) return;

    const mergedItems = uniquePreserveOrder([...t1.items, ...t2.items]);
    const mergedTile = {
      ...t2,
      items: mergedItems,
      text: formatPreview(mergedItems),
      locked: mergedItems.length === GROUP_SIZE,
    };

    state.tiles[i2] = mergedTile;
    state.tiles.splice(i1, 1);

    if (mergedTile.locked) {
      moveSolvedGroupToTop(mergedTile.group);
    }
  }

  function moveSolvedGroupToTop(group) {
    const groupTiles = state.tiles.filter((t) => t.group === group);
    const others = state.tiles.filter((t) => t.group !== group);
    state.tiles = [...groupTiles, ...others];
  }

  function formatPreview(items) {
    if (items.length <= 2) return items.join(", ");
    return `${items[0]}, ${items[1]}, ... [${items.length}]`;
  }

  function render(shakeIds = []) {
    const board = document.querySelector(".board");
    if (!board) return;

    board.innerHTML = "";

    state.tiles.forEach((tile, idx) => {
      const div = document.createElement("div");
      div.className = "tile";

      if (tile.items.length === 1) div.classList.add("single");
      else div.classList.add("merged");

      if (tile.locked) {
        div.classList.add("solved-tile");
        div.style.background = getSolvedColor(tile.group);
      }

      if (state.selected.includes(idx)) div.classList.add("selected");
      if (shakeIds.includes(tile.id)) div.classList.add("shake");

      div.textContent = tile.text;

      if (tile.items.length > 2) {
        div.classList.add("hoverable");
        const hover = document.createElement("div");
        hover.className = "hover-content";
        hover.textContent = tile.items.join(", ");
        div.appendChild(hover);
      }

      div.addEventListener("click", () => handleClick(tile.id));
      board.appendChild(div);
    });
  }

  function getSolvedColor(group) {
    const colors = ["var(--yellow)", "var(--green)", "var(--blue)", "var(--purple)"];
    return colors[group % colors.length];
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function isValidState(value) {
    return (
      value &&
      Array.isArray(value.tiles) &&
      Array.isArray(value.selected) &&
      value.tiles.every(
        (t) =>
          t &&
          typeof t.id === "string" &&
          typeof t.text === "string" &&
          typeof t.group === "number" &&
          Array.isArray(t.items)
      )
    );
  }

  function boardHasNoDuplicateSingles(tiles) {
    const seen = new Set();
    for (const tile of tiles) {
      if (!tile || !Array.isArray(tile.items)) return false;
      if (tile.items.length === 1) {
        const value = tile.items[0];
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
    return true;
  }

  function getWeekSeed() {
    const d = new Date();
    const start = new Date(Date.UTC(d.getFullYear(), 0, 1));
    const now = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = Math.floor((now - start) / 86400000) + 1;
    const week = Math.ceil(dayNum / 7);
    return d.getFullYear() * 100 + week;
  }

  function getWeekKey() {
    const d = new Date();
    const start = new Date(Date.UTC(d.getFullYear(), 0, 1));
    const now = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = Math.floor((now - start) / 86400000) + 1;
    const week = Math.ceil(dayNum / 7);
    return `connections_weekly_45x45_${d.getFullYear()}_${week}`;
  }

  function makeId() {
    if (window.crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  function uniquePreserveOrder(arr) {
    const seen = new Set();
    const out = [];
    for (const item of arr) {
      if (!seen.has(item)) {
        seen.add(item);
        out.push(item);
      }
    }
    return out;
  }

  function shuffle(arr, rng = Math.random) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
});
