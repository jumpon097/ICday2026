/* IC Day UBCH PWA: cache only public static shell, NEVER cache or intercept scores / GAS / Drive. */
const CACHE='ic-day-ubch-shell-v3.4';
const STATIC=['./index.html','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/ubch-logo.webp','./assets/nong-dokbua.webp'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ic-day-ubch-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  // Important: never store or reroute responses involving Google or any other origin.
  if(url.origin!==self.location.origin)return;
  if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  const destination=request.mode==='navigate'?'./index.html':null;
  if(destination){
    event.respondWith(fetch(request).catch(()=>caches.match(destination)));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
