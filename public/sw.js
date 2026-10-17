// Line upon Line — the offline copy (DEVELOPMENT.md, “Reading offline”).
// Nothing is saved until a reader asks for it in the About page's “Reading offline” section. Then every file of the site is fetched into one
// cache, and the build's offline.json (each file's URL and a hash of its contents) is kept beside it, so that
// a later visit with a connection fetches only what has changed since. While online, pages still come from
// the network first, so a saved copy never hides a newer page; offline, they come from the cache.
const CACHE = 'site';
const LIST = '/offline.json';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

const saved = async () => (await caches.open(CACHE)).match(LIST).then((r) => (r ? r.json() : null));

// The cache key for a request: a folder's URL, without the query (assets carry ?v=<build> for the browser's
// own cache; the offline copy is kept up to date by offline.json instead).
const keyOf = (url) => {
  const u = new URL(url);
  let p = u.pathname;
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  else if (!/\.[a-z0-9]+$/i.test(p) && !p.endsWith('/')) p += '/';
  return p;
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname === '/sw.js') return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(keyOf(req.url));
    if (!hit) return fetch(req).catch(async () => (req.mode === 'navigate' && (await cache.match('/404.html'))) || Response.error());
    // Fonts and images come straight from the copy. The stylesheet and script are treated as pages are, so a
    // fresh page never runs with the copy's older site.js while the day's update hasn't run yet.
    if (req.mode !== 'navigate' && url.pathname.startsWith('/assets/') && !/\.(css|js)$/.test(url.pathname)) return hit;
    // Pages and data: the network when it answers promptly, the saved copy when it doesn't.
    const net = fetch(req);
    const late = new Promise((r) => setTimeout(r, 4000, null));
    const res = await Promise.race([net.catch(() => null), late]);
    // A server error falls back to the saved copy; any other answer (a page since removed, say) stands.
    return res && res.status < 500 ? res : hit;
  })());
});

// Messages from the About page: { do: 'save' } fetches what is missing or changed; { do: 'remove' } deletes the copy;
// { do: 'status' } reports what is saved. Progress goes back to every open page as { type: 'progress', done, total }.
const tell = async (msg) => (await self.clients.matchAll()).forEach((c) => c.postMessage(msg));
let running = null;

async function save() {
  const cache = await caches.open(CACHE);
  const have = (await saved())?.files ?? {};
  const list = await (await fetch(LIST, { cache: 'no-store' })).json();
  const want = [];
  for (const [u, h] of Object.entries(list.files)) if (have[u] !== h || !(await cache.match(u))) want.push([u, h]);
  const total = want.length;
  let done = 0, failed = 0;
  tell({ type: 'progress', done, total });
  const queue = [...want];
  const worker = async () => {
    for (let item; (item = queue.shift()); ) {
      const [u] = item;
      try {
        const res = await fetch(u, { cache: 'no-cache' });
        if (!res.ok) throw new Error(res.status);
        // A redirected response can't answer a page load, so it is stored as a fresh one.
        await cache.put(u, res.redirected ? new Response(await res.blob(), { headers: res.headers }) : res);
      } catch { failed++; }
      if (++done % 10 === 0 || done === total) tell({ type: 'progress', done, total });
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  for (const u of Object.keys(have)) if (!(u in list.files)) await cache.delete(u);
  // The list is stored last, and only when everything arrived, so an interrupted save is finished next time.
  if (!failed) await cache.put(LIST, new Response(JSON.stringify(list), { headers: { 'content-type': 'application/json' } }));
  return { failed, fetched: total - failed };
}

self.addEventListener('message', (e) => {
  const reply = (m) => e.source?.postMessage(m);
  e.waitUntil((async () => {
    if (e.data?.do === 'save') {
      running ??= save().finally(() => { running = null; });
      try { reply({ type: 'saved', ...(await running), status: await saved() }); } catch (err) { reply({ type: 'error', message: String(err) }); }
    } else if (e.data?.do === 'remove') {
      await caches.delete(CACHE);
      reply({ type: 'status', status: null });
    } else if (e.data?.do === 'status') {
      reply({ type: 'status', status: await saved(), running: !!running });
    }
  })());
});
