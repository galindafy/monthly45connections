const BOARD = document.getElementById("board");
const STATUS = document.getElementById("status");

let state = init();

render();

function init() {
  const cats = CATEGORY_BANK.slice(0, 45);

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

  if (done) state.score++;
}

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

function shuffle(a){ return [...a].sort(()=>Math.random()-0.5); }

function shuffleBoard() {
  state.tiles = shuffle(state.tiles);
  render();
}

function deselect() {
  state.selected = [];
  render();
}

function shake(){
  BOARD.classList.add("shake");
  setTimeout(()=>BOARD.classList.remove("shake"),300);
}

function share() {
  const txt = `Connections 45x45\nScore: ${state.score}\nMistakes: ${state.mistakes}`;
  navigator.clipboard.writeText(txt);
  alert("Copied!");
}
