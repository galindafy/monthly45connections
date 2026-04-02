(() => {
  const GROUP_COUNT = 45;
  const GROUP_SIZE = 45;
  const SHAKE_MS = 320;

  const SUPPLEMENTAL_CATEGORIES = [
    makeCategory('cheeses', ["cheddar","mozzarella","brie","camembert","gouda","parmesan","pecorino","asiago","provolone","havarti","feta","halloumi","ricotta","mascarpone","stilton","gorgonzola","roquefort","blue cheese","colby","monterey jack","pepper jack","swiss","emmental","gruyere","raclette","fontina","burrata","paneer","cotija","queso fresco","manchego","mimolette","jarlsberg","edam","limburger","comte","taleggio","reblochon","double gloucester","wensleydale","cheshire","caerphilly","red leicester","neufchatel","cantal"]),
    makeCategory('breads', ["baguette","sourdough","ciabatta","brioche","focaccia","pita","naan","rye","multigrain","whole wheat","white bread","pretzel roll","kaiser roll","croissant","pain de mie","challah","matzo","lavash","flatbread","cornbread","english muffin","breadstick","pretzel","roti","paratha","tortilla","arepa","injera","panettone","soda bread","pumpernickel","irish brown bread","bannock","crumpet","scali bread","olive bread","potato bread","milk bread","teacake","barmbrack","kulcha","bolillo","damper","brotchen","shokupan"]),
    makeCategory('desserts', ["brownie","cupcake","donut","eclair","macaron","meringue","trifle","tiramisu","cheesecake","shortcake","pavlova","baklava","cannoli","crepe cake","fruit tart","bread pudding","rice pudding","ice cream cake","lemon bar","blondie","fudge","mousse","sundae","parfait","sorbet","gelato","apple pie","pecan pie","pumpkin pie","banana split","crumble","cobbler","flan","creme brulee","profiterole","opera cake","madeleine","napoleon","biscotti","whoopie pie","snickerdoodle","churro","beignet","semifreddo","poached pear"]),
    makeCategory('philosophers', ["Plato","Aristotle","Socrates","Epicurus","Zeno of Citium","Marcus Aurelius","St. Augustine","Thomas Aquinas","Rene Descartes","Baruch Spinoza","John Locke","David Hume","Immanuel Kant","G.W.F. Hegel","Arthur Schopenhauer","Soren Kierkegaard","Friedrich Nietzsche","Karl Marx","John Stuart Mill","Bertrand Russell","Ludwig Wittgenstein","Jean-Paul Sartre","Simone de Beauvoir","Albert Camus","Hannah Arendt","Michel Foucault","Jacques Derrida","Gilles Deleuze","Emmanuel Levinas","Edmund Husserl","Martin Heidegger","Maurice Merleau-Ponty","Thomas Hobbes","Jean-Jacques Rousseau","Voltaire","Montesquieu","Blaise Pascal","Gottfried Wilhelm Leibniz","Ayn Rand","Martha Nussbaum","Judith Butler","Alasdair MacIntyre","Richard Rorty","Isaiah Berlin","Cornel West"]),
    makeCategory('scientists', ["Isaac Newton","Albert Einstein","Marie Curie","Charles Darwin","Galileo Galilei","Nikola Tesla","Michael Faraday","Gregor Mendel","Louis Pasteur","Rosalind Franklin","Alan Turing","Ada Lovelace","Niels Bohr","Max Planck","Johannes Kepler","James Clerk Maxwell","Erwin Schrodinger","Richard Feynman","Stephen Hawking","Carl Sagan","Rachel Carson","Barbara McClintock","Jane Goodall","Dorothy Hodgkin","Lise Meitner","Subrahmanyan Chandrasekhar","Enrico Fermi","Paul Dirac","Linus Pauling","Jonas Salk","Alexander Fleming","Robert Hooke","Antonie van Leeuwenhoek","Edwin Hubble","Sally Ride","Katherine Johnson","Chien-Shiung Wu","Vera Rubin","Jagdish Chandra Bose","Tu Youyou","Jennifer Doudna","Emmanuelle Charpentier","Tim Berners-Lee","Francis Crick","Rosalyn Yalow"]),
    makeCategory('poets', ["Emily Dickinson","Walt Whitman","Robert Frost","Langston Hughes","Sylvia Plath","Maya Angelou","T.S. Eliot","W.B. Yeats","Seamus Heaney","Elizabeth Bishop","Allen Ginsberg","Adrienne Rich","Carol Ann Duffy","Ted Hughes","John Keats","Percy Bysshe Shelley","William Wordsworth","Samuel Taylor Coleridge","Lord Byron","Alexander Pope","John Donne","Geoffrey Chaucer","Philip Larkin","Dylan Thomas","Christina Rossetti","Edgar Allan Poe","E.E. Cummings","Gwendolyn Brooks","Audre Lorde","Louise Gluck","Ocean Vuong","Anne Carson","Sappho","Virgil","Ovid","Rainer Maria Rilke","Pablo Neruda","Federico Garcia Lorca","Paul Celan","Alicia Ostriker","Denise Levertov","Muriel Rukeyser","Robert Lowell","Wallace Stevens","A.E. Housman"]),
    makeCategory('painters', ["Pablo Picasso","Vincent van Gogh","Claude Monet","Rembrandt","Johannes Vermeer","Edgar Degas","Paul Cezanne","Henri Matisse","Wassily Kandinsky","Jackson Pollock","Georgia O'Keeffe","Frida Kahlo","Salvador Dali","Edvard Munch","Pierre-Auguste Renoir","Paul Klee","Joan Miro","Gustav Klimt","Jan van Eyck","Sandro Botticelli","Michelangelo","Raphael","Titian","El Greco","Caravaggio","Diego Velazquez","Francisco Goya","J.M.W. Turner","John Constable","Caspar David Friedrich","Mary Cassatt","Berthe Morisot","Camille Pissarro","Georges Seurat","Amedeo Modigliani","Marc Chagall","Henri Rousseau","Egon Schiele","Piet Mondrian","Willem de Kooning","Edward Hopper","Grant Wood","Winslow Homer","Thomas Eakins","Lucian Freud"]),
    makeCategory('directors', ["Steven Spielberg","Martin Scorsese","Christopher Nolan","Greta Gerwig","Spike Lee","Sofia Coppola","Ridley Scott","James Cameron","Kathryn Bigelow","Guillermo del Toro","Wes Anderson","David Fincher","Quentin Tarantino","Patty Jenkins","Bong Joon Ho","Denis Villeneuve","Jordan Peele","Chloe Zhao","Ava DuVernay","Alfred Hitchcock","Francis Ford Coppola","Peter Jackson","Tim Burton","Stanley Kubrick","Akira Kurosawa","Hayao Miyazaki","Ang Lee","Jane Campion","Jonathan Demme","David Lynch","Roman Polanski","Sam Mendes","Joel Coen","Ethan Coen","Barry Jenkins","Todd Haynes","Mike Leigh","Ken Loach","Clint Eastwood","John Ford","Orson Welles","Paul Thomas Anderson","Robert Altman","Howard Hawks","John Carpenter"]),
    makeCategory('capitals', ["Paris","Berlin","Rome","Madrid","Lisbon","Amsterdam","Brussels","Stockholm","Oslo","Copenhagen","Helsinki","Warsaw","Vienna","Athens","Dublin","Reykjavik","Bucharest","Budapest","Zagreb","Belgrade","Bratislava","Ljubljana","Tallinn","Riga","Vilnius","Bern","Kyiv","Tirana","Andorra la Vella","Minsk","Sarajevo","Sofia","Nicosia","Prague","Luxembourg","Valletta","Chisinau","Podgorica","Skopje","San Marino","Pristina","Vaduz","Monaco","Ankara","Vatican City"]),
    makeCategory('cleaning-supplies', ["broom","mop","dustpan","vacuum","bucket","sponge","dish soap","laundry detergent","bleach","glass cleaner","all-purpose cleaner","scrub brush","toilet brush","plunger","rubber gloves","microfibre cloth","feather duster","paper towel","garbage bag","spray bottle","magic eraser","floor cleaner","furniture polish","air freshener","disinfecting wipes","lint roller","carpet cleaner","drain cleaner","toilet cleaner","oven cleaner","steel wool","soap scum remover","dust mop","window squeegee","stain remover","fabric refresher","dishwasher detergent","dryer sheet","laundry basket","caddy","recycling bin","hand soap","vinegar","baking soda","spin mop"]),
    makeCategory('mythological-figures', ["Zeus","Hera","Poseidon","Demeter","Athena","Apollo","Artemis","Ares","Aphrodite","Hermes","Hephaestus","Dionysus","Hades","Persephone","Hestia","Eros","Nike","Nemesis","Hypnos","Thanatos","Hecate","Pan","Selene","Helios","Gaia","Uranus","Cronus","Rhea","Atlas","Prometheus","Epimetheus","Perseus","Heracles","Theseus","Jason","Medea","Orpheus","Eurydice","Achilles","Patroclus","Odysseus","Penelope","Circe","Cassandra","Andromeda"]),
    makeCategory('dinosaurs', ["Tyrannosaurus","Triceratops","Stegosaurus","Velociraptor","Brachiosaurus","Apatosaurus","Diplodocus","Ankylosaurus","Allosaurus","Spinosaurus","Iguanodon","Parasaurolophus","Carnotaurus","Compsognathus","Gallimimus","Pachycephalosaurus","Styracosaurus","Deinonychus","Microraptor","Archaeopteryx","Coelophysis","Plateosaurus","Maiasaura","Hadrosaurus","Edmontosaurus","Giganotosaurus","Ceratosaurus","Dilophosaurus","Kentrosaurus","Euoplocephalus","Oviraptor","Troodon","Albertosaurus","Corythosaurus","Protoceratops","Suchomimus","Acrocanthosaurus","Torosaurus","Psittacosaurus","Saltasaurus","Mussaurus","Ouranosaurus","Monolophosaurus","Rugops","Herrerasaurus"]),
    makeCategory('mushrooms', ["button mushroom","cremini","portobello","shiitake","oyster mushroom","enoki","chanterelle","morel","porcini","maitake","beech mushroom","king trumpet","wood ear","lion's mane","nameko","black trumpet","hedgehog mushroom","matsutake","cloud ear","chicken of the woods","hen of the woods","puffball","blewit","honey fungus","cauliflower mushroom","lobster mushroom","pioppino","shimeji","straw mushroom","peppery milkcap","saffron milk cap","charcoal burner","parasol mushroom","ink cap","fairy ring mushroom","birch bolete","bay bolete","slippery jack","scarlet elf cup","winter chanterelle","elm oyster","amethyst deceiver","velvet shank","split gill","orange peel fungus"]),
    makeCategory('birds', ["sparrow","robin","blue jay","cardinal","goldfinch","crow","raven","eagle","hawk","falcon","owl","woodpecker","hummingbird","swallow","starling","wren","warbler","oriole","blackbird","mockingbird","thrush","loon","pelican","heron","egret","flamingo","parrot","macaw","cockatoo","parakeet","pigeon","dove","quail","pheasant","turkey","goose","duck","swan","kingfisher","osprey","vulture","condor","kestrel","nuthatch","chickadee"]),
    makeCategory('insects', ["ant","bee","wasp","hornet","butterfly","moth","beetle","ladybug","dragonfly","damselfly","grasshopper","cricket","locust","mantis","termite","mosquito","gnat","fly","fruit fly","housefly","flea","louse","aphid","cicada","leafhopper","stink bug","firefly","weevil","earwig","silverfish","mayfly","stonefly","caddisfly","lacewing","dobsonfly","walking stick","katydid","cockroach","bark beetle","dung beetle","chafer","blister beetle","sawfly","horsefly","midge"]),
    makeCategory('elements', ["hydrogen","helium","lithium","beryllium","boron","carbon","nitrogen","oxygen","fluorine","neon","sodium","magnesium","aluminum","silicon","phosphorus","sulfur","chlorine","argon","potassium","calcium","scandium","titanium","vanadium","chromium","manganese","iron","cobalt","nickel","copper","zinc","gallium","germanium","arsenic","selenium","bromine","krypton","rubidium","strontium","yttrium","zirconium","niobium","molybdenum","technetium","ruthenium","rhodium"])
  ];

  const STATUS_EL = document.getElementById('megaStatus');
  const BOARD_EL = document.getElementById('megaBoard');
  const SHUFFLE_BTN = document.getElementById('shuffleBtn');
  const DESELECT_BTN = document.getElementById('deselectBtn');

  const CATEGORY_BANK = [...(window.CATEGORY_BANK || []), ...SUPPLEMENTAL_CATEGORIES];
  const STORAGE_KEY = `connections45:${getWeekInfo().key}`;

  let state = loadState() || buildWeeklyState();
  if (!isValidState(state)) {
    state = buildWeeklyState();
  }

  wireControls();
  render();

  function wireControls() {
    if (SHUFFLE_BTN) SHUFFLE_BTN.addEventListener('click', shuffleOpenTiles);
    if (DESELECT_BTN) DESELECT_BTN.addEventListener('click', () => {
      state.selected = [];
      saveState();
      render();
    });
  }

  function buildWeeklyState() {
    const categories = pickWeeklyCategories();
    const tiles = [];
    categories.forEach((category, groupIndex) => {
      category.items.forEach((item, itemIndex) => {
        tiles.push({
          id: `g${groupIndex}-i${itemIndex}`,
          group: groupIndex,
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
      tiles: shuffleArray(tiles, seededRandom(hashString(getWeekInfo().key + ':tiles')))
    };
  }

  function pickWeeklyCategories() {
    const tries = 500;
    const seedBase = hashString(getWeekInfo().key + ':cats');
    let best = [];

    for (let attempt = 0; attempt < tries; attempt += 1) {
      const rng = seededRandom(seedBase + attempt * 9973);
      const shuffled = shuffleArray(CATEGORY_BANK, rng);
      const chosen = [];
      const used = new Set();

      for (const category of shuffled) {
        if (!isValidCategory(category)) continue;
        if (category.items.some(item => used.has(normalize(item)))) continue;
        chosen.push(category);
        category.items.forEach(item => used.add(normalize(item)));
        if (chosen.length === GROUP_COUNT) return chosen;
      }

      if (chosen.length > best.length) best = chosen;
    }

    if (best.length < GROUP_COUNT) {
      throw new Error(`Only found ${best.length} duplicate-free categories. Need ${GROUP_COUNT}.`);
    }
    return best;
  }

  function isValidCategory(category) {
    return category && Array.isArray(category.items) && category.items.length === GROUP_SIZE && new Set(category.items.map(normalize)).size === GROUP_SIZE;
  }

  function handleTileClick(id) {
    const idx = state.tiles.findIndex(tile => tile.id === id);
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

    state.tiles[i2] = {
      ...t2,
      items: mergedItems,
      text: formatPreview(mergedItems),
      locked: mergedItems.length === GROUP_SIZE
    };
    state.tiles.splice(i1, 1);

    if (state.tiles[i2] && state.tiles[i2].locked) {
      moveSolvedGroupToTop(state.tiles[i2].group);
    }
  }

  function moveSolvedGroupToTop(group) {
    const groupTiles = state.tiles.filter(tile => tile.group === group);
    const others = state.tiles.filter(tile => tile.group !== group);
    state.tiles = [...groupTiles, ...others];
  }

  function shuffleOpenTiles() {
    const rng = seededRandom(hashString(`${getWeekInfo().key}:shuffle:${state.tiles.length}:${state.mistakes}:${state.score}`));
    const locked = state.tiles.filter(tile => tile.locked);
    const open = state.tiles.filter(tile => !tile.locked);
    state.tiles = [...locked, ...shuffleArray(open, rng)];
    state.selected = [];
    saveState();
    render();
  }

  function countSolvedGroups() {
    const solved = new Set();
    state.tiles.forEach(tile => {
      if (tile.locked) solved.add(tile.group);
    });
    return solved.size;
  }

  function formatPreview(items) {
    if (items.length <= 2) return items.join(', ');
    return `${items[0]}, ${items[1]}, ... [${items.length}]`;
  }

  function render(shakeIds = []) {
    if (!STATUS_EL || !BOARD_EL) return;

    const week = getWeekInfo();
    STATUS_EL.innerHTML = [
      `<span>Week ${week.week}, ${week.year}</span>`,
      `<span>Score ${state.score}</span>`,
      `<span>Mistakes ${state.mistakes}</span>`
    ].join('');

    BOARD_EL.innerHTML = '';

    state.tiles.forEach((tile, idx) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'tile';
      if (tile.items.length === 1) el.classList.add('single');
      else el.classList.add('merged');
      if (tile.locked) {
        el.classList.add('solved-tile');
        el.style.background = solvedColour(tile.group);
      }
      if (state.selected.includes(idx)) el.classList.add('selected');
      if (shakeIds.includes(tile.id)) el.classList.add('shake');
      el.textContent = tile.text;
      el.addEventListener('click', () => handleTileClick(tile.id));

      if (tile.items.length > 2) {
        el.classList.add('hoverable');
        const hover = document.createElement('div');
        hover.className = 'hover-content';
        hover.textContent = tile.items.join(', ');
        el.appendChild(hover);
      }

      BOARD_EL.appendChild(el);
    });
  }

  function solvedColour(group) {
    const colours = ['var(--yellow)', 'var(--green)', 'var(--blue)', 'var(--purple)'];
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
    return value
      && Array.isArray(value.tiles)
      && Array.isArray(value.selected)
      && typeof value.mistakes === 'number'
      && typeof value.score === 'number'
      && value.tiles.every(tile => tile && typeof tile.id === 'string' && typeof tile.group === 'number' && Array.isArray(tile.items));
  }

  function getWeekInfo() {
    const d = new Date();
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return { year: date.getUTCFullYear(), week, key: `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}` };
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
    return String(value).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function uniquePreserveOrder(items) {
    const seen = new Set();
    const out = [];
    items.forEach(item => {
      const key = normalize(item);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    });
    return out;
  }

  function makeCategory(id, items) {
    return { id, title: id, items };
  }
})();
