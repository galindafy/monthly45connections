const EXPECTED_BANK_SIZE = 600;
const DEFAULT_MONTHLY_CATEGORY_COUNT = 45;
const DEFAULT_ANSWERS_PER_CATEGORY = 45;
const STORAGE_PREFIX = 'connections-monthly-progress-v7';

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
const selectedSummaryEl = document.getElementById('selectedSummary');
const shareModal = document.getElementById('shareModal');
const shareStatsEl = document.getElementById('shareStats');
const shareTextEl = document.getElementById('shareText');
const copyShareBtn = document.getElementById('copyShareBtn');
const closeShareBtn = document.getElementById('closeShareBtn');
const tooltipEl = document.createElement('div');
const TOOLTIP_DELAY_MS = 650;
const SAVE_DELAY_MS = 180;

tooltipEl.className = 'group-tooltip';
tooltipEl.setAttribute('role', 'tooltip');
document.body.appendChild(tooltipEl);

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
const categoryFamilyCounts = getCategoryFamilyCounts();
const monthlySelectionCache = new Map();
const groupById = new Map();
const tileById = new Map();
const historicalPreviousMonthTitles = {
  202606: [
    'Car Brands Set 01',
    'Baking Ingredients',
    'Computer Parts',
    'Things at a Football Game Set 01',
    'Disney Movies Set 01',
    'Sports Equipment',
    'Gardening Tools',
    'Mammals Set 01',
    'Baked Goods',
    'Gemstones',
    'Pop Singers Set 01',
    'NHL Teams and Historic Clubs Set 01',
    'Medical Terminology Set 01',
    'School Supplies Set 01',
    'Sitcom Characters',
    'Grey\'s Anatomy Characters Set 01',
    'Languages',
    'US Cities Set 01',
    'Beatles Songs',
    'Vegetables Set 01',
    'Book Genres',
    'Bedroom Items',
    'Science Fiction TV Shows',
    'Birds',
    'Movie Directors Set 01',
    'Real Housewives Cast Members',
    'Clothing Brands',
    'Musical Genres',
    'Cat Breeds',
    'Classical Composers',
    'Pasta Shapes Set 01',
    'Clothing Items Set 01',
    'Sandwiches',
    'World Capitals Set 01',
    'Dog Breeds',
    'Countries',
    'Bathroom Items',
    'Fabrics',
    'Cocktails Set 01',
    'Space Objects',
    'Trees',
    'US States',
    'Chemical Elements',
    'Musical Instruments',
    'Human Bones',
    'Fruit Trees',
    'Flowers',
    'Things in a Toolbox Set 01',
    'Car Parts Set 01',
    'Conifers',
    'Travel Items',
    'Makeup Products',
    'Friends Characters',
    'Superheroes',
    'Art Supplies',
    'Constellations',
    'Fish',
    'Video Games',
    'Furniture',
    'Wedding Items',
    'Desserts',
    'The Office Characters',
    '90s Movies Set 01',
    'Vegetables Set 01',
    'National Parks',
    'Soups'
  ]
};

let monthlyCategories = [];
let boardGroups = [];
let selectedGroupIds = [];
let shakingGroupIds = [];
let draggedGroupId = null;
let tooltipTimer = null;
let groupClickTimer = null;
let saveTimer = null;
let shareShown = false;
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

  const playableCategories = CATEGORY_BANK.filter(category => category.playable !== false);

  if (CATEGORY_BANK.length !== EXPECTED_BANK_SIZE) {
    errors.push(`Expected ${EXPECTED_BANK_SIZE} categories, found ${CATEGORY_BANK.length}.`);
  }

  if (playableCategories.length < monthlyCategoryCount * 2) {
    errors.push(`Expected at least ${monthlyCategoryCount * 2} reviewed categories for monthly refreshes, found ${playableCategories.length}.`);
  }

  const playableFamilies = new Set(playableCategories.map(category => getCategoryRotationTheme(category.title)));
  if (playableFamilies.size < monthlyCategoryCount * 2) {
    errors.push(`Expected at least ${monthlyCategoryCount * 2} distinct reviewed category themes for monthly refreshes, found ${playableFamilies.size}.`);
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

function pickPuzzleCategories(date = new Date()) {
  const cacheKey = getMonthlySeed(date);
  if (monthlySelectionCache.has(cacheKey)) {
    return monthlySelectionCache.get(cacheKey);
  }

  const historicalPreviousFamilies = getHistoricalPreviousFamilies(date);
  const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 15);
  const previousCategories = shouldCompareWithPreviousMonth(date)
    ? pickPuzzleCategories(previousMonth)
    : [];
  const excludedCategoryIds = new Set(previousCategories.map(category => category.id));
  const previousFamilies = new Set(previousCategories.map(category => getCategoryRotationTheme(category.title)));
  historicalPreviousFamilies.forEach(family => previousFamilies.add(family));
  const freshSelection = pickMonthlyCategories(date, {
    excludedCategoryIds,
    previousFamilies,
    excludePreviousFamilies: true
  });

  if (freshSelection.length === monthlyCategoryCount) {
    monthlySelectionCache.set(cacheKey, freshSelection);
    return freshSelection;
  }

  return freshSelection;
}

