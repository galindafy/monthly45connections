const CATEGORY_COUNT = 500;
const CATEGORY_SIZE = 45;
const MEGA_PICK_COUNT = 45;
const MINI_PICK_COUNT = 4;

const colourGroups = [
  { key: 'yellow', label: 'Straightforward', colour: 'var(--yellow)' },
  { key: 'green', label: 'Medium', colour: 'var(--green)' },
  { key: 'blue', label: 'Hard', colour: 'var(--blue)' },
  { key: 'purple', label: 'Tricky', colour: 'var(--purple)' }
];

const lexicons = {
  adjectives: ['Amber','Arctic','Autumn','Bitter','Black','Blue','Brass','Bright','Broken','Burning','Calm','Cedar','City','Clear','Cloud','Cold','Copper','Crimson','Crystal','Dark','Dawn','Deep','Desert','Electric','Emerald','Fallen','Fern','Final','First','Flint','Flying','Foggy','Forest','Golden','Grand','Green','Harbour','Hidden','High','Honey','Iron','Ivory','Jade','June','Lake','Last','Little','Lone','Long','Lucky','Marble','Midnight','Misty','Moon','Morning','Moss','Mountain','Neon','Night','North','Oak','Old','Open','Paper','Pearl','Pine','Prairie','Quiet','Rapid','Red','River','Rose','Royal','Ruby','Rust','Sable','Salt','Scarlet','Shadow','Silver','Small','Snow','Soft','Solar','Spring','Stone','Storm','Summer','Sunset','Swift','Tender','Thunder','True','Velvet','Violet','Warm','West','White','Wild','Winter','Wooden'],
  nouns: ['Anchor','Arcade','Ash','Beacon','Bell','Bird','Blossom','Bridge','Brook','Cabin','Candle','Canyon','Castle','Circle','Cloud','Coast','Comet','Creek','Crown','Daisy','Delta','Drive','Echo','Falcon','Field','Fire','Forest','Garden','Gate','Grove','Harbour','Haven','Hill','Horizon','House','Island','Junction','King','Lake','Lantern','Line','Market','Meadow','Moon','Mountain','Oak','Ocean','Orchard','Path','Peak','Pine','Plaza','Point','Prairie','River','Road','Rose','Shadow','Shore','Signal','Sky','Song','Spring','Square','Star','Station','Stone','Storm','Street','Summit','Sun','Temple','Thunder','Trail','Valley','View','Wave','Wharf','Wind','Yard'],
  professions: ['Accountant','Actor','Architect','Archivist','Artist','Astronomer','Attorney','Baker','Barber','Biologist','Builder','Butcher','Carpenter','Chef','Chemist','Clerk','Coach','Composer','Courier','Designer','Director','Doctor','Editor','Electrician','Engineer','Farmer','Florist','Geologist','Historian','Illustrator','Inspector','Journalist','Judge','Lawyer','Librarian','Magician','Manager','Mechanic','Merchant','Musician','Nurse','Painter','Pharmacist','Photographer','Pilot','Plumber','Poet','Professor','Programmer','Publisher','Ranger','Reporter','Researcher','Sailor','Scientist','Sculptor','Singer','Surveyor','Teacher','Technician','Translator','Veterinarian','Writer'],
  firstNames: ['Avery','Bailey','Bennett','Blair','Briar','Brook','Cameron','Casey','Charlie','Dakota','Drew','Eden','Elliot','Emerson','Finley','Frankie','Gray','Harper','Hayden','Jamie','Jordan','Kai','Kennedy','Lane','Logan','Marlowe','Morgan','Noel','Parker','Payton','Quinn','Reese','Riley','Robin','Rowan','Sage','Sawyer','Shay','Skyler','Spencer','Sydney','Tatum','Taylor','Winter'],
  surnames: ['Abbott','Alden','Archer','Bennett','Bishop','Bowen','Brooks','Carter','Chandler','Clarke','Collins','Dalton','Dawson','Ellis','Fletcher','Foster','Gardner','Griffin','Hawkins','Hayes','Holland','Hunter','Irving','Jensen','Keller','Lennox','Mercer','Monroe','Morris','Nash','Palmer','Parker','Quincy','Reed','Sawyer','Sloan','Spencer','Tanner','Turner','Vaughn','Walker','Warren','Whitaker','Wilder','Winslow'],
  eateries: ['Bakery','Bar','Bistro','Café','Cantina','Cellar','Diner','Eatery','Grill','House','Kitchen','Lounge','Oven','Parlour','Pub','Room','Roastery','Tavern'],
  techNouns: ['Analytics','Atlas','Beacon','Bridge','Canvas','Cloud','Core','Desk','Drive','Flow','Forge','Grid','Hub','Index','Layer','Link','Logic','Loop','Mesh','Node','Pad','Pilot','Pulse','Shift','Signal','Stack','Studio','Sync','Track','Vault','Wave'],
  medicalTerms: ['Clinic','Code','Cure','Dose','Emergency','Intake','Rounds','Pulse','Trauma','Triage','Vitals','Ward'],
  dramaWords: ['After Hours','Cold Case','Critical Shift','Double Blind','Final Call','Night Service','Open Heart','Second Opinion','Silent Alarm','Third Floor','White Coat'],
  cocktails: ['Fizz','Flip','Julep','Mule','Punch','Rickey','Sour','Spritz','Swizzle','Toddy'],
  appNouns: ['Board','Book','Box','Desk','Drop','File','Frame','Guide','Home','List','Map','Note','Page','Plan','Room','Shelf','Space','Stack','Tile','Track'],
  boutiqueNouns: ['Atelier','Boutique','Closet','Company','Corner','Goods','Haberdashery','House','Market','Mercantile','Outfitters','Studio'],
  streetTypes: ['Avenue','Boulevard','Court','Drive','Lane','Path','Road','Square','Street','Terrace','Way'],
  paints: ['Almond','Ash Rose','Bayleaf','Blue Heron','Candle Wax','Cloud Linen','Copper Dust','Dried Moss','Fieldstone','Frost Glass','Garden Wall','Harbour Mist','Ivory Lace','Juniper','Maple Sugar','Moonbeam','Old Brick','Pale Wheat','Porcelain','Rain Barrel','River Reed','Salt Box','Seaglass','Stone Path','Weathered Pine'],
  perfumes: ['Amber Silk','Black Iris','Blue Cedar','Crystal Rain','Golden Fig','Juniper Smoke','Moon Salt','Pale Velvet','Rose Static','Silver Moss','Soft Leather','White Tea'],
  dogNames: ['Archie','Bandit','Basil','Biscuit','Clover','Comet','Duke','Frankie','Ginger','Hazel','Honey','Juniper','Maple','Milo','Olive','Otis','Pepper','Piper','Poppy','Remy','Rosie','Scout','Teddy','Willow','Winnie'],
  tavernBits: ['Ale','Anvil','Badger','Bell','Boar','Candle','Cloak','Crown','Dagger','Dragon','Falcon','Fox','Gate','Goblet','Hammer','Harp','Hound','Lantern','Lion','Oak','Owl','Pony','Quill','Raven','Stag','Star','Sword','Thistle','Wheel','Wolf'],
  bandBits: ['Atlas','Comet','Crown','Echo','Harbour','Junction','Lantern','Northline','Orbit','Parade','Radio','Signal','Static','Velvet','Vista'],
  productBits: ['Air','Arc','Beam','Bold','Dash','Edge','Flow','Glow','Loop','Mint','Nova','Peak','Pixel','Pulse','Spark','Thread','Vista'],
  legalBits: ['Appeal','Brief','Clause','Counsel','District','Docket','Equity','Ledger','Motion','Verdict'],
  literaryBits: ['Chapter','Edition','Fable','Folio','Index','Ledger','Library','Margin','Paragraph','Volume'],
  yachtBits: ['Aurora','Bluefin','Calypso','Daybreak','Mariner','Northwind','Seastar','Solstice','Tempest','Waypoint'],
  gardenBits: ['Arbour','Compost','Fork','Glove','Grower','Hoe','Mulch','Planter','Rake','Seeder','Shears','Trowel','Waterer'],
  fashionBits: ['Cotton','Hem','Linen','Pleat','Ribbon','Satin','Seam','Silk','Thread','Velvet'],
  mediaBits: ['After Dark','City Desk','Deep Cut','Late Edition','Morning Feed','Night Signal','Open Channel','Prime Time','Screen Test','Weekend Wire']
};

