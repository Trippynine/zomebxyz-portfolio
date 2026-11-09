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
Object.assign(translations.th,{filter_all:'ทั้งหมด',category_automotive:'Automotive',category_editing:'Editing & Motion',automotive_desc:'รถยนต์ งานมีตติ้ง ล้อแม็ก และเบื้องหลังการผลิต — เรื่องราวของโลกยานยนต์',editing_desc:'งานตัดต่อ Before & After และ Motion Graphics สำหรับคอนเทนต์และโปรโมตเพลง',filter_label:'เลือกหมวดผลงาน',category_work:'ผลงาน',work_desc:'เลือกชมตามหมวดหมู่ หรือดูผลงานทั้งหมด — แตะการ์ดเพื่อเล่นวิดีโอ',new_release:'ผลงานใหม่'});
Object.assign(translations.en,{filter_all:'All work',category_automotive:'Automotive',category_editing:'Editing & Motion',automotive_desc:'Car meets, wheel films, workshops and the craft behind automotive stories.',editing_desc:'Before-and-after edits and motion graphics for content and music promotion.',filter_label:'Filter selected work',category_work:'films',work_desc:'Explore a category or browse the full collection. Tap a film to watch.',new_release:'NEW RELEASE'});
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
const categories=[{id:'automotive',key:'category_automotive',description:'automotive_desc',number:'01'},{id:'editing-motion',key:'category_editing',description:'editing_desc',number:'02'}];
const featuredIndex=videos.findIndex(film=>film.featured);
const featuredFilm=videos[featuredIndex];
const categoryOrder=new Map(categories.map(({id})=>[id,videos
  .map((film,index)=>index)
  .filter(index=>videos[index].category===id&&index!==featuredIndex)
  .sort((a,b)=>Number(!!videos[b].new)-Number(!!videos[a].new)||a-b)]));
