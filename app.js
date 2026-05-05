const BOARD = document.getElementById("board");
const STATUS = document.getElementById("status");

const PERIOD_KEY = getQuarterKey();
const HISTORY_KEY = "connections:q:used";

let state = init();
render();

/* ---------- INIT ---------- */
function init() {
  const cats = pickQuarterCategories();

  const tiles = [];
  cats.forEach((c, gi) => {
    c.items.forEach(item => {
      tiles.push({
        text: item.text,
        group: gi,
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
    mistakes: 0
  };
}

/* ---------- QUARTER PICKER (no repeats across quarters) ---------- */
function pickQuarterCategories() {
  const all = CATEGORY_BANK.slice(); // 180 built at runtime
  let used = loadSet(HISTORY_KEY);

  let available = all.filter(c => !used.has(c.id));
  if (available.length < 45) {
    used = new Set();
    available = all;
  }

  const chosen = shuffleSeeded(available, hash(PERIOD_KEY)).slice(0, 45);

  chosen.forEach(c => used.add(c.id));
  saveSet(HISTORY_KEY, used);

  return chosen;
}

function getQuarterKey() {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-Q${q}`;
}

/* ---------- GAME ---------- */
function clickTile(i) {
  if (state.selected.includes(i)) {
    state.selected = state.selected.filter(x => x !== i);
    return render();
  }

  state.selected.push(i);
  if (state.selected.length >= 2) attemptMerge();
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

  indices.forEach(i => merged.push(...state.tiles[i].items));
  merged = [...new Set(merged)];

  const done = merged.length === 45;

  state.tiles[base] = {
    ...state.tiles[base],
    items: merged,
    text: done ? state.tiles[base].title
               : `${merged[0]}, ${merged[1]} ... [${merged.length}]`,
    solved: done
  };

  indices.slice(1).sort((a,b)=>b-a).forEach(i => state.tiles.splice(i,1));

  if (done) state.score++;
}

/* ---------- UI ---------- */
function render() {
  BOARD.innerHTML = "";
  STATUS.innerHTML = `Score ${state.score} | Mistakes ${state.mistakes}`;

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

/* ---------- HELPERS ---------- */
function shuffle(a){ return [...a].sort(()=>Math.random()-0.5); }

function shuffleSeeded(arr, seed) {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function shake(){
  BOARD.classList.add("shake");
  setTimeout(()=>BOARD.classList.remove("shake"),300);
}

function saveSet(k,set){ localStorage.setItem(k, JSON.stringify([...set])); }
function loadSet(k){ try { return new Set(JSON.parse(localStorage.getItem(k)||"[]")); } catch { return new Set(); } }

function shuffleBoard(){ state.tiles = shuffle(state.tiles); render(); }
function deselect(){ state.selected = []; render(); }

function share() {
  const txt = `Connections 45x45\nScore: ${state.score}\nMistakes: ${state.mistakes}`;
  navigator.clipboard.writeText(txt);
  alert("Copied!");
}
