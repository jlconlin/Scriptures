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

  // ---------- theme ----------
  $('.theme-toggle')?.addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  });

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
  const markDial = () => $$('.dial .tick').forEach((t) => t.classList.toggle('is-read', isRead(`isaiah-${t.dataset.ch}`)));
  markDial();
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

  // ---------- chapter reader ----------
  const reader = $('.reader');
  if (reader) {
    const triggersFor = (id) => $$(`[data-note="${id}"]`);
    const kindOf = (el) => [...el.classList].find((c) => c.startsWith('k-'))?.slice(2);
    const hidden = new Set(JSON.parse(store.get('hiddenKinds') || '[]'));
    // “Related” mode: every note stays visible as a compact card (class is-card); one at a time expands.
    let related = false;
    const isOpen = (n) => !n.hidden && !n.classList.contains('is-card');

    // Wide screens: CSS puts open notes in the right margin; here we set each one's
    // vertical position beside its phrase. The note opened last sits exactly beside its
    // phrase; the others stack above and below it without overlapping.
    const wide = matchMedia('(min-width: 1200px)');
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
      $$('.legend .filter').forEach((b) => b.setAttribute('aria-pressed', String(!hidden.has(b.dataset.kind))));
      $$('.phr, .marker').forEach((b) => {
        const k = [...b.classList].find((c) => c.startsWith('k-'))?.slice(2);
        const off = hidden.has(k);
        b.classList.toggle('filtered', off);
        off ? b.setAttribute('tabindex', '-1') : b.removeAttribute('tabindex');
      });
      // Hide notes of filtered kinds; in related mode, show the others as cards again.
      $$('.note', reader).forEach((n) => { if (!isOpen(n) || hidden.has(kindOf(n))) setNote(n, false); });
    };
    $$('.legend .filter').forEach((b) =>
      b.addEventListener('click', () => {
        hidden.has(b.dataset.kind) ? hidden.delete(b.dataset.kind) : hidden.add(b.dataset.kind);
        store.set('hiddenKinds', JSON.stringify([...hidden]));
        applyFilters();
      }),
    );
    applyFilters();

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
    const initial = new URL(location).searchParams.get('q');
    if (initial) { q.value = initial; run(); }
  }
})();
