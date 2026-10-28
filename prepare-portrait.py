"""Make an alpha-only cutout. RGB is copied directly from the supplied photograph.

Offline preparation only; Pillow, numpy and rembg are not website dependencies.
Run after installing rembg[cpu], Pillow and numpy in your preferred Python environment.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

root=Path(__file__).parent
source=Image.open(root/'assets/portrait.jpg').convert('RGB')
cutout_path=root/'assets/portrait-cutout.png'
if not cutout_path.exists():
    from rembg import remove,new_session
    remove(source,session=new_session('u2net')).save(cutout_path)
alpha=Image.open(cutout_path).getchannel('A')
# Remove faint background remnants without changing any source RGB values.
alpha=alpha.point(lambda value: max(0,min(255,round((value-24)*255/207))))
draw=ImageDraw.Draw(alpha)
# The segmentation sees the person reliably but misses the dark camera. Restore
# equipment using a hand-traced outline in a 2x inspection crop's coordinates.
def trace(points,fill=255):
    draw.polygon([(440+x/2,280+y/2) for x,y in points],fill=fill)
trace([(83,649),(125,647),(128,665),(168,660),(184,671),(220,670),(228,681),(258,682),(268,669),(295,665),(311,676),(322,695),(319,716),(312,730),(314,753),(312,780),(295,800),(280,818),(288,821),(318,806),(337,812),(358,805),(386,789),(397,774),(398,755),(383,749),(380,730),(384,718),(404,725),(420,740),(428,765),(425,790),(407,809),(385,823),(362,841),(343,852),(333,871),(318,883),(306,880),(301,866),(282,870),(261,867),(253,875),(241,865),(248,852),(244,844),(260,823),(270,798),(280,777),(283,754),(276,744),(252,744),(246,759),(227,766),(221,791),(205,804),(192,809),(195,819),(190,825),(168,817),(159,810),(130,809),(109,816),(84,812),(79,806),(65,809),(63,798),(51,798),(59,781),(65,762),(54,753),(50,742),(52,721),(59,708),(77,706),(85,694)])
trace([(275,522),(294,518),(310,511),(328,508),(352,515),(374,528),(402,540),(417,548),(420,557),(412,566),(393,575),(394,591),(407,591),(408,605),(393,614),(378,621),(355,615),(355,598),(347,582),(324,573),(307,563),(287,551),(271,539)])
trace([(365,844),(399,838),(428,847),(441,865),(444,889),(435,917),(436,934),(448,951),(443,968),(453,987),(473,1011),(502,1044),(525,1071),(526,1087),(516,1091),(508,1086),(503,1094),(488,1087),(466,1066),(443,1044),(422,1020),(404,995),(389,978),(364,975),(352,968),(346,957),(329,952),(325,942),(315,938),(308,930),(313,918),(305,914),(304,904),(318,891),(332,878),(343,865)])
# Stabilizer gap, and a screen fragment above the left shoulder.
trace([(228,771),(271,761),(272,782),(260,811),(246,825),(224,823)],0)
trace([(450,392),(587,392),(563,411),(532,431),(505,455),(477,486),(457,524),(444,553)],0)
alpha=alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.3))
result=source.convert('RGBA');result.putalpha(alpha)
result.save(cutout_path)
crop=(450,285,895,1005)
hero=result.crop(crop);hero.save(root/'assets/portrait-original-hero.png')
original_rgb=np.array(source.crop(crop))
saved_rgb=np.array(hero.convert('RGB'))
assert np.array_equal(original_rgb,saved_rgb),'RGB must remain exactly original'
print('Verified: all RGB pixels are identical to the corresponding original photograph; only alpha and crop differ.')
