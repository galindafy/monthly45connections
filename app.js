document.addEventListener("DOMContentLoaded", () => {
  const GROUP_COUNT = 45;
  const GROUP_SIZE = 45;
  const SHAKE_MS = 320;

  const STATUS_EL =
    document.getElementById("megaStatus") ||
    document.querySelector(".status");

  const BOARD_EL =
    document.getElementById("megaBoard") ||
    document.querySelector(".board");

  const SHUFFLE_BTN = document.getElementById("shuffleBtn");
  const DESELECT_BTN = document.getElementById("deselectBtn");

  const CATEGORY_BANK = Array.isArray(window.CATEGORY_BANK) ? window.CATEGORY_BANK : [];
  const STORAGE_KEY = `connections45:${getWeekInfo().key}`;

  let state = loadState();

  if (!isValidState(state)) {
    state = buildWeeklyState();
    saveState();
  }

  wireControls();
  render();

  function wireControls() {
    if (SHUFFLE_BTN) {
      SHUFFLE_BTN.addEventListener("click", shuffleOpenTiles);
    }

    if (DESELECT_BTN) {
      DESELECT_BTN.addEventListener("click", () => {
        state.selected = [];
        saveState();
        render();
      });
    }
  }

  function buildWeeklyState() {
    const categories = pickWeeklyCategories();
    const tiles = [];

    categories.forEach((category, groupIndex) => {
      category.items.forEach((item, itemIndex) => {
        tiles.push({
          id: `g${groupIndex}-i${itemIndex}`,
          group: groupIndex,
          categoryId: category.id,
          categoryTitle: category.title,
          text: item,
          items: [item],
          locked: false
        });
      });
    });

    return {
      weekKey: getWeekInfo().key,
      selected: [],
      mistakes: 0,
      score: 0,
      tiles: shuffleArray(
        tiles,
        seededRandom(hashString(getWeekInfo().key + ":tiles"))
      )
    };
  }

  function pickWeeklyCategories() {
    const cleaned = CATEGORY_BANK.filter(isValidCategory);

    if (cleaned.length < GROUP_COUNT) {
      throw new Error(
        `Need at least ${GROUP_COUNT} curated categories in data.js. Found ${cleaned.length}.`
      );
    }

    const tries = 500;
    const seedBase = hashString(getWeekInfo().key + ":cats");
    let best = [];

    for (let attempt = 0; attempt < tries; attempt += 1) {
      const rng = seededRandom(seedBase + attempt * 9973);
      const shuffled = shuffleArray(cleaned, rng);
      const chosen = [];
      const used = new Set();

      for (const category of shuffled) {
        if (category.items.some((item) => used.has(normalize(item)))) continue;

        chosen.push(category);
        category.items.forEach((item) => used.add(normalize(item)));

        if (chosen.length === GROUP_COUNT) {
          return chosen;
        }
      }

      if (chosen.length > best.length) {
        best = chosen;
      }
    }

    throw new Error(
      `Only found ${best.length} duplicate-free curated categories. Need ${GROUP_COUNT}.`
    );
  }

  function isValidCategory(category) {
    return (
      category &&
      typeof category.id === "string" &&
      typeof category.title === "string" &&
      Array.isArray(category.items) &&
      category.items.length === GROUP_SIZE &&
      new Set(category.items.map(normalize)).size === GROUP_SIZE
    );
  }

  function handleTileClick(id) {
    const idx = state.tiles.findIndex((tile) => tile.id === id);
    if (idx === -1) return;

    const tile = state.tiles[idx];
    if (!tile || tile.locked) return;

    if (state.selected.length === 0) {
      state.selected = [idx];
      saveState();
      render();
      return;
    }

    const firstIdx = state.selected[0];

    if (firstIdx === idx) {
      state.selected = [];
      saveState();
      render();
      return;
    }

    const first = state.tiles[firstIdx];

    if (!first || first.locked) {
      state.selected = [];
      saveState();
      render();
      return;
    }

    if (first.group !== tile.group) {
      state.mistakes += 1;
      state.selected = [];
      saveState();
      render([first.id, tile.id]);
      setTimeout(() => render(), SHAKE_MS);
      return;
    }

    mergeTiles(firstIdx, idx);
    state.selected = [];
    state.score = countSolvedGroups();
    saveState();
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

    if (mergedItems.length === t2.items.length) return;

    const solved = mergedItems.length === GROUP_SIZE;

    state.tiles[i2] = {
      ...t2,
      items: mergedItems,
      text: solved ? t2.categoryTitle : formatPreview(mergedItems),
      locked: solved
    };

    state.tiles.splice(i1, 1);

    const keptIndex = i1 < i2 ? i2 - 1 : i2;
    const keptTile = state.tiles[keptIndex];

    if (keptTile && keptTile.locked) {
      moveSolvedGroupToTop(keptTile.group);
    }
  }

  function moveSolvedGroupToTop(group) {
    const groupTiles = state.tiles.filter((tile) => tile.group === group);
    const others = state.tiles.filter((tile) => tile.group !== group);
    state.tiles = [...groupTiles, ...others];
  }

  function shuffleOpenTiles() {
    const rng = seededRandom(
      hashString(
        `${getWeekInfo().key}:shuffle:${state.tiles.length}:${state.mistakes}:${state.score}`
      )
    );

    const locked = state.tiles.filter((tile) => tile.locked);
    const open = state.tiles.filter((tile) => !tile.locked);

    state.tiles = [...locked, ...shuffleArray(open, rng)];
    state.selected = [];
    saveState();
    render();
  }

  function countSolvedGroups() {
    const solved = new Set();

    state.tiles.forEach((tile) => {
      if (tile.locked) solved.add(tile.group);
    });

    return solved.size;
  }

  function formatPreview(items) {
    if (items.length <= 2) {
      return items.join(", ");
    }
    return `${items[0]}, ${items[1]}, ... [${items.length}]`;
  }

  function render(shakeIds = []) {
    if (STATUS_EL) {
      const week = getWeekInfo();
      STATUS_EL.innerHTML = [
        `<span>Week ${week.week}, ${week.year}</span>`,
        `<span>Score ${state.score}</span>`,
        `<span>Mistakes ${state.mistakes}</span>`
      ].join("");
    }

    if (!BOARD_EL) return;

    BOARD_EL.innerHTML = "";

    state.tiles.forEach((tile, idx) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "tile";

      if (tile.items.length === 1) {
        el.classList.add("single");
      } else {
        el.classList.add("merged");
      }

      if (tile.locked) {
        el.classList.add("solved-tile");
        el.style.background = solvedColour(tile.group);
      }

      if (state.selected.includes(idx)) {
        el.classList.add("selected");
      }

      if (shakeIds.includes(tile.id)) {
        el.classList.add("shake");
      }

      el.textContent = tile.text;
      el.addEventListener("click", () => handleTileClick(tile.id));

      if (tile.items.length > 2 && !tile.locked) {
        el.classList.add("hoverable");
        const hover = document.createElement("div");
        hover.className = "hover-content";
        hover.textContent = tile.items.join(", ");
        el.appendChild(hover);
      }

      BOARD_EL.appendChild(el);
    });
  }

  function solvedColour(group) {
    const colours = [
      "var(--yellow)",
      "var(--green)",
      "var(--blue)",
      "var(--purple)"
    ];
    return colours[group % colours.length];
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function loadState() {
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
      typeof value.mistakes === "number" &&
      typeof value.score === "number" &&
      value.tiles.every(
        (tile) =>
          tile &&
          typeof tile.id === "string" &&
          typeof tile.group === "number" &&
          typeof tile.categoryId === "string" &&
          typeof tile.categoryTitle === "string" &&
          Array.isArray(tile.items)
      )
    );
  }

  function getWeekInfo() {
    const d = new Date();
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);

    return {
      year: date.getUTCFullYear(),
      week,
      key: `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`
    };
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededRandom(seed) {
    let s = seed >>> 0;
    return () => {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleArray(arr, rng = Math.random) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function normalize(value) {
    return String(value).trim().toLowerCase().replace(/\s+/g, " ");
  }

  function uniquePreserveOrder(items) {
    const seen = new Set();
    const out = [];

    items.forEach((item) => {
      const key = normalize(item);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    });

    return out;
  }
});
