# Rocket to the Moon

A **web game for kids**: fly a rocket through the night sky across three levels. Use arrow keys (or on-screen buttons on phone) to move, collect stars, dodge obstacles, shoot ships in level 2, and duel on the moon in level 3. No account, ads, or in-app purchases.

## Quick start

- Open `index.html` in a browser (or serve the folder with any static server).
- On the start screen: pick **Easy** or **Hard**, enter a pilot name, then **Let's Go!**.
- **Level 1:** ⬆️ ⬇️ move; collect ⭐ stars (+10 pts), avoid 🛸 obstacles. **30 seconds** per level.
- **Level 2:** Same lanes + **Enter** (or 🔫) to shoot; hit ships for points.
- **Level 3:** Moon duel – move and shoot to hit aliens while dodging their lasers.
- **H** = buy +1 life (25 pts). **Shift** = Turbo shot for 10 sec (25 pts). **Space** = Pause.

## Install on your iPhone (play as an app)

The game is a **Progressive Web App (PWA)**. You can add it to your home screen and open it like an app.

1. **Put the game on the web**  
   You need the game to be served over **HTTPS** (not `file://`). For example:
   - **GitHub Pages:** Push this folder to a GitHub repo, enable Pages in repo Settings → Pages (source: main branch, folder: root or /docs).
   - **Netlify / Vercel:** Drag the project folder to [netlify.com/drop](https://app.netlify.com/drop) or connect the repo.
   - **Your own server:** Upload the folder to any web host that serves static files.

2. **On your iPhone**  
   - Open **Safari** and go to the game’s URL (e.g. `https://yourusername.github.io/your-repo/`).
   - Tap the **Share** button (square with arrow).
   - Tap **Add to Home Screen**.
   - Name it (e.g. “Rocket Moon”) and tap **Add**.

3. **Open the app**  
   Tap the new icon on your home screen. The game opens in full screen without Safari’s address bar. Use the **on-screen buttons** at the bottom (⬆️ ⬇️ 🔫 ❤️+ ⚡ ⏸) to play.

**Optional:** To use a custom app icon, add PNGs named `icon-192.png` (192×192) and `icon-512.png` (512×512) into the `icons/` folder. If they’re missing, iOS uses a screenshot of the page as the icon.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Page structure: game world (sky, duel), UI, start screen, overlays, touch controls. |
| `manifest.json` | PWA manifest (name, icons, display mode) for “Add to Home Screen”. |
| `config.js` | **Single source of game constants** – points, speeds, 30s per level, difficulty. |
| `game.js` | Main logic: DOM refs, state, pause/timer, spawners, movement, collision, level flow, input. |
| `touch.js` | On-screen touch buttons on mobile; dispatches keyboard events so the game works without a keyboard. |
| `style.css` | Layout, theme variables, and styles for all screens and levels. |
| `sounds.js` | Web Audio API sound effects and music (no external files). |

Script load order: `config.js` → `sounds.js` → `game.js` → `touch.js`.

## Customisation and extending

- **Balance and timing:** Change values in `config.js` (e.g. `SECONDS_PER_LEVEL`, `COST_EXTRA_LIFE`, `COST_TURBO_SHOT`). The game reads these at runtime; no rebuild needed.
- **New levels:** Add level state and DOM in `index.html` and `style.css`; in `game.js` extend the level-complete/start-next-level flow and game loop branches (see section comments 9–10).
- **New sounds:** Add functions in `sounds.js` and expose them on the returned API; call from `game.js` where appropriate.
- **New UI or modes:** Add elements in `index.html`, style in `style.css`, and wire options in `game.js`.

No build step required. Use a local server if you need to avoid file:// restrictions (e.g. for audio or PWA).
