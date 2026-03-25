document.addEventListener("DOMContentLoaded", () => {
  const SIZE = 45;
  const STORAGE_KEY = "connections-45x45-weekly-final-v1";
  const GROUP_COLORS = ["#f9df6d", "#a0c35a", "#b0c4ef", "#ba81c5"];

  const CATEGORY_BANK = {
    "FRUITS": ["apple","banana","orange","grape","pear","peach","plum","mango","kiwi","papaya","pineapple","strawberry","raspberry","blueberry","blackberry","melon","watermelon","coconut","lemon","lime","apricot","fig","guava","lychee","nectarine","passionfruit","pomegranate","dragon fruit","persimmon","tangerine","cranberry","date","grapefruit","mulberry","quince","starfruit","currant","boysenberry","cantaloupe","honeydew","jackfruit","kumquat","yuzu","pomelo","longan"],
    "VEGETABLES": ["carrot","broccoli","spinach","lettuce","cabbage","kale","cauliflower","celery","cucumber","zucchini","eggplant","pepper","tomato","potato","sweet potato","onion","garlic","beet","radish","turnip","parsnip","leek","shallot","okra","artichoke","asparagus","pea","green bean","corn","pumpkin","squash","yam","fennel","brussels sprouts","bok choy","chard","arugula","watercress","rutabaga","jicama","daikon","cassava","taro","edamame","collard greens"],
    "ANIMALS": ["lion","tiger","bear","wolf","fox","dog","cat","zebra","panda","horse","eagle","shark","whale","snake","frog","deer","otter","camel","goat","sheep","rabbit","owl","falcon","moose","bison","beaver","lynx","cougar","koala","lemur","rhino","hippo","gecko","iguana","salmon","trout","crab","lobster","octopus","squid","penguin","seal","dolphin","orca","buffalo"],
    "BIRDS": ["sparrow","robin","blue jay","cardinal","crow","raven","hawk","parrot","canary","finch","woodpecker","hummingbird","pelican","seagull","albatross","flamingo","heron","stork","duck","goose","swan","turkey","peacock","ostrich","emu","kiwi","loon","oriole","blackbird","kingfisher","magpie","mockingbird","nightingale","phoebe","pigeon","dove","quail","wren","warbler","vulture","condor","cockatoo","chickadee","swallow","falcon"],
    "COLOURS": ["red","blue","green","yellow","purple","pink","black","white","orange colour","brown","teal","navy","gold colour","silver colour","cyan","magenta","beige","maroon","olive","indigo","charcoal","ivory","lavender colour","turquoise colour","mustard","burgundy","mint","tan","cream","scarlet","crimson","amber colour","bronze","lilac","periwinkle","sage","coral","taupe","ochre","russet","khaki","fuchsia","aqua","jade colour","slate colour"],
    "CITIES": ["Paris","Rome","Tokyo","London","Berlin","Madrid","Vienna","Prague","Dublin","Lisbon","Oslo","Athens","Warsaw","Zurich","Helsinki","Budapest","Seoul","Bangkok","Delhi","Cairo","Montreal","Toronto","Vancouver","Ottawa","Chicago","Boston","Miami","Seattle","Sydney","Melbourne","Auckland","Brussels","Munich","Hamburg","Florence","Naples","Kyoto","Busan","Lima","Santiago","Bogota","Reykjavik","Doha","Dubai","Marrakesh"],
    "COUNTRIES": ["Canada","United States","Mexico","Brazil","Argentina","Chile","Peru","Colombia","France","Germany","Spain","Italy","Portugal","Netherlands","Belgium","Switzerland","Austria","Poland","Sweden","Norway","Finland","Denmark","Ireland","United Kingdom","Iceland","Greece","Turkey","Egypt","Morocco","South Africa","India","China","Japan","South Korea","Thailand","Vietnam","Indonesia","Philippines","Australia","New Zealand","Nigeria","Kenya","Ethiopia","Saudi Arabia","Qatar"],
    "ACTORS": ["Zendaya","Tom Holland","Scarlett Johansson","Anne Hathaway","Margot Robbie","Robert De Niro","Johnny Depp","Meryl Streep","Leonardo DiCaprio","Chris Evans","Emma Stone","Ryan Gosling","Julia Roberts","Denzel Washington","Sandra Bullock","Brad Pitt","Natalie Portman","Cillian Murphy","Paul Rudd","Keanu Reeves","Viola Davis","Jennifer Lawrence","Matt Damon","George Clooney","Nicole Kidman","Cate Blanchett","Pedro Pascal","Ayo Edebiri","Dev Patel","Daniel Kaluuya","Florence Pugh","Kerry Washington","Angela Bassett","Jeff Goldblum","Winona Ryder","Sigourney Weaver","Oscar Isaac","Adam Driver","Rachel McAdams","Ethan Hawke","Jodie Foster","Amy Adams","Jenna Ortega","Millie Bobby Brown","Saoirse Ronan"],
    "SINGERS": ["Taylor Swift","Ariana Grande","Cher","Miley Cyrus","Olivia Rodrigo","Sabrina Carpenter","Drake","Billie Eilish","Elvis Presley","Aretha Franklin","Dua Lipa","Adele","Rihanna","Beyonce","Bruno Mars","Shania Twain","Celine Dion","Katy Perry","Justin Bieber","The Weeknd","Harry Styles","Sheryl Crow","Mariah Carey","Whitney Houston","Britney Spears","Christina Aguilera","Lorde","Sia","Hozier","Ed Sheeran","Sam Smith","Shawn Mendes","Kelly Clarkson","Pink","Tina Turner","Dolly Parton","Carly Rae Jepsen","Nelly Furtado","Janet Jackson","Alicia Keys","Usher","Janelle Monae","Lana Del Rey","Kesha","Megan Thee Stallion"],
    "MOVIE TITLES": ["Inception","Interstellar","Titanic film","Barbie film","Jaws","Frozen","Rocky","Skyfall","Cars","Elf","Shrek","Moana","Gladiator","Arrival","Whiplash","Coco","Soul","The Matrix","Grease","Chicago film","Parasite","Her","Gravity","Drive","Dune","Brooklyn","Spotlight","Juno","Selma","Hook","Bambi","Tangled","Up","Speed film","Twister","Hitch","Clueless film","Scream film","Memento","Braveheart","Love Actually","Casablanca","Psycho","Nope","Lincoln"],
    "SONG TITLES": ["Firework","Imagine","Halo","Toxic","Royals","Happy song","Umbrella","Grenade","Sorry","Believer","Dreams","Waterfalls","Chandelier","Hero","Vogue","Call Me Maybe","Bad Guy","Hello","Formation","Applause","Ironic","Zombie","Valerie","Respect","Irreplaceable","Photograph","Clocks","Riptide","Torn","Bleeding Love","No Scrubs","Watermelon Sugar","Stay song","Yellow song","Poker Face","Levitating","Single Ladies","Shivers","Vampire","Rolling in the Deep","Complicated","Genie in a Bottle","Tik Tok song","Style song","Blank Space"],
    "BOOKS": ["1984","Dune novel","Beloved","Jane Eyre","Hamlet","Macbeth","Frankenstein","Dracula","Emma novel","Rebecca novel","It novel","Carrie","Matilda book","Holes","Coraline","Persuasion","Ulysses","Lolita","Room novel","Normal People","Little Women","Anne of Green Gables","Pride and Prejudice","Sense and Sensibility","The Odyssey","The Iliad","The Great Gatsby","The Bell Jar","The Handmaid's Tale","The Road","The Kite Runner","The Secret History","Atonement","The Goldfinch","Cloud Atlas","Station Eleven","Never Let Me Go","The Book Thief","The Giver","Charlotte's Web","The Hobbit","The Fellowship of the Ring","The Two Towers","The Return of the King","To Kill a Mockingbird"],
    "TV SHOWS": ["Friends","Seinfeld","The Office","Parks and Recreation","Breaking Bad","Better Call Saul","Mad Men","Succession","The Sopranos","The Wire","Lost","Grey's Anatomy","The Bear","The Crown","Bridgerton","The Last of Us","Stranger Things","The Simpsons","Frasier","Modern Family","Abbott Elementary","Yellowjackets","Twin Peaks","Sherlock","House","The X-Files","Buffy the Vampire Slayer","Gossip Girl","Gilmore Girls","One Tree Hill","The OC","Euphoria","Fleabag","Ted Lasso","Brooklyn Nine-Nine","Community","30 Rock","Arrested Development","Veep","Westworld","The Good Place","Friday Night Lights","Downton Abbey","Killing Eve","Big Little Lies"],
    "TECH BRANDS": ["Apple","Samsung","Google","Microsoft","Amazon","Meta","Sony","LG","Intel","AMD","Nvidia","Dell","HP","Lenovo","Asus","Acer","Huawei","Xiaomi","OnePlus","Oppo","Vivo","Tesla","IBM","Oracle","Cisco","Adobe","Spotify company","Netflix company","Uber company","Airbnb company","PayPal","Shopify","Slack","Zoom","Dropbox","eBay","Pinterest company","Snapchat","TikTok company","Reddit","Discord","Twitch","Square","Stripe","Canva"],
    "PHONE APPS": ["Instagram","TikTok app","YouTube app","Spotify app","Uber app","Google Maps","Notes app","Calendar app","Photos app","Camera app","Gmail app","WhatsApp","Messenger app","Zoom app","Netflix app","Weather app","Clock app","Reminders","Discord app","Pinterest app","Threads","Snapchat app","Telegram","Signal app","Apple Music","Google Drive","Dropbox app","Canva app","Duolingo","Strava","Slack app","Reddit app","Amazon app","Etsy app","Airbnb app","Booking app","Transit app","Waze","Shazam","CapCut","Pocket Casts","Notion","Todoist","LinkedIn app","Facebook app"],
    "SPORTS": ["soccer","basketball","baseball","hockey","tennis","golf","rugby","cricket","boxing","swimming","running","cycling","skiing","snowboarding","volleyball","badminton","surfing","rowing","wrestling","archery","skateboarding","lacrosse","curling","water polo","fencing","gymnastics","triathlon","marathon","handball","softball","squash","table tennis","figure skating","speed skating","kayaking","canoeing","diving","judo","karate","taekwondo","sailing","bobsled","luge","biathlon","climbing"],
    "BREAKFAST FOODS": ["toast","bagel","pancakes","waffles","omelette","bacon","sausage","cereal","granola","yogurt","hash browns","oatmeal","breakfast muffin","croissant","fruit cup","smoothie","fried eggs","home fries","jam","butter","poached eggs","scrambled eggs","english muffin","avocado toast","breakfast burrito","breakfast sandwich","crepes","porridge","grits","quiche slice","bran flakes","chia pudding","banana bread","apple sauce cup","sauteed mushrooms","frittata","breakfast wrap","toast soldiers","hard boiled eggs","breakfast potatoes","rye toast","cream cheese","smoked salmon","overnight oats","waffle sticks"],
    "DESSERTS": ["cake","pie","cookie","brownie","muffin","donut","croissant pastry","tart","pudding","ice cream","sundae","sorbet","cheesecake","macaron","eclair","cannoli","fudge","truffle","cupcake","parfait","creme brulee","churro","baklava","gelato","pavlova","shortbread","bread pudding","rice pudding","flan","tiramisu","meringue","whoopie pie","lemon bar","snickerdoodle","biscotti","marshmallow square","cobbler","blondie","mooncake","madeleine","profiterole","souffle","strudel","danish","beignet"],
    "FAST FOOD CHAINS": ["McDonald's","Burger King","Wendy's","Subway chain","KFC","Taco Bell","Domino's","Pizza Hut","Popeyes","Chipotle","Five Guys","A&W","Arby's","Sonic","Dairy Queen","Little Caesars","Panera","Chick-fil-A","In-N-Out","Shake Shack","Tim Hortons","Harvey's","Swiss Chalet","Nando's","Quiznos","Qdoba","Jack in the Box","White Castle","Carl's Jr.","Hardee's","Culver's","Whataburger","Jollibee","Pret A Manger","Cinnabon","Sbarro","Baskin-Robbins","Papa Johns","Hungry Jack's","Del Taco","Long John Silver's","Church's Chicken","Wingstop","Jersey Mike's","Firehouse Subs"],
    "COFFEE DRINKS": ["latte","cappuccino","espresso","americano","mocha","macchiato","flat white","cortado","cold brew","frappuccino","iced coffee","irish coffee","affogato","ristretto","lungo","red eye","black coffee","drip coffee","pour over","french press","cafe au lait","doppio","breve","mocha latte","vanilla latte","caramel latte","hazelnut latte","iced latte","nitro cold brew","espresso con panna","dirty chai","pumpkin spice latte","turkish coffee","cuban coffee","vienna coffee","romano","freddo espresso","freddo cappuccino","iced americano","white mocha","marocchino","cafe bombon","shakerato","flat black","bulletproof coffee"],
    "PASTA SHAPES": ["spaghetti","penne","rigatoni","fusilli","farfalle","linguine","fettuccine","tagliatelle","orecchiette","gnocchi","ravioli","tortellini","lasagna sheets","bucatini","capellini","angel hair","cavatappi","ziti","rotini","macaroni","shells","manicotti","cannelloni","pappardelle","radiatori","gemelli","conchiglie","ditalini","orzo","acini di pepe","campanelle","mafaldine","strozzapreti","trofie","casarecce","lumache","mezze penne","spaghettini","tagliolini","vermicelli","trottole","pipe rigate","paccheri","sedani","farfalline"],
    "CHEESES": ["cheddar","mozzarella","brie","camembert","gouda","swiss cheese","parmesan","pecorino","feta","halloumi","goat cheese","blue cheese","gorgonzola","stilton","provolone","havarti","edam","emmental","gruyere","fontina","asiago","ricotta","mascarpone","paneer","monterey jack","colby","pepper jack","muenster","raclette","taleggio","manchego","comte","boursin","bocconcini","burrata","cotija","queso fresco","jarlsberg","limburger","neufchatel","romano cheese","reblochon","roquefort","wensleydale","leicester"],
    "BREAD TYPES": ["sourdough","baguette","ciabatta","focaccia","rye bread","whole wheat bread","white bread","multigrain bread","pita","naan","flatbread","brioche","challah","pretzel bread","cornbread","banana bread loaf","english muffin bread","dinner roll","kaiser roll","bagel bread","croissant bread","lavash","matzo","roti","tortilla","soda bread","irish brown bread","pane carasau","injera","pain de mie","milk bread","potato bread","seed bread","olive bread","garlic bread","pullman loaf","bap","hoagie roll","sub roll","hamburger bun","hot dog bun","panettone","stollen","crumpet","muffuletta bread"],
    "CANDY": ["Skittles","M&M's","Snickers","Mars bar","Twix","KitKat","Smarties candy","Reese's Pieces","Reese's Cups","Sour Patch Kids","Swedish Fish","Starburst","Jolly Ranchers","Nerds","Airheads","Tootsie Roll","Twizzlers","Licorice","Gummy Bears","Gummy Worms","Jelly Beans","Lollipop","Candy Cane","Peppermint Patty","Milky Way","Butterfinger","Baby Ruth","Werther's Original","Rolo","Whoppers candy","Lifesavers","Gobstopper","Jawbreaker","Caramel square","Fudge cube","Saltwater taffy","Lemon drop","Toffee candy","Peanut brittle","Rock candy","Pop Rocks","Chocolate truffle candy","Ferrero Rocher","Kinder Bueno","Hershey bar"],
    "ICE CREAM FLAVOURS": ["vanilla","chocolate","strawberry ice cream","mint chocolate chip","cookies and cream","rocky road","butter pecan","coffee ice cream","cookie dough","pistachio","neapolitan","salted caramel","moose tracks","banana ice cream","raspberry ripple","black cherry","rum raisin","maple walnut","birthday cake","cotton candy","mango ice cream","coconut ice cream","peanut butter cup","dulce de leche","lemon sorbet","orange sherbet","green tea ice cream","ube ice cream","hokey pokey","hazelnut gelato","cheesecake ice cream","brownie batter","s'mores ice cream","toasted marshmallow","bubblegum","peach ice cream","blueberry ice cream","tiramisu gelato","chai ice cream","lavender honey","pumpkin spice","caramel swirl","black sesame","red velvet","apple pie ice cream"],
    "MAKEUP PRODUCTS": ["foundation","concealer","powder","blush","bronzer","highlighter","mascara","eyeliner","eyeshadow","brow pencil","brow gel","lipstick","lip gloss","lip liner","setting spray","primer","contour stick","tinted moisturizer","bb cream","cc cream","false lashes","lash curler","cream blush","liquid blush","stick highlighter","liquid highlighter","setting powder","pressed powder","matte lipstick","satin lipstick","liquid lipstick","glitter shadow","cream shadow","gel eyeliner","kohl pencil","colour corrector","makeup sponge","powder puff","makeup brush","fan brush","kabuki brush","freckle pen","lip balm tint","brow pomade","face palette"],
    "SKINCARE PRODUCTS": ["cleanser","face wash","micellar water","toner","serum","vitamin C serum","retinol serum","hyaluronic acid serum","moisturizer","night cream","eye cream","sunscreen lotion","face oil","essence","sheet mask","clay mask","sleeping mask","spot treatment","pimple patch","exfoliating toner","chemical exfoliant","scrub","balm cleanser","cleansing oil","gel moisturizer","cream moisturizer","lip mask","facial mist","ampoule","niacinamide serum","azelaic acid","peptide serum","barrier cream","makeup remover","face sunscreen stick","face sunscreen spray","under eye patches","overnight peel","facial roller","gua sha","body lotion","hand cream","cuticle oil","body scrub","body wash"],
    "HAIR PRODUCTS": ["shampoo","conditioner","leave-in conditioner","hair mask","dry shampoo","hair oil","hair serum","heat protectant","mousse","gel","hairspray","pomade","wax","curl cream","curl mousse","hair spray wax","root lift spray","sea salt spray","detangler","scalp scrub","scalp serum","purple shampoo","co-wash","volumizing spray","texturizing spray","shine spray","bond repair treatment","hair lotion","edge control","braid spray","hair butter","hair foam","finishing cream","blowout cream","split end mender","hair tonic","hair milk","clarifying shampoo","deep conditioner","smoothing cream","frizz serum","hot oil treatment","hair glaze","toning mask","hair primer"],
    "EXERCISES": ["squat","lunge","push-up","pull-up","plank","burpee","deadlift","bench press","shoulder press","bicep curl","tricep dip","mountain climber","jumping jack","crunch","sit-up","leg raise","glute bridge","hip thrust","calf raise","wall sit","Russian twist","bicycle crunch","step-up","box jump","kettlebell swing","row exercise","lat pulldown","hamstring curl","leg press","chest fly","reverse fly","lateral raise","front raise","skater jump","bear crawl","farmer carry","jump rope","cycling workout","rowing workout","sprint","jog","yoga flow","pilates roll-up","bird dog","superman"],
    "KITCHEN ITEMS": ["fork","knife","spoon","plate","bowl","mug","toaster","fridge","freezer","oven","pan","pot","whisk","ladle","foil","napkin","tray","sink","kettle","colander","cutting board","spatula","peeler","grater","mixing bowl","measuring cup","measuring spoon","blender","can opener","dish rack","tea towel","strainer","rolling pin","tongs","saucepan","stockpot","baking sheet","broiler pan","mortar","pestle","pitcher","cookie sheet","apron","dish soap","sponge"],
    "BATHROOM ITEMS": ["toothbrush","toothpaste","soap","towel","mirror","shampoo","conditioner","razor","mouthwash","toilet paper","plunger","hairbrush","comb","bath mat","sink basin","bathtub","scale","lotion","tissue","medicine cabinet","q tips","cotton pads","hand towel","washcloth","shower curtain","shower cap","tooth floss","deodorant","nail clippers","lip balm","face wash","body wash","hand soap","hair dryer","straightener","curling iron","bathrobe","toilet brush","air freshener","bath salts","loofah","squeegee","drain stopper","sanitizer","tweezers"],
    "OFFICE ITEMS": ["stapler","printer","shredder","laptop","monitor","headset","keyboard","computer mouse","paper","binder","clipboard","eraser","marker","notebook","scanner","calendar planner","desk","office chair","folder","pen","highlighter","sticky notes","whiteboard","projector","charging cable","docking station","desk lamp","paper clips","binder clips","hole punch","filing cabinet","envelope","label maker","conference phone","webcam","headphones","mouse pad","desk organizer","receipt book","planner","ledger","mail tray","packing tape","ink cartridge","rolodex"],
    "FURNITURE": ["sofa","armchair","coffee table","bookshelf","lamp furniture","rug","curtains","throw pillow","blanket","tv stand","side table","dresser","nightstand","bed frame","mattress","duvet","mirror frame","plant stand","coat rack","shoe rack","entry bench","wall art","picture frame","ottoman","desk","ceiling fan","laundry basket","step stool","tool chest","door mat","hanger rack","closet bin","blanket ladder","bath stool","kitchen cart","bar stool","fruit bowl stand","pantry shelf","dish rack stand","paper towel holder","cutlery tray","air purifier","humidifier","alarm clock","wire basket"],
    "TOOLS": ["hammer","screwdriver","wrench","pliers","drill","saw","level","tape measure","utility knife","socket wrench","allen key","clamp","chisel","mallet","handsaw","jigsaw","circular saw","sander","file tool","vise","ladder","flashlight","work gloves","stud finder","paint roller","paint brush","caulking gun","putty knife","scraper","wire cutter","wire stripper","crowbar","shovel tool","rake","hoe tool","axe","chainsaw","pruning shears","bolt cutter","ratchet","multimeter","toolbox","hex wrench","impact driver","torque wrench"],
    "VEHICLES": ["car","truck","van","motorcycle","bicycle","bus vehicle","train vehicle","subway car","tram vehicle","ferry boat","airplane","helicopter","scooter vehicle","skateboard","canoe","kayak","yacht","sailboat","pickup truck","minivan","SUV","sedan","coupe","convertible","wagon","hatchback","semi truck","tractor","bulldozer","forklift","ambulance","fire truck","police cruiser","taxi cab","school bus","streetcar","monorail","rocket ship","jet ski","snowmobile","ATV","golf cart","moped","hot air balloon","glider"],
    "AIRLINES": ["Air Canada","WestJet","United Airlines","Delta Air Lines","American Airlines","Southwest Airlines","JetBlue","Alaska Airlines","Lufthansa","Air France","KLM","British Airways","Virgin Atlantic","Emirates","Qatar Airways","Etihad","Turkish Airlines","Singapore Airlines","Cathay Pacific","Japan Airlines","ANA","Korean Air","Qantas","Air New Zealand","Iberia","TAP Air Portugal","Swiss","Austrian Airlines","Finnair","SAS","Brussels Airlines","Aer Lingus","Ryanair","easyJet","Vueling","Wizz Air","Spirit Airlines","Frontier Airlines","Porter Airlines","Sunwing","EVA Air","Thai Airways","Malaysia Airlines","Philippine Airlines","Saudia"],
    "WORDS WITH APPLE": ["apple pie","apple juice","apple cider","apple watch","apple store","apple core","apple seed","apple tart","apple sauce","apple jam","apple peel","apple orchard","apple crisp","apple slice","apple cake","apple skin","apple pulp","apple snack","apple bite","apple tree","apple butter","apple fritter","apple turnover","apple dumpling","apple muffin","apple strudel","apple compote","apple jelly","apple chips","apple salad","apple crate","apple picker","apple farm","apple press","apple barrel","apple branch","apple blossom","apple cobbler","apple syrup","apple ring","apple candy","apple tartlet","apple smoothie","apple harvest","apple stand"],
    "WORDS WITH BREAK": ["break down","break up","break in","break out","break even","break free","break away","break point","break news","break habit","break silence","break code","break lock","break record","break chain","break rank","break stride","break time","break line","break rule","break dance","break camp","break room","break glass","break wall","break water","break wind","break beat","break bulk","break shot","break step","break string","break fall","break ground","break mark","break neck","break pack","break pad","break seal","break spell","break through","break trail","break turn","break word","break wave"],
    "WORDS WITH LIGHT": ["light bulb","light switch","light year","light house","light show","light rail","light blue","light green","light red","light pink","light gold","light beam","light post","light box","light meter","light ring","light source","light shade","light cone","light touch","light flash","light line","light glow","light spark","light path","light work","light stand","light table","light wave","light storm","light field","light mark","light trail","light fall","light guide","light panel","light signal","light screen","light frame","light print","light lift","light breeze","light dance","light garden","light stone"],
    "WORDS WITH STAR": ["starfish","stardust","starlight","starship","starfruit","stargazer","starpower","star player","star line","starfall","starburst","star trail","star shape","star map","starboard","star maker","star turn","star watch","star point","star shine","star path","star spark","star case","star gate","star stream","star stone","star print","star song","star room","star frame","star route","star talk","star side","star box","star value","star mark","star cast","star city","star phase","star drive","star bloom","star glow","star sketch","star signal","star garden"],
    "WORDS WITH MOON": ["moonlight","moonbeam","moonstone","moonwalk","moonshine","moonrise","moonfall","moonshadow","moonglow","moonriver","moongarden","moondust","moonwatch","moonpath","moonsong","moonphase","moonrock","moonguide","moontrail","moonline","moonfield","moontree","moonmark","moonprint","moonhouse","moonbloom","moonstream","moonring","moonframe","moonsignal","moondrift","mooncrest","moonpool","moonbridge","moonvalley","moontable","moondrink","moonturn","moonroad","moonmist","moonflare","moonpanel","moonscreen","moonharbor","moonbox"],
    "WORDS WITH WATER": ["waterfall","waterline","watermark","watercolor","waterproof","waterfront","waterway","waterside","water table","water tower","water wheel","water bottle","watermelon","watercourse","waterbed","water glass","water tank","water pipe","water gate","water level","water lily","water drop","water sign","water trail","water view","water stream","water garden","water works","water bird","water park","water field","water shade","water room","water light","water stone","water house","water song","water rise","water crest","water print","water box","water path","water road","water basin","water cart"]
  };

  const board = document.getElementById("board");
  const mistakesEl = document.getElementById("mistakes");
  const dateEl = document.getElementById("puzzleDate");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const deselectBtn = document.getElementById("deselectBtn");

  function normalizeSourceWord(word) {
    return String(word)
      .replace(/\s+\[.*?\]$/, "")
      .replace(/\s+(film|song|novel|app|platform|service|company|book|game|drink|beverage|instrument|flower|tree|fish|seafood|vehicle|state|bird|colour|furniture|planner|lotion)$/i, "")
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

  function buildFreshState() {
    const dateKey = weekKey();
    const seed = seedNumber(dateKey);

    const entries = Object.entries(CATEGORY_BANK);
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
