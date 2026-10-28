# ZOMEBXYZ portfolio

A static, bilingual portfolio. Open `index.html`, or run `python -m http.server 4173 --bind 127.0.0.1` and visit `http://127.0.0.1:4173`.

## Editing

- `index.html`: page structure, existing services, rates, and contact information.
- `styles.css`: responsive design and media viewer styles.
- `app.js`: video and photo lists, and the original translation dictionary.
- `interactions.js`: additional translations, language switch, mobile menu, photo viewer, and video player.
- `media-player.js`: inline video playback with controls in a separate row below the footage.
- `assets/`: supplied portrait and behind-the-scenes photographs.

The hero now uses the user-selected `assets/portrait-cutout-hires.png` (1077 × 1461), copied directly from the attached cutout. It is displayed without additional image filters, replacing the earlier 445 × 720 original-photo crop. The earlier original-photo cutout and its pixel-preserving preparation script remain available as alternatives. The Crimson Noir palette uses near-black `#02060E`, crimson `#C50037`, and lighter rose accents for readable small text. The software marks use the user-selected Adobe reference sheet (first row, via CSS sprites) and the DaVinci Resolve Studio PNG. Source information is in `assets/icons/ATTRIBUTION.md`.

`glass.css` adds translucent navigation, buttons, rounded media cards and dialogs, with blur/saturation where supported and a readable solid fallback. Native modal dialogs retain focus management and Escape support; their close waits for the short exit animation before unloading playback. Reveal and popup animations respect `prefers-reduced-motion`. These are web effects inspired by glass interfaces, not Apple's native Liquid Glass implementation.

Add a film to `videos` in `app.js` using `{id: 'FILE_ID', src: 'assets/video/film-10.mp4', title: 'Project name', new: true}`. Keep the original accessible to the intended visitors in Drive. Use `prepare-web-videos.py` (offline dependency: `imageio-ffmpeg`) to prepare web copies, then set each `src` to its matching output. The page uses Drive thumbnails and offers an original-file link. If a thumbnail cannot load, a graphic play card remains available.

All nine films now have local H.264/AAC MP4 copies under `assets/video/`, capped at 960 px on the longer edge and 30 fps, with fast-start metadata for streaming. The original files and original links are retained. This avoids the iOS/Drive embedded player's large native overlay. The inline `<video playsinline>` has no native `controls`; play/pause, seek, ±10 seconds, mute, speed and expand buttons occupy a separate row below the picture. Expand enlarges the website dialog rather than invoking iOS's native fullscreen video UI. Closing or changing films explicitly pauses and unloads the previous source. Static hosting must serve MP4 byte-range requests for reliable seeking; GitHub Pages supports this.

Video titles currently use neutral `Film 01`–`Film 09` labels pending project names. The two supplied Drive links appear first. Add gallery image paths to `photos` in `app.js`. The site does not change original-provider permissions; web playback copies are published with the portfolio.

Language preference uses browser local storage and falls back gracefully if storage is unavailable. The site has no authentication or backend. Google Fonts, Font Awesome, Tailwind CDN, and remote video services require internet access.

## Verification of redesign

- JavaScript syntax checks: `node --check app.js` and `node --check interactions.js`.
- Browser checks at 360, 390, and 1280 px: no horizontal content overflow.
- Mobile menu opens and closes on navigation; Thai/English switch updates page language.
- Landscape Film 01 and portrait Film 02 play in the custom player at mobile viewport size. Verified advancing playback time, seek, mute and playback speed using a byte-range-enabled local server. Physical iOS/Messenger testing remains to be checked.
- Photo viewer opens and advances; Escape closes and removes embedded players. Dialog focus returns to its opener.
- Nine video cards and twelve photographs remain available. No Google Drive iframe is used; video sources load on opening a film.
- Local images load and browser console reports no errors during the checked flow.

The updated portfolio replaces the original root `index.html` and remains compatible with static hosting such as GitHub Pages. Publish the repository root from `main` using the repository's existing hosting configuration.
