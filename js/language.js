const LANGUAGE_STORAGE_KEY = 'studyInJapanLanguage';
const SUPPORTED_LANGUAGES = ['en', 'ja'];

const translations = {
  en: {
    heroTitle: 'Find Your Future in Japan',
    heroText: 'Search and explore universities and colleges across Japan.',
    searchSchools: 'Search schools',
    searchPlaceholder: 'Search by school name, city or keyword...',
    type: 'Type',
    ownership: 'Ownership',
    prefecture: 'Prefecture',
    englishProgram: 'English Program',
    scholarship: 'Scholarship',
    all: 'All',
    yes: 'Yes',
    no: 'No',
    resetFilters: 'Reset Filters',
    institutionsLabel: 'Universities & Colleges',
    prefecturesLabel: 'Prefectures',
    programsLabel: 'Academic Programs',
    englishProgramsLabel: 'English Programs',
    popularSchools: 'Popular Schools',
    loadingInstitutions: 'Loading institutions...',
    viewAllSchools: 'View All Schools →',
    viewDetails: 'View Details',
    institutionsFound: '{count} institutions found',
    noMatches: 'No institutions match your search and filters.',
    unableLoadInstitutions: 'Unable to load institutions',
    schoolDirectory: 'School Directory',
    browseTitle: 'Explore schools in Japan',
    browseText: 'Search by school name, city, prefecture, or use filters to narrow the list.',
    allSchools: 'All Schools',
    institution: 'Institution',
    loadingInstitution: 'Loading institution...',
    aboutUniversity: 'About the University',
    loadingDetails: 'Loading details...',
    majorsOffered: 'Majors Offered',
    scholarshipAvailable: 'Scholarship Available',
    location: 'Location',
    englishPrograms: 'English Programs',
    noMajors: 'No majors have been added for this institution yet.',
    institutionNotFound: 'Institution Not Found',
    institutionNotFoundText: 'The requested institution could not be found.',
    returnHome: 'Please return to the homepage and choose another institution.',
    unableLoadDetails: 'Unable to load details',
    loading: 'Loading...',
  },
  ja: {
    heroTitle: '日本で未来を見つけよう',
    heroText: '日本全国の大学・専門学校を検索して比較できます。',
    searchSchools: '学校を検索',
    searchPlaceholder: '学校名、都市、キーワードで検索...',
    type: '学校種別',
    ownership: '設置区分',
    prefecture: '都道府県',
    englishProgram: '英語プログラム',
    scholarship: '奨学金',
    all: 'すべて',
    yes: 'あり',
    no: 'なし',
    resetFilters: '条件をリセット',
    institutionsLabel: '大学・学校',
    prefecturesLabel: '都道府県',
    programsLabel: '学科・専攻',
    englishProgramsLabel: '英語プログラム',
    popularSchools: '人気の学校',
    loadingInstitutions: '学校情報を読み込み中...',
    viewAllSchools: 'すべての学校を見る →',
    viewDetails: '詳細を見る',
    institutionsFound: '{count} 校が見つかりました',
    noMatches: '検索条件に一致する学校はありません。',
    unableLoadInstitutions: '学校情報を読み込めませんでした',
    schoolDirectory: '学校一覧',
    browseTitle: '日本の学校を探す',
    browseText: '学校名、都市、都道府県、または条件を使って絞り込めます。',
    allSchools: 'すべての学校',
    institution: '学校',
    loadingInstitution: '学校情報を読み込み中...',
    aboutUniversity: '学校について',
    loadingDetails: '詳細を読み込み中...',
    majorsOffered: '学科・専攻',
    scholarshipAvailable: '奨学金',
    location: '所在地',
    englishPrograms: '英語プログラム',
    noMajors: 'この学校の学科情報はまだ登録されていません。',
    institutionNotFound: '学校が見つかりません',
    institutionNotFoundText: '指定された学校は見つかりませんでした。',
    returnHome: 'ホームページに戻って別の学校を選んでください。',
    unableLoadDetails: '詳細を読み込めませんでした',
    loading: '読み込み中...',
  },
};

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : 'ja';
}

function getLanguageFromUrl() {
  const language = new URLSearchParams(window.location.search).get('lang');
  return SUPPORTED_LANGUAGES.includes(language) ? language : '';
}

function getLanguage() {
  return getLanguageFromUrl() || normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

function updateCurrentUrlLanguage(language) {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', language);
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function setLanguage(language, options = {}) {
  const normalizedLanguage = normalizeLanguage(language);
  localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  document.documentElement.lang = normalizedLanguage;
  if (options.updateUrl) updateCurrentUrlLanguage(normalizedLanguage);
}

function translate(key, replacements = {}) {
  const language = getLanguage();
  let text = translations[language]?.[key] || translations.en[key] || key;
  Object.entries(replacements).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });
  return text;
}

function localizedField(item, key, language = getLanguage()) {
  return item[`${key}_${language}`] || item[`${key}_en`] || item[key] || '';
}

function englishField(item, key) {
  return item[`${key}_en`] || item[key] || '';
}

function withLanguage(url) {
  if (!url || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;

  const nextUrl = new URL(url, window.location.href);
  const isLocalPage = nextUrl.origin === window.location.origin && nextUrl.pathname.endsWith('.html');
  if (!isLocalPage) return url;

  nextUrl.searchParams.set('lang', getLanguage());
  return `${nextUrl.pathname.split('/').pop()}${nextUrl.search}${nextUrl.hash}`;
}

function updateLanguageLinks() {
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.includes('.html')) link.setAttribute('href', withLanguage(href));
  });
}

function ensurePageLoader() {
  let loader = document.getElementById('page-loading');
  if (loader) return loader;

  loader = document.createElement('div');
  loader.className = 'page-loading';
  loader.id = 'page-loading';
  loader.setAttribute('aria-live', 'polite');
  loader.innerHTML = `
    <div class="page-loading-box">
      <div class="loading-spinner" aria-hidden="true"></div>
      <span data-page-loading-text>${translate('loading')}</span>
    </div>
  `;
  document.body.appendChild(loader);
  return loader;
}

function showPageLoading() {
  const loader = ensurePageLoader();
  const text = loader.querySelector('[data-page-loading-text]');
  if (text) text.textContent = translate('loading');
  loader.classList.add('active');
}

function bindPageLoadingLinks() {
  if (document.body.dataset.pageLoadingBound === 'true') return;
  document.body.dataset.pageLoadingBound = 'true';

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target && link.target !== '_self') return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.endsWith('.html')) return;

    showPageLoading();
  });
}

function applyTranslations() {
  document.documentElement.lang = getLanguage();

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', translate(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll('[data-i18n-label]').forEach((element) => {
    element.setAttribute('aria-label', translate(element.dataset.i18nLabel));
  });

  document.querySelectorAll('[data-language]').forEach((button) => {
    const isActive = button.dataset.language === getLanguage();
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  updateLanguageLinks();
  const loadingText = document.querySelector('[data-page-loading-text]');
  if (loadingText) loadingText.textContent = translate('loading');
}

function bindLanguageControls(onChange) {
  setLanguage(getLanguage());
  bindPageLoadingLinks();
  applyTranslations();

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.language, { updateUrl: true });
      applyTranslations();
      onChange?.();
    });
  });
}
