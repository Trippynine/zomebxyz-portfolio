Object.assign(translations.th, {
  nav_about:'เกี่ยวกับผม', intro_desc:'ถ่ายทอดรถยนต์ ไลฟ์สไตล์ และทุกโมเมนต์ ผ่านมุมมองของผม ตั้งแต่หลังกล้องจนถึงเฟรมสุดท้าย',
  talk:'คุยเรื่องโปรเจกต์ ↗', work_desc:'มุมมอง จังหวะ และเรื่องราว — เลือกผลงานที่อยากดู แล้วกดเล่นได้เลย',
  gallery_desc:'บางเรื่องราว เล่าได้ในภาพเดียว — แตะเพื่อดูภาพเต็ม',
  about_desc:'ผม ZOMEBXYZ ช่างภาพวิดีโอและนักตัดต่ออิสระ ชอบมองหามุมใหม่ ๆ ให้กับรถยนต์ ไลฟ์สไตล์ และคอนเทนต์ ตั้งแต่การถ่ายทำ จัดจังหวะภาพ ไปจนถึงสีและเสียง เพื่อให้แต่ละงานมีเรื่องราวในแบบของตัวเอง',
  contact_desc:'มีเรื่องราวที่อยากเล่า หรือโปรเจกต์ที่อยากเริ่ม? ส่งไอเดียมา แล้วมาสร้างผลงานด้วยกัน',open_video:'เปิดวิดีโอต้นฉบับ ↗'
});
Object.assign(translations.en, {
  nav_about:'About', intro_desc:'Automotive, lifestyle, and the moments in between. My perspective, from behind the camera to the final frame.',
  talk:'Let’s talk ↗',work_desc:'A perspective. A rhythm. A story. Pick a film and press play.',
  gallery_desc:'Some stories only need a single frame. Tap to explore.',
  about_desc:'I’m ZOMEBXYZ, a freelance videographer and editor finding new angles in automotive, lifestyle, and social content. From the shoot to the edit, color, and sound, I bring each story together in its own way.',
  contact_desc:'A story to tell? A project in mind? Send your ideas and let’s make something together.',open_video:'Open original video ↗'
});
let language='th';
try {const saved=localStorage.getItem('site_lang');if(saved==='en'||saved==='th')language=saved;} catch {}
function applyLanguage(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-i18n]').forEach(el=>{if(translations[language][el.dataset.i18n])el.textContent=translations[language][el.dataset.i18n];});
  document.getElementById('language').textContent=language==='th'?'EN':'TH';
}
document.getElementById('language').addEventListener('click',()=>{language=language==='th'?'en':'th';try{localStorage.setItem('site_lang',language);}catch{}applyLanguage();});
const menu=document.getElementById('menu'),navigation=document.getElementById('navigation');
function closeMenu(){navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const grid=document.getElementById('video-grid');
videos.forEach((film,i)=>{
  const button=document.createElement('button');button.className='film-card';button.type='button';
  button.setAttribute('aria-label',`Play ${film.title}`);
  const cover=document.createElement('div');cover.className='film-cover';
  if(film.id){
    const img=document.createElement('img');img.src=`https://drive.google.com/thumbnail?id=${encodeURIComponent(film.id)}&sz=w1000`;img.alt='';img.loading='lazy';
    // Use an honest graphic fallback instead of unrelated work when Drive hides the thumbnail.
    img.addEventListener('error',()=>img.remove());cover.append(img);
  }
  cover.insertAdjacentHTML('beforeend',`<span class="play-icon" aria-hidden="true">▶</span><span class="film-number">ZOMEBXYZ / ${String(i+1).padStart(2,'0')}</span>${film.new?'<span class="new-tag">NEW RELEASE</span>':''}`);
  button.append(cover);const meta=document.createElement('div');meta.className='film-meta';
  meta.innerHTML=`<span>${film.title} ↗</span><small>${film.id?'GOOGLE DRIVE':'VIDEO'} / PLAY</small>`;button.append(meta);
  button.addEventListener('click',()=>openViewer('video',i));grid.append(button);
});
photos.forEach((src,i)=>{
  const button=document.createElement('button');button.type='button';button.className='photo-card';button.setAttribute('aria-label',`View photograph ${i+1}`);
  const img=document.createElement('img');img.src=src;img.alt=`ZOMEBXYZ photography — frame ${String(i+1).padStart(2,'0')}`;img.loading='lazy';
  button.append(img);button.insertAdjacentHTML('beforeend','<span aria-hidden="true">↗</span>');button.addEventListener('click',()=>openViewer('photo',i));document.getElementById('photo-grid').append(button);
});
const viewer=document.getElementById('viewer'),content=document.getElementById('viewer-content'),external=document.getElementById('external-video');
let currentType='photo',currentIndex=0,opener=null;
function renderViewer(){
  content.replaceChildren();const isVideo=currentType==='video';external.hidden=!isVideo;
  document.getElementById('viewer-title').textContent=isVideo?videos[currentIndex].title:`FRAME ${String(currentIndex+1).padStart(2,'0')}`;
  document.getElementById('viewer-count').textContent=`${currentIndex+1} / ${isVideo?videos.length:photos.length}`;
  if(isVideo){
    const film=videos[currentIndex];
    if(film.id){const iframe=document.createElement('iframe');iframe.title=`${film.title} — Google Drive player`;iframe.src=`https://drive.google.com/file/d/${film.id}/preview`;iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.allowFullscreen=true;content.append(iframe);external.href=`https://drive.google.com/file/d/${film.id}/view`;}
    else{const video=document.createElement('video');video.src=film.url;video.controls=true;video.playsInline=true;video.preload='metadata';content.append(video);external.href=film.url;}
  }else{const img=document.createElement('img');img.src=photos[currentIndex];img.alt=`ZOMEBXYZ photograph ${currentIndex+1}`;content.append(img);}
}
let closingViewer=false;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function openViewer(type,index){
  opener=document.activeElement;currentType=type;currentIndex=index;
  closingViewer=false;viewer.classList.remove('is-closing');
  renderViewer();viewer.showModal();document.body.classList.add('viewer-open');
  document.getElementById('close-viewer').focus();
}
function closeViewer(){
  if(!viewer.open||closingViewer)return;
  if(reduceMotion.matches){viewer.close();return;}
  closingViewer=true;viewer.classList.add('is-closing');
  // Keep the native dialog in the top layer until its exit transition completes.
  window.setTimeout(()=>{if(viewer.open)viewer.close();},180);
}
function step(direction){const count=currentType==='video'?videos.length:photos.length;currentIndex=(currentIndex+direction+count)%count;renderViewer();}
document.getElementById('previous').addEventListener('click',()=>step(-1));document.getElementById('next').addEventListener('click',()=>step(1));
document.getElementById('close-viewer').addEventListener('click',closeViewer);
viewer.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeViewer();}});
viewer.addEventListener('close',()=>{content.replaceChildren();closingViewer=false;viewer.classList.remove('is-closing');document.body.classList.remove('viewer-open');opener?.focus();});
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}});
let touchStart=null;
content.addEventListener('touchstart',e=>{if(currentType==='photo')touchStart=e.changedTouches[0].clientX;},{passive:true});
content.addEventListener('touchend',e=>{if(currentType==='photo'&&touchStart!==null){const diff=e.changedTouches[0].clientX-touchStart;if(Math.abs(diff)>55)step(diff<0?1:-1);touchStart=null;}},{passive:true});
applyLanguage();

// Reveal once as content enters the viewport; reduced-motion users see it immediately.
if('IntersectionObserver' in window&&!reduceMotion.matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:0.08});
  document.querySelectorAll('.section-heading,.about-copy,.qr-card').forEach(el=>{
    el.classList.add('reveal');observer.observe(el);
  });
  reduceMotion.addEventListener('change',event=>{if(event.matches){observer.disconnect();document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}});
}
