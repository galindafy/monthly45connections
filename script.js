document.addEventListener("DOMContentLoaded", () => {
  const SIZE = 45;
  const STORAGE_KEY = "connections-weekly-real-v2";
  const GROUP_COLORS = ["#f9df6d","#a0c35a","#b0c4ef","#ba81c5"];
  const CATEGORY_BANK = {"FRUITS": ["apple", "banana", "orange", "grape", "pear", "peach", "plum", "mango", "kiwi", "papaya", "pineapple", "strawberry", "raspberry", "blueberry", "blackberry", "melon", "watermelon", "coconut", "lemon", "lime", "apricot", "fig", "guava", "lychee", "nectarine", "passionfruit", "pomegranate", "dragon fruit", "persimmon", "tangerine", "cranberry", "date", "grapefruit", "mulberry", "quince", "starfruit", "currant", "boysenberry", "cantaloupe", "honeydew", "jackfruit", "kumquat", "yuzu", "pomelo", "longan"], "VEGETABLES": ["carrot", "broccoli", "spinach", "lettuce", "cabbage", "kale", "cauliflower", "celery", "cucumber", "zucchini", "eggplant", "pepper", "tomato vegetable", "potato", "sweet potato", "onion", "garlic", "beet", "radish", "turnip", "parsnip", "leek", "shallot", "okra", "artichoke", "asparagus", "pea", "green bean", "corn", "pumpkin", "squash", "yam", "fennel", "brussels sprouts", "bok choy", "chard", "arugula", "watercress", "rutabaga", "jicama", "daikon", "cassava", "taro", "edamame", "collard greens"], "ANIMALS": ["lion", "tiger", "bear", "wolf", "fox", "dog", "cat", "zebra", "panda", "horse", "eagle", "shark", "whale", "snake", "frog", "deer", "otter", "camel", "goat", "sheep", "rabbit", "owl", "falcon", "moose", "bison", "beaver", "lynx", "cougar", "koala", "lemur", "rhino", "hippo", "gecko", "iguana", "salmon", "trout", "crab", "lobster", "octopus", "squid", "penguin", "seal", "dolphin", "orca", "buffalo"], "BIRDS": ["sparrow", "robin", "blue jay", "cardinal bird", "crow", "raven", "eagle bird", "hawk", "falcon bird", "owl bird", "parrot", "canary", "finch", "woodpecker", "hummingbird", "pelican", "seagull", "albatross", "flamingo", "heron", "stork", "duck", "goose", "swan", "turkey bird", "peacock", "ostrich", "emu", "kiwi bird", "loon", "oriole", "blackbird", "kingfisher", "magpie", "mockingbird", "nightingale", "phoebe bird", "pigeon", "dove bird", "quail", "wren", "warbler", "vulture", "condor", "cockatoo"], "FISH AND SEAFOOD": ["salmon fish", "tuna", "cod", "haddock", "halibut", "trout fish", "sardine", "anchovy", "mackerel", "snapper", "bass fish", "catfish", "tilapia", "eel", "sole", "flounder", "grouper", "herring", "swordfish", "marlin", "shrimp", "prawn", "lobster seafood", "crab seafood", "scallop", "mussel", "clam", "oyster", "octopus seafood", "squid seafood", "cuttlefish", "sea urchin", "abalone", "crawfish", "langoustine", "monkfish", "pollock", "mahi mahi", "yellowtail", "whitefish", "bluefish", "carp fish", "perch", "pike", "smelt"], "TREES": ["oak", "maple tree", "pine", "spruce", "fir", "cedar", "birch", "willow", "elm", "ash tree", "beech", "poplar", "sycamore", "magnolia tree", "dogwood", "cherry tree", "apple tree", "pear tree", "peach tree", "plum tree", "walnut tree", "chestnut", "hickory", "cypress", "redwood", "sequoia", "juniper", "hemlock", "larch", "alder", "rowan", "hawthorn", "hornbeam", "eucalyptus", "baobab", "olive tree", "fig tree", "date palm", "coconut palm", "acacia", "aspen", "ginkgo", "jacaranda", "yew", "teak"], "FLOWERS": ["rose", "tulip", "daisy", "sunflower", "lily", "orchid", "peony", "lavender", "violet", "iris", "poppy", "marigold", "jasmine", "gardenia", "dahlia", "camellia", "magnolia flower", "hydrangea", "hibiscus", "chrysanthemum", "daffodil", "bluebell", "snapdragon", "petunia", "begonia", "azalea", "anemone", "carnation", "cosmos", "foxglove", "freesia", "geranium", "gladiolus", "heather", "hollyhock", "hyacinth", "larkspur", "lotus", "morning glory", "nasturtium", "oleander", "pansy", "primrose", "ranunculus", "verbena"], "GEMS AND MINERALS": ["diamond", "ruby", "sapphire", "emerald", "amethyst", "opal", "topaz", "garnet", "jade stone", "turquoise stone", "quartz", "onyx", "agate", "lapis lazuli", "peridot", "aquamarine", "obsidian", "moonstone", "sunstone", "malachite", "citrine", "tourmaline", "zircon", "amber stone", "pearl", "alexandrite", "fluorite", "hematite", "pyrite", "calcite", "feldspar", "mica", "granite", "marble", "slate stone", "basalt", "limestone", "shale", "sandstone", "serpentine", "amazonite", "aventurine", "carnelian", "iolite", "kunzite"], "COLOURS": ["red", "blue", "green", "yellow", "purple", "pink", "black", "white", "orange colour", "brown", "teal", "navy", "gold colour", "silver colour", "cyan", "magenta", "beige", "maroon", "olive", "indigo", "charcoal", "ivory", "lavender", "turquoise", "mustard", "burgundy", "mint", "tan", "cream", "scarlet", "crimson", "amber", "bronze", "lilac", "periwinkle", "sage", "coral", "taupe", "ochre", "russet", "khaki", "fuchsia", "aqua", "jade", "slate"], "CITIES": ["Paris", "Rome", "Tokyo", "London", "Berlin", "Madrid", "Vienna", "Prague", "Dublin", "Lisbon", "Oslo", "Athens", "Warsaw", "Zurich", "Helsinki", "Budapest", "Seoul", "Bangkok", "Delhi", "Cairo", "Montreal", "Toronto", "Vancouver", "Ottawa", "Chicago", "Boston", "Miami", "Seattle", "Sydney", "Melbourne", "Auckland", "Brussels", "Munich", "Hamburg", "Florence", "Naples", "Kyoto", "Busan", "Lima", "Santiago", "Bogota", "Reykjavik", "Doha", "Dubai", "Marrakesh"], "COUNTRIES": ["Canada", "United States", "Mexico", "Brazil", "Argentina", "Chile", "Peru", "Colombia", "France", "Germany", "Spain", "Italy", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria", "Poland", "Sweden", "Norway", "Finland", "Denmark", "Ireland", "United Kingdom", "Iceland", "Greece", "Turkey", "Egypt", "Morocco", "South Africa", "India", "China", "Japan", "South Korea", "Thailand", "Vietnam", "Indonesia", "Philippines", "Australia", "New Zealand", "Nigeria", "Kenya", "Ethiopia", "Saudi Arabia", "Qatar"], "US STATES": ["California", "Texas", "Florida", "New York state", "Pennsylvania", "Illinois", "Ohio", "Georgia state", "North Carolina", "Michigan", "New Jersey", "Virginia", "Washington state", "Arizona", "Massachusetts", "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin", "Colorado", "Minnesota", "South Carolina", "Alabama", "Louisiana", "Kentucky", "Oregon", "Oklahoma", "Connecticut", "Utah", "Iowa", "Nevada", "Arkansas", "Mississippi", "Kansas", "New Mexico", "Nebraska", "West Virginia", "Idaho", "Hawaii state", "Maine", "New Hampshire", "Montana", "Rhode Island", "Delaware"], "CANADIAN PLACES": ["Toronto", "Montreal", "Vancouver", "Ottawa", "Calgary", "Edmonton", "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London Ontario", "Victoria", "Halifax", "Saskatoon", "Regina", "St. John's", "Kelowna", "Windsor", "Kingston", "Sudbury", "Barrie", "Guelph", "Moncton", "Fredericton", "Charlottetown", "Yellowknife", "Whitehorse", "Iqaluit", "Whistler", "Banff", "Niagara Falls", "Thunder Bay", "Red Deer", "Kamloops", "Nanaimo", "Lethbridge", "Medicine Hat", "Moose Jaw", "Brandon", "Trois-Rivieres", "Sherbrooke", "Saguenay", "Saint John", "Laval", "Markham"], "ACTORS": ["Zendaya", "Tom Holland", "Scarlett Johansson", "Anne Hathaway", "Margot Robbie", "Robert De Niro", "Johnny Depp", "Meryl Streep", "Leonardo DiCaprio", "Chris Evans", "Emma Stone", "Ryan Gosling", "Julia Roberts", "Denzel Washington", "Sandra Bullock", "Brad Pitt", "Natalie Portman", "Cillian Murphy", "Paul Rudd", "Keanu Reeves", "Viola Davis", "Jennifer Lawrence", "Matt Damon", "George Clooney", "Nicole Kidman", "Cate Blanchett", "Pedro Pascal", "Ayo Edebiri", "Dev Patel", "Daniel Kaluuya", "Florence Pugh", "Kerry Washington", "Angela Bassett", "Jeff Goldblum", "Winona Ryder", "Sigourney Weaver", "Oscar Isaac", "Adam Driver", "Rachel McAdams", "Ethan Hawke", "Jodie Foster", "Amy Adams", "Jenna Ortega", "Millie Bobby Brown", "Saoirse Ronan"], "SINGERS": ["Taylor Swift", "Ariana Grande", "Cher", "Miley Cyrus", "Olivia Rodrigo", "Sabrina Carpenter", "Drake", "Billie Eilish", "Elvis Presley", "Aretha Franklin", "Dua Lipa", "Adele", "Rihanna", "Beyonce", "Bruno Mars", "Shania Twain", "Celine Dion", "Katy Perry", "Justin Bieber", "The Weeknd", "Harry Styles", "Sheryl Crow", "Mariah Carey", "Whitney Houston", "Britney Spears", "Christina Aguilera", "Lorde", "Sia", "Hozier", "Ed Sheeran", "Sam Smith", "Shawn Mendes", "Kelly Clarkson", "Pink", "Tina Turner", "Dolly Parton", "Carly Rae Jepsen", "Nelly Furtado", "Janet Jackson", "Alicia Keys", "Usher", "Janelle Monae", "Lana Del Rey", "Kesha", "Megan Thee Stallion"], "MOVIE TITLES": ["Inception", "Interstellar", "Titanic", "Barbie", "Jaws", "Frozen", "Rocky", "Skyfall", "Cars", "Elf", "Shrek", "Moana", "Gladiator", "Arrival", "Whiplash", "Coco", "Soul", "The Matrix", "Grease", "Chicago film", "Parasite", "Her", "Gravity", "Drive", "Dune", "Brooklyn", "Spotlight", "Juno", "Selma", "Hook", "Bambi", "Tangled", "Up", "Speed film", "Twister", "Hitch", "Clueless", "Scream", "Memento", "Braveheart", "Love Actually", "Casablanca", "Psycho", "Nope", "Lincoln"], "SONG TITLES": ["Firework", "Imagine", "Halo", "Toxic", "Royals", "Happy", "Umbrella", "Grenade", "Sorry", "Believer", "Dreams", "Waterfalls", "Chandelier", "Hero", "Vogue", "Call Me Maybe", "Bad Guy", "Hello", "Formation", "Applause", "Ironic", "Zombie", "Valerie", "Respect", "Irreplaceable", "Photograph", "Clocks", "Riptide", "Torn", "Bleeding Love", "No Scrubs", "Watermelon Sugar", "Stay", "Yellow", "Poker Face", "Levitating", "Single Ladies", "Shivers", "Vampire", "Rolling in the Deep", "Complicated", "Genie in a Bottle", "Tik Tok", "Style song", "Blank Space"], "BOOKS": ["1984", "Dune novel", "Beloved", "Jane Eyre", "Hamlet", "Macbeth", "Frankenstein", "Dracula", "Emma", "Rebecca novel", "It novel", "Carrie", "Matilda book", "Holes", "Coraline", "Persuasion", "Ulysses", "Lolita", "Room novel", "Normal People", "Little Women", "Anne of Green Gables", "Pride and Prejudice", "Sense and Sensibility", "The Odyssey", "The Iliad", "The Great Gatsby", "The Bell Jar", "The Handmaid's Tale", "The Road", "The Kite Runner", "The Secret History", "Atonement", "The Goldfinch", "Cloud Atlas", "Station Eleven", "Never Let Me Go", "The Book Thief", "The Giver", "Charlotte's Web", "The Hobbit", "The Fellowship of the Ring", "The Two Towers", "The Return of the King", "To Kill a Mockingbird"], "TV SHOWS": ["Friends", "Seinfeld", "The Office", "Parks and Recreation", "Breaking Bad", "Better Call Saul", "Mad Men", "Succession", "The Sopranos", "The Wire", "Lost", "Grey's Anatomy", "The Bear", "The Crown", "Bridgerton", "The Last of Us", "Stranger Things", "The Simpsons", "Frasier", "Modern Family", "Abbott Elementary", "Yellowjackets", "Twin Peaks", "Sherlock", "House", "The X-Files", "Buffy the Vampire Slayer", "Gossip Girl", "Gilmore Girls", "One Tree Hill", "The OC", "Euphoria", "Fleabag", "Ted Lasso", "Brooklyn Nine-Nine", "Community", "30 Rock", "Arrested Development", "Veep", "Westworld", "The Good Place", "Friday Night Lights", "Downton Abbey", "Killing Eve", "Big Little Lies"], "TECH BRANDS": ["Apple", "Samsung", "Google", "Microsoft", "Amazon", "Meta", "Sony", "LG", "Intel", "AMD", "Nvidia", "Dell", "HP", "Lenovo", "Asus", "Acer", "Huawei", "Xiaomi", "OnePlus", "Oppo", "Vivo", "Tesla", "IBM", "Oracle", "Cisco", "Adobe", "Spotify", "Netflix", "Uber", "Airbnb", "PayPal", "Shopify", "Slack", "Zoom", "Dropbox", "eBay", "Pinterest", "Snapchat", "TikTok", "Reddit", "Discord", "Twitch", "Square", "Stripe", "Canva"], "PHONE APPS": ["Instagram", "TikTok", "YouTube app", "Spotify", "Uber", "Google Maps", "Notes", "Calendar", "Photos", "Camera", "Gmail", "WhatsApp", "Messenger", "Zoom", "Netflix", "Weather", "Clock", "Reminders", "Discord", "Pinterest", "Threads", "Snapchat", "Telegram", "Signal app", "Apple Music", "Google Drive", "Dropbox app", "Canva app", "Duolingo", "Strava", "Slack", "Reddit", "Amazon app", "Etsy app", "Airbnb", "Booking app", "Transit app", "Waze", "Shazam", "CapCut", "Pocket Casts", "Notion", "Todoist", "LinkedIn app", "Facebook"], "SPORTS": ["soccer", "basketball", "baseball", "hockey", "tennis", "golf", "rugby", "cricket", "boxing", "swimming", "running", "cycling", "skiing", "snowboarding", "volleyball", "badminton", "surfing", "rowing", "wrestling", "archery", "skateboarding", "lacrosse", "curling", "water polo", "fencing", "gymnastics", "triathlon", "marathon", "handball", "softball", "squash", "table tennis", "figure skating", "speed skating", "kayaking", "canoeing", "diving", "judo", "karate", "taekwondo", "sailing", "bobsled", "luge", "biathlon", "climbing"], "BREAKFAST FOODS": ["toast", "bagel", "pancakes", "waffles", "omelette", "bacon", "sausage", "cereal", "granola", "yogurt", "hash browns", "oatmeal", "breakfast muffin", "croissant", "fruit cup", "smoothie", "fried eggs", "home fries", "jam", "butter", "poached eggs", "scrambled eggs", "english muffin", "avocado toast", "breakfast burrito", "breakfast sandwich", "crepes", "porridge", "grits", "quiche slice", "bran flakes", "chia pudding", "banana bread", "apple sauce cup", "sauteed mushrooms", "frittata", "breakfast wrap", "toast soldiers", "hard boiled eggs", "breakfast potatoes", "rye toast", "cream cheese", "smoked salmon", "overnight oats", "waffle sticks"], "DESSERTS": ["cake", "pie", "cookie", "brownie", "muffin", "donut", "croissant pastry", "tart", "pudding", "ice cream", "sundae", "sorbet", "cheesecake", "macaron", "eclair", "cannoli", "fudge", "truffle", "cupcake", "parfait", "creme brulee", "churro", "baklava", "gelato", "pavlova", "shortbread", "bread pudding", "rice pudding", "flan", "tiramisu", "meringue", "whoopie pie", "lemon bar", "snickerdoodle", "biscotti", "marshmallow square", "cobbler", "blondie", "mooncake", "madeleine", "profiterole", "souffle", "strudel", "danish", "beignet"], "FAST FOOD CHAINS": ["McDonald's", "Burger King", "Wendy's", "Subway chain", "KFC", "Taco Bell", "Domino's", "Pizza Hut", "Popeyes", "Chipotle", "Five Guys", "A&W", "Arby's", "Sonic", "Dairy Queen", "Little Caesars", "Panera", "Chick-fil-A", "In-N-Out", "Shake Shack", "Tim Hortons", "Harvey's", "Swiss Chalet", "Nando's", "Quiznos", "Qdoba", "Jack in the Box", "White Castle", "Carl's Jr.", "Hardee's", "Culver's", "Whataburger", "Jollibee", "Pret A Manger", "Cinnabon", "Sbarro", "Baskin-Robbins", "Papa Johns", "Hungry Jack's", "Del Taco", "Long John Silver's", "Church's Chicken", "Wingstop", "Jersey Mike's", "Firehouse Subs"], "COFFEE DRINKS": ["latte", "cappuccino", "espresso", "americano", "mocha", "macchiato", "flat white", "cortado", "cold brew", "frappuccino", "iced coffee", "irish coffee", "affogato", "ristretto", "lungo", "red eye", "black coffee", "drip coffee", "pour over", "french press", "cafe au lait", "doppio", "breve", "mocha latte", "vanilla latte", "caramel latte", "hazelnut latte", "iced latte", "nitro cold brew", "espresso con panna", "dirty chai", "pumpkin spice latte", "turkish coffee", "cuban coffee", "vienna coffee", "romano", "freddo espresso", "freddo cappuccino", "iced americano", "white mocha", "marocchino", "cafe bombon", "shakerato", "flat black", "bulletproof coffee"], "PASTA SHAPES": ["spaghetti", "penne", "rigatoni", "fusilli", "farfalle", "linguine", "fettuccine", "tagliatelle", "orecchiette", "gnocchi", "ravioli", "tortellini", "lasagna sheets", "bucatini", "capellini", "angel hair", "cavatappi", "ziti", "rotini", "macaroni", "shells", "manicotti", "cannelloni", "pappardelle", "radiatori", "gemelli", "conchiglie", "ditalini", "orzo", "acini di pepe", "campanelle", "mafaldine", "strozzapreti", "trofie", "casarecce", "lumache", "mezze penne", "spaghettini", "tagliolini", "vermicelli", "trottole", "pipe rigate", "paccheri", "sedani", "farfalline"], "CHEESES": ["cheddar", "mozzarella", "brie", "camembert", "gouda", "swiss cheese", "parmesan", "pecorino", "feta", "halloumi", "goat cheese", "blue cheese", "gorgonzola", "stilton", "provolone", "havarti", "edam", "emmental", "gruyere", "fontina", "asiago", "ricotta", "mascarpone", "paneer", "monterey jack", "colby", "pepper jack", "muenster", "raclette", "taleggio", "manchego", "comte", "boursin", "bocconcini", "burrata", "cotija", "queso fresco", "jarlsberg", "limburger", "neufchatel", "romano cheese", "reblochon", "roquefort", "wensleydale", "leicester"], "BREAD TYPES": ["sourdough", "baguette", "ciabatta", "focaccia", "rye bread", "whole wheat bread", "white bread", "multigrain bread", "pita", "naan", "flatbread", "brioche", "challah", "pretzel bread", "cornbread", "banana bread loaf", "english muffin bread", "dinner roll", "kaiser roll", "bagel bread", "croissant bread", "lavash", "matzo", "roti", "tortilla", "soda bread", "irish brown bread", "pane carasau", "injera", "pain de mie", "milk bread", "potato bread", "seed bread", "olive bread", "garlic bread", "pullman loaf", "bap", "hoagie roll", "sub roll", "hamburger bun", "hot dog bun", "panettone", "stollen", "crumpet", "muffuletta bread"], "CANDY": ["Skittles", "M&M's", "Snickers", "Mars bar", "Twix", "KitKat", "Smarties candy", "Reese's Pieces", "Reese's Cups", "Sour Patch Kids", "Swedish Fish", "Starburst", "Jolly Ranchers", "Nerds", "Airheads", "Tootsie Roll", "Twizzlers", "Licorice", "Gummy Bears", "Gummy Worms", "Jelly Beans", "Lollipop", "Candy Cane", "Peppermint Patty", "Milky Way", "Butterfinger", "Baby Ruth", "Werther's Original", "Rolo", "Whoppers candy", "Lifesavers", "Gobstopper", "Jawbreaker", "Caramel square", "Fudge cube", "Saltwater taffy", "Lemon drop", "Toffee candy", "Peanut brittle", "Rock candy", "Pop Rocks", "Chocolate truffle candy", "Ferrero Rocher", "Kinder Bueno", "Hershey bar"], "ICE CREAM FLAVOURS": ["vanilla", "chocolate", "strawberry ice cream", "mint chocolate chip", "cookies and cream", "rocky road", "butter pecan", "coffee ice cream", "cookie dough", "pistachio", "neapolitan", "salted caramel", "moose tracks", "banana ice cream", "raspberry ripple", "black cherry", "rum raisin", "maple walnut", "birthday cake", "cotton candy", "mango ice cream", "coconut ice cream", "peanut butter cup", "dulce de leche", "lemon sorbet", "orange sherbet", "green tea ice cream", "ube ice cream", "hokey pokey", "hazelnut gelato", "cheesecake ice cream", "brownie batter", "s'mores ice cream", "toasted marshmallow", "bubblegum", "peach ice cream", "blueberry ice cream", "tiramisu gelato", "chai ice cream", "lavender honey", "pumpkin spice", "caramel swirl", "black sesame", "red velvet", "apple pie ice cream"], "MAKEUP PRODUCTS": ["foundation", "concealer", "powder", "blush", "bronzer", "highlighter", "mascara", "eyeliner", "eyeshadow", "brow pencil", "brow gel", "lipstick", "lip gloss", "lip liner", "setting spray", "primer", "contour stick", "tinted moisturizer", "bb cream", "cc cream", "false lashes", "lash curler", "cream blush", "liquid blush", "stick highlighter", "liquid highlighter", "setting powder", "pressed powder", "matte lipstick", "satin lipstick", "liquid lipstick", "glitter shadow", "cream shadow", "gel eyeliner", "kohl pencil", "colour corrector", "makeup sponge", "powder puff", "makeup brush", "fan brush", "kabuki brush", "freckle pen", "lip balm tint", "brow pomade", "face palette"], "SKINCARE PRODUCTS": ["cleanser", "face wash", "micellar water", "toner", "serum", "vitamin C serum", "retinol serum", "hyaluronic acid serum", "moisturizer", "night cream", "eye cream", "sunscreen lotion", "face oil", "essence", "sheet mask", "clay mask", "sleeping mask", "spot treatment", "pimple patch", "exfoliating toner", "chemical exfoliant", "scrub", "balm cleanser", "cleansing oil", "gel moisturizer", "cream moisturizer", "lip mask", "facial mist", "ampoule", "niacinamide serum", "azelaic acid", "peptide serum", "barrier cream", "makeup remover", "face sunscreen stick", "face sunscreen spray", "under eye patches", "overnight peel", "facial roller", "gua sha", "body lotion", "hand cream", "cuticle oil", "body scrub", "body wash"], "HAIR PRODUCTS": ["shampoo", "conditioner", "leave-in conditioner", "hair mask", "dry shampoo", "hair oil", "hair serum", "heat protectant", "mousse", "gel", "hairspray", "pomade", "wax", "curl cream", "curl mousse", "hair spray wax", "root lift spray", "sea salt spray", "detangler", "scalp scrub", "scalp serum", "purple shampoo", "co-wash", "volumizing spray", "texturizing spray", "shine spray", "bond repair treatment", "hair lotion", "edge control", "braid spray", "hair butter", "hair foam", "finishing cream", "blowout cream", "split end mender", "hair tonic", "hair milk", "clarifying shampoo", "deep conditioner", "smoothing cream", "frizz serum", "hot oil treatment", "hair glaze", "toning mask", "hair primer"], "EXERCISES": ["squat", "lunge", "push-up", "pull-up", "plank", "burpee", "deadlift", "bench press", "shoulder press", "bicep curl", "tricep dip", "mountain climber", "jumping jack", "crunch", "sit-up", "leg raise", "glute bridge", "hip thrust", "calf raise", "wall sit", "Russian twist", "bicycle crunch", "step-up", "box jump", "kettlebell swing", "row exercise", "lat pulldown", "hamstring curl", "leg press", "chest fly", "reverse fly", "lateral raise", "front raise", "skater jump", "bear crawl", "farmer carry", "jump rope", "cycling workout", "rowing workout", "sprint", "jog", "yoga flow", "bird dog", "superman", "side plank"], "KITCHEN ITEMS": ["fork", "knife", "spoon", "plate", "bowl", "mug", "toaster", "fridge", "freezer", "oven", "pan", "pot", "whisk", "ladle", "foil", "napkin", "tray", "sink", "kettle", "colander", "cutting board", "spatula", "peeler", "grater", "mixing bowl", "measuring cup", "measuring spoon", "blender", "can opener", "dish rack", "tea towel", "strainer", "rolling pin", "tongs", "saucepan", "stockpot", "baking sheet", "broiler pan", "mortar", "pestle", "pitcher", "cookie sheet", "apron", "dish soap", "sponge"], "BATHROOM ITEMS": ["toothbrush", "toothpaste", "soap", "towel", "mirror", "shampoo", "conditioner", "razor", "mouthwash", "toilet paper", "plunger", "hairbrush", "comb", "bath mat", "sink basin", "bathtub", "scale", "lotion", "tissue", "medicine cabinet", "q tips", "cotton pads", "hand towel", "washcloth", "shower curtain", "shower cap", "tooth floss", "deodorant", "nail clippers", "lip balm", "face wash", "body wash", "hand soap", "hair dryer", "straightener", "curling iron", "bathrobe", "toilet brush", "air freshener", "bath salts", "loofah", "squeegee", "drain stopper", "sanitizer", "tweezers"], "OFFICE ITEMS": ["stapler", "printer", "shredder", "laptop", "monitor", "headset", "keyboard", "computer mouse", "paper", "binder", "clipboard", "eraser", "marker", "notebook", "scanner", "calendar planner", "desk", "office chair", "folder", "pen", "highlighter", "sticky notes", "whiteboard", "projector", "charging cable", "docking station", "desk lamp", "paper clips", "binder clips", "hole punch", "filing cabinet", "envelope", "label maker", "conference phone", "webcam", "headphones", "mouse pad", "desk organizer", "receipt book", "planner", "ledger", "mail tray", "packing tape", "ink cartridge", "rolodex"], "FURNITURE": ["sofa", "armchair", "coffee table", "bookshelf", "lamp furniture", "rug", "curtains", "throw pillow", "blanket", "tv stand", "side table", "dresser", "nightstand", "bed frame", "mattress", "duvet", "mirror frame", "plant stand", "coat rack", "shoe rack", "entry bench", "wall art", "picture frame", "ottoman", "desk", "ceiling fan", "laundry basket", "step stool", "tool chest", "door mat", "hanger rack", "closet bin", "blanket ladder", "bath stool", "kitchen cart", "bar stool", "fruit bowl stand", "pantry shelf", "dish rack stand", "paper towel holder", "cutlery tray", "air purifier", "humidifier", "alarm clock", "wire basket"], "TOOLS": ["hammer", "screwdriver", "wrench", "pliers", "drill", "saw", "level", "tape measure", "utility knife", "socket wrench", "allen key", "clamp", "chisel", "mallet", "handsaw", "jigsaw", "circular saw", "sander", "file tool", "vise", "ladder", "flashlight", "work gloves", "stud finder", "paint roller", "paint brush", "caulking gun", "putty knife", "scraper", "wire cutter", "wire stripper", "crowbar", "shovel tool", "rake", "hoe tool", "axe", "chainsaw", "pruning shears", "bolt cutter", "ratchet", "multimeter", "toolbox", "hex wrench", "impact driver", "torque wrench"], "VEHICLES": ["car", "truck", "van", "motorcycle", "bicycle", "bus vehicle", "train vehicle", "subway car", "tram vehicle", "ferry boat", "airplane", "helicopter", "scooter vehicle", "skateboard", "canoe", "kayak", "yacht", "sailboat", "pickup truck", "minivan", "SUV", "sedan", "coupe", "convertible", "wagon", "hatchback", "semi truck", "tractor", "bulldozer", "forklift", "ambulance", "fire truck", "police cruiser", "taxi cab", "school bus", "streetcar", "monorail", "rocket ship", "jet ski", "snowmobile", "ATV", "golf cart", "moped", "hot air balloon", "glider"], "AIRLINES": ["Air Canada", "WestJet", "United Airlines", "Delta Air Lines", "American Airlines", "Southwest Airlines", "JetBlue", "Alaska Airlines", "Lufthansa", "Air France", "KLM", "British Airways", "Virgin Atlantic", "Emirates", "Qatar Airways", "Etihad", "Turkish Airlines", "Singapore Airlines", "Cathay Pacific", "Japan Airlines", "ANA", "Korean Air", "Qantas", "Air New Zealand", "Iberia", "TAP Air Portugal", "Swiss", "Austrian Airlines", "Finnair", "SAS", "Brussels Airlines", "Aer Lingus", "Ryanair", "easyJet", "Vueling", "Wizz Air", "Spirit Airlines", "Frontier Airlines", "Porter Airlines", "Sunwing", "EVA Air", "Thai Airways", "Malaysia Airlines", "Philippine Airlines", "Saudia"], "BOARD GAMES": ["Monopoly", "Scrabble", "Clue", "Risk", "Catan", "Ticket to Ride", "Pandemic board game", "Carcassonne", "Sorry!", "Battleship board game", "Life board game", "Checkers", "Chess", "Connect Four", "Candy Land", "Mouse Trap", "Operation board game", "Yahtzee", "Trouble", "Guess Who?", "Pictionary", "Taboo", "Codenames board game", "Boggle", "Trivial Pursuit", "Sequence", "Azul", "Splendor", "Dominion", "Agricola", "Root board game", "Wingspan", "Patchwork", "Blokus", "Stratego", "Uno board game", "Jenga", "Mastermind", "Labyrinth", "Mancala", "Twister board game", "The Game of Things", "Scattergories", "Quoridor", "Hive"], "CARD GAMES": ["Uno card game", "Poker", "Bridge", "Hearts", "Spades", "Rummy", "Go Fish", "Crazy Eights", "Old Maid", "War card game", "Blackjack", "Solitaire", "Gin Rummy", "Canasta", "Euchre", "Pinochle", "Cribbage", "Skip-Bo", "Phase 10", "Exploding Kittens", "Cards Against Humanity", "Magic: The Gathering", "Pokemon TCG", "Yu-Gi-Oh!", "President", "Durak", "Mao", "Snap", "Spoons", "Whist", "Set card game", "Dutch Blitz", "Monopoly Deal", "Coup", "Love Letter", "Fluxx", "Dominion cards", "Nerts", "Baccarat", "Kemps", "Golf card game", "Slapjack", "Pit", "Uno Flip", "Tichu"], "MUSICAL INSTRUMENTS": ["piano", "guitar", "violin", "drums", "flute", "clarinet", "trumpet", "saxophone", "cello", "harp", "trombone", "tuba", "oboe", "bassoon", "ukulele", "banjo", "mandolin", "accordion", "harmonica", "xylophone", "marimba", "conga", "bongo", "tambourine", "triangle instrument", "recorder", "double bass", "electric bass", "electric guitar", "synthesizer", "keyboard instrument", "bagpipes", "didgeridoo", "sitar", "tabla", "gong", "castanets", "cymbals", "snare drum", "bass drum", "piccolo", "French horn", "viola", "lute", "theremin"], "BRANDS": ["Nike", "Adidas", "Levi's", "Zara", "Garage", "Hollister", "Aeropostale", "UNIQLO", "Lululemon", "Aritzia", "Old Navy", "Gap", "Puma", "Reebok", "Converse", "H&M", "Mango", "Diesel", "Guess", "Roots", "Champion", "Patagonia", "North Face", "Columbia", "New Balance", "Asics", "Abercrombie", "Free People", "Banana Republic", "Tommy Hilfiger", "Calvin Klein", "Under Armour", "Burberry", "Coach", "Prada", "Gucci", "Versace", "Balenciaga", "Everlane", "American Eagle", "Ralph Lauren", "Dickies", "Carhartt", "Dr. Martens", "Birkenstock"], "BEVERAGES": ["coffee", "tea", "water", "sparkling water", "cola", "orange juice", "apple juice", "milk", "hot chocolate", "latte", "espresso", "cappuccino", "mocha", "matcha latte", "lemonade", "iced tea", "smoothie", "milkshake", "root beer", "ginger ale", "tonic water", "club soda", "kombucha", "chai tea", "herbal tea", "green tea", "black tea", "oolong tea", "white tea", "coconut water", "sports drink", "energy drink", "tomato juice", "grapefruit juice", "cranberry juice", "pineapple juice", "mango lassi", "bubble tea", "cold brew", "americano", "flat white", "macchiato", "frappuccino", "oat milk", "horchata"], "WEATHER WORDS": ["rain", "snow", "sleet", "hail", "fog", "mist", "cloud", "sunshine", "thunder", "lightning", "wind", "breeze", "gust", "hurricane", "tornado", "drizzle", "downpour", "blizzard", "flurries", "heatwave", "drought", "humidity", "forecast", "barometer", "front weather", "rainbow", "ice storm", "dew", "frost", "whiteout", "overcast", "clear skies", "partly cloudy", "monsoon", "cyclone", "storm surge", "cold snap", "wind chill", "UV index", "smog", "haze", "puddle", "sun shower", "squall", "thunderstorm"], "SOCIAL PLATFORMS": ["Instagram", "TikTok platform", "Facebook", "X", "Threads", "Reddit", "Pinterest", "Snapchat", "LinkedIn", "Discord", "Tumblr", "Mastodon", "Bluesky", "YouTube", "Twitch", "WhatsApp status", "Telegram channels", "WeChat", "LINE app", "KakaoTalk", "Signal messenger", "Clubhouse", "Quora", "Medium", "Substack", "Vero", "BeReal", "Patreon", "OnlyFans", "Vimeo", "Flickr", "DeviantArt", "Behance", "Dribbble", "Nextdoor", "Meetup", "Strava social", "Letterboxd", "Goodreads", "SoundCloud", "Bandcamp", "Taringa", "Plurk", "VK", "Weibo"], "STREAMING SERVICES": ["Netflix", "Disney+", "Prime Video", "Hulu", "Max", "Apple TV+", "Paramount+", "Peacock", "Crave", "BritBox", "Discovery+", "YouTube Premium", "DAZN", "MUBI", "Shudder", "Acorn TV", "AMC+", "Starz", "Hayu", "Sundance Now", "Criterion Channel", "Fubo", "Sling TV", "Philo", "Tubi", "Pluto TV", "Roku Channel", "Kanopy", "CBC Gem", "CTV", "Global TV app", "Crunchyroll", "Funimation", "Spotify streaming", "Audible", "Deezer", "Pandora", "iHeartRadio", "SiriusXM", "Twitch streams", "NFL+", "NBA League Pass", "MLB TV", "Apple Music", "Qobuz"], "FAST CASUAL": ["Chipotle", "Panera", "Sweetgreen", "Cava", "Five Guys", "Shake Shack", "Qdoba", "Moe's", "Nando's", "Pret A Manger", "Jersey Mike's", "Firehouse Subs", "Freshii", "Blaze Pizza", "Mod Pizza", "Dig", "Just Salad", "Mendocino Farms", "Taco Time", "Jimmy John's", "Pita Pit", "BIBIBOP", "Chicken Salad Chick", "Zoe's Kitchen", "Culver's", "Earl of Sandwich", "Chopt", "Naf Naf Grill", "Paris Baguette", "Bibigo", "Booster Juice", "Harvey's", "A&W", "Wahlburgers", "East Side Mario's", "The Keg Express", "Taco Del Mar", "Poke Bar", "Rolltation", "Copper Branch", "Milestones Takeout", "Fresh Burrito", "Burrito Boyz", "Paramount Fine Foods", "Second Cup"]};

  const board = document.getElementById("board");
  const mistakesEl = document.getElementById("mistakes");
  const dateEl = document.getElementById("puzzleDate");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const deselectBtn = document.getElementById("deselectBtn");

  function getWeekStartDate() {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    d.setDate(d.getDate() + diff);
    d.setHours(0,0,0,0);
    return d;
  }

  function weekKey() {
    const d = getWeekStartDate();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  }

  function formatLongDate(k) {
    const y = Number(k.slice(0,4));
    const m = Number(k.slice(4,6)) - 1;
    const d = Number(k.slice(6,8));
    return new Date(y, m, d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function seedNumber(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
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

  function pickCount(arr, count, seed) {
    const uniq = [...new Set(arr)];
    if (uniq.length < count) throw new Error("Category pool too small.");
    return shuffle(uniq, seed).slice(0, count);
  }

  function createWeeklyCategories(key) {
    const seed = seedNumber(key);
    const entries = Object.entries(CATEGORY_BANK);
    if (entries.length < SIZE) throw new Error("Not enough categories in bank.");

    const chosen = shuffle(entries, seed + 17).slice(0, SIZE);
    const categories = chosen.map(([name, words], idx) => ({
      name,
      words: pickCount(words, SIZE, seed + idx * 101)
    }));

    const seen = new Set();
    categories.forEach(cat => {
      cat.words = cat.words.map(word => {
        if (!seen.has(word)) {
          seen.add(word);
          return word;
        }
        const marked = `${word} [${cat.name.toLowerCase().split(" ").slice(0,2).join(" ")}]`;
        if (seen.has(marked)) throw new Error("Duplicate tile after qualifier.");
        seen.add(marked);
        return marked;
      });
    });

    return categories;
  }

  function buildFreshState() {
    const dateKey = weekKey();
    const cats = createWeeklyCategories(dateKey);
    const lookup = {};
    const tiles = [];

    cats.forEach((cat, idx) => {
      cat.words.forEach(word => {
        tiles.push(word);
        lookup[word] = {
          name: cat.name,
          color: GROUP_COLORS[idx % GROUP_COLORS.length]
        };
      });
    });

    if (tiles.length !== SIZE * SIZE) throw new Error("Wrong tile count.");

    return {
      dateKey,
      lookup,
      groups: shuffle(tiles, seedNumber(dateKey) + 999).map(word => ({
        words: [word],
        solved: false,
        category: null,
        color: null
      })),
      selectedIndex: null,
      mistakes: 0
    };
  }

  function validSaved(saved, fresh) {
    if (!saved || saved.dateKey !== fresh.dateKey || !Array.isArray(saved.groups)) return false;
    const words = saved.groups.flatMap(g => g.words || []);
    if (words.length !== SIZE * SIZE) return false;
    const uniq = new Set(words);
    if (uniq.size !== SIZE * SIZE) return false;
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
      return {
        dateKey: fresh.dateKey,
        lookup: fresh.lookup,
        groups: saved.groups,
        selectedIndex: null,
        mistakes: Number.isFinite(saved.mistakes) ? saved.mistakes : 0
      };
    } catch {
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
    const firstTwo = group.words.slice(0, 2).join(", ");
    return group.words.length >= 3 ? `${firstTwo}, ... [${group.words.length}]` : firstTwo;
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
    if (tile) {
      tile.classList.add("shake");
      setTimeout(() => tile.classList.remove("shake"), 280);
    }
  }

  function rejectMerge(i) {
    state.mistakes += 1;
    requestAnimationFrame(() => shakeIndex(i));
  }

  function mergeIntoSecond(a, b) {
    const mergedWords = [...state.groups[a].words, ...state.groups[b].words];
    const category = categoryForWords(mergedWords);

    if (!category) {
      rejectMerge(b);
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

  function shuffleUnsolvedInPlace() {
    const seed = seedNumber(state.dateKey) + (Date.now() % 1000);
    const unsolvedIdx = [];
    const unsolvedGroups = [];
    state.groups.forEach((g, i) => {
      if (!g.solved) {
        unsolvedIdx.push(i);
        unsolvedGroups.push(g);
      }
    });
    const shuffled = shuffle(unsolvedGroups, seed);
    unsolvedIdx.forEach((idx, i) => {
      state.groups[idx] = shuffled[i];
    });
  }

  function handleClick(i) {
    const g = state.groups[i];
    if (!g || g.solved) return;

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
    shuffleUnsolvedInPlace();
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