function shouldCompareWithPreviousMonth(date) {
  return date.getFullYear() > 2026 || (date.getFullYear() === 2026 && date.getMonth() > 0);
}

function getHistoricalPreviousFamilies(date) {
  return (historicalPreviousMonthTitles[getMonthlySeed(date)] || [])
    .map(title => getCategoryRotationTheme(title));
}

function pickMonthlyCategories(date = new Date(), options = {}) {
  const seed = getMonthlySeed(date);
  let bestSelection = [];
  const excludedCategoryIds = options.excludedCategoryIds || new Set();
  const previousFamilies = options.previousFamilies || new Set();
  const excludePreviousFamilies = options.excludePreviousFamilies === true;

  for (let attempt = 0; attempt < 48; attempt += 1) {
    const selected = [];
    const usedAnswers = new Set();
    const usedFamilies = new Set();
    const random = seededRandom(seed + attempt * 7919);
    const orderedCategories = orderCategoriesForMonth(
      shuffle(CATEGORY_BANK, random).filter(category => {
        const familyTitle = getCategoryRotationTheme(category.title);
        return category.playable !== false
          && !excludedCategoryIds.has(category.id)
          && (!excludePreviousFamilies || !previousFamilies.has(familyTitle));
      }),
      previousFamilies
    );

    orderedCategories.forEach(category => {
      addCategoryToSelection(category, selected, usedAnswers, usedFamilies, false);
    });

    if (selected.length < monthlyCategoryCount) {
      orderedCategories.forEach(category => {
        addCategoryToSelection(category, selected, usedAnswers, usedFamilies, true);
      });
    }

    if (selected.length === monthlyCategoryCount) {
      return selected;
    }

    if (selected.length > bestSelection.length) {
      bestSelection = selected;
    }
  }

  return bestSelection;
}

function orderCategoriesForMonth(categories, previousFamilies) {
  return categories.sort((first, second) => {
    return getCategoryPriority(first, previousFamilies) - getCategoryPriority(second, previousFamilies);
  });
}

function getCategoryPriority(category, previousFamilies) {
  const familyTitle = getCategoryRotationTheme(category.title);
  const repeatsPreviousFamily = previousFamilies.has(familyTitle);
  const reusableFamily = (categoryFamilyCounts.get(familyTitle) || 0) > 1;

  if (!repeatsPreviousFamily && reusableFamily) return 0;
  if (!repeatsPreviousFamily) return 1;
  if (reusableFamily) return 2;
  return 3;
}

function addCategoryToSelection(category, selected, usedAnswers, usedFamilies, allowUsedFamily) {
  if (selected.length >= monthlyCategoryCount || selected.includes(category)) return;

  const familyTitle = getCategoryRotationTheme(category.title);
  if (!allowUsedFamily && usedFamilies.has(familyTitle)) return;

  const normalizedItems = category.items.map(item => normalizeAnswer(cleanAnswerLabel(item)));
  const hasDuplicateAnswer = normalizedItems.some(item => usedAnswers.has(item));

  if (hasDuplicateAnswer) return;

  selected.push(category);
  usedFamilies.add(familyTitle);
  normalizedItems.forEach(item => usedAnswers.add(item));
}

function createBoardGroups() {
  return monthlyCategories.flatMap(category => category.items.map((item, index) => ({
    id: `${category.id}-${index}`,
    categoryId: category.id,
    categoryTitle: category.title,
    items: [cleanAnswerLabel(item)],
    customName: '',
    solved: false
  })));
}

