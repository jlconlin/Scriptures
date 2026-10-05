// Line upon Line — small progressive enhancements. The site works without JavaScript
// (notes are ordinary HTML); scripts add toggling, filters, preferences, and search.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const root = document.documentElement;
  root.classList.add('js');

  // ---------- theme ----------
  $('.theme-toggle')?.addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  });

  // ---------- Scriptures menu ----------
  // The header's <details class="scripture-menu"> holds the five volumes and the books on the site
  // (data-nav) and where this page is (data-here). Wide screens get three columns: volume, book,
  // chapters. With a mouse, pointing at a volume or book opens its column and clicking goes to its
  // page; on a touch screen the first tap opens the column and a second tap goes to the page.
  // Narrow screens get one column at a time with a back button.
  const sm = $('.scripture-menu');
  if (sm) {
    const nav = JSON.parse(sm.dataset.nav);
    const here = JSON.parse(sm.dataset.here);
    const panel = $('.menu-panel', sm);
    const summary = $('summary', sm);
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const url = (p) => `${sm.dataset.root}${p}${sm.dataset.index}`; // a site path such as isaiah/53/
    const svg = (d, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="${d}"/></svg>`;
    const chev = svg('m9 6 6 6-6 6', 'chev');
    const back = svg('m15 6-6 6 6 6');
    const count = (b) => b.written.reduce((n, [x, y]) => n + y - x + 1, 0);
    const isWritten = (b, n) => b.written.some(([x, y]) => n >= x && n <= y);
    const volOf = (slug) => nav.find((v) => v.slug === slug);
    const bookOf = (v, slug) => v?.books.find((b) => b.slug === slug);

    const state = { vol: null, book: null, level: 'vol', picked: {} };
    let scrollHere = false;
    const shown = {};
    const reset = () => {
      state.vol = here.vol ?? nav.find((v) => v.books.length)?.slug ?? nav[0].slug;
      state.book = here.book ?? state.picked[state.vol] ?? null;
      if (here.book) state.picked[here.vol] = here.book;
      state.level = here.book ? 'ch' : here.vol ? 'book' : 'vol';
      scrollHere = true;
    };

    const volSub = (v) => (v.books.length ? `${v.books.length} book${v.books.length === 1 ? '' : 's'}` : 'Not on the site yet');
    const about = `<a class="menu-item menu-about" href="${url('about/')}"><span class="name">About this site</span></a>`;
    const volCol = (drill) =>
      `<div class="menu-col menu-vol">${drill ? '' : '<p class="menu-head">Scriptures</p>'}${nav
        .map((v) => `<button type="button" class="menu-item vol${v.books.length ? '' : ' absent'}" data-vol="${v.slug}" style="--vc:var(--v-${v.slug})"${v.slug === state.vol && !drill ? ' aria-current="true"' : ''}><span class="dot"></span><span class="name">${esc(v.name)}<small>${volSub(v)}</small></span>${chev}</button>`)
        .join('')}${about}</div>`;
    const volLink = (v, drill) => `<a href="${url(`${v.slug}/`)}" class="page-link ${drill ? 'drill-page' : 'menu-head'}">${esc(v.name)}${drill ? ' page' : ''} ${chev}</a>`;
    const bookCol = (drill) => {
      const v = volOf(state.vol);
      if (!v) return '';
      if (!v.books.length)
        return `<div class="menu-col menu-book" style="--vc:var(--v-${v.slug})">${volLink(v, drill)}<p class="menu-empty">Nothing from the ${esc(v.name)} is on the site yet.</p><a class="menu-link" href="${v.gl}" target="_blank" rel="noopener">Read it in the Gospel Library ↗</a></div>`;
      return `<div class="menu-col menu-book" style="--vc:var(--v-${v.slug})">${volLink(v, drill)}${v.books
        .map((b) => {
          const w = count(b);
          return `<button type="button" class="menu-item${b.slug === here.book ? ' here' : ''}" data-book="${b.slug}"${b.slug === state.book && !drill ? ' aria-current="true"' : ''}><span class="name">${esc(b.name)}</span><span class="sub">${w < b.total ? `${w} of ${b.total}` : b.total}</span>${chev}</button>`;
        })
        .join('')}</div>`;
    };
    const chCol = () => {
      const v = volOf(state.vol);
      const b = bookOf(v, state.book);
      if (!b) return v?.books.length ? `<div class="menu-col menu-ch"><div class="menu-pick"><strong>${esc(v.name)}</strong><span>Choose a book to see its chapters.</span></div></div>` : '<div class="menu-col menu-ch"></div>';
      const w = count(b);
      const cells = Array.from({ length: b.total }, (_, i) => {
        const n = i + 1;
        const cur = b.slug === here.book && n === here.ch;
        return isWritten(b, n)
          ? `<a class="cell written${cur ? ' current' : ''}" href="${url(`${b.slug}/${n}/`)}"${cur ? ' aria-current="page"' : ''}>${n}</a>`
          : `<a class="cell unwritten" href="${b.gl}/${n}?lang=eng" target="_blank" rel="noopener" aria-label="${esc(b.name)} ${n}, in the Gospel Library">${n}</a>`;
      }).join('');
      return `<div class="menu-col menu-ch" style="--vc:var(--v-${v.slug})">
        <div class="menu-bookhead"><h3><a href="${url(`${b.slug}/`)}">${esc(b.name)} ${chev}</a></h3>
          <span class="status">${w < b.total ? `Commentary on ${w} of ${b.total} chapters` : `${b.total} chapters`}</span>
          ${b.guides || b.themes ? `<span class="links">${b.guides ? `<a href="${url(`${b.slug}/guides/`)}">Guides</a>` : ''}${b.themes ? `<a href="${url(`${b.slug}/themes/`)}">Themes</a>` : ''}</span>` : ''}
        </div>
        <div class="menu-grid">${cells}</div>
        ${w < b.total ? '<div class="menu-legend"><span><i class="lw"></i>Commentary</span><span><i class="lu"></i>Opens the Gospel Library</span></div>' : ''}
      </div>`;
    };

    const narrow = () => innerWidth < 640;
    const render = () => {
      if (!sm.open) return;
      const saved = {};
      $$('.menu-col', panel).forEach((c) => { saved[c.classList[1]] = c.scrollTop; });
      const top = $('.site-header').getBoundingClientRect().bottom + 6;
      panel.style.top = `${top}px`;
      panel.style.maxHeight = `${innerHeight - top - 12}px`;
      if (!narrow()) {
        panel.className = 'menu-panel';
        const fit = Math.min(1, (innerWidth - 18) / 722);
        panel.style.setProperty('--w-vol', `${Math.round(212 * fit)}px`);
        panel.style.setProperty('--w-book', `${Math.round(204 * fit)}px`);
        panel.style.setProperty('--w-ch', `${Math.round(304 * fit)}px`);
        panel.innerHTML = volCol(false) + bookCol(false) + chCol();
        // Fade in only the columns whose contents changed.
        for (const [cls, key] of Object.entries({ 'menu-book': state.vol, 'menu-ch': `${state.vol}/${state.book}` })) {
          if (shown[cls] !== undefined && shown[cls] !== key) $(`.${cls}`, panel)?.classList.add('menu-fade');
          shown[cls] = key;
        }
        // Line the panel's right edge up with the button's; pin it to the left edge if it won't fit.
        const right = Math.max(8, innerWidth - summary.getBoundingClientRect().right);
        panel.style.right = `${right}px`;
        panel.style.left = '';
        if (panel.offsetWidth + right > innerWidth - 8) { panel.style.left = '8px'; panel.style.right = 'auto'; }
      } else {
        panel.className = 'menu-panel drill';
        panel.style.left = panel.style.right = '';
        const v = volOf(state.vol);
        let bar, body;
        if (state.level === 'vol' || !v) {
          bar = '<p class="menu-head">Scriptures</p>';
          body = volCol(true);
        } else if (state.level === 'book' || !bookOf(v, state.book)) {
          bar = `<button type="button" class="menu-back" data-back="vol">${back}Scriptures</button><span class="menu-trail">${esc(v.name)}</span>`;
          body = bookCol(true);
        } else {
          bar = `<button type="button" class="menu-back" data-back="book">${back}${esc(v.name)}</button>`;
          body = chCol();
        }
        panel.innerHTML = `<div class="menu-drillbar">${bar}</div>${body}`;
      }
      $$('.menu-col', panel).forEach((c) => {
        if (scrollHere) {
          const cur = $('[aria-current="true"], .here', c);
          if (cur) c.scrollTop = cur.offsetTop - c.clientHeight / 3;
        } else if (saved[c.classList[1]] != null) c.scrollTop = saved[c.classList[1]];
      });
      scrollHere = false;
    };

    const choose = (it) => {
      if (it.dataset.vol) {
        if (state.vol !== it.dataset.vol) state.book = state.picked[it.dataset.vol] ?? null;
        state.vol = it.dataset.vol;
        state.level = 'book';
      } else {
        state.book = it.dataset.book;
        state.picked[state.vol] = state.book;
        state.level = 'ch';
      }
      render();
    };
    const go = (it) => { location.href = url(`${it.dataset.vol ?? it.dataset.book}/`); };

    // Pointing with a mouse opens a column at once, except while the pointer is heading toward the
    // column on the right; then it waits briefly so the items it crosses don't take over.
    let hoverTimer, last = null, prev = null;
    panel.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { prev = last; last = { x: e.clientX, y: e.clientY }; } });
    const headingRight = (col) => {
      const next = col?.nextElementSibling;
      if (!next || !prev || !last || last.x <= prev.x) return false;
      const r = next.getBoundingClientRect();
      const slope = (p, q) => (q.y - p.y) / (q.x - p.x);
      const moving = slope(prev, last);
      return moving > slope(last, { x: r.left, y: r.top }) && moving < slope(last, { x: r.left, y: r.bottom });
    };
    const hover = (it) => {
      clearTimeout(hoverTimer);
      const same = it.dataset.vol ? state.vol === it.dataset.vol : state.book === it.dataset.book;
      if (same) return;
      if (!headingRight(it.closest('.menu-col'))) return choose(it);
      const at = last;
      hoverTimer = setTimeout(() => (last === at ? choose(it) : hover(it)), 100);
    };
    panel.addEventListener('pointerover', (e) => {
      if (e.pointerType !== 'mouse' || narrow()) return;
      clearTimeout(hoverTimer);
      const it = e.target.closest('[data-vol],[data-book]');
      if (it) hover(it);
    });
    panel.addEventListener('pointerleave', () => clearTimeout(hoverTimer));

    // If pointing redraws the menu between button-down and button-up, the click lands on the panel,
    // not the item; remember which item the button went down on.
    let lastPointer = 'mouse', downItem = null;
    panel.addEventListener('pointerdown', (e) => {
      lastPointer = e.pointerType;
      const it = e.target.closest('[data-vol],[data-book]');
      downItem = it ? { dataset: { ...it.dataset } } : null;
    });
    panel.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') lastPointer = 'keyboard'; });
    panel.addEventListener('click', (e) => {
      const backBtn = e.target.closest('[data-back]');
      if (backBtn) { state.level = backBtn.dataset.back; scrollHere = true; render(); return; }
      const it = e.target.closest('[data-vol],[data-book]') ?? (e.target.closest('a') ? null : downItem);
      downItem = null;
      if (it) {
        clearTimeout(hoverTimer);
        const selected = it.dataset.vol ? state.vol === it.dataset.vol : state.book === it.dataset.book;
        if (!narrow() && (lastPointer === 'mouse' || selected)) go(it);
        else choose(it);
        return;
      }
      // Any link closes the menu (Gospel Library links open in a new tab and leave this page here).
      if (e.target.closest('a')) sm.open = false;
    });

    sm.addEventListener('toggle', () => { if (sm.open) { reset(); render(); } });
    document.addEventListener('click', (e) => {
      // A click inside the menu can redraw it, leaving e.target detached; that is not an outside click.
      if (sm.open && e.target.isConnected && !sm.contains(e.target)) sm.open = false;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sm.open) { sm.open = false; summary.focus(); }
    });
    addEventListener('resize', render);

    // ---------- home page library ----------
    // The same volumes, books, and chapters as the menu, open on the home page (.picker; its data-books
    // has each book's blurb). Here a click only selects; the names at the top of each column are the
    // links. Under 640px it is a list of volumes and books, and a book opens its chapters in place.
    const pk = $('.picker');
    if (pk) {
      const info = JSON.parse(pk.dataset.books);
      const volWith = (slug) => nav.find((v) => bookOf(v, slug));
      const wide = () => pk.clientWidth >= 640;
      const firstVol = nav.find((v) => v.books.length) ?? nav[0];
      const remembered = volWith(store.get('library'));
      const ps = remembered
        ? { vol: remembered.slug, book: store.get('library') }
        : { vol: firstVol.slug, book: wide() ? firstVol.books[0]?.slug ?? null : null };
      const picked = { [ps.vol]: ps.book };

      const pane = (v, b) => {
        const w = count(b);
        const cells = Array.from({ length: b.total }, (_, i) => {
          const n = i + 1;
          return isWritten(b, n)
            ? `<a class="cell written" href="${url(`${b.slug}/${n}/`)}" aria-label="${esc(b.name)} ${n}">${n}</a>`
            : `<a class="cell unwritten" href="${b.gl}/${n}?lang=eng" target="_blank" rel="noopener" aria-label="${esc(b.name)} ${n}, in the Gospel Library">${n}</a>`;
        }).join('');
        return `<div class="picker-pane" style="--vc:var(--v-${v.slug})">
          <div class="picker-bookhead"><h3><a href="${url(`${b.slug}/`)}">${esc(b.name)} ${chev}</a></h3>
            <p>${esc(info[b.slug]?.blurb ?? '')}</p>
            <span class="links"><span>${w < b.total ? `Commentary on ${w} of ${b.total} chapters` : `${b.total} chapters`}</span><a href="${url(`${b.slug}/`)}">Open ${esc(b.name)}</a>${b.guides ? `<a href="${url(`${b.slug}/guides/`)}">Guides</a>` : ''}${info[b.slug]?.themes ? `<a href="${url(`${b.slug}/themes/`)}">Themes</a>` : ''}</span>
          </div>
          <div class="menu-grid">${cells}</div>
          ${w < b.total ? '<div class="menu-legend"><span><i class="lw"></i>Commentary</span><span><i class="lu"></i>Opens the Gospel Library</span></div>' : ''}
        </div>`;
      };
      const bookItem = (b, attr) => {
        const w = count(b);
        return `<button type="button" class="menu-item" data-book="${b.slug}" ${attr}><span class="name">${esc(b.name)}</span><span class="sub">${w < b.total ? `${w} of ${b.total}` : b.total}</span>${chev}</button>`;
      };
      const empty = (v) => `<p class="menu-empty">Nothing from the ${esc(v.name)} is on the site yet.</p><a class="menu-link" href="${v.gl}" target="_blank" rel="noopener">Read it in the Gospel Library ↗</a>`;

      let drawn = null;
      const draw = () => {
        const focus = document.activeElement?.closest?.('.picker [data-vol], .picker [data-book]')?.dataset;
        const v = volOf(ps.vol);
        const b = bookOf(v, ps.book);
        if (wide()) {
          pk.innerHTML = `<div class="picker-cols">
            <div class="picker-col">${nav
              .map((x) => `<button type="button" class="menu-item${x.books.length ? '' : ' absent'}" data-vol="${x.slug}" style="--vc:var(--v-${x.slug})"${x === v ? ' aria-current="true"' : ''}><span class="dot"></span><span class="name">${esc(x.name)}<small>${volSub(x)}</small></span>${chev}</button>`)
              .join('')}</div>
            <div class="picker-col"><a href="${url(`${v.slug}/`)}" class="page-link menu-head">${esc(v.name)} ${chev}</a>${v.books.length ? v.books.map((x) => bookItem(x, x === b ? 'aria-current="true"' : '')).join('') : empty(v)}</div>
            <div class="picker-col">${b ? pane(v, b) : v.books.length ? `<div class="menu-pick"><strong>${esc(v.name)}</strong><span>Choose a book to see its chapters.</span></div>` : ''}</div>
          </div>`;
        } else {
          pk.innerHTML = `<div class="picker-list">${nav
            .map((x) => `<div class="picker-vol" style="--vc:var(--v-${x.slug})"><h3><span class="dot"></span><a href="${url(`${x.slug}/`)}">${esc(x.name)}</a></h3>${x.books.length ? x.books.map((y) => bookItem(y, `aria-expanded="${y === b}"`) + (y === b ? pane(x, y) : '')).join('') : empty(x)}</div>`)
            .join('')}</div>`;
        }
        drawn = wide();
        if (focus) $(focus.vol ? `[data-vol="${focus.vol}"]` : `[data-book="${focus.book}"]`, pk)?.focus();
      };
      pk.addEventListener('click', (e) => {
        const it = e.target.closest('[data-vol],[data-book]');
        if (!it) return;
        if (it.dataset.vol) {
          ps.vol = it.dataset.vol;
          ps.book = picked[ps.vol] ?? volOf(ps.vol).books[0]?.slug ?? null;
        } else {
          const open = !wide() && ps.book === it.dataset.book;
          ps.vol = volWith(it.dataset.book).slug;
          ps.book = open ? null : it.dataset.book;
        }
        picked[ps.vol] = ps.book;
        if (ps.book) store.set('library', ps.book);
        draw();
      });
      addEventListener('resize', () => { if (wide() !== drawn) draw(); });
      draw();
    }

    // ---------- home page teasers ----------
    // “Show three more” replaces the three note cards chosen when the site was built with three
    // others. notes.json has every note and is fetched on the first click. The cards are the same
    // markup as renderHome's; each kind's chip comes from a <template class="teaser-chip">.
    const more = $('.teasers-more');
    const teasers = $('.teasers');
    if (more && teasers) {
      const chips = Object.fromEntries($$('template.teaser-chip').map((t) => [t.dataset.kind, t.innerHTML]));
      const href = (n) => `${url(`${n.b}/${n.c}/`)}#${n.i}`;
      const card = (n) =>
        `<a class="teaser k-${n.k}" href="${href(n)}">${chips[n.k]}<span class="teaser-phrase">“${esc(n.p)}”</span><span class="teaser-ref">${esc(n.n)} ${n.c}:${n.r}</span><span class="teaser-text">${esc(n.x)}…</span></a>`;
      let notes = null;
      const load = async () => {
        const res = await fetch(`${sm.dataset.root}notes.json`);
        if (!res.ok) throw new Error(res.status);
        // The same choice the build makes: notes with a short phrase.
        return (await res.json()).flatMap((b) => b.notes.filter((n) => n.p && n.p.length < 60 && chips[n.k]).map((n) => ({ ...n, b: b.b, n: b.n })));
      };
      more.hidden = false;
      more.addEventListener('click', async () => {
        try {
          notes ??= await load();
        } catch {
          more.hidden = true; // the cards from the build stay
          return;
        }
        const showing = $$('.teaser', teasers).map((a) => a.getAttribute('href'));
        const pool = notes.filter((n) => !showing.includes(href(n)));
        const picks = [];
        while (picks.length < 3 && pool.length) picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        if (picks.length) teasers.innerHTML = picks.map(card).join('\n    ');
      });
    }
  }

  // ---------- reading progress ----------
  const readKey = (id) => `read:${id}`;
  const isRead = (id) => store.get(readKey(id)) === '1';
  $$('[data-read]').forEach((box) => {
    box.checked = isRead(box.dataset.read);
    box.addEventListener('change', () => {
      box.checked ? store.set(readKey(box.dataset.read), '1') : store.del(readKey(box.dataset.read));
      markDial();
    });
  });
  // Progress keys are <book slug>-<chapter> (isaiah-53), the same as data-read on chapter pages and data-ch on book-page cards.
  const markDial = () => $$('.dial .tick').forEach((t) => t.classList.toggle('is-read', isRead(`${t.closest('[data-book]').dataset.book}-${t.dataset.ch}`)));
  markDial();

  // Chapter dial and section bar: show a label above the bar right away on hover or focus.
  $$('.dial-label').forEach((dialLabel) => {
    const wrap = dialLabel.parentElement;
    const show = (t) => {
      dialLabel.innerHTML = '';
      const strong = document.createElement('strong');
      strong.textContent = t.dataset.label;
      const div = document.createElement('span');
      div.textContent = t.dataset.div;
      dialLabel.append(strong, div);
      dialLabel.style.setProperty('--c', t.style.getPropertyValue('--c'));
      dialLabel.hidden = false;
      const w = wrap.getBoundingClientRect(), r = t.getBoundingClientRect(), half = dialLabel.offsetWidth / 2;
      const x = Math.min(Math.max(r.left + r.width / 2 - w.left, half), Math.max(half, w.width - half));
      dialLabel.style.left = `${x}px`;
    };
    const hide = () => { dialLabel.hidden = true; };
    $$('[data-label]', wrap).forEach((t) => {
      t.addEventListener('pointerenter', () => show(t));
      t.addEventListener('focus', () => show(t));
      t.addEventListener('pointerleave', hide);
      t.addEventListener('blur', hide);
    });
  });

  const cards = $$('.chapter-card[data-ch]');
  if (cards.length) {
    let n = 0;
    cards.forEach((c) => { const r = isRead(c.dataset.ch); c.classList.toggle('is-read', r); n += r; });
    const bar = $('.progress-bar span');
    const label = $('.progress-label');
    if (bar && n) {
      bar.style.width = `${(100 * n) / cards.length}%`;
      label.textContent = `You’ve studied ${n} of ${cards.length} chapters.`;
    }
  }

  // ---------- collapsible chapter introduction ----------
  // A reader who collapses “Where we are” or “The thread” keeps it collapsed on every chapter.
  const storedCollapsedIntro = store.get('collapsedIntro');
  const collapsedIntro = new Set(JSON.parse(storedCollapsedIntro || '[]'));
  if (storedCollapsedIntro === null) collapsedIntro.add('thread');
  const intros = $$('details.intro');
  let printing = false;
  const applyIntro = () => intros.forEach((d) => { d.open = printing || !collapsedIntro.has(d.dataset.intro); });
  intros.forEach((d) => d.addEventListener('toggle', () => {
    if (printing) return; // printing opens everything without changing the reader's preference
    d.open ? collapsedIntro.delete(d.dataset.intro) : collapsedIntro.add(d.dataset.intro);
    store.set('collapsedIntro', JSON.stringify([...collapsedIntro]));
  }));
  applyIntro();
  $$('[data-expand-intro]').forEach((button) => button.addEventListener('click', () => {
    const intro = $(`details[data-intro="${button.dataset.expandIntro}"]`);
    if (intro) intro.dataset.preview = 'false';
  }));
  addEventListener('beforeprint', () => { printing = true; applyIntro(); });
  addEventListener('afterprint', () => { printing = false; applyIntro(); });

  // ---------- chapter reader ----------
  const reader = $('.reader');
  if (reader) {
    const triggersFor = (id) => $$(`[data-note="${id}"]`);
    const kindOf = (el) => [...el.classList].find((c) => c.startsWith('k-'))?.slice(2);
    const hidden = new Set(JSON.parse(store.get('hiddenKinds') || '[]'));
    const notesResetBtn = $('[data-action="notes-reset"]');
    const kindFilters = $$('.legend .filter');
    // “Related” mode: every note stays visible as a compact card (class is-card); one at a time expands.
    let related = false;
    const isOpen = (n) => !n.hidden && !n.classList.contains('is-card');

    // Wide screens: CSS puts open notes in the right margin; here we set each one's
    // vertical position beside its phrase. The note opened last sits exactly beside its
    // phrase; the others stack above and below it without overlapping.
    const wide = matchMedia('(min-width: 880px)');
    let lastOpened = null;
    let pending = false;
    const layoutNotes = () => {
      pending = false;
      const open = $$('.note', reader).filter((n) => !n.hidden);
      if (!wide.matches) { open.forEach((n) => { n.style.top = ''; }); return; }
      const base = reader.getBoundingClientRect().top;
      const items = open
        .map((n) => {
          const anchor = triggersFor(n.id).find((b) => b.offsetParent) ?? n.closest('.verse-block');
          return { n, want: anchor.getBoundingClientRect().top - base - 8, h: n.offsetHeight };
        })
        .sort((a, b) => a.want - b.want);
      if (!items.length) return;
      const gap = 12;
      const a = Math.max(0, items.findIndex((x) => x.n === lastOpened));
      items[a].top = items[a].want;
      // Keep a newly opened note on screen: slide it up the margin rather than make the reader scroll.
      if (items[a].n === lastOpened) {
        const viewTop = 120 - base;
        const viewBottom = innerHeight - 16 - base;
        if (items[a].top + items[a].h > viewBottom) items[a].top = Math.max(viewTop, viewBottom - items[a].h);
      }
      for (let i = a + 1; i < items.length; i++) items[i].top = Math.max(items[i].want, items[i - 1].top + items[i - 1].h + gap);
      for (let i = a - 1; i >= 0; i--) items[i].top = Math.min(items[i].want, items[i + 1].top - items[i].h - gap);
      items.forEach((x) => { x.n.style.top = `${x.top}px`; });
    };
    const scheduleLayout = () => { if (!pending) { pending = true; requestAnimationFrame(layoutNotes); } };
    wide.addEventListener('change', scheduleLayout);
    addEventListener('resize', scheduleLayout);
    if ('ResizeObserver' in window) new ResizeObserver(scheduleLayout).observe(reader);
    document.fonts?.ready.then(scheduleLayout);

    const setNote = (note, open, { scroll = false } = {}) => {
      if (!note) return;
      const asCard = !open && related && !hidden.has(kindOf(note));
      note.hidden = !open && !asCard;
      note.classList.toggle('is-card', asCard);
      triggersFor(note.id).forEach((b) => b.setAttribute('aria-expanded', String(open)));
      if (open) lastOpened = note;
      else if (lastOpened === note) lastOpened = null;
      scheduleLayout();
      // In the margin the note opens beside the phrase, so there is nothing to scroll to.
      if (open && scroll && !wide.matches) {
        requestAnimationFrame(() => {
          const r = note.getBoundingClientRect();
          if (r.bottom > innerHeight || r.top < 110) note.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
        });
      }
    };

    const collapseOthers = (keep) => $$('.note', reader).forEach((n) => { if (n !== keep && isOpen(n)) setNote(n, false); });

    // Hovering a note highlights the phrase it belongs to.
    $$('.note', reader).forEach((n) => {
      n.addEventListener('mouseenter', () => triggersFor(n.id).forEach((b) => b.classList.add('is-linked')));
      n.addEventListener('mouseleave', () => triggersFor(n.id).forEach((b) => b.classList.remove('is-linked')));
    });

    reader.addEventListener('click', (e) => {
      const trig = e.target.closest('[data-note]');
      if (trig) {
        const note = document.getElementById(trig.dataset.note);
        const open = !isOpen(note);
        if (open && related) collapseOthers(note);
        setNote(note, open, { scroll: true });
        return;
      }
      const card = e.target.closest('.note.is-card');
      if (card && !e.target.closest('a')) {
        collapseOthers(card);
        setNote(card, true);
        return;
      }
      const close = e.target.closest('[data-close]');
      if (close) {
        const note = document.getElementById(close.dataset.close);
        setNote(note, false);
        triggersFor(note.id)[0]?.focus();
      }
    });
    // Phrases are spans with role="button"; give them a button's keyboard behavior.
    reader.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.phr[role="button"]')) {
        e.preventDefault();
        e.target.click();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const note = e.target.closest?.('.note');
      if (note) { setNote(note, false); triggersFor(note.id)[0]?.focus(); }
    });

    // Deep links: #n53-4 opens that note; #v5 flashes the verse.
    const openFromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = id && document.getElementById(id);
      if (!el) return;
      if (el.classList.contains('note')) {
        setNote(el, true);
        // Wait for the browser's own jump to the anchor, then show the verse above the note.
        const verse = el.closest('.verse-block')?.querySelector('.verse');
        const go = () => setTimeout(() => { verse?.scrollIntoView({ block: 'start' }); scheduleLayout(); }, 60);
        document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true });
      }
    };
    openFromHash();
    addEventListener('hashchange', openFromHash);

    // Filters by kind
    const applyFilters = () => {
      kindFilters.forEach((b) => b.setAttribute('aria-pressed', String(!hidden.has(b.dataset.kind))));
      $$('.phr, .marker').forEach((b) => {
        const k = [...b.classList].find((c) => c.startsWith('k-'))?.slice(2);
        const off = hidden.has(k);
        b.classList.toggle('filtered', off);
        b.setAttribute('tabindex', off ? '-1' : '0');
      });
      // Hide notes of filtered kinds; in related mode, show the others as cards again.
      $$('.note', reader).forEach((n) => { if (!isOpen(n) || hidden.has(kindOf(n))) setNote(n, false); });
      store.set('hiddenKinds', JSON.stringify([...hidden]));
      if (notesResetBtn) {
        const allVisible = kindFilters.every((b) => !hidden.has(b.dataset.kind));
        const label = allVisible ? 'Hide all note kinds' : 'Show all note kinds';
        notesResetBtn.setAttribute('aria-label', label);
        notesResetBtn.setAttribute('title', label);
      }
    };
    kindFilters.forEach((b) =>
      b.addEventListener('click', () => {
        hidden.has(b.dataset.kind) ? hidden.delete(b.dataset.kind) : hidden.add(b.dataset.kind);
        applyFilters();
      }),
    );
    applyFilters();
    notesResetBtn?.addEventListener('click', () => {
      const allVisible = kindFilters.every((b) => !hidden.has(b.dataset.kind));
      if (allVisible) kindFilters.forEach((b) => hidden.add(b.dataset.kind));
      else hidden.clear();
      applyFilters();
    });

    // Toolbar actions
    const plainBtn = $('[data-action="toggle-plain"]');
    const setPlain = (on) => {
      document.body.classList.toggle('hide-plain', !on);
      plainBtn?.setAttribute('aria-pressed', String(on));
    };
    setPlain(store.get('showPlain') !== '0');
    plainBtn?.addEventListener('click', () => {
      const on = document.body.classList.contains('hide-plain');
      setPlain(on);
      store.set('showPlain', on ? '1' : '0');
    });

    const relatedBtn = $('[data-action="related"]');
    const setRelated = (on) => {
      related = on;
      document.body.classList.toggle('related-on', on);
      relatedBtn?.setAttribute('aria-pressed', String(on));
      $$('.note', reader).forEach((n) => { if (!isOpen(n)) setNote(n, false); });
      scheduleLayout();
    };
    setRelated(store.get('related') === '1');
    relatedBtn?.addEventListener('click', () => {
      const on = !related;
      setRelated(on);
      store.set('related', on ? '1' : '0');
    });

    const scales = ['1', '1.12', '1.25', '0.92'];
    $('[data-action="font"]')?.addEventListener('click', () => {
      const cur = getComputedStyle(root).getPropertyValue('--reader-scale').trim() || '1';
      const next = scales[(scales.indexOf(cur) + 1) % scales.length];
      root.style.setProperty('--reader-scale', next);
      store.set('fontScale', next);
    });
  }

  // ---------- search ----------
  const q = $('#q');
  if (q) {
    const results = $('.search-results');
    const status = $('.search-status');
    let index = null;
    let filter = 'all';
    let bookFilter = 'all';
    const KIND_LABEL = { verse: 'Verse', note: 'Note', chapter: 'Chapter', guide: 'Guide' };
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’‘]/g, "'");

    const load = async () => {
      if (index) return index;
      status.textContent = 'Loading…';
      const data = await (await fetch('/search.json')).json();
      index = data.map((d) => ({ ...d, n: norm(`${d.h ?? ''} ${d.x}`) }));
      status.textContent = '';
      return index;
    };

    const snippet = (text, terms) => {
      const t = norm(text);
      let i = Math.max(0, ...terms.map((w) => t.indexOf(w)).filter((x) => x >= 0).slice(0, 1));
      const start = Math.max(0, i - 60);
      let s = (start ? '…' : '') + text.slice(start, start + 220) + (text.length > start + 220 ? '…' : '');
      s = esc(s);
      for (const w of terms) {
        if (w.length < 2) continue;
        s = s.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
      }
      return s;
    };

    const run = async () => {
      const raw = q.value.trim();
      const url = new URL(location);
      raw ? url.searchParams.set('q', raw) : url.searchParams.delete('q');
      history.replaceState(null, '', url);
      if (raw.length < 2) { results.innerHTML = ''; status.textContent = ''; return; }
      const idx = await load();
      const phrase = norm(raw.replace(/^["“]|["”]$/g, ''));
      const terms = phrase.split(/\s+/).filter(Boolean);
      const scored = [];
      for (const d of idx) {
        if (filter !== 'all' && !(filter === 'chapter' ? d.t === 'chapter' || d.t === 'guide' : d.t === filter)) continue;
        if (bookFilter !== 'all' && d.b !== bookFilter) continue;
        if (!terms.every((w) => d.n.includes(w))) continue;
        let score = d.n.includes(phrase) ? 10 : 0;
        if (d.h && norm(d.h).includes(phrase)) score += 8;
        score += { chapter: 3, guide: 2, note: 2, verse: 1 }[d.t];
        scored.push([score, d]);
      }
      scored.sort((a, b) => b[0] - a[0]);
      const top = scored.slice(0, 80);
      status.textContent = scored.length ? `${scored.length} result${scored.length === 1 ? '' : 's'}${scored.length > 80 ? ' (showing the first 80)' : ''}` : 'Nothing found. Try fewer or different words.';
      results.innerHTML = top
        .map(([, d]) => `<li><a href="${d.u}"><span class="sr-meta">${d.k ? `<span class="kind-chip k-${d.k}">${KIND_LABEL[d.t]}</span>` : `<span>${KIND_LABEL[d.t]}</span>`}<span>${esc(d.r)}</span></span>${d.h ? `<span class="sr-title">${esc(d.h)}</span>` : ''}<span class="sr-text">${snippet(d.x, terms)}</span></a></li>`)
        .join('');
    };

    let t;
    q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(run, 120); });
    $$('[data-filter]').forEach((b) =>
      b.addEventListener('click', () => {
        filter = b.dataset.filter;
        $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        run();
      }),
    );
    $$('[data-book-filter]').forEach((b) =>
      b.addEventListener('click', () => {
        bookFilter = b.dataset.bookFilter;
        $$('[data-book-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        run();
      }),
    );
    const initial = new URL(location).searchParams.get('q');
    if (initial) { q.value = initial; run(); }
  }
})();
