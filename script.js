
document.addEventListener("DOMContentLoaded", () => {
  const SIZE = 45;
  const TOTAL_TILES = SIZE * SIZE;
  const STORAGE_KEY = "connections-weekly-real-v1";
  const GROUP_COLORS = ["#f9df6d", "#a0c35a", "#b0c4ef", "#ba81c5"];
  const POOLS = {"fruits": ["apple", "banana", "orange", "grape", "pear", "peach", "plum", "mango", "kiwi", "papaya", "pineapple", "strawberry", "raspberry", "blueberry", "blackberry", "melon", "watermelon", "coconut", "lemon", "lime", "apricot", "fig", "guava", "lychee", "nectarine", "passionfruit", "pomegranate", "dragon fruit", "persimmon", "tangerine", "cranberry", "date", "grapefruit", "mulberry", "olive fruit", "quince", "starfruit", "currant", "boysenberry", "blood orange", "cantaloupe", "honeydew", "gooseberry", "jackfruit", "kumquat", "yuzu", "pomelo", "mirabelle", "feijoa", "longan", "rambutan", "salak", "jabuticaba", "loquat", "jujube", "medlar"], "colours": ["red", "blue", "green", "yellow", "purple", "pink", "black", "white", "orange colour", "brown", "teal", "navy", "gold", "silver", "cyan", "magenta", "beige", "maroon", "olive colour", "indigo", "charcoal", "ivory", "lavender", "turquoise", "mustard", "burgundy", "peach colour", "mint", "tan", "cream", "scarlet", "crimson", "amber", "bronze hue", "plum colour", "lilac", "periwinkle", "sage", "coral", "taupe", "ochre", "russet", "khaki", "fuchsia", "aqua", "jade", "slate", "sand", "copper hue", "ruby red", "emerald green", "cerulean", "mahogany", "blush", "mauve", "violet"], "cities": ["Paris", "Rome", "Tokyo", "London", "Berlin", "Madrid", "Vienna", "Prague", "Dublin", "Lisbon", "Oslo", "Athens", "Warsaw", "Zurich", "Helsinki", "Budapest", "Seoul", "Bangkok", "Delhi", "Cairo", "Montreal", "Toronto", "Vancouver", "Ottawa", "Chicago", "Boston", "Miami", "Seattle", "Sydney", "Melbourne", "Auckland", "Brussels", "Munich", "Hamburg", "Florence", "Naples", "Kyoto", "Busan", "Lima", "Santiago", "Bogota", "Reykjavik", "Doha", "Dubai", "Marrakesh", "Casablanca", "Stockholm", "Copenhagen", "Tallinn", "Riga", "Vilnius", "Krakow", "Valencia", "Seville", "Bologna", "Turin"], "singers": ["Taylor Swift", "Ariana Grande", "Cher", "Miley Cyrus", "Olivia Rodrigo", "Sabrina Carpenter", "Drake", "Billie Eilish", "Elvis Presley", "Aretha Franklin", "Dua Lipa", "Adele", "Rihanna", "Beyonce", "Bruno Mars", "Shania Twain", "Celine Dion", "Katy Perry", "Justin Bieber", "The Weeknd", "Harry Styles", "Sheryl Crow", "Mariah Carey", "Whitney Houston", "Britney Spears", "Christina Aguilera", "Lorde", "Sia", "Hozier", "Ed Sheeran", "Sam Smith", "Shawn Mendes", "Kelly Clarkson", "Pink singer", "Tina Turner", "Dolly Parton", "Carly Rae Jepsen", "Nelly Furtado", "Janet Jackson", "Alicia Keys", "Usher", "Janelle Monae", "Lana Del Rey", "Kesha", "Megan Thee Stallion", "Ava Max", "Olivia Newton-John", "Annie Lennox", "Joni Mitchell", "Fiona Apple", "Robyn", "Tate McRae", "Bebe Rexha", "Maren Morris", "Kacey Musgraves", "Sade"], "actors": ["Zendaya", "Tom Holland", "Scarlett Johansson", "Anne Hathaway", "Margot Robbie", "Robert De Niro", "Johnny Depp", "Meryl Streep", "Leonardo DiCaprio", "Chris Evans actor", "Emma Stone", "Ryan Gosling", "Julia Roberts", "Denzel Washington", "Sandra Bullock", "Brad Pitt", "Natalie Portman", "Cillian Murphy", "Paul Rudd", "Keanu Reeves", "Viola Davis", "Jennifer Lawrence", "Matt Damon", "George Clooney", "Nicole Kidman", "Cate Blanchett", "Pedro Pascal", "Ayo Edebiri", "Dev Patel", "Daniel Kaluuya", "Florence Pugh", "Kerry Washington", "Angela Bassett", "Jeff Goldblum", "Winona Ryder", "Sigourney Weaver", "Oscar Isaac", "Adam Driver", "Rachel McAdams", "Ethan Hawke", "Jodie Foster", "Amy Adams", "Jenna Ortega", "Millie Bobby Brown", "Saoirse Ronan", "Mahershala Ali", "Samuel L Jackson", "John Boyega", "Lupita Nyongo", "Aubrey Plaza", "Bill Hader", "Kristen Bell", "Riz Ahmed", "Awkwafina", "Glen Powell", "Jacob Elordi"], "brands": ["Nike", "Adidas", "Levis", "Zara", "Garage brand", "Hollister", "Aeropostale", "Uniqlo", "Lululemon", "Aritzia", "Old Navy", "Gap brand", "Puma brand", "Reebok", "Converse", "HM brand", "Mango brand", "Diesel brand", "Guess brand", "Roots brand", "Champion brand", "Patagonia", "North Face", "Columbia brand", "New Balance", "Asics", "Abercrombie", "Free People", "Banana Republic", "Tommy Hilfiger", "Calvin Klein", "Under Armour", "Burberry", "Coach brand", "Prada", "Gucci", "Versace", "Balenciaga", "Everlane", "American Eagle", "Ralph Lauren", "Dickies", "Carhartt", "Dr Martens", "Birkenstock", "Crocs", "Aldo", "Steve Madden", "Oak and Fort", "Dynamite brand", "Aerie", "Fabletics", "Lacoste", "Vans", "Fila", "Skechers"], "animals": ["lion", "tiger", "bear", "wolf", "fox", "dog", "cat", "zebra", "panda", "horse", "eagle", "shark", "whale", "snake", "frog", "deer", "otter", "camel", "goat", "sheep", "rabbit", "owl", "falcon", "moose", "bison", "beaver", "lynx", "cougar", "koala", "lemur", "rhino", "hippo", "gecko", "iguana", "salmon", "trout", "crab", "lobster", "octopus", "squid", "penguin", "seal", "dolphin", "orca", "buffalo", "ferret", "hamster", "guinea pig", "hedgehog", "badger", "elk", "raccoon", "skunk", "antelope", "gazelle", "yak"], "elements": ["iron", "gold metal", "silver metal", "copper metal", "carbon", "oxygen", "hydrogen", "helium", "neon", "argon", "lead", "zinc", "tin", "nickel", "sulfur", "chlorine", "bromine", "iodine", "phosphorus", "mercury element", "aluminium", "calcium", "sodium", "potassium", "lithium", "magnesium", "silicon", "fluorine", "cobalt", "manganese", "chromium", "uranium", "platinum", "palladium", "boron", "selenium", "radon", "xenon", "krypton", "barium", "beryllium", "cadmium", "cesium", "gallium", "germanium", "hafnium", "indium", "iridium", "lanthanum", "molybdenum", "niobium", "osmium", "ruthenium", "strontium", "tantalum", "tellurium"], "planets": ["Mercury planet", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto dwarf", "Ceres", "Io", "Europa", "Ganymede", "Callisto", "Titan moon", "Triton", "Enceladus", "Phobos", "Deimos", "Charon", "Rhea", "Dione", "Tethys", "Iapetus", "Mimas", "Hyperion", "Oberon", "Titania", "Umbriel", "Ariel moon", "Miranda", "Proteus", "Nereid", "Haumea", "Makemake", "Eris", "Sedna", "Vesta", "Pallas", "Hygiea", "Orcus", "Quaoar", "Salacia", "Varuna", "Albiorix", "Janus", "Epimetheus", "Larissa", "Despina", "Galatea moon", "Naiad", "Thalassa", "Halimede", "Sao", "Paaliaq", "Skathi"], "desserts": ["cake", "pie", "cookie", "brownie", "muffin", "donut", "croissant pastry", "tart", "pudding", "ice cream", "sundae", "sorbet", "cheesecake", "macaron", "eclair", "cannoli", "fudge", "truffle", "cupcake", "parfait", "creme brulee", "churro", "baklava", "gelato", "pavlova", "shortbread", "bread pudding", "rice pudding", "flan", "tiramisu", "meringue", "whoopie pie", "lemon bar", "snickerdoodle", "biscotti", "marshmallow square", "cobbler", "blondie", "mooncake", "madeleine", "profiterole", "souffle", "strudel", "danish pastry", "beignet", "panna cotta", "financier", "opera cake", "semifreddo", "sticky toffee pudding", "banoffee pie", "frozen yogurt", "rocky road", "nougat", "crumb cake", "sacher torte"], "breakfast": ["toast", "bagel", "pancakes", "waffles", "omelette", "bacon", "sausage", "cereal", "granola", "yogurt", "hash browns", "oatmeal", "breakfast muffin", "buttery croissant", "fruit cup", "smoothie", "fried eggs", "home fries", "jam", "butter", "poached eggs", "scrambled eggs", "english muffin", "avocado toast", "breakfast burrito", "breakfast sandwich", "crepes", "porridge", "grits", "quiche slice", "bran flakes", "chia pudding", "banana bread", "apple sauce cup", "sauteed mushrooms", "breakfast sausage patty", "frittata", "hash breakfast", "breakfast wrap", "toast soldiers", "hard boiled eggs", "breakfast potatoes", "rye toast", "cream cheese", "smoked salmon", "overnight oats", "protein shake", "waffle sticks", "pancake syrup", "fruit yogurt", "honey drizzle", "cottage cheese", "blueberry scone", "biscuits", "sausage links", "egg bites"], "apps": ["Instagram", "TikTok", "YouTube app", "Spotify", "Uber", "Google Maps", "Notes app", "Calendar app", "Photos app", "Camera app", "Gmail app", "WhatsApp", "Messenger app", "Zoom app", "Netflix app", "Weather app", "Clock app", "Reminders", "Discord", "Pinterest", "Threads app", "Snapchat", "Telegram", "Signal app", "Apple Music", "Google Drive", "Dropbox", "Canva", "Duolingo", "Strava", "Slack", "Reddit", "Amazon app", "Etsy app", "Airbnb app", "Booking app", "Transit app", "Waze", "Shazam", "CapCut", "Pocket Casts", "Notion", "Todoist", "LinkedIn", "X app", "Facebook", "Google Photos", "Authenticator", "PayPal", "Venmo", "Cash App", "Robinhood", "Kindle", "Libby", "Shop app", "Depop"], "beach": ["sunscreen", "beach towel", "beach umbrella", "sandals", "bucket", "shovel", "cooler", "flip flops", "sunglasses", "swimsuit", "lawn chair", "picnic blanket", "beach ball", "seashell", "surfboard", "floatie", "snorkel", "paddle", "sandcastle", "beach bag", "sun hat", "water bottle", "volleyball", "kite", "boogie board", "beach mat", "cover up", "goggles", "beach read", "portable speaker", "after-sun lotion", "pool noodle", "sand toys", "mesh tote", "wet wipes", "dry bag", "swim trunks", "rash guard", "shell necklace", "sun visor", "beach cart", "umbrella anchor", "camp chair", "beach radio", "cooler pack", "water shoes", "sun shelter", "folding table", "frisbee", "snack pack", "spray bottle", "beach pillow", "swim cap", "waterproof pouch", "waterproof phone case", "reef-safe sunscreen"], "passwords": ["password", "qwerty", "welcome", "dragon", "football", "monkey", "sunshine", "master", "shadow", "freedom", "hello", "login", "starwars", "princess", "flower", "summer", "whatever", "cheese", "abc123", "iloveyou", "qwerty123", "letmein", "trustno1", "baseball", "soccer", "ashley", "donald", "charlie", "hottie", "secret", "passw0rd", "dragon123", "lovely", "mustang", "batman", "pokemon", "jordan", "liverpool", "superman", "michelle", "chelsea", "maggie", "pepper", "jessica", "buster", "cookie pass", "snoopy", "andrew", "joshua", "ginger", "purple", "silver password", "killer", "matrix", "phoenix", "banana password"], "office": ["stapler", "printer", "shredder", "laptop", "monitor", "headset", "keyboard", "computer mouse", "paper", "binder", "clipboard", "eraser", "marker", "notebook", "scanner", "calendar", "desk", "office chair", "folder", "pen", "highlighter", "sticky notes", "whiteboard", "projector", "charging cable", "docking station", "desk lamp", "paper clips", "binder clips", "hole punch", "filing cabinet", "envelope", "label maker", "conference phone", "webcam", "headphones", "mouse pad", "desk organizer", "receipt book", "planner", "ledger", "mail tray", "packing tape", "ink cartridge", "rolodex", "desktop fan", "coffee mug", "task list", "usb drive", "adapter", "extension cord", "business cards", "staple remover", "laser pointer", "name badge", "visitor pass"], "kitchen": ["fork", "knife", "spoon", "plate", "bowl", "mug", "toaster", "fridge", "freezer", "oven", "pan", "pot", "whisk", "ladle", "foil", "napkin", "tray", "sink", "kettle", "colander", "cutting board", "spatula", "peeler", "grater", "mixing bowl", "measuring cup", "measuring spoon", "blender", "can opener", "dish rack", "tea towel", "strainer", "rolling pin", "tongs", "saucepan", "stockpot", "baking sheet", "broiler pan", "mortar", "pestle", "thermos", "pitcher", "cookie sheet", "apron", "dish soap", "sponge", "paper towel", "salt cellar", "pepper mill", "timer", "oven mitt", "casserole dish", "ramekin", "jar opener", "rice cooker", "slow cooker"], "bathroom": ["toothbrush", "toothpaste", "soap", "towel", "mirror", "shampoo", "conditioner", "razor", "mouthwash", "toilet paper", "plunger", "hairbrush", "comb", "bath mat", "sink basin", "bathtub", "scale", "lotion", "tissue", "medicine cabinet", "q tips", "cotton pads", "hand towel", "washcloth", "shower curtain", "shower cap", "tooth floss", "deodorant", "nail clippers", "lip balm", "face wash", "body wash", "bar soap dish", "hand soap", "hair dryer", "straightener", "curling iron", "bathrobe", "toilet brush", "air freshener", "bath salts", "loofah", "squeegee", "drain stopper", "sanitizer", "makeup remover", "mirror light", "storage basket", "laundry hamper", "tweezers", "bandages", "contact lens case", "perfume", "aftershave", "shaving cream", "hair tie"], "jobs": ["doctor", "teacher", "pilot", "chef", "lawyer", "artist", "nurse", "driver", "engineer", "farmer", "stage actor", "novelist", "plumber", "carpenter", "dentist", "designer", "analyst", "manager", "clerk", "mechanic", "electrician", "cashier", "barista", "baker", "therapist", "receptionist", "architect", "journalist", "photographer", "librarian", "musician", "accountant", "paramedic", "firefighter", "police officer", "florist", "veterinarian", "optometrist", "tailor", "surgeon", "translator", "data scientist", "web developer", "project coordinator", "sales associate", "warehouse worker", "delivery courier", "event planner", "real estate agent", "travel agent", "social worker", "biologist", "chemist", "professor", "coach", "fitness trainer"], "movies": ["Inception", "Interstellar", "Wicked", "Love Actually", "Clueless", "Titanic", "Barbie", "Jaws", "Frozen", "Scream", "Twister", "Speed", "Rocky", "Memento", "Skyfall", "Up", "Cars", "Braveheart", "Hitch", "Elf", "Casablanca", "Psycho", "Shrek", "Moana", "Enchanted", "Amelie", "Heat", "Gladiator", "Arrival", "Whiplash", "Lincoln", "Notting Hill", "Top Gun", "Nope", "Coco", "Soul", "The Matrix", "The Birdcage", "Ghost film", "Grease", "Chicago film", "La La Land", "Moonlight", "Parasite", "Her", "Gravity", "Drive", "Dune", "Brooklyn", "Spotlight", "Juno", "Selma", "Matilda film", "Hook", "Bambi", "Tangled"], "songs": ["Firework", "Vampire", "Imagine", "Halo", "Toxic", "Bad Romance", "Royals", "Shivers", "Happy", "Poker Face", "Single Ladies", "Levitating", "Umbrella", "Grenade", "Stay", "Yellow", "Sorry", "Believer", "Dreams", "Waterfalls", "Chandelier", "Hero", "Rolling in the Deep", "Complicated", "Genie in a Bottle", "Vogue", "Call Me Maybe", "Tik Tok song", "Bad Guy", "Easy on Me", "Blank Space", "Style", "Formation", "Applause", "Born This Way", "Ironic", "Linger", "Zombie song", "Kiss song", "Hello", "Crazy", "Valerie", "Respect", "Irreplaceable", "Since U Been Gone", "Piece of Me", "Photograph", "Numb", "Clocks", "Viva La Vida", "Riptide", "Torn", "Hands Clean", "Bleeding Love", "No Scrubs", "Watermelon Sugar"], "countries": ["Canada", "United States", "Mexico", "Brazil", "Argentina", "Chile", "Peru", "Colombia", "France", "Germany", "Spain", "Italy", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria", "Poland", "Sweden", "Norway", "Finland", "Denmark", "Ireland", "United Kingdom", "Iceland", "Greece", "Turkey", "Egypt", "Morocco", "South Africa", "India", "China", "Japan", "South Korea", "Thailand", "Vietnam", "Indonesia", "Philippines", "Australia", "New Zealand", "Nigeria", "Kenya", "Ethiopia", "Saudi Arabia", "Qatar", "United Arab Emirates", "Israel", "Jordan", "Lebanon", "Pakistan", "Sri Lanka", "Nepal", "Bangladesh", "Ukraine", "Romania", "Hungary"], "sports": ["soccer", "basketball", "baseball", "hockey", "tennis", "golf", "rugby", "cricket", "boxing", "swimming", "running", "cycling", "skiing", "snowboarding", "volleyball", "badminton", "surfing", "rowing", "wrestling", "archery", "skateboarding", "lacrosse", "curling", "water polo", "fencing", "gymnastics", "triathlon", "marathon", "handball", "softball", "squash", "table tennis", "figure skating", "speed skating", "kayaking", "canoeing", "diving", "judo", "karate", "taekwondo", "sailing", "bobsled", "luge", "biathlon", "climbing", "pickleball", "ultimate frisbee", "horse racing", "motocross", "billiards", "bowling", "darts", "snooker", "polo", "field hockey", "netball"], "flowers": ["rose", "tulip", "daisy", "sunflower", "lily", "orchid", "peony", "lavender", "violet flower", "iris", "poppy", "marigold", "jasmine", "gardenia", "dahlia", "camellia", "magnolia", "hydrangea", "hibiscus", "chrysanthemum", "daffodil", "bluebell", "snapdragon", "petunia", "begonia", "azalea", "anemone", "carnation", "cosmos", "foxglove", "freesia", "geranium", "gladiolus", "heather", "hollyhock", "hyacinth", "larkspur", "lotus", "morning glory", "nasturtium", "oleander", "pansy", "primrose", "ranunculus", "sweet pea", "verbena", "wisteria", "zinnia", "aster", "buttercup", "edelweiss", "forget-me-not", "gerbera", "honeysuckle", "lilac", "salvia"], "books": ["1984", "Dune novel", "Beloved", "Jane Eyre", "Hamlet", "Macbeth", "Frankenstein", "Dracula novel", "Emma novel", "Rebecca novel", "It novel", "Carrie novel", "Matilda book", "Holes", "Coraline", "Persuasion", "Ulysses", "Lolita", "Room novel", "Normal People", "Little Women", "Anne of Green Gables", "Pride and Prejudice", "Sense and Sensibility", "The Odyssey", "The Iliad", "The Great Gatsby", "The Bell Jar", "The Handmaids Tale", "The Road", "The Kite Runner", "The Secret History", "Atonement", "The Goldfinch", "Cloud Atlas", "Station Eleven", "Never Let Me Go", "The Book Thief", "The Giver", "Charlottes Web", "The Hobbit", "The Fellowship of the Ring", "The Two Towers", "The Return of the King", "The Catcher in the Rye", "To Kill a Mockingbird", "The Color Purple", "Gone Girl", "Sharp Objects", "The Stand", "Misery novel", "Middlemarch", "Wide Sargasso Sea", "Invisible Man", "Moby-Dick", "The Trial"], "beverages": ["coffee", "tea", "water", "sparkling water", "cola", "orange juice", "apple juice", "milk", "hot chocolate", "latte", "espresso", "cappuccino", "mocha", "matcha", "lemonade", "iced tea", "smoothie drink", "milkshake", "root beer", "ginger ale", "tonic water", "club soda", "kombucha", "chai", "herbal tea", "green tea", "black tea", "oolong tea", "white tea", "coconut water", "sports drink", "energy drink", "tomato juice", "grapefruit juice", "cranberry juice", "pineapple juice", "mango lassi", "lassi", "bubble tea", "cold brew", "americano", "flat white", "macchiato", "cortado", "affogato", "frappuccino", "strawberry shake", "vanilla shake", "protein shake", "almond milk", "oat milk", "soy milk", "rice milk", "seltzer", "horchata", "thai iced tea"], "transit": ["subway", "bus", "streetcar", "train", "commuter rail", "taxi", "rideshare", "bike share", "ferry", "tram", "gondola", "cable car", "funicular", "scooter", "walking commute", "carpool", "vanpool", "monorail", "light rail", "coach bus", "airport shuttle", "water taxi", "rickshaw", "motorbike taxi", "pedicab", "park and ride", "express bus", "metro", "regional rail", "night bus", "school bus", "double-decker bus", "trolley", "minibus", "airport train", "shuttle van", "bike lane", "crosswalk", "platform", "turnstile", "fare gate", "transit pass", "tap card", "schedule board", "departure board", "concourse", "terminal", "gate", "boarding bridge", "parking garage", "kiss and ride", "station bench", "ticket machine", "escalator", "elevator", "route map"], "home": ["sofa", "armchair", "coffee table", "bookshelf", "lamp", "rug", "curtains", "throw pillow", "blanket", "tv stand", "side table", "dresser", "nightstand", "bed frame", "mattress", "duvet", "mirror frame", "plant pot", "coat rack", "shoe rack", "entry bench", "wall art", "picture frame", "candle", "vase", "storage basket", "ottoman", "desk lamp", "ceiling fan", "laundry basket", "broom home", "mop home", "vacuum home", "step stool", "toolbox", "extension cord", "surge protector", "door mat", "hanger", "closet bin", "blanket ladder", "bath stool", "kitchen cart", "bar stool", "fruit bowl", "pantry bin", "dish rack", "soap dispenser", "paper towel holder", "cutlery tray", "air purifier", "humidifier", "diffuser", "alarm clock", "desk organizer", "wire basket"]};
  const TEMPLATE_DEFS = [["FRUITS", "fruits"], ["COLOURS", "colours"], ["CITIES", "cities"], ["SINGERS", "singers"], ["ACTORS", "actors"], ["CLOTHING BRANDS", "brands"], ["ANIMALS", "animals"], ["ELEMENTS", "elements"], ["PLANETS AND MOONS", "planets"], ["DESSERTS", "desserts"], ["BREAKFAST FOODS", "breakfast"], ["PHONE APPS", "apps"], ["THINGS AT THE BEACH", "beach"], ["COMMON PASSWORD WORDS", "passwords"], ["AT THE OFFICE", "office"], ["THINGS IN A KITCHEN", "kitchen"], ["THINGS IN A BATHROOM", "bathroom"], ["JOBS", "jobs"], ["MOVIE TITLES", "movies"], ["SONG TITLES", "songs"], ["COUNTRIES", "countries"], ["SPORTS", "sports"], ["FLOWERS", "flowers"], ["BOOKS", "books"], ["BEVERAGES", "beverages"], ["TYPES OF TRANSIT", "transit"], ["THINGS IN A HOME", "home"]];
  const PREFIX_TEMPLATES = [["WORDS WITH APPLE", "apple"], ["WORDS WITH BREAK", "break"], ["WORDS WITH STAR", "star"], ["WORDS WITH LIGHT", "light"], ["WORDS WITH HOME", "home"], ["WORDS WITH POWER", "power"], ["WORDS WITH NIGHT", "night"], ["WORDS WITH WATER", "water"], ["WORDS WITH MOON", "moon"], ["WORDS WITH SUN", "sun"], ["WORDS WITH BLUE", "blue"], ["WORDS WITH GOLD", "gold"], ["WORDS WITH HEART", "heart"], ["WORDS WITH FIRE", "fire"], ["WORDS WITH LOVE", "love"], ["WORDS WITH GAME", "game"], ["WORDS WITH HAND", "hand"], ["WORDS WITH HEAD", "head"]];
  const PREFIX_SUFFIXES = {"apple": ["pie", "juice", "cider", "watch", "store", "core", "seed", "tart", "sauce", "jam", "peel", "orchard", "crisp", "slice", "cake", "skin", "pulp", "snack", "bite", "tree", "strudel", "butter", "fritter", "box", "turnover", "muffin", "cart", "vinegar", "farm", "chips", "crate", "branch", "picker", "press", "tote", "compote", "spritzer", "cobbler", "danish", "syrup", "latte", "scone", "oatmeal", "granola", "candle", "soap", "glaze", "tea", "bars", "turnip"], "break": ["down", "up", "in", "out", "even", "free", "away", "point", "news", "habit", "silence", "code", "lock", "record", "chain", "rank", "stride", "time", "line", "rule", "dance", "beat", "glass", "bulk", "camp", "neck", "front", "room", "water", "wind", "shot", "speed", "wall", "fast", "day", "light", "mark", "points", "work", "period", "table", "bar", "clause", "loop", "thread", "signal", "cover", "fall", "rest", "turn"], "star": ["light", "fish", "dust", "power", "sign", "player", "chart", "burst", "trail", "field", "shape", "gazer", "let", "map", "fruit", "board", "crossed", "maker", "turn", "ship", "watch", "line", "fall", "child", "point", "shine", "path", "spark", "case", "gate", "stream", "stone", "print", "song", "room", "frame", "route", "talk", "side", "box", "value", "mark", "cast", "city", "phase", "drive", "bloom", "glow", "sketch"], "light": ["bulb", "switch", "house", "year", "weight", "show", "blue", "green", "red", "pink", "source", "beam", "shade", "post", "rail", "work", "room", "box", "table", "keeper", "touch", "cone", "trail", "line", "meter", "glow", "lamp", "fog", "speed", "curve", "signal", "guide", "frame", "wash", "panel", "mark", "path", "field", "ray", "fall", "check", "code", "play", "study", "print", "set", "ring", "grid", "layer", "burst"], "home": ["page", "town", "run", "made", "work", "owner", "body", "room", "base", "stretch", "field", "front", "line", "plate", "brew", "grown", "style", "care", "court", "time", "video", "state", "office", "screen", "truth", "team", "goods", "loan", "test", "cook", "game", "phone", "safe", "sale", "roll", "print", "light", "garden", "trip", "choice", "start", "value", "sound", "route", "look", "plan", "song", "floor", "market", "path"], "power": ["up", "down", "house", "line", "trip", "plant", "grid", "tool", "move", "source", "point", "play", "ballad", "lunch", "walk", "chair", "button", "cord", "bank", "drill", "boat", "meter", "supply", "points", "wash", "pack", "suit", "slide", "surge", "cycle", "nap", "bar", "rank", "lift", "call", "note", "reader", "driver", "frame", "cell", "pose", "pair", "route", "swing", "zone", "test", "playbook", "room", "mark", "beam"], "night": ["owl", "shift", "club", "stand", "life", "light", "dress", "table", "train", "watch", "vision", "cap", "air", "bird", "fall", "school", "bloom", "sky", "walk", "time", "song", "spot", "sound", "class", "ride", "game", "market", "move", "line", "glow", "storm", "frame", "talk", "drive", "zone", "scene", "park", "cook", "guide", "paper", "mood", "trip", "cover", "signal", "fleet", "pool", "view", "shade", "trail", "house"], "water": ["fall", "proof", "melon", "line", "front", "mark", "bottle", "tower", "color", "park", "course", "table", "level", "bed", "bird", "wheel", "gate", "glass", "slide", "route", "rate", "lily", "works", "cycle", "side", "power", "point", "pipe", "pump", "drop", "stone", "craft", "field", "bound", "wash", "safe", "main", "track", "break", "garden", "hose", "meter", "tank", "view", "path", "road", "rise", "marking", "song", "glassware"], "moon": ["light", "beam", "stone", "walk", "shine", "rise", "fall", "phase", "dust", "shadow", "glow", "river", "song", "child", "cake", "roof", "garden", "room", "line", "watch", "path", "flower", "stream", "mark", "print", "fruit", "call", "craft", "field", "trace", "glade", "pool", "frame", "space", "shape", "sound", "trail", "bloom", "set", "glint", "turn", "spark", "bird", "face", "frost", "road", "beamline", "chart", "deck", "garden"], "sun": ["light", "rise", "set", "beam", "screen", "room", "hat", "burn", "flower", "ray", "shine", "spot", "glass", "roof", "block", "dress", "belt", "shade", "deck", "lamp", "burst", "line", "day", "drop", "glow", "field", "print", "path", "mark", "face", "song", "trail", "stone", "view", "stream", "walk", "house", "panel", "flare", "watch", "box", "frame", "cap", "sail", "splash", "leaf", "grin", "coat", "garden", "trail"], "blue": ["bird", "berry", "moon", "bell", "print", "sky", "book", "light", "grass", "chip", "line", "wave", "jay", "plate", "coat", "stone", "note", "water", "room", "shell", "jean", "rose", "night", "cap", "glass", "star", "fish", "path", "field", "hour", "door", "flag", "mark", "theme", "frame", "spark", "trail", "grain", "sound", "tile", "view", "drift", "shade", "ridge", "bloom", "crest", "berry pie", "sparkle", "candle", "stream"], "gold": ["rush", "mine", "leaf", "frame", "coin", "medal", "ring", "line", "fish", "field", "light", "tone", "dust", "chain", "thread", "glow", "cup", "crest", "star", "plate", "paint", "trim", "bar", "ticket", "card", "watch", "spark", "route", "seal", "record", "game", "foam", "mark", "sign", "track", "ribbon", "belt", "stone", "table", "filter", "room", "point", "grain", "note", "label", "finch", "wave", "rush hour", "sparkler", "dusting"], "heart": ["beat", "break", "rate", "line", "shape", "string", "felt", "warming", "burn", "song", "land", "stone", "work", "wood", "throb", "space", "room", "mark", "eye", "side", "case", "point", "note", "road", "box", "glow", "talk", "ache", "dance", "track", "frame", "print", "share", "leaf", "field", "turn", "sound", "star", "watch", "light", "call", "wave", "bound", "core", "key", "thrum", "spark", "garden", "paper", "plate"], "fire": ["fly", "place", "light", "proof", "ball", "storm", "wood", "pit", "man", "side", "line", "drill", "house", "fighter", "works", "escape", "alarm", "cracker", "song", "door", "glass", "starter", "bird", "trail", "brand", "watch", "stone", "spark", "mark", "frame", "fall", "walk", "seal", "point", "field", "crest", "leaf", "bloom", "track", "route", "room", "sound", "crystal", "rush", "beam", "break", "pitfall", "table", "sign", "pool"], "love": ["song", "letter", "story", "note", "bird", "child", "line", "seat", "boat", "match", "lock", "birds", "light", "call", "field", "mark", "interest", "triangle", "handle", "bug", "fest", "scene", "poem", "garden", "glow", "sound", "house", "route", "train", "set", "frame", "watch", "talk", "room", "wave", "print", "gift", "flag", "point", "loop", "chain", "token", "storyline", "note pad", "marking", "box", "table", "spark", "trail", "view"], "game": ["plan", "night", "show", "day", "point", "face", "room", "book", "changer", "time", "ball", "board", "play", "piece", "set", "call", "line", "state", "field", "track", "sound", "card", "table", "clock", "view", "path", "test", "mode", "save", "loop", "file", "sheet", "maker", "case", "zone", "shot", "run", "turn", "tag", "film", "watch", "frame", "bar", "mark", "key", "planer", "playbook", "roommate", "song", "tone"], "hand": ["bag", "shake", "book", "made", "rail", "wash", "held", "out", "written", "picked", "line", "off", "stand", "work", "set", "print", "tool", "towel", "soap", "mirror", "cart", "truck", "warmers", "glove", "cream", "lamp", "signal", "drawn", "finish", "check", "painted", "rolled", "stitched", "saw", "drill", "rest", "stamp", "loop", "craft", "mark", "bound", "woven", "fan", "screen", "hold", "shakeup", "railway", "trail", "sign", "booklet"], "head": ["line", "phones", "board", "light", "band", "count", "start", "room", "table", "space", "way", "first", "rest", "wind", "lamp", "ache", "set", "stone", "waters", "gear", "lock", "piece", "rail", "strong", "turn", "mark", "shot", "sound", "rush", "shape", "talk", "lift", "trail", "sign", "voice", "field", "frame", "watch", "point", "counting", "phone jack", "case", "roommate", "beam", "lighted", "path", "book", "tabletop", "signpost", "lamp shade"]};

  function getWeekKey() {
    const now = new Date();
    const utc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const day = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((utc - yearStart) / 86400000) + 1) / 7);
    return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }

  function formatWeekKey(weekKey) {
    return weekKey;
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function rand(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function shuffle(arr, seedNumber) {
    const copy = [...arr];
    let s = seedNumber;
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand(s++) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function uniqueList(arr) {
    return [...new Set(arr)];
  }

  function buildPoolCategory(name, poolName, weekKey, offset) {
    const source = uniqueList(POOLS[poolName]);
    if (source.length < SIZE) throw new Error(`${name} does not have enough unique items.`);
    return {
      name,
      words: shuffle(source, hashString(weekKey) + offset).slice(0, SIZE)
    };
  }

  function buildPrefixCategory(name, prefix, weekKey, offset) {
    const source = uniqueList(PREFIX_SUFFIXES[prefix]);
    if (source.length < SIZE) throw new Error(`${name} does not have enough unique items.`);
    return {
      name,
      words: shuffle(source, hashString(weekKey) + offset)
        .slice(0, SIZE)
        .map(s => `${prefix} ${s}`)
    };
  }

  function createWeeklyCategories(weekKey) {
    const defs = [
      ...TEMPLATE_DEFS.map(([name, pool]) => ({ kind: "pool", name, pool })),
      ...PREFIX_TEMPLATES.map(([name, prefix]) => ({ kind: "prefix", name, prefix }))
    ];

    const picked = shuffle(defs, hashString(weekKey) + 77).slice(0, SIZE);

    const categories = picked.map((def, i) => {
      return def.kind === "pool"
        ? buildPoolCategory(def.name, def.pool, weekKey, 300 + i)
        : buildPrefixCategory(def.name, def.prefix, weekKey, 700 + i);
    });

    const seen = new Set();
    categories.forEach(cat => {
      if (cat.words.length !== SIZE) throw new Error(`${cat.name} does not have 45 tiles.`);
      cat.words.forEach(word => {
        if (!word || seen.has(word)) throw new Error(`Duplicate or blank tile: ${word}`);
        seen.add(word);
      });
    });

    return categories;
  }

  function buildFreshState() {
    const weekKey = getWeekKey();
    const categories = createWeeklyCategories(weekKey);
    const tiles = categories.flatMap(cat => cat.words);
    const lookup = {};

    categories.forEach((cat, i) => {
      cat.words.forEach(word => {
        lookup[word] = {
          name: cat.name,
          color: GROUP_COLORS[i % GROUP_COLORS.length]
        };
      });
    });

    if (tiles.length !== TOTAL_TILES) {
      throw new Error(`Expected ${TOTAL_TILES} tiles, found ${tiles.length}.`);
    }

    return {
      weekKey,
      lookup,
      groups: shuffle(tiles, hashString(weekKey) + 999).map(word => ({
        words: [word],
        solved: false,
        category: null,
        color: null
      })),
      selectedIndex: null,
      mistakes: 0
    };
  }

  function isValidGroup(group) {
    return group
      && Array.isArray(group.words)
      && group.words.length >= 1
      && group.words.every(w => typeof w === "string" && w.trim())
      && typeof group.solved === "boolean";
  }

  function isValidSavedState(saved, fresh) {
    if (!saved || saved.weekKey !== fresh.weekKey || !Array.isArray(saved.groups) || !saved.groups.every(isValidGroup)) return false;
    const all = saved.groups.flatMap(g => g.words);
    if (all.length !== TOTAL_TILES) return false;
    const uniq = new Set(all);
    if (uniq.size !== TOTAL_TILES) return false;
    const validWords = new Set(Object.keys(fresh.lookup));
    for (const word of uniq) {
      if (!validWords.has(word)) return false;
    }
    return true;
  }

  function loadState() {
    const fresh = buildFreshState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fresh;
      const saved = JSON.parse(raw);
      if (!isValidSavedState(saved, fresh)) {
        localStorage.removeItem(STORAGE_KEY);
        return fresh;
      }
      return {
        weekKey: fresh.weekKey,
        lookup: fresh.lookup,
        groups: saved.groups,
        selectedIndex: null,
        mistakes: Number.isFinite(saved.mistakes) ? saved.mistakes : 0
      };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return fresh;
    }
  }

  let state = loadState();

  const board = document.getElementById("board");
  const mistakesEl = document.getElementById("mistakes");
  const dateEl = document.getElementById("puzzleDate");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const deselectBtn = document.getElementById("deselectBtn");

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      weekKey: state.weekKey,
      groups: state.groups,
      mistakes: state.mistakes
    }));
  }

  function previewText(group) {
    const firstTwo = group.words.slice(0, 2).join(", ");
    return group.words.length >= 3 ? `${firstTwo}, ... [${group.words.length}]` : firstTwo;
  }

  function renderBoard() {
    board.innerHTML = "";
    state.groups.forEach((g, idx) => {
      const tile = document.createElement("div");
      tile.className = "tile";

      if (g.solved) {
        tile.classList.add("solved-tile", "hoverable");
        tile.style.background = g.color || GROUP_COLORS[0];
      } else {
        tile.classList.add(g.words.length > 1 ? "merged" : "single");
        if (state.selectedIndex === idx) tile.classList.add("selected");
        if (g.words.length >= 3) tile.classList.add("hoverable");
      }

      const label = document.createElement("div");
      label.textContent = g.solved ? (g.category || "") : previewText(g);
      tile.appendChild(label);

      if (g.solved || g.words.length >= 3) {
        const hover = document.createElement("div");
        hover.className = "hover-content";
        hover.textContent = g.words.join(", ");
        tile.appendChild(hover);
      }

      if (!g.solved) {
        tile.addEventListener("click", () => handleTileClick(idx));
      }

      board.appendChild(tile);
    });
  }

  function render() {
    dateEl.textContent = formatWeekKey(state.weekKey);
    mistakesEl.textContent = String(state.mistakes);
    renderBoard();
  }

  function categoryForWords(words) {
    const first = state.lookup[words[0]];
    if (!first) return null;
    for (const word of words) {
      const info = state.lookup[word];
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

    const merged = { words: mergedWords, solved: false, category: null, color: null };

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

  function handleTileClick(i) {
    const group = state.groups[i];
    if (!group || group.solved) return;

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

  shuffleBtn.addEventListener("click", () => {
    const solved = state.groups.filter(g => g.solved);
    const unsolved = state.groups.filter(g => !g.solved);
    state.groups = [...solved, ...shuffle(unsolved, hashString(state.weekKey) + Date.now() % 1000)];
    state.selectedIndex = null;
    saveState();
    render();
  });

  deselectBtn.addEventListener("click", () => {
    state.selectedIndex = null;
    render();
  });

  window.addEventListener("beforeunload", saveState);

  render();
});