function cleanAnswerLabel(value) {
  return String(value)
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().trim();
}

function getCategoryDisplayTitle(title) {
  return String(title)
    .replace(/\s+Set\s+\d+$/i, '')
    .replace(/:\s+\d+$/i, '')
    .trim();
}

function getCategoryRotationTheme(title) {
  const familyTitle = normalizeAnswer(getCategoryDisplayTitle(title));
  const themedPatterns = [
    ['automotive', /^(car brands|car manufacturers|car parts|car parts and brands)$/],
    ['kitchen-and-ingredients', /^(kitchen items|cooking ingredients|baking ingredients)$/],
    ['clothing-items', /^(items of clothing|clothing items)$/],
    ['colors', /^(colors|colour names)$/],
    ['spices-and-herbs', /^(spices and herbs|culinary spices|culinary herbs)$/],
    ['flowers', /^(flowers|common garden flowers)$/],
    ['fruits', /^(fruits|fruit trees)$/],
    ['trees', /^(trees|conifers)$/],
    ['tools-and-hardware', /^(things in a toolbox|hardware store items)$/],
    ['travel-and-airports', /^(travel items|airport items)$/],
    ['fitness-equipment', /^(exercise equipment|gym equipment)$/]
  ];

  const matchedTheme = themedPatterns.find(([, pattern]) => pattern.test(familyTitle));
  return matchedTheme ? matchedTheme[0] : familyTitle;
}

function getCategoryFamilyCounts() {
  const counts = new Map();

  CATEGORY_BANK.filter(category => category.playable !== false).forEach(category => {
    const familyTitle = getCategoryRotationTheme(category.title);
    counts.set(familyTitle, (counts.get(familyTitle) || 0) + 1);
  });

  return counts;
}

function getStorageKey(date = new Date()) {
  return `${STORAGE_PREFIX}-${getMonthlySeed(date)}`;
}

function startPuzzle(options = {}) {
  const shouldRestore = options.restore !== false;
  const shouldClearSaved = options.clearSaved === true;

  monthlyCategories = pickPuzzleCategories();
  selectedGroupIds = [];
  shakingGroupIds = [];
  draggedGroupId = null;
  shareShown = false;
  hideSharePopup();

  puzzleEl.textContent = monthFormatter.format(new Date());
  resetDateEl.textContent = `Resets ${resetFormatter.format(getNextResetDate())}`;

  if (shouldClearSaved) {
    clearSavedProgress();
  }

  const savedProgress = shouldRestore ? loadProgress() : null;

  if (savedProgress) {
    boardGroups = savedProgress.boardGroups;
    mistakes = savedProgress.mistakes;
    score = savedProgress.score;
  } else {
    boardGroups = shuffle(createBoardGroups());
    mistakes = 0;
    score = 0;
  }

  render();
}

function render(options = {}) {
  const shouldRenderBoard = options.board !== false;
  const shouldSave = options.save !== false;
  const solvedCount = boardGroups.filter(group => group.items.length === answersPerCategory).length;

  scoreEl.textContent = score;
  mistakesEl.textContent = mistakes;
  progressEl.textContent = `${solvedCount} / ${monthlyCategoryCount} groups complete`;
  deselectBtn.disabled = selectedGroupIds.length === 0;
  updateSelectionBar();
  statusEl.textContent = '';
  statusEl.classList.add('status--hidden');

  if (shouldRenderBoard) {
    renderBoard();
  }

  if (shouldSave) {
    scheduleSaveProgress();
  }

  if (solvedCount === monthlyCategoryCount && !shareShown) {
    showSharePopup();
  }
}

function renderBoard() {
  hideGroupTooltip();
  boardEl.innerHTML = '';
  groupById.clear();
  tileById.clear();
  const fragment = document.createDocumentFragment();

  boardGroups.forEach(group => {
    const tile = createTile(group);
    groupById.set(group.id, group);
    tileById.set(group.id, tile);
    fragment.appendChild(tile);
  });

  boardEl.appendChild(fragment);
}

function createTile(group) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.dataset.groupId = group.id;
  tile.innerHTML = getTileLabel(group);
  updateTileState(tile, group);
  return tile;
}

