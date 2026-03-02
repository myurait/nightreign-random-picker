const LANG = navigator.language.startsWith('ja') ? 'ja' : 'en';
const UNSELECTED_LABEL = LANG === 'ja' ? '選択せよ' : 'Unselected';

const DLC_IDS = ['undertaker', 'scholar'];

const CHARACTERS = [
  { id: 'duchess',    name: { en: 'Duchess',    ja: 'レディ' }, dlc: false },
  { id: 'executor',   name: { en: 'Executor',   ja: '執行者' }, dlc: false },
  { id: 'guardian',   name: { en: 'Guardian',   ja: '守護者' }, dlc: false },
  { id: 'ironeye',    name: { en: 'Ironeye',    ja: '鉄の目' }, dlc: false },
  { id: 'raider',     name: { en: 'Raider',     ja: '無頼漢' }, dlc: false },
  { id: 'recluse',    name: { en: 'Recluse',    ja: '隠者' }, dlc: false },
  { id: 'revenant',   name: { en: 'Revenant',   ja: '復讐者' }, dlc: false },
  { id: 'scholar',    name: { en: 'Scholar',    ja: '学者' }, dlc: true },
  { id: 'undertaker', name: { en: 'Undertaker', ja: '葬儀屋' }, dlc: true },
  { id: 'wylder',     name: { en: 'Wylder',     ja: '追跡者' }, dlc: false },
];

const dlcToggle = document.getElementById('dlc-toggle-input');

function getAvailableCharacters() {
  return dlcToggle.checked ? CHARACTERS : CHARACTERS.filter(c => !c.dlc);
}

function getRandomCharacter(excludeIds = []) {
  const pool = getAvailableCharacters().filter(c => !excludeIds.includes(c.id));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getCurrentCharacterId(card) {
  const img = card.querySelector('.card-portrait img');
  const match = img.src.match(/images\/(.+)\.png/);
  return match ? match[1] : null;
}

function applyCharacter(card, character) {
  const portrait = card.querySelector('.card-portrait img');
  const nameEl = card.querySelector('.character-name');
  const btn = card.querySelector('.reload-btn');
  const displayName = character.name[LANG];

  portrait.src = `images/${character.id}.png`;
  portrait.alt = displayName;
  nameEl.textContent = displayName;
  btn.setAttribute('aria-label', `Reroll ${displayName}`);
  card.classList.remove('is-unselected');
}

// Apply language
if (LANG === 'ja') document.documentElement.classList.add('lang-ja');
document.querySelectorAll('.is-unselected .character-name').forEach(el => {
  el.textContent = UNSELECTED_LABEL;
});

// Individual reload
document.querySelectorAll('.reload-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('.character-card');

    const currentId = getCurrentCharacterId(card);
    const next = getRandomCharacter(currentId ? [currentId] : []);

    if (next) applyCharacter(card, next);
  });
});

// Randomize All
document.querySelector('.randomize-all-btn').addEventListener('click', () => {
  const cards = [...document.querySelectorAll('.character-card')];
  cards.forEach(card => {
    const next = getRandomCharacter([]);
    if (next) applyCharacter(card, next);
  });
});
