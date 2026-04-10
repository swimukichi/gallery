works.sort((a, b) => {
  const date = w => {
    const src = w.image || w.video || '';
    return (src.match(/(\d{8})[_ ](\d{6})/i) || ['','',''])[1] + (src.match(/(\d{8})[_ ](\d{6})/i) || ['','',''])[2];
  };
  return date(b).localeCompare(date(a));
});
/* =============================================
   DOM 参照
   ============================================= */
const galleryGrid  = document.getElementById('galleryGrid');
const noResults    = document.getElementById('noResults');
const workCount    = document.getElementById('workCount');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const filterBtns   = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';
let currentLang = 'ja';
let lastFocused   = null;

const categoryLabel = {
  illustration: 'Illustration',
  digital:      'Digital',
  concept:      'Concept',
  mixed:        'Mixed Media',
};

/* =============================================
   カード生成
   ============================================= */
function buildCard(work, index) {
  const el = document.createElement('article');
  el.className = 'work-card';
  el.tabIndex  = 0;
  el.dataset.category = work.category;
  el.setAttribute('aria-label', `${work.title} — ${categoryLabel[work.category] ?? work.category}`);
  el.style.animationDelay = `${Math.min(index * 0.03, 0.6)}s`;

  const ratio = work.aspectRatio ?? '3/4';
  const catLabel = categoryLabel[work.category] ?? work.category;

  let mediaHTML = '';
  if (work.youtube) {
    const thumb    = `https://img.youtube.com/vi/${work.youtube}/maxresdefault.jpg`;
    const fallback = `https://img.youtube.com/vi/${work.youtube}/hqdefault.jpg`;
    mediaHTML = `<div class="card-media thumb-wrap" style="aspect-ratio:${ratio}">
      <img src="${thumb}" alt="${work.title}" loading="lazy" onerror="this.src='${fallback}'">
      <div class="play-badge" aria-hidden="true"><div class="play-badge-inner">
        <svg viewBox="0 0 16 16"><polygon points="3,1 15,8 3,15"/></svg>
      </div></div></div>`;
  } else if (work.video) {
    mediaHTML = `<div class="card-media thumb-wrap" style="aspect-ratio:${ratio}">
      <video src="${work.video}" muted playsinline preload="metadata" class="card-video-thumb"></video>
      <div class="play-badge" aria-hidden="true"><div class="play-badge-inner">
        <svg viewBox="0 0 16 16"><polygon points="3,1 15,8 3,15"/></svg>
      </div></div></div>`;
  } else if (work.image) {
    mediaHTML = `<div class="card-media" style="aspect-ratio:${ratio}">
      <img src="${work.image}" alt="${work.title}" loading="lazy">
    </div>`;
  } else {
    mediaHTML = `<div class="card-media" style="aspect-ratio:${ratio};background:#111;display:flex;align-items:center;justify-content:center;">
      <span style="font-family:var(--serif);font-style:italic;font-size:13px;color:#2a2a2a;">${work.title}</span>
    </div>`;
  }

  el.innerHTML = `${mediaHTML}
    <div class="card-bar" aria-hidden="true">
      <span class="card-cat">${catLabel}</span>
      <span class="card-plus">+</span>
    </div>`;

  const cardMedia = el.querySelector('.card-media');
  if (cardMedia) {
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    const desc = currentLang === 'en' ? work.description_en : currentLang === 'zh' ? work.description_zh : work.description;
    overlay.innerHTML = `<span class="card-overlay-title">${work.title}</span>${desc ? `<span class="card-overlay-desc">${desc}</span>` : ''}`;
    cardMedia.appendChild(overlay);
  }

  const open = () => openModal(work, el);
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
  return el;
}

/* =============================================
   グリッド描画
   ============================================= */
function renderGallery(filter = 'all') {
  galleryGrid.innerHTML = '';
  const filtered = filter === 'all' ? works : works.filter(w => w.genre === filter);
  workCount.textContent = filtered.length;
  if (filtered.length === 0) { noResults.hidden = false; return; }
  noResults.hidden = true;
  filtered.forEach((work, i) => galleryGrid.appendChild(buildCard(work, i)));
}

/* =============================================
   フィルター
   ============================================= */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    renderGallery(currentFilter);
  });
});

/* =============================================
   モーダル open
   ============================================= */