const categoryBlueprints = [
  {
    family: 'Song titles',
    makeTitle: v => `Song titles ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 11 + i) % lexicons.adjectives.length]} ${lexicons.nouns[(v * 17 + i * 3) % lexicons.nouns.length]}`
  },
  {
    family: 'Book titles',
    makeTitle: v => `Book titles ${v + 1}`,
    makeItem: (v, i) => `The ${lexicons.adjectives[(v * 7 + i * 2) % lexicons.adjectives.length]} ${lexicons.nouns[(v * 13 + i * 5) % lexicons.nouns.length]}`
  },
  {
    family: 'Band names',
    makeTitle: v => `Band names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 5 + i) % lexicons.adjectives.length]} ${lexicons.bandBits[(v * 9 + i * 2) % lexicons.bandBits.length]}`
  },
  {
    family: 'Detective names',
    makeTitle: v => `Detective names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.firstNames[(v * 3 + i) % lexicons.firstNames.length]} ${lexicons.surnames[(v * 7 + i * 2) % lexicons.surnames.length]}`
  },
  {
    family: 'Restaurant names',
    makeTitle: v => `Restaurant names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 5 + i * 2) % lexicons.adjectives.length]} ${lexicons.eateries[(v * 3 + i) % lexicons.eateries.length]}`
  },
  {
    family: 'Tech products',
    makeTitle: v => `Tech products ${v + 1}`,
    makeItem: (v, i) => `${lexicons.productBits[(v * 7 + i) % lexicons.productBits.length]}${lexicons.techNouns[(v * 9 + i * 3) % lexicons.techNouns.length]}`
  },
  {
    family: 'Medical dramas',
    makeTitle: v => `Medical dramas ${v + 1}`,
    makeItem: (v, i) => `${lexicons.medicalTerms[(v * 5 + i) % lexicons.medicalTerms.length]} ${lexicons.dramaWords[(v * 4 + i * 2) % lexicons.dramaWords.length]}`
  },
  {
    family: 'Cocktail names',
    makeTitle: v => `Cocktail names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 6 + i * 2) % lexicons.adjectives.length]} ${lexicons.cocktails[(v * 5 + i) % lexicons.cocktails.length]}`
  },
  {
    family: 'App names',
    makeTitle: v => `App names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 8 + i) % lexicons.adjectives.length]} ${lexicons.appNouns[(v * 6 + i * 2) % lexicons.appNouns.length]}`
  },
  {
    family: 'Boutique names',
    makeTitle: v => `Boutique names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 9 + i * 2) % lexicons.adjectives.length]} ${lexicons.boutiqueNouns[(v * 5 + i) % lexicons.boutiqueNouns.length]}`
  },
  {
    family: 'Street names',
    makeTitle: v => `Street names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 4 + i) % lexicons.adjectives.length]} ${lexicons.streetTypes[(v * 3 + i * 2) % lexicons.streetTypes.length]}`
  },
  {
    family: 'Paint colours',
    makeTitle: v => `Paint colours ${v + 1}`,
    makeItem: (v, i) => `${lexicons.paints[(v * 7 + i) % lexicons.paints.length]} ${String.fromCharCode(65 + ((v + i) % 26))}`
  },
  {
    family: 'Perfume names',
    makeTitle: v => `Perfume names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.perfumes[(v * 4 + i) % lexicons.perfumes.length]} ${String.fromCharCode(65 + ((v * 2 + i) % 26))}`
  },
  {
    family: 'Dog names',
    makeTitle: v => `Dog names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.dogNames[(v * 5 + i) % lexicons.dogNames.length]} ${String.fromCharCode(65 + ((v + i) % 26))}`
  },
  {
    family: 'Fantasy taverns',
    makeTitle: v => `Fantasy taverns ${v + 1}`,
    makeItem: (v, i) => `The ${lexicons.tavernBits[(v * 8 + i) % lexicons.tavernBits.length]} & ${lexicons.tavernBits[(v * 3 + i * 2 + 7) % lexicons.tavernBits.length]}`
  },
  {
    family: 'Law firms',
    makeTitle: v => `Law firms ${v + 1}`,
    makeItem: (v, i) => `${lexicons.surnames[(v * 6 + i) % lexicons.surnames.length]} & ${lexicons.surnames[(v * 9 + i * 2 + 5) % lexicons.surnames.length]}`
  },
  {
    family: 'Publishing imprints',
    makeTitle: v => `Publishing imprints ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 7 + i) % lexicons.adjectives.length]} ${lexicons.literaryBits[(v * 5 + i * 2) % lexicons.literaryBits.length]}`
  },
  {
    family: 'Yacht names',
    makeTitle: v => `Yacht names ${v + 1}`,
    makeItem: (v, i) => `${lexicons.yachtBits[(v * 4 + i) % lexicons.yachtBits.length]} ${['I','II','III','IV','V'][Math.floor((v + i) % 5)]}`
  },
  {
    family: 'Garden tools',
    makeTitle: v => `Garden tools ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 5 + i * 2) % lexicons.adjectives.length]} ${lexicons.gardenBits[(v * 4 + i) % lexicons.gardenBits.length]}`
  },
  {
    family: 'Fashion labels',
    makeTitle: v => `Fashion labels ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 3 + i) % lexicons.adjectives.length]} ${lexicons.fashionBits[(v * 7 + i * 2) % lexicons.fashionBits.length]}`
  },
  {
    family: 'News programmes',
    makeTitle: v => `News programmes ${v + 1}`,
    makeItem: (v, i) => `${lexicons.mediaBits[(v * 4 + i) % lexicons.mediaBits.length]} ${String.fromCharCode(65 + ((v * 3 + i) % 26))}`
  },
  {
    family: 'Design studios',
    makeTitle: v => `Design studios ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 9 + i) % lexicons.adjectives.length]} ${['Design','Studio','Works','Collective','Office'][Math.floor((v + i) % 5)]}`
  },
  {
    family: 'Architecture firms',
    makeTitle: v => `Architecture firms ${v + 1}`,
    makeItem: (v, i) => `${lexicons.surnames[(v * 5 + i) % lexicons.surnames.length]} ${['Studio','Partners','Group','Office','Atelier'][Math.floor((v + i) % 5)]}`
  },
  {
    family: 'Consultancies',
    makeTitle: v => `Consultancies ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 4 + i) % lexicons.adjectives.length]} ${['Advisory','Partners','Consulting','Strategy','Group'][Math.floor((v + i) % 5)]}`
  },
  {
    family: 'Podcast titles',
    makeTitle: v => `Podcast titles ${v + 1}`,
    makeItem: (v, i) => `${lexicons.adjectives[(v * 8 + i) % lexicons.adjectives.length]} ${['Talk','Radio','Stories','Notes','Weekly'][Math.floor((v + i) % 5)]}`
  }
];

