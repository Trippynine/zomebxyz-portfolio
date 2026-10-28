// Controls stay in normal document flow below the video, including on iPhone.
function createVideoPlayer(film){
  const player=document.createElement('div');player.className='media-player';
  const video=document.createElement('video');video.playsInline=true;video.setAttribute('webkit-playsinline','');video.preload='metadata';video.controls=false;
  video.setAttribute('aria-label',film.title);
  video.src=film.src||(film.id?`https://drive.usercontent.google.com/download?id=${encodeURIComponent(film.id)}&export=download&confirm=t`:film.url);
  if(film.id)video.poster=`https://drive.google.com/thumbnail?id=${encodeURIComponent(film.id)}&sz=w1000`;
  const screen=document.createElement('div');screen.className='media-screen';screen.append(video);
  const controls=document.createElement('div');controls.className='media-controls';
  controls.innerHTML='<div class="media-seek"><span class="media-current">0:00</span><input type="range" min="0" max="1000" value="0" step="1" aria-label="ตำแหน่งวิดีโอ / Seek"><span class="media-duration">–:––</span></div><div class="media-actions"><button class="media-play" aria-label="เล่น / Play">▶</button><button class="media-back" aria-label="ย้อน 10 วินาที / Back 10 seconds">−10s</button><button class="media-forward" aria-label="ข้าม 10 วินาที / Forward 10 seconds">+10s</button><button class="media-mute" aria-label="ปิดเสียง / Mute">เสียง</button><select class="media-speed" aria-label="ความเร็ว / Playback speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select><button class="media-expand" aria-label="ขยาย / Expand">⛶</button></div><p class="media-status" role="status" aria-live="polite">กด ▶ เพื่อเล่น / Press ▶ to play</p>';
  const play=controls.querySelector('.media-play'),seek=controls.querySelector('input'),status=controls.querySelector('.media-status');
  const clock=seconds=>{if(!Number.isFinite(seconds))return '–:––';const s=Math.floor(seconds);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
  function update(){const duration=video.duration;controls.querySelector('.media-current').textContent=clock(video.currentTime);controls.querySelector('.media-duration').textContent=clock(duration);seek.disabled=!Number.isFinite(duration)||duration<=0;if(!seek.disabled)seek.value=String(Math.round(video.currentTime/duration*1000));}
  async function toggle(){
    if(!video.paused){video.pause();return;}
    status.textContent='กำลังโหลดวิดีโอ… / Loading…';
    try{await video.play();}catch{status.textContent='เล่นไฟล์นี้ไม่ได้ กรุณาเปิดวิดีโอต้นฉบับด้านล่าง / Open the original video below.';}
  }
  play.addEventListener('click',toggle);video.addEventListener('click',toggle);
  video.addEventListener('play',()=>{play.textContent='Ⅱ';play.setAttribute('aria-label','หยุดชั่วคราว / Pause');});
  video.addEventListener('playing',()=>{status.textContent='';});
  video.addEventListener('pause',()=>{play.textContent='▶';play.setAttribute('aria-label','เล่น / Play');});
  video.addEventListener('ended',()=>{play.textContent='▶';status.textContent='เล่นจบแล้ว / Ended';});
  video.addEventListener('waiting',()=>{status.textContent='กำลังโหลดวิดีโอ… / Loading…';});
  video.addEventListener('error',()=>{status.textContent='เล่นไฟล์นี้ไม่ได้ กรุณาเปิดวิดีโอต้นฉบับด้านล่าง / Open the original video below.';});
  video.addEventListener('loadedmetadata',update);video.addEventListener('timeupdate',update);video.addEventListener('durationchange',update);
  seek.addEventListener('input',()=>{if(Number.isFinite(video.duration))video.currentTime=Number(seek.value)/1000*video.duration;});
  const jump=delta=>{if(Number.isFinite(video.duration))video.currentTime=Math.max(0,Math.min(video.duration,video.currentTime+delta));};
  controls.querySelector('.media-back').addEventListener('click',()=>jump(-10));controls.querySelector('.media-forward').addEventListener('click',()=>jump(10));
  const mute=controls.querySelector('.media-mute');mute.addEventListener('click',()=>{video.muted=!video.muted;mute.textContent=video.muted?'เงียบ':'เสียง';mute.setAttribute('aria-label',video.muted?'เปิดเสียง / Unmute':'ปิดเสียง / Mute');});
  controls.querySelector('select').addEventListener('change',e=>{video.playbackRate=Number(e.target.value);});
  controls.querySelector('.media-expand').addEventListener('click',()=>{player.closest('dialog')?.classList.toggle('cinema');});
  controls.addEventListener('keydown',e=>{e.stopPropagation();});
  update();player.append(screen,controls);return player;
}
