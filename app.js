document.addEventListener("DOMContentLoaded", () => {

const BOARD_SIZE = 45;
const GROUP_SIZE = 45;

let state = {
  tiles: [],
  selected: []
};

/* ---------- DATA (clean + no duplicates) ---------- */

const POOLS = [
  ["spaghetti","penne","rigatoni","fusilli","farfalle","linguine","fettuccine","ravioli","tortellini","gnocchi","ziti","macaroni","cavatappi","rotini","bucatini","orecchiette","pappardelle","lasagna","tagliatelle","vermicelli","angel hair","ditalini","manicotti","capellini","gemelli","mafaldine","radiatori","campanelle","strozzapreti","paccheri","anelletti","bigoli","casarecce","trofie","malloreddus","lumache","fregola","mezzi rigatoni","spaghettini","cellentani","tubetti","sedani","filini","orzo","cannelloni"],
  ["basil","oregano","thyme","rosemary","cumin","turmeric","paprika","cinnamon","nutmeg","clove","cardamom","parsley","dill","sage","tarragon","sumac","za'atar","bay leaf","fennel","anise","chives","mint","marjoram","caraway","coriander","ginger","allspice","saffron","vanilla","sesame","mustard seed","celery seed","fenugreek","star anise","lemongrass","chili powder","cayenne","garlic powder","onion powder","smoked paprika","herbes de provence","lovage","savory","asafoetida","nigella"],
  ["France","Germany","Italy","Spain","Portugal","Netherlands","Belgium","Sweden","Norway","Denmark","Finland","Poland","Austria","Greece","Ireland","Iceland","Romania","Hungary","Croatia","Serbia","Slovakia","Slovenia","Estonia","Latvia","Lithuania","Switzerland","Ukraine","Albania","Andorra","Belarus","Bosnia","Bulgaria","Cyprus","Czech Republic","Luxembourg","Malta","Moldova","Montenegro","North Macedonia","San Marino","Kosovo","Liechtenstein","Monaco","Turkey","Vatican City"]
];

/* ---------- INIT ---------- */

generateBoard();
render();

/* ---------- BOARD ---------- */

function generateBoard() {
  let tiles = [];

  for (let g = 0; g < BOARD_SIZE; g++) {
    const pool = POOLS[g % POOLS.length];

    for (let i = 0; i < GROUP_SIZE; i++) {
      const item = pool[i % pool.length] + " " + g; // guarantees uniqueness

      tiles.push({
        id: crypto.randomUUID(),
        text: item,
        group: g,
        items: [item],
        locked: false
      });
    }
  }

  state.tiles = shuffle(tiles);
}

/* ---------- INTERACTION ---------- */

function handleClick(id) {
  const idx = state.tiles.findIndex(t => t.id === id);
  if (idx === -1) return;

  const tile = state.tiles[idx];
  if (tile.locked) return;

  if (state.selected.length === 0) {
    state.selected = [idx];
    render();
    return;
  }

  const firstIdx = state.selected[0];
  const firstTile = state.tiles[firstIdx];

  if (firstTile.group !== tile.group) {
    render([firstTile.id, tile.id]); // shake
    state.selected = [];
    return;
  }

  merge(firstIdx, idx);
  state.selected = [];
  render();
}

function merge(i1, i2) {
  const t1 = state.tiles[i1];
  const t2 = state.tiles[i2];

  const merged = [...new Set([...t1.items, ...t2.items])];

  state.tiles[i2] = {
    ...t2,
    items: merged,
    text: formatPreview(merged),
    locked: merged.length === GROUP_SIZE
  };

  state.tiles.splice(i1, 1);
}

function formatPreview(items) {
  if (items.length <= 2) return items.join(", ");
  return `${items[0]}, ${items[1]}, ... [${items.length}]`;
}

/* ---------- RENDER ---------- */

function render(shakeIds = []) {
  const board = document.querySelector(".board");
  if (!board) return;

  board.innerHTML = "";

  state.tiles.forEach((tile, i) => {
    const div = document.createElement("div");
    div.className = "tile";

    if (state.selected.includes(i)) div.classList.add("selected");
    if (shakeIds.includes(tile.id)) div.classList.add("shake");

    div.textContent = tile.text;

    if (tile.items.length > 2) {
      div.classList.add("hoverable");

      const hover = document.createElement("div");
      hover.className = "hover-content";
      hover.textContent = tile.items.join(", ");
      div.appendChild(hover);
    }

    div.onclick = () => handleClick(tile.id);
    board.appendChild(div);
  });
}

/* ---------- UTIL ---------- */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

});
