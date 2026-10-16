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
  const pinnedHeight = () => ($('.site-header')?.offsetHeight ?? 0) + ($('.section-nav')?.offsetHeight ?? 0);

  // ---------- citation and short scripture previews ----------
  // Ordinary fragment links remain usable when JavaScript or native popovers are unavailable.
  const scriptureData = JSON.parse($('#scripture-preview-data')?.textContent ?? '{}');
  const citations = [...$$('.cite a'), ...$$('a[data-scripture]').filter((link) => scriptureData[link.dataset.scripture])];
  if (citations.length && 'showPopover' in HTMLElement.prototype) {
    const popup = document.createElement('div');
    popup.id = 'citation-preview';
    popup.className = 'citation-popup';
    popup.setAttribute('popover', 'auto');
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-labelledby', 'citation-preview-title');
    popup.innerHTML = '<div class="citation-popup-bar"><span id="citation-preview-title"></span><button type="button" class="citation-popup-close" aria-label="Close citation">×</button></div><div class="citation-popup-body"></div><a class="citation-popup-list">View in source list</a>';
    document.body.append(popup);
    const closeButton = $('.citation-popup-close', popup);
    const listLink = $('.citation-popup-list', popup);
    const previewFor = (link) => {
      const scripture = scriptureData[link.dataset.scripture];
      if (scripture) {
        const passage = document.createElement('div');
        passage.className = 'scripture-preview-verses';
        scripture.verses.forEach((text, i) => {
          const verse = document.createElement('p');
          const number = document.createElement('sup');
          number.textContent = scripture.first + i;
          verse.append(number, document.createTextNode(` ${text}`));
          passage.append(verse);
        });
        return { content: passage, title: scripture.title, close: 'Close scripture preview', scripture: true };
      }
      const source = document.getElementById(link.hash.slice(1))?.querySelector('.reference-source');
      return source ? { content: source.cloneNode(true), title: `Source ${link.textContent}`, action: 'View in source list', close: 'Close citation' } : null;
    };
    let active = null, pinned = false, timer, restoringFocus = false;
    const position = () => {
      if (!active || !popup.matches(':popover-open')) return;
      const rect = active.getBoundingClientRect();
      const edge = 12, gap = 8, ceiling = pinnedHeight() + edge;
      const above = Math.max(0, rect.top - ceiling - gap);
      const below = Math.max(0, innerHeight - rect.bottom - edge - gap);
      // Prefer above the citation when the complete card fits there.
      popup.style.maxHeight = `${Math.max(above, below)}px`;
      const up = popup.offsetHeight <= above || above > below;
      popup.style.maxHeight = `${up ? above : below}px`;
      popup.style.left = `${Math.max(edge, Math.min(innerWidth - popup.offsetWidth - edge, rect.left + rect.width / 2 - popup.offsetWidth / 2))}px`;
      popup.style.top = `${up ? rect.top - popup.offsetHeight - gap : rect.bottom + gap}px`;
    };
    const reset = () => {
      clearTimeout(timer);
      active?.setAttribute('aria-expanded', 'false');
      active = null;
      pinned = false;
    };
    const hide = (restore = false) => {
      const trigger = active;
      // Hiding a native popover may itself restore focus to its trigger.
      // Suppress focus previews throughout that operation to avoid reopening it.
      restoringFocus = true;
      if (popup.matches(':popover-open')) popup.hidePopover();
      reset();
      if (restore && trigger) trigger.focus({ preventScroll: true });
      restoringFocus = false;
    };
    const deferHide = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!pinned && !popup.matches(':hover') && !popup.contains(document.activeElement) && document.activeElement !== active) hide();
      }, 180);
    };
    const show = (link) => {
      if (restoringFocus) return;
      clearTimeout(timer);
      // A preview opened inside an expanded note must stay within the modal's active subtree.
      const host = link.closest('dialog[open]') ?? document.body;
      if (popup.parentElement !== host) { hide(); host.append(popup); }
      const preview = previewFor(link);
      if (!preview) return;
      if (active !== link) {
        active?.setAttribute('aria-expanded', 'false');
        active = link;
        pinned = false;
        $('.citation-popup-body', popup).replaceChildren(preview.content);
        const heading = $('#citation-preview-title', popup);
        if (preview.scripture) {
          const chapterLink = document.createElement('a');
          chapterLink.textContent = preview.title;
          chapterLink.href = link.href;
          chapterLink.target = link.target;
          chapterLink.rel = link.rel;
          heading.replaceChildren(chapterLink);
        } else heading.textContent = preview.title;
        popup.classList.toggle('scripture-popup', Boolean(preview.scripture));
        closeButton.setAttribute('aria-label', preview.close);
        listLink.hidden = Boolean(preview.scripture);
        listLink.textContent = preview.action ?? '';
        listLink.href = link.href;
        listLink.target = link.target;
        listLink.rel = link.rel;
      }
      link.setAttribute('aria-expanded', 'true');
      if (!popup.matches(':popover-open')) popup.showPopover();
      position();
    };
    const enhanced = new WeakSet();
    const enhance = (link) => {
      if (enhanced.has(link) || link.closest('.citation-popup')) return;
      if (!link.matches('.cite a') && !scriptureData[link.dataset.scripture]) return;
      enhanced.add(link);
      let lastPointerType = '';
      link.addEventListener('pointerdown', (e) => { lastPointerType = e.pointerType; });
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', popup.id);
      link.setAttribute('aria-expanded', 'false');
      link.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && !pinned) show(link); });
      link.addEventListener('pointerleave', deferHide);
      link.addEventListener('focus', () => { if (!pinned) show(link); });
      link.addEventListener('blur', deferHide);
      link.addEventListener('click', (e) => {
        const pointer = e.pointerType || (e.detail ? lastPointerType : '');
        lastPointerType = '';
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        // A mouse click or keyboard activation follows scripture links directly.
        // Touch and pen need the first tap to preview, then the linked popup heading to navigate.
        if (scriptureData[link.dataset.scripture] && pointer !== 'touch' && pointer !== 'pen') return;
        // Leave the ordinary fragment navigation alone if the source is missing.
        if (!previewFor(link)) return;
        e.preventDefault();
        if (active === link && pinned) { hide(true); return; }
        show(link);
        pinned = true;
        closeButton.focus({ preventScroll: true });
      });
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey && active === link && popup.matches(':popover-open')) {
          e.preventDefault();
          $('a[href], button', popup).focus({ preventScroll: true });
        }
      });
    };
    citations.forEach(enhance);
    // Expanded notes clone their contents, including references, after the page has loaded.
    new MutationObserver((changes) => {
      for (const change of changes) for (const node of change.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches('.cite a, a[data-scripture]')) enhance(node);
        $$('.cite a, a[data-scripture]', node).forEach(enhance);
      }
    }).observe(document.body, { childList: true, subtree: true });
    popup.addEventListener('pointerenter', () => clearTimeout(timer));
    popup.addEventListener('pointerleave', deferHide);
    popup.addEventListener('focusout', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { if (!popup.contains(document.activeElement) && document.activeElement !== active) hide(); }, 0);
    });
    popup.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const controls = $$('a[href], button', popup).filter((el) => !el.hidden && el.getClientRects().length);
      if (e.shiftKey && document.activeElement === controls[0]) {
        e.preventDefault();
        hide(true);
      } else if (!e.shiftKey && document.activeElement === controls.at(-1)) {
        // Resume the passage's tab order after the citation instead of jumping to the footer.
        const scope = active.closest('dialog[open]') ?? document;
        const links = $$('a[href], button, input, select, textarea, summary, [tabindex="0"]', scope).filter((el) => !popup.contains(el) && el.getClientRects().length && !el.disabled);
        const next = links[links.indexOf(active) + 1];
        if (next) { e.preventDefault(); hide(); next.focus({ preventScroll: true }); }
      }
    });
    closeButton.addEventListener('click', () => hide(true));
    listLink.addEventListener('click', () => hide());
    popup.addEventListener('toggle', () => { if (!popup.matches(':popover-open')) reset(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && active) { e.preventDefault(); hide(true); }
    });
    window.addEventListener('resize', position);
    document.addEventListener('scroll', (e) => {
      if (active && !popup.contains(e.target)) {
        const rect = active.getBoundingClientRect();
        // Keyboard focus can scroll its reference into view. Keep that preview open.
        if (rect.bottom <= pinnedHeight() || rect.top >= innerHeight) hide();
        else position();
      }
    }, true);
  }

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
        `<a class="teaser k-${n.k}" href="${href(n)}">${chips[n.k]}<span class="teaser-phrase">“${esc(n.p)}”</span><span class="teaser-ref">${esc(n.n)} ${n.c}${n.r === 0 ? ', title' : `:${n.r}`}</span><span class="teaser-text">${esc(n.x)}…</span></a>`;
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

  // ---------- collapsible chapter introduction ----------
  // A reader who collapses “Where we are” or “The thread” keeps it collapsed on every chapter.
  // “What's in this picture” (book page): the button sits in the image's lower right corner. Its list opens below
  // the image, so while it is open the button is raised by the list's height to stay on the image.
  document.querySelectorAll('.art-key').forEach((d) => {
    const fig = d.closest('.book-art-figure'), list = d.querySelector('ul');
    const place = () => fig.style.setProperty('--key-h', d.open ? `${list.offsetHeight + parseFloat(getComputedStyle(list).marginTop)}px` : '0px');
    d.addEventListener('toggle', place);
    addEventListener('resize', place);
  });
  const storedCollapsedIntro = store.get('collapsedIntro');
  const collapsedIntro = new Set(JSON.parse(storedCollapsedIntro || '[]'));
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
        const viewTop = pinnedHeight() + 16 - base;
        const viewBottom = innerHeight - 16 - base;
        items[a].top = Math.max(viewTop, Math.min(items[a].top, viewBottom - items[a].h));
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

    // In the margin only one note is open at a time: opening another shrinks the earlier ones to cards (title and
    // first sentence), so the stack stays short enough for every note to sit beside its phrase. A card reopens on a
    // tap; its × or a second tap on the phrase puts it away. Narrow screens open notes beneath their verses, all at once.
    const kept = new Set();
    const setNote = (note, open, { scroll = false, dismiss = false } = {}) => {
      if (!note) return;
      if (open) kept.add(note);
      else if (dismiss) kept.delete(note);
      const asCard = !open && !hidden.has(kindOf(note)) && (related || (wide.matches && kept.has(note)));
      note.hidden = !open && !asCard;
      note.classList.toggle('is-card', asCard);
      note.classList.toggle('is-kept', asCard && !related);
      if (asCard) note.tabIndex = 0;
      else note.removeAttribute('tabindex');
      triggersFor(note.id).forEach((b) => b.setAttribute('aria-expanded', String(open)));
      if (open) lastOpened = note;
      else if (lastOpened === note) lastOpened = null;
      scheduleLayout();
      // In the margin the note opens beside the phrase, so there is nothing to scroll to.
      if (open && scroll && !wide.matches) {
        requestAnimationFrame(() => {
          const r = note.getBoundingClientRect();
          if (r.bottom > innerHeight || r.top < pinnedHeight() + 16) note.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
        });
      }
    };

    const collapseOthers = (keep) => $$('.note', reader).forEach((n) => { if (n !== keep && isOpen(n)) setNote(n, false); });
    // Crossing the margin breakpoint: cards belong to the margin, so they appear or go away with it.
    wide.addEventListener('change', () => {
      if (wide.matches && lastOpened && isOpen(lastOpened)) collapseOthers(lastOpened);
      $$('.note', reader).forEach((n) => { if (!isOpen(n)) setNote(n, false); });
    });

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
        if (open && (related || wide.matches)) collapseOthers(note);
        setNote(note, open, { scroll: true, dismiss: !open });
        return;
      }
      const close = e.target.closest('[data-close]');
      if (close) {
        const note = document.getElementById(close.dataset.close);
        setNote(note, false, { dismiss: true });
        triggersFor(note.id)[0]?.focus();
        return;
      }
      const card = e.target.closest('.note.is-card');
      if (card && !e.target.closest('a')) {
        collapseOthers(card);
        setNote(card, true);
      }
    });
    // A card is reachable from the keyboard too.
    reader.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.note.is-card')) {
        e.preventDefault();
        collapseOthers(e.target);
        setNote(e.target, true);
      }
    });
    // Phrases are spans with role="button"; give them a button's keyboard behavior.
    reader.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.phr[role="button"]')) {
        e.preventDefault();
        e.target.click();
      }
    });
    reader.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const note = e.target.closest?.('.note');
      if (note) { setNote(note, false, { dismiss: true }); triggersFor(note.id)[0]?.focus(); }
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
        notesResetBtn.querySelector('span').textContent = allVisible ? 'Hide all' : 'Show all';
        notesResetBtn.setAttribute('title', allVisible ? 'Hide every kind of note, for the text alone' : 'Show every kind of note');
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

  // Citations stay collapsible on screen but are always included when printing.
  let printedSources = [];
  addEventListener('beforeprint', () => {
    if (printedSources.length) return;
    printedSources = $$('details.note-sources').filter((el) => !el.open);
    printedSources.forEach((el) => { el.open = true; });
  });
  addEventListener('afterprint', () => {
    printedSources.forEach((el) => { el.open = false; });
    printedSources = [];
  });

  // ---------- section navigation ----------
  // Measure the header and section navigation so anchors and notes clear both.
  const sectionNav = $('.section-nav');
  const header = $('.site-header');
  const measureBars = () => {
    root.style.setProperty('--header-h', `${header?.offsetHeight ?? 0}px`);
    root.style.setProperty('--section-nav-h', `${sectionNav?.offsetHeight ?? 0}px`);
  };
  const bars = new ResizeObserver(measureBars);
  [header, sectionNav].filter(Boolean).forEach((el) => bars.observe(el));
  measureBars();
  if (sectionNav) {
    const links = $$('a', sectionNav);
    const targets = links.map((a) => document.getElementById(a.hash.slice(1)));
    let queued = false;
    const updateSection = () => {
      queued = false;
      const top = pinnedHeight() + 24;
      let current = 0;
      targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= top) current = i; });
      links.forEach((a, i) => i === current ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
    };
    sectionNav.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      const target = a && document.getElementById(a.hash.slice(1));
      const intro = target?.closest('details.intro');
      if (intro) intro.open = true;
    });
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateSection); } }, { passive: true });
    updateSection();
  }

  // A native dialog keeps long notes readable without moving the passage or duplicating IDs.
  const expandedNote = $('.note-dialog');
  if (expandedNote) {
    let opener;
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-expand-note]');
      if (!button) return;
      const note = document.getElementById(button.dataset.expandNote);
      if (!note) return;
      opener = button;
      const clone = note.cloneNode(true);
      clone.hidden = false;
      clone.classList.remove('is-card');
      [clone, ...$$('[id]', clone)].forEach((el) => el.removeAttribute('id'));
      $$('.note-head, .note-teaser', clone).forEach((el) => el.remove());
      const title = $('.note-title', clone);
      if (title) title.id = 'expanded-note-title';
      $('.note-dialog-content', expandedNote).replaceChildren(clone);
      const verse = note.closest('.verse-block')?.querySelector('.verse');
      $('.note-dialog-verse', expandedNote).textContent = verse?.textContent.trim() ?? '';
      expandedNote.showModal();
    });
    $('[data-dialog-close]', expandedNote).addEventListener('click', () => expandedNote.close());
    expandedNote.addEventListener('close', () => { opener?.focus(); });
    expandedNote.addEventListener('click', (e) => { if (e.target === expandedNote) { const r = expandedNote.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) expandedNote.close(); } });
  }

  // ---------- search ----------
  const q = $('#q');
  if (q) {
    const results = $('.search-results');
    const status = $('.search-status');
    let index = null;
    let filter = 'all';
    let bookFilter = 'all';
    let volumeFilter = 'all';
    let request = 0;
    const scope = $('.search-scope');
    const library = JSON.parse(scope.dataset.library);
    const kinds = JSON.parse(scope.dataset.kinds);
    const allBooks = library.flatMap((v) => v.books.map((b) => ({ ...b, volume: v.key })));
    const scopeEntries = [...allBooks, ...library.filter((v) => v.hasGuides).map((v) => ({ slug: v.slug, name: `${v.name} guides`, volume: v.key }))];
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
      const version = ++request;
      const raw = q.value.trim();
      const url = new URL(location);
      raw ? url.searchParams.set('q', raw) : url.searchParams.delete('q');
      history.replaceState(null, '', url);
      if (raw.length < 2) { results.innerHTML = ''; status.textContent = ''; return; }
      const idx = await load();
      if (version !== request) return;
      const phrase = norm(raw.replace(/^["“]|["”]$/g, ''));
      const terms = phrase.split(/\s+/).filter(Boolean);
      const scored = [];
      const reference = raw.match(/^(.*?)\s*(\d+)(?::\s*(\d+)(?:\s*[–-]\s*(\d+))?)?$/);
      const refBook = reference && allBooks.find((b) => [b.name, ...b.aliases].some((a) => a.toLowerCase().replace(/[.\s]/g, '') === reference[1].toLowerCase().replace(/[.\s]/g, '')));
      const selectedVolume = library.find((v) => v.key === volumeFilter);
      const scopedBooks = selectedVolume ? new Set([selectedVolume.slug, ...selectedVolume.books.map((b) => b.slug)]) : null;
      for (const d of idx) {
        if (filter !== 'all' && !(filter === 'chapter' ? d.t === 'chapter' || d.t === 'guide' : d.t === filter)) continue;
        if (bookFilter !== 'all' && d.b !== bookFilter) continue;
        if (scopedBooks && !scopedBooks.has(d.b)) continue;
        const prefix = refBook && `/${refBook.slug}/${Number(reference[2])}/`;
        const verse = Number(d.u.split('#v')[1]);
        const direct = prefix && (reference[3] ? d.t === 'verse' && d.u.startsWith(prefix) && verse >= Number(reference[3]) && verse <= Number(reference[4] ?? reference[3]) : d.t === 'chapter' && d.u === prefix);
        const noteRange = d.t === 'note' && d.r.match(/:(\d+)(?:[–-](\d+))?/);
        const attached = prefix && noteRange && d.u.startsWith(prefix) && (!reference[3] || Number(noteRange[1]) <= Number(reference[4] ?? reference[3]) && Number(noteRange[2] ?? noteRange[1]) >= Number(reference[3]));
        if (!direct && !attached && !terms.every((w) => d.n.includes(w))) continue;
        let score = direct ? 1000 - (verse || 0) / 10000 : attached ? 500 : d.n.includes(phrase) ? 10 : 0;
        if (d.h && norm(d.h).includes(phrase)) score += 8;
        score += { chapter: 3, guide: 2, note: 2, verse: 1 }[d.t];
        scored.push([score, d, direct]);
      }
      scored.sort((a, b) => b[0] - a[0]);
      const top = scored.slice(0, 80);
      status.textContent = scored.length ? `${scored.length} result${scored.length === 1 ? '' : 's'}${scored.length > 80 ? ' (showing the first 80)' : ''}` : volumeFilter !== 'all' || bookFilter !== 'all' ? 'Nothing found in this selection. Try a different volume or book, or clear the filter.' : 'Nothing found. Try fewer or different words.';
      results.innerHTML = top
        .map(([, d, direct]) => `<li class="search-result${direct ? ' direct-result' : ''}"><span class="sr-meta"><span${d.t === 'note' && kinds[d.k] ? ` class="kind-chip k-${esc(d.k)}"` : ''}>${d.t === 'note' && kinds[d.k] ? `${kinds[d.k].icon}${esc(kinds[d.k].label)}` : KIND_LABEL[d.t]}</span>${d.h && d.r !== KIND_LABEL[d.t] ? `<span>${esc(d.r)}</span>` : ''}</span><a class="sr-title" href="${d.u}">${esc(d.h || d.r)}</a><span class="sr-text">${direct && d.t === 'verse' ? esc(d.x) : snippet(d.x, terms)}</span></li>`)
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
    const choice = (label, selected, action) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'scope-choice'; b.textContent = label;
      b.setAttribute('aria-pressed', String(selected)); b.addEventListener('click', action); return b;
    };
    const volumes = $('.scope-volumes', scope), books = $('.scope-books', scope);
    const closeScope = () => { scope.open = false; $('summary', scope).focus(); };
    const selectVolume = (v) => { volumeFilter = v; bookFilter = 'all'; renderScope(); run(); };
    const volumeChoices = [['all', 'All volumes'], ...library.map((v) => [v.key, v.name])];
    volumeChoices.forEach(([key, name]) => {
      const b = choice(name, volumeFilter === key, () => selectVolume(key));
      b.dataset.volume = key;
      volumes.append(b);
    });
    const renderScope = () => {
      const focusAllBooks = document.activeElement === books.firstElementChild;
      $$('[data-volume]', volumes).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.volume === volumeFilter)));
      books.replaceChildren();
      books.append(choice('All books & guides', bookFilter === 'all', () => { bookFilter = 'all'; renderScope(); run(); }));
      const bs = scopeEntries.filter((b) => volumeFilter === 'all' || b.volume === volumeFilter);
      bs.forEach((b) => books.append(choice(b.name, bookFilter === b.slug, () => { bookFilter = b.slug; volumeFilter = b.volume; renderScope(); run(); closeScope(); })));
      if (!bs.length) { const p = document.createElement('p'); p.className = 'scope-empty'; p.textContent = 'No books from this volume are on the site yet.'; books.append(p); }
      $('.scope-label', scope).textContent = bookFilter !== 'all' ? scopeEntries.find((b) => b.slug === bookFilter).name : volumeFilter !== 'all' ? library.find((v) => v.key === volumeFilter).name : 'All scriptures';
      $('.scope-books-heading', scope).textContent = volumeFilter === 'all' ? 'Books & guides' : library.find((v) => v.key === volumeFilter).name;
      if (focusAllBooks) books.firstElementChild.focus();
    };
    $('.scope-clear', scope).addEventListener('click', () => { volumeFilter = 'all'; bookFilter = 'all'; renderScope(); run(); closeScope(); });
    $('.scope-done', scope).addEventListener('click', closeScope);
    document.addEventListener('click', (e) => { if (!e.composedPath().includes(scope)) scope.open = false; });
    scope.addEventListener('keydown', (e) => { if (e.key === 'Escape') { scope.open = false; $('summary', scope).focus(); } });
    $('.search-form').addEventListener('submit', (e) => { e.preventDefault(); run(); });
    renderScope();
    const initial = new URL(location).searchParams.get('q');
    if (initial) { q.value = initial; run(); }
  }
})();
