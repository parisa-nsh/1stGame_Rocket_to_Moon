/**
 * Game configuration – single source of truth for game balance and behaviour.
 * Change values here to tune difficulty, timing, and level goals without touching game logic.
 */
window.GameConfig = {
  /* ─── Level & scoring ─────────────────────────────────────────────────── */
  STARTING_POINTS: 100,
  STAR_POINTS: 10,
  CRASH_POINTS_LOST: 10,
  SHIP_POINTS: 20,
  TOTAL_LIVES: 5,

  /* ─── Spending points (H = extra life, Shift = turbo shot) ───────────────── */
  COST_EXTRA_LIFE: 25,
  COST_TURBO_SHOT: 25,
  TURBO_SHOT_DURATION_MS: 10000,
  TURBO_LASERS_DURATION_MS: 5000,
  FREEZE_DURATION_MS: 5000,
  TURBO_HOLD_THRESHOLD_MS: 400,
  TURBO_SHOT_ANGLE_DEG: 45,

  /* ─── Level 1 (fly & collect) ─────────────────────────────────────────── */
  LANE_COUNT: 2,
  LANE_Y_PERCENTS: [25, 75],
  ROCKET_X_PERCENT: 14,
  SCROLL_SPEED_BASE: 2.45,
  SPEED_PHASES: { first: 0.7, second: 0.8, third: 1.0 },
  SPAWN_OBSTACLE_MIN_MS: 900,
  SPAWN_OBSTACLE_MAX_MS: 1500,
  SPAWN_STAR_MIN_MS: 1100,
  SPAWN_STAR_MAX_MS: 1300,

  /* ─── Level 2 (shoot ships) ───────────────────────────────────────────── */
  SPAWN_SHIP_MIN_MS: 1000,
  SPAWN_SHIP_MAX_MS: 1400,
  LASER_SPEED: 12,

  /* ─── Level 3 (duel) ───────────────────────────────────────────────────── */
  DUEL_LASER_SPEED: 14,
  DUEL_ALIEN_LASER_SPEED: 17,
  DUEL_ALIEN_SHOOT_INTERVAL_MS: 950,
  DUEL_ALIEN_MOVE_INTERVAL_MS: 450,
  DUEL_PLAYER_SPEED: 2,
  DUEL_PLAYER_Y_MIN: 20,
  DUEL_PLAYER_Y_MAX: 80,
  ALIEN_LIVES: 8,
  ALIEN_HIT_POINTS: 50,

  /* ─── Collision & invincibility ───────────────────────────────────────── */
  COLLISION_MARGIN: 28,
  INVINCIBLE_MS: 1500,

  /* ─── Timed mode: 30 sec level 1–2, 90 sec level 3 ─────────────────────── */
  SECONDS_PER_LEVEL: 30,
  SECONDS_PER_LEVEL_3: 90,
  TIMER_UPDATE_INTERVAL_MS: 100,
  TIMER_WARNING_AT_SECONDS: 10,

  /* ─── Level 3: restart from level 3 on game over (points deducted) ─────── */
  LEVEL3_RESTART_POINTS_PENALTY: 50,

  /* ─── Bubble shield (footer button / B key): bullet-proof 10 sec ────────── */
  BUBBLE_DURATION_MS: 10000,

  /* ─── Difficulty: Hard mode ────────────────────────────────────────────── */
  HARD_SPEED_MULTIPLIER: 1.15,
  HARD_DUEL_ALIEN_COUNT: 2
};
