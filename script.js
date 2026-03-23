
document.addEventListener("DOMContentLoaded", () => {
  const SIZE = 45;
  const STORAGE_KEY = "connections-date-45x45-v1";
  const GROUP_COLORS = ["#f9df6d","#a0c35a","#b0c4ef","#ba81c5"];
  const BASE_POOLS = {"FRUITS": ["apple", "banana", "orange", "grape", "pear", "peach", "plum", "mango", "kiwi", "papaya", "pineapple", "strawberry", "raspberry", "blueberry", "blackberry", "melon", "watermelon", "coconut", "lemon", "lime", "apricot", "fig", "guava", "lychee", "nectarine", "passionfruit", "pomegranate", "dragon fruit", "persimmon", "tangerine", "cranberry", "date", "grapefruit", "mulberry", "olive fruit", "quince", "starfruit", "currant", "boysenberry", "blood orange", "cantaloupe", "honeydew", "gooseberry", "jackfruit", "kumquat", "yuzu", "pomelo", "mirabelle", "feijoa", "longan"], "COLOURS": ["red", "blue", "green", "yellow", "purple", "pink", "black", "white", "orange colour", "brown", "teal", "navy", "gold colour", "silver colour", "cyan", "magenta", "beige", "maroon", "olive", "indigo", "charcoal", "ivory", "lavender", "turquoise", "mustard", "burgundy", "peach colour", "mint", "tan", "cream", "scarlet", "crimson", "amber", "bronze hue", "plum colour", "lilac", "periwinkle", "sage", "coral", "taupe", "ochre", "russet", "khaki", "fuchsia", "aqua", "jade", "slate", "sand", "copper hue", "ruby"], "CITIES": ["Paris", "Rome", "Tokyo", "London", "Berlin", "Madrid", "Vienna", "Prague", "Dublin", "Lisbon", "Oslo", "Athens", "Warsaw", "Zurich", "Helsinki", "Budapest", "Seoul", "Bangkok", "Delhi", "Cairo", "Montreal", "Toronto", "Vancouver", "Ottawa", "Chicago", "Boston", "Miami", "Seattle", "Sydney", "Melbourne", "Auckland", "Brussels", "Munich", "Hamburg", "Florence", "Naples", "Kyoto", "Busan", "Lima", "Santiago", "Bogota", "Reykjavik", "Doha", "Dubai", "Marrakesh", "Casablanca", "Stockholm", "Copenhagen", "Tallinn", "Riga"], "SINGERS": ["Taylor Swift", "Ariana Grande", "Cher", "Miley Cyrus", "Olivia Rodrigo", "Sabrina Carpenter", "Drake", "Billie Eilish", "Elvis Presley", "Aretha Franklin", "Dua Lipa", "Adele", "Rihanna", "Beyonce", "Bruno Mars", "Shania Twain", "Celine Dion", "Katy Perry", "Justin Bieber", "The Weeknd", "Harry Styles", "Sheryl Crow", "Mariah Carey", "Whitney Houston", "Britney Spears", "Christina Aguilera", "Lorde", "Sia", "Hozier", "Ed Sheeran", "Sam Smith", "Shawn Mendes", "Kelly Clarkson", "Pink", "Tina Turner", "Dolly Parton", "Carly Rae Jepsen", "Nelly Furtado", "Janet Jackson", "Alicia Keys", "Usher", "Janelle Monae", "Lana Del Rey", "Kesha", "Megan Thee Stallion", "Ava Max", "Olivia Newton-John", "Annie Lennox", "Chappell Roan", "Joni Mitchell"], "ACTORS": ["Zendaya", "Tom Holland", "Scarlett Johansson", "Anne Hathaway", "Margot Robbie", "Robert De Niro", "Johnny Depp", "Meryl Streep", "Leonardo DiCaprio", "Chris Evans", "Emma Stone", "Ryan Gosling", "Julia Roberts", "Denzel Washington", "Sandra Bullock", "Brad Pitt", "Natalie Portman", "Cillian Murphy", "Paul Rudd", "Keanu Reeves", "Viola Davis", "Jennifer Lawrence", "Matt Damon", "George Clooney", "Nicole Kidman", "Cate Blanchett", "Pedro Pascal", "Ayo Edebiri", "Dev Patel", "Daniel Kaluuya", "Florence Pugh", "Kerry Washington", "Angela Bassett", "Jeff Goldblum", "Winona Ryder", "Sigourney Weaver", "Oscar Isaac", "Adam Driver", "Rachel McAdams", "Ethan Hawke", "Jodie Foster", "Amy Adams", "Jenna Ortega", "Millie Bobby Brown", "Saoirse Ronan", "Mahershala Ali", "Samuel L. Jackson", "John Boyega", "Lupita Nyong'o", "Aubrey Plaza"], "ANIMALS": ["lion", "tiger", "bear", "wolf", "fox", "dog", "cat", "zebra", "panda", "horse", "eagle", "shark", "whale", "snake", "frog", "deer", "otter", "camel", "goat", "sheep", "rabbit", "owl", "falcon", "moose", "bison", "beaver", "lynx", "cougar", "koala", "lemur", "rhino", "hippo", "gecko", "iguana", "salmon", "trout", "crab", "lobster", "octopus", "squid", "penguin", "seal", "dolphin", "orca", "buffalo", "ferret", "hamster", "guinea pig", "hedgehog", "badger"], "DESSERTS": ["cake", "pie", "cookie", "brownie", "muffin", "donut", "croissant pastry", "tart", "pudding", "ice cream", "sundae", "sorbet", "cheesecake", "macaron", "eclair", "cannoli", "fudge", "truffle", "cupcake", "parfait", "creme brulee", "churro", "baklava", "gelato", "pavlova", "shortbread", "bread pudding", "rice pudding", "flan", "tiramisu", "meringue", "whoopie pie", "lemon bar", "snickerdoodle", "biscotti", "marshmallow square", "cobbler", "blondie", "mooncake", "madeleine", "profiterole", "souffle", "strudel", "danish", "beignet", "panna cotta", "financier", "opera cake", "semifreddo", "sticky toffee pudding"], "BREAKFAST FOODS": ["toast", "bagel", "pancakes", "waffles", "omelette", "bacon", "sausage", "cereal", "granola", "yogurt", "hash browns", "oatmeal", "breakfast muffin", "buttery croissant", "fruit cup", "smoothie", "fried eggs", "home fries", "jam", "butter", "poached eggs", "scrambled eggs", "english muffin", "avocado toast", "breakfast burrito", "breakfast sandwich", "crepes", "porridge", "grits", "quiche slice", "bran flakes", "chia pudding", "banana bread", "apple sauce cup", "sauteed mushrooms", "breakfast sausage patty", "frittata", "hash", "breakfast wrap", "toast soldiers", "hard boiled eggs", "breakfast potatoes", "rye toast", "cream cheese", "smoked salmon", "overnight oats", "protein shake", "waffle sticks", "pancake syrup", "fruit yogurt"], "PHONE APPS": ["Instagram", "TikTok", "YouTube app", "Spotify", "Uber", "Google Maps", "Notes app", "Calendar app", "Photos app", "Camera app", "Gmail app", "WhatsApp", "Messenger app", "Zoom", "Netflix", "Weather app", "Clock app", "Reminders", "Discord", "Pinterest", "Threads", "Snapchat", "Telegram", "Signal", "Apple Music", "Google Drive", "Dropbox", "Canva", "Duolingo", "Strava", "Slack", "Reddit", "Amazon app", "Etsy", "Airbnb", "Booking", "Transit app", "Waze", "Shazam", "CapCut", "Pocket Casts", "Notion", "Todoist", "LinkedIn", "X app", "Facebook", "Google Photos", "Authenticator", "PayPal", "Venmo"], "THINGS AT THE BEACH": ["sunscreen", "beach towel", "beach umbrella", "sandals", "bucket", "shovel", "cooler", "flip flops", "sunglasses", "swimsuit", "lawn chair", "picnic blanket", "beach ball", "seashell", "surfboard", "floatie", "snorkel", "paddle", "sandcastle", "beach bag", "sun hat", "water bottle", "volleyball", "kite", "boogie board", "beach mat", "cover up", "goggles", "beach read", "portable speaker", "after-sun lotion", "pool noodle", "sand toys", "mesh tote", "wet wipes", "dry bag", "swim trunks", "rash guard", "shell necklace", "sun visor", "beach cart", "umbrella anchor", "camp chair", "beach radio", "cooler pack", "water shoes", "sun shelter", "folding table", "frisbee", "snack pack"]};
  const PREFIX_NAMES = ["apple", "break", "star", "light", "home", "power", "night", "water", "moon", "sun", "blue", "gold", "heart", "fire", "love", "game", "hand", "head", "work", "book", "silver", "dream", "sky", "road", "time", "day", "snow", "rain", "wind", "sea", "tree", "bird", "stone", "river", "field"];
  const SUFFIX_MASTER = ["light", "fish", "dust", "power", "sign", "player", "chart", "burst", "trail", "field", "shape", "gazer", "map", "fruit", "board", "maker", "turn", "ship", "watch", "line", "fall", "child", "point", "shine", "path", "spark", "case", "gate", "stream", "stone", "print", "song", "room", "frame", "route", "talk", "side", "box", "value", "mark", "cast", "city", "phase", "drive", "bloom", "glow", "sketch", "signal", "garden", "plate"];
  const board = document.getElementById("board");
  const mistakesEl = document.getElementById("mistakes");
  const dateEl = document.getElementById("puzzleDate");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const deselectBtn = document.getElementById("deselectBtn");

  function seedForToday() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  }
  function formatLongDate(k) {
    const y = Number(k.slice(0,4)), m = Number(k.slice(4,6))-1, d = Number(k.slice(6,8));
    return new Date(y,m,d).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  }
  function seedNumber(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }
  function rand(seed) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }
  function shuffle(arr, seed) {
    const copy = [...arr]; let s = seed;
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand(s++) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function pick45(arr, seed) {
    const uniq = [...new Set(arr)];
    return shuffle(uniq, seed).slice(0, 45);
  }
  function createDailyCategories(key) {
    const seed = seedNumber(key);
    const categories = [];
    let idx = 0;
    Object.entries(BASE_POOLS).forEach(([name, arr]) => {
      categories.push({ name, words: pick45(arr, seed + idx * 101) });
      idx++;
    });
    PREFIX_NAMES.forEach(name => {
      const root = name.toLowerCase();
      categories.push({ name: `WORDS WITH ${name.toUpperCase()}`, words: pick45(SUFFIX_MASTER, seed + idx * 101).map(s => `${root} ${s}`) });
      idx++;
    });
    const seen = new Set();
    categories.forEach(cat => {
      cat.words = cat.words.map(word => {
        if (!seen.has(word)) { seen.add(word); return word; }
        const marked = `${word} [${cat.name.toLowerCase().split(" ").slice(0,2).join(" ")}]`;
        seen.add(marked);
        return marked;
      });
    });
    return categories.slice(0,45);
  }
  function buildFreshState() {
    const dateKey = seedForToday();
    const cats = createDailyCategories(dateKey);
    const tiles = [];
    const lookup = {};
    cats.forEach((cat, idx) => cat.words.forEach(word => {
      tiles.push(word);
      lookup[word] = { name:cat.name, color:GROUP_COLORS[idx % GROUP_COLORS.length] };
    }));
    return { dateKey, lookup, groups: shuffle(tiles, seedNumber(dateKey) + 999).map(word => ({ words:[word], solved:false, category:null, color:null })), selectedIndex:null, mistakes:0 };
  }
  function validSaved(saved, fresh) {
    if (!saved || saved.dateKey !== fresh.dateKey || !Array.isArray(saved.groups)) return false;
    const words = saved.groups.flatMap(g => g.words || []);
    if (words.length !== 45 * 45) return false;
    const uniq = new Set(words);
    if (uniq.size !== 45 * 45) return false;
    const valid = new Set(Object.keys(fresh.lookup));
    for (const w of uniq) if (!valid.has(w)) return false;
    return true;
  }
  function loadState() {
    const fresh = buildFreshState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fresh;
      const saved = JSON.parse(raw);
      if (!validSaved(saved, fresh)) return fresh;
      return { dateKey:fresh.dateKey, lookup:fresh.lookup, groups:saved.groups, selectedIndex:null, mistakes:Number.isFinite(saved.mistakes)?saved.mistakes:0 };
    } catch { return fresh; }
  }
  let state = loadState();
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dateKey:state.dateKey, groups:state.groups, mistakes:state.mistakes }));
  }
  function preview(group) {
    const t = group.words.slice(0,2).join(", ");
    return group.words.length >= 3 ? `${t}, ... [${group.words.length}]` : t;
  }
  function categoryForWords(words) {
    const first = state.lookup[words[0]];
    if (!first) return null;
    for (const w of words) {
      const info = state.lookup[w];
      if (!info || info.name !== first.name) return null;
    }
    return first;
  }
  function shakeIndex(i) {
    const tile = board.children[i];
    if (tile) { tile.classList.add("shake"); setTimeout(() => tile.classList.remove("shake"), 280); }
  }
  function rejectMerge(i) {
    state.mistakes += 1;
    requestAnimationFrame(() => shakeIndex(i));
  }
  function mergeIntoSecond(a, b) {
    const mergedWords = [...state.groups[a].words, ...state.groups[b].words];
    const category = categoryForWords(mergedWords);
    if (!category) { rejectMerge(b); return; }
    const merged = { words: mergedWords, solved:false, category:null, color:null };
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
    if (!g || g.solved) return;
    if (state.selectedIndex === null) { state.selectedIndex = i; render(); return; }
    if (state.selectedIndex === i) { state.selectedIndex = null; render(); return; }
    mergeIntoSecond(state.selectedIndex, i);
    state.selectedIndex = null;
    saveState();
    render();
  }
  function render() {
    dateEl.textContent = formatLongDate(state.dateKey);
    mistakesEl.textContent = String(state.mistakes);
    board.innerHTML = "";
    state.groups.forEach((g, i) => {
      const tile = document.createElement("div");
      tile.className = "tile";
      if (g.solved) {
        tile.classList.add("solved-tile", "hoverable");
        tile.style.background = g.color || GROUP_COLORS[0];
      } else {
        tile.classList.add(g.words.length > 1 ? "merged" : "single");
        if (state.selectedIndex === i) tile.classList.add("selected");
        if (g.words.length >= 3) tile.classList.add("hoverable");
      }
      const label = document.createElement("div");
      label.textContent = g.solved ? (g.category || "") : preview(g);
      tile.appendChild(label);
      if (g.solved || g.words.length >= 3) {
        const hover = document.createElement("div");
        hover.className = "hover-content";
        hover.textContent = g.words.join(", ");
        tile.appendChild(hover);
      }
      if (!g.solved) tile.addEventListener("click", () => handleClick(i));
      board.appendChild(tile);
    });
  }
  shuffleBtn.addEventListener("click", () => {
    const solved = state.groups.filter(g => g.solved);
    const unsolved = state.groups.filter(g => !g.solved);
    state.groups = [...solved, ...shuffle(unsolved, seedNumber(state.dateKey) + (Date.now() % 1000))];
    state.selectedIndex = null; saveState(); render();
  });
  deselectBtn.addEventListener("click", () => { state.selectedIndex = null; render(); });
  render();
});
