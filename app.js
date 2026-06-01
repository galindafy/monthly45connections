const EXPECTED_BANK_SIZE = 600;
const DEFAULT_MONTHLY_CATEGORY_COUNT = 45;
const DEFAULT_ANSWERS_PER_CATEGORY = 45;
const STORAGE_PREFIX = 'connections-monthly-progress-v5';

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

let monthlyCategories = [];
let boardGroups = [];
let selectedGroupIds = [];
let shakingGroupIds = [];
let draggedGroupId = null;
let tooltipTimer = null;
let groupClickTimer = null;
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

  const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 15);
  const previousCategories = shouldCompareWithPreviousMonth(date)
    ? pickPuzzleCategories(previousMonth)
    : [];
  const excludedCategoryIds = new Set(previousCategories.map(category => category.id));
  const previousFamilies = new Set(previousCategories.map(category => getCategoryRotationTheme(category.title)));
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

function render() {
  const solvedCount = boardGroups.filter(group => group.items.length === answersPerCategory).length;

  scoreEl.textContent = score;
  mistakesEl.textContent = mistakes;
  progressEl.textContent = `${solvedCount} / ${monthlyCategoryCount} groups complete`;
  deselectBtn.disabled = selectedGroupIds.length === 0;
  updateSelectionBar();
  statusEl.textContent = '';
  statusEl.classList.add('status--hidden');

  boardEl.innerHTML = '';
  const fragment = document.createDocumentFragment();

  boardGroups.forEach(group => {
    const tile = document.createElement('button');
    tile.className = getTileClassName(group);
    tile.type = 'button';
    tile.draggable = shakingGroupIds.length === 0;
    tile.dataset.groupId = group.id;
    if (group.items.length > 1) {
      tile.dataset.preview = group.items.join(', ');
    }
    tile.setAttribute('aria-pressed', selectedGroupIds.includes(group.id));
    tile.innerHTML = getTileLabel(group);
    tile.addEventListener('click', event => handleTileClick(event, group));
    tile.addEventListener('dblclick', event => startInlineGroupNaming(event, tile, group));
    tile.addEventListener('dragstart', event => startDrag(event, group.id));
    tile.addEventListener('dragover', allowDrop);
    tile.addEventListener('drop', event => dropOnGroup(event, group.id));
    tile.addEventListener('dragend', endDrag);
    if (group.items.length > 1) {
      tile.addEventListener('mouseenter', () => scheduleGroupTooltip(tile, group));
      tile.addEventListener('mousemove', () => positionGroupTooltip(tile));
      tile.addEventListener('mouseleave', hideGroupTooltip);
      tile.addEventListener('focus', () => showGroupTooltip(tile, group));
      tile.addEventListener('blur', hideGroupTooltip);
    }
    fragment.appendChild(tile);
  });

  boardEl.appendChild(fragment);
  saveProgress();

  if (solvedCount === monthlyCategoryCount && !shareShown) {
    showSharePopup();
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
    selectedGroupIds = [];
    render();
    return;
  }

  if (first.categoryId !== second.categoryId) {
    mistakes += 1;
    shakingGroupIds = [...selectedGroupIds];
    render();
    window.setTimeout(() => {
      shakingGroupIds = [];
      selectedGroupIds = [];
      render();
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
  render();
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

function shuffleBoard() {
  boardGroups = shuffle(boardGroups);
  selectedGroupIds = [];
  shakingGroupIds = [];
  draggedGroupId = null;
  render();
}

function deselectAll() {
  selectedGroupIds = [];
  shakingGroupIds = [];
  draggedGroupId = null;
  hideGroupTooltip();
  render();
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

  const saveName = () => {
    group.customName = input.value.trim();
    render();
  };

  input.addEventListener('click', inputEvent => inputEvent.stopPropagation());
  input.addEventListener('dblclick', inputEvent => inputEvent.stopPropagation());
  input.addEventListener('keydown', inputEvent => {
    if (inputEvent.key === 'Enter') saveName();
    if (inputEvent.key === 'Escape') render();
  });
  input.addEventListener('blur', saveName);
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

shuffleBtn.addEventListener('click', shuffleBoard);
deselectBtn.addEventListener('click', deselectAll);
resetBtn.addEventListener('click', () => startPuzzle({ restore: false, clearSaved: true }));
closeShareBtn.addEventListener('click', hideSharePopup);
copyShareBtn.addEventListener('click', copyShareText);

const validationErrors = validateBank();
startPuzzle();

if (validationErrors.length > 0) {
  showValidationErrors(validationErrors);
}