function openModal(work, trigger) {
  lastFocused = trigger;
  const mediaEl = document.getElementById('modalMedia');

  if (work.youtube) {
    mediaEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${work.youtube}?autoplay=1&mute=1&rel=0"
      title="${work.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  } else if (work.video) {
    mediaEl.innerHTML = `<video src="${work.video}" controls autoplay muted playsinline></video>`;
  } else if (work.image) {
    mediaEl.innerHTML = `<img src="${work.image}" alt="${work.title}">`;
  } else {
    mediaEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0d0d0d;">
      <span style="font-family:var(--serif);font-style:italic;font-size:18px;color:#333;">${work.title}</span></div>`;
  }

  const tagRow   = document.getElementById('modalTagRow');
  const catLabel = categoryLabel[work.category] ?? work.category;
  tagRow.innerHTML = `<span class="modal-tag is-category">${catLabel}</span>`
    + (work.tags ?? []).map(t => `<span class="modal-tag is-regular">${t}</span>`).join('');

  document.getElementById('modalTitle').textContent       = work.title;
  document.getElementById('modalDescription').textContent = work.description ?? '';

  const dl = document.getElementById('modalDl');
  let dlHTML = '';
  if (work.year)         dlHTML += `<dt>Year</dt><dd>${work.year}</dd>`;
  if (work.tools?.length) dlHTML += `<dt>Tools</dt><dd>${work.tools.join(', ')}</dd>`;
  dl.innerHTML = dlHTML;
  dl.hidden = !dlHTML;

  const linkEl = document.getElementById('modalLink');
  if (work.link) { linkEl.href = work.link; linkEl.hidden = false; }
  else { linkEl.hidden = true; }

  const noteLinkEl = document.getElementById('modalNoteLink');
  if (work.noteUrl) { noteLinkEl.href = work.noteUrl; noteLinkEl.hidden = false; }
  else { noteLinkEl.hidden = true; }

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modalClose.focus());
}

/* =============================================
   モーダル close
   ============================================= */
function closeModal() {
  modalOverlay.classList.remove('is-open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const iframe = modalOverlay.querySelector('iframe');
  if (iframe) iframe.src = '';
  if (lastFocused) { lastFocused.focus(); lastFocused = null; }
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closeModal();
});

modalOverlay.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = [...modalOverlay.querySelectorAll('button:not([disabled]),[href],iframe,[tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* =============================================
   初期化
   ============================================= */
renderGallery('all');
const i18n = {
  ja: {
    logoSub: 'Art & Illustration',
    about1: '日常にあるものが、静かに変質していく。',
    about2: '家電、植物、生活用品——見慣れたものの内側に、',
    about3: '生体機械としての構造を見出し、異形として記録している。',
    aboutSub: 'Biomechanical mutation of everyday objects. Tinged with horror.',
    works: 'WORKS', note: 'NOTE', video: 'VIDEO',
    worksLabel: ' works',
    all: 'All', illustration: 'Illustration', digital: 'Digital',
    concept: 'Concept', mixed: 'Mixed Media',
    latestLog: 'LATEST LOG', magazineLink: 'マガジンを見る ↗',
    videoWorks: 'VIDEO WORKS',
  },
  en: {
    logoSub: 'Art & Illustration',
    about1: 'Everyday objects quietly mutate.',
    about2: 'Appliances, plants, household items——',
    about3: 'I find biomechanical structures within the familiar, and record them as aberrations.',
    aboutSub: 'Biomechanical mutation of everyday objects. Tinged with horror.',
    works: 'WORKS', note: 'NOTE', video: 'VIDEO',
    worksLabel: ' works',
    all: 'All', illustration: 'Illustration', digital: 'Digital',
    concept: 'Concept', mixed: 'Mixed Media',
    latestLog: 'LATEST LOG', magazineLink: 'View Magazine ↗',
    videoWorks: 'VIDEO WORKS',
  },
  zh: {
    logoSub: '艺术 & 插画',
    about1: '日常之物，悄然异变。',
    about2: '家电、植物、生活用品——',
    about3: '在熟悉之物的内部，发现生体机械的构造，以异形之姿记录。',
    aboutSub: '日常之物的生体机械异变。带有恐惧色彩。',
    works: '作品', note: '笔记', video: '影像',
    worksLabel: ' 件',
    all: '全部', illustration: '插画', digital: '数字',
    concept: '概念', mixed: '综合媒材',
    latestLog: '最新日志', magazineLink: '查看杂志 ↗',
    videoWorks: '影像作品',
  },
};

function setLang(lang) {
  currentLang = lang;
  const t = i18n[lang];
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent === lang.toUpperCase()));
  document.querySelector('.logo-sub').textContent = t.logoSub;
  const aboutTexts = document.querySelectorAll('.about-text-line');
  if (aboutTexts.length >= 3) {
    aboutTexts[0].textContent = t.about1;
    aboutTexts[1].textContent = t.about2;
    aboutTexts[2].textContent = t.about3;
  }
  const aboutSub = document.querySelector('.about-sub');
  if (aboutSub) aboutSub.textContent = t.aboutSub;
  document.querySelector('[data-page="works"]').textContent = t.works;
  document.querySelector('[data-page="note"]').textContent = t.note;
  document.querySelector('[data-page="video"]').textContent = t.video;
  document.querySelector('.count-label').textContent = t.worksLabel;
  document.querySelectorAll('.filter-btn').forEach(b => {
    if (b.dataset.filter === 'all') b.textContent = t.all;
  });
  const noteHeading = document.querySelector('.note-heading span');
  if (noteHeading) noteHeading.textContent = t.latestLog;
  const magazineLink = document.querySelector('.note-all-link');
  if (magazineLink) magazineLink.textContent = t.magazineLink;
  const videoHeading = document.querySelector('#page-video .note-heading span');
  if (videoHeading) videoHeading.textContent = t.videoWorks;
  renderGallery(currentFilter);
}

/* =============================================
   VIDEO TAB GALLERY
   ============================================= */
const videoFiles = [
  'Videos/Hf%2020260309%20025641%20C2ba1331-Ed18-4107-B849-8B04b6019a59.mp4',
  'Videos/Hf%2020260309%20031100%2096159Da7-7Ee8-4D73-A2e4-C412fd127096.mp4',
  'Videos/Hf%2020260315%20045226%201390F80d-94E1-46A7-8Bb9-2Cacbd0496f6.mp4',
  'Videos/Hf%2020260315%20063528%20C1d8d360-3Db7-44F1-8Ac6-90Bb50ac4ad7.mp4',
  'Videos/Hf%2020260317%20025515%207402B4c4-C252-4Bef-8834-497Eb42552eb.mp4',
  'Videos/Hf%2020260317%20134305%20A748f81e-52Fb-49Fc-83C2-D1fff647a1e7.mp4',
  'Videos/Hf%2020260317%20221648%20B6cbfd07-8D36-4318-84E5-4E6fbbbf120d.mp4',
  'Videos/Hf%2020260317%20221719%20013D850e-0094-4797-A14d-032121B28c80.mp4',
  'Videos/Hf%2020260321%20050736%209F3293bf-F618-4Da0-9404-Aa3f7f155eeb.mp4',
  'Videos/Hf%2020260321%20122832%209D8fbcbf-1C70-4D28-96A8-7F298f58ea1d.mp4',
  'Videos/Hf%2020260323%20033446%20632A574d-48A7-469D-8300-6A0a57b8ffb0.mp4',
  'Videos/Hf%2020260323%20084237%208Ce9cf90-Ad67-4F2d-A214-77A8ac03ffcb.mp4',
  'Videos/Hf%2020260324%20104000%20D53cbae1-6986-45Fd-92Ed-3Aa9ba557989.mp4',
  'Videos/Hf%2020260326%20024222%200565A8cc-068E-4027-B2f1-3E71b468b266.mp4',
  'Videos/Hf%2020260328%20062010%202Ac39e3e-4C54-40Da-9946-70C6d90693e4.mp4',
  'Videos/Hf%2020260328%20063500%20C85aac1a-Cf21-473C-8Ce6-603F74fb955e.mp4',
  'Videos/Hf%2020260329%20073746%2036345Fe9-Dfb0-4C62-Ac57-6442B57011e5.mp4',
  'Videos/Hf%2020260330%20110629%20606Eea58-7061-46B1-9Ec2-F43347fea5e1.mp4',
  'Videos/Hf%2020260331%20013213%20Dbc167e1-47F6-412E-Bcc1-4B6020117292.mp4',
  'Videos/Hf%2020260331%20064056%20149Fa77d-973C-45F2-8Ad6-814501D55bae.mp4',
  'Videos/Hf%2020260331%20092600%20B7fe5512-048E-493B-A719-6A181e62c546.mp4',
];

(function buildVideoTab() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  videoFiles.forEach(src => {
    const card = document.createElement('div');
    card.className = 'vgallery-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.innerHTML = `
      <div class="vgallery-thumb">
        <video src="${src}" muted playsinline preload="metadata"></video>
        <div class="play-badge" aria-hidden="true"><div class="play-badge-inner">
          <svg viewBox="0 0 16 16"><polygon points="3,1 15,8 3,15"/></svg>
        </div></div>
      </div>`;
    card.addEventListener('click', () => openVModal(src));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVModal(src); } });
    grid.appendChild(card);
  });
})();

const vmodalOverlay = document.getElementById('vmodalOverlay');
const vmodalClose   = document.getElementById('vmodalClose');
const vmodalPlayer  = document.getElementById('vmodalPlayer');

function openVModal(src) {
  vmodalPlayer.src = src;
  vmodalOverlay.setAttribute('aria-hidden', 'false');
  vmodalOverlay.classList.add('is-open');
  vmodalPlayer.play();
  vmodalClose.focus();
}
function closeVModal() {
  vmodalPlayer.pause();
  vmodalPlayer.src = '';
  vmodalOverlay.setAttribute('aria-hidden', 'true');
  vmodalOverlay.classList.remove('is-open');
}
vmodalClose.addEventListener('click', closeVModal);
vmodalOverlay.addEventListener('click', e => { if (e.target === vmodalOverlay) closeVModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && vmodalOverlay.classList.contains('is-open')) closeVModal(); });