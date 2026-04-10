/* ────────────────────────────────
   ユーティリティ
──────────────────────────────── */
const PAGE_SIZE = 12;
let currentLang  = 'ja';
let currentGenre = 'all';
let currentPage  = 1;
let filtered     = [];

/* 言語に応じたdescriptionを返す */
function getDesc(work, lang) {
  if (lang === 'en') return work.description_en || work.description || '';
  if (lang === 'zh') return work.description_zh || work.description || '';
  return work.description || '';
}

/* ファイルパスから動画判定（Videosフォルダ or 拡張子） */
function isVideo(work) {
  return !!(work.video && work.video !== '');
}

/* aspectRatioをCSSクラスに変換 */
function arClass(ar) {
  const map = {'3/4':'ar-3\\/4','4/5':'ar-4\\/5','1/1':'ar-1\\/1','16/9':'ar-16\\/9','21/9':'ar-21\\/9'};
  return map[ar] || 'ar-3\\/4';
}

/* 12カラムレイアウトパターン */
const rowPatterns = [
  [{col:8},{col:4}],
  [{col:4},{col:8}],
  [{col:4},{col:4},{col:4}],
  [{col:12}],
];

/* ────────────────────────────────
   カード生成
──────────────────────────────── */
function makeCard(work) {
  const video   = isVideo(work);
  const src     = work.image || '';
  const title   = work.title || '';
  const desc    = getDesc(work, currentLang);
  const archId  = (work.id || '').toUpperCase().replace(/^W0*/, 'ARCH-');
  const ar      = work.aspectRatio || '3/4';

  const card = document.createElement('div');
  card.className = 'group relative border border-[#4d4637]/40 bg-[#201f1f] overflow-hidden cursor-pointer';
  // aspectRatioをインラインで設定
  card.style.aspectRatio = ar.replace('/','/');

  const media = video
    ? `<video class="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src="${work.video}" muted loop playsinline></video>`
    : `<img class="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src="${src}" alt="${title}"/>`;

  const noteStamp = (work.link && work.link !== '')
    ? `<a class="stamp mt-4" href="${work.link}" target="_blank" onclick="event.stopPropagation()">→ NOTE記事</a>`
    : '';

  const videoBadge = video
    ? `<div class="absolute top-4 right-4 z-20 font-label text-[9px] tracking-widest bg-[#d6baff]/10 text-[#d6baff] border border-[#d6baff]/30 px-2 py-1">VIDEO</div>`
    : '';

  card.innerHTML = `
    ${media}
    ${videoBadge}
    <div class="absolute top-4 left-4 z-20 font-label text-[10px] text-[#e6c364] tracking-widest bg-[#0e0e0e]/80 px-2 py-1">${archId}</div>
    <div class="card-overlay">
      <h3 class="font-headline text-2xl md:text-3xl text-[#e5e2e1] mb-2">${title}</h3>
      <p class="font-body text-xs text-[#d0c5b2] max-w-xs mb-4 leading-relaxed">${desc}</p>
      ${noteStamp}
    </div>`;

  if (video) {
    const vid = card.querySelector('video');
    card.addEventListener('mouseenter', () => vid.play());
    card.addEventListener('mouseleave', () => vid.pause());
  }
  card.addEventListener('click', () => openModal(work));
  return card;
}

/* ────────────────────────────────
   グリッド描画
──────────────────────────────── */
function renderGallery(reset = true) {
  const grid = document.getElementById('gallery-grid');
  if (reset) { grid.innerHTML = ''; currentPage = 1; }

  filtered = works.filter(w => {
    if (currentGenre === 'all')   return true;
    if (currentGenre === 'video') return isVideo(w);
    return w.genre === currentGenre;
  });

  const slice = filtered.slice(0, currentPage * PAGE_SIZE);

  let i = 0, rowIdx = 0;
  while (i < slice.length) {
    const pattern = rowPatterns[rowIdx % rowPatterns.length];
    const use     = pattern.slice(0, Math.min(pattern.length, slice.length - i));
    use.forEach(({col}) => {
      if (i >= slice.length) return;
      const card = makeCard(slice[i]);
      card.classList.add(`md:col-span-${col}`);
      grid.appendChild(card);
      i++;
    });
    rowIdx++;
  }

  const lmw = document.getElementById('load-more-wrap');
  if (filtered.length > currentPage * PAGE_SIZE) {
    lmw.classList.remove('hidden');
    lmw.classList.add('flex');
  } else {
    lmw.classList.add('hidden');
    lmw.classList.remove('flex');
  }

  if (reset && filtered.length > 0) updateHero(filtered[0]);
}

/* ────────────────────────────────
   ヒーロー更新
──────────────────────────────── */
function updateHero(work) {
  const img = document.getElementById('hero-img');
  if (img && !isVideo(work)) img.src = work.image || '';

  const num = (work.id || 'w001').replace(/\D/g,'').padStart(3,'0');
  document.getElementById('hero-number').textContent = `No.${num}`;

  const titleMap = {
    'myth×biomechanical':  'MYTH×BIOMECHANICAL',
    'domestic×mutation':   'DOMESTIC×MUTATION',
    'plants×biomechanical':'PLANTS×BIOMECHANICAL'
  };
  document.getElementById('hero-title').textContent =
    titleMap[work.genre] || 'NAO_BIOMECHANICAL';

  const subMap = {
    ja: '神話と生体機械のアーカイブ：境界線の消失',
    en: 'Mythological relics eroded into biomechanical organs.',
    zh: '神话遗物侵蚀为仿生器官。这座档案库。'
  };
  document.getElementById('hero-sub').textContent = subMap[currentLang];
}

/* ────────────────────────────────
   モーダル
──────────────────────────────── */
function openModal(work) {
  const video  = isVideo(work);
  const src    = work.image || '';
  document.getElementById('modal-media').innerHTML = video
    ? `<video class="w-full h-full object-contain" src="${work.video}" controls autoplay muted loop></video>`
    : `<img class="w-full h-full object-contain" src="${src}" alt=""/>`;

  const archId = (work.id || '').toUpperCase().replace(/^W0*/, 'ARCH-');
  document.getElementById('modal-id').textContent   = `${archId} // ${(work.genre||'').toUpperCase()}`;
  document.getElementById('modal-title').textContent = work.title || '';
  document.getElementById('modal-desc').textContent  = getDesc(work, currentLang);

  const note = document.getElementById('modal-note');
  if (work.link && work.link !== '') {
    note.href = work.link;
    note.style.display = 'inline-block';
  } else {
    note.style.display = 'none';
  }

  document.getElementById('modal-overlay').classList.add('open');
}

document.getElementById('modal-close').addEventListener('click', () =>
  document.getElementById('modal-overlay').classList.remove('open'));
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay'))
    document.getElementById('modal-overlay').classList.remove('open');
});

/* ────────────────────────────────
   フィルター・言語・Load More
──────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.filter-btn[data-genre="${btn.dataset.genre}"]`)
      .forEach(b => b.classList.add('active'));
    currentGenre = btn.dataset.genre;
    renderGallery(true);
  });
});

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLang = btn.dataset.lang;
    renderGallery(true);
  });
});

document.getElementById('load-more-btn').addEventListener('click', () => {
  currentPage++;
  renderGallery(false);
});

/* Init */
renderGallery(true);
