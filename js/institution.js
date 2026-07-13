const breadcrumbName = document.getElementById('breadcrumb-name');
const institutionName = document.getElementById('institution-name');
const institutionJapaneseName = document.getElementById('institution-japanese-name');
const institutionImage = document.getElementById('institution-image');
const institutionLocation = document.getElementById('institution-location');
const institutionType = document.getElementById('institution-type');
const institutionTypePill = document.getElementById('institution-type-pill');
const institutionOwnership = document.getElementById('institution-ownership');
const institutionEnglish = document.getElementById('institution-english');
const institutionScholarship = document.getElementById('institution-scholarship');
const institutionDescription = document.getElementById('institution-description');
const majorsList = document.getElementById('majors-list');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

let institutions = [];
let majors = [];
let currentInstitution = null;

const majorIcons = {
  'Computer Science': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 16V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11" /><path d="M2 20h20" /><path d="M6 16h12" /></svg>',
  'Electrical Engineering': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 10-12h-7l1-8Z" /></svg>',
  'Mechanical Engineering': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 0 1-4 0V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H2.8a2 2 0 0 1 0-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V2.8a2 2 0 0 1 4 0V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" /></svg>',
  Economics: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18" /><path d="M8 17V9" /><path d="M13 17V5" /><path d="M18 17v-6" /></svg>',
  Law: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 16 3-8 3 8c-.9 1.3-5.1 1.3-6 0Z" /><path d="m2 16 3-8 3 8c-.9 1.3-5.1 1.3-6 0Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h18" /></svg>',
  'International Relations': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></svg>',
  Physics: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2-2 0-7.2-4.5-11.7S6 2 3.8 3.8s0 7.2 4.5 11.7 9.7 6.5 11.9 4.7Z" /><path d="M15.7 15.5c4.5-4.5 6.5-9.7 4.5-11.7S13 3.8 8.3 8.5 1.8 18.2 3.8 20.2s7.4-.2 11.9-4.7Z" /></svg>',
  Chemistry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2v6.5L4.5 18A3 3 0 0 0 7.1 22h9.8a3 3 0 0 0 2.6-4L14 8.5V2" /><path d="M8 2h8" /><path d="M7 16h10" /></svg>',
  Biology: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14c4.5 0 4.5-4 8-4s3.5 4 8 4" /><path d="M4 10c4.5 0 4.5 4 8 4s3.5-4 8-4" /><path d="M7 7 17 17" /><path d="m7 17 10-10" /></svg>',
};

const fallbackMajorIcons = [
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3H3Z" /></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 22V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" /><path d="M8 22V10h8v12" /><path d="M8 6h.01" /><path d="M12 6h.01" /><path d="M16 6h.01" /></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" /><path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /><path d="M3 13h18" /></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 0 0 7-7" /><path d="M9 14 4 9l6-6 5 5" /><path d="m10 13 4-4" /></svg>',
];

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

function groupMajorsByName(rows) {
  const grouped = new Map();

  rows.forEach((major) => {
    const key = englishField(major, 'major_name');
    if (!grouped.has(key)) {
      grouped.set(key, {
        major,
        dates: [],
      });
    }

    if (major.open_campus_date) grouped.get(key).dates.push(major.open_campus_date);
  });

  return [...grouped.values()].map((group) => ({
    major: group.major,
    dates: [...new Set(group.dates)].sort(),
  }));
}

function renderOpenCampusDates(dates) {
  if (!dates.length) return '<div class="major-arrow">&rsaquo;</div>';

  return `
    <div class="major-dates" aria-label="Open campus dates">
      ${dates.map((date) => `<span>${escapeHTML(date)}</span>`).join('')}
    </div>
  `;
}

function renderInstitutionDetails(institution) {
  const name = localizedField(institution, 'name');
  const secondaryName = getLanguage() === 'en' ? localizedField(institution, 'name', 'ja') : englishField(institution, 'name');
  const relatedMajors = groupMajorsByName(majors.filter((major) => major.institution_id === institution.id));

  breadcrumbName.removeAttribute('data-i18n');
  institutionName.removeAttribute('data-i18n');
  institutionDescription.removeAttribute('data-i18n');

  breadcrumbName.textContent = name;
  institutionName.textContent = name;
  institutionJapaneseName.textContent = secondaryName;
  institutionImage.src = institution.image || 'images/placeholder.svg';
  institutionImage.alt = name;
  institutionLocation.textContent = `${localizedField(institution, 'city')}, ${localizedField(institution, 'prefecture')}`;
  institutionType.textContent = localizedField(institution, 'type');
  institutionTypePill.textContent = localizedField(institution, 'type');
  institutionOwnership.textContent = localizedField(institution, 'ownership');
  institutionEnglish.textContent = localizedField(institution, 'english_program');
  institutionScholarship.textContent = localizedField(institution, 'scholarship');
  institutionDescription.textContent = localizedField(institution, 'description');
  document.title = `${name} | Study in Japan`;

  if (!relatedMajors.length) {
    majorsList.innerHTML = `<div class="empty-state">${escapeHTML(translate('noMajors'))}</div>`;
    return;
  }

  majorsList.innerHTML = relatedMajors
    .map(({ major, dates }, index) => {
      const majorNameEn = englishField(major, 'major_name');
      const icon = majorIcons[majorNameEn] || fallbackMajorIcons[index % fallbackMajorIcons.length];

      return `
        <article class="major-card">
          <div class="major-icon">${icon}</div>
          <div class="major-info">
            <strong>${escapeHTML(localizedField(major, 'major_name'))}</strong>
            <div class="major-meta">${escapeHTML(localizedField(major, 'study_level'))} &bull; ${escapeHTML(localizedField(major, 'language'))}</div>
          </div>
          ${renderOpenCampusDates(dates)}
        </article>
      `;
    })
    .join('');
}

function renderNotFound() {
  institutionName.removeAttribute('data-i18n');
  institutionDescription.removeAttribute('data-i18n');
  institutionName.textContent = translate('institutionNotFound');
  institutionDescription.textContent = translate('institutionNotFoundText');
  majorsList.innerHTML = `<div class="empty-state">${escapeHTML(translate('returnHome'))}</div>`;
}

async function loadData() {
  const params = new URLSearchParams(window.location.search);
  const institutionId = params.get('id') || '1';

  bindLanguageControls(() => {
    if (currentInstitution) renderInstitutionDetails(currentInstitution);
    else renderNotFound();
  });

  try {
    const [institutionResponse, majorsResponse] = await Promise.all([
      fetch('data/institutions.csv'),
      fetch('data/majors.csv'),
    ]);

    if (!institutionResponse.ok || !majorsResponse.ok) {
      throw new Error('Unable to load data files.');
    }

    institutions = parseCSV(await institutionResponse.text());
    majors = parseCSV(await majorsResponse.text());
    currentInstitution = institutions.find((item) => item.id === institutionId);

    if (!currentInstitution) {
      renderNotFound();
      return;
    }

    renderInstitutionDetails(currentInstitution);
  } catch (error) {
    institutionName.removeAttribute('data-i18n');
    institutionDescription.removeAttribute('data-i18n');
    institutionName.textContent = translate('unableLoadDetails');
    institutionDescription.textContent = error.message;
  }
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

loadData();
