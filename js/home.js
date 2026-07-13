const institutionList = document.getElementById('institution-list');
const resultsCount = document.getElementById('results-count');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const filterForm = document.getElementById('filter-form');
const resetFilters = document.getElementById('reset-filters');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const statInstitutions = document.getElementById('stat-institutions');
const statPrefectures = document.getElementById('stat-prefectures');
const statPrograms = document.getElementById('stat-programs');
const statEnglishPrograms = document.getElementById('stat-english-programs');

let institutions = [];
let majors = [];

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(value);
      if (row.some((entry) => entry.length)) rows.push(row);
      row = [];
      value = '';
    } else {
      value += char;
    }
  }

  if (value.length || row.length) {
    row.push(value);
    rows.push(row);
  }

  const headers = rows[0]?.map((header) => header.trim()) || [];
  return rows.slice(1).map((values) =>
    headers.reduce((entry, header, index) => {
      entry[header] = values[index] ? values[index].trim() : '';
      return entry;
    }, {})
  );
}

function escapeHTML(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const icons = {
  mapPin: '<svg class="lucide lucide-map-pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>',
  circleCheck: '<svg class="lucide lucide-circle-check" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>',
  briefcase: '<svg class="lucide lucide-briefcase-business" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12h.01" /><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M22 13a18.15 18.15 0 0 1-20 0" /><rect width="20" height="14" x="2" y="6" rx="2" /></svg>',
  arrowRight: '<svg class="lucide lucide-arrow-right" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>',
};

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function updateStats() {
  statInstitutions.textContent = formatNumber(institutions.length);
  statPrefectures.textContent = formatNumber(new Set(institutions.map((institution) => englishField(institution, 'prefecture')).filter(Boolean)).size);
  statPrograms.textContent = formatNumber(majors.length);
  statEnglishPrograms.textContent = formatNumber(institutions.filter((institution) => englishField(institution, 'english_program') === 'Yes').length);
}

function renderInstitutions() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filters = Object.fromEntries(new FormData(filterForm).entries());

  const filtered = institutions.filter((institution) => {
    const searchableText = [
      englishField(institution, 'name'),
      englishField(institution, 'city'),
      englishField(institution, 'prefecture'),
      englishField(institution, 'type'),
      englishField(institution, 'ownership'),
      englishField(institution, 'description'),
    ]
      .join(' ')
      .toLowerCase();

    return (
      searchableText.includes(searchTerm) &&
      (!filters.type || englishField(institution, 'type') === filters.type) &&
      (!filters.ownership || englishField(institution, 'ownership') === filters.ownership) &&
      (!filters.prefecture || englishField(institution, 'prefecture') === filters.prefecture) &&
      (!filters.english_program || englishField(institution, 'english_program') === filters.english_program) &&
      (!filters.scholarship || englishField(institution, 'scholarship') === filters.scholarship)
    );
  });

  resultsCount.textContent = translate('institutionsFound', { count: filtered.length });

  if (!filtered.length) {
    institutionList.innerHTML = `<div class="empty-state">${escapeHTML(translate('noMatches'))}</div>`;
    return;
  }

  institutionList.innerHTML = filtered
    .map((institution) => {
      const imagePath = institution.image || 'images/placeholder.svg';
      const name = localizedField(institution, 'name');
      const type = localizedField(institution, 'type');
      const city = localizedField(institution, 'city');
      const prefecture = localizedField(institution, 'prefecture');
      const englishProgram = localizedField(institution, 'english_program');
      const scholarship = localizedField(institution, 'scholarship');
      const description = localizedField(institution, 'description');

      return `
        <article class="school-card">
          <div class="school-image-wrap">
            <img src="${escapeHTML(imagePath)}" alt="${escapeHTML(name)}" />
          </div>
          <div class="school-body">
            <span class="badge">${escapeHTML(type)}</span>
            <h3>${escapeHTML(name)}</h3>
            <p class="japanese-name">${escapeHTML(description)}</p>
            <div class="school-meta">
              <span>${icons.mapPin} ${escapeHTML(city)}, ${escapeHTML(prefecture)}</span>
              <span>${icons.circleCheck} ${escapeHTML(englishProgram)}</span>
              <span>${icons.briefcase} ${escapeHTML(scholarship)}</span>
            </div>
            <div class="card-topline">
              <span></span>
              <a class="details-button" href="${escapeHTML(withLanguage(`institution.html?id=${encodeURIComponent(institution.id)}`))}">${escapeHTML(translate('viewDetails'))} ${icons.arrowRight}</a>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function populateFilters() {
  const currentValues = Object.fromEntries(new FormData(filterForm).entries());
  const fillSelect = (name, rows) => {
    const select = filterForm.querySelector(`[name="${name}"]`);
    const options = new Map();

    select.querySelectorAll('option:not([value=""])').forEach((option) => option.remove());

    rows.forEach((institution) => {
      const value = englishField(institution, name);
      if (value && !options.has(value)) options.set(value, localizedField(institution, name));
    });

    [...options.entries()]
      .sort(([firstValue], [secondValue]) => firstValue.localeCompare(secondValue))
      .forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        select.appendChild(option);
      });
  };

  fillSelect('type', institutions);
  fillSelect('ownership', institutions);
  fillSelect('prefecture', institutions);

  Object.entries(currentValues).forEach(([name, value]) => {
    if (filterForm.elements[name]) filterForm.elements[name].value = value;
  });
}

function playResetAnimation() {
  resetFilters.classList.remove('is-spinning');
  void resetFilters.offsetWidth;
  resetFilters.classList.add('is-spinning');
}

function buildSchoolsUrl() {
  const params = new URLSearchParams();
  const searchTerm = searchInput.value.trim();
  const filters = Object.fromEntries(new FormData(filterForm).entries());

  if (searchTerm) params.set('q', searchTerm);
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set('lang', getLanguage());

  return `schools.html?${params}`;
}

function redirectToSchools() {
  showPageLoading();
  window.location.href = buildSchoolsUrl();
}

async function loadData() {
  try {
    const [institutionResponse, majorsResponse] = await Promise.all([
      fetch('data/institutions.csv'),
      fetch('data/majors.csv'),
    ]);

    if (!institutionResponse.ok || !majorsResponse.ok) throw new Error('Unable to load site data.');

    institutions = parseCSV(await institutionResponse.text());
    majors = parseCSV(await majorsResponse.text());
    updateStats();
    bindLanguageControls(() => {
      populateFilters();
      renderInstitutions();
    });
    populateFilters();
    renderInstitutions();
  } catch (error) {
    institutionList.innerHTML = `<div class="empty-state">${escapeHTML(error.message)}</div>`;
    resultsCount.textContent = translate('unableLoadInstitutions');
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  redirectToSchools();
});

filterForm.addEventListener('change', redirectToSchools);

resetFilters.addEventListener('click', () => {
  playResetAnimation();
  filterForm.reset();
  redirectToSchools();
});

resetFilters.addEventListener('animationend', () => {
  resetFilters.classList.remove('is-spinning');
});

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

loadData();
