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
    setupButton('touch-turbo', 'Shift', null);
    setupButton('touch-pause', ' ', null);
  }
})();