Object.assign(translations.th,{featured_label:'คลิปโปรโมตใหม่',featured_desc:'รู้จักงานของผมใน 41 วินาที ตั้งแต่ถ่ายรถยนต์และอีเวนต์ ไปจนถึงตัดต่อและ Motion Graphics',featured_play:'ชมคลิปโปรโมต'});
Object.assign(translations.en,{featured_label:'NEW PROMO',featured_desc:'Get to know my work in 41 seconds, from automotive and event videography to editing and motion graphics.',featured_play:'Watch the promo'});
let videoOrder=[];
const filters=document.createElement('div');filters.className='work-filters';filters.setAttribute('role','group');filters.setAttribute('aria-label','เลือกหมวดผลงาน / Filter selected work');
[{id:'all',key:'filter_all'},...categories].forEach(category=>{
  const button=document.createElement('button');button.type='button';button.dataset.category=category.id;button.setAttribute('aria-controls','video-grid');button.setAttribute('aria-pressed',String(category.id==='all'));
  const count=category.id==='all'?videos.length:videos.filter(film=>film.category===category.id).length;
  button.innerHTML=`<span data-i18n="${category.key}">${translations[language][category.key]}</span><small>${String(count).padStart(2,'0')}</small>`;
  button.addEventListener('click',()=>setVideoCategory(category.id));filters.append(button);
});
grid.before(filters);grid.className='video-categories';
let featuredCard;
if(featuredFilm){
  featuredCard=document.createElement('button');
  featuredCard.type='button';
  featuredCard.className='featured-film';
  featuredCard.innerHTML=`
    <span class="featured-copy">
      <span class="featured-badge" data-i18n="featured_label"></span>
      <span class="featured-title">ZOMEBXYZ <span>PROMO</span></span>
      <span class="featured-description" data-i18n="featured_desc"></span>
      <span class="featured-action"><span aria-hidden="true">▶</span> <span data-i18n="featured_play"></span></span>
    </span>
    <span class="featured-poster">
      <img src="${featuredFilm.poster}" width="540" height="960" loading="lazy" alt="">
      <span class="featured-duration" aria-hidden="true">0:41</span>
    </span>`;
  featuredCard.addEventListener('click',()=>openViewer('video',featuredIndex));
  grid.append(featuredCard);
}
categories.forEach(category=>{
  const group=document.createElement('section');group.className='video-category';group.dataset.category=category.id;group.setAttribute('aria-labelledby',`category-${category.id}`);
  const indices=categoryOrder.get(category.id);
  const categoryCount=indices.length+Number(featuredFilm?.category===category.id);
  const header=document.createElement('div');header.className='category-heading';header.innerHTML=`<div><span class="eyebrow">${category.number} / COLLECTION</span><h3 id="category-${category.id}" data-i18n="${category.key}">${translations[language][category.key]}</h3><p data-i18n="${category.description}">${translations[language][category.description]}</p></div><span class="category-total">${String(categoryCount).padStart(2,'0')} <span data-i18n="category_work">${translations[language].category_work}</span></span>`;
  const filmsGrid=document.createElement('div');filmsGrid.className='video-grid';
  indices.forEach(i=>{const film=videos[i];
  const button=document.createElement('button');button.className='film-card';button.type='button';
  button.setAttribute('aria-label',`Play ${film.title}`);
  const cover=document.createElement('div');cover.className='film-cover';
  if(film.poster||film.id){
    const img=document.createElement('img');img.src=film.poster||`https://drive.google.com/thumbnail?id=${encodeURIComponent(film.id)}&sz=w1000`;img.alt='';img.loading='lazy';
    // Use an honest graphic fallback instead of unrelated work when Drive hides the thumbnail.
    img.addEventListener('error',()=>img.remove());cover.append(img);
  }
  cover.insertAdjacentHTML('beforeend',`<span class="play-icon" aria-hidden="true">▶</span><span class="film-number">ZOMEBXYZ / ${String(i+1).padStart(2,'0')}</span>${film.new?`<span class="new-tag" data-i18n="new_release">${translations[language].new_release}</span>`:''}`);
  button.append(cover);const meta=document.createElement('div');meta.className='film-meta';
  meta.innerHTML=`<span>${film.title} ↗</span><small>PLAY FILM</small>`;button.append(meta);
  button.addEventListener('click',()=>openViewer('video',i));filmsGrid.append(button);
  });
  group.append(header,filmsGrid);grid.append(group);
});
function setVideoCategory(category){
  const showFeatured=featuredFilm&&(category==='all'||featuredFilm.category===category);
  if(featuredCard)featuredCard.hidden=!showFeatured;
  filters.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===category)));
  grid.querySelectorAll('.video-category').forEach(group=>{group.hidden=category!=='all'&&group.dataset.category!==category;});
  videoOrder=categories.filter(group=>category==='all'||group.id===category).flatMap(group=>categoryOrder.get(group.id));
  if(showFeatured)videoOrder.unshift(featuredIndex);
}
setVideoCategory('all');
photos.forEach((src,i)=>{
  const button=document.createElement('button');button.type='button';button.className='photo-card';button.setAttribute('aria-label',`View photograph ${i+1}`);
  const img=document.createElement('img');img.src=src;img.alt=`ZOMEBXYZ photography — frame ${String(i+1).padStart(2,'0')}`;img.loading='lazy';
  button.append(img);button.insertAdjacentHTML('beforeend','<span aria-hidden="true">↗</span>');button.addEventListener('click',()=>openViewer('photo',i));document.getElementById('photo-grid').append(button);
});
const viewer=document.getElementById('viewer'),content=document.getElementById('viewer-content'),external=document.getElementById('external-video');
let currentType='photo',currentIndex=0,opener=null;
function renderViewer(){
  content.querySelectorAll('video').forEach(video=>{video.pause();video.removeAttribute('src');video.load();});
  viewer.classList.remove('cinema');
  content.replaceChildren();const isVideo=currentType==='video';external.hidden=!isVideo;
  document.getElementById('viewer-title').textContent=isVideo?videos[currentIndex].title:`FRAME ${String(currentIndex+1).padStart(2,'0')}`;
  document.getElementById('viewer-count').textContent=`${isVideo?videoOrder.indexOf(currentIndex)+1:currentIndex+1} / ${isVideo?videoOrder.length:photos.length}`;
  if(isVideo){
    const film=videos[currentIndex];
    content.append(createVideoPlayer(film));external.href=film.id?`https://drive.google.com/file/d/${film.id}/view`:film.url;
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
function step(direction){if(currentType==='video'){const position=videoOrder.indexOf(currentIndex);currentIndex=videoOrder[(position+direction+videoOrder.length)%videoOrder.length];}else{currentIndex=(currentIndex+direction+photos.length)%photos.length;}renderViewer();}
document.getElementById('previous').addEventListener('click',()=>step(-1));document.getElementById('next').addEventListener('click',()=>step(1));
document.getElementById('close-viewer').addEventListener('click',closeViewer);
viewer.addEventListener('cancel',e=>{e.preventDefault();closeViewer();});
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeViewer();}});
viewer.addEventListener('close',()=>{content.querySelectorAll('video').forEach(video=>{video.pause();video.removeAttribute('src');video.load();});content.replaceChildren();closingViewer=false;viewer.classList.remove('is-closing','cinema');document.body.classList.remove('viewer-open');opener?.focus();});
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
