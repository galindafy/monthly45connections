const BOARD_SIZE = 45;

const state = {
  tiles: [],
  selected: [],
  score: 0,
  mistakes: 0,
  solved: [],
  stats: loadStats(),
};

const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const mistakesEl = document.getElementById("mistakes");
const puzzleEl = document.getElementById("puzzle");
const resetEl = document.getElementById("reset");

init();

function init() {
  generateBoard();
  render();
}

function generateBoard() {
  const quarter = getQuarterKey();

  const rng = seededRandom(hashCode(quarter));

  const categories = pickQuarterCategories(rng);

  const tiles = [];

  categories.forEach((cat, gi) => {

    cat.items.forEach(item => {

      const normalized = normalizeItem(item);

      tiles.push({
        id: crypto.randomUUID(),

        text: normalized.text,

        group: gi,

        altGroups: normalized.alt || [],

        title: cat.title,

        solved: false,

        merged: [normalized.text]
      });

    });

  });

  shuffleArray(tiles, rng);

  state.tiles = tiles;

  puzzleEl.textContent =
    `Puzzle ${quarter}`;

  resetEl.textContent =
    `Resets ${getNextQuarterDate()}`;
}

function normalizeItem(item) {

  if (typeof item === "string") {
    return {
      text: item,
      alt: []
    };
  }

  return {
    text: item.text,
    alt: item.alt || []
  };
}

function render() {

  board.innerHTML = "";

  scoreEl.textContent = state.score;
  mistakesEl.textContent = state.mistakes;

  state.tiles.forEach((tile, index) => {

    const div = document.createElement("button");

    div.className = "tile";

    if (state.selected.includes(index)) {
      div.classList.add("selected");
    }

    if (tile.solved) {
      div.classList.add("solved");
    }

    div.innerHTML = tile.solved
      ? `
        <strong>${tile.title} [45]</strong>
      `
      : tile.text;

    if (tile.solved) {

      div.title =
        tile.merged.join(", ");
    }

    div.onclick = () => selectTile(index);

    board.appendChild(div);

  });

}

function selectTile(index) {

  const tile = state.tiles[index];

  if (tile.solved) return;

  if (state.selected.includes(index)) {

    state.selected =
      state.selected.filter(i => i !== index);

    render();

    return;
  }

  state.selected.push(index);

  render();

  if (state.selected.length >= 2) {
    attemptMerge();
  }
}

function attemptMerge() {

  const indexes = [...state.selected];

  const tiles =
    indexes.map(i => state.tiles[i]);

  const correct =
    tiles.every(t => t.group === tiles[0].group);

  if (!correct) {

    shake(indexes);

    state.mistakes++;

    state.selected = [];

    render();

    return;
  }

  mergeTiles(indexes);
}

function mergeTiles(indexes) {

  const tiles =
    indexes.map(i => state.tiles[i]);

  const base =
    state.tiles[indexes[1]];

  const mergedItems =
    tiles.flatMap(t =>
      t.merged || [t.text]
    );

  base.solved =
    mergedItems.length >= 45;

  base.title =
    tiles[0].title;

  base.group =
    tiles[0].group;

  base.merged =
    mergedItems;

  base.text =
    mergedItems.join(", ");

  indexes
    .sort((a,b)=>b-a)
    .forEach(i => {

      if (state.tiles[i] !== base) {
        state.tiles.splice(i,1);
      }

    });

  state.score++;

  state.selected = [];

  render();
}

function shake(indexes) {

  const buttons =
    [...document.querySelectorAll(".tile")];

  indexes.forEach(i => {

    buttons[i]?.classList.add("shake");

    setTimeout(() => {
      buttons[i]?.classList.remove("shake");
    }, 400);

  });

}

function deselectAll() {

  state.selected = [];

  render();
}

function shuffleBoard() {

  shuffleArray(state.tiles);

  render();
}

function pickQuarterCategories(rng) {

  const shuffled =
    [...CATEGORY_BANK];

  shuffleArray(shuffled, rng);

  return shuffled.slice(0, BOARD_SIZE);
}

function getQuarterKey() {

  const d = new Date();

  const q =
    Math.floor(d.getMonth()/3)+1;

  return `${d.getFullYear()}-Q${q}`;
}

function getNextQuarterDate() {

  const d = new Date();

  const q =
    Math.floor(d.getMonth()/3);

  const next =
    new Date(
      d.getFullYear(),
      (q+1)*3,
      1
    );

  return next.toDateString();
}

function shuffleArray(arr, rng=Math.random) {

  for (let i=arr.length-1;i>0;i--) {

    const j =
      Math.floor(rng()*(i+1));

    [arr[i],arr[j]] =
      [arr[j],arr[i]];
  }
}

function seededRandom(seed) {

  return function() {

    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;

    let t =
      Math.imul(seed ^ seed >>> 15, 1 | seed);

    t ^= t + Math.imul(
      t ^ t >>> 7,
      61 | t
    );

    return (
      ((t ^ t >>> 14) >>> 0)
      / 4294967296
    );
  };
}

function hashCode(str) {

  let h = 0;

  for (let i=0;i<str.length;i++) {
    h =
      Math.imul(31,h)
      + str.charCodeAt(i)
      | 0;
  }

  return h;
}

function loadStats() {

  return JSON.parse(
    localStorage.getItem("quarterly45Stats")
    || "{}"
  );
}
