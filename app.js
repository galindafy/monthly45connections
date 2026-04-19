document.addEventListener("DOMContentLoaded", () => {
  const GROUP_COUNT = 45;
  const GROUP_SIZE = 45;
  const SHAKE_MS = 320;

  const statusEl = document.getElementById("megaStatus") || document.querySelector(".status");
  const boardEl = document.getElementById("megaBoard") || document.querySelector(".board");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const deselectBtn = document.getElementById("deselectBtn");

  const CATEGORY_BANK = Array.isArray(window.CATEGORY_BANK) ? window.CATEGORY_BANK : [];
  const periodInfo = getMonthlyInfo();
  const STORAGE_KEY = `connections45:${periodInfo.key}`;

  let state;

  try {
    validateCategoryBank(CATEGORY_BANK);
    state = loadState();
    if (!isValidState(state)) {
      state = buildPeriodState();
      saveState();
    }
    wireControls();
    maybeShowResetWarning();
    render();
  } catch (error) {
    renderFatal(error);
  }

  function wireControls() {
    if (shuffleBtn) shuffleBtn.addEventListener("click", shuffleOpenTiles);
    if (deselectBtn) {
      deselectBtn.addEventListener("click", () => {
        state.selected = [];
        saveState();
        render();
      });
    }
  }

  function buildPeriodState() {
    const categories = pickMonthlyCategories().map((category, index) => ({ ...category, group: index }));
    const rawTiles = [];
    categories.forEach((category) => {
      category.items.forEach((item, itemIndex) => {
        rawTiles.push({
          id: `g${category.group}-i${itemIndex}`,
          group: category.group,
          categoryId: category.id,
          categoryTitle: category.title,
          text: item,
          items: [item],
          locked: false
        });
      });
    });
    const rng = seededRandom(hashString(`${periodInfo.key}:layout`));
    return { periodKey: periodInfo.key, selected: [], mistakes: 0, score: 0, tiles: shuffleArray(rawTiles, rng) };
  }

  function pickMonthlyCategories() {
    const featured = CATEGORY_BANK.filter((c) => c.bucket !== "expansion");
    const expansion = CATEGORY_BANK.filter((c) => c.bucket === "expansion");
    const picked = [];
    const used = new Set();

    fillFromPool(featured, 28, `${periodInfo.key}:featured`, picked, used);
    fillFromPool(expansion, 45, `${periodInfo.key}:expansion`, picked, used);
    if (picked.length < GROUP_COUNT) fillFromPool(CATEGORY_BANK, GROUP_COUNT, `${periodInfo.key}:fallback`, picked, used);
    if (picked.length < GROUP_COUNT) throw new Error(`Only found ${picked.length} duplicate-free categories for this month.`);
    return picked.slice(0, GROUP_COUNT);
  }

  function fillFromPool(pool, targetCount, seedKey, picked, used) {
    const shuffled = shuffleArray(pool, seededRandom(hashString(seedKey)));
    for (const category of shuffled) {
      if (picked.length >= targetCount) break;
      if (picked.some((x) => x.id === category.id)) continue;
      if (!categoryFits(category, used)) continue;
      picked.push(category);
      category.items.forEach((item) => used.add(normalize(item)));
    }
  }

  function categoryFits(category, used) {
    return category.items.every((item) => !used.has(normalize(item)));
  }

  function validateCategoryBank(bank) {
    if (!Array.isArray(bank) || bank.length < GROUP_COUNT) throw new Error("CATEGORY_BANK is missing.");
    const global = new Map();
    bank.forEach((category, categoryIndex) => {
      if (!category || typeof category.id !== "string" || typeof category.title !== "string" || !Array.isArray(category.items)) {
        throw new Error(`Category ${categoryIndex + 1} is malformed.`);
      }
      if (category.items.length !== GROUP_SIZE) throw new Error(`"${category.title}" does not have ${GROUP_SIZE} items.`);
      const local = new Set();
      category.items.forEach((item) => {
        const key = normalize(item);
        if (local.has(key)) throw new Error(`"${category.title}" contains a duplicate item: ${item}`);
        local.add(key);
        if (global.has(key)) {
          throw new Error(`Global overlap detected: "${item}" appears in both "${global.get(key)}" and "${category.title}".`);
        }
        global.set(key, category.title);
      });
    });
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
    if (!t1 || !t2 || t1.group !== t2.group || t1.locked || t2.locked) return;
    const mergedItems = uniquePreserveOrder([...t1.items, ...t2.items]);
    if (mergedItems.length === t2.items.length) return;
    const solved = mergedItems.length === GROUP_SIZE;
    state.tiles[i2] = { ...t2, items: mergedItems, text: solved ? t2.categoryTitle : formatPreview(mergedItems), locked: solved };
    state.tiles.splice(i1, 1);
  }

  function shuffleOpenTiles() {
    const locked = state.tiles.filter((tile) => tile.locked);
    const open = state.tiles.filter((tile) => !tile.locked);
    const rng = seededRandom(hashString(`${periodInfo.key}:shuffle:${state.mistakes}:${state.score}:${open.length}`));
    state.tiles = [...locked, ...shuffleArray(open, rng)];
    state.selected = [];
    saveState();
    render();
  }

  function countSolvedGroups() {
    const solvedGroups = new Set();
    state.tiles.forEach((tile) => { if (tile.locked) solvedGroups.add(tile.group); });
    return solvedGroups.size;
  }

  function formatPreview(items) {
    if (items.length <= 2) return items.join(", ");
    return `${items[0]}, ${items[1]}, ... [${items.length}]`;
  }

  function render(shakeIds = []) {
    if (statusEl) {
      statusEl.innerHTML = [
        `<span>Puzzle ${periodInfo.number}, ${periodInfo.year}</span>`,
        `<span>Resets ${formatDate(periodInfo.resetDate)}</span>`,
        `<span>Score ${state.score}</span>`,
        `<span>Mistakes ${state.mistakes}</span>`
      ].join("");
    }
    if (!boardEl) return;
    boardEl.innerHTML = "";
    state.tiles.forEach((tile, idx) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "tile";
      if (tile.items.length === 1) el.classList.add("single");
      else el.classList.add("merged");
      if (tile.locked) {
        el.classList.add("solved-tile");
        el.style.background = solvedColour(tile.group);
      }
      if (state.selected.includes(idx)) el.classList.add("selected");
      if (shakeIds.includes(tile.id)) el.classList.add("shake");
      el.textContent = tile.text;
      el.addEventListener("click", () => handleTileClick(tile.id));
      if (tile.items.length > 2) {
        el.classList.add("hoverable");
        const hover = document.createElement("div");
        hover.className = "hover-content";
        hover.textContent = tile.items.join(", ");
        el.appendChild(hover);
      }
      boardEl.appendChild(el);
    });
  }

  function renderFatal(error) {
    const message = error && error.message ? error.message : "Unknown error.";
    if (statusEl) statusEl.innerHTML = `<span>Board error</span><span>${escapeHtml(message)}</span>`;
    if (boardEl) {
      boardEl.innerHTML = "";
      const box = document.createElement("div");
      box.className = "tile";
      box.style.gridColumn = "1 / -1";
      box.style.minHeight = "88px";
      box.style.cursor = "default";
      box.textContent = `Board error: ${message}`;
      boardEl.appendChild(box);
    }
    console.error(error);
  }

  function maybeShowResetWarning() {
    const warningKey = `connections45-reset-warning:${periodInfo.key}`;
    if (!isOneDayBeforeReset(periodInfo.resetDate)) return;
    if (localStorage.getItem(warningKey) === "shown") return;
    alert(`This puzzle resets tomorrow: ${formatDate(periodInfo.resetDate)}.`);
    try { localStorage.setItem(warningKey, "shown"); } catch (_) {}
  }

  function isOneDayBeforeReset(resetDate) {
    const now = new Date();
    const marker = new Date(resetDate);
    marker.setDate(marker.getDate() - 1);
    return now.getFullYear() === marker.getFullYear() && now.getMonth() === marker.getMonth() && now.getDate() === marker.getDate();
  }

  function solvedColour(group) {
    const colours = ["var(--yellow)", "var(--green)", "var(--blue)", "var(--purple)"];
    return colours[group % colours.length];
  }

  function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} }
  function loadState() { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch (_) { return null; } }

  function isValidState(value) {
    return value && value.periodKey === periodInfo.key && Array.isArray(value.tiles) && Array.isArray(value.selected) && typeof value.mistakes === "number" && typeof value.score === "number" && value.tiles.every((tile) => tile && typeof tile.id === "string" && typeof tile.group === "number" && typeof tile.categoryId === "string" && typeof tile.categoryTitle === "string" && typeof tile.text === "string" && Array.isArray(tile.items) && typeof tile.locked === "boolean");
  }

  function getMonthlyInfo() {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { year: periodStart.getFullYear(), number: periodStart.getMonth() + 1, key: `${periodStart.getFullYear()}-M${String(periodStart.getMonth() + 1).padStart(2, "0")}`, startDate: periodStart, resetDate };
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
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

  function normalize(value) { return String(value).trim().toLowerCase().replace(/\s+/g, " "); }

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

  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }
});
