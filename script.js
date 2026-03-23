document.addEventListener("DOMContentLoaded", () => {
  const SIZE = 45;
  const STORAGE_KEY = "connections-clean-45x45";
  const GROUP_COLORS = ["#f9df6d","#a0c35a","#b0c4ef","#ba81c5"];

  const CATEGORY_BANK = {
    "FRUITS": ["apple","banana","orange","grape","pear","peach","plum","mango","kiwi","papaya","pineapple","strawberry","raspberry","blueberry","blackberry","melon","watermelon","coconut","lemon","lime","apricot","fig","guava","lychee","nectarine","passionfruit","pomegranate","dragon fruit","persimmon","tangerine","cranberry","date","grapefruit","mulberry","quince","starfruit","currant","boysenberry","cantaloupe","honeydew","jackfruit","kumquat","yuzu","pomelo","longan"],

    "COLOURS": ["red","blue","green","yellow","purple","pink","black","white","orange colour","brown","teal","navy","gold colour","silver colour","cyan","magenta","beige","maroon","olive","indigo","charcoal","ivory","lavender","turquoise","mustard","burgundy","mint","tan","cream","scarlet","crimson","amber","bronze","lilac","periwinkle","sage","coral","taupe","ochre","russet","khaki","fuchsia","aqua","jade","slate"],

    "CITIES": ["Paris","Rome","Tokyo","London","Berlin","Madrid","Vienna","Prague","Dublin","Lisbon","Oslo","Athens","Warsaw","Zurich","Helsinki","Budapest","Seoul","Bangkok","Delhi","Cairo","Montreal","Toronto","Vancouver","Ottawa","Chicago","Boston","Miami","Seattle","Sydney","Melbourne","Auckland","Brussels","Munich","Hamburg","Florence","Naples","Kyoto","Busan","Lima","Santiago","Bogota","Reykjavik","Doha","Dubai","Marrakesh"],

    "ANIMALS": ["lion","tiger","bear","wolf","fox","dog","cat","zebra","panda","horse","eagle","shark","whale","snake","frog","deer","otter","camel","goat","sheep","rabbit","owl","falcon","moose","bison","beaver","lynx","cougar","koala","lemur","rhino","hippo","gecko","iguana","salmon","trout","crab","lobster","octopus","squid","penguin","seal","dolphin","orca","buffalo"],

    "COUNTRIES": ["Canada","USA","Mexico","Brazil","Argentina","Chile","Peru","Colombia","France","Germany","Spain","Italy","Portugal","Netherlands","Belgium","Switzerland","Austria","Poland","Sweden","Norway","Finland","Denmark","Ireland","UK","Iceland","Greece","Turkey","Egypt","Morocco","South Africa","India","China","Japan","South Korea","Thailand","Vietnam","Indonesia","Philippines","Australia","New Zealand","Nigeria","Kenya","Ethiopia","Saudi Arabia","Qatar"],

    "JOBS": ["doctor","teacher","pilot","chef","lawyer","artist","nurse","driver","engineer","farmer","actor","writer","plumber","carpenter","dentist","designer","analyst","manager","clerk","mechanic","electrician","cashier","barista","baker","therapist","receptionist","architect","journalist","photographer","librarian","musician","accountant","paramedic","firefighter","police officer","florist","veterinarian","optometrist","tailor","surgeon","translator","developer","coordinator","salesperson","agent"],

    "MOVIES": ["Inception","Interstellar","Titanic","Barbie","Jaws","Frozen","Rocky","Skyfall","Cars","Elf","Shrek","Moana","Gladiator","Arrival","Whiplash","Coco","Soul","Matrix","Grease","Chicago","Parasite","Her","Gravity","Drive","Dune","Brooklyn","Spotlight","Juno","Selma","Hook","Bambi","Tangled","Up","Speed","Twister","Hitch","Clueless","Scream","Memento","Braveheart","Love Actually","Casablanca","Psycho","Nope","Lincoln"],

    "SONGS": ["Firework","Imagine","Halo","Toxic","Royals","Happy","Umbrella","Grenade","Sorry","Believer","Dreams","Waterfalls","Chandelier","Hero","Vogue","Call Me Maybe","Bad Guy","Hello","Formation","Applause","Ironic","Zombie","Valerie","Respect","Irreplaceable","Photograph","Clocks","Riptide","Torn","Bleeding Love","No Scrubs","Watermelon Sugar","Stay","Yellow","Poker Face","Levitating","Single Ladies","Shivers","Vampire","Rolling in the Deep","Complicated","Genie in a Bottle","Tik Tok","Style","Blank Space"],

    "FOOD": ["pizza","burger","pasta","salad","soup","sandwich","steak","rice","noodles","sushi","taco","burrito","wrap","curry","dumpling","ramen","paella","risotto","lasagna","pancake","waffle","omelette","toast","bagel","croissant","muffin","cake","pie","cookie","brownie","donut","gelato","sorbet","yogurt","granola","smoothie","milkshake","fries","onion rings","nachos","popcorn","chocolate","candy","ice cream","cheesecake"],

    "TECH BRANDS": ["Apple","Samsung","Google","Microsoft","Amazon","Meta","Sony","LG","Intel","AMD","Nvidia","Dell","HP","Lenovo","Asus","Acer","Huawei","Xiaomi","OnePlus","Oppo","Vivo","Tesla","IBM","Oracle","Cisco","Adobe","Spotify","Netflix","Uber","Airbnb","PayPal","Shopify","Slack","Zoom","Dropbox","eBay","Pinterest","Snapchat","TikTok","Reddit","Discord","Twitch","Square","Stripe","Canva"],

    "SPORTS": ["soccer","basketball","baseball","hockey","tennis","golf","rugby","cricket","boxing","swimming","running","cycling","skiing","snowboarding","volleyball","badminton","surfing","rowing","wrestling","archery","skateboarding","lacrosse","curling","water polo","fencing","gymnastics","triathlon","marathon","handball","softball","squash","table tennis","figure skating","kayaking","canoeing","diving","judo","karate","taekwondo","sailing","bobsled","luge","biathlon","climbing","pickleball"]
  };

  const board = document.getElementById("board");
  const mistakesEl = document.getElementById("mistakes");
  const dateEl = document.getElementById("puzzleDate");

  function seedForToday() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  }

  function formatDate(k){
    const y = Number(k.slice(0,4));
    const m = Number(k.slice(4,6))-1;
    const d = Number(k.slice(6,8));
    return new Date(y,m,d).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  }

  function shuffle(arr){
    return [...arr].sort(()=>Math.random()-0.5);
  }

  function build(){
    const key = seedForToday();
    const entries = Object.entries(CATEGORY_BANK).slice(0,45);

    const tiles=[];
    const lookup={};

    entries.forEach(([name,words],i)=>{
      words.slice(0,45).forEach(w=>{
        tiles.push(w);
        lookup[w]={name,color:GROUP_COLORS[i%4]};
      });
    });

    return {
      key,
      lookup,
      groups: shuffle(tiles).map(w=>({words:[w],solved:false}))
    };
  }

  let state = build();

  function render(){
    dateEl.textContent = formatDate(state.key);
    board.innerHTML="";
    state.groups.forEach((g,i)=>{
      const t=document.createElement("div");
      t.className="tile "+(g.words.length>1?"merged":"single");
      t.textContent=g.words.slice(0,2).join(", ");
      board.appendChild(t);
    });
  }

  render();
});
