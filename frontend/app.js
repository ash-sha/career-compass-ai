const organisations = [
  { code: 'SSC', name: 'Staff Selection Commission', detail: 'Central government recruitment across examination families and ministries.', status: 'CONNECTED', source: 'ssc.gov.in' },
  { code: 'UPSC', name: 'Union Public Service Commission', detail: 'Civil services and specialist central-government recruitment.', status: 'QUEUED', source: 'upsc.gov.in' },
  { code: 'IBPS', name: 'Banking recruitment', detail: 'Public-sector bank and regional rural bank examinations.', status: 'QUEUED', source: 'ibps.in' },
  { code: 'RRB', name: 'Railway Recruitment Boards', detail: 'Indian Railways technical, operational and administrative roles.', status: 'QUEUED', source: 'indianrailways.gov.in' },
  { code: 'PSU', name: 'Public sector undertakings', detail: 'Engineering, management and specialist roles in public enterprises.', status: 'QUEUED', source: 'official PSU portals' }
];

const notices = {
  SSC: [
    { title: 'Combined Graduate Level Examination, 2026', kind: 'Recruitment notification', state: 'Open soon', meta: 'Graduate · Multiple ministries · Official SSC source' },
    { title: 'Junior Engineer Examination, 2026', kind: 'Recruitment notification', state: 'Open soon', meta: 'Engineering roles · Civil / Mechanical / Electrical' },
    { title: 'Selection Post Examination, Phase XIV, 2026', kind: 'Recruitment notification', state: 'Open soon', meta: 'Role-specific requirements · Multiple departments' },
    { title: 'Tentative Vacancies of Junior Engineer Examination, 2026', kind: 'Vacancy update', state: 'Indexed', meta: 'Use with the linked recruitment cycle' }
  ],
  UPSC: [{ title: 'Source connection planned', kind: 'Organisation set-up', state: 'Queued', meta: 'The frontend is ready for an official source connector.' }],
  IBPS: [{ title: 'Source connection planned', kind: 'Organisation set-up', state: 'Queued', meta: 'The frontend is ready for an official source connector.' }],
  RRB: [{ title: 'Source connection planned', kind: 'Organisation set-up', state: 'Queued', meta: 'The frontend is ready for an official source connector.' }],
  PSU: [{ title: 'Source connection planned', kind: 'Organisation set-up', state: 'Queued', meta: 'Add PSU organisations and careers-page connectors next.' }]
};

const matchTemplates = [
  { role: 'SSC CGL 2026', org: 'Staff Selection Commission', tags: ['Graduate', 'Central government', 'Multiple roles'], score: 'Profile needed' },
  { role: 'SSC Selection Post XIV', org: 'Staff Selection Commission', tags: ['Role specific', 'Multiple departments', 'Official source'], score: 'Profile needed' },
  { role: 'Junior Engineer 2026', org: 'Staff Selection Commission', tags: ['Engineering', 'Technical roles', 'Pay level varies'], score: 'Profile needed' }
];

const profile = JSON.parse(localStorage.getItem('sarkariPathProfile') || 'null');
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function qualificationLabel(value) {
  return { '10th': '10th', '12th': '12th', diploma: 'Diploma', graduate: "Bachelor's degree", postgraduate: 'Postgraduate degree' }[value] || value;
}

function renderOrganisations() {
  $('#organisationCards').innerHTML = organisations.map(org => `
    <article class="organisation-card" data-org="${org.code}">
      <span class="org-code">${org.code} · ${org.status}</span>
      <h3>${org.name}</h3>
      <p>${org.detail}</p>
    </article>`).join('');
  $$('.organisation-card').forEach(card => card.addEventListener('click', () => openOrganisation(card.dataset.org)));
}

function renderMatches() {
  const hasProfile = Boolean(profile && profile.name);
  $('#matchCount').textContent = hasProfile ? '03' : '—';
  $('#matchCards').innerHTML = matchTemplates.map((match, index) => {
    const score = hasProfile ? ['Potential match', 'Review profile', 'Specialist route'][index] : match.score;
    return `<article class="match-card"><span class="match-score">${score}</span><p>${match.org}</p><h3>${match.role}</h3><div class="match-meta">${match.tags.map(tag => `<span class="tag ${tag === 'Graduate' ? 'open' : ''}">${tag}</span>`).join('')}</div></article>`;
  }).join('');
}

function renderProfile() {
  if (!profile || !profile.name) {
    $('#profileSummary').innerHTML = `<p class="eyebrow">NOT STARTED</p><h2>Your profile helps us explain eligibility.</h2><p class="dialog-copy">Add your age, category, qualification, discipline, and location. The prototype uses these only in this browser.</p><button class="primary-button" id="profileEmptyAction">Build my profile →</button>`;
    $('#profileEmptyAction').addEventListener('click', openProfileDialog);
    return;
  }
  $('#profileSummary').innerHTML = `<p class="eyebrow">PROFILE SAVED LOCALLY</p><h2>${profile.name}'s eligibility profile</h2><div class="profile-summary-grid"><div><small>Age</small><b>${profile.age} years</b></div><div><small>Category</small><b>${profile.category}</b></div><div><small>Qualification</small><b>${qualificationLabel(profile.qualification)}</b></div><div><small>Discipline</small><b>${profile.stream}</b></div></div><div style="margin-top:25px"><button class="outline-button" id="editProfile">Edit profile</button></div>`;
  $('#editProfile').addEventListener('click', openProfileDialog);
}

