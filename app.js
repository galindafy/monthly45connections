document.addEventListener("DOMContentLoaded", () => {
  const BOARD_SIZE = 45;
  const GROUP_SIZE = 45;
  const STORAGE_KEY = getWeekKey();

  const boardEl = document.querySelector(".board");
  const currentWeekEl = document.getElementById("currentWeek");
  const mistakesEl = document.getElementById("mistakes");
  const pointsEl = document.getElementById("points");
  const shuffleBtn = document.getElementById("shuffleBtn");

  let state = {
    tiles: [],
    selected: [],
    mistakes: 0,
    points: 0,
  };

  let categoryBank = [];

  try {
    if (!window.buildCategoryBank || typeof window.buildCategoryBank !== "function") {
      throw new Error("Category bank failed to load.");
    }
    categoryBank = window.buildCategoryBank();
  } catch (err) {
    renderFatal(`Data error: ${err.message}`);
    return;
  }

  if (!boardEl) {
    return;
  }

  shuffleBtn?.addEventListener("click", shuffleBoard);

  try {
    init();
  } catch (err) {
    console.error(err);
    renderFatal(`Board error: ${err.message}`);
  }

  function init() {
    updateHeader();

    const saved = load();
    if (saved && isValidState(saved) && boardHasNoDuplicateSingles(saved.tiles)) {
      state = {
        tiles: saved.tiles,
        selected: Array.isArray(saved.selected) ? saved.selected : [],
        mistakes: Number.isFinite(saved.mistakes) ? saved.mistakes : 0,
        points: Number.isFinite(saved.points) ? saved.points : computePoints(saved.tiles),
      };
      render();
      return;
    }

    newWeeklyBoard();
    save();
    render();
  }

  function newWeeklyBoard() {
    const weeklyCategories = buildWeeklyCategories();
    const rng = seededRandom(getWeekSeed() + 101);
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

    state.tiles = shuffle(tiles, rng);
    state.selected = [];
    state.mistakes = 0;
    state.points = 0;
  }

  function buildWeeklyCategories() {
    const rng = seededRandom(getWeekSeed());
    const sorted = [...categoryBank].sort((a, b) => (a.priority || 99) - (b.priority || 99));
    const priority1 = shuffle(sorted.filter((c) => c.priority === 1), rng);
    const priority2 = shuffle(sorted.filter((c) => c.priority === 2), rng);
    const priority3 = shuffle(sorted.filter((c) => c.priority === 3), rng);
    const pool = [...priority1, ...priority2, ...priority3];

    const chosen = [];
    const usedItems = new Set();

    for (const category of pool) {
      if (chosen.length >= BOARD_SIZE) break;
      if (!categoryFits(category, usedItems)) continue;
      chosen.push(category);
      category.items.forEach((item) => usedItems.add(item));
    }

    if (chosen.length < BOARD_SIZE) {
      throw new Error("Not enough clean categories for this weekly board.");
    }

    return chosen;
  }

  function categoryFits(category, usedItems) {
    if (!category || !Array.isArray(category.items) || category.items.length !== GROUP_SIZE) {
      return false;
    }
    for (const item of category.items) {
      if (usedItems.has(item)) return false;
    }
    return true;
  }

  function handleClick(id) {
    const idx = state.tiles.findIndex((tile) => tile.id === id);
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
    if (!firstTile || firstTile.locked) {
      state.selected = [];
      save();
      render();
      return;
    }

    if (firstTile.group !== tile.group) {
      const shakeIds = [firstTile.id, tile.id];
      state.mistakes += 1;
      state.selected = [];
      save();
      render(shakeIds);
      setTimeout(() => render(), 320);
      return;
    }

    mergeTiles(firstIdx, idx);
    state.selected = [];
    state.points = computePoints(state.tiles);
    save();
    render();
  }

  function mergeTiles(i1, i2) {
    if (i1 === i2) return;

    const t1 = state.tiles[i1];
    const t2 = state.tiles[i2];
    if (!t1 || !t2) return;
    if (t1.group !== t2.group || t1.locked || t2.locked) return;

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

  function shuffleBoard() {
    const solved = state.tiles.filter((tile) => tile.locked);
    const open = state.tiles.filter((tile) => !tile.locked);
    state.tiles = [...solved, ...shuffle(open)];
    state.selected = [];
    save();
    render();
  }

  function moveSolvedGroupToTop(group) {
    const groupTiles = state.tiles.filter((tile) => tile.group === group);
    const others = state.tiles.filter((tile) => tile.group !== group);
    state.tiles = [...groupTiles, ...others];
  }

  function render(shakeIds = []) {
    boardEl.innerHTML = "";
    updateHeader();

    state.tiles.forEach((tile, idx) => {
      const div = document.createElement("div");
      div.className = "tile";
      div.classList.add(tile.items.length === 1 ? "single" : "merged");

      if (tile.locked) {
        div.classList.add("solved-tile");
        div.style.background = getSolvedColor(tile.group);
      }

      if (state.selected.includes(idx)) {
        div.classList.add("selected");
      }

      if (shakeIds.includes(tile.id)) {
        div.classList.add("shake");
      }

      div.textContent = tile.text;

      if (tile.items.length > 2) {
        div.classList.add("hoverable");
        const hover = document.createElement("div");
        hover.className = "hover-content";
        hover.textContent = tile.items.join(", ");
        div.appendChild(hover);
      }

      div.addEventListener("click", () => handleClick(tile.id));
      boardEl.appendChild(div);
    });
  }

  function updateHeader() {
    const weekInfo = getWeekInfo();
    if (currentWeekEl) currentWeekEl.textContent = `Current week: ${weekInfo.label}`;
    if (mistakesEl) mistakesEl.textContent = `Mistakes: ${state.mistakes}`;
    if (pointsEl) pointsEl.textContent = `Points: ${state.points}`;
  }

  function renderFatal(message) {
    updateHeader();
    boardEl.innerHTML = "";
    const div = document.createElement("div");
    div.className = "tile";
    div.style.gridColumn = "1 / -1";
    div.style.cursor = "default";
    div.textContent = message;
    boardEl.appendChild(div);
  }

  function formatPreview(items) {
    if (items.length <= 2) return items.join(", ");
    return `${items[0]}, ${items[1]}, ... [${items.length}]`;
  }

  function computePoints(tiles) {
    return tiles.reduce((sum, tile) => sum + Math.max(0, tile.items.length - 1), 0);
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
    return Boolean(
      value &&
      Array.isArray(value.tiles) &&
      Array.isArray(value.selected) &&
      value.tiles.every(
        (tile) => tile && typeof tile.id === "string" && typeof tile.text === "string" && typeof tile.group === "number" && Array.isArray(tile.items)
      )
    );
  }

  function boardHasNoDuplicateSingles(tiles) {
    const seen = new Set();
    for (const tile of tiles) {
      if (!tile || !Array.isArray(tile.items)) return false;
      if (tile.items.length === 1) {
        if (seen.has(tile.items[0])) return false;
        seen.add(tile.items[0]);
      }
    }
    return true;
  }

  function getWeekInfo() {
    const d = new Date();
    const start = new Date(Date.UTC(d.getFullYear(), 0, 1));
    const now = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = Math.floor((now - start) / 86400000) + 1;
    const week = Math.ceil(dayNum / 7);
    return { year: d.getFullYear(), week, label: `${d.getFullYear()} W${String(week).padStart(2, "0")}` };
  }

  function getWeekSeed() {
    const info = getWeekInfo();
    return info.year * 100 + info.week;
  }

  function getWeekKey() {
    const info = getWeekInfo();
    return `connections_weekly_45x45_${info.year}_${info.week}`;
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
