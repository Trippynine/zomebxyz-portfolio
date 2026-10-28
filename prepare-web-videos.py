"""Prepare web-compatible, fast-start H.264/AAC copies of the portfolio films.

Offline only: pip install imageio-ffmpeg. Original Drive/Dropbox links remain in app.js.
"""
from pathlib import Path
import json,re,subprocess,concurrent.futures
import imageio_ffmpeg

root=Path(__file__).parent
films=json.loads(re.search(r'const videos = (.*?);', (root/'app.js').read_text(encoding='utf-8'))[1])
destination=root/'assets/video';destination.mkdir(exist_ok=True)
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
def prepare(pair):
    i,film=pair
    target=destination/f'film-{i:02}.mp4'
    if target.exists() and target.stat().st_size>10000:return str(target.name)+' already prepared'
    source=f"https://drive.usercontent.google.com/download?id={film['id']}&export=download&confirm=t" if film.get('id') else film['url']
    command=[ffmpeg,'-hide_banner','-loglevel','error','-nostdin','-y','-i',source,'-map','0:v:0','-map','0:a:0?','-vf',"scale=w='if(gte(iw,ih),min(960,iw),-2)':h='if(gte(iw,ih),-2,min(960,ih))',fps=30",'-c:v','libx264','-preset','fast','-crf','25','-maxrate','1800k','-bufsize','3600k','-pix_fmt','yuv420p','-threads','2','-c:a','aac','-b:a','96k','-ac','2','-movflags','+faststart','-map_metadata','-1',str(target)]
    result=subprocess.run(command,capture_output=True,text=True)
    if result.returncode:
        target.unlink(missing_ok=True)
        return f'FAILED Film {i:02}: '+result.stderr[-900:]
    return f'{target.name}: {target.stat().st_size/1000000:.1f} MB'
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    jobs=[pool.submit(prepare,pair) for pair in enumerate(films,1)]
    for job in concurrent.futures.as_completed(jobs):print(job.result(),flush=True)
