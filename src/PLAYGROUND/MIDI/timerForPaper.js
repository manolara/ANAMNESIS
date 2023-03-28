var lastTick = 0;
var ppq = 48;
var bpm = 100;
var interval = 60000 / (bpm * ppq);
function tick() {
  let currentTick = performance.now();
  if (lastTick === 0) {
    lastTick = currentTick;
  }
  postMessage({});
  timeout = tickRate;
  var offset = currentTick - lastTick - tickRate;
  timeout = timeout - offset;
  setTimeout(tick, timeout);

  lastTick = currentTick;
}
tick();
