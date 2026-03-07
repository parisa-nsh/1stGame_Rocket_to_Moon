(function () {
  'use strict';

  var cfg = window.GameConfig || {};

  /* ─── 1. DOM references ───────────────────────────────────────────────── */
  const rocket = document.getElementById('rocket');
  const moon = document.getElementById('moon');
  const collectiblesEl = document.getElementById('collectibles');
  const obstaclesEl = document.getElementById('obstacles');
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');
  const levelLabelEl = document.getElementById('level-label');
  const levelProgressFill = document.getElementById('level-progress-fill');
  const controlsHint = document.getElementById('controls-hint');
  const instructions = document.getElementById('instructions');
  const startBtn = document.getElementById('start-btn');
  const gameOverEl = document.getElementById('game-over');
  const finalScoreEl = document.getElementById('final-score');
  const restartBtn = document.getElementById('restart-btn');
  const levelCompleteEl = document.getElementById('level-complete');
  const levelCompleteMsg = document.getElementById('level-complete-msg');
  const nextLevelBtn = document.getElementById('next-level-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resumeBtn = document.getElementById('resume-btn');
  const pauseOverlay = document.getElementById('pause-overlay');
  const pilotNameEl = document.getElementById('pilot-name');
  const rocketNameInput = document.getElementById('rocket-name-input');
  const scoreWrap = document.getElementById('score-wrap');
  const playerLasersEl = document.getElementById('player-lasers');
  const enemyShipsEl = document.getElementById('enemy-ships');
  const skyEl = document.getElementById('sky');
  const duelSceneEl = document.getElementById('duel-scene');
  const duelPlayerEl = document.getElementById('duel-player');
  const duelAlienEl = document.getElementById('duel-alien');
  const duelAlien2El = document.getElementById('duel-alien2');
  const duelPlayerLasersEl = document.getElementById('duel-player-lasers');
  const duelAlienLasersEl = document.getElementById('duel-alien-lasers');
  const timerWrap = document.getElementById('timer-wrap');
  const gameTimerEl = document.getElementById('game-timer');
  const exitBtn = document.getElementById('exit-btn');
  const exitBtnWrap = document.getElementById('exit-btn-wrap');
  const diffEasyBtn = document.getElementById('diff-easy');
  const diffHardBtn = document.getElementById('diff-hard');

  /* ─── 2. Config (fallbacks) & state ─────────────────────────────────────── */
  /* Derived from config with fallbacks */
  const LANE_COUNT = cfg.LANE_COUNT != null ? cfg.LANE_COUNT : 2;
  const ROCKET_X_PERCENT = cfg.ROCKET_X_PERCENT != null ? cfg.ROCKET_X_PERCENT : 14;
  const SCROLL_SPEED_BASE = cfg.SCROLL_SPEED_BASE != null ? cfg.SCROLL_SPEED_BASE : 2.45;
  const STAR_POINTS = cfg.STAR_POINTS != null ? cfg.STAR_POINTS : 10;
  const CRASH_POINTS_LOST = cfg.CRASH_POINTS_LOST != null ? cfg.CRASH_POINTS_LOST : 10;
  const STARTING_POINTS = cfg.STARTING_POINTS != null ? cfg.STARTING_POINTS : 10;
  const SHIP_POINTS = cfg.SHIP_POINTS != null ? cfg.SHIP_POINTS : 20;
  const TOTAL_LIVES = cfg.TOTAL_LIVES != null ? cfg.TOTAL_LIVES : 5;
  const INVINCIBLE_MS = cfg.INVINCIBLE_MS != null ? cfg.INVINCIBLE_MS : 1500;
  const COLLISION_MARGIN = cfg.COLLISION_MARGIN != null ? cfg.COLLISION_MARGIN : 28;
  const LASER_SPEED = cfg.LASER_SPEED != null ? cfg.LASER_SPEED : 12;
  const DUEL_LASER_SPEED = cfg.DUEL_LASER_SPEED != null ? cfg.DUEL_LASER_SPEED : 14;
  const DUEL_ALIEN_SHOOT_INTERVAL = cfg.DUEL_ALIEN_SHOOT_INTERVAL_MS != null ? cfg.DUEL_ALIEN_SHOOT_INTERVAL_MS : 1200;
  const DUEL_ALIEN_MOVE_INTERVAL = cfg.DUEL_ALIEN_MOVE_INTERVAL_MS != null ? cfg.DUEL_ALIEN_MOVE_INTERVAL_MS : 600;
  const ALIEN_LIVES = cfg.ALIEN_LIVES != null ? cfg.ALIEN_LIVES : 5;
  const ALIEN_HIT_POINTS = cfg.ALIEN_HIT_POINTS != null ? cfg.ALIEN_HIT_POINTS : 50;
  const TIMER_UPDATE_INTERVAL_MS = cfg.TIMER_UPDATE_INTERVAL_MS != null ? cfg.TIMER_UPDATE_INTERVAL_MS : 100;
  const TIMER_WARNING_AT_SECONDS = cfg.TIMER_WARNING_AT_SECONDS != null ? cfg.TIMER_WARNING_AT_SECONDS : 10;
  const HARD_SPEED_MULTIPLIER = cfg.HARD_SPEED_MULTIPLIER != null ? cfg.HARD_SPEED_MULTIPLIER : 1.15;
  const SECONDS_PER_LEVEL = cfg.SECONDS_PER_LEVEL != null ? cfg.SECONDS_PER_LEVEL : 30;
  const SECONDS_PER_LEVEL_3 = cfg.SECONDS_PER_LEVEL_3 != null ? cfg.SECONDS_PER_LEVEL_3 : 60;
  const COST_EXTRA_LIFE = cfg.COST_EXTRA_LIFE != null ? cfg.COST_EXTRA_LIFE : 25;
  const COST_TURBO_SHOT = cfg.COST_TURBO_SHOT != null ? cfg.COST_TURBO_SHOT : 25;
  const TURBO_SHOT_DURATION_MS = cfg.TURBO_SHOT_DURATION_MS != null ? cfg.TURBO_SHOT_DURATION_MS : 10000;
  const BUBBLE_DURATION_MS = cfg.BUBBLE_DURATION_MS != null ? cfg.BUBBLE_DURATION_MS : 10000;
  const LEVEL3_RESTART_POINTS_PENALTY = cfg.LEVEL3_RESTART_POINTS_PENALTY != null ? cfg.LEVEL3_RESTART_POINTS_PENALTY : 50;

  const LANE_Y_PERCENTS = cfg.LANE_Y_PERCENTS && cfg.LANE_Y_PERCENTS.length ? cfg.LANE_Y_PERCENTS : [25, 75];

  /* Game state */
  let gameRunning = false;
  let score = STARTING_POINTS;
  let level = 1;
  let lives = TOTAL_LIVES;
  let rocketLane = 1;
  let obstacleTimer = null;
  let starTimer = null;
  let shipTimer = null;
  let lastTime = 0;
  let invincibleUntil = 0;
  let keys = { ArrowUp: false, ArrowDown: false };
  let scrollSpeed = SCROLL_SPEED_BASE;
  let gamePaused = false;
  let alienLives = ALIEN_LIVES;
  let alien2Lives = 0;
  let duelAlienShootTimer = null;
  let duelAlienMoveTimer = null;
  let duelPlayerYPercent = 50;
  let duelAlienYPercent = 50;
  let gameTimeLeft = SECONDS_PER_LEVEL;
  let timerInterval = null;
  let gameHard = false;
  let duelAlien2YPercent = 30;
  let turboShotUntil = 0;
  let lastTickSec = -1;
  let lastTickHalfSec = -1;
  let musicSpedUp = false;
  let bubbleUntil = 0;
  let gameOverAtLevel3 = false;
  let savedScoreForLevel3Retry = 0;

  /* ─── 3. Helpers ───────────────────────────────────────────────────────── */
  function getSpeedMultiplierByProgress(progress) {
    var p = cfg.SPEED_PHASES || { first: 0.7, second: 0.8, third: 1.0 };
    if (progress < 1 / 3) return p.first;
    if (progress < 2 / 3) return p.second;
    return p.third;
  }

  function getObstacleInterval() {
    return Math.max(cfg.SPAWN_OBSTACLE_MIN_MS != null ? cfg.SPAWN_OBSTACLE_MIN_MS : 900, cfg.SPAWN_OBSTACLE_MAX_MS != null ? cfg.SPAWN_OBSTACLE_MAX_MS : 1500);
  }

  function getStarInterval() {
    return Math.max(cfg.SPAWN_STAR_MIN_MS != null ? cfg.SPAWN_STAR_MIN_MS : 1100, cfg.SPAWN_STAR_MAX_MS != null ? cfg.SPAWN_STAR_MAX_MS : 1300);
  }

  function getShipSpawnInterval() {
    return Math.max(cfg.SPAWN_SHIP_MIN_MS != null ? cfg.SPAWN_SHIP_MIN_MS : 1000, cfg.SPAWN_SHIP_MAX_MS != null ? cfg.SPAWN_SHIP_MAX_MS : 1400);
  }

  function getSecondsPerLevel() {
    return level === 3 ? SECONDS_PER_LEVEL_3 : SECONDS_PER_LEVEL;
  }

  /* ─── 4. Pause / resume / timer ─────────────────────────────────────────── */
  function pause() {
    if (!gameRunning || gamePaused) return;
    gamePaused = true;
    if (obstacleTimer) clearInterval(obstacleTimer);
    if (starTimer) clearInterval(starTimer);
    if (shipTimer) clearInterval(shipTimer);
    obstacleTimer = null;
    starTimer = null;
    shipTimer = null;
    if (level === 3) {
      if (duelAlienShootTimer) clearInterval(duelAlienShootTimer);
      if (duelAlienMoveTimer) clearInterval(duelAlienMoveTimer);
      duelAlienShootTimer = null;
      duelAlienMoveTimer = null;
    }
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    if (window.GameSounds) window.GameSounds.stopMusic();
    if (pauseOverlay) pauseOverlay.classList.add('visible');
    if (resumeBtn) resumeBtn.focus();
    if (pauseBtn) pauseBtn.textContent = 'Resume';
  }

  function resume() {
    if (!gameRunning || !gamePaused) return;
    gamePaused = false;
    if (window.GameSounds) window.GameSounds.startMusic();
    if (level === 1) {
      obstacleTimer = setInterval(spawnObstacle, getObstacleInterval());
      starTimer = setInterval(spawnStar, getStarInterval());
    } else if (level === 2) {
      shipTimer = setInterval(spawnEnemyShip, getShipSpawnInterval());
    } else if (level === 3) {
      duelAlienShootTimer = setInterval(duelAlienShoot, DUEL_ALIEN_SHOOT_INTERVAL);
      duelAlienMoveTimer = setInterval(duelAlienMove, DUEL_ALIEN_MOVE_INTERVAL);
    }
    timerInterval = setInterval(updateTimer, TIMER_UPDATE_INTERVAL_MS);
    lastTime = performance.now();
    if (pauseOverlay) pauseOverlay.classList.remove('visible');
    if (pauseBtn) pauseBtn.textContent = 'Pause';
  }

  function togglePause() {
    if (!gameRunning) return;
    if (gamePaused) resume();
    else pause();
  }

  /* ─── 5. UI ────────────────────────────────────────────────────────────── */
  function updateTimer() {
    if (!gameRunning || gamePaused) return;
    gameTimeLeft -= 0.1;
    if (gameTimeLeft <= 0) {
      gameTimeLeft = 0;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      if (level === 3) {
        endGame(false);
      } else {
        levelComplete();
      }
      return;
    }
    var sec = Math.ceil(gameTimeLeft);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    if (gameTimerEl) gameTimerEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    if (timerWrap && gameTimeLeft <= TIMER_WARNING_AT_SECONDS) timerWrap.classList.add('warning');
    if (gameTimerEl) {
      gameTimerEl.setAttribute('aria-live', gameTimeLeft <= TIMER_WARNING_AT_SECONDS ? 'polite' : 'off');
      if (gameTimeLeft <= TIMER_WARNING_AT_SECONDS) gameTimerEl.setAttribute('aria-atomic', 'true');
    }
    if (gameTimeLeft <= TIMER_WARNING_AT_SECONDS) {
      if (!musicSpedUp && window.GameSounds && window.GameSounds.setMusicTempo && window.GameSounds.startMusic) {
        musicSpedUp = true;
        window.GameSounds.setMusicTempo(220);
        window.GameSounds.startMusic();
      }
      var secFloor = Math.floor(gameTimeLeft);
      if (secFloor !== lastTickSec && window.GameSounds && window.GameSounds.playTick) {
        lastTickSec = secFloor;
        window.GameSounds.playTick();
      }
      if (gameTimeLeft <= 5) {
        var halfSec = Math.floor(gameTimeLeft * 2);
        if (halfSec !== lastTickHalfSec && window.GameSounds && window.GameSounds.playTick) {
          lastTickHalfSec = halfSec;
          window.GameSounds.playTick();
        }
      } else {
        lastTickHalfSec = -1;
      }
    } else {
      lastTickSec = -1;
      lastTickHalfSec = -1;
    }
  }

  function updateRocketPowerBar() {
    var secPerLevel = getSecondsPerLevel();
    var pct = Math.min(100, (gameTimeLeft / secPerLevel) * 100);
    if (levelProgressFill) levelProgressFill.style.width = pct + '%';
  }

  function isTurboActive() {
    return Date.now() < turboShotUntil;
  }

  function getContainer() {
    return document.getElementById('game-container');
  }

  function setRocketPosition() {
    rocket.style.left = ROCKET_X_PERCENT + '%';
    rocket.style.top = LANE_Y_PERCENTS[rocketLane] + '%';
    rocket.style.transform = 'translate(-50%, -50%)';
  }

  function updateUI() {
    if (scoreEl) scoreEl.textContent = 'Points: ' + score;
    if (livesEl) livesEl.textContent = '❤️'.repeat(lives);
    var secPerLevel = getSecondsPerLevel();
    if (levelLabelEl) levelLabelEl.textContent = 'Level ' + level + ' • ' + secPerLevel + ' sec';
    var pct = Math.min(100, (gameTimeLeft / secPerLevel) * 100);
    if (levelProgressFill) levelProgressFill.style.width = pct + '%';
    updateRocketPowerBar();
    var turboEl = document.getElementById('turbo-indicator');
    if (turboEl) turboEl.classList.toggle('active', isTurboActive());
    var bubbleActive = Date.now() < bubbleUntil;
    if (rocket) rocket.classList.toggle('bubble', bubbleActive && (level === 1 || level === 2));
    if (duelPlayerEl) duelPlayerEl.classList.toggle('bubble', bubbleActive && level === 3);
    var alienLivesEl = document.getElementById('alien-lives');
    var alienWrap = document.getElementById('alien-lives-wrap');
    var alienLabel = document.getElementById('alien-lives-label');
    if (level === 3) {
      if (alienLivesEl) alienLivesEl.textContent = '💚'.repeat(Math.max(0, alienLives));
      if (alienWrap) alienWrap.classList.add('visible');
      if (alienLabel) alienLabel.style.display = '';
      var alien2LivesEl = document.getElementById('alien2-lives');
      var alien2Wrap = document.getElementById('alien-lives-wrap-2');
      var alien2Label = document.getElementById('alien2-lives-label');
      if (gameHard) {
        if (alien2LivesEl) alien2LivesEl.textContent = '💚'.repeat(Math.max(0, alien2Lives));
        if (alien2Wrap) alien2Wrap.classList.add('visible');
        if (alien2Label) { alien2Label.classList.add('visible'); alien2Label.style.display = ''; }
      } else {
        if (alien2Wrap) alien2Wrap.classList.remove('visible');
        if (alien2Label) { alien2Label.classList.remove('visible'); alien2Label.style.display = 'none'; }
      }
    } else {
      if (alienLivesEl) alienLivesEl.textContent = '💚'.repeat(ALIEN_LIVES);
      if (alienWrap) alienWrap.classList.remove('visible');
      if (alienLabel) alienLabel.style.display = 'none';
    }
  }

  /* ─── 6. Spawners ──────────────────────────────────────────────────────── */
  function spawnStar() {
    if (!gameRunning || level !== 1) return;
    var el = document.createElement('div');
    el.className = 'collectible star';
    el.setAttribute('aria-hidden', 'true');
    el.dataset.type = 'star';
    var lane = Math.floor(Math.random() * LANE_COUNT);
    el.dataset.lane = String(lane);
    var container = getContainer();
    el.style.left = container.offsetWidth + 40 + 'px';
    el.style.top = LANE_Y_PERCENTS[lane] + '%';
    el.style.transform = 'translate(0, -50%)';
    el.textContent = '⭐';
    collectiblesEl.appendChild(el);
  }

  function spawnObstacle() {
    if (!gameRunning || level !== 1) return;
    var el = document.createElement('div');
    el.className = 'obstacle floating';
    el.setAttribute('aria-hidden', 'true');
    el.dataset.type = 'obstacle';
    var lane = Math.floor(Math.random() * LANE_COUNT);
    el.dataset.lane = String(lane);
    var container = getContainer();
    el.style.left = container.offsetWidth + 40 + 'px';
    el.style.top = LANE_Y_PERCENTS[lane] + '%';
    el.style.transform = 'translate(0, -50%)';
    el.textContent = '🛸';
    obstaclesEl.appendChild(el);
  }

  function spawnEnemyShip() {
    if (!gameRunning || level !== 2 || !enemyShipsEl) return;
    var el = document.createElement('div');
    el.className = 'enemy-ship';
    el.setAttribute('aria-hidden', 'true');
    el.dataset.type = 'ship';
    var lane = Math.floor(Math.random() * LANE_COUNT);
    el.dataset.lane = String(lane);
    var container = getContainer();
    el.style.left = container.offsetWidth + 40 + 'px';
    el.style.top = LANE_Y_PERCENTS[lane] + '%';
    el.style.transform = 'translate(0, -50%)';
    el.textContent = '🛸';
    enemyShipsEl.appendChild(el);
  }

  function firePlayerLaser() {
    if (level !== 2 || !playerLasersEl || !rocket) return;
    var r = rocket.getBoundingClientRect();
    var container = getContainer();
    var cr = container.getBoundingClientRect();
    var baseLeft = r.right - cr.left + 10;
    var baseTop = r.top - cr.top + r.height / 2 - 3;
    var turbo = isTurboActive();
    var angles = turbo ? [0, -22.5, 22.5] : [0];
    for (var i = 0; i < angles.length; i++) {
      var angleDeg = angles[i];
      var rad = (angleDeg * Math.PI) / 180;
      var dx = LASER_SPEED * Math.cos(rad);
      var dy = angleDeg === 0 ? 0 : LASER_SPEED * Math.sin(rad) * 0.4;
      var laser = document.createElement('div');
      laser.className = 'laser';
      laser.dataset.lane = String(rocketLane);
      laser.style.left = baseLeft + 'px';
      laser.style.top = baseTop + 'px';
      laser.dataset.dx = String(dx);
      laser.dataset.dy = String(-dy);
      playerLasersEl.appendChild(laser);
    }
    if (window.GameSounds) window.GameSounds.playLaser();
  }

  /* ─── 7. Movement & scrolling ───────────────────────────────────────────── */
  function moveAll(dt) {
    var move = scrollSpeed * (dt / 16);
    if (gameHard && (level === 1 || level === 2)) move *= HARD_SPEED_MULTIPLIER;
    var width = getContainer().offsetWidth;

    if (level === 1) {
      Array.from(collectiblesEl.children).forEach(function (node) {
        var left = parseFloat(node.style.left) || width;
        node.style.left = (left - move) + 'px';
        if (parseFloat(node.style.left) < -60) node.remove();
      });
      Array.from(obstaclesEl.children).forEach(function (node) {
        var left = parseFloat(node.style.left) || width;
        node.style.left = (left - move) + 'px';
        if (parseFloat(node.style.left) < -60) node.remove();
      });
    }

    if (level === 2 && enemyShipsEl) {
      Array.from(enemyShipsEl.children).forEach(function (node) {
        var left = parseFloat(node.style.left) || width;
        node.style.left = (left - move) + 'px';
        if (parseFloat(node.style.left) < -60) node.remove();
      });
    }

    if (playerLasersEl) {
      Array.from(playerLasersEl.children).forEach(function (node) {
        var left = parseFloat(node.style.left) || 0;
        var top = parseFloat(node.style.top) || 0;
        var dx = parseFloat(node.dataset.dx) || LASER_SPEED;
        var dy = parseFloat(node.dataset.dy) || 0;
        node.style.left = (left + dx * (dt / 16)) + 'px';
        node.style.top = (top + dy * (dt / 16)) + 'px';
        if (left > width + 50) node.remove();
      });
    }
  }

  function getRocketRect(containerRect) {
    var r = rocket.getBoundingClientRect();
    return {
      left: r.left - containerRect.left + COLLISION_MARGIN,
      right: r.right - containerRect.left - COLLISION_MARGIN,
      top: r.top - containerRect.top + COLLISION_MARGIN,
      bottom: r.bottom - containerRect.top - COLLISION_MARGIN
    };
  }

  function getItemRect(node, containerRect) {
    var r = node.getBoundingClientRect();
    return {
      left: r.left - containerRect.left,
      right: r.right - containerRect.left,
      top: r.top - containerRect.top,
      bottom: r.bottom - containerRect.top
    };
  }

  function rectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  /* ─── 8. Collision ─────────────────────────────────────────────────────── */
  function checkCollectStars(containerRect, rocketRect) {
    for (var i = collectiblesEl.children.length - 1; i >= 0; i--) {
      var node = collectiblesEl.children[i];
      if (parseInt(node.dataset.lane, 10) !== rocketLane) continue;
      var itemRect = getItemRect(node, containerRect);
      if (rectsOverlap(rocketRect, itemRect)) {
        node.remove();
        score += STAR_POINTS;
        updateUI();
        if (window.GameSounds) window.GameSounds.playCoin();
        return false;
      }
    }
    return false;
  }

  function checkObstacleHits(containerRect, rocketRect) {
    var now = Date.now();
    if (now < invincibleUntil || now < bubbleUntil) return;

    for (var i = obstaclesEl.children.length - 1; i >= 0; i--) {
      var node = obstaclesEl.children[i];
      if (parseInt(node.dataset.lane, 10) !== rocketLane) continue;
      var itemRect = getItemRect(node, containerRect);
      if (rectsOverlap(rocketRect, itemRect)) {
        node.remove();
        score = Math.max(0, score - CRASH_POINTS_LOST);
        lives--;
        updateUI();
        if (window.GameSounds) window.GameSounds.playCrash();
        invincibleUntil = now + INVINCIBLE_MS;
        rocket.classList.add('hit');
        setTimeout(function () { rocket.classList.remove('hit'); }, 300);
        if (lives <= 0) endGame(false);
        return;
      }
    }
  }

  function checkLaserShipHits(containerRect) {
    if (!playerLasersEl || !enemyShipsEl) return;
    var lasers = Array.from(playerLasersEl.children);
    var ships = Array.from(enemyShipsEl.children);
    for (var i = lasers.length - 1; i >= 0; i--) {
      var laser = lasers[i];
      var lr = laser.getBoundingClientRect();
      var laserRect = {
        left: lr.left - containerRect.left,
        right: lr.right - containerRect.left,
        top: lr.top - containerRect.top,
        bottom: lr.bottom - containerRect.top
      };
      for (var j = ships.length - 1; j >= 0; j--) {
        var ship = ships[j];
        if (parseInt(ship.dataset.lane, 10) !== parseInt(laser.dataset.lane, 10)) continue;
        var shipRect = getItemRect(ship, containerRect);
        if (rectsOverlap(laserRect, shipRect)) {
          laser.remove();
          ship.remove();
          score += SHIP_POINTS;
          updateUI();
          if (window.GameSounds) window.GameSounds.playCoin();
          break;
        }
      }
    }
  }

  /* ─── 9. Level complete & next level ───────────────────────────────────── */
  function getPilotDisplayName() {
    if (!pilotNameEl || !pilotNameEl.textContent) return 'Player';
    var t = pilotNameEl.textContent.trim();
    if (t.indexOf('Pilot:') === 0) return t.replace(/^Pilot:\s*/i, '').trim() || 'Player';
    return t || 'Player';
  }

  function levelCompleteDuelWin() {
    gameRunning = false;
    if (duelAlienShootTimer) clearInterval(duelAlienShootTimer);
    if (duelAlienMoveTimer) clearInterval(duelAlienMoveTimer);
    if (timerInterval) clearInterval(timerInterval);
    duelAlienShootTimer = null;
    duelAlienMoveTimer = null;
    timerInterval = null;
    if (window.GameSounds) {
      window.GameSounds.stopMusic();
      window.GameSounds.playHurray();
    }
    spawnBalloons();
    var name = getPilotDisplayName();
    if (levelCompleteMsg) levelCompleteMsg.textContent = name + ' you are the winner!';
    var h1 = levelCompleteEl ? levelCompleteEl.querySelector('h1') : null;
    if (h1) h1.textContent = 'You won! 🎉';
    if (nextLevelBtn) nextLevelBtn.textContent = 'Play Again';
    level = 4;
    levelCompleteEl.classList.add('visible');
    if (nextLevelBtn) nextLevelBtn.focus();
  }

  function levelComplete() {
    gameRunning = false;
    if (obstacleTimer) clearInterval(obstacleTimer);
    if (starTimer) clearInterval(starTimer);
    if (shipTimer) clearInterval(shipTimer);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    starTimer = null;
    shipTimer = null;
    if (level === 3) {
      if (duelAlienShootTimer) clearInterval(duelAlienShootTimer);
      if (duelAlienMoveTimer) clearInterval(duelAlienMoveTimer);
      duelAlienShootTimer = null;
      duelAlienMoveTimer = null;
    }
    if (window.GameSounds) {
      window.GameSounds.stopMusic();
      window.GameSounds.playHurray();
    }
    spawnBalloons();
    level++;
    if (level === 2) {
      if (levelCompleteMsg) levelCompleteMsg.textContent = 'Level 1 done! You have ' + score + ' points. Next: Level 2 (shoot ships).';
    } else if (level === 3) {
      if (levelCompleteMsg) levelCompleteMsg.textContent = 'Level 2 done! You have ' + score + ' points. Next: Level 3 (moon duel).';
    } else {
      if (levelCompleteMsg) levelCompleteMsg.textContent = 'You won! Total: ' + score + ' points 🌟';
      if (nextLevelBtn) nextLevelBtn.textContent = 'Play Again';
    }
    var h1 = levelCompleteEl ? levelCompleteEl.querySelector('h1') : null;
    if (h1) h1.textContent = 'Level complete! 🎉';
    levelCompleteEl.classList.add('visible');
    if (nextLevelBtn) nextLevelBtn.focus();
  }

  function spawnBalloons() {
    var container = document.getElementById('balloons');
    if (!container) return;
    container.innerHTML = '';
    var colors = ['#ff6b9d', '#ffd93d', '#6bcbff', '#98e698', '#c9a0dc', '#ff9ecd'];
    for (var i = 0; i < 12; i++) {
      var b = document.createElement('div');
      b.className = 'balloon';
      b.style.left = (5 + Math.random() * 90) + '%';
      b.style.animationDelay = (Math.random() * 2) + 's';
      b.style.animationDuration = (3 + Math.random() * 2) + 's';
      b.style.backgroundColor = colors[i % colors.length];
      container.appendChild(b);
    }
  }

  function startNextLevel() {
    if (level > 3) {
      if (nextLevelBtn) nextLevelBtn.textContent = "Next Level";
      startGame();
      return;
    }
    levelCompleteEl.classList.remove('visible');
    var balloonsEl = document.getElementById('balloons');
    if (balloonsEl) balloonsEl.innerHTML = '';
    if (level === 2) {
      if (skyEl) skyEl.classList.add('visible');
      if (duelSceneEl) duelSceneEl.classList.remove('visible');
      collectiblesEl.innerHTML = '';
      obstaclesEl.innerHTML = '';
      if (playerLasersEl) playerLasersEl.innerHTML = '';
      if (enemyShipsEl) enemyShipsEl.innerHTML = '';
      rocket.style.display = '';
      gameTimeLeft = SECONDS_PER_LEVEL;
      musicSpedUp = false;
      if (window.GameSounds && window.GameSounds.setMusicTempo) window.GameSounds.setMusicTempo(450);
      if (gameTimerEl) gameTimerEl.textContent = '0:' + (SECONDS_PER_LEVEL < 10 ? '0' : '') + SECONDS_PER_LEVEL;
      if (timerWrap) { timerWrap.classList.remove('warning'); timerWrap.classList.add('visible'); }
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, TIMER_UPDATE_INTERVAL_MS);
      if (window.GameSounds) window.GameSounds.startMusic();
      updateUI();
      gameRunning = true;
      gamePaused = false;
      shipTimer = setInterval(spawnEnemyShip, getShipSpawnInterval());
    } else if (level === 3) {
      if (skyEl) skyEl.classList.remove('visible');
      if (duelSceneEl) duelSceneEl.classList.add('visible');
      if (gameHard && duelSceneEl) duelSceneEl.classList.add('hard-mode');
      else if (duelSceneEl) duelSceneEl.classList.remove('hard-mode');
      rocket.style.display = 'none';
      if (duelPlayerLasersEl) duelPlayerLasersEl.innerHTML = '';
      if (duelAlienLasersEl) duelAlienLasersEl.innerHTML = '';
      duelPlayerYPercent = 50;
      duelAlienYPercent = 50;
      duelAlien2YPercent = 30;
      alienLives = ALIEN_LIVES;
      alien2Lives = gameHard ? ALIEN_LIVES : 0;
      gameTimeLeft = SECONDS_PER_LEVEL_3;
      musicSpedUp = false;
      if (window.GameSounds && window.GameSounds.setMusicTempo) window.GameSounds.setMusicTempo(450);
      if (gameTimerEl) gameTimerEl.textContent = SECONDS_PER_LEVEL_3 >= 60 ? '1:' + (SECONDS_PER_LEVEL_3 % 60 < 10 ? '0' : '') + (SECONDS_PER_LEVEL_3 % 60) : '0:' + (SECONDS_PER_LEVEL_3 < 10 ? '0' : '') + SECONDS_PER_LEVEL_3;
      if (timerWrap) { timerWrap.classList.remove('warning'); timerWrap.classList.add('visible'); }
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, TIMER_UPDATE_INTERVAL_MS);
      if (window.GameSounds) window.GameSounds.startMusic();
      updateUI();
      gameRunning = true;
      gamePaused = false;
      duelAlienShootTimer = setInterval(duelAlienShoot, DUEL_ALIEN_SHOOT_INTERVAL);
      duelAlienMoveTimer = setInterval(duelAlienMove, DUEL_ALIEN_MOVE_INTERVAL);
    } else {
      if (window.GameSounds) window.GameSounds.startMusic();
      collectiblesEl.innerHTML = '';
      obstaclesEl.innerHTML = '';
      gameTimeLeft = SECONDS_PER_LEVEL;
      musicSpedUp = false;
      if (window.GameSounds && window.GameSounds.setMusicTempo) window.GameSounds.setMusicTempo(450);
      if (gameTimerEl) gameTimerEl.textContent = '0:' + (SECONDS_PER_LEVEL < 10 ? '0' : '') + SECONDS_PER_LEVEL;
      if (timerWrap) { timerWrap.classList.remove('warning'); timerWrap.classList.add('visible'); }
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, TIMER_UPDATE_INTERVAL_MS);
      updateUI();
      gameRunning = true;
      gamePaused = false;
      obstacleTimer = setInterval(spawnObstacle, getObstacleInterval());
      starTimer = setInterval(spawnStar, getStarInterval());
    }
    lastTime = performance.now();
    requestAnimationFrame(gameTick);
  }

  function startLevel3Retry() {
    gameOverAtLevel3 = false;
    gameOverEl.classList.remove('visible');
    level = 3;
    score = savedScoreForLevel3Retry;
    lives = TOTAL_LIVES;
    invincibleUntil = 0;
    turboShotUntil = 0;
    bubbleUntil = 0;
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    if (skyEl) skyEl.classList.remove('visible');
    if (duelSceneEl) duelSceneEl.classList.add('visible');
    if (gameHard && duelSceneEl) duelSceneEl.classList.add('hard-mode');
    else if (duelSceneEl) duelSceneEl.classList.remove('hard-mode');
    rocket.style.display = 'none';
    if (duelPlayerLasersEl) duelPlayerLasersEl.innerHTML = '';
    if (duelAlienLasersEl) duelAlienLasersEl.innerHTML = '';
    duelPlayerYPercent = 50;
    duelAlienYPercent = 50;
    duelAlien2YPercent = 30;
    alienLives = ALIEN_LIVES;
    alien2Lives = gameHard ? ALIEN_LIVES : 0;
    gameTimeLeft = SECONDS_PER_LEVEL_3;
    musicSpedUp = false;
    if (window.GameSounds && window.GameSounds.setMusicTempo) window.GameSounds.setMusicTempo(450);
    if (gameTimerEl) gameTimerEl.textContent = SECONDS_PER_LEVEL_3 >= 60 ? '1:' + (SECONDS_PER_LEVEL_3 % 60 < 10 ? '0' : '') + (SECONDS_PER_LEVEL_3 % 60) : '0:' + (SECONDS_PER_LEVEL_3 < 10 ? '0' : '') + SECONDS_PER_LEVEL_3;
    if (timerWrap) { timerWrap.classList.remove('warning'); timerWrap.classList.add('visible'); }
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, TIMER_UPDATE_INTERVAL_MS);
    if (window.GameSounds) window.GameSounds.startMusic();
    updateUI();
    gameRunning = true;
    gamePaused = false;
    duelAlienShootTimer = setInterval(duelAlienShoot, DUEL_ALIEN_SHOOT_INTERVAL);
    duelAlienMoveTimer = setInterval(duelAlienMove, DUEL_ALIEN_MOVE_INTERVAL);
    lastTime = performance.now();
    requestAnimationFrame(gameTick);
  }

  function duelAlienMove() {
    if (!gameRunning || gamePaused || level !== 3) return;
    var choices = [25, 50, 75];
    duelAlienYPercent = choices[Math.floor(Math.random() * choices.length)];
    if (duelAlienEl) {
      duelAlienEl.style.top = duelAlienYPercent + '%';
      duelAlienEl.style.transform = 'translate(50%, -50%)';
    }
    if (gameHard && duelAlien2El) {
      duelAlien2YPercent = choices[Math.floor(Math.random() * choices.length)];
      duelAlien2El.style.top = duelAlien2YPercent + '%';
      duelAlien2El.style.transform = 'translate(50%, -50%)';
    }
  }

  function duelAlienShoot() {
    if (!gameRunning || gamePaused || level !== 3 || !duelAlienLasersEl || !getContainer()) return;
    var container = getContainer();
    var cr = container.getBoundingClientRect();
    var alienEl = duelAlienEl.getBoundingClientRect();
    var laser = document.createElement('div');
    laser.className = 'duel-laser-alien';
    laser.style.left = (alienEl.left - cr.left - 30) + 'px';
    laser.style.top = (alienEl.top - cr.top + alienEl.height / 2 - 3) + 'px';
    laser.dataset.dx = -DUEL_LASER_SPEED;
    duelAlienLasersEl.appendChild(laser);
    if (gameHard && duelAlien2El) {
      var alien2El = duelAlien2El.getBoundingClientRect();
      var laser2 = document.createElement('div');
      laser2.className = 'duel-laser-alien';
      laser2.style.left = (alien2El.left - cr.left - 30) + 'px';
      laser2.style.top = (alien2El.top - cr.top + alien2El.height / 2 - 3) + 'px';
      laser2.dataset.dx = -DUEL_LASER_SPEED;
      duelAlienLasersEl.appendChild(laser2);
    }
  }

  function duelPlayerShoot() {
    if (level !== 3 || !duelPlayerLasersEl || !duelPlayerEl) return;
    var container = getContainer();
    var cr = container.getBoundingClientRect();
    var playerEl = duelPlayerEl.getBoundingClientRect();
    var baseLeft = playerEl.right - cr.left + 10;
    var baseTop = playerEl.top - cr.top + playerEl.height / 2 - 3;
    var turbo = isTurboActive();
    var angles = turbo ? [0, -22.5, 22.5] : [0];
    for (var i = 0; i < angles.length; i++) {
      var angleDeg = angles[i];
      var rad = (angleDeg * Math.PI) / 180;
      var dx = DUEL_LASER_SPEED * Math.cos(rad);
      var dy = angleDeg === 0 ? 0 : DUEL_LASER_SPEED * Math.sin(rad) * 0.4;
      var laser = document.createElement('div');
      laser.className = 'duel-laser-player';
      laser.style.left = baseLeft + 'px';
      laser.style.top = baseTop + 'px';
      laser.dataset.dx = String(dx);
      laser.dataset.dy = String(-dy);
      duelPlayerLasersEl.appendChild(laser);
    }
    if (window.GameSounds) window.GameSounds.playLaser();
  }

  function updateDuelLasers(dt) {
    var container = getContainer();
    if (!container) return;
    var cr = container.getBoundingClientRect();
    var width = cr.width;

    Array.from(duelPlayerLasersEl.children).forEach(function (node) {
      var left = parseFloat(node.style.left) || 0;
      var top = parseFloat(node.style.top) || 0;
      var dx = parseFloat(node.dataset.dx) || DUEL_LASER_SPEED;
      var dy = parseFloat(node.dataset.dy) || 0;
      node.style.left = (left + dx * (dt / 16)) + 'px';
      node.style.top = (top + dy * (dt / 16)) + 'px';
      if (left > width + 50) node.remove();
    });

    Array.from(duelAlienLasersEl.children).forEach(function (node) {
      var left = parseFloat(node.style.left) || width;
      var dx = parseFloat(node.dataset.dx) || -DUEL_LASER_SPEED;
      node.style.left = (left + dx * (dt / 16)) + 'px';
      if (parseFloat(node.style.left) < -50) node.remove();
    });
  }

  function checkDuelHits(containerRect) {
    var playerRect = duelPlayerEl.getBoundingClientRect();
    var pr = {
      left: playerRect.left - containerRect.left,
      right: playerRect.right - containerRect.left,
      top: playerRect.top - containerRect.top,
      bottom: playerRect.bottom - containerRect.top
    };
    var alienRect = duelAlienEl.getBoundingClientRect();
    var ar = {
      left: alienRect.left - containerRect.left,
      right: alienRect.right - containerRect.left,
      top: alienRect.top - containerRect.top,
      bottom: alienRect.bottom - containerRect.top
    };
    var ar2 = null;
    if (gameHard && duelAlien2El) {
      var alien2Rect = duelAlien2El.getBoundingClientRect();
      ar2 = {
        left: alien2Rect.left - containerRect.left,
        right: alien2Rect.right - containerRect.left,
        top: alien2Rect.top - containerRect.top,
        bottom: alien2Rect.bottom - containerRect.top
      };
    }

    for (var i = duelPlayerLasersEl.children.length - 1; i >= 0; i--) {
      var node = duelPlayerLasersEl.children[i];
      var lr = node.getBoundingClientRect();
      var lrect = { left: lr.left - containerRect.left, right: lr.right - containerRect.left, top: lr.top - containerRect.top, bottom: lr.bottom - containerRect.top };
      if (rectsOverlap(lrect, ar)) {
        node.remove();
        score += ALIEN_HIT_POINTS;
        alienLives--;
        updateUI();
        if (window.GameSounds) window.GameSounds.playCrash();
        if (alienLives <= 0 && (!gameHard || alien2Lives <= 0)) {
          levelCompleteDuelWin();
          return;
        }
        continue;
      }
      if (ar2 && rectsOverlap(lrect, ar2)) {
        node.remove();
        score += ALIEN_HIT_POINTS;
        alien2Lives--;
        updateUI();
        if (window.GameSounds) window.GameSounds.playCrash();
        if (alienLives <= 0 && alien2Lives <= 0) {
          levelCompleteDuelWin();
          return;
        }
      }
    }

    var now = Date.now();
    if (now < invincibleUntil || now < bubbleUntil) return;
    for (var i = duelAlienLasersEl.children.length - 1; i >= 0; i--) {
      var node = duelAlienLasersEl.children[i];
      var lr = node.getBoundingClientRect();
      var lrect = { left: lr.left - containerRect.left, right: lr.right - containerRect.left, top: lr.top - containerRect.top, bottom: lr.bottom - containerRect.top };
      if (rectsOverlap(lrect, pr)) {
        node.remove();
        lives--;
        updateUI();
        if (window.GameSounds) window.GameSounds.playCrash();
        invincibleUntil = now + INVINCIBLE_MS;
        if (lives <= 0) endGame(false);
        return;
      }
    }
  }

  /* ─── 10. Game loop ─────────────────────────────────────────────────────── */
  function gameTick(timestamp) {
    if (!gameRunning) return;
    if (gamePaused) {
      requestAnimationFrame(gameTick);
      return;
    }
    var dt = Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;

    if (level === 3) {
      if (keys.ArrowUp) duelPlayerYPercent = Math.max(20, duelPlayerYPercent - 2);
      if (keys.ArrowDown) duelPlayerYPercent = Math.min(80, duelPlayerYPercent + 2);
      if (duelPlayerEl) {
        duelPlayerEl.style.top = duelPlayerYPercent + '%';
        duelPlayerEl.style.transform = 'translate(-50%, -50%)';
      }
      updateDuelLasers(dt);
      var containerRect = getContainer().getBoundingClientRect();
      checkDuelHits(containerRect);
      if (!gameRunning) return;
      requestAnimationFrame(gameTick);
      return;
    }

    if (keys.ArrowUp) rocketLane = 0;
    if (keys.ArrowDown) rocketLane = 1;
    setRocketPosition();

    var progress = 1 - (gameTimeLeft / getSecondsPerLevel());
    scrollSpeed = SCROLL_SPEED_BASE * getSpeedMultiplierByProgress(progress);
    moveAll(dt);

    if (level === 2) {
      var containerRect = getContainer().getBoundingClientRect();
      checkLaserShipHits(containerRect);
    } else {
      var containerRect = getContainer().getBoundingClientRect();
      var rocketRect = getRocketRect(containerRect);
      if (checkCollectStars(containerRect, rocketRect)) return;
      checkObstacleHits(containerRect, rocketRect);
    }
    if (!gameRunning) return;

    requestAnimationFrame(gameTick);
  }

  /* ─── 11. Start / end / exit ──────────────────────────────────────────── */
  function endGame(won) {
    gameRunning = false;
    if (obstacleTimer) clearInterval(obstacleTimer);
    if (starTimer) clearInterval(starTimer);
    if (shipTimer) clearInterval(shipTimer);
    if (duelAlienShootTimer) clearInterval(duelAlienShootTimer);
    if (duelAlienMoveTimer) clearInterval(duelAlienMoveTimer);
    obstacleTimer = null;
    starTimer = null;
    shipTimer = null;
    duelAlienShootTimer = null;
    duelAlienMoveTimer = null;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    if (window.GameSounds) window.GameSounds.stopMusic();
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    if (level === 3) {
      gameOverAtLevel3 = true;
      savedScoreForLevel3Retry = Math.max(0, score - LEVEL3_RESTART_POINTS_PENALTY);
    } else {
      gameOverAtLevel3 = false;
    }
    gameOverEl.classList.add('visible');
    finalScoreEl.textContent = level === 3
      ? ('Level 3 – Try again? ' + LEVEL3_RESTART_POINTS_PENALTY + ' pts deducted. New score: ' + savedScoreForLevel3Retry)
      : ('You reached Level ' + level + ' with ' + score + ' points!');
    if (document.getElementById('pause-btn-wrap')) document.getElementById('pause-btn-wrap').classList.remove('visible');
    if (exitBtnWrap) exitBtnWrap.classList.remove('visible');
    if (timerWrap) timerWrap.classList.remove('visible', 'warning');
  }

  function exitGame() {
    var modal = document.getElementById('exit-confirm-modal');
    if (modal) {
      modal.classList.add('visible');
      modal.setAttribute('aria-hidden', 'false');
      var yesBtn = document.getElementById('exit-confirm-yes');
      if (yesBtn) yesBtn.focus();
    }
  }

  function closeExitModal() {
    var modal = document.getElementById('exit-confirm-modal');
    if (modal) {
      modal.classList.remove('visible');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function doExitGame() {
    closeExitModal();
    gameRunning = false;
    if (obstacleTimer) clearInterval(obstacleTimer);
    if (starTimer) clearInterval(starTimer);
    if (shipTimer) clearInterval(shipTimer);
    if (duelAlienShootTimer) clearInterval(duelAlienShootTimer);
    if (duelAlienMoveTimer) clearInterval(duelAlienMoveTimer);
    if (timerInterval) clearInterval(timerInterval);
    obstacleTimer = null;
    starTimer = null;
    shipTimer = null;
    duelAlienShootTimer = null;
    duelAlienMoveTimer = null;
    timerInterval = null;
    if (window.GameSounds) window.GameSounds.stopMusic();
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    instructions.classList.remove('hidden');
    scoreEl.classList.remove('visible');
    if (livesEl) livesEl.classList.remove('visible');
    if (document.getElementById('level-row')) document.getElementById('level-row').classList.remove('visible');
    if (document.getElementById('lives-row')) document.getElementById('lives-row').classList.remove('visible');
    if (controlsHint) controlsHint.classList.remove('visible');
    if (document.getElementById('pause-btn-wrap')) document.getElementById('pause-btn-wrap').classList.remove('visible');
    if (exitBtnWrap) exitBtnWrap.classList.remove('visible');
    if (timerWrap) timerWrap.classList.remove('visible', 'warning');
    gameOverEl.classList.remove('visible');
    levelCompleteEl.classList.remove('visible');
    if (pauseOverlay) pauseOverlay.classList.remove('visible');
  }

  function startGame() {
    closeExitModal();
    gameOverAtLevel3 = false;
    var rocketName = (rocketNameInput && rocketNameInput.value) ? rocketNameInput.value.trim() : '';
    if (!rocketName) rocketName = 'Rocket';
    if (pilotNameEl) pilotNameEl.textContent = 'Pilot: ' + rocketName;
    if (scoreWrap) scoreWrap.classList.add('visible');

    level = 1;
    score = STARTING_POINTS;
    lives = TOTAL_LIVES;
    rocketLane = 1;
    invincibleUntil = 0;
    turboShotUntil = 0;
    bubbleUntil = 0;
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    gameTimeLeft = SECONDS_PER_LEVEL;
    gameHard = diffHardBtn && diffHardBtn.classList.contains('chosen');
    musicSpedUp = false;

    if (skyEl) skyEl.classList.add('visible');
    if (duelSceneEl) duelSceneEl.classList.remove('visible');
    rocket.style.display = '';
    collectiblesEl.innerHTML = '';
    obstaclesEl.innerHTML = '';
    if (playerLasersEl) playerLasersEl.innerHTML = '';
    if (enemyShipsEl) enemyShipsEl.innerHTML = '';
    if (duelPlayerLasersEl) duelPlayerLasersEl.innerHTML = '';
    if (duelAlienLasersEl) duelAlienLasersEl.innerHTML = '';

    if (window.GameSounds) {
      window.GameSounds.init();
      window.GameSounds.startMusic();
    }
    instructions.classList.add('hidden');
    scoreEl.classList.add('visible');
    if (livesEl) livesEl.classList.add('visible');
    if (document.getElementById('level-row')) document.getElementById('level-row').classList.add('visible');
    if (document.getElementById('lives-row')) document.getElementById('lives-row').classList.add('visible');
    if (document.getElementById('pause-btn-wrap')) document.getElementById('pause-btn-wrap').classList.add('visible');
    gameOverEl.classList.remove('visible');
    levelCompleteEl.classList.remove('visible');
    if (pauseOverlay) pauseOverlay.classList.remove('visible');
    moon.classList.remove('visible');
    if (nextLevelBtn) nextLevelBtn.textContent = 'Next Level';
    if (exitBtnWrap) exitBtnWrap.classList.add('visible');
    if (timerWrap) {
      timerWrap.classList.add('visible');
      timerWrap.classList.remove('warning');
      if (gameTimerEl) gameTimerEl.textContent = '0:' + (SECONDS_PER_LEVEL < 10 ? '0' : '') + SECONDS_PER_LEVEL;
      timerInterval = setInterval(updateTimer, TIMER_UPDATE_INTERVAL_MS);
    }

    setRocketPosition();
    updateUI();
    gameRunning = true;
    gamePaused = false;
    obstacleTimer = setInterval(spawnObstacle, getObstacleInterval());
    starTimer = setInterval(spawnStar, getStarInterval());
    lastTime = performance.now();
    requestAnimationFrame(gameTick);
  }

  /* ─── 12. Input ────────────────────────────────────────────────────────── */
  function onKeyDown(e) {
    if (e.key === 'ArrowUp') { e.preventDefault(); keys.ArrowUp = true; }
    if (e.key === 'ArrowDown') { e.preventDefault(); keys.ArrowDown = true; }
    if (e.key === ' ') {
      e.preventDefault();
      if (gameRunning && !levelCompleteEl.classList.contains('visible') && !gameOverEl.classList.contains('visible')) {
        togglePause();
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!instructions.classList.contains('hidden')) {
        startGame();
        return;
      }
      if (!gameRunning || gamePaused) return;
      if (level === 2) firePlayerLaser();
      if (level === 3) duelPlayerShoot();
    }
    if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      if (gameRunning && !gamePaused && score >= COST_EXTRA_LIFE) {
        score -= COST_EXTRA_LIFE;
        lives += 1;
        updateUI();
        if (window.GameSounds) window.GameSounds.playCoin();
      }
    }
    if (e.key === 'Shift') {
      e.preventDefault();
      if (gameRunning && !gamePaused && score >= COST_TURBO_SHOT && !isTurboActive()) {
        score -= COST_TURBO_SHOT;
        turboShotUntil = Date.now() + TURBO_SHOT_DURATION_MS;
        updateUI();
        if (window.GameSounds) window.GameSounds.playCoin();
      }
    }
    if (e.key === 'b' || e.key === 'B') {
      e.preventDefault();
      if (gameRunning && !gamePaused && Date.now() >= bubbleUntil) {
        bubbleUntil = Date.now() + BUBBLE_DURATION_MS;
        updateUI();
        if (window.GameSounds) window.GameSounds.playCoin();
      }
    }
  }

  function onKeyUp(e) {
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
  }

  /* ─── 13. Event binding ────────────────────────────────────────────────── */
  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', function () {
    if (gameOverAtLevel3) startLevel3Retry();
    else startGame();
  });
  nextLevelBtn.addEventListener('click', startNextLevel);
  if (diffEasyBtn) {
    diffEasyBtn.addEventListener('click', function () {
      diffEasyBtn.classList.add('chosen');
      if (diffHardBtn) diffHardBtn.classList.remove('chosen');
    });
  }
  if (diffHardBtn) {
    diffHardBtn.addEventListener('click', function () {
      diffHardBtn.classList.add('chosen');
      if (diffEasyBtn) diffEasyBtn.classList.remove('chosen');
    });
  }
  if (pauseBtn) pauseBtn.addEventListener('click', function () {
    if (gameRunning) togglePause();
  });
  if (resumeBtn) resumeBtn.addEventListener('click', resume);
  if (exitBtn) exitBtn.addEventListener('click', function () {
    if (gameRunning || levelCompleteEl.classList.contains('visible') || gameOverEl.classList.contains('visible')) {
      exitGame();
    }
  });
  var exitConfirmYes = document.getElementById('exit-confirm-yes');
  var exitConfirmNo = document.getElementById('exit-confirm-no');
  if (exitConfirmYes) exitConfirmYes.addEventListener('click', doExitGame);
  if (exitConfirmNo) exitConfirmNo.addEventListener('click', closeExitModal);

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
})();