function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getISOWeekInfo(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return {
    year: d.getUTCFullYear(),
    week: weekNo,
    key: `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
  };
}

function uniqueItems(builder, variant) {
  const items = [];
  const used = new Set();
  let i = 0;
  while (items.length < CATEGORY_SIZE && i < 500) {
    const item = builder(variant, i).replace(/\s+/g, ' ').trim();
    if (!used.has(item)) {
      used.add(item);
      items.push(item);
    }
    i += 1;
  }
  if (items.length !== CATEGORY_SIZE) throw new Error('Could not build full category');
  return items;
}

function generateCategoryDatabase() {
  const categories = [];
  const variantsPerBlueprint = CATEGORY_COUNT / categoryBlueprints.length;
  categoryBlueprints.forEach((blueprint, blueprintIndex) => {
    for (let variant = 0; variant < variantsPerBlueprint; variant += 1) {
      categories.push({
        id: `cat-${String(blueprintIndex).padStart(2, '0')}-${String(variant).padStart(2, '0')}`,
        family: blueprint.family,
        title: blueprint.makeTitle(variant),
        items: uniqueItems(blueprint.makeItem, variant)
      });
    }
  });
  return categories;
}

const CATEGORY_DB = generateCategoryDatabase();

function pickWeeklyCategories(count, seedKey, offset = 0) {
  const rng = mulberry32(hashString(`${seedKey}:${offset}`));
  const indices = Array.from({ length: CATEGORY_DB.length }, (_, i) => i);
  shuffleInPlace(indices, rng);
  return indices.slice(0, count).map(i => structuredClone(CATEGORY_DB[i]));
}

function createMegaState(weekKey) {
  const categories = pickWeeklyCategories(MEGA_PICK_COUNT, weekKey, 1);
  const tiles = [];
  categories.forEach((category, catIndex) => {
    category.items.forEach((item, itemIndex) => {
      tiles.push({
        id: `tile-${catIndex}-${itemIndex}`,
        categoryId: category.id,
        words: [item],
        solved: false,
        selected: false
      });
    });
  });
  const rng = mulberry32(hashString(`${weekKey}:mega:tiles`));
  shuffleInPlace(tiles, rng);
  return {
    weekKey,
    score: 0,
    mistakes: 0,
    done: false,
    categories,
    tiles
  };
}

function createMiniState(weekKey) {
  const categories = pickWeeklyCategories(MINI_PICK_COUNT, weekKey, 2).map((category, idx) => ({
    ...category,
    difficulty: colourGroups[idx]
  }));
  const tiles = categories.flatMap(category => {
    const rng = mulberry32(hashString(`${weekKey}:${category.id}:mini`));
    return shuffleInPlace(category.items.slice(0, 4), rng).map((item, itemIndex) => ({
      id: `mini-${category.id}-${itemIndex}`,
      categoryId: category.id,
      text: item,
      selected: false,
      solved: false
    }));
  });
  shuffleInPlace(tiles, mulberry32(hashString(`${weekKey}:mini:tiles`)));
  return {
    weekKey,
    mistakesLeft: 4,
    solvedOrder: [],
    done: false,
    categories,
    tiles
  };
}

const weekInfo = getISOWeekInfo(new Date());
const megaStorageKey = `connections-mega:${weekInfo.key}`;

function loadState(key, fallbackFactory) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackFactory();
    return JSON.parse(raw);
  } catch {
    return fallbackFactory();
  }
}

let megaState = loadState(megaStorageKey, () => createMegaState(weekInfo.key));

function saveStates() {
  localStorage.setItem(megaStorageKey, JSON.stringify(megaState));
}

function megaSelectedTiles() {
  return megaState.tiles.filter(tile => tile.selected && !tile.solved);
}

function clearMegaSelection() {
  megaState.tiles.forEach(tile => { tile.selected = false; });
}

function handleMegaTileClick(id) {
  const tile = megaState.tiles.find(t => t.id === id);
  if (!tile || tile.solved) return;
  const selected = megaSelectedTiles();
  if (tile.selected) {
    tile.selected = false;
    renderMega();
    return;
  }
  if (selected.length >= 2) clearMegaSelection();
  tile.selected = true;
  const nowSelected = megaSelectedTiles();
  if (nowSelected.length === 2) {
    const [a, b] = nowSelected;
    if (a.categoryId === b.categoryId) {
      const originalIndexA = megaState.tiles.findIndex(t => t.id === a.id);
      const originalIndexB = megaState.tiles.findIndex(t => t.id === b.id);
      const targetIndex = originalIndexA < originalIndexB ? originalIndexB - 1 : originalIndexB;
      megaState.tiles = megaState.tiles.filter(t => t.id !== a.id && t.id !== b.id);
      const combined = {
        ...b,
        words: [...a.words, ...b.words],
        selected: false,
        solved: a.words.length + b.words.length === CATEGORY_SIZE
      };
      megaState.tiles.splice(targetIndex > megaState.tiles.length ? megaState.tiles.length : targetIndex, 0, combined);
      megaState.score += 1;
      megaState.done = megaState.tiles.filter(t => !t.solved).length === 0;
    } else {
      megaState.mistakes += 1;
      [a, b].forEach(t => {
        t.bad = true;
        t.selected = false;
      });
      setTimeout(() => {
        megaState.tiles.forEach(t => { delete t.bad; });
        renderMega();
      }, 300);
    }
    saveStates();
  }
  renderMega();
}

function renderMega() {
  const board = document.getElementById('megaBoard');
  const status = document.getElementById('megaStatus');
  status.innerHTML = `
    <span class="status-pill">Week ${weekInfo.week}, ${weekInfo.year}</span>
    <span class="status-pill">Score ${megaState.score}</span>
    <span class="status-pill">Mistakes ${megaState.mistakes}</span>
    <span class="status-pill">Open tiles ${megaState.tiles.filter(t => !t.solved).length}</span>
  `;
  board.innerHTML = '';
  megaState.tiles.forEach(tile => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `tile ${tile.words.length === 1 ? 'single' : 'merged'} ${tile.solved ? 'solved-tile' : ''} ${tile.selected ? 'selected' : ''} ${tile.bad ? 'bad' : ''} ${tile.words.length > 2 ? 'hoverable' : ''}`;
    const preview = tile.words.length > 2 ? `${tile.words.slice(0, 2).join(', ')}, …` : tile.words.join(', ');
    const category = megaState.categories.find(c => c.id === tile.categoryId);
    el.innerHTML = `<span>${preview}</span>${tile.words.length > 2 ? `<span class="hover-content"><strong>${category.title}</strong><br>${tile.words.join(', ')}</span>` : ''}`;
    el.addEventListener('click', () => handleMegaTileClick(tile.id));
    board.appendChild(el);
  });
}

renderMega();
