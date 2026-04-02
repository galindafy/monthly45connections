document.addEventListener("DOMContentLoaded", () => {

const BOARD_SIZE = 45;
const GROUP_SIZE = 45;

let state = {
  tiles: [],
  selected: []
};

/* ---------- LARGE CURATED DATA ---------- */

const DATA = {
  pasta: [
    "spaghetti","penne","rigatoni","fusilli","farfalle","linguine","fettuccine",
    "ravioli","tortellini","gnocchi","ziti","macaroni","cavatappi","rotini",
    "bucatini","orecchiette","pappardelle","lasagna","tagliatelle","vermicelli",
    "angel hair","ditalini","manicotti","capellini","gemelli","mafaldine",
    "radiatori","campanelle","strozzapreti","paccheri","anelletti","bigoli",
    "casarecce","trofie","malloreddus","lumache","fregola","mezzi rigatoni",
    "spaghettini","cellentani","tubetti","sedani","filini","orzo","cannelloni"
  ],

  spices: [
    "basil","oregano","thyme","rosemary","cumin","turmeric","paprika","cinnamon",
    "nutmeg","clove","cardamom","parsley","dill","sage","tarragon","sumac",
    "za'atar","bay leaf","fennel","anise","chives","mint","marjoram","caraway",
    "coriander","ginger","allspice","saffron","vanilla","sesame","mustard seed",
    "celery seed","fenugreek","star anise","lemongrass","chili powder","cayenne",
    "garlic powder","onion powder","smoked paprika","herbes de provence","lovage",
    "savory","asafoetida","nigella"
  ],

  countries: [
    "France","Germany","Italy","Spain","Portugal","Netherlands","Belgium","Sweden",
    "Norway","Denmark","Finland","Poland","Austria","Greece","Ireland","Iceland",
    "Romania","Hungary","Croatia","Serbia","Slovakia","Slovenia","Estonia","Latvia",
    "Lithuania","Switzerland","Ukraine","Albania","Andorra","Belarus","Bosnia",
    "Bulgaria","Cyprus","Czech Republic","Luxembourg","Malta","Moldova","Montenegro",
    "North Macedonia","San Marino","Kosovo","Liechtenstein","Monaco","Turkey","Vatican City"
  ],

  office: [
    "printer","stapler","notebook","pen","pencil","monitor","keyboard","mouse","desk",
    "chair","whiteboard","calendar","folder","binder","paper clips","tape","scissors",
    "highlighter","envelope","sticky notes","scanner","phone","lamp","filing cabinet",
    "push pins","rubber bands","clipboard","hole punch","label maker","shredder",
    "desk pad","mail tray","eraser","ruler","extension cord","surge protector",
    "dry erase marker","bulletin board","ink cartridge","toner","calculator","mug",
    "paper ream","lanyard","name badge"
  ],

  dogBreeds: [
    "Labrador Retriever","Golden Retriever","German Shepherd","French Bulldog",
    "Poodle","Beagle","Rottweiler","Dachshund","Siberian Husky","Boxer",
    "Doberman Pinscher","Great Dane","Shih Tzu","Chihuahua","Border Collie",
    "Australian Shepherd","Cocker Spaniel","Boston Terrier","Pug","Mastiff",
    "Saint Bernard","Bichon Frise","Akita","Samoyed","Weimaraner",
    "Newfoundland","Bernese Mountain Dog","Malinois","Greyhound","Whippet",
    "Papillon","Pomeranian","Bull Terrier","Cane Corso","Shar Pei",
    "Alaskan Malamute","Basenji","Bloodhound","Dalmatian","English Bulldog",
    "Fox Terrier","Irish Setter","Jack Russell Terrier","Vizsla","Yorkshire Terrier"
  ],

  actors: [
    "Tom Hanks","Meryl Streep","Denzel Washington","Cate Blanchett","Leonardo DiCaprio",
    "Viola Davis","Brad Pitt","Nicole Kidman","Robert De Niro","Emma Stone",
    "Ryan Gosling","Julia Roberts","Samuel L. Jackson","Sandra Bullock",
    "Christian Bale","Charlize Theron","Matt Damon","Jodie Foster","Idris Elba",
    "Amy Adams","Harrison Ford","Scarlett Johansson","Jake Gyllenhaal",
    "Saoirse Ronan","Mahershala Ali","Frances McDormand","Cillian Murphy",
    "Florence Pugh","Angela Bassett","Benedict Cumberbatch","Rachel Weisz",
    "Colin Farrell","Margot Robbie","Willem Dafoe","Michelle Yeoh",
    "Keanu Reeves","Jeff Bridges","Naomi Watts","Paul Mescal","Pedro Pascal",
    "Zendaya","Andrew Garfield","Regina King","Carey Mulligan","Ayo Edebiri"
  ]
};

/* ---------- BUILD UNIQUE GROUPS ---------- */

function generateBoard() {
  const categories = Object.values(DATA);

  let used = new Set();
  let tiles = [];

  for (let g = 0; g < BOARD_SIZE; g++) {
    const base = categories[g % categories.length];

    // shuffle copy
    const pool = shuffle([...base]);

    let groupItems = [];

    for (let item of pool) {
      if (!used.has(item)) {
        groupItems.push(item);
        used.add(item);
      }
      if (groupItems.length === GROUP_SIZE) break;
    }

    // fallback if not enough unique (should rarely happen)
    while (groupItems.length < GROUP_SIZE) {
      groupItems.push(base[groupItems.length % base.length] + " alt");
    }

    groupItems.forEach(item => {
      tiles.push({
        id: crypto.randomUUID(),
        text: item,
        group: g,
        items: [item],
        locked: false
      });
    });
  }

  state.tiles = shuffle(tiles);
}

/* ---------- INTERACTION ---------- */

function handleClick(id) {
  const idx = state.tiles.findIndex(t => t.id === id);
  const tile = state.tiles[idx];
  if (!tile || tile.locked) return;

  if (state.selected.length === 0) {
    state.selected = [idx];
    render();
    return;
  }

  const firstIdx = state.selected[0];
  const first = state.tiles[firstIdx];

  if (first.group !== tile.group) {
    render([first.id, tile.id]);
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

/* ---------- INIT ---------- */

generateBoard();
render();

});
