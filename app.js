const boardEl = document.getElementById('board');
const solvedEl = document.getElementById('solved');
const statusEl = document.getElementById('status');
const puzzleEl = document.getElementById('puzzle');
const scoreEl = document.getElementById('score');
const mistakesEl = document.getElementById('mistakes');
const streakEl = document.getElementById('streak');
const submitBtn = document.getElementById('submitBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const deselectBtn = document.getElementById('deselectBtn');
const newBtn = document.getElementById('newBtn');

const MAX_MISTAKES = 4;
const GROUP_SIZE = 4;
const VISIBLE_GROUPS = 4;
const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric'
});

let puzzleGroups = [];
let remainingTiles = [];
let selectedItems = new Set();
let solvedGroups = [];
let mistakes = 0;
let score = 0;
let streak = Number(localStorage.getItem('connectionsStreak') || 0);
let gameOver = false;

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return function next() {
    value = value * 16807 % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function getMonthlySeed(date = new Date()) {
  return date.getFullYear() * 100 + date.getMonth() + 1;
}

function shuffle(items, random = Math.random) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function pickMonthlyGroups() {
  const seed = getMonthlySeed();
  const random = seededRandom(seed);
  return shuffle(CATEGORY_BANK, random).slice(0, VISIBLE_GROUPS);
}

function startGame() {
  puzzleGroups = pickMonthlyGroups();
  remainingTiles = shuffle(
    puzzleGroups.flatMap(group => group.items.map(item => ({
      item,
      groupId: group.id
    })))
  );
  selectedItems = new Set();
  solvedGroups = [];
  mistakes = 0;
  score = 0;
  gameOver = false;

  puzzleEl.textContent = monthFormatter.format(new Date());
  setStatus('Find the four hidden groups.', 'neutral');
  updateStats();
  render();
}

function render() {
  renderSolvedGroups();
  renderBoard();
  submitBtn.disabled = selectedItems.size !== GROUP_SIZE || gameOver;
  deselectBtn.disabled = selectedItems.size === 0 || gameOver;
  shuffleBtn.disabled = gameOver || remainingTiles.length === 0;
}

function renderSolvedGroups() {
  solvedEl.innerHTML = '';

  solvedGroups.forEach(group => {
    const groupEl = document.createElement('section');
    groupEl.className = `solved-group solved-group--${group.level || 'default'}`;
    groupEl.innerHTML = `
      <h2>${group.title}</h2>
      <p>${group.items.join(', ')}</p>
    `;
    solvedEl.appendChild(groupEl);
  });
}

function renderBoard() {
  boardEl.innerHTML = '';

  remainingTiles.forEach(tile => {
    const tileButton = document.createElement('button');
    tileButton.className = 'tile';
    tileButton.type = 'button';
    tileButton.textContent = tile.item;
    tileButton.setAttribute('aria-pressed', selectedItems.has(tile.item));

    if (selectedItems.has(tile.item)) {
      tileButton.classList.add('selected');
    }

    tileButton.addEventListener('click', () => toggleSelection(tile.item));
    boardEl.appendChild(tileButton);
  });
}

function toggleSelection(item) {
  if (gameOver) return;

  if (selectedItems.has(item)) {
    selectedItems.delete(item);
  } else if (selectedItems.size < GROUP_SIZE) {
    selectedItems.add(item);
  } else {
    setStatus('You can select four tiles at a time.', 'warning');
  }

  render();
}

function submitGuess() {
  if (selectedItems.size !== GROUP_SIZE || gameOver) return;

  const matchingGroup = puzzleGroups.find(group => (
    !solvedGroups.some(solved => solved.id === group.id)
    && group.items.every(item => selectedItems.has(item))
  ));

  if (matchingGroup) {
    solveGroup(matchingGroup);
    return;
  }

  mistakes += 1;
  selectedItems.clear();
  setStatus(
    mistakes >= MAX_MISTAKES
      ? 'No more guesses. Here are the answers.'
      : `${MAX_MISTAKES - mistakes} mistake${MAX_MISTAKES - mistakes === 1 ? '' : 's'} left.`,
    mistakes >= MAX_MISTAKES ? 'error' : 'warning'
  );

  if (mistakes >= MAX_MISTAKES) {
    revealAnswers();
  }

  updateStats();
  render();
}

function solveGroup(group) {
  solvedGroups.push(group);
  remainingTiles = remainingTiles.filter(tile => tile.groupId !== group.id);
  selectedItems.clear();
  score += Math.max(10 - mistakes * 2, 2);

  if (solvedGroups.length === puzzleGroups.length) {
    streak += 1;
    localStorage.setItem('connectionsStreak', String(streak));
    gameOver = true;
    setStatus('Solved. Nice work.', 'success');
  } else {
    setStatus(`Found: ${group.title}`, 'success');
  }

  updateStats();
  render();
}

function revealAnswers() {
  puzzleGroups.forEach(group => {
    if (!solvedGroups.some(solved => solved.id === group.id)) {
      solvedGroups.push(group);
    }
  });
  remainingTiles = [];
  selectedItems.clear();
  streak = 0;
  localStorage.setItem('connectionsStreak', '0');
  gameOver = true;
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = type ? `status status--${type}` : 'status';
}

function updateStats() {
  scoreEl.textContent = score;
  mistakesEl.textContent = mistakes;
  streakEl.textContent = streak;
}

submitBtn.addEventListener('click', submitGuess);
shuffleBtn.addEventListener('click', () => {
  remainingTiles = shuffle(remainingTiles);
  render();
});
deselectBtn.addEventListener('click', () => {
  selectedItems.clear();
  setStatus('Selection cleared.', 'neutral');
  render();
});
newBtn.addEventListener('click', startGame);

startGame();
