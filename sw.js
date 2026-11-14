/* Sổ tay CTKM: cache để dùng được khi mạng yếu hoặc mất mạng.
   index.html, app-full.js, capnhat.json, huongdan.html: lấy mạng trước, mất mạng thì dùng bản đã lưu.
   Ảnh TBTK (tb/) và font: dùng bản đã lưu (tên file có ?v= theo phiên bản nên tự đổi khi cập nhật). */
const C='ctkm-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  const stat=/\/(tb|fonts)\//.test(u.pathname)||/\.(png|jpg|woff2)$/.test(u.pathname);
  if(stat){e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}))));return}
  e.respondWith(fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r,{ignoreSearch:/capnhat\.json$/.test(u.pathname)}).then(m=>m||caches.match('./index.html')||caches.match('./'))));
});