function updateTileState(tile, group) {
  tile.className = getTileClassName(group);
  tile.draggable = shakingGroupIds.length === 0;
  tile.setAttribute('aria-pressed', selectedGroupIds.includes(group.id));
}

function updateTiles(groupIds) {
  new Set(groupIds).forEach(groupId => {
    const group = groupById.get(groupId);
    const tile = tileById.get(groupId);

    if (group && tile) {
      updateTileState(tile, group);

      if (shakingGroupIds.includes(groupId)) {
        restartTileShake(tile);
      }
    }
  });
}

function restartTileShake(tile) {
  if (tile.shakeAnimation) {
    tile.shakeAnimation.cancel();
  }

  tile.classList.remove('tile--shake');
  void tile.offsetWidth;
  tile.classList.add('tile--shake');

  if (typeof tile.animate !== 'function') return;

  tile.shakeAnimation = tile.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-8px)' },
    { transform: 'translateX(8px)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(0)' }
  ], {
    duration: 520,
    easing: 'ease-in-out'
  });
  tile.shakeAnimation.onfinish = () => {
    if (tile.shakeAnimation) {
      tile.shakeAnimation = null;
    }
  };
}

function updateTileContent(group) {
  const tile = tileById.get(group.id);

  if (tile) {
    tile.innerHTML = getTileLabel(group);
    updateTileState(tile, group);
  }
}

function getTileClassName(group) {
  const classes = ['tile'];

  if (group.items.length > 1) classes.push('tile--group');
  if (group.items.length === answersPerCategory) classes.push('tile--complete');
  if (selectedGroupIds.includes(group.id)) classes.push('selected');
  if (shakingGroupIds.includes(group.id)) classes.push('tile--shake');

  return classes.join(' ');
}

