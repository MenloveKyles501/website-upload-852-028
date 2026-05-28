(function(){
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  const norm = (s) => (s || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();
  const escapeHtml = (str) => String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  const bindMenu = () => {
    const btn = document.querySelector('[data-menu-btn]');
    const nav = document.querySelector('[data-main-nav]');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => nav.classList.toggle('open'));
  };

  const bindBackTop = () => {
    const btn = document.querySelector('[data-backtop]');
    if (!btn) return;
    const sync = () => {
      const show = window.scrollY > 300;
      btn.style.opacity = show ? '1' : '0';
      btn.style.pointerEvents = show ? 'auto' : 'none';
    };
    btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
    window.addEventListener('scroll', sync);
    sync();
  };

  const bindHeroSlider = () => {
    const root = document.querySelector('[data-hero-slider]');
    if (!root) return;
    const track = root.querySelector('[data-slider-track]');
    const slides = Array.from(root.querySelectorAll('[data-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-slide-dot]'));
    const prev = root.querySelector('[data-slider-prev]');
    const next = root.querySelector('[data-slider-next]');
    if (!track || !slides.length) return;
    let index = 0;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, n) => d.classList.toggle('active', n === index));
    };
    dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
    prev && prev.addEventListener('click', () => show(index - 1));
    next && next.addEventListener('click', () => show(index + 1));
    setInterval(() => show(index + 1), 5200);
    show(0);
  };

  const bindSearchFilter = () => {
    const input = document.querySelector('[data-search-input]');
    const cards = Array.from(document.querySelectorAll('[data-card]'));
    if (!input || !cards.length) return;
    const apply = () => {
      const q = norm(input.value);
      let visible = 0;
      cards.forEach((card) => {
        const hay = norm(card.dataset.search || card.textContent || '');
        const show = !q || hay.includes(q);
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      const count = document.querySelector('[data-result-count]');
      if (count) count.textContent = String(visible);
    };
    input.addEventListener('input', apply);
    apply();
  };

  const bindTabs = () => {
    document.querySelectorAll('[data-tabs]').forEach((wrap) => {
      const tabs = Array.from(wrap.querySelectorAll('[data-tab]'));
      const panels = Array.from(wrap.querySelectorAll('[data-panel]'));
      const activate = (name) => {
        tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
        panels.forEach((p) => p.hidden = p.dataset.panel !== name);
      };
      tabs.forEach((t) => t.addEventListener('click', () => activate(t.dataset.tab)));
      if (tabs[0]) activate(tabs[0].dataset.tab);
    });
  };

  const bindPlayer = () => {
    document.querySelectorAll('[data-player]').forEach((root) => {
      const video = root.querySelector('video');
      const btn = root.querySelector('[data-player-play]');
      const badge = root.querySelector('[data-player-badge]');
      if (!video) return;
      const mp4 = video.dataset.mp4;
      const hls = video.dataset.hls;
      const setSource = () => {
        if (hls && window.Hls && window.Hls.isSupported()) {
          const h = new window.Hls({enableWorker:true});
          h.loadSource(hls);
          h.attachMedia(video);
          h.on(window.Hls.Events.ERROR, () => { if (mp4) video.src = mp4; });
        } else if (hls && video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = hls;
        } else if (mp4) {
          video.src = mp4;
        }
      };
      setSource();
      const toggle = () => { if (video.paused) { video.play().catch(()=>{}); } else { video.pause(); } };
      btn && btn.addEventListener('click', toggle);
      video.addEventListener('click', toggle);
      video.addEventListener('play', () => { if (badge) badge.textContent = '播放中'; });
      video.addEventListener('pause', () => { if (badge) badge.textContent = '已暂停'; });
      video.addEventListener('ended', () => { if (badge) badge.textContent = '播放结束'; });
    });
  };

  const renderSearch = () => {
    const mount = document.querySelector('[data-search-mount]');
    const dataEl = document.getElementById('movies-data');
    if (!mount || !dataEl) return;
    const movies = JSON.parse(dataEl.textContent || '[]');
    const pageSize = Number(mount.dataset.pageSize || 48);
    const state = { q: '', sort: 'score', page: 1 };
    const readState = () => {
      const input = document.querySelector('[data-search-input]');
      const select = document.querySelector('[data-sort-select]');
      if (input) state.q = input.value;
      if (select) state.sort = select.value;
    };
    const getItems = () => {
      const q = norm(state.q);
      let arr = movies.filter((m) => !q || norm([m.title,m.region,m.type,m.year,m.genre,m.tags.join(' '),m.one_line,m.summary,m.review].join(' ')).includes(q));
      arr.sort((a,b) => state.sort === 'year' ? (Number(b.year)||0)-(Number(a.year)||0) || (b.score||0)-(a.score||0) : (b.score||0)-(a.score||0));
      return arr;
    };
    const render = () => {
      readState();
      const items = getItems();
      const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
      state.page = Math.min(state.page, totalPages);
      const slice = items.slice((state.page - 1) * pageSize, state.page * pageSize);
      mount.innerHTML = slice.map((m) => `
        <a class="movie-card" data-card href="${m.link}" data-search="${escapeHtml([m.title,m.region,m.type,m.year,m.genre,m.tags.join(' '),m.one_line,m.summary,m.review].join(' '))}">
          <div class="movie-thumb">
            <div class="poster" style="--c1:${m.c1};--c2:${m.c2};--c3:${m.c3}">
              <div class="poster-inner">
                <div class="label">精选电影大全</div>
                <div class="title">${escapeHtml(m.title)}</div>
                <div class="meta">${escapeHtml(m.type)} · ${escapeHtml(m.year)}</div>
              </div>
            </div>
            <span class="year-badge">${escapeHtml(m.year)}</span>
          </div>
          <div class="movie-body">
            <h3 class="movie-title line-clamp-2">${escapeHtml(m.title)}</h3>
            <div class="movie-meta"><span>${escapeHtml(m.type)}</span><span>${escapeHtml(m.region)}</span></div>
            <div class="movie-tags">${(m.genres || []).slice(0,3).map((g) => `<span class="tag">${escapeHtml(g)}</span>`).join('')}</div>
          </div>
        </a>`).join('');
      const pager = document.querySelector('[data-search-pager]');
      if (pager) {
        const buttons = [];
        const maxShow = 9;
        const start = Math.max(1, state.page - Math.floor(maxShow/2));
        const end = Math.min(totalPages, start + maxShow - 1);
        buttons.push(`<button class="page-btn" data-go="${Math.max(1, state.page - 1)}">上一页</button>`);
        for (let i = start; i <= end; i++) buttons.push(`<button class="page-btn ${i===state.page?'active':''}" data-go="${i}">${i}</button>`);
        buttons.push(`<button class="page-btn" data-go="${Math.min(totalPages, state.page + 1)}">下一页</button>`);
        pager.innerHTML = buttons.join('');
        pager.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { state.page = Number(b.dataset.go); render(); window.scrollTo({top:0, behavior:'smooth'}); }));
      }
      const count = document.querySelector('[data-search-counter]');
      if (count) count.textContent = String(items.length);
      const info = document.querySelector('[data-search-pageinfo]');
      if (info) info.textContent = `${state.page}/${totalPages}`;
      const empty = document.querySelector('[data-search-empty]');
      if (empty) empty.hidden = items.length !== 0;
    };
    const input = document.querySelector('[data-search-input]');
    const select = document.querySelector('[data-sort-select]');
    input && input.addEventListener('input', () => { state.page = 1; render(); });
    select && select.addEventListener('change', () => { state.page = 1; render(); });
    render();
  };

  ready(() => {
    bindMenu();
    bindBackTop();
    bindHeroSlider();
    bindSearchFilter();
    bindTabs();
    bindPlayer();
    renderSearch();
  });
})();
