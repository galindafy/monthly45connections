const BOARD_SIZE = 45;
const GROUP_SIZE = 45;
const WEEK_KEY = getWeekKey();

let state = {
  tiles: [],
  selected: [],
};

init();

/* ---------- INIT ---------- */

function init() {
  const saved = localStorage.getItem(WEEK_KEY);
  if (saved) {
    state = JSON.parse(saved);
    render();
    return;
  }

  generateBoard();
  save();
  render();
}

function getWeekKey() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `connections45_${d.getFullYear()}_${week}`;
}

/* ---------- DATA ---------- */

const DATASETS = [
  uniqueFill([
    "spaghetti","penne","rigatoni","fusilli","farfalle","linguine","fettuccine",
    "ravioli","tortellini","gnocchi","ziti","macaroni","cavatappi","rotini"
  ]),
  uniqueFill([
    "basil","oregano","thyme","rosemary","cumin","turmeric","paprika","cinnamon",
    "nutmeg","clove","cardamom","parsley","dill","sage","tarragon"
  ]),
  uniqueFill([
    "california","texas","florida","new york","illinois","ohio","georgia",
    "arizona","nevada","oregon","utah","colorado","washington","virginia"
  ]),
  uniqueFill([
    "france","germany","italy","spain","portugal","netherlands","belgium",
    "sweden","norway","denmark","finland","poland","austria","greece"
  ]),
  uniqueFill([
    "printer","stapler","notebook","pen","pencil","desk","chair","monitor",
    "keyboard","mouse","calendar","whiteboard","folder","binder"
  ]),
  generateNames(),
  generateMovies(),
  generateShows()
];

function uniqueFill(base) {
  const set = new Set(base);
  while (set.size < GROUP_SIZE) {
    set.add(base[Math.floor(Math.random() * base.length)]);
  }
  return [...set];
}

function generateNames() {
  const first = ["David","Emma","Liam","Olivia","Noah","Ava","Lucas","Mia"];
  const last = ["Smith","Johnson","Brown","Taylor","Anderson","White","Martin"];

  const set = new Set();
  while (set.size < GROUP_SIZE) {
    set.add(`${pick(first)} ${pick(last)}`);
  }
  return [...set];
}

function generateMovies() {
  return expandUnique([
    "The Matrix","Inception","Titanic","Avatar","Gladiator",
    "Interstellar","The Godfather","Pulp Fiction"
  ]);
}

function generateShows() {
  return expandUnique([
    "Breaking Bad","Stranger Things","The Office","Friends",
    "Lost","The Simpsons","The Crown"
  ]);
}

function expandUnique(arr) {
  const set = new Set(arr);
  while (set.size < GROUP_SIZE) {
    set.add(arr[Math.floor(Math.random() * arr.length)] + " " + Math.floor(Math.random()*100));
  }
  return [...set];
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- BOARD ---------- */

function generateBoard() {
  let tiles = [];

  for (let i = 0; i < 45; i++) {
    const dataset = pick(DATASETS);

    dataset.forEach(item => {
      tiles.push({
        id: crypto.randomUUID(),
        text: item,
        group: i,
        items: [item],
        locked: false
      });
    });
  }

  shuffle(tiles);
  state.tiles = tiles;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* ---------- INTERACTION ---------- */

function handleClick(id) {
  const idx = state.tiles.findIndex(t => t.id === id);
  const tile = state.tiles[idx];

  if (tile.locked) return;

  if (state.selected.length === 0) {
    state.selected = [idx];
  } else {
    const first = state.selected[0];
    merge(first, idx);
    state.selected = [];
  }

  save();
  render();
}

function merge(i1, i2) {
  if (i1 === i2) return;

  const t1 = state.tiles[i1];
  const t2 = state.tiles[i2];

  if (t1.group !== t2.group) return;

  const mergedItems = [...new Set([...t1.items, ...t2.items])];

  const newTile = {
    ...t2,
    items: mergedItems,
    text: formatPreview(mergedItems),
    locked: mergedItems.length === GROUP_SIZE
  };

  state.tiles[i2] = newTile;
  state.tiles.splice(i1, 1);

  if (newTile.locked) moveGroupToTop(newTile.group);
}

function formatPreview(items) {
  if (items.length <= 2) return items.join(", ");
  return `${items[0]}, ${items[1]}, ... [${items.length}]`;
}

function moveGroupToTop(group) {
  const groupTiles = state.tiles.filter(t => t.group === group);
  const others = state.tiles.filter(t => t.group !== group);
  state.tiles = [...groupTiles, ...others];
}

/* ---------- RENDER ---------- */

function render() {
  const board = document.querySelector(".board");
  board.innerHTML = "";

  state.tiles.forEach(tile => {
    const div = document.createElement("div");
    div.className = "tile";

    if (tile.locked) {
      div.classList.add("solved-tile");
      div.style.background = getColor(tile.group);
    }

    div.innerText = tile.text;

    if (tile.items.length > 2) {
      div.classList.add("hoverable");

      const hover = document.createElement("div");
      hover.className = "hover-content";
      hover.innerText = tile.items.join(", ");
      div.appendChild(hover);
    }

    div.onclick = () => handleClick(tile.id);
    board.appendChild(div);
  });
}

function getColor(i) {
  const colors = ["var(--yellow)","var(--green)","var(--blue)","var(--purple)"];
  return colors[i % 4];
}

/* ---------- SAVE ---------- */

function save() {
  localStorage.setItem(WEEK_KEY, JSON.stringify(state));
}
