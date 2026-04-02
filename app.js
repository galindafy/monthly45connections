const CATEGORY_COUNT = 500;
const CATEGORY_SIZE = 45;
const MEGA_PICK_COUNT = 45;

const FAMILY_POOLS = [
  {
    family: 'Women names',
    proper: true,
    items: ['Abigail','Addison','Alexis','Alice','Amelia','Anna','Aria','Aubrey','Audrey','Ava','Bella','Brooklyn','Camila','Caroline','Charlotte','Chloe','Claire','Eleanor','Elizabeth','Ella','Ellie','Emily','Emma','Evelyn','Gabriella','Grace','Hannah','Harper','Hazel','Isabella','Ivy','Layla','Leah','Lily','Lucy','Luna','Madeline','Maya','Mia','Natalie','Nora','Olivia','Penelope','Riley','Ruby','Samantha','Scarlett','Sophia','Stella','Violet','Willow','Zoe']
  },
  {
    family: 'Men names',
    proper: true,
    items: ['Alexander','Andrew','Anthony','Asher','Benjamin','Caleb','Carter','Charles','Christopher','Daniel','David','Dylan','Ethan','Ezra','Gabriel','Grayson','Henry','Hudson','Isaac','Jack','Jackson','Jacob','James','Julian','Leo','Levi','Liam','Lincoln','Logan','Lucas','Luke','Mason','Mateo','Matthew','Michael','Nathan','Noah','Nolan','Oliver','Owen','Samuel','Sebastian','Theodore','Thomas','William','Wyatt']
  },
  {
    family: 'Surnames',
    proper: true,
    items: ['Adams','Allen','Anderson','Bailey','Baker','Bell','Bennett','Brooks','Brown','Campbell','Carter','Clark','Collins','Cook','Cooper','Cox','Davis','Diaz','Edwards','Evans','Foster','Garcia','Gonzalez','Gray','Green','Hall','Harris','Hayes','Henderson','Hill','Howard','Hughes','Jackson','Jenkins','Johnson','Kelly','King','Lee','Lewis','Long','Martinez','Miller','Mitchell','Moore','Morgan','Morris','Murphy','Nelson','Parker','Perez','Perry','Peterson','Phillips','Powell','Price','Ramirez','Reed','Richardson','Rivera','Roberts','Robinson','Rodriguez','Rogers','Ross','Russell','Sanders','Scott','Simmons','Smith','Stewart','Taylor','Thomas','Torres','Turner','Walker','Ward','Washington','Watson','White','Williams','Wilson','Wood','Wright','Young']
  },
  {
    family: 'Dog names',
    proper: true,
    items: ['Archie','Bailey','Bandit','Bear','Bella','Bentley','Blue','Bodie','Bruno','Buddy','Charlie','Chester','Cleo','Coco','Cooper','Daisy','Dexter','Duke','Ellie','Finn','Frankie','George','Ginger','Harley','Hazel','Henry','Honey','Jack','Jasper','Koda','Leo','Loki','Louie','Luca','Lucky','Luna','Maggie','Maple','Max','Milo','Murphy','Nala','Nova','Oliver','Ollie','Penny','Pepper','Piper','Poppy','Remi','Rosie','Roxy','Ruby','Sadie','Scout','Shadow','Simba','Stella','Teddy','Winston','Winnie','Ziggy']
  },
  {
    family: 'Dog breeds',
    proper: true,
    items: ['Akita','Basenji','Beagle','Bernese Mountain Dog','Bichon Frise','Bloodhound','Border Collie','Boston Terrier','Boxer','Brittany','Bull Terrier','Bulldog','Cairn Terrier','Cane Corso','Cavalier King Charles Spaniel','Chihuahua','Chow Chow','Cocker Spaniel','Collie','Corgi','Dachshund','Dalmatian','Doberman Pinscher','English Setter','French Bulldog','German Shepherd','German Shorthaired Pointer','Golden Retriever','Great Dane','Greyhound','Havanese','Irish Setter','Jack Russell Terrier','Labrador Retriever','Lhasa Apso','Maltese','Miniature Pinscher','Newfoundland','Old English Sheepdog','Papillon','Pekingese','Pit Bull Terrier','Pomeranian','Poodle','Pug','Rottweiler','Saint Bernard','Samoyed','Schnauzer','Scottish Terrier','Shetland Sheepdog','Shiba Inu','Shih Tzu','Siberian Husky','Springer Spaniel','Vizsla','Weimaraner','West Highland White Terrier','Whippet','Yorkshire Terrier']
  },
  {
    family: 'Flowers',
    proper: false,
    items: ['alyssum','anemone','aster','azalea','begonia','bellflower','black-eyed susan','bluebell','buttercup','camellia','carnation','chrysanthemum','clematis','columbine','coneflower','cosmos','crocus','dahlia','daisy','delphinium','foxglove','freesia','gardenia','geranium','gladiolus','hibiscus','hollyhock','hydrangea','iris','jasmine','lavender','lilac','lily','magnolia','marigold','nasturtium','orchid','pansy','peony','petunia','phlox','poppy','primrose','ranunculus','rose','snapdragon','sunflower','sweet pea','tulip','verbena','violet','wisteria','zinnia']
  },
  {
    family: 'Birds',
    proper: false,
    items: ['albatross','blue jay','canary','cardinal','chickadee','cockatoo','condor','crane','crow','cuckoo','dove','duck','eagle','egret','falcon','finch','flamingo','goose','gull','hawk','heron','hummingbird','ibis','jay','kingfisher','kiwi','lark','loon','macaw','magpie','mockingbird','nightingale','oriole','osprey','owl','parakeet','parrot','peacock','pelican','penguin','pheasant','pigeon','puffin','quail','raven','robin','seagull','sparrow','starling','stork','swallow','swan','toucan','turkey','vulture','warbler','woodpecker','wren']
  },
  {
    family: 'Insects',
    proper: false,
    items: ['ant','aphid','beetle','bee','bumblebee','butterfly','caddisfly','cicada','cockroach','cricket','damselfly','dragonfly','earwig','firefly','flea','fruit fly','gnat','grasshopper','hornet','horsefly','lacewing','ladybug','lanternfly','locust','mantis','mayfly','midge','moth','mosquito','nymph','paper wasp','pill bug','praying mantis','scarab','silverfish','slug moth','stink bug','stonefly','termite','thrips','tick','walking stick','water strider','weevil','whitefly','yellowjacket']
  },
  {
    family: 'Spices and herbs',
    proper: false,
    items: ['allspice','anise','basil','bay leaf','caraway','cardamom','cayenne','celery seed','chervil','chili powder','chives','cilantro','cinnamon','clove','coriander','cumin','curry powder','dill','fennel','fenugreek','garlic powder','ginger','lavender','lemongrass','marjoram','mint','mustard seed','nutmeg','oregano','paprika','parsley','peppermint','rosemary','saffron','sage','savory','sesame','star anise','sumac','tarragon','thyme','turmeric','vanilla']
  },
  {
    family: 'Pasta shapes',
    proper: false,
    items: ['acini di pepe','agnolotti','anelli','bigoli','bucatini','campanelle','cannelloni','capellini','casarecce','cavatappi','cavatelli','conchiglie','ditalini','farfalle','fettuccine','filini','fusilli','gemelli','gnocchetti','lasagna','linguine','lumache','macaroni','mafaldine','manicotti','mezzi rigatoni','orecchiette','orzo','paccheri','pappardelle','pastina','penne','perciatelli','radiatori','ravioli','rigatoni','rotelle','rotini','shells','spaghetti','stelline','strozzapreti','tagliatelle','tortellini','trofie','vermicelli','ziti']
  },
  {
    family: 'Professions',
    proper: false,
    items: ['accountant','actor','architect','astronomer','attorney','baker','barber','biologist','builder','butcher','carpenter','cashier','chef','chemist','coach','dentist','designer','doctor','editor','electrician','engineer','farmer','firefighter','florist','geologist','historian','illustrator','journalist','judge','lawyer','librarian','magician','mechanic','musician','nurse','optician','painter','paramedic','pharmacist','photographer','physicist','pilot','plumber','poet','politician','professor','programmer','reporter','scientist','singer','teacher','translator','veterinarian','waiter','writer']
  },
  {
    family: 'Kitchen appliances',
    proper: false,
    items: ['air fryer','blender','bread maker','coffee grinder','coffee maker','deep fryer','dishwasher','double oven','electric kettle','espresso machine','food processor','freezer','fridge','griddle','hand mixer','hot plate','ice maker','immersion blender','induction hob','juicer','microwave','oven','pressure cooker','range hood','rice cooker','slow cooker','stand mixer','steam oven','stove','tea kettle','toaster','toaster oven','waffle maker','warming drawer']
  },
  {
    family: 'Book titles',
    proper: true,
    items: ['1984','A Farewell to Arms','A Little Life','A Tale of Two Cities','A Wrinkle in Time','Anne of Green Gables','Beloved','Brave New World','Catch-22','Charlotte\'s Web','Crime and Punishment','Dune','Emma','Fahrenheit 451','Frankenstein','Gone Girl','Great Expectations','Hamlet','Jane Eyre','Little Women','Lolita','Moby-Dick','Normal People','Of Mice and Men','On the Road','One Hundred Years of Solitude','Persuasion','Pride and Prejudice','Rebecca','Sense and Sensibility','Slaughterhouse-Five','The Bell Jar','The Book Thief','The Catcher in the Rye','The Color Purple','The Fellowship of the Ring','The Giver','The Goldfinch','The Great Gatsby','The Handmaid\'s Tale','The Hobbit','The Hunger Games','The Kite Runner','The Little Prince','The Lord of the Flies','The Odyssey','The Secret History','The Shining','The Sun Also Rises','The Trial','The Wind-Up Bird Chronicle','To Kill a Mockingbird','Wuthering Heights']
  },
  {
    family: 'Film titles',
    proper: true,
    items: ['Alien','Amadeus','Barbie','Black Panther','Blade Runner','Casablanca','Chinatown','Coco','Die Hard','Dune','E.T. the Extra-Terrestrial','Fight Club','Forrest Gump','Get Out','Gladiator','Goodfellas','Gravity','Her','Inception','Inside Out','Interstellar','Jaws','Jurassic Park','La La Land','Mad Max: Fury Road','Memento','Moonlight','No Country for Old Men','Parasite','Psycho','Ratatouille','Rear Window','Rocky','Roma','Scream','Shrek','Spotlight','The Batman','The Dark Knight','The Departed','The Godfather','The Grand Budapest Hotel','The Incredibles','The Matrix','The Silence of the Lambs','The Social Network','The Sound of Music','The Wizard of Oz','Titanic','Toy Story','Up','Whiplash']
  },
  {
    family: 'Authors',
    proper: true,
    items: ['Agatha Christie','Alice Munro','Ann Patchett','Anthony Doerr','Arundhati Roy','Atwood','Barbara Kingsolver','Brandon Sanderson','C.S. Lewis','Charles Dickens','Chimamanda Ngozi Adichie','Colleen Hoover','Cormac McCarthy','Donna Tartt','Douglas Adams','Edith Wharton','Elena Ferrante','Emily Brontë','Ernest Hemingway','F. Scott Fitzgerald','George Eliot','George Orwell','Gillian Flynn','Harper Lee','Hilary Mantel','Ian McEwan','Isabel Allende','J.K. Rowling','J.R.R. Tolkien','Jane Austen','James Baldwin','John Grisham','John Steinbeck','Kazuo Ishiguro','Khaled Hosseini','Louisa May Alcott','Margaret Atwood','Michael Ondaatje','Oscar Wilde','Ray Bradbury','Salman Rushdie','Stephen King','Toni Morrison','Virginia Woolf','Zadie Smith']
  },
  {
    family: 'TV shows',
    proper: true,
    items: ['Abbott Elementary','Arrested Development','Better Call Saul','Big Little Lies','Black Mirror','Breaking Bad','Bridgerton','Buffy the Vampire Slayer','Community','Curb Your Enthusiasm','Dawson\'s Creek','Deadwood','ER','Fargo','Friday Night Lights','Friends','Game of Thrones','Gilmore Girls','Gossip Girl','Grey\'s Anatomy','House','How I Met Your Mother','Killing Eve','Law & Order','Lost','Mad Men','Modern Family','New Girl','Only Murders in the Building','Parks and Recreation','Peaky Blinders','Schitt\'s Creek','Seinfeld','Sex and the City','Stranger Things','Succession','Ted Lasso','The Bear','The Crown','The Good Place','The Last of Us','The Office','The Sopranos','The West Wing','The Wire','Twin Peaks','Veep','Yellowjackets']
  },
  {
    family: 'US states',
    proper: true,
    items: ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
  },
  {
    family: 'European countries',
    proper: true,
    items: ['Albania','Andorra','Austria','Belarus','Belgium','Bosnia and Herzegovina','Bulgaria','Croatia','Czech Republic','Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland','Italy','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Moldova','Monaco','Montenegro','Netherlands','North Macedonia','Norway','Poland','Portugal','Romania','San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Ukraine','United Kingdom','Vatican City']
  },
  {
    family: 'Household items',
    proper: false,
    items: ['alarm clock','armchair','bath mat','bed frame','blanket','bookshelf','broom','cabinet','calendar','candlestick','carpet','chair','coat rack','coffee table','cushion','desk lamp','dish rack','dresser','dustpan','duvet','fan','floor lamp','garbage bin','hanger','headboard','iron','ironing board','laundry basket','mattress','mirror','nightstand','ottoman','pillow','plunger','rug','shelf','shoe rack','side table','sofa','stool','table lamp','throw pillow','toilet brush','towel rack','vacuum','wardrobe','wastebasket']
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

function pickItemsForVariant(pool, familySeed, variant) {
  const rng = mulberry32(hashString(`${familySeed}:${variant}`));
  const shuffled = shuffleInPlace(pool.slice(), rng);
  return shuffled.slice(0, CATEGORY_SIZE);
}

function generateCategoryDatabase() {
  const categories = [];
  const variantsPerFamily = CATEGORY_COUNT / FAMILY_POOLS.length;
  FAMILY_POOLS.forEach((family, familyIndex) => {
    for (let variant = 0; variant < variantsPerFamily; variant += 1) {
      categories.push({
        id: `cat-${String(familyIndex).padStart(2, '0')}-${String(variant).padStart(2, '0')}`,
        family: family.family,
        title: `${family.family} ${variant + 1}`,
        items: pickItemsForVariant(family.items, family.id || family.family, variant)
      });
    }
  });
  return categories;
}

const CATEGORY_DB = generateCategoryDatabase();

function pickWeeklyCategories(count, seedKey) {
  const rng = mulberry32(hashString(`${seedKey}:weekly`));
  const indices = Array.from({ length: CATEGORY_DB.length }, (_, i) => i);
  shuffleInPlace(indices, rng);
  return indices.slice(0, count).map(i => structuredClone(CATEGORY_DB[i]));
}

function createMegaState(weekKey) {
  const categories = pickWeeklyCategories(MEGA_PICK_COUNT, weekKey);
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
let megaSelectionTick = 0;

function saveState() {
  localStorage.setItem(megaStorageKey, JSON.stringify(megaState));
}

function megaSelectedTiles() {
  return megaState.tiles.filter(tile => tile.selected && !tile.solved);
}

function clearMegaSelection() {
  megaState.tiles.forEach(tile => {
    tile.selected = false;
    delete tile.selectedAt;
  });
}

function formatGroup(words, previewCount = null) {
  const shown = previewCount ? words.slice(0, previewCount) : words;
  const pieces = shown.map(word => `[${word}]`);
  if (previewCount && words.length > previewCount) {
    pieces.push(`… [${words.length}]`);
  }
  return pieces.join(', ');
}

function handleMegaTileClick(id) {
  const tile = megaState.tiles.find(t => t.id === id);
  if (!tile || tile.solved) return;

  const selected = megaSelectedTiles();
  if (tile.selected) {
    tile.selected = false;
    delete tile.selectedAt;
    renderMega();
    return;
  }

  if (selected.length >= 2) {
    clearMegaSelection();
  }

  tile.selected = true;
  tile.selectedAt = ++megaSelectionTick;

  const nowSelected = megaSelectedTiles().sort((a, b) => (a.selectedAt || 0) - (b.selectedAt || 0));
  if (nowSelected.length !== 2) {
    renderMega();
    return;
  }

  const [firstTile, secondTile] = nowSelected;
  if (firstTile.categoryId === secondTile.categoryId) {
    const firstIndex = megaState.tiles.findIndex(t => t.id === firstTile.id);
    const secondIndex = megaState.tiles.findIndex(t => t.id === secondTile.id);
    const mergedTile = {
      ...secondTile,
      words: [...firstTile.words, ...secondTile.words],
      selected: false,
      solved: firstTile.words.length + secondTile.words.length === CATEGORY_SIZE
    };
    delete mergedTile.selectedAt;

    megaState.tiles = megaState.tiles.filter(t => t.id !== firstTile.id && t.id !== secondTile.id);
    const insertIndex = firstIndex < secondIndex ? secondIndex - 1 : secondIndex;
    megaState.tiles.splice(insertIndex, 0, mergedTile);
    megaState.score += 1;
    megaState.done = megaState.tiles.every(t => t.solved);
    saveState();
    renderMega();
    return;
  }

  [firstTile, secondTile].forEach(t => {
    t.bad = true;
    t.selected = false;
    delete t.selectedAt;
  });
  megaState.mistakes += 1;
  saveState();
  renderMega();
  setTimeout(() => {
    megaState.tiles.forEach(t => { delete t.bad; });
    renderMega();
  }, 300);
}

function renderMega() {
  const board = document.getElementById('megaBoard');
  const status = document.getElementById('megaStatus');

  status.innerHTML = `
    <span class="status-pill">Week ${weekInfo.week}, ${weekInfo.year}</span>
    <span class="status-pill">Moves ${megaState.score}</span>
    <span class="status-pill">Mistakes ${megaState.mistakes}</span>
    <span class="status-pill">Open tiles ${megaState.tiles.filter(t => !t.solved).length}</span>
  `;

  board.innerHTML = '';
  megaState.tiles.forEach(tile => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `tile ${tile.words.length === 1 ? 'single' : 'merged'} ${tile.solved ? 'solved-tile' : ''} ${tile.selected ? 'selected' : ''} ${tile.bad ? 'bad' : ''} ${tile.words.length > 2 ? 'hoverable' : ''}`;

    const preview = tile.words.length === 1 ? tile.words[0] : formatGroup(tile.words, 2);
    const popup = tile.words.length > 2
      ? `<span class="hover-content">${formatGroup(tile.words)}<br><br>group size: ${tile.words.length}</span>`
      : '';

    el.innerHTML = `<span>${preview}</span>${popup}`;
    el.addEventListener('click', () => handleMegaTileClick(tile.id));
    board.appendChild(el);
  });
}

renderMega();
