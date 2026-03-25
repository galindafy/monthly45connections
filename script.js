document.addEventListener("DOMContentLoaded", () => {
  const SIZE = 45;
  const STORAGE_KEY = "connections-45x45-weekly-generated-v1";
  const GROUP_COLORS = ["#f9df6d", "#a0c35a", "#b0c4ef", "#ba81c5"];

  const DIRECT_BANKS = {
    "FRUITS": ["apple","banana","orange","grape","pear","peach","plum","mango","kiwi","papaya","pineapple","strawberry","raspberry","blueberry","blackberry","melon","watermelon","coconut","lemon","lime","apricot","fig","guava","lychee","nectarine","passionfruit","pomegranate","dragon fruit","persimmon","tangerine","cranberry","date","grapefruit","mulberry","quince","starfruit","currant","boysenberry","cantaloupe","honeydew","jackfruit","kumquat","yuzu","pomelo","longan"],
    "VEGETABLES": ["carrot","broccoli","spinach","lettuce","cabbage","kale","cauliflower","celery","cucumber","zucchini","eggplant","pepper","tomato","potato","sweet potato","onion","garlic","beet","radish","turnip","parsnip","leek","shallot","okra","artichoke","asparagus","pea","green bean","corn","pumpkin","squash","yam","fennel","brussels sprouts","bok choy","chard","arugula","watercress","rutabaga","jicama","daikon","cassava","taro","edamame","collard greens"],
    "ANIMALS": ["lion","tiger","bear","wolf","fox","dog","cat","zebra","panda","horse","eagle","shark","whale","snake","frog","deer","otter","camel","goat","sheep","rabbit","owl","falcon","moose","bison","beaver","lynx","cougar","koala","lemur","rhino","hippo","gecko","iguana","salmon","trout","crab","lobster","octopus","squid","penguin","seal","dolphin","orca","buffalo"],
    "COLOURS": ["red","blue","green","yellow","purple","pink","black","white","orange colour","brown","teal","navy","gold colour","silver colour","cyan","magenta","beige","maroon","olive","indigo","charcoal","ivory","lavender colour","turquoise colour","mustard","burgundy","mint","tan","cream","scarlet","crimson","amber colour","bronze","lilac","periwinkle","sage","coral","taupe","ochre","russet","khaki","fuchsia","aqua","jade colour","slate colour"],
    "CITIES": ["Paris","Rome","Tokyo","London","Berlin","Madrid","Vienna","Prague","Dublin","Lisbon","Oslo","Athens","Warsaw","Zurich","Helsinki","Budapest","Seoul","Bangkok","Delhi","Cairo","Montreal","Toronto","Vancouver","Ottawa","Chicago","Boston","Miami","Seattle","Sydney","Melbourne","Auckland","Brussels","Munich","Hamburg","Florence","Naples","Kyoto","Busan","Lima","Santiago","Bogota","Reykjavik","Doha","Dubai","Marrakesh"],
    "COUNTRIES": ["Canada","United States","Mexico","Brazil","Argentina","Chile","Peru","Colombia","France","Germany","Spain","Italy","Portugal","Netherlands","Belgium","Switzerland","Austria","Poland","Sweden","Norway","Finland","Denmark","Ireland","United Kingdom","Iceland","Greece","Turkey","Egypt","Morocco","South Africa","India","China","Japan","South Korea","Thailand","Vietnam","Indonesia","Philippines","Australia","New Zealand","Nigeria","Kenya","Ethiopia","Saudi Arabia","Qatar"],
    "ACTORS": ["Zendaya","Tom Holland","Scarlett Johansson","Anne Hathaway","Margot Robbie","Robert De Niro","Johnny Depp","Meryl Streep","Leonardo DiCaprio","Chris Evans","Emma Stone","Ryan Gosling","Julia Roberts","Denzel Washington","Sandra Bullock","Brad Pitt","Natalie Portman","Cillian Murphy","Paul Rudd","Keanu Reeves","Viola Davis","Jennifer Lawrence","Matt Damon","George Clooney","Nicole Kidman","Cate Blanchett","Pedro Pascal","Ayo Edebiri","Dev Patel","Daniel Kaluuya","Florence Pugh","Kerry Washington","Angela Bassett","Jeff Goldblum","Winona Ryder","Sigourney Weaver","Oscar Isaac","Adam Driver","Rachel McAdams","Ethan Hawke","Jodie Foster","Amy Adams","Jenna Ortega","Millie Bobby Brown","Saoirse Ronan"],
    "SINGERS": ["Taylor Swift","Ariana Grande","Cher","Miley Cyrus","Olivia Rodrigo","Sabrina Carpenter","Drake","Billie Eilish","Elvis Presley","Aretha Franklin","Dua Lipa","Adele","Rihanna","Beyonce","Bruno Mars","Shania Twain","Celine Dion","Katy Perry","Justin Bieber","The Weeknd","Harry Styles","Sheryl Crow","Mariah Carey","Whitney Houston","Britney Spears","Christina Aguilera","Lorde","Sia","Hozier","Ed Sheeran","Sam Smith","Shawn Mendes","Kelly Clarkson","Pink","Tina Turner","Dolly Parton","Carly Rae Jepsen","Nelly Furtado","Janet Jackson","Alicia Keys","Usher","Janelle Monae","Lana Del Rey","Kesha","Megan Thee Stallion"],
    "MOVIE TITLES": ["Inception","Interstellar","Titanic film","Barbie film","Jaws","Frozen","Rocky","Skyfall","Cars","Elf","Shrek","Moana","Gladiator","Arrival","Whiplash","Coco","Soul","The Matrix","Grease","Chicago film","Parasite","Her","Gravity","Drive","Dune","Brooklyn","Spotlight","Juno","Selma","Hook","Bambi","Tangled","Up","Speed film","Twister","Hitch","Clueless film","Scream film","Memento","Braveheart","Love Actually","Casablanca","Psycho","Nope","Lincoln"],
    "SONG TITLES": ["Firework","Imagine","Halo","Toxic","Royals","Happy song","Umbrella","Grenade","Sorry","Believer","Dreams","Waterfalls","Chandelier","Hero","Vogue","Call Me Maybe","Bad Guy","Hello","Formation","Applause","Ironic","Zombie","Valerie","Respect","Irreplaceable","Photograph","Clocks","Riptide","Torn","Bleeding Love","No Scrubs","Watermelon Sugar","Stay song","Yellow song","Poker Face","Levitating","Single Ladies","Shivers","Vampire","Rolling in the Deep","Complicated","Genie in a Bottle","Tik Tok song","Style song","Blank Space"],
    "BOOKS": ["1984","Dune novel","Beloved","Jane Eyre","Hamlet","Macbeth","Frankenstein","Dracula","Emma novel","Rebecca novel","It novel","Carrie","Matilda book","Holes","Coraline","Persuasion","Ulysses","Lolita","Room novel","Normal People","Little Women","Anne of Green Gables","Pride and Prejudice","Sense and Sensibility","The Odyssey","The Iliad","The Great Gatsby","The Bell Jar","The Handmaid's Tale","The Road","The Kite Runner","The Secret History","Atonement","The Goldfinch","Cloud Atlas","Station Eleven","Never Let Me Go","The Book Thief","The Giver","Charlotte's Web","The Hobbit","The Fellowship of the Ring","The Two Towers","The Return of the King","To Kill a Mockingbird"],
    "TV SHOWS": ["Friends","Seinfeld","The Office","Parks and Recreation","Breaking Bad","Better Call Saul","Mad Men","Succession","The Sopranos","The Wire","Lost","Grey's Anatomy","The Bear","The Crown","Bridgerton","The Last of Us","Stranger Things","The Simpsons","Frasier","Modern Family","Abbott Elementary","Yellowjackets","Twin Peaks","Sherlock","House","The X-Files","Buffy the Vampire Slayer","Gossip Girl","Gilmore Girls","One Tree Hill","The OC","Euphoria","Fleabag","Ted Lasso","Brooklyn Nine-Nine","Community","30 Rock","Arrested Development","Veep","Westworld","The Good Place","Friday Night Lights","Downton Abbey","Killing Eve","Big Little Lies"],
    "SPORTS": ["soccer","basketball","baseball","hockey","tennis","golf","rugby","cricket","boxing","swimming","running","cycling","skiing","snowboarding","volleyball","badminton","surfing","rowing","wrestling","archery","skateboarding","lacrosse","curling","water polo","fencing","gymnastics","triathlon","marathon","handball","softball","squash","table tennis","figure skating","speed skating","kayaking","canoeing","diving","judo","karate","taekwondo","sailing","bobsled","luge","biathlon","climbing"],
    "BREAKFAST FOODS": ["toast","bagel","pancakes","waffles","omelette","bacon","sausage","cereal","granola","yogurt","hash browns","oatmeal","breakfast muffin","croissant","fruit cup","smoothie","fried eggs","home fries","jam","butter","poached eggs","scrambled eggs","english muffin","avocado toast","breakfast burrito","breakfast sandwich","crepes","porridge","grits","quiche slice","bran flakes","chia pudding","banana bread","apple sauce cup","sauteed mushrooms","frittata","breakfast wrap","toast soldiers","hard boiled eggs","breakfast potatoes","rye toast","cream cheese","smoked salmon","overnight oats","waffle sticks"],
    "DESSERTS": ["cake","pie","cookie","brownie","muffin","donut","croissant pastry","tart","pudding","ice cream","sundae","sorbet","cheesecake","macaron","eclair","cannoli","fudge","truffle","cupcake","parfait","creme brulee","churro","baklava","gelato","pavlova","shortbread","bread pudding","rice pudding","flan","tiramisu","meringue","whoopie pie","lemon bar","snickerdoodle","biscotti","marshmallow square","cobbler","blondie","mooncake","madeleine","profiterole","souffle","strudel","danish","beignet"],
    "FAST FOOD CHAINS": ["McDonald's","Burger King","Wendy's","Subway chain","KFC","Taco Bell","Domino's","Pizza Hut","Popeyes","Chipotle","Five Guys","A&W","Arby's","Sonic","Dairy Queen","Little Caesars","Panera","Chick-fil-A","In-N-Out","Shake Shack","Tim Hortons","Harvey's","Swiss Chalet","Nando's","Quiznos","Qdoba","Jack in the Box","White Castle","Carl's Jr.","Hardee's","Culver's","Whataburger","Jollibee","Pret A Manger","Cinnabon","Sbarro","Baskin-Robbins","Papa Johns","Hungry Jack's","Del Taco","Long John Silver's","Church's Chicken","Wingstop","Jersey Mike's","Firehouse Subs"],
    "COFFEE DRINKS": ["latte","cappuccino","espresso","americano","mocha","macchiato","flat white","cortado","cold brew","frappuccino","iced coffee","irish coffee","affogato","ristretto","lungo","red eye","black coffee","drip coffee","pour over","french press","cafe au lait","doppio","breve","mocha latte","vanilla latte","caramel latte","hazelnut latte","iced latte","nitro cold brew","espresso con panna","dirty chai","pumpkin spice latte","turkish coffee","cuban coffee","vienna coffee","romano","freddo espresso","freddo cappuccino","iced americano","white mocha","marocchino","cafe bombon","shakerato","flat black","bulletproof coffee"]
  };

  const GENERATED_ROOTS = [
    "apple","break","light","star","moon","water","fire","sun","snow","wind",
    "rain","night","day","dream","love","heart","hand","house","road","sky",
    "sea","stone","gold","silver","blue","green","black","white","red","sound",
    "time","ring","line","glass","bird","flower","tree","cloud","wave","spark",
    "shadow","storm","field","river","garden","screen","signal","frame","trail","mark"
  ];

  const GENERATED_TAILS = [
    "line","light","mark","song","road","path","field","house","garden","stone",
    "glass","trail","watch","fall","rise","drift","shade","spark","beam","print",
    "box","ring","screen","guide","turn","crest","bloom","bridge","table","panel",
    "stand","view","cart","frame","gate","talk","signal","route","sparkle","storm",
    "room","shade","shine","stream","mist","flare","drive","harbor","pool","valley",
    "candy","juice","pie","cider","watch","store","core","seed","tart","sauce"
  ];

  const board = document.getElementById("board");
  const mistakesEl = document.getElementById("mistakes");
  const dateEl = document.getElementById("puzzleDate");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const deselectBtn = document.getElementById("deselectBtn");

  function normalizeSourceWord(word) {
    return String(word)
      .replace(/\s+\[.*?\]$/, "")
      .replace(/\s+(film|song|novel|app|platform|service|company|book|game|drink|beverage|instrument|flower|tree|fish|seafood|vehicle|state|bird|colour)$/i, "")
      .trim();
  }

  function displayWord(word) {
    return normalizeSourceWord(word);
  }

  function weekStartDate() {
    const d = new Date();
    const local = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = local.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    local.setDate(local.getDate() + diff);
    local.setHours(0, 0, 0, 0);
    return local;
  }

  function weekKey() {
    const d = weekStartDate();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  }

  function formatLongDate(k) {
    const y = Number(k.slice(0, 4));
    const m = Number(k.slice(4, 6)) - 1;
    const d = Number(k.slice(6, 8));
    return new Date(y, m, d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function seedNumber(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function rand(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function shuffle(arr, seed) {
    const copy = [...arr];
    let s = seed;
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand(s++) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildGeneratedBanks() {
    const banks = {};
    GENERATED_ROOTS.forEach((root, rootIndex) => {
      const values = GENERATED_TAILS.map((tail, tailIndex) => {
        if (tailIndex < 10 && rootIndex % 5 === 0) {
          return `${root}${tail}`;
        }
        return `${root} ${tail}`;
      });
      banks[`WORDS WITH ${root.toUpperCase()}`] = values.slice(0, SIZE);
    });
    return banks;
  }

  function buildCategoryPool() {
    return {
      ...DIRECT_BANKS,
      ...buildGeneratedBanks()
    };
  }

  function buildFreshState() {
    const dateKey = weekKey();
    const seed = seedNumber(dateKey);
    const CATEGORY_POOL = buildCategoryPool();

    const entries = Object.entries(CATEGORY_POOL);
    if (entries.length < SIZE) {
      throw new Error(`Need at least ${SIZE} categories, found ${entries.length}.`);
    }

    const chosen = shuffle(entries, seed).slice(0, SIZE);

    const categories = chosen.map(([name, words], idx) => {
      const cleaned = words.map(normalizeSourceWord);
      const unique = [...new Set(cleaned)];
      if (unique.length < SIZE) {
        throw new Error(`${name} needs at least ${SIZE} unique entries after cleanup.`);
      }
      return {
        name,
        words: shuffle(unique, seed + idx).slice(0, SIZE)
      };
    });

    const seen = new Set();
    const tiles = [];
    const lookup = {};

    categories.forEach((cat, idx) => {
      cat.words.forEach(word => {
        let w = word;
        if (seen.has(w)) {
          w = `${w} [${cat.name}]`;
        }
        seen.add(w);
        tiles.push(w);
        lookup[w] = {
          name: cat.name,
          color: GROUP_COLORS[idx % GROUP_COLORS.length]
        };
      });
    });

    return {
      dateKey,
      lookup,
      groups: shuffle(tiles, seed + 999).map(word => ({
        words: [word],
        solved: false,
        category: null,
        color: null
      })),
      selectedIndex: null,
      mistakes: 0
    };
  }

  function loadState() {
    const fresh = buildFreshState();

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fresh;

      const saved = JSON.parse(raw);
      if (!saved || saved.dateKey !== fresh.dateKey) {
        localStorage.removeItem(STORAGE_KEY);
        return fresh;
      }

      return {
        dateKey: fresh.dateKey,
        lookup: fresh.lookup,
        groups: saved.groups,
        selectedIndex: null,
        mistakes: saved.mistakes || 0
      };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return fresh;
    }
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      dateKey: state.dateKey,
      groups: state.groups,
      mistakes: state.mistakes
    }));
  }

  function preview(group) {
    const shown = group.words.map(displayWord);
    const firstTwo = shown.slice(0, 2).join(", ");
    return shown.length >= 3 ? `${firstTwo}, ... [${shown.length}]` : firstTwo;
  }

  function findCategory(words) {
    const first = state.lookup[words[0]];
    if (!first) return null;
    for (const w of words) {
      if (!state.lookup[w] || state.lookup[w].name !== first.name) return null;
    }
    return first;
  }

  function mergeIntoSecond(a, b) {
    const mergedWords = [...state.groups[a].words, ...state.groups[b].words];
    const category = findCategory(mergedWords);

    if (!category) {
      state.mistakes += 1;
      return;
    }

    const merged = {
      words: mergedWords,
      solved: false,
      category: null,
      color: null
    };

    let insertIndex = b;

    if (a > b) {
      state.groups.splice(a, 1);
      state.groups.splice(b, 1);
    } else {
      state.groups.splice(b, 1);
      state.groups.splice(a, 1);
      insertIndex -= 1;
    }

    state.groups.splice(insertIndex, 0, merged);

    if (merged.words.length === SIZE) {
      merged.solved = true;
      merged.category = category.name;
      merged.color = category.color;
    }
  }

  function handleClick(i) {
    const g = state.groups[i];
    if (g.solved) return;

    if (state.selectedIndex === null) {
      state.selectedIndex = i;
      render();
      return;
    }

    if (state.selectedIndex === i) {
      state.selectedIndex = null;
      render();
      return;
    }

    mergeIntoSecond(state.selectedIndex, i);
    state.selectedIndex = null;
    saveState();
    render();
  }

  function render() {
    dateEl.textContent = formatLongDate(state.dateKey);
    mistakesEl.textContent = state.mistakes;
    board.innerHTML = "";

    state.groups.forEach((g, i) => {
      const tile = document.createElement("div");
      tile.className = "tile";

      if (g.solved) {
        tile.classList.add("solved-tile", "hoverable");
        tile.style.background = g.color;
      } else {
        tile.classList.add(g.words.length > 1 ? "merged" : "single");
        if (state.selectedIndex === i) tile.classList.add("selected");
        if (g.words.length >= 3) tile.classList.add("hoverable");
      }

      const label = document.createElement("div");
      label.textContent = g.solved ? g.category : preview(g);
      tile.appendChild(label);

      if (g.words.length >= 3 || g.solved) {
        const hover = document.createElement("div");
        hover.className = "hover-content";
        hover.textContent = g.words.map(displayWord).join(", ");
        tile.appendChild(hover);
      }

      if (!g.solved) {
        tile.addEventListener("click", () => handleClick(i));
      }

      board.appendChild(tile);
    });
  }

  shuffleBtn.addEventListener("click", () => {
    const seed = seedNumber(state.dateKey) + Date.now();
    state.groups = shuffle(state.groups, seed);
    state.selectedIndex = null;
    saveState();
    render();
  });

  deselectBtn.addEventListener("click", () => {
    state.selectedIndex = null;
    render();
  });

  render();
});
