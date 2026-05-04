const BOARD = document.getElementById("board");
const STATUS = document.getElementById("status");

let state = init();

render();

/* INIT */

function init() {
  validateBank(CATEGORY_BANK);

  const cats = pickCategories();

  const tiles = [];

  cats.forEach((c, gi) => {
    c.items.forEach(item => {
      tiles.push({
        text: item.text,
        group: gi,
        decoys: item.decoys || [],
        items: [item.text],
        title: c.title,
        solved: false
      });
    });
  });

  return {
    tiles: shuffle(tiles),
    selected: [],
    score: 0,
    mistakes: 0,
    streak: load("streak") || 0
  };
}

/* CATEGORY PICKER (NO REPEATS) */

function pickCategories() {
  const used = new Set(JSON.parse(localStorage.getItem("used") || "[]"));

  let available = CATEGORY_BANK.filter(c => !used.has(c.id));

  if (available.length < 45) {
    localStorage.setItem("used", "[]");
    available = CATEGORY_BANK;
  }

  const chosen = shuffle(available).slice(0, 45);

  localStorage.setItem("used", JSON.stringify([
    ...used,
    ...chosen.map(c => c.id)
  ]));

  return injectTraps(chosen);
}

/* TRICK LOGIC */

function injectTraps(cats) {
  const map = {};

  cats.forEach(c => {
    c.items.forEach(i => {
      map[i.text] = map[i.text] || [];
      map[i.text].push(c.title);
    });
  });

  cats.forEach(c => {
    c.items.forEach(i => {
      if (map[i.text].length > 1) {
        i.decoys = map[i.text].filter(x => x !== c.title);
      }
    });
  });

  return cats;
}

/* GAME */

function clickTile(i) {
  if (state.selected.includes(i)) {
    state.selected = state.selected.filter(x => x !== i);
    return render();
  }

  state.selected.push(i);

  if (state.selected.length >= 2) {
    attemptMerge();
  }

  render();
}

function attemptMerge() {
  const tiles = state.selected.map(i => state.tiles[i]);
  const groups = new Set(tiles.map(t => t.group));

  if (groups.size !== 1) {
    state.mistakes++;
    shake();
    state.selected = [];
    return;
  }

  merge(state.selected);
  state.selected = [];
}

function merge(indices) {
  const base = indices[0];
  let merged = [];

  indices.forEach(i => {
    merged = [...merged, ...state.tiles[i].items];
  });

  merged = [...new Set(merged)];

  const done = merged.length === 45;

  state.tiles[base] = {
    ...state.tiles[base],
    items: merged,
    text: done
      ? state.tiles[base].title
      : `${merged[0]}, ${merged[1]} ... [${merged.length}]`,
    solved: done
  };

  indices.slice(1).sort((a,b)=>b-a).forEach(i => state.tiles.splice(i,1));

  if (done) {
    state.score++;
    state.streak++;
    save("streak", state.streak);
  }
}

/* UI */

function render() {
  BOARD.innerHTML = "";

  STATUS.innerHTML = `
    Score ${state.score} |
    Mistakes ${state.mistakes} |
    Streak ${state.streak}
  `;

  state.tiles.forEach((t,i)=>{
    const el = document.createElement("div");
    el.className = "tile";

    if (state.selected.includes(i)) el.classList.add("selected");
    if (t.solved) el.classList.add("solved");

    el.textContent = t.text;
    el.title = t.solved ? t.items.join(", ") : "";

    el.onclick = ()=>clickTile(i);

    BOARD.appendChild(el);
  });
}

/* HELPERS */

function shuffle(a){ return [...a].sort(()=>Math.random()-0.5); }

function validateBank(bank){
  const seen = new Set();
  bank.forEach(c=>{
    c.items.forEach(i=>{
      const key = i.text.toLowerCase();
      if(seen.has(key)) throw new Error("Duplicate: "+i.text);
      seen.add(key);
    });
  });
}

function shake(){
  BOARD.classList.add("shake");
  setTimeout(()=>BOARD.classList.remove("shake"),300);
}

function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }
function load(k){ return JSON.parse(localStorage.getItem(k)); }

/* SHARE */

document.getElementById("shareBtn").onclick = () => {
  const txt = `Connections 45x45\nScore: ${state.score}\nMistakes: ${state.mistakes}\nStreak: ${state.streak}`;
  navigator.clipboard.writeText(txt);
  alert("Copied!");
};
