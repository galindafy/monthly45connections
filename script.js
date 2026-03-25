document.addEventListener("DOMContentLoaded", () => {
  const SIZE = 45;
  const STORAGE_KEY = "connections-45x45-weekly-fixed-v4";
  const GROUP_COLORS = ["#f9df6d", "#a0c35a", "#b0c4ef", "#ba81c5"];

  const CATEGORY_BANK = window.CATEGORY_BANK || {};

  const board = document.getElementById("board");
  const mistakesEl = document.getElementById("mistakes");
  const dateEl = document.getElementById("puzzleDate");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const deselectBtn = document.getElementById("deselectBtn");

  function normalizeSourceWord(word) {
    return String(word)
      .replace(/\s+\[.*?\]$/, "")
      .replace(/\s+(film|song|novel|app|platform|service|company|book|game|drink|beverage|instrument|flower|tree|fish|seafood|vehicle|state|bird|colour|furniture|planner|lotion)$/i, "")
      .trim();
  }

  function displayWord(word) {
    return normalizeSourceWord(word);
  }

  function weekStartDate() {
    const d = new Date();
    const local = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = local.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    local.setDate(local.getDate() + diff);
    local.setHours(0, 0, 0, 0);
    return local;
  }

  function weekKey() {
    const d = weekStartDate();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  }

  function formatLongDate(k) {
    const y = Number(k.slice(0, 4));
    const m = Number(k.slice(4, 6)) - 1;
    const d = Number(k.slice(6, 8));
    return new Date(y, m, d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function seedNumber(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function rand(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function shuffle(arr, seed) {
    const copy = [...arr];
    let s = seed;
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand(s++) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildFreshState() {
    const dateKey = weekKey();
    const seed = seedNumber(dateKey);

    const entries = Object.entries(CATEGORY_BANK);
    const chosen = shuffle(entries, seed).slice(0, SIZE);

    const categories = chosen.map(([name, words], idx) => {
      const cleaned = words.map(normalizeSourceWord);
      const unique = [...new Set(cleaned)];
      return {
        name,
        words: shuffle(unique, seed + idx).slice(0, SIZE)
      };
    });

    const seen = new Set();
    const tiles = [];
    const lookup = {};

    categories.forEach((cat, idx) => {
      cat.words.forEach(word => {
        let w = word;

        if (seen.has(w)) {
          w = `${w} [${cat.name}]`;
        }

        seen.add(w);
        tiles.push(w);
        lookup[w] = {
          name: cat.name,
          color: GROUP_COLORS[idx % GROUP_COLORS.length]
        };
      });
    });

    return {
      dateKey,
      lookup,
      groups: shuffle(tiles, seed + 999).map(word => ({
        words: [word],
        solved: false,
        category: null,
        color: null
      })),
      selectedIndex: null,
      mistakes: 0
    };
  }

  function loadState() {
    const fresh = buildFreshState();

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fresh;

      const saved = JSON.parse(raw);

      if (!saved || saved.dateKey !== fresh.dateKey) {
        localStorage.removeItem(STORAGE_KEY);
        return fresh;
      }

      return {
        dateKey: fresh.dateKey,
        lookup: fresh.lookup,
        groups: saved.groups,
        selectedIndex: null,
        mistakes: saved.mistakes || 0
      };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return fresh;
    }
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      dateKey: state.dateKey,
      groups: state.groups,
      mistakes: state.mistakes
    }));
  }

  function preview(group) {
    const shown = group.words.map(displayWord);
    const firstTwo = shown.slice(0, 2).join(", ");
    return shown.length >= 3 ? `${firstTwo}, ... [${shown.length}]` : firstTwo;
  }

  function findCategory(words) {
    const first = state.lookup[words[0]];
    if (!first) return null;

    for (const w of words) {
      if (!state.lookup[w] || state.lookup[w].name !== first.name) return null;
    }

    return first;
  }

  function mergeIntoSecond(a, b) {
    const mergedWords = [...state.groups[a].words, ...state.groups[b].words];
    const category = findCategory(mergedWords);

    if (!category) {
      state.mistakes += 1;
      return;
    }

    const merged = {
      words: mergedWords,
      solved: false,
      category: null,
      color: null
    };

    let insertIndex = b;

    if (a > b) {
      state.groups.splice(a, 1);
      state.groups.splice(b, 1);
    } else {
      state.groups.splice(b, 1);
      state.groups.splice(a, 1);
      insertIndex -= 1;
    }

    state.groups.splice(insertIndex, 0, merged);

    if (merged.words.length === SIZE) {
      merged.solved = true;
      merged.category = category.name;
      merged.color = category.color;
    }
  }

  function handleClick(i) {
    const g = state.groups[i];
    if (g.solved) return;

    if (state.selectedIndex === null) {
      state.selectedIndex = i;
      render();
      return;
    }

    if (state.selectedIndex === i) {
      state.selectedIndex = null;
      render();
      return;
    }

    mergeIntoSecond(state.selectedIndex, i);
    state.selectedIndex = null;
    saveState();
    render();
  }

  function render() {
    dateEl.textContent = formatLongDate(state.dateKey);
    mistakesEl.textContent = state.mistakes;

    board.innerHTML = "";

    state.groups.forEach((g, i) => {
      const tile = document.createElement("div");
      tile.className = "tile";

      if (g.solved) {
        tile.classList.add("solved-tile", "hoverable");
        tile.style.background = g.color;
      } else {
        tile.classList.add(g.words.length > 1 ? "merged" : "single");
        if (state.selectedIndex === i) tile.classList.add("selected");
        if (g.words.length >= 3) tile.classList.add("hoverable");
      }

      const label = document.createElement("div");
      label.textContent = g.solved ? g.category : preview(g);
      tile.appendChild(label);

      if (g.words.length >= 3 || g.solved) {
        const hover = document.createElement("div");
        hover.className = "hover-content";
        hover.textContent = g.words.map(displayWord).join(", ");
        tile.appendChild(hover);
      }

      if (!g.solved) {
        tile.addEventListener("click", () => handleClick(i));
      }

      board.appendChild(tile);
    });
  }

  shuffleBtn.addEventListener("click", () => {
    const seed = seedNumber(state.dateKey) + Date.now();
    state.groups = shuffle(state.groups, seed);
    state.selectedIndex = null;
    saveState();
    render();
  });

  deselectBtn.addEventListener("click", () => {
    state.selectedIndex = null;
    render();
  });

  render();
});