function updateProfileUI() {
  if (profile && profile.name) {
    $('#profileName').textContent = profile.name;
    $('#avatarInitial').textContent = profile.name[0].toUpperCase();
    $('#openProfileTop').textContent = 'View profile';
  }
  renderMatches();
  renderProfile();
}

function openOrganisation(code) {
  $('#organisationSelect').value = code;
  switchView('explore');
  renderOrganisation(code);
}

function renderOrganisation(code) {
  const org = organisations.find(item => item.code === code);
  const orgNotices = notices[code];
  $('#organisationBrief').innerHTML = `<h2>${org.name}</h2><p>${org.detail} <strong>Source:</strong> ${org.source}. This screen uses prototype data until each official connector is added.</p>`;
  $('#noticeTitle').textContent = `${org.code} notices and opportunities`;
  $('#noticeList').innerHTML = orgNotices.map(notice => `<article class="notice-row"><div><p>${notice.kind} · <span class="tag ${notice.state === 'Open soon' ? 'open' : ''}">${notice.state}</span></p><h3>${notice.title}</h3><p>${notice.meta}</p></div><button class="notice-action" data-title="${notice.title}">View details →</button></article>`).join('');
  $$('.notice-action').forEach(button => button.addEventListener('click', () => openAssistantWith(`Tell me about ${button.dataset.title}`)));
}

function switchView(viewName) {
  $$('.view').forEach(view => view.classList.toggle('active', view.id === viewName));
  $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === viewName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openProfileDialog() {
  const dialog = $('#profileDialog');
  if (profile) {
    $('#fullName').value = profile.name || '';
    $('#age').value = profile.age || '';
    $('#location').value = profile.location || '';
    $('#category').value = profile.category || 'UR';
    $('#qualification').value = profile.qualification || 'graduate';
    $('#stream').value = profile.stream || '';
    $('#marks').value = profile.marks || '';
    $('#gateScore').value = profile.gateScore || '';
  }
  dialog.showModal();
}

function openAssistantWith(question = '') {
  $('#assistantDialog').showModal();
  if (question) {
    $('#assistantQuestion').value = question;
    $('#assistantForm').requestSubmit();
  }
}

function mockAnswer(question) {
  const text = question.toLowerCase();
  if (text.includes('ssc') || text.includes('graduate')) return 'For the prototype, SSC CGL and Selection Post are shown as potential graduate routes. The production answer will be generated from official notification requirements, with page-level citations.';
  if (text.includes('eligib') || text.includes('age')) return 'Eligibility will be calculated from your saved profile against structured official rules: age, category relaxation, education, discipline, and any role-specific conditions.';
  return 'Compass AI will eventually retrieve only official, indexed notification evidence. Right now this is an interaction mock showing where the RAG assistant will sit.';
}

$$('.nav-item').forEach(item => item.addEventListener('click', () => switchView(item.dataset.view)));
$$('[data-view-target]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.viewTarget)));
$('#openProfile').addEventListener('click', openProfileDialog);
$('#openProfileTop').addEventListener('click', () => profile && profile.name ? switchView('profile') : openProfileDialog());
$('#buildProfile').addEventListener('click', openProfileDialog);
$('#openAssistant').addEventListener('click', () => openAssistantWith());
$('#closeAssistant').addEventListener('click', () => $('#assistantDialog').close());
$('#organisationSelect').innerHTML = organisations.map(org => `<option value="${org.code}">${org.code} — ${org.name}</option>`).join('');
$('#organisationSelect').addEventListener('change', event => renderOrganisation(event.target.value));
$('#statusSelect').addEventListener('change', () => {});
$('#profileForm').addEventListener('submit', event => {
  event.preventDefault();
  const updated = { name: $('#fullName').value.trim(), age: $('#age').value, location: $('#location').value.trim(), category: $('#category').value, qualification: $('#qualification').value, stream: $('#stream').value.trim(), marks: $('#marks').value.trim(), gateScore: $('#gateScore').value.trim() };
  localStorage.setItem('sarkariPathProfile', JSON.stringify(updated));
  Object.assign(profile || {}, updated);
  window.location.reload();
});
$('#assistantForm').addEventListener('submit', event => {
  event.preventDefault();
  const question = $('#assistantQuestion').value.trim();
  if (!question) return;
  $('#assistantMessages').insertAdjacentHTML('beforeend', `<div class="user-message">${question.replace(/[<>]/g, '')}</div>`);
  $('#assistantMessages').insertAdjacentHTML('beforeend', `<div class="bot-message">${mockAnswer(question)}</div>`);
  $('#assistantQuestion').value = '';
  $('#assistantMessages').scrollTop = $('#assistantMessages').scrollHeight;
});

renderOrganisations();
renderMatches();
renderProfile();
renderOrganisation('SSC');
