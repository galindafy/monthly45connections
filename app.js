const EXPECTED_BANK_SIZE = 600;
const DEFAULT_MONTHLY_CATEGORY_COUNT = 45;
const DEFAULT_ANSWERS_PER_CATEGORY = 45;

const puzzleEl = document.getElementById('puzzle');
const resetDateEl = document.getElementById('resetDate');
const scoreEl = document.getElementById('score');
const mistakesEl = document.getElementById('mistakes');
const progressEl = document.getElementById('progress');
const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const shuffleBtn = document.getElementById('shuffleBtn');
const deselectBtn = document.getElementById('deselectBtn');
const resetBtn = document.getElementById('resetBtn');

const answersPerCategory = window.ANSWERS_PER_CATEGORY || DEFAULT_ANSWERS_PER_CATEGORY;
const monthlyCategoryCount = window.MONTHLY_CATEGORY_COUNT || DEFAULT_MONTHLY_CATEGORY_COUNT;
const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric'
});
const resetFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

let monthlyCategories = [];
let boardGroups = [];
let selectedGroupIds = [];
let mistakes = 0;
let score = 0;

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

function getNextResetDate(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function shuffle(items, random = Math.random) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function validateBank() {
  const errors = [];

  if (!Array.isArray(CATEGORY_BANK)) {
    return ['CATEGORY_BANK is missing.'];
  }

  if (CATEGORY_BANK.length !== EXPECTED_BANK_SIZE) {
    errors.push(`Expected ${EXPECTED_BANK_SIZE} categories, found ${CATEGORY_BANK.length}.`);
  }

  CATEGORY_BANK.forEach(category => {
    if (!category.title || !Array.isArray(category.items)) {
      errors.push(`${category.id || 'A category'} is missing a title or item list.`);
      return;
    }

    if (category.items.length !== answersPerCategory) {
      errors.push(`${category.title} has ${category.items.length} answers instead of ${answersPerCategory}.`);
    }
  });

  return errors;
}

function pickMonthlyCategories(date = new Date()) {
  const random = seededRandom(getMonthlySeed(date));
  return shuffle(CATEGORY_BANK, random).slice(0, monthlyCategoryCount);
}

function createBoardGroups() {
  return monthlyCategories.flatMap(category => category.items.map((item, index) => ({
    id: `${category.id}-${index}`,
    categoryId: category.id,
    categoryTitle: category.title,
    items: [cleanAnswerLabel(item)],
    solved: false
  })));
}

function cleanAnswerLabel(value) {
  return String(value)
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function startPuzzle() {
  monthlyCategories = pickMonthlyCategories();
  boardGroups = shuffle(createBoardGroups());
  selectedGroupIds = [];
  mistakes = 0;
  score = 0;

  puzzleEl.textContent = monthFormatter.format(new Date());
  resetDateEl.textContent = `Resets ${resetFormatter.format(getNextResetDate())}`;

  render();
}

function render() {
  const solvedCount = boardGroups.filter(group => group.items.length === answersPerCategory).length;

  scoreEl.textContent = score;
  mistakesEl.textContent = mistakes;
  progressEl.textContent = `${solvedCount} / ${monthlyCategoryCount} groups complete`;
  deselectBtn.disabled = selectedGroupIds.length === 0;
  statusEl.textContent = '';
  statusEl.classList.add('status--hidden');

  boardEl.innerHTML = '';
  const fragment = document.createDocumentFragment();

  boardGroups.forEach(group => {
    const tile = document.createElement('button');
    tile.className = getTileClassName(group);
    tile.type = 'button';
    tile.dataset.groupId = group.id;
    tile.setAttribute('aria-pressed', selectedGroupIds.includes(group.id));
    tile.innerHTML = getTileLabel(group);
    tile.addEventListener('click', () => selectGroup(group.id));
    fragment.appendChild(tile);
  });

  boardEl.appendChild(fragment);
}

function getTileClassName(group) {
  const classes = ['tile'];

  if (group.items.length > 1) classes.push('tile--group');
  if (group.items.length === answersPerCategory) classes.push('tile--complete');
  if (selectedGroupIds.includes(group.id)) classes.push('selected');

  return classes.join(' ');
}

function getTileLabel(group) {
  const safeItems = group.items.map(escapeHtml);

  if (group.items.length === answersPerCategory) {
    return `<span class="tile-title">${escapeHtml(group.categoryTitle)}</span><span class="tile-count">${answersPerCategory} tiles</span>`;
  }

  if (group.items.length >= 3) {
    return `<strong>${safeItems[0]}, ${safeItems[1]}, ... ${group.items.length} tiles</strong>`;
  }

  if (group.items.length === 2) {
    return `<strong>${safeItems.join(', ')}</strong>`;
  }

  return `<span>${safeItems[0]}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function selectGroup(groupId) {
  if (selectedGroupIds.includes(groupId)) {
    selectedGroupIds = selectedGroupIds.filter(id => id !== groupId);
    render();
    return;
  }

  selectedGroupIds.push(groupId);

  if (selectedGroupIds.length === 2) {
    attemptCombine();
    return;
  }

  render();
}

function attemptCombine() {
  const [firstId, secondId] = selectedGroupIds;
  const first = boardGroups.find(group => group.id === firstId);
  const second = boardGroups.find(group => group.id === secondId);

  if (!first || !second) {
    selectedGroupIds = [];
    render();
    return;
  }

  if (first.categoryId !== second.categoryId) {
    mistakes += 1;
    selectedGroupIds = [];
    render();
    return;
  }

  const merged = {
    id: `${first.id}+${second.id}`,
    categoryId: first.categoryId,
    categoryTitle: first.categoryTitle,
    items: [...first.items, ...second.items],
    solved: first.items.length + second.items.length === answersPerCategory
  };

  boardGroups = boardGroups.filter(group => group.id !== first.id && group.id !== second.id);
  boardGroups.unshift(merged);
  selectedGroupIds = [];
  score += merged.solved ? 45 : 1;
  render();
}

function shuffleBoard() {
  boardGroups = shuffle(boardGroups);
  selectedGroupIds = [];
  render();
}

function deselectAll() {
  selectedGroupIds = [];
  render();
}

function showValidationErrors(errors) {
  statusEl.textContent = errors[0];
  statusEl.classList.remove('status--hidden');
  statusEl.classList.add('status--error');
}

shuffleBtn.addEventListener('click', shuffleBoard);
deselectBtn.addEventListener('click', deselectAll);
resetBtn.addEventListener('click', startPuzzle);

const validationErrors = validateBank();
startPuzzle();

if (validationErrors.length > 0) {
  showValidationErrors(validationErrors);
}
