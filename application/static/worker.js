// Change version here in case of static content updates
const CACHE_NAME = 'metarhia-static-v8';
const CACHE_FILES = [
  '/',
  '/console.css',
  '/events.js',
  '/console.js',
  '/metacom.js',
  '/favicon.ico',
  '/favicon.png',
  '/metarhia.png',
  '/metarhia.svg',
];

/*
self.addEventListener('install', async (event) => {
  const cache = await caches.open('metarhia');
  event.waitUntil(await cache.addAll(CACHE_FILES));
});

*/

const registerContent = async () => {
  const cache = await caches.open(CACHE_NAME);
  // console.log('registerContent...');
  return cache.addAll(CACHE_FILES);
};

const checkVersionUpdates = async () => {
  const cacheWhitelist = [CACHE_NAME];
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map((name) => {
      if (!cacheWhitelist.includes(name)) return caches.delete(name);
    })
  );
};

/*
self.addEventListener('install', async (event) => {
  console.log(files);
  event.waitUntil(
    caches.open('metarhia').then((cache) => cache.addAll(files))
  );
});
*/

const getContent = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.status === 200 && response.type === 'basic') {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('install', (event) => {
  console.log('install');
  const contentRegistration = registerContent();
  event.waitUntil(contentRegistration);
});

self.addEventListener('activate', (event) => {
  console.log('activate');
  const versionChecking = checkVersionUpdates();
  event.waitUntil(versionChecking);
});

self.addEventListener('fetch', (event) => {
  // console.log('fetch');
  // caches.keys().then((e) => console.log(e));
  const request = event.request;
  // console.log(request.url);
  if (request.url.startsWith('http')) {
    const contentRetrieving = getContent(request);
    event.respondWith(contentRetrieving);
  }
});
