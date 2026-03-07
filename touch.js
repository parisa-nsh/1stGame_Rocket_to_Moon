/**
 * Touch controls for mobile / iOS: simulates keyboard so game.js works unchanged.
 */
(function () {
  'use strict';
  var controls = document.getElementById('touch-controls');
  if (!controls) return;
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  function dispatchKey(key, type) {
    document.dispatchEvent(new KeyboardEvent(type, { key: key, bubbles: true, cancelable: true }));
  }
  function setupButton(id, keyDown, keyUp) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', function (e) { e.preventDefault(); dispatchKey(keyDown, 'keydown'); }, { passive: false });
    btn.addEventListener('touchend', function (e) { e.preventDefault(); if (keyUp) dispatchKey(keyUp, 'keyup'); }, { passive: false });
    btn.addEventListener('touchcancel', function (e) { e.preventDefault(); if (keyUp) dispatchKey(keyUp, 'keyup'); }, { passive: false });
    btn.addEventListener('mousedown', function (e) { e.preventDefault(); dispatchKey(keyDown, 'keydown'); });
    btn.addEventListener('mouseup', function (e) { e.preventDefault(); if (keyUp) dispatchKey(keyUp, 'keyup'); });
    btn.addEventListener('mouseleave', function (e) { if (keyUp) dispatchKey(keyUp, 'keyup'); });
  }
  if (isTouchDevice()) {
    controls.classList.add('visible');
    setupButton('touch-up', 'ArrowUp', 'ArrowUp');
    setupButton('touch-down', 'ArrowDown', 'ArrowDown');
    setupButton('touch-shoot', 'Enter', 'Enter');
    setupButton('touch-life', 'H', null);
    setupButton('touch-bubble', 'b', null);
    (function () {
      var turboBtn = document.getElementById('touch-turbo');
      if (!turboBtn || typeof window.GameActivateTurbo !== 'function') return;
      var turboPressTime = 0;
      function onTurboEnd(isHold) {
        if (turboPressTime > 0) {
          window.GameActivateTurbo(isHold);
          turboPressTime = 0;
        }
      }
      turboBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        turboPressTime = Date.now();
      }, { passive: false });
      turboBtn.addEventListener('touchend', function (e) {
        e.preventDefault();
        var duration = turboPressTime > 0 ? Date.now() - turboPressTime : 0;
        var threshold = (window.GameConfig && window.GameConfig.TURBO_HOLD_THRESHOLD_MS) || 400;
        onTurboEnd(duration >= threshold);
      }, { passive: false });
      turboBtn.addEventListener('touchcancel', function (e) {
        e.preventDefault();
        var duration = turboPressTime > 0 ? Date.now() - turboPressTime : 0;
        var threshold = (window.GameConfig && window.GameConfig.TURBO_HOLD_THRESHOLD_MS) || 400;
        onTurboEnd(duration >= threshold);
      }, { passive: false });
      turboBtn.addEventListener('mousedown', function (e) {
        e.preventDefault();
        turboPressTime = Date.now();
      });
      turboBtn.addEventListener('mouseup', function (e) {
        e.preventDefault();
        var duration = turboPressTime > 0 ? Date.now() - turboPressTime : 0;
        var threshold = (window.GameConfig && window.GameConfig.TURBO_HOLD_THRESHOLD_MS) || 400;
        onTurboEnd(duration >= threshold);
      });
      turboBtn.addEventListener('mouseleave', function () {
        if (turboPressTime > 0) {
          var duration = Date.now() - turboPressTime;
          var threshold = (window.GameConfig && window.GameConfig.TURBO_HOLD_THRESHOLD_MS) || 400;
          onTurboEnd(duration >= threshold);
        }
      });
    })();
  }
})();