function getTileLabel(group) {
  const safeItems = group.items.map(escapeHtml);

  if (group.items.length === answersPerCategory) {
    return `<span class="tile-title">${escapeHtml(group.categoryTitle)}</span>`;
  }

  if (group.customName) {
    return `<strong>${escapeHtml(group.customName)}</strong><span class="tile-count">${group.items.length} grouped</span>`;
  }

  if (group.items.length >= 3) {
    return `<strong>${safeItems[0]}, ${safeItems[1]}, ... ${group.items.length}</strong>`;
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
  if (shakingGroupIds.length > 0) return;

  if (selectedGroupIds.includes(groupId)) {
    selectedGroupIds = selectedGroupIds.filter(id => id !== groupId);
    updateTiles([groupId]);
    render({ board: false, save: false });
    return;
  }

  selectedGroupIds.push(groupId);

  if (selectedGroupIds.length === 2) {
    attemptCombine();
    return;
  }

  updateTiles([groupId]);
  render({ board: false, save: false });
}

function handleTileClick(event, group) {
  if (event.target.classList.contains('tile-name-input')) return;

  if (group.items.length < 2 || group.items.length === answersPerCategory) {
    selectGroup(group.id);
    return;
  }

  clearGroupClickTimer();
  groupClickTimer = window.setTimeout(() => {
    groupClickTimer = null;
    selectGroup(group.id);
  }, 240);
}

function clearGroupClickTimer() {
  if (!groupClickTimer) return;

  window.clearTimeout(groupClickTimer);
  groupClickTimer = null;
}

function attemptCombine() {
  const [firstId, secondId] = selectedGroupIds;
  const firstIndex = boardGroups.findIndex(group => group.id === firstId);
  const secondIndex = boardGroups.findIndex(group => group.id === secondId);
  const first = boardGroups[firstIndex];
  const second = boardGroups[secondIndex];

  if (!first || !second) {
    const staleSelectedIds = [...selectedGroupIds];
    selectedGroupIds = [];
    updateTiles(staleSelectedIds);
    render({ board: false, save: false });
    return;
  }

  if (first.categoryId !== second.categoryId) {
    mistakes += 1;
    shakingGroupIds = [...selectedGroupIds];
    updateTiles(shakingGroupIds);
    render({ board: false });
    window.setTimeout(() => {
      const previouslyShakingIds = [...shakingGroupIds];
      shakingGroupIds = [];
      selectedGroupIds = [];
      updateTiles(previouslyShakingIds);
      render({ board: false, save: false });
    }, 680);
    return;
  }

  const merged = mergeGroups(first, second);
  const remainingGroups = boardGroups.filter(group => group.id !== first.id && group.id !== second.id);
  const insertIndex = Math.min(secondIndex, remainingGroups.length);

  remainingGroups.splice(insertIndex, 0, merged);
  boardGroups = remainingGroups;
  selectedGroupIds = [];
  draggedGroupId = null;
  score += merged.solved ? 45 : 1;
  replaceTilesWithMergedGroup(first, second, merged, insertIndex);
  render({ board: false });
}

function mergeGroups(first, second) {
  const items = [...first.items, ...second.items];
  const customName = getMergedCustomName(first, second);

  return {
    id: `${first.id}__${second.id}`,
    categoryId: first.categoryId,
    categoryTitle: first.categoryTitle,
    items,
    customName,
    solved: items.length === answersPerCategory
  };
}

function getMergedCustomName(first, second) {
  if (first.customName && !second.customName) return first.customName;
  if (second.customName && !first.customName) return second.customName;
  if (first.customName && first.customName === second.customName) return first.customName;
  return '';
}

function replaceTilesWithMergedGroup(first, second, merged, insertIndex) {
  hideGroupTooltip();
  tileById.get(first.id)?.remove();
  tileById.get(second.id)?.remove();
  groupById.delete(first.id);
  groupById.delete(second.id);
  tileById.delete(first.id);
  tileById.delete(second.id);

  const tile = createTile(merged);
  const nextGroup = boardGroups[insertIndex + 1];
  const nextTile = nextGroup ? tileById.get(nextGroup.id) : null;

  groupById.set(merged.id, merged);
  tileById.set(merged.id, tile);
  boardEl.insertBefore(tile, nextTile || null);
}

function shuffleBoard() {
  boardGroups = shuffle(boardGroups);
  selectedGroupIds = [];
  shakingGroupIds = [];
  draggedGroupId = null;
  render();
}

function deselectAll() {
  const selectedIds = [...selectedGroupIds, ...shakingGroupIds];
  selectedGroupIds = [];
  shakingGroupIds = [];
  draggedGroupId = null;
  hideGroupTooltip();
  updateTiles(selectedIds);
  render({ board: false, save: false });
}

function startDrag(event, groupId) {
  if (shakingGroupIds.length > 0) {
    event.preventDefault();
    return;
  }

  draggedGroupId = groupId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', groupId);
}

function allowDrop(event) {
  if (!draggedGroupId || shakingGroupIds.length > 0) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function dropOnGroup(event, targetGroupId) {
  event.preventDefault();

  const sourceGroupId = draggedGroupId || event.dataTransfer.getData('text/plain');
  draggedGroupId = null;

  if (!sourceGroupId || sourceGroupId === targetGroupId || shakingGroupIds.length > 0) {
    return;
  }

  selectedGroupIds = [sourceGroupId, targetGroupId];
  attemptCombine();
}

function endDrag() {
  draggedGroupId = null;
}

function scheduleGroupTooltip(tile, group) {
  clearGroupTooltipTimer();
  tooltipTimer = window.setTimeout(() => {
    showGroupTooltip(tile, group);
  }, TOOLTIP_DELAY_MS);
}

function showGroupTooltip(tile, group) {
  clearGroupTooltipTimer();
  tooltipEl.textContent = group.items.join(', ');
  tooltipEl.classList.add('group-tooltip--visible');
  positionGroupTooltip(tile);
}

function positionGroupTooltip(tile) {
  if (!tooltipEl.classList.contains('group-tooltip--visible')) return;

  const tileRect = tile.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const margin = 8;
  const centeredLeft = tileRect.left + tileRect.width / 2 - tooltipRect.width / 2;
  const left = Math.max(margin, Math.min(centeredLeft, window.innerWidth - tooltipRect.width - margin));
  let top = tileRect.top - tooltipRect.height - margin;

  tooltipEl.classList.toggle('group-tooltip--below', top < margin);

  if (top < margin) {
    top = tileRect.bottom + margin;
  }

  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${top}px`;
}

function hideGroupTooltip() {
  clearGroupTooltipTimer();
  tooltipEl.classList.remove('group-tooltip--visible', 'group-tooltip--below');
}

function clearGroupTooltipTimer() {
  if (!tooltipTimer) return;

  window.clearTimeout(tooltipTimer);
  tooltipTimer = null;
}

function updateSelectionBar() {
  const selectedGroups = selectedGroupIds
    .map(id => boardGroups.find(group => group.id === id))
    .filter(Boolean);

  if (selectedGroups.length === 0) {
    selectedSummaryEl.textContent = 'No tile selected';
    return;
  }

  selectedSummaryEl.textContent = selectedGroups.map(getSelectedGroupSummary).join(' + ');
}

function getSelectedGroupSummary(group) {
  if (group.items.length === answersPerCategory) {
    return group.categoryTitle;
  }

  return group.items.join(', ');
}

function startInlineGroupNaming(event, tile, group) {
  if (group.items.length < 2 || group.items.length === answersPerCategory) {
    return;
  }

  clearGroupClickTimer();
  event.preventDefault();
  event.stopPropagation();
  hideGroupTooltip();

  const input = document.createElement('input');
  input.className = 'tile-name-input';
  input.type = 'text';
  input.maxLength = 42;
  input.value = group.customName || '';
  input.placeholder = 'Name this group';

  tile.innerHTML = '';
  tile.appendChild(input);
  input.focus();
  input.select();
  let finished = false;

  const finishNaming = shouldSave => {
    if (finished) return;

    finished = true;
    if (shouldSave) {
      group.customName = input.value.trim();
      scheduleSaveProgress();
    }

    updateTileContent(group);
  };

  input.addEventListener('click', inputEvent => inputEvent.stopPropagation());
  input.addEventListener('dblclick', inputEvent => inputEvent.stopPropagation());
  input.addEventListener('keydown', inputEvent => {
    if (inputEvent.key === 'Enter') finishNaming(true);
    if (inputEvent.key === 'Escape') finishNaming(false);
  });
  input.addEventListener('blur', () => finishNaming(true));
}

function showSharePopup() {
  shareShown = true;
  shareStatsEl.textContent = `${monthFormatter.format(new Date())} completed with ${mistakes} mistakes.`;
  shareTextEl.value = createShareText();
  shareModal.hidden = false;
}

function hideSharePopup() {
  if (!shareModal) return;

  shareModal.hidden = true;
}

function createShareText() {
  return [
    `Connections Monthly - ${monthFormatter.format(new Date())}`,
    `${monthlyCategoryCount} / ${monthlyCategoryCount} groups complete`,
    `Mistakes: ${mistakes}`,
    `Score: ${score}`
  ].join('\n');
}

async function copyShareText() {
  const shareText = shareTextEl.value;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareText);
    } else {
      shareTextEl.select();
      document.execCommand('copy');
    }

    copyShareBtn.textContent = 'Copied';
    window.setTimeout(() => {
      copyShareBtn.textContent = 'Copy Share';
    }, 1200);
  } catch (error) {
    shareTextEl.select();
  }
}

function scheduleSaveProgress() {
  if (saveTimer) {
    window.clearTimeout(saveTimer);
  }

  saveTimer = window.setTimeout(() => {
    saveTimer = null;
    saveProgress();
  }, SAVE_DELAY_MS);
}

function saveProgress() {
  const storage = getStorage();
  if (!storage || boardGroups.length === 0) return;

  try {
    storage.setItem(getStorageKey(), JSON.stringify({
      seed: getMonthlySeed(),
      boardGroups,
      mistakes,
      score,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    // Ignore storage failures so private browsing or full storage never breaks the game.
  }
}

function loadProgress() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const rawProgress = storage.getItem(getStorageKey());
    if (!rawProgress) return null;

    const progress = JSON.parse(rawProgress);
    if (!isValidProgress(progress)) return null;

    return {
      boardGroups: progress.boardGroups,
      mistakes: Number(progress.mistakes) || 0,
      score: Number(progress.score) || 0
    };
  } catch (error) {
    return null;
  }
}

function clearSavedProgress() {
  const storage = getStorage();
  if (!storage) return;

  try {
    if (saveTimer) {
      window.clearTimeout(saveTimer);
      saveTimer = null;
    }

    storage.removeItem(getStorageKey());
  } catch (error) {
    // Ignore storage failures so reset still works.
  }
}

function getStorage() {
  try {
    return window.localStorage || null;
  } catch (error) {
    return null;
  }
}

function isValidProgress(progress) {
  if (!progress || progress.seed !== getMonthlySeed() || !Array.isArray(progress.boardGroups)) {
    return false;
  }

  const validCategoryIds = new Set(monthlyCategories.map(category => category.id));
  const savedCategoryIds = new Set(progress.boardGroups.map(group => group.categoryId));
  const itemTotal = progress.boardGroups.reduce((total, group) => {
    if (!isValidSavedGroup(group, validCategoryIds)) return Number.NaN;
    return total + group.items.length;
  }, 0);

  return itemTotal === monthlyCategoryCount * answersPerCategory
    && savedCategoryIds.size === validCategoryIds.size
    && [...validCategoryIds].every(categoryId => savedCategoryIds.has(categoryId));
}

function isValidSavedGroup(group, validCategoryIds) {
  return group
    && typeof group.id === 'string'
    && validCategoryIds.has(group.categoryId)
    && typeof group.categoryTitle === 'string'
    && Array.isArray(group.items)
    && group.items.length > 0
    && group.items.length <= answersPerCategory
    && (group.customName === undefined || typeof group.customName === 'string')
    && group.items.every(item => typeof item === 'string' && item.trim().length > 0);
}

function showValidationErrors(errors) {
  statusEl.textContent = errors[0];
  statusEl.classList.remove('status--hidden');
  statusEl.classList.add('status--error');
}

function getEventTile(event) {
  const tile = event.target.closest('.tile');
  return tile && boardEl.contains(tile) ? tile : null;
}

function getTileGroup(tile) {
  return tile ? groupById.get(tile.dataset.groupId) : null;
}

function handleBoardClick(event) {
  const tile = getEventTile(event);
  const group = getTileGroup(tile);

  if (group) {
    handleTileClick(event, group);
  }
}

function handleBoardDoubleClick(event) {
  const tile = getEventTile(event);
  const group = getTileGroup(tile);

  if (group) {
    startInlineGroupNaming(event, tile, group);
  }
}

function handleBoardMouseOver(event) {
  const tile = getEventTile(event);
  const group = getTileGroup(tile);

  if (group && group.items.length > 1 && !tile.contains(event.relatedTarget)) {
    scheduleGroupTooltip(tile, group);
  }
}

function handleBoardMouseMove(event) {
  const tile = getEventTile(event);

  if (tile) {
    positionGroupTooltip(tile);
  }
}

function handleBoardMouseOut(event) {
  const tile = getEventTile(event);

  if (tile && !tile.contains(event.relatedTarget)) {
    hideGroupTooltip();
  }
}

function handleBoardFocusIn(event) {
  const tile = getEventTile(event);
  const group = getTileGroup(tile);

  if (event.target === tile && group && group.items.length > 1) {
    showGroupTooltip(tile, group);
  }
}

function handleBoardFocusOut(event) {
  const tile = getEventTile(event);

  if (tile && !tile.contains(event.relatedTarget)) {
    hideGroupTooltip();
  }
}

function handleBoardDragStart(event) {
  const tile = getEventTile(event);

  if (tile) {
    startDrag(event, tile.dataset.groupId);
  }
}

function handleBoardDrop(event) {
  const tile = getEventTile(event);

  if (tile) {
    dropOnGroup(event, tile.dataset.groupId);
  }
}

boardEl.addEventListener('click', handleBoardClick);
boardEl.addEventListener('dblclick', handleBoardDoubleClick);
boardEl.addEventListener('mouseover', handleBoardMouseOver);
boardEl.addEventListener('mousemove', handleBoardMouseMove);
boardEl.addEventListener('mouseout', handleBoardMouseOut);
boardEl.addEventListener('focusin', handleBoardFocusIn);
boardEl.addEventListener('focusout', handleBoardFocusOut);
boardEl.addEventListener('dragstart', handleBoardDragStart);
boardEl.addEventListener('dragover', allowDrop);
boardEl.addEventListener('drop', handleBoardDrop);
boardEl.addEventListener('dragend', endDrag);
shuffleBtn.addEventListener('click', shuffleBoard);
deselectBtn.addEventListener('click', deselectAll);
resetBtn.addEventListener('click', () => startPuzzle({ restore: false, clearSaved: true }));
closeShareBtn.addEventListener('click', hideSharePopup);
copyShareBtn.addEventListener('click', copyShareText);
window.addEventListener('pagehide', saveProgress);

const validationErrors = validateBank();
startPuzzle();

if (validationErrors.length > 0) {
  showValidationErrors(validationErrors);
}
