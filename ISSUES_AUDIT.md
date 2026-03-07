# Game & GUI Audit – Issues List

Review done as **gamer programmer** and **GUI expert**. Issues are grouped by severity and category.  
**Status: fixes applied (see below).**

---

## Critical (bugs that can break the game)

### 1. **sounds.js – `playHurray()` will throw** ✅ FIXED
- **Where:** `sounds.js` lines 93–129
- **What:** The function uses `c` (AudioContext) but never defines it. There is a `} catch (e) {}` at the end but no matching `try {` at the start.
- **Effect:** When a level is completed or the player wins, `playHurray()` is called and throws `ReferenceError: c is not defined`. The victory fanfare never plays and the error can show in the console.
- **Fix:** At the start of `playHurray()`, add `try {` and `var c = getCtx();` (and keep the existing `} catch (e) {}`).

---

## High (UX / design / logic issues)

### 2. **Level row duplicates timer information**
- **Where:** In-game UI shows both the countdown (e.g. `0:28`) and the level row text `Level 1 · 30 sec` plus a progress bar.
- **What:** Two representations of the same thing: numeric countdown and “30 sec” + bar.
- **Suggestion:** Either remove “· 30 sec” from the level label and use the bar only as “time left” (no number in the label), or keep the countdown and simplify the level row to e.g. “Level 1” only (no time text, optional bar).

### 3. **Game Over doesn’t show level reached**
- **Where:** `game.js` – `finalScoreEl.textContent = 'You got ' + score + ' points!';`
- **What:** The Game Over screen only shows points, not the level the player reached.
- **Suggestion:** e.g. `'You reached Level ' + level + ' with ' + score + ' points!'` so players see both level and score.

### 4. **Only one laser–ship hit per frame (Level 2)**
- **Where:** `game.js` – `checkLaserShipHits()` returns after the first laser–ship collision.
- **What:** If two lasers hit two ships in the same frame, only one hit is counted.
- **Effect:** With turbo (multiple lasers), some hits can be “lost” when they occur in the same frame.
- **Fix:** Don’t `return` after the first hit; continue the loop so all collisions in that frame are processed.

### 5. **Only one player–alien hit per frame (Level 3)**
- **Where:** `game.js` – `checkDuelHits()` returns after the first player laser hitting an alien.
- **What:** Same as above: multiple laser hits in one frame only count once.
- **Fix:** Same pattern: process all hits in the loop instead of returning on the first.

### 6. **Top row can be crowded on small screens**
- **Where:** `#top-row` contains: score, timer, Pause, Exit, Pilot hearts, Alien hearts.
- **What:** On narrow viewports this can wrap or feel cramped.
- **Suggestion:** Consider a slightly smaller font for timer/lives on small screens, or a two-line layout (e.g. score + timer on first line; Pause, Exit, hearts on second).

---

## Medium (polish, consistency, dead code)

### 7. **Game footer is never shown**
- **Where:** `#game-footer` has class `hidden` (CSS: `display: none !important`). `startGame()` adds `visible` but never removes `hidden`.
- **What:** Footer is always hidden; toggling `visible` has no effect.
- **Fix:** Either remove the footer from the layout/JS if unused, or remove the `hidden` class when showing the game UI so the footer can actually display when intended.

### 8. **Dead CSS**
- **Where:** `style.css`
- **What:** Rules for elements that don’t exist in the HTML:
  - `#moon-progress`, `#moon-label`, `#progress-bar`, `#progress-fill`
  - `#mode-choice-label`, `#mode-buttons`
  - `#win-screen` (game uses `#level-complete` instead)
- **Suggestion:** Delete these rules to keep the stylesheet accurate and easier to maintain.

### 9. **Unused config**
- **Where:** `config.js` – `POINTS_PER_LEVEL: 200`
- **What:** Game uses a fixed 30-second timer per level, not a points goal.
- **Suggestion:** Remove `POINTS_PER_LEVEL` or document that it’s reserved for a future mode.

### 10. **Exit Game uses native `confirm()`**
- **Where:** `game.js` – `exitGame()` uses `confirm('Exit game...')`
- **What:** Native dialog doesn’t match the game’s visual style.
- **Suggestion:** Replace with a small in-game modal (e.g. “Exit?” with “Yes” / “No” buttons) for consistency.

### 11. **Alien hearts visible on Level 1 and 2**
- **Where:** Top-right UI shows “Alien” + 5 green hearts on all levels.
- **What:** Alien lives only matter in Level 3; on L1/L2 it can confuse players (“why are there alien hearts?”).
- **Suggestion:** Either hide the Alien block until Level 3, or add a short tooltip/label (e.g. “Alien (Level 3)” or grayed out “—”) so the intent is clear.

---

## Low (accessibility, focus, minor UX)

### 12. **No focus ring on touch buttons**
- **Where:** `.touch-only .touch-btn` has no `:focus-visible` style.
- **What:** Keyboard or switch users don’t get a clear focus indicator.
- **Fix:** Add e.g. `outline` or `box-shadow` for `:focus-visible` on `.touch-btn` (and other buttons if missing).

### 13. **Focus not moved to overlays**
- **Where:** When opening Pause or Level complete overlays, focus is not moved to the overlay or the primary button.
- **What:** Keyboard/screen-reader users may still be focused on content behind the overlay.
- **Suggestion:** On overlay open, call `.focus()` on the Resume / Next Level button and trap Tab inside the overlay until closed.

### 14. **Timer has no live region for screen readers**
- **Where:** `#game-timer` (countdown).
- **What:** When time is low or changes, screen readers aren’t notified.
- **Suggestion:** Add `aria-live="polite"` (and optionally `aria-atomic="true"`) to the timer element when time ≤ 10 s.

### 15. **Pause: two “Resume” actions**
- **Where:** Top bar button switches to “Resume” and the overlay also has a “Resume” button.
- **What:** Slightly redundant; both are correct but could be simplified (e.g. one prominent “Resume” in the overlay and the top bar only “Pause” when running).

### 16. **Contrast** ✅ FIXED
- Controls hint text opacity increased from 0.8 to 0.92.
- **Where:** Text such as `rgba(255,255,255,0.8)` on dark background.
- **What:** May not meet WCAG AA for small text.
- **Suggestion:** Check contrast (e.g. 4.5:1 for normal text) and increase opacity or use a lighter background where needed.

---

## Summary

| Severity | Count |
|----------|--------|
| Critical | 1 |
| High     | 5 |
| Medium   | 5 |
| Low      | 5 |

**Suggested order to fix:**  
1) Fix `playHurray()` in `sounds.js`.  
2) Optionally simplify level row vs countdown and fix one-hit-per-frame in Level 2 and 3.  
3) Clean dead CSS/footer/config and improve Game Over message and exit confirmation.  
4) Then accessibility and focus/contrast improvements.
