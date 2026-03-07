/**
 * sounds.js – Sound effects and background music via Web Audio API (no external files).
 * Public API: window.GameSounds.init(), playCoin(), playLaser(), playCrash(), playHurray(), startMusic(), stopMusic().
 */
window.GameSounds = (function () {
  'use strict';
  var ctx = null;
  var musicGain = null;
  var musicInterval = null;
  var musicTempoMs = 450;

  /* ─── Context & init ───────────────────────────────────────────────────── */
  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      musicGain = ctx.createGain();
      musicGain.connect(ctx.destination);
      musicGain.gain.value = 0.25;
    }
    return ctx;
  }

  function init() {
    try {
      var c = getCtx();
      if (c.state === 'suspended') c.resume();
    } catch (e) {}
  }

  /* ─── SFX ───────────────────────────────────────────────────────────────── */
  function playCoin() {
    try {
      var c = getCtx();
      var o = c.createOscillator();
      var g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.frequency.value = 880;
      o.type = 'sine';
      g.gain.setValueAtTime(0.3, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.15);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.15);
    } catch (e) {}
  }

  function playLaser() {
    try {
      var c = getCtx();
      var o = c.createOscillator();
      var g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.frequency.value = 440;
      o.type = 'square';
      g.gain.setValueAtTime(0.15, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.08);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.08);
    } catch (e) {}
  }

  function playCrash() {
    try {
      var c = getCtx();
      var o = c.createOscillator();
      var g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.frequency.value = 120;
      o.type = 'sawtooth';
      g.gain.setValueAtTime(0.25, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.4);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.4);
    } catch (e) {}
  }

  function playTick() {
    try {
      var c = getCtx();
      var o = c.createOscillator();
      var g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.frequency.value = 660;
      o.type = 'sine';
      g.gain.setValueAtTime(0.2, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.06);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.06);
    } catch (e) {}
  }

  function playHurray() {
    try {
      var c = getCtx();
      var notes = [
        { f: 523.25, d: 0.18 },
        { f: 659.25, d: 0.18 },
        { f: 783.99, d: 0.18 },
        { f: 1046.50, d: 0.45 }
      ];
      var t = c.currentTime;
      notes.forEach(function (n) {
        var o = c.createOscillator();
        var g = c.createGain();
        o.connect(g);
        g.connect(c.destination);
        o.frequency.value = n.f;
        o.type = 'sine';
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + n.d);
        o.start(t);
        o.stop(t + n.d);
        t += n.d + 0.02;
      });
      /* Celebration sparkle: high chimes after the fanfare */
      t = c.currentTime + 0.95;
      [1318.51, 1567.98, 2093.00].forEach(function (freq, i) {
        var o = c.createOscillator();
        var g = c.createGain();
        o.connect(g);
        g.connect(c.destination);
        o.frequency.value = freq;
        o.type = 'sine';
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        o.start(t);
        o.stop(t + 0.2);
        t += 0.12;
      });
    } catch (e) {}
  }

  /* ─── Music ─────────────────────────────────────────────────────────────── */
  function startMusic() {
    stopMusic();
    try {
      var c = getCtx();
      var melody = [262, 294, 330, 349, 392, 440, 494, 523];
      var step = 0;
      var tempo = musicTempoMs;
      musicInterval = setInterval(function () {
        var o = c.createOscillator();
        var g = c.createGain();
        o.connect(g);
        g.connect(musicGain);
        o.frequency.value = melody[step % melody.length];
        o.type = 'sine';
        g.gain.setValueAtTime(0.12, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.35);
        o.start(c.currentTime);
        o.stop(c.currentTime + 0.35);
        step++;
      }, tempo);
    } catch (e) {}
  }

  function setMusicTempo(intervalMs) {
    musicTempoMs = intervalMs;
  }

  function stopMusic() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  /* ─── Public API ───────────────────────────────────────────────────────── */
  return {
    init: init,
    playCoin: playCoin,
    playLaser: playLaser,
    playCrash: playCrash,
    playTick: playTick,
    playHurray: playHurray,
    startMusic: startMusic,
    stopMusic: stopMusic,
    setMusicTempo: setMusicTempo
  };
})();